use std::collections::HashSet;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Timestamp};
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
}