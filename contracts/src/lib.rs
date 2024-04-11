use strum_macros::EnumIter;

mod storage_keys;
pub mod access_control;
pub mod dao;
pub mod community;
pub mod post;
pub mod migrations;
pub mod str_serializers;
mod user;
mod notify;
mod social_db;
mod event;

use std::collections::{HashMap, HashSet};
use storage_keys::*;
use post::*;

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::{near_bindgen, AccountId, PanicOnDefault, env, NearToken};
use serde_json::{json, Value};
use crate::access_control::AccessPermissionType;
use crate::access_control::owners::VersionedAccessMetadata;
use crate::community::{Community, VersionedCommunity};
use crate::dao::{DAO, DAOType, VersionedDAO};
use crate::post::comment::{Comment, CommentSnapshot, VersionedComment};
use crate::post::proposal::ProposalStates;
use crate::social_db::social_db_contract;
use crate::user::{FollowType};
use strum::IntoEnumIterator;
use crate::event::{Event, EventStatus};

type DaoId = u64;
type PostId = u64;
type CommentId = u64;
type CommunityId = u64;
type EventId = u64;
type PostLabel = String;
type Vertical = String;
type MetricLabel = String;
pub type Balance = u128;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[borsh(crate = "near_sdk::borsh")]
pub struct Contract {
    pub total_posts: u64,
    pub total_comments: u64,
    pub total_communities: u64,
    pub total_events: u64,

    pub dao: UnorderedMap<DaoId, VersionedDAO>,
    pub dao_posts: LookupMap<DaoId, Vec<PostId>>,
    pub dao_communities: LookupMap<DaoId, Vec<CommunityId>>,
    pub dao_events: LookupMap<DaoId, Vec<EventId>>,

    pub posts: LookupMap<PostId, VersionedPost>,
    pub comments: LookupMap<CommentId, VersionedComment>,
    pub communities: LookupMap<CommunityId, VersionedCommunity>,
    pub community_handles: LookupMap<String, CommunityId>,
    pub events: LookupMap<EventId, Event>,

    pub label_to_posts: UnorderedMap<PostLabel, Vec<PostId>>,
    pub vertical_posts: UnorderedMap<Vertical, Vec<PostId>>,
    pub community_posts: LookupMap<CommunityId, Vec<PostId>>,

    pub post_status: LookupMap<PostStatus, Vec<PostId>>,
    pub post_authors: LookupMap<AccountId, Vec<PostId>>,
    pub comment_authors: LookupMap<AccountId, Vec<CommentId>>,
    pub user_follow: LookupMap<(FollowType, AccountId), Vec<u64>>,
    pub owner_access: LookupMap<AccountId, Vec<VersionedAccessMetadata>>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        migrations::state_version_write(&migrations::StateVersion::V1);

        let contract = Self {
            total_posts: 0,
            total_comments: 0,
            total_communities: 0,
            total_events: 0,

            dao: UnorderedMap::new(StorageKey::DAO),
            dao_posts: LookupMap::new(StorageKey::DaoPosts),
            dao_communities: LookupMap::new(StorageKey::DaoCommunities),
            dao_events: LookupMap::new(StorageKey::DaoEvents),

            posts: LookupMap::new(StorageKey::Posts),
            comments: LookupMap::new(StorageKey::Comments),
            communities: LookupMap::new(StorageKey::Communities),
            community_handles: LookupMap::new(StorageKey::CommunityHandles),
            events: LookupMap::new(StorageKey::Events),

            label_to_posts: UnorderedMap::new(StorageKey::LabelToPosts),
            vertical_posts: UnorderedMap::new(StorageKey::VerticalPosts),
            community_posts: LookupMap::new(StorageKey::CommunityPosts),

            post_status: LookupMap::new(StorageKey::PostStatus),
            post_authors: LookupMap::new(StorageKey::PostAuthors),
            comment_authors: LookupMap::new(StorageKey::CommentAuthors),
            user_follow: LookupMap::new(StorageKey::UserFollow),
            owner_access: LookupMap::new(StorageKey::OwnerAccess),
        };

        // Add initial storage deposit
        social_db_contract()
            .with_static_gas(env::prepaid_gas().saturating_div(4))
            .with_attached_deposit(NearToken::from_millinear(50).into())
            .set(json!({
                env::current_account_id() : {
                    "index": {}
                }
            }));

        contract
    }
}

// Getters - All smart-contract view functions
#[near_bindgen]
impl Contract {

    // DAO: Get DAO by ID
    pub fn get_dao_by_id(&self, id: &DaoId) -> VersionedDAO {
        self.dao.get(id).unwrap_or_else(|| panic!("DAO #{} not found", id))
    }

    // DAO: Get DAO by handle
    pub fn get_dao_by_handle(&self, handle: &String) -> VersionedDAO {
        let dao = self.dao.values().find(|dao| dao.clone().latest_version().handle == *handle);
        dao.unwrap_or_else(|| panic!("DAO with handle {} not found", handle))
    }

    // DAO: Get all DAOs
    pub fn get_dao_list(&self, dao_type: Option<DAOType>) -> Vec<VersionedDAO> {
        if dao_type.is_some() {
            let dao_type = dao_type.unwrap();
            self.dao.values().filter(|dao| dao.clone().latest_version().dao_type == dao_type).collect()
        } else {
            self.dao.values().collect()
        }
    }

    // Post: Get all posts from all DAOs except InReview status
    pub fn get_all_posts(&self, page:u64, limit:u64) -> Vec<VersionedPost> {
        let all_post_ids: HashSet<PostId> = (1..=self.total_posts).collect();
        let in_review_post_ids: HashSet<PostId> = self.post_status
            .get(&PostStatus::InReview)
            .unwrap_or_default()
            .iter()
            .cloned().collect();

        let available_post_ids: Vec<PostId> = all_post_ids
            .difference(&in_review_post_ids)
            .cloned()
            .collect();

        let total_available_posts = available_post_ids.len();
        let page = page.max(1);
        let start = ((page - 1) * limit) as usize;
        let end = std::cmp::min(start + limit as usize, total_available_posts);

        if start >= total_available_posts {
            return Vec::new();
        }

        available_post_ids[start..end]
            .iter()
            .filter_map(|post_id| self.posts.get(post_id))
            .collect()
    }

    // Posts: Get Proposals/Reports by ID
    pub fn get_post_by_id(&self, id: &PostId) -> VersionedPost {
        self.posts.get(id).unwrap_or_else(|| panic!("Post id {} not found", id))
    }

    // Posts: Get all statuses and proposal states
    pub fn get_all_statuses(&self) -> (Vec<String>, Vec<String>) {
        // Get all PostStatus variants
        let post_statuses: Vec<String> = PostStatus::iter().map(|status| format!("{:?}", status)).collect();

        // Serialize ProposalStates to get field names
        let default_proposal_states = ProposalStates::default();
        let serialized = serde_json::to_value(default_proposal_states).unwrap();
        let proposal_states = if let Value::Object(map) = serialized {
            map.into_iter().map(|(key, _)| key).collect::<Vec<String>>()
        } else {
            Vec::new()
        };

        (post_statuses, proposal_states)
    }

    // Posts: Get all Proposals/Reports except "in_review" for DAO
    pub fn get_dao_posts(&self, dao_id: DaoId, status: Option<PostStatus>, page: u64, limit: u64) -> Vec<VersionedPost> {
        let all_posts = self.dao_posts.get(&dao_id).unwrap_or_default();

        let filtered_posts: Vec<_> = all_posts
            .iter()
            .map(|post_id| self.get_post_by_id(post_id))
            .filter(|versioned_post| {
                let post: Post = (*versioned_post).clone().into();
                if let Some(s) = status.clone() {
                    post.snapshot.status == s
                } else {
                    post.snapshot.status != PostStatus::InReview
                }
            })
            .collect();

        let total_posts = filtered_posts.len();
        let page = page.max(1);
        let start = ((page - 1) * limit) as usize;
        let end = std::cmp::min(start + limit as usize, total_posts);

        if start >= total_posts {
            Vec::new()
        } else {
            filtered_posts[start..end].to_vec()
        }
    }

    // Posts: Get Proposals/Reports by Author
    pub fn get_posts_by_author(&self, author: AccountId, page: u64, limit: u64) -> Vec<VersionedPost> {
        let posts = self.post_authors.get(&author).unwrap_or_default();

        // Total number of posts by the author
        let total_posts = posts.len();

        // Calculate start and end indices for pagination
        let page = page.max(1);
        let start = ((page - 1) * limit) as usize;
        let end = std::cmp::min(start + limit as usize, total_posts);

        // Check if the start index is within the bounds of available posts
        if start >= total_posts {
            Vec::new()
        } else {
            posts[start..end]
                .iter()
                .map(|post_id| self.get_post_by_id(post_id))
                .collect()
        }
    }

    // Posts: Get Proposals/Reports history
    pub fn get_post_history(&self, id: PostId) -> Vec<PostSnapshot> {
        let post: Post = self.get_post_by_id(&id).into();
        post.snapshot_history
    }

    // Communities: Get all communities by DAO
    pub fn get_dao_communities(&self, dao_list: Option<Vec<DaoId>>) -> Vec<VersionedCommunity> {
        let list_dao_id = if let Some(id_list) = dao_list {
            id_list
        } else {
            self.dao.keys().collect()
        };

        list_dao_id.iter().flat_map(|dao_id| {
            let community_ids = self.dao_communities
                .get(dao_id)
                .unwrap_or_default()
                .clone();

            community_ids.into_iter().map(|community_id| {
                self.get_community_by_id(&community_id)
            }).collect::<Vec<_>>()
        }).collect()
    }

    // Communities: Get Community by ID
    pub fn get_community_by_id(&self, id: &CommunityId) -> VersionedCommunity {
        self.communities.get(&id).unwrap_or_else(|| panic!("Community #{} not found", id))
    }

    // Communities: Get Community by handle
    pub fn get_community_by_handle(&self, handle: String) -> VersionedCommunity {
        let community = self.community_handles.get(&handle).and_then(|id| self.communities.get(&id));
        community.unwrap_or_else(|| panic!("Community {} not found", handle))
    }

    // Communities: Get all community smart-contracts for DAO list
    pub fn get_community_accounts(&self, dao_list: Option<Vec<DaoId>>) -> HashMap<DaoId, Vec<AccountId>> {
        let list_dao_id = if let Some(id_list) = dao_list {
            id_list
        } else {
            self.dao.keys().collect()
        };

        list_dao_id.iter().map(|id| {
            let dao = self.get_dao_by_id(id);
            let community_ids = self.dao_communities.get(&id).unwrap_or_default();

            let accounts: Vec<AccountId> = community_ids.iter()
                .map(|community_id| self.get_community_by_id(community_id).latest_version().accounts.clone())
                .flatten()
                .collect();

            let checkin_account_id = dao.latest_version().checkin_account_id.clone();
            let accounts = if let Some(checkin_account_id) = checkin_account_id {
                let mut accounts = accounts.clone();
                accounts.push(checkin_account_id);
                accounts
            } else {
                accounts
            };

            (*id, accounts)
        }).collect()
    }

    // Communities: Get follow list for user
    pub fn get_follow_id_list(&self, follow_type: FollowType, account_id: AccountId) -> Vec<u64> {
        self.user_follow.get(&(follow_type, account_id)).unwrap_or_default()
    }

    // Access-control: Get the access rules list for a specific account
    pub fn get_account_access(&self, account_id: AccountId) -> Vec<VersionedAccessMetadata> {
        self.owner_access.get(&account_id).unwrap_or(vec![])
    }

    // Comments: Get Comment by ID
    pub fn get_comment_by_id(&self, id: &CommentId) -> VersionedComment {
        self.comments.get(id).unwrap_or_else(|| panic!("Comment id {} not found", id))
    }

    // Comments: Get all comments by author
    pub fn get_comments_by_author(&self, author: AccountId) -> Vec<VersionedComment> {
        self.comment_authors.get(&author).unwrap_or_default()
            .iter()
            .map(|comment_id| self.get_comment_by_id(comment_id))
            .collect()
    }

    // Comments: Get all comments for a post
    pub fn get_post_comments(&self, post_id: PostId) -> Vec<VersionedComment> {
        let post:Post = self.posts.get(&post_id).unwrap_or_else(|| panic!("Post id {} not found", post_id)).into();
        post.comments.iter()
            .map(|comment_id| self.get_comment_by_id(comment_id))
            .collect()
    }

    // Comments: Get comment history
    pub fn get_comment_history(&self, id: CommentId) -> Vec<CommentSnapshot> {
        let comment: Comment = self.get_comment_by_id(&id).into();
        comment.snapshot_history
    }

    pub fn get_follow_dao(&self, account_id: AccountId) -> Vec<DAO> {
        self.user_follow.get(&(FollowType::DAO, account_id)).unwrap_or_default()
            .iter()
            .map(|dao_id| self.get_dao_by_id(dao_id).into())
            .collect()
    }

    pub fn get_follow_community(&self, account_id: AccountId) -> Vec<Community> {
        self.user_follow.get(&(FollowType::Community, account_id)).unwrap_or_default()
            .iter()
            .map(|community_id| self.get_community_by_id(community_id).into())
            .collect()
    }

    // Events: Get all events
    pub fn get_all_events(&self, page: u64, limit: u64, event_status: Option<EventStatus>, dao_id: Option<DaoId>) -> Vec<Event> {
        let event_ids: Vec<EventId> = if let Some(dao) = dao_id {
            self.dao_events.get(&dao).unwrap_or_default()
        } else {
            (1..=self.total_events).collect()
        };

        let events: Vec<Event> = event_ids.iter()
            .filter_map(|event_id| {
                let event = self.get_event_by_id(&event_id);
                match &event_status {
                    Some(status) => {
                        if event.status == *status {
                            Some(event)
                        } else {
                            None
                        }
                    },
                    None => Some(event),
                }
            })
            .collect();

        // events.sort_by(|a, b| a.start_timestamp.cmp(&b.start_timestamp));

        let total_events = events.len();
        let page = page.max(1);
        let start = ((page - 1) * limit) as usize;
        let end = std::cmp::min(start + limit as usize, total_events);

        events[start..end].to_vec()
    }

    // Events: Get event by ID
    pub fn get_event_by_id(&self, id: &EventId) -> Event {
        self.events.get(id).unwrap_or_else(|| panic!("Event {} not found", id))
    }

    // Events: Get all Active events for a DAO

}

#[cfg(all(test, not(target_arch = "wasm32")))]
pub mod tests {
    use std::collections::HashMap;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{NearToken, testing_env, VMContext};
    use crate::{Contract, DaoId};
    use crate::dao::{DAOInput, DAOType};

    pub fn get_context_with_signer(is_view: bool, signer: String, deposit: NearToken) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(signer.clone().try_into().unwrap())
            .current_account_id(signer.clone().try_into().unwrap())
            .predecessor_account_id(signer.parse().unwrap())
            .is_view(is_view)
            .attached_deposit(deposit)
            // .prepaid_gas(Gas::from_tgas(200))
            .build()
    }

    pub fn setup_contract() -> (VMContext, Contract) {
        let context = get_context_with_signer(false, String::from("bob.near"), NearToken::from_yoctonear(0));
        testing_env!(context.clone());
        (context, Contract::new())
    }

    pub fn setup_contract_with_deposit(deposit: NearToken) {
        let context = get_context_with_signer(false, String::from("bob.near"), deposit);
        testing_env!(context.clone());
    }

    // Setup function to initialize the contract and add a DAO
    pub fn create_new_dao(context: &VMContext, contract: &mut Contract) -> DaoId {
        contract.add_dao(
            DAOInput {
                title: "DAO Title".to_string(),
                handle: "dao-title".to_string(),
                description: "DAO Description".to_string(),
                logo_url: "https://logo.com".to_string(),
                banner_url: "https://banner.com".to_string(),
                dao_type: DAOType::DAO,
                account_id: Some("some_acc.near".parse().unwrap()),
                checkin_account_id: Some("checkin_acc.near".parse().unwrap()),
            },
            vec![context.signer_account_id.clone()],
            vec!["gaming".to_string()],
            vec![],
            HashMap::new()
        )
    }

}
