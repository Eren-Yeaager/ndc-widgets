mod storage_keys;
pub mod access_control;
pub mod dao;
pub mod community;
pub mod post;
pub mod migrations;
pub mod str_serializers;
mod user;

use std::collections::HashMap;
use storage_keys::*;
use post::*;

// use near_sdk::require;
// use near_sdk::serde_json::{json, Value};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap, Vector};
use near_sdk::{near_bindgen, AccountId, PanicOnDefault, env};
use crate::access_control::AccessPermissionType;
use crate::access_control::owners::VersionedAccessMetadata;
use crate::community::VersionedCommunity;
use crate::dao::{DAO, DAOInput, VersionedDAO};
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

    pub dao: Vector<VersionedDAO>,
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

            dao: Vector::new(StorageKey::DAO),
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

    // Add new DAO
    // Access Level: Only self-call
    pub fn add_dao(
        &mut self,
        body: DAOInput,
        owners: Vec<AccountId>,
        category_list: Vec<CategoryLabel>,
        metrics: Vec<MetricLabel>,
        metadata: HashMap<String, String>
    ) {
        near_sdk::assert_self();
        near_sdk::log!("add_dao");

        // check DAO: handle and title are unique
        self.dao.iter().enumerate().for_each(|(_, dao_ref)| {
            let dao: DAO = dao_ref.into();
            assert_ne!(dao.handle, body.handle, "DAO handle already exists");
            assert_ne!(dao.title, body.title, "DAO title already exists");
        });

        let id = self.dao.len() as DaoId;
        let dao = DAO {
            id: id.clone(),
            handle: body.handle,
            title: body.title,
            description: body.description,
            logo_url: body.logo_url,
            banner_url: body.banner_url,
            is_congress: body.is_congress,
            owners: owners.clone(),
            category_list,
            metrics,
            metadata,
        };
        self.dao.push(&dao.into());

        if owners.len() > 0 {
            self.add_owners_access(&owners, AccessPermissionType::DAO, id);
        }
    }

    // Edit DAO
    // Access Level: Only self-call
    pub fn edit_dao(
        &mut self,
        id: DaoId,
        body: DAOInput,
        owners: Vec<AccountId>,
        category_list: Vec<CategoryLabel>,
        metrics: Vec<MetricLabel>,
        metadata: HashMap<String, String>
    ) {
        near_sdk::assert_self();
        near_sdk::log!("edit_dao");

        let mut dao: DAO = self.dao.get(id).unwrap_or_else(|| panic!("DAO #{} not found", id)).into();
        dao.title = body.title;
        dao.description = body.description;
        dao.logo_url = body.logo_url;
        dao.banner_url = body.banner_url;
        dao.is_congress = body.is_congress;
        dao.owners = owners;
        dao.category_list = category_list;
        dao.metrics = metrics;
        dao.metadata = metadata;
        self.dao.replace(id, &dao.into());
    }

    // Add new DAO request/report
    // Access Level: Public
    pub fn add_dao_post(&mut self, dao_id: DaoId, body: PostBody) {
        near_sdk::log!("add_dao_post");

        // Validate body
        body.validate();
        if body.get_post_community_id().is_some() {
            let community_id = body.get_post_community_id().unwrap();
            let dao_communities = self.dao_communities.get(&dao_id).unwrap_or(vec![]);
            assert!(dao_communities.contains(&community_id), "Community not found in DAO");
        }

        self.total_posts += 1;
        let author_id = env::predecessor_account_id();
        let post_id = self.total_posts;

        let post = Post {
            id: post_id.clone(),
            author_id: author_id.clone(),
            likes: vec![],
            comments: vec![],
            dao_id,
            snapshot: PostSnapshot {
                status: PostStatus::InReview,
                editor_id: author_id.clone(),
                timestamp: env::block_timestamp(),
                body: body.clone(),
            },
            snapshot_history: vec![],
        };
        self.posts.insert(&post_id, &post.into());

        // Add to dao_posts
        let mut dao_posts = self.dao_posts.get(&dao_id).unwrap_or(vec![]);
        dao_posts.push(post_id.clone());
        self.dao_posts.insert(&dao_id, &dao_posts);

        // Add to post_authors
        let mut post_authors = self.post_authors.get(&author_id).unwrap_or(vec![]);
        post_authors.push(post_id.clone());
        self.post_authors.insert(&author_id, &post_authors);

        // Add to category_posts
        // if body.latest_version().category.is_some() {
        //     let category = body.into().category.unwrap();
        //     let mut category_posts = self.category_posts.get(&category).unwrap_or(vec![]);
        //     category_posts.push(post_id.clone());
        //     self.category_posts.insert(&category, &category_posts);
        // }

        // Add to community_posts
        if body.get_post_community_id().is_some() {
            let community_id = body.get_post_community_id().unwrap();
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or(vec![]);
            community_posts.push(post_id.clone());
            self.community_posts.insert(&community_id, &community_posts);
        }
    }

    pub fn get_posts_by_author(&self, author: AccountId) -> Vec<PostId> {
        self.post_authors.get(&author).map(|posts| posts.into_iter().collect()).unwrap_or(Vec::new())
    }

    pub fn get_dao_posts(&self, dao_id: DaoId) -> Vec<VersionedPost> {
        near_sdk::log!("get_dao_posts");
        let post_id_list = self.dao_posts.get(&dao_id).unwrap_or(vec![]);
        // map by post_id_list and get VersionedPost from self.posts
        let mut posts = vec![];
        for post_id in post_id_list {
            posts.push(self.posts.get(&post_id).unwrap_or_else(|| panic!("Post id {} not found", post_id)));
        }
        posts
    }

    pub fn get_post_by_id(&self, post_id: PostId) -> VersionedPost {
        near_sdk::log!("get_post_by_id");
        self.posts.get(&post_id).unwrap_or_else(|| panic!("Post id {} not found", post_id))
    }

}