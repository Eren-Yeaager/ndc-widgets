use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId};
use super::{DaoId};
use crate::{CategoryLabel, CommunityId};
use std::collections::HashMap;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Community {
    pub id: CommunityId,
    pub dao_list: Vec<DaoId>,
    pub handle: String,
    pub title: String,
    pub description: String,
    pub category: Vec<CategoryLabel>,
    pub logo_url: String,
    pub banner_url: String,
    pub owners: Vec<AccountId>,
    pub metadata: HashMap<String, String>
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct CommunityV2 {
//     pub title: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "community_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedCommunity {
    V1(Community),
    // V2(CommunityV2),
}

impl VersionedCommunity {
    pub fn latest_version(self) -> Community {
        self.into()
    }

    // pub fn latest_version(self) -> CommunityV2 {
    //     self.into()
    // }
}

impl From<VersionedCommunity> for Community {
    fn from(vi: VersionedCommunity) -> Self {
        match vi {
            VersionedCommunity::V1(v1) => v1,
            // VersionedCommunity::V2(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedCommunity> for CommunityV2 {
//     fn from(vi: VersionedCommunity) -> Self {
//         match vi {
//             VersionedCommunity::V2(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<Community> for VersionedCommunity {
    fn from(community: Community) -> Self {
        VersionedCommunity::V1(community)
    }
}
