use std::collections::HashSet;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Timestamp, near_bindgen};
use super::{PostId};
use crate::{CommentId};
use crate::post::like::Like;
use crate::str_serializers::*;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Comment {
    pub id: PostId,
    pub author_id: AccountId,
    pub post_id: PostId,
    pub likes: HashSet<Like>,
    pub parent_comment: Option<CommentId>,
    pub child_comments: HashSet<CommentId>,
    pub snapshot: CommentSnapshot,
    pub snapshot_history: Vec<CommentSnapshot>
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct CommentV1 {
//     pub title: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "comment_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedComment {
    V1(Comment),
    // V2(CommentV2),
}

impl VersionedComment {
    pub fn latest_version(self) -> Comment {
        self.into()
    }

    // pub fn latest_version(self) -> CommentV2 {
    //     self.into()
    // }
}

impl From<VersionedComment> for Comment {
    fn from(vi: VersionedComment) -> Self {
        match vi {
            VersionedComment::V1(v1) => v1,
            // VersionedComment::V2(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedComment> for CommentV2 {
//     fn from(vi: VersionedComment) -> Self {
//         match vi {
//             VersionedComment::V2(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<Comment> for VersionedComment {
    fn from(comment: Comment) -> Self {
        VersionedComment::V1(comment)
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct CommentSnapshot {
    #[serde(with = "u64_dec_format")]
    pub timestamp: Timestamp,
    #[serde(flatten)]
    pub body: CommentBody,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct CommentBody {
    pub description: String,
    pub attachments: Vec<String>,
}

use crate::*;

// Comments
#[near_bindgen]
impl Contract {

    // Create comment
    // Access Level: Public
    pub fn add_comment(
        &mut self,
        post_id: PostId,
        reply_to: Option<CommentId>,
        description: String,
        attachments: Vec<String>,
    ) -> CommentId {
        self.total_comments += 1;
        let comment_id = self.total_comments;
        let author_id = env::predecessor_account_id();

        let comment = Comment {
            id: comment_id.clone(),
            author_id: author_id.clone(),
            post_id: post_id.clone(),
            likes: HashSet::new(),
            parent_comment: reply_to.clone(),
            child_comments: HashSet::new(),
            snapshot: CommentSnapshot {
                timestamp: env::block_timestamp(),
                body: CommentBody {
                    description,
                    attachments,
                },
            },
            snapshot_history: vec![],
        };
        self.comments.insert(&comment_id, &comment.into());

        // Add comment ID to parent comment
        if reply_to.is_some() {
            let reply_id = reply_to.unwrap();
            let mut parent_comment:Comment = self.comments.get(&reply_id).expect("Parent comment not found").into();
            parent_comment.child_comments.insert(comment_id.clone());
            self.comments.insert(&reply_id, &parent_comment.into());
        }

        // Add comment ID to post
        let mut post:Post = self.posts.get(&post_id).expect("Post not found").into();
        post.comments.insert(comment_id.clone());
        self.posts.insert(&post_id, &post.into());

        // Add comment ID for author
        let mut my_comments = self.comment_authors.get(&author_id).unwrap_or(vec![]);
        my_comments.push(comment_id);
        self.comment_authors.insert(&author_id, &my_comments);

        near_sdk::log!("COMMENT ADDED: {}", comment_id);
        comment_id
    }

    // Edit comment
    // Access Level: Comment author
    pub fn edit_comment(
        &mut self,
        comment_id: CommentId,
        description: String,
        attachments: Vec<String>,
    ) {
        let mut comment:Comment = self.get_comment_by_id(&comment_id).into();
        let author_id = env::predecessor_account_id();

        assert_eq!(comment.author_id, author_id, "You are not the author of this comment");

        comment.snapshot_history.push(comment.snapshot.clone());
        comment.snapshot = CommentSnapshot {
            timestamp: env::block_timestamp(),
            body: CommentBody {
                description,
                attachments,
            },
        };
        self.comments.insert(&comment_id, &comment.into());

        near_sdk::log!("COMMENT EDITED: {}", comment_id);
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use crate::{CommentId, Contract, PostId};
    use crate::tests::{setup_contract, create_new_dao};
    use crate::post::{Post};
    use crate::post::comment::Comment;
    use crate::post::tests::create_proposal;

    pub fn create_comment(contract: &mut Contract, post_id: PostId, reply_id: Option<CommentId>) -> CommentId {
        contract.add_comment(
            post_id,
            reply_id,
            "Comment text".to_string(),
            vec![]
        )
    }

    #[test]
    pub fn test_add_comment() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let comment_id = create_comment(&mut contract, proposal_id, None);

        let comment:Comment = contract.get_comment_by_id(&comment_id).into();
        assert_eq!(comment.author_id, "bob.near".to_string());
        assert_eq!(comment.post_id, proposal_id);
        assert_eq!(comment.likes.len(), 0);
        assert_eq!(comment.parent_comment, None);
        assert_eq!(comment.child_comments.len(), 0);
        assert_eq!(comment.snapshot.body.description, "Comment text".to_string());
        assert_eq!(comment.snapshot.body.attachments.len(), 0);
        assert_eq!(comment.snapshot_history.len(), 0);
    }

    #[test]
    pub fn test_edit_comment() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let comment_id = create_comment(&mut contract, proposal_id, None);

        contract.edit_comment(
            comment_id,
            "First comment edited".to_string(),
            vec!["some_url".to_string()]
        );

        let comment:Comment = contract.get_comment_by_id(&comment_id).into();
        assert_eq!(comment.snapshot.body.description, "First comment edited".to_string());
        assert_eq!(comment.snapshot.body.attachments.len(), 1);
        assert_eq!(comment.snapshot_history.len(), 1);
    }

    #[test]
    pub fn test_add_comment_reply() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let comment_id = create_comment(&mut contract, proposal_id, None);
        let reply_id = create_comment(&mut contract, proposal_id, Some(comment_id));

        let comment:Comment = contract.get_comment_by_id(&comment_id).into();
        let reply:Comment = contract.get_comment_by_id(&reply_id).into();
        assert_eq!(comment.child_comments.len(), 1);
        assert_eq!(reply.parent_comment, Some(comment_id));

        // Check parent comment
        let parent_comment: Comment = contract.get_comment_by_id(&comment_id).into();
        assert_eq!(parent_comment.child_comments.len(), 1);

        // Check post
        let post: Post = contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.comments.len(), 2);
    }
}