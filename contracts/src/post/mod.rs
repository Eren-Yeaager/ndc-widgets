mod like;
mod proposal;
mod report;
pub mod comment;

use std::collections::HashSet;
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

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
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
    pub likes: HashSet<Like>,
    pub comments: HashSet<CommentId>,
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
    pub fn add_dao_post(&mut self, dao_id: DaoId, body: PostBody) -> PostId {
        body.validate();
        self.get_dao_by_id(&dao_id);
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
            likes: Default::default(),
            comments: Default::default(),
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

        // Add to post_status
        let mut post_by_status = self.post_status.get(&PostStatus::InReview).unwrap_or(vec![]);
        post_by_status.push(post_id.clone());
        self.post_status.insert(&PostStatus::InReview, &post_by_status);

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
        post_id
    }

    // Edit request/report
    // Access Level: Post author
    pub fn edit_dao_post(&mut self, id: PostId, body: PostBody) {
        let mut post: Post = self.get_post_by_id(&id).into();

        assert_eq!(env::predecessor_account_id(), post.author_id, "Only the author can edit the post");
        assert_eq!(post.snapshot.status, PostStatus::InReview, "Only posts in review can be edited");

        body.validate();
        if let Some(community_id) = body.get_post_community_id() {
            let dao_communities = self.dao_communities.get(&post.dao_id).unwrap_or(vec![]);
            assert!(dao_communities.contains(&community_id), "Community not found in DAO");
        }

        // Cleanup old category_posts
        if post.snapshot.body.get_post_category().is_some() && post.snapshot.body.get_post_category() != body.get_post_category(){
            let category = post.snapshot.body.get_post_category().unwrap();
            let mut category_posts = self.category_posts.get(&category).unwrap_or(vec![]);
            category_posts.retain(|&x| x != post.id);
            self.category_posts.insert(&category, &category_posts);
        }

        // Cleanup old community_posts
        if post.snapshot.body.get_post_community_id().is_some() && post.snapshot.body.get_post_community_id() != body.get_post_community_id(){
            let community_id = post.snapshot.body.get_post_community_id().unwrap();
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or(vec![]);
            community_posts.retain(|&x| x != post.id);
            self.community_posts.insert(&community_id, &community_posts);
        }

        post.snapshot_history.push(post.snapshot.clone());
        post.snapshot = PostSnapshot {
            status: PostStatus::InReview,
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: body.clone(),
        };
        self.posts.insert(&post.id, &post.clone().into());

        // Add to category_posts label
        if let Some(category) = body.get_post_category() {
            let mut category_posts = self.category_posts.get(&category).unwrap_or(vec![]);
            if !category_posts.contains(&post.id) {
                category_posts.push(post.id.clone());
                self.category_posts.insert(&category, &category_posts);
            }
        }

        // Add to community_posts
        if let Some(community_id) = body.get_post_community_id() {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or(vec![]);
            if community_posts.contains(&post.id) {
                community_posts.push(post.id.clone());
                self.community_posts.insert(&community_id, &community_posts);
            }
        }

        near_sdk::log!("POST EDITED: {}", post.id);
    }

    // Change request/report status
    // Access Level: DAO owners
    pub fn change_post_status(&mut self, id: PostId, status: PostStatus) {
        let mut post: Post = self.get_post_by_id(&id).into();

        let dao_owners = self.get_dao_by_id(&post.dao_id).latest_version().owners;
        assert!(dao_owners.contains(&env::predecessor_account_id()), "Only DAO owners can change the post status");
        assert_ne!(post.snapshot.status, status, "Post already has this status");

        // TODO: Add restrictions & rules for status changes

        // Cleanup old post_status
        let mut post_by_status = self.post_status.get(&post.snapshot.status).unwrap_or(vec![]);
        post_by_status.retain(|&x| x != post.id);
        self.post_status.insert(&post.snapshot.status, &post_by_status);

        // Update post
        post.snapshot_history.push(post.snapshot.clone());
        post.snapshot = PostSnapshot {
            status: status.clone(),
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: post.snapshot.body.clone(),
        };
        self.posts.insert(&post.id, &post.clone().into());

        // Add to new post_status
        let mut post_by_status = self.post_status.get(&status).unwrap_or(vec![]);
        post_by_status.push(post.id.clone());
        self.post_status.insert(&status, &post_by_status);

        near_sdk::log!("POST STATUS CHANGED: {}", post.id);
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::collections::HashMap;
    use crate::tests::{setup_contract, create_new_dao};
    use crate::post::{Post, PostBody, PostStatus, VersionedProposal};
    use crate::post::proposal::Proposal;
    use crate::{Contract, DaoId, PostId};
    use crate::post::report::{Report, VersionedReport};

    pub fn create_proposal(dao_id: &DaoId, contract: &mut Contract) -> PostId {
        contract.add_dao_post(
            *dao_id,
            PostBody::Proposal(
                VersionedProposal::V1(
                    Proposal {
                        title: "Proposal title".to_string(),
                        description: "Proposal description".to_string(),
                        labels: vec!["label1".to_string(), "label2".to_string()],
                        metrics: HashMap::new(),
                        reports: vec![],
                        community_id: None,
                        category: None,
                    }
                )
            )
        )
    }

    pub fn create_report(dao_id: DaoId, contract: &mut Contract, proposal_id: PostId) -> PostId {
        contract.add_dao_post(
            dao_id,
            PostBody::Report(
                VersionedReport::V1(
                    Report {
                        title: "Report title".to_string(),
                        description: "Report description".to_string(),
                        labels: vec!["label1".to_string()],
                        metrics: HashMap::new(),
                        community_id: None,
                        category: None,
                        proposal_id,
                    }
                )
            )
        )
    }

    #[test]
    pub fn test_add_proposal() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        let post: Post = contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.snapshot.status, PostStatus::InReview);
        assert_eq!(post.snapshot.body.get_post_category(), None);
        assert_eq!(post.snapshot.body.get_post_community_id(), None);
        assert_eq!(post.snapshot_history.len(), 0);

        if let PostBody::Proposal(vp) = &post.snapshot.body {
            let VersionedProposal::V1(proposal) = vp;
            assert_eq!(proposal.title, "Proposal title".to_string());
            assert_eq!(proposal.description, "Proposal description".to_string());
            assert_eq!(proposal.labels, vec!["label1".to_string(), "label2".to_string()]);
            assert_eq!(proposal.metrics, HashMap::new());
            assert_eq!(proposal.community_id, None);
            assert_eq!(proposal.category, None);
        }
    }

    #[test]
    pub fn test_edit_proposal() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        let new_title = "New Proposal title".to_string();
        let new_description = "New Proposal description".to_string();

        contract.edit_dao_post(proposal_id, PostBody::Proposal(
            VersionedProposal::V1(
                Proposal {
                    title: new_title.clone(),
                    description: new_description.clone(),
                    labels: vec!["label1".to_string(), "label2".to_string()],
                    metrics: HashMap::new(),
                    reports: vec![],
                    community_id: None,
                    category: None,
                }
            )
        ));

        let post: Post = contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.snapshot_history.len(), 1);

        if let PostBody::Proposal(vp) = &post.snapshot.body {
            let VersionedProposal::V1(proposal) = vp;
            assert_eq!(proposal.title, new_title);
            assert_eq!(proposal.description, new_description);
            assert_eq!(proposal.labels, vec!["label1".to_string(), "label2".to_string()]);
            assert_eq!(proposal.metrics, HashMap::new());
            assert_eq!(proposal.reports.len(), 0);
            assert_eq!(proposal.community_id, None);
            assert_eq!(proposal.category, None);
        }
    }

    #[test]
    pub fn test_add_report() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let report_id = create_report(dao_id, &mut contract, proposal_id);

        let post: Post = contract.get_post_by_id(&report_id).into();
        assert_eq!(post.snapshot.status, PostStatus::InReview);
        assert_eq!(post.snapshot.body.get_post_category(), None);
        assert_eq!(post.snapshot.body.get_post_community_id(), None);
        assert_eq!(post.snapshot_history.len(), 0);

        if let PostBody::Report(vp) = &post.snapshot.body {
            let VersionedReport::V1(report) = vp;
            assert_eq!(report.proposal_id, proposal_id);
            assert_eq!(report.title, "Report title".to_string());
            assert_eq!(report.description, "Report description".to_string());
            assert_eq!(report.labels, vec!["label1".to_string()]);
            assert_eq!(report.metrics, HashMap::new());
            assert_eq!(report.community_id, None);
            assert_eq!(report.category, None);
        }
    }
}