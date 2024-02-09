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
use crate::post::comment::VersionedComment;
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
    pub fn get_dao_by_id(&self, id: DaoId) -> VersionedDAO {
        self.dao.get(&id).unwrap_or_else(|| panic!("DAO #{} not found", id))
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
    pub fn get_dao_posts(&self, dao_id: DaoId) -> Vec<VersionedPost> {
        self.dao_posts.get(&dao_id).unwrap_or_default()
            .iter()
            .map(|post_id| self.get_post_by_id(post_id))
            .collect()
    }

    // Posts: Get Proposals/Reports by Author
    pub fn get_posts_by_author(&self, author: AccountId) -> Vec<VersionedPost> {
        self.post_authors.get(&author).unwrap_or_default()
            .iter()
            .map(|post_id| self.get_post_by_id(post_id))
            .collect()
    }

    // Access-control: Get the access rules list for a specific account
    pub fn get_account_access(&self, account_id: AccountId) -> Vec<VersionedAccessMetadata> {
        self.owner_access.get(&account_id).unwrap_or(vec![])
    }

}