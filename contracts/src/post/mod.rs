mod like;
mod proposal;
mod report;
pub mod comment;

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, near_bindgen, Timestamp};
use crate::{CategoryLabel, CommentId, CommunityId, Contract, DaoId, PostId};
use crate::post::like::Like;
use crate::post::proposal::VersionedProposal;
use crate::post::report::VersionedReport;
use crate::str_serializers::*;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostType {
    Proposal,
    Report
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostStatus {
    InReview,
    New,
    Approved,
    Rejected { reason: String },
    Closed
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "post_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedPost {
    V1(Post),
    // V2(PostV2),
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Post {
    pub id: PostId,
    pub author_id: AccountId,
    pub dao_id: DaoId,
    pub likes: Vec<Like>,
    pub comments: Vec<CommentId>,
    #[serde(flatten)]
    pub snapshot: PostSnapshot,
    pub snapshot_history: Vec<PostSnapshot>,
}

impl From<VersionedPost> for Post {
    fn from(vp: VersionedPost) -> Self {
        match vp {
            VersionedPost::V1(v1) => v1,
        }
    }
}

impl From<Post> for VersionedPost {
    fn from(p: Post) -> Self {
        VersionedPost::V1(p)
    }
}
// impl From<PostV2> for VersionedPost {
//     fn from(p: PostV2) -> Self {
//         VersionedPost::V2(p)
//     }
// }

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct PostSnapshot {
    pub status: PostStatus,
    pub editor_id: AccountId,
    #[serde(with = "u64_dec_format")]
    pub timestamp: Timestamp,
    #[serde(flatten)]
    pub body: PostBody,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "post_type")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostBody {
    Proposal(VersionedProposal),
    Report(VersionedReport),
}

impl PostBody {
    // pub fn get_post_description(post: Post) -> String {
    //     return match post.snapshot.body.clone() {
    //         PostBody::Proposal(proposal) => proposal.latest_version().description,
    //         PostBody::Report(report) => report.latest_version().description,
    //     };
    // }

    pub fn get_post_community_id(&self) -> Option<CommunityId> {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.latest_version().community_id,
            PostBody::Report(report) => report.latest_version().community_id,
        };
    }

    pub fn get_post_category(&self) -> Option<CategoryLabel> {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.latest_version().category,
            PostBody::Report(report) => report.latest_version().category,
        };
    }

    pub fn validate(&self) {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.validate(),
            PostBody::Report(report) => report.validate(),
        };
    }
}

use crate::*;

// Proposal/report call functions
#[near_bindgen]
impl Contract {

    // Add new DAO request/report
    // Access Level: Public
    pub fn add_dao_post(&mut self, dao_id: DaoId, body: PostBody) {
        // Validate params
        body.validate();
        self.get_dao_by_id(dao_id);
        if let Some(community_id) = body.get_post_community_id() {
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

        // Add to category_posts label
        if let Some(category) = body.get_post_category() {
            let mut category_posts = self.category_posts.get(&category).unwrap_or(vec![]);
            category_posts.push(post_id.clone());
            self.category_posts.insert(&category, &category_posts);
        }

        // Add to community_posts
        if let Some(community_id) = body.get_post_community_id() {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or(vec![]);
            community_posts.push(post_id.clone());
            self.community_posts.insert(&community_id, &community_posts);
        }

        near_sdk::log!("POST ADDED: {}", post_id);
    }
}