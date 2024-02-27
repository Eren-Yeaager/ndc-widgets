use crate::social_db::social_db_contract;
use near_sdk::serde_json::json;
use near_sdk::{env, AccountId, Promise};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum NotificationType {
    Like,
    Comment,
}

impl NotificationType {
    pub fn to_string(&self) -> String {
        match self {
            NotificationType::Like => "like".to_string(),
            NotificationType::Comment => "comment".to_string(),
        }
    }
}

fn notify(recipient: AccountId, notify_value: serde_json::Value) -> Promise {
    social_db_contract()
        .with_static_gas(env::prepaid_gas().saturating_div(4))
        .with_attached_deposit(env::attached_deposit())
        .set(json!({
            env::current_account_id() : {
            "index": {
              "notify": json!({
                "key": recipient,
                "value": notify_value,
              }).to_string()
            }
          }
        }))
}


fn notify_value(notify_id: u64, notification_type: NotificationType) -> serde_json::Value {
    json!({
        "type": notification_type.to_string(),
        "item": {
          "type": "social",
          "path": "mob.near/post/main",
          "blockHeight": env::block_height(),
        },
    })
}

pub fn notify_like(post_id: u64, post_author: AccountId) -> Promise {
    notify(post_author, notify_value(post_id, NotificationType::Like))
}
