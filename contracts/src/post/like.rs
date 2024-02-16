use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Timestamp};
use std::cmp::Ordering;
use std::hash::{Hash, Hasher};
use crate::str_serializers::*;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Ord)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Like {
    pub author_id: AccountId,
    #[serde(with = "u64_dec_format")]
    pub timestamp: Timestamp,
}

impl Hash for Like {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.author_id.hash(state)
    }
}

impl PartialEq for Like {
    fn eq(&self, other: &Self) -> bool {
        self.author_id.eq(&other.author_id)
    }
}

impl PartialOrd for Like {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        self.author_id.partial_cmp(&other.author_id)
    }
}

impl Eq for Like {}

use crate::*;

// Likes
#[near_bindgen]
impl Contract {

    // Add like to request/report
    // Access Level: Public
    pub fn post_like(&mut self, id: PostId) {
        let mut post: Post = self.get_post_by_id(&id).into();

        let like = Like {
            author_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
        };
        post.likes.insert(like);
        self.posts.insert(&id, &post.into());

        // TODO: Add notification
        // let post_author = post.author_id.clone();
        // notify::notify_like(post_id, post_author);
    }

    // Remove like from request/report
    // Access Level: Public
    pub fn post_unlike(&mut self, id: PostId) {
        let mut post: Post = self.get_post_by_id(&id).into();

        post.likes.retain(|like| like.author_id != env::predecessor_account_id());
        self.posts.insert(&id, &post.into());
    }

    // Like comment
    // Access Level: Public
    pub fn comment_like(&mut self, id: CommentId) {
        let mut comment:Comment = self.get_comment_by_id(&id).into();
        let author_id = env::predecessor_account_id();
        let like = Like {
            author_id: author_id.clone(),
            timestamp: env::block_timestamp(),
        };
        comment.likes.insert(like);
        self.comments.insert(&id, &comment.into());

        // TODO: Add notification
        // let post_author = ...;
        // notify::notify_like(post_id, post_author);
    }

    // Remove like from comment
    // Access Level: Public
    pub fn comment_unlike(&mut self, id: CommentId) {
        let mut comment:Comment = self.get_comment_by_id(&id).into();

        comment.likes.retain(|like| like.author_id != env::predecessor_account_id());
        self.comments.insert(&id, &comment.into());
    }
}