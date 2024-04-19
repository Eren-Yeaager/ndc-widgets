use crate::*;
use near_sdk::{env, near_bindgen};

#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[borsh(crate = "near_sdk::borsh")]
pub struct ContractV1 {
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

#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[borsh(crate = "near_sdk::borsh")]
pub struct ContractV2 {
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
    pub community_milestones: LookupMap<CommunityId, Vec<ReportMilestone>>,

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
    pub fn unsafe_migration_v2() {
        let old_state: ContractV1 = env::state_read().expect("failed");

        env::state_write(&ContractV2 {
            total_posts: old_state.total_posts,
            total_comments: old_state.total_comments,
            total_communities: old_state.total_communities,
            total_events: old_state.total_events,

            dao: old_state.dao,
            dao_posts: old_state.dao_posts,
            dao_communities: old_state.dao_communities,
            dao_events: old_state.dao_events,

            posts: old_state.posts,
            comments: old_state.comments,
            communities: old_state.communities,
            community_handles: old_state.community_handles,
            community_milestones: LookupMap::new(StorageKey::CommunityMilestones),

            events: old_state.events,

            label_to_posts: old_state.label_to_posts,
            vertical_posts: old_state.vertical_posts,
            community_posts: old_state.community_posts,

            post_status: old_state.post_status,
            post_authors: old_state.post_authors,
            comment_authors: old_state.comment_authors,
            user_follow: old_state.user_follow,
            owner_access: old_state.owner_access,
        });
    }
}