mod storage_keys;
pub mod access_control;
pub mod dao;
pub mod community;
pub mod post;
pub mod migrations;
pub mod str_serializers;
mod user;

use storage_keys::*;
use post::*;

// use near_sdk::require;
// use near_sdk::serde_json::{json, Value};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::{near_bindgen, AccountId, PanicOnDefault, env};
use crate::access_control::AccessPermissionType;
use crate::access_control::owners::VersionedAccessMetadata;
use crate::community::VersionedCommunity;
use crate::dao::{VersionedDAO};
use crate::post::comment::{Comment, CommentSnapshot, VersionedComment};
use crate::user::UserFollow;

type DaoId = u64;
type PostId = u64;
type CommentId = u64;
type CommunityId = u64;
type PostLabel = String;
type CategoryLabel = String;
type MetricLabel = String;
pub type Balance = u128;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[borsh(crate = "near_sdk::borsh")]
pub struct Contract {
    pub total_posts: u64,
    pub total_comments: u64,
    pub total_communities: u64,

    pub dao: UnorderedMap<DaoId, VersionedDAO>,
    pub dao_posts: LookupMap<DaoId, Vec<PostId>>,
    pub dao_communities: LookupMap<DaoId, Vec<CommunityId>>,

    pub posts: LookupMap<PostId, VersionedPost>,
    pub comments: LookupMap<CommentId, VersionedComment>,
    pub communities: LookupMap<CommunityId, VersionedCommunity>,

    pub label_to_posts: UnorderedMap<PostLabel, Vec<PostId>>,
    pub category_posts: UnorderedMap<CategoryLabel, Vec<PostId>>,
    pub community_posts: LookupMap<CommunityId, Vec<PostId>>,

    pub post_authors: UnorderedMap<AccountId, Vec<PostId>>,
    pub comment_authors: UnorderedMap<AccountId, Vec<CommentId>>,
    pub user_follow: LookupMap<AccountId, Vec<UserFollow>>,
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

            dao: UnorderedMap::new(StorageKey::DAO),
            dao_posts: LookupMap::new(StorageKey::DaoPosts),
            dao_communities: LookupMap::new(StorageKey::DaoCommunities),

            posts: LookupMap::new(StorageKey::Posts),
            comments: LookupMap::new(StorageKey::Comments),
            communities: LookupMap::new(StorageKey::Communities),

            label_to_posts: UnorderedMap::new(StorageKey::LabelToPosts),
            category_posts: UnorderedMap::new(StorageKey::CategoryPosts),
            community_posts: LookupMap::new(StorageKey::CommunityPosts),

            post_authors: UnorderedMap::new(StorageKey::PostAuthors),
            comment_authors: UnorderedMap::new(StorageKey::CommentAuthors),
            user_follow: LookupMap::new(StorageKey::UserFollow),
            owner_access: LookupMap::new(StorageKey::OwnerAccess),
        };

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

    // DAO: Get all DAOs
    pub fn get_dao_list(&self) -> Vec<VersionedDAO> {
        self.dao.values().collect()
    }

    // Posts: Get Proposals/Reports by ID
    pub fn get_post_by_id(&self, post_id: &PostId) -> VersionedPost {
        self.posts.get(post_id).unwrap_or_else(|| panic!("Post id {} not found", post_id))
    }

    // Posts: Get all Proposals/Reports except "in_review" for DAO
    pub fn get_dao_posts(&self, dao_id: DaoId, status: Option<PostStatus>) -> Vec<VersionedPost> {
        self.dao_posts.get(&dao_id).unwrap_or_default()
            .iter()
            .map(|post_id| self.get_post_by_id(post_id))
            .filter(|versioned_post| {
                let post:Post = (*versioned_post).clone().into();
                if status.is_some() {
                    // Filter by status if provided
                    post.snapshot.status == status.clone().unwrap()
                } else {
                    // Default: Exclude "in_review" status
                    post.snapshot.status != PostStatus::InReview
                }
            })
            .collect()

        // TODO: add pagination
    }

    // Posts: Get Proposals/Reports by Author
    pub fn get_posts_by_author(&self, author: AccountId) -> Vec<VersionedPost> {
        self.post_authors.get(&author).unwrap_or_default()
            .iter()
            .map(|post_id| self.get_post_by_id(post_id))
            .collect()

        // TODO: add pagination
    }

    // Posts: Get all posts
    pub fn get_post_history(&self, id: PostId) -> Vec<PostSnapshot> {
        let post: Post = self.get_post_by_id(&id).into();
        post.snapshot_history
    }

    // Communities: Get all communities by DAO
    pub fn get_dao_communities(&self, dao_id: DaoId) -> Vec<VersionedCommunity> {
        self.dao_communities.get(&dao_id).unwrap_or_default()
            .iter()
            .map(|community_id| self.get_community_by_id(community_id))
            .collect()
    }

    // Communities: Get Community by ID
    pub fn get_community_by_id(&self, id: &CommunityId) -> VersionedCommunity {
        self.communities.get(&id).unwrap_or_else(|| panic!("Community #{} not found", id))
    }

    // Access-control: Get the access rules list for a specific account
    pub fn get_account_access(&self, account_id: AccountId) -> Vec<VersionedAccessMetadata> {
        self.owner_access.get(&account_id).unwrap_or(vec![])
    }

    // Comments: Get Comment by ID
    pub fn get_comment_by_id(&self, comment_id: &CommentId) -> VersionedComment {
        self.comments.get(comment_id).unwrap_or_else(|| panic!("Comment id {} not found", comment_id))
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

}