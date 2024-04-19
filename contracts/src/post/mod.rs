mod like;
pub(crate) mod proposal;
mod report;
pub mod comment;
pub mod report_funding;

use std::collections::HashSet;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, near_bindgen, Timestamp, NearSchema, require};
use crate::{Vertical, CommentId, CommunityId, Contract, DaoId, PostId};
use crate::post::like::Like;
use crate::post::proposal::VersionedProposal;
use crate::post::report_funding::{ReportCategory, ReportFunding, ReportFundsTransferCategory};
use crate::post::report::{Report, VersionedReport};
use crate::str_serializers::*;

const POST_COMMENT_DEPOSIT: NearToken = NearToken::from_millinear(10); // 0.01 NEAR

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostType {
    Proposal,
    Report
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, EnumIter, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostStatus {
    InReview,
    New,
    Approved,
    Rejected,
    Executed,
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

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Post {
    pub id: PostId,
    pub author_id: AccountId,
    pub created_at: Timestamp,
    pub dao_id: DaoId,
    pub likes: HashSet<Like>,
    pub comments: HashSet<CommentId>,
    #[serde(flatten)]
    pub snapshot: PostSnapshot,
    #[serde(skip_serializing)]
    #[serde(skip_deserializing)]
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

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct PostSnapshot {
    pub status: PostStatus,
    pub editor_id: AccountId,
    #[serde(
        serialize_with = "u64_dec_format::serialize",
        deserialize_with = "u64_dec_format::deserialize"
    )]
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
    pub fn get_post_title(&self) -> String {
        return match self {
            PostBody::Proposal(proposal) => proposal.latest_version().title.clone(),
            PostBody::Report(report) => report.latest_version().title.clone(),
        };
    }

    pub fn get_post_description(&self) -> String {
        return match self {
            PostBody::Proposal(proposal) => proposal.latest_version().description.clone(),
            PostBody::Report(report) => report.latest_version().description.clone(),
        };
    }

    pub fn get_post_community_id(&self) -> Option<CommunityId> {
        return match self {
            PostBody::Proposal(proposal) => proposal.latest_version().community_id.clone(),
            PostBody::Report(report) => report.latest_version().community_id.clone(),
        };
    }

    pub fn get_post_vertical(&self) -> Option<Vertical> {
        return match self {
            PostBody::Proposal(proposal) => proposal.latest_version().vertical.clone(),
            PostBody::Report(report) => report.latest_version().vertical.clone(),
        };
    }

     pub fn get_post_type(&self) -> PostType {
         return match self {
             PostBody::Proposal(_) => PostType::Proposal,
             PostBody::Report(_) => PostType::Report,
         };
     }

     pub fn validate(&self) {
         return match self {
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
    #[payable]
    pub fn add_post(&mut self, dao_id: DaoId, body: PostBody, new_community_title: Option<String>) -> PostId {
        let dao = self.get_dao_by_id(&dao_id);

        // Validate input
        self.validate_attached_deposit();
        self.validate_add_post(&dao_id, &body, new_community_title.clone());
        if let Some(vertical) = body.get_post_vertical() {
            self.validate_verticals_exists(&vec![vertical]);
        }

        let body = match body {
            PostBody::Proposal(proposal) => PostBody::Proposal(proposal.latest_version().clone().into()),
            PostBody::Report(report) => self.handle_new_report(report, &dao_id, new_community_title),
        };

        // Create new post
        self.total_posts += 1;
        let author_id = env::predecessor_account_id();
        let post_id = self.total_posts;

        let post = Post {
            id: post_id.clone(),
            author_id: author_id.clone(),
            created_at: env::block_timestamp(),
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

        // Update various post collections
        self.add_dao_posts_internal(&dao_id, post_id);
        self.add_post_authors_internal(&author_id, post_id);
        self.add_post_status_internal(post_id, PostStatus::InReview);
        self.add_vertical_posts_internal(&body, post_id);
        self.add_community_posts_internal(&body, post_id);

        // Report specific actions
        self.handle_reports_related_tasks(&dao_id, &body, post_id);

        // Notifications
        notify::notify_mention(&body.get_post_title(), &body.get_post_description(), post_id.clone(), None);
        notify::notify_owners_new_post(dao.latest_version().owners, post_id.clone(), &body.get_post_title(), body.get_post_type());

        near_sdk::log!("POST ADDED: {}", post_id);
        post_id
    }

    fn handle_new_report(&mut self, report: VersionedReport, dao_id: &DaoId, new_community_title: Option<String>) -> PostBody {
        if let Some(title) = new_community_title {
            let handle = self.generate_handle(&title);
            self.validate_community_uniqueness(&dao_id, &title, &handle);

            let mut report: Report = report.latest_version().clone().into();
            report.community_id = Some(self.add_community_by_report(dao_id, title, handle));
            PostBody::Report(report.into())
        } else {
            PostBody::Report(report.latest_version().clone().into())
        }
    }

    fn handle_reports_related_tasks(&mut self, dao_id: &DaoId, body: &PostBody, post_id: PostId) {
        if let PostBody::Report(report) = &body {
            self.assign_report_to_proposal(report.into(), post_id);

            let report: Report = report.latest_version();
            if report.funding.milestones.len() > 0 {
                match report.funding.category {
                    ReportCategory::ProjectOnboarding => self.assign_community_milestones(dao_id.clone(), &report),
                    _ => self.edit_community_milestones_progress(dao_id.clone(), &report),
                }
            }
        }
    }

    // validate attached deposit
    fn validate_attached_deposit(&self) {
        require!(env::attached_deposit() >= POST_COMMENT_DEPOSIT, "Insufficient deposit attached");
    }

    // Validate post on create
    fn validate_add_post(&self, dao_id: &DaoId, body: &PostBody, new_community_title: Option<String>) {
        body.validate();
        self.get_dao_by_id(&dao_id);

        // Check proposal requested amount
        if let PostBody::Proposal(proposal) = body {
            require!(proposal.latest_version().requested_amount >= 0.0, "Wrong requested amount");
        }

        // Check report funding by type
        if let PostBody::Report(report) = body {
            let report_funding: ReportFunding = report.latest_version().funding.clone().into();
            report_funding.validate();

            if report_funding.category == ReportCategory::ProjectOnboarding {
                // check if new community handle is unique
                match new_community_title {
                    Some(title) => {
                        let handle = self.generate_handle(&title);
                        if self.community_handles.contains_key(&handle) {
                            panic!("Community handle already exists");
                        }
                    }
                    None => {
                        if body.get_post_community_id().is_none() {
                            panic!("Community ID is required for Project Onboarding report");
                        }
                    }
                }
            }

            if let Some(ReportFundsTransferCategory::Development) = report_funding.sub_category {
                if body.get_post_community_id().is_none() {
                    panic!("Community ID is required for Development report");
                }
            }
        }

        // Check if community is part of the DAO
        if let Some(community_id) = body.get_post_community_id() {
            let dao_communities = self.dao_communities.get(&dao_id).unwrap_or_default();
            assert!(dao_communities.contains(&community_id), "Community not found in DAO");
        }
    }

    // Assign community milestones
    fn assign_community_milestones(&mut self, dao_id: DaoId, report: &Report) {
        let community_id = report.community_id.unwrap();
        let milestones = report.clone().funding.milestones;

        self.community_milestones.insert(&(dao_id, community_id), &milestones);
    }

    // Edit community milestones
    fn edit_community_milestones_progress(&mut self, dao_id: DaoId, report: &Report) {
        let community_id = report.community_id.unwrap();
        let milestones_update = report.clone().funding.milestones;
        let milestones_key = (dao_id, community_id);

        let mut milestones = self.community_milestones.get(&milestones_key).unwrap_or(vec![]);
        for milestone in &milestones_update {
            let index = milestones.iter().position(|x| x.id == milestone.id);
            if let Some(index) = index {
                milestones[index].progress_pct = milestone.progress_pct;
            }
        }
        self.community_milestones.insert(&milestones_key, &milestones);
    }

    // Generate community handle
    pub(crate) fn generate_handle(&self, title: &String) -> String {
        let mut handle = String::new();
        let trimmed_title = title.trim();

        for c in trimmed_title.chars() {
            if c.is_alphanumeric() || c == '-' {
                if c == ' ' || c == '_' {
                    handle.push('-');
                } else {
                    handle.push(c.to_lowercase().next().unwrap());
                }
            }
        }

        handle
    }

    // Update dao_posts
    fn add_dao_posts_internal(&mut self, dao_id: &DaoId, post_id: PostId) {
        let mut dao_posts = self.dao_posts.get(dao_id).unwrap_or_else(Vec::new);
        dao_posts.push(post_id);
        self.dao_posts.insert(dao_id, &dao_posts);
    }

    // Update post_authors
    fn add_post_authors_internal(&mut self, author_id: &AccountId, post_id: PostId) {
        let mut post_authors = self.post_authors.get(author_id).unwrap_or_else(Vec::new);
        post_authors.push(post_id);
        self.post_authors.insert(author_id, &post_authors);
    }

    // Update post_status
    fn add_post_status_internal(&mut self, post_id: PostId, status: PostStatus) {
        let mut post_by_status = self.post_status.get(&status).unwrap_or_else(Vec::new);
        post_by_status.push(post_id);
        self.post_status.insert(&status, &post_by_status);
    }

    // Update vertical_posts
    fn add_vertical_posts_internal(&mut self, body: &PostBody, post_id: PostId) {
        if let Some(vertical) = body.get_post_vertical() {
            let mut vertical_posts = self.vertical_posts.get(&vertical).unwrap_or_else(Vec::new);
            vertical_posts.push(post_id);
            self.vertical_posts.insert(&vertical, &vertical_posts);
        }
    }

    fn assign_report_to_proposal(&mut self, report: &VersionedReport, post_id: PostId) {
        if let Some(proposal_id) = report.clone().latest_version().proposal_id {
            let mut proposal_post: Post = self.get_post_by_id(&proposal_id).into();

            if let PostBody::Proposal(proposal) = &mut proposal_post.snapshot.body {
                if !proposal.latest_version().clone().reports.contains(&post_id) {
                    proposal.latest_version_mut().reports.push(post_id);
                    self.posts.insert(&proposal_id, &proposal_post.into());
                }
            }
        }
    }

    // Update community_posts
    fn add_community_posts_internal(&mut self, body: &PostBody, post_id: PostId) {
        if let Some(community_id) = body.get_post_community_id() {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or_else(Vec::new);
            community_posts.push(post_id);
            self.community_posts.insert(&community_id, &community_posts);
        }
    }

    // Edit request/report
    // Access Level: Post author
    #[payable]
    pub fn edit_post(&mut self, id: PostId, body: PostBody) {
        let mut post: Post = self.get_post_by_id(&id).into();

        self.validate_attached_deposit();
        self.validate_edit_post(&post, &body);

        // Cleanup and update posts vertical and community
        self.update_vertical_posts_internal(&post, &body);
        self.update_community_posts_internal(&post, &body);

        post.snapshot_history.push(post.snapshot.clone());
        post.snapshot = PostSnapshot {
            status: PostStatus::InReview,
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: body.clone(),
        };
        self.posts.insert(&post.id, &post.clone().into());

        // Report specific actions
        self.handle_reports_related_tasks(&post.dao_id, &body, post.id);

        near_sdk::log!("POST EDITED: {}", id);
    }

    // Validate post on edit
    fn validate_edit_post(&self, post: &Post, body: &PostBody) {
        assert_eq!(env::predecessor_account_id(), post.author_id, "Only the author can edit the post");
        assert_eq!(post.snapshot.status, PostStatus::InReview, "Only posts in review can be edited");

        body.validate();

        if let Some(community_id) = body.get_post_community_id() {
            let dao_communities = self.dao_communities.get(&post.dao_id).unwrap_or(vec![]);
            assert!(dao_communities.contains(&community_id), "Community not found in DAO");
        }
    }

    // Cleanup and update vertical_posts
    fn update_vertical_posts_internal(&mut self, post: &Post, body: &PostBody) {
        let current_vertical = post.snapshot.body.get_post_vertical();
        let new_vertical = body.get_post_vertical();

        // If the vertical hasn't changed, there's nothing to update.
        if current_vertical == new_vertical {
            return;
        }

        // Remove post from the old vertical if it exists.
        if let Some(vertical) = current_vertical {
            let mut vertical_posts = self.vertical_posts.get(&vertical).unwrap_or_else(Vec::new);
            vertical_posts.retain(|&x| x != post.id);
            self.vertical_posts.insert(&vertical, &vertical_posts);
        }

        // Add post to the new vertical if it's different from the current.
        if let Some(vertical) = new_vertical {
            let mut vertical_posts = self.vertical_posts.get(&vertical).unwrap_or_else(Vec::new);
            if !vertical_posts.contains(&post.id) {
                vertical_posts.push(post.id.clone());
                self.vertical_posts.insert(&vertical, &vertical_posts);
            }
        }
    }

    // Cleanup and update community_posts
    fn update_community_posts_internal(&mut self, post: &Post, body: &PostBody) {
        let current_community_id = post.snapshot.body.get_post_community_id();
        let new_community_id = body.get_post_community_id();

        // If the community hasn't changed, there's nothing to update.
        if current_community_id == new_community_id {
            return;
        }

        // Remove post from the old community if it exists.
        if let Some(community_id) = current_community_id {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or_else(Vec::new);
            community_posts.retain(|&x| x != post.id);
            self.community_posts.insert(&community_id, &community_posts);
        }

        // Add post to the new community if it's different from the current.
        if let Some(community_id) = new_community_id {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or_else(Vec::new);
            if !community_posts.contains(&post.id) {
                community_posts.push(post.id.clone());
                self.community_posts.insert(&community_id, &community_posts);
            }
        }
    }

    // Change request/report status
    // Access Level: DAO council
    #[payable]
    pub fn change_post_status(&mut self, id: PostId, status: PostStatus) {
        let mut post: Post = self.get_post_by_id(&id).into();

        self.validate_attached_deposit();
        self.validate_dao_ownership(&env::predecessor_account_id(), &post.dao_id);

        assert_ne!(post.snapshot.status, status, "Post already has this status");

        // TODO: Add restrictions & rules for status changes

        // Cleanup old post_status and add to new one, also update proposal_type_summary
        self.update_post_status_internal(&post, &status);

        // Update post
        post.snapshot_history.push(post.snapshot.clone());
        post.snapshot = PostSnapshot {
            status,
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: post.snapshot.body.clone(),
        };
        self.posts.insert(&post.id, &post.clone().into());

        near_sdk::log!("POST STATUS CHANGED: {}", post.id);
    }

    // Change proposal state
    // Access Level: DAO council
    #[payable]
    pub fn change_proposal_state(&mut self, id: PostId, state: ProposalStates) {
        let mut post: Post = self.get_post_by_id(&id).into();

        self.validate_attached_deposit();
        self.validate_dao_ownership(&env::predecessor_account_id(), &post.dao_id);
        require!(post.snapshot.body.get_post_type() == PostType::Proposal, "Only proposals have state");

        let updated_body = match post.snapshot.body.clone() {
            PostBody::Proposal(versioned_proposal) => {
                match versioned_proposal {
                    VersionedProposal::V1(mut proposal) => {
                        proposal.state = state;
                        PostBody::Proposal(VersionedProposal::V1(proposal))
                    }
                }
            },
            _ => panic!("Expected a proposal post, found a different post type."),
        };

        post.snapshot_history.push(post.snapshot.clone());
        post.snapshot = PostSnapshot {
            status: post.snapshot.status,
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: updated_body,
        };
        self.posts.insert(&post.id, &post.clone().into());

        near_sdk::log!("PROPOSAL STATE CHANGED: {}", post.id);
    }

    // Cleanup old post_status and add to new post_status
    fn update_post_status_internal(&mut self, post: &Post, new_status: &PostStatus) {
        // Cleanup old post_status
        let mut post_by_status = self.post_status.get(&post.snapshot.status).unwrap_or_default();
        post_by_status.retain(|&x| x != post.id);
        self.post_status.insert(&post.snapshot.status, &post_by_status);

        // Add to new post_status
        let mut post_by_new_status = self.post_status.get(new_status).unwrap_or_default();
        post_by_new_status.push(post.id.clone());
        self.post_status.insert(new_status, &post_by_new_status);
    }

    // Change is_spam parameter for post
    // Access Level: DAO council
    #[payable]
    pub fn change_post_is_spam(&mut self, id: PostId, is_spam: bool) {
        let mut post: Post = self.get_post_by_id(&id).into();

        self.validate_attached_deposit();
        self.validate_dao_ownership(&env::predecessor_account_id(), &post.dao_id);

        post.snapshot_history.push(post.snapshot.clone());

        let updated_body = match post.snapshot.body {
            PostBody::Proposal(versioned_proposal) => {
                match versioned_proposal {
                    VersionedProposal::V1(mut proposal) => {
                        proposal.is_spam = is_spam;
                        PostBody::Proposal(VersionedProposal::V1(proposal))
                    }
                }
            },
            PostBody::Report(versioned_report) => {
                match versioned_report {
                    VersionedReport::V1(mut report) => {
                        report.is_spam = is_spam;
                        PostBody::Report(VersionedReport::V1(report))
                    },
                    VersionedReport::V2(mut report) => {
                        report.is_spam = is_spam;
                        PostBody::Report(VersionedReport::V2(report))
                    },
                }
            }
        };

        post.snapshot = PostSnapshot {
            status: post.snapshot.status,
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: updated_body,
        };
        self.posts.insert(&post.id, &post.clone().into());

        near_sdk::log!("POST IS SPAM: {}, {}", post.id, is_spam);
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::collections::HashMap;
    use crate::tests::{setup_contract, create_new_dao, setup_contract_with_deposit};
    use crate::post::{POST_COMMENT_DEPOSIT, Post, PostBody, PostStatus, PostType, VersionedProposal};
    use crate::post::proposal::{Proposal, ProposalStates};
    use crate::{CommunityId, Contract, DaoId, PostId};
    use crate::post::report::{Report, VersionedReport};
    use crate::post::report_funding::{ReportCategory, ReportFunding, ReportFundsTransferCategory, ReportMilestone};

    pub fn create_proposal(dao_id: &DaoId, contract: &mut Contract) -> PostId {
        setup_contract_with_deposit(POST_COMMENT_DEPOSIT);

        contract.add_post(
            *dao_id,
            PostBody::Proposal(
                VersionedProposal::V1(
                    Proposal {
                        title: "Proposal title".to_string(),
                        description: "Proposal description".to_string(),
                        attachments: vec![],
                        labels: vec!["label1".to_string(), "label2".to_string()],
                        metrics: HashMap::new(),
                        reports: vec![],
                        requested_amount: 1000.0,
                        community_id: None,
                        vertical: None,
                        state: ProposalStates::default(),
                        is_spam: false,
                    }
                )
            ),
            None
        )
    }

    fn get_report_funding_new() -> ReportFunding {
        ReportFunding {
            category: ReportCategory::ProjectOnboarding,
            sub_category: None,
            milestones: vec![
                ReportMilestone {
                    id: 1,
                    description: "Milestone 1 description".to_string(),
                    payment: 1000,
                    progress_pct: 50,
                },
                ReportMilestone {
                    id: 2,
                    description: "Milestone 2 description".to_string(),
                    payment: 500,
                    progress_pct: 0,
                }
            ],
            ipfs_proofs: vec![],
            transactions: vec![],
            participants: vec![],
            start_date: None,
            end_date: None,
        }
    }

    pub fn create_report(
        dao_id: DaoId,
        contract: &mut Contract,
        proposal_id: Option<PostId>,
        report_funding: Option<ReportFunding>,
        community_id: Option<CommunityId>
    ) -> PostId {
        setup_contract_with_deposit(POST_COMMENT_DEPOSIT);

        // New project/dApp by default
        let funding = report_funding.unwrap_or_else(|| get_report_funding_new());
        let new_community_title = match community_id {
            Some(_) => None,
            None => Some("New Community".to_string())
        };

        contract.add_post(
            dao_id,
            PostBody::Report(
                VersionedReport::V2(
                    Report {
                        title: "Report title".to_string(),
                        description: "Report description".to_string(),
                        attachments: vec![],
                        labels: vec!["label1".to_string()],
                        metrics: HashMap::new(),
                        community_id,
                        vertical: None,
                        proposal_id,
                        funding: funding.into(),
                        is_spam: false,
                    }
                )
            ),
            new_community_title
        )
    }

    #[test]
    pub fn test_add_proposal() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        let post: Post = contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.snapshot.status, PostStatus::InReview);
        assert_eq!(post.snapshot.body.get_post_vertical(), None);
        assert_eq!(post.snapshot.body.get_post_community_id(), None);
        assert_eq!(post.snapshot_history.len(), 0);

        match &post.snapshot.body {
            PostBody::Proposal(VersionedProposal::V1(proposal)) => {
                assert_eq!(proposal.title, "Proposal title".to_string());
                assert_eq!(proposal.description, "Proposal description".to_string());
                assert_eq!(proposal.attachments.len(), 0);
                assert_eq!(proposal.labels, vec!["label1".to_string(), "label2".to_string()]);
                assert_eq!(proposal.metrics, HashMap::new());
                assert_eq!(proposal.community_id, None);
                assert_eq!(proposal.vertical, None);
                assert_eq!(proposal.is_spam, false);
            }
            _ => {}
        }
    }

    #[test]
    pub fn test_edit_proposal() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        let new_title = "New Proposal title".to_string();
        let new_description = "New Proposal description".to_string();

        contract.edit_post(proposal_id, PostBody::Proposal(
            VersionedProposal::V1(
                Proposal {
                    title: new_title.clone(),
                    description: new_description.clone(),
                    attachments: vec!["some_url".to_string()],
                    labels: vec!["label1".to_string(), "label2".to_string()],
                    metrics: HashMap::new(),
                    reports: vec![],
                    requested_amount: 1000.0,
                    community_id: None,
                    vertical: None,
                    state: ProposalStates::default(),
                    is_spam: false,
                }
            )
        ));

        let post: Post = contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.snapshot_history.len(), 1);

        match &post.snapshot.body {
            PostBody::Proposal(VersionedProposal::V1(proposal)) => {
                assert_eq!(proposal.title, new_title);
                assert_eq!(proposal.description, new_description);
                assert_eq!(proposal.attachments.len(), 1);
                assert_eq!(proposal.labels, vec!["label1".to_string(), "label2".to_string()]);
                assert_eq!(proposal.metrics, HashMap::new());
                assert_eq!(proposal.reports.len(), 0);
                assert_eq!(proposal.requested_amount, 1000.0);
                assert_eq!(proposal.community_id, None);
                assert_eq!(proposal.vertical, None);
            }
            _ => {}
        }
    }

    #[test]
    pub fn test_add_report() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let report_id = create_report(dao_id, &mut contract, Some(proposal_id), None, None);

        let post: Post = contract.get_post_by_id(&report_id).into();
        assert_eq!(post.snapshot.status, PostStatus::InReview);
        assert_eq!(post.snapshot.body.get_post_vertical(), None);
        assert_eq!(post.snapshot.body.get_post_community_id(), Some(1));
        assert_eq!(post.snapshot_history.len(), 0);

        match &post.snapshot.body {
            PostBody::Report(VersionedReport::V2(report)) => {
                assert_eq!(report.proposal_id, Some(proposal_id));
                assert_eq!(report.title, "Report title".to_string());
                assert_eq!(report.description, "Report description".to_string());
                assert_eq!(report.labels, vec!["label1".to_string()]);
                assert_eq!(report.metrics, HashMap::new());
                assert_eq!(report.vertical, None);

                assert_eq!(report.funding.category, ReportCategory::ProjectOnboarding);
                assert_eq!(report.funding.sub_category, None);
                assert_eq!(report.funding.milestones.len(), 2);
                assert_eq!(report.funding.ipfs_proofs.len(), 0);
                assert_eq!(report.funding.transactions.len(), 0);
                assert_eq!(report.funding.participants.len(), 0);
                assert_eq!(report.funding.start_date, None);
                assert_eq!(report.funding.end_date, None);
            }
            _ => {}
        }
    }

    #[test]
    fn test_edit_report() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let report_id = create_report(dao_id, &mut contract, None, None, None);
        let new_title = "New Report title".to_string();
        let new_description = "New Report description".to_string();

        contract.edit_post(report_id, PostBody::Report(
            VersionedReport::V2(
                Report {
                    title: new_title.clone(),
                    description: new_description.clone(),
                    attachments: vec!["some_url".to_string()],
                    labels: vec!["label1".to_string()],
                    metrics: HashMap::new(),
                    community_id: None,
                    vertical: None,
                    proposal_id: None,
                    funding: get_report_funding_new().into(),
                    is_spam: false,
                }
            )
        ));

        let post: Post = contract.get_post_by_id(&report_id).into();
        assert_eq!(new_title, post.snapshot.body.get_post_title());
        assert_eq!(new_description, post.snapshot.body.get_post_description());
        assert_eq!(post.snapshot_history.len(), 1);
        assert_eq!(post.snapshot.status, PostStatus::InReview);
        assert_eq!(post.snapshot.body.get_post_vertical(), None);
        assert_eq!(post.snapshot.body.get_post_community_id(), None);
        assert_eq!(post.snapshot.body.get_post_type(), PostType::Report);
    }

    #[test]
    fn change_proposal_state() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let post_id = create_proposal(&dao_id, &mut contract);

        let mut new_states = ProposalStates::default();
        new_states.kyc_passed = Some(true);
        new_states.dao_council_approved = Some(true);
        contract.change_proposal_state(post_id, new_states);

        let proposal:Post = contract.get_post_by_id(&post_id).into();
        if let PostBody::Proposal(vp) = &proposal.snapshot.body {
            let VersionedProposal::V1(p) = vp;
            assert_eq!(p.state.kyc_passed, Some(true));
            assert_eq!(p.state.dao_council_approved, Some(true));
        }
    }

    #[test]
    fn test_post_is_spam_change() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let post_id = create_proposal(&dao_id, &mut contract);

        contract.change_post_is_spam(post_id, true);

        let post: Post = contract.get_post_by_id(&post_id).into();
        if let PostBody::Proposal(vp) = &post.snapshot.body {
            let VersionedProposal::V1(p) = vp;
            assert!(p.is_spam);
        }

        contract.change_post_is_spam(post_id, false);

        let post: Post = contract.get_post_by_id(&post_id).into();
        if let PostBody::Proposal(vp) = &post.snapshot.body {
            let VersionedProposal::V1(p) = vp;
            assert!(!p.is_spam);
        }
    }

    #[test]
    // Funds Transfer > Development funding
    fn test_report_funding_development() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        // Create first report (new project/dApp by default) to use in next reports
        let first_report_id = create_report(dao_id, &mut contract, None, None, None);
        let first_report: Post = contract.get_post_by_id(&first_report_id).into();
        let new_community_id = first_report.snapshot.body.get_post_community_id();

        // Create second report (development funding) that extend the first community report
        let report_funding = ReportFunding {
            category: ReportCategory::FundsTransfer,
            sub_category: Some(ReportFundsTransferCategory::Development),
            ipfs_proofs: vec![],
            transactions: vec!["tx_hash".to_string()],
            participants: vec![],
            milestones: vec![
                ReportMilestone {
                    id: 1,
                    description: "Milestone 1 description".to_string(),
                    payment: 1000,
                    progress_pct: 100,
                },
                ReportMilestone {
                    id: 2,
                    description: "Milestone 2 description".to_string(),
                    payment: 500,
                    progress_pct: 50,
                }
            ],
            start_date: None,
            end_date: None,
        };

        create_report(dao_id, &mut contract, None, Some(report_funding), new_community_id);

        // Check community milestones update
        let milestones = contract.get_community_milestones(new_community_id.unwrap());
        assert_eq!(milestones.len(), 2);
        assert_eq!(milestones[0].progress_pct, 100);
        assert_eq!(milestones[1].progress_pct, 50);
    }

    #[test]
    // Funds Transfer > Marketing campaign
    fn test_report_funding_marketing() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let report_funding = ReportFunding {
            category: ReportCategory::FundsTransfer,
            sub_category: Some(ReportFundsTransferCategory::Marketing),
            ipfs_proofs: vec!["ipfs_hash".to_string()],
            transactions: vec!["tx_hash".to_string()],
            participants: vec!["bob.near".parse().unwrap()],
            milestones: vec![],
            start_date: Some(999999999),
            end_date: Some(999999999),
        };

        let post_id = create_report(dao_id, &mut contract, None, Some(report_funding.clone()), None);
        let post: Post = contract.get_post_by_id(&post_id).into();

        match &post.snapshot.body {
            PostBody::Report(VersionedReport::V2(report)) => {
                assert_eq!(report.funding.category, report_funding.category);
                assert_eq!(report.funding.sub_category, report_funding.sub_category);
                assert_eq!(report.funding.ipfs_proofs.len(), 1);
                assert_eq!(report.funding.transactions.len(), 1);
                assert_eq!(report.funding.participants.len(), 1);
                assert_eq!(report.funding.start_date, report_funding.start_date);
                assert_eq!(report.funding.end_date, report_funding.end_date);
            }
            _ => {}
        }
    }

    #[test]
    // Funds Transfer > Operational spending
    fn test_report_funding_operational() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let report_funding = ReportFunding {
            category: ReportCategory::FundsTransfer,
            sub_category: Some(ReportFundsTransferCategory::Operational),
            ipfs_proofs: vec![],
            transactions: vec!["tx_hash".to_string()],
            participants: vec![],
            milestones: vec![],
            start_date: None,
            end_date: None,
        };

        let post_id = create_report(dao_id, &mut contract, None, Some(report_funding.clone()), None);
        let post: Post = contract.get_post_by_id(&post_id).into();

        match &post.snapshot.body {
            PostBody::Report(VersionedReport::V2(report)) => {
                assert_eq!(report.funding.category, report_funding.category);
                assert_eq!(report.funding.sub_category, report_funding.sub_category);
                assert_eq!(report.funding.transactions.len(), 1);
            }
            _ => {}
        }
    }

}