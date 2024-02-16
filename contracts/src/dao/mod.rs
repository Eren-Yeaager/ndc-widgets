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

use crate::*;

// DAO call functions
#[near_bindgen]
impl Contract {

    // Add new DAO
    // Access Level: Only self-call
    pub fn add_dao(
        &mut self,
        body: DAOInput,
        owners: Vec<AccountId>,
        category_list: Vec<CategoryLabel>,
        metrics: Vec<MetricLabel>,
        metadata: HashMap<String, String>
    ) -> DaoId {
        near_sdk::assert_self();

        // check DAO: handle and title are unique
        self.dao.iter().for_each(|(_, dao_ref)| {
            let dao: DAO = dao_ref.into();
            assert_ne!(dao.handle, body.handle, "DAO handle already exists");
            assert_ne!(dao.title, body.title, "DAO title already exists");
        });

        let id = self.dao.len() + 1 as DaoId;
        let dao = DAO {
            id: id.clone(),
            handle: body.handle,
            title: body.title,
            description: body.description,
            logo_url: body.logo_url,
            banner_url: body.banner_url,
            is_congress: body.is_congress,
            owners: owners.clone(),
            category_list,
            metrics,
            metadata,
        };
        self.dao.insert(&id, &dao.into());

        if owners.len() > 0 {
            self.add_owners_access(&owners, AccessPermissionType::DAO, id);
        }

        near_sdk::log!("DAO ADDED: {}", id);
        id
    }

    // Edit DAO
    // Access Level: Only self-call
    pub fn edit_dao(
        &mut self,
        id: DaoId,
        body: DAOInput,
        // owners: Vec<AccountId>,
        category_list: Vec<CategoryLabel>,
        metrics: Vec<MetricLabel>,
        metadata: HashMap<String, String>
    ) {
        near_sdk::assert_self();
        near_sdk::log!("EDIT DAO: {}", id);

        let mut dao: DAO = self.get_dao_by_id(&id).into();
        dao.title = body.title;
        dao.description = body.description;
        dao.logo_url = body.logo_url;
        dao.banner_url = body.banner_url;
        dao.is_congress = body.is_congress;
        dao.category_list = category_list;
        dao.metrics = metrics;
        dao.metadata = metadata;
        // dao.owners = owners;

        self.dao.insert(&id, &dao.into());
    }

}
