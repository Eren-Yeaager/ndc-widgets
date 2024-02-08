use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId};
use std::collections::{HashMap};
use crate::{CategoryLabel, DaoId, MetricLabel};

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct DAOInput {
    pub title: String,
    pub handle: String,
    pub description: String,
    pub logo_url: String,
    pub banner_url: String,
    pub is_congress: bool,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct DAO {
    pub id: DaoId,
    pub handle: String,
    pub title: String,
    pub description: String,
    pub logo_url: String,
    pub banner_url: String,
    pub is_congress: bool,
    pub owners: Vec<AccountId>,
    pub category_list: Vec<CategoryLabel>,
    pub metrics: Vec<MetricLabel>,
    pub metadata: HashMap<String, String>,
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct DaoV2 {
//     pub name: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "dao_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedDAO {
    V1(DAO),
    // V2(DaoV2),
}

impl VersionedDAO {
    pub fn latest_version(self) -> DAO {
        self.into()
    }

    // pub fn latest_version(self) -> DaoV2 {
    //     self.into()
    // }
}

impl From<VersionedDAO> for DAO {
    fn from(vi: VersionedDAO) -> Self {
        match vi {
            VersionedDAO::V1(v1) => v1,
            // VersionedDAO::V2(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedProposal> for ProposalV2 {
//     fn from(vi: VersionedProposal) -> Self {
//         match vi {
//             VersionedProposal::V2(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<DAO> for VersionedDAO {
    fn from(dao: DAO) -> Self {
        VersionedDAO::V1(dao)
    }
}

