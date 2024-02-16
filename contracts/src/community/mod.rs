use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, near_bindgen};
use super::{Contract, DaoId};
use crate::{CategoryLabel, CommunityId};
use std::collections::HashMap;
use crate::dao::DAO;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct CommunityInput {
    pub handle: String,
    pub title: String,
    pub description: String,
    pub logo_url: String,
    pub banner_url: String,
}

impl CommunityInput {
    pub fn validate(&self) {
        assert!(!self.handle.is_empty(), "Handle is required");
        assert!(!self.title.is_empty(), "Title is required");
    }
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Community {
    pub id: CommunityId,
    pub dao_list: Vec<DaoId>,
    pub handle: String,
    pub title: String,
    pub description: String,
    pub category_list: Vec<CategoryLabel>,
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

use crate::*;

// Community call functions
#[near_bindgen]
impl Contract {

    // Add new DAO community
    // Access Level: DAO owners
    pub fn add_dao_community(
        &mut self,
        dao_id: DaoId,
        owners: Vec<AccountId>,
        community_input: CommunityInput,
        category_list: Vec<CategoryLabel>,
        metadata: HashMap<String, String>
    ) -> CommunityId {
        let dao:DAO = self.get_dao_by_id(&dao_id).into();
        assert!(dao.owners.contains(&env::predecessor_account_id()), "Must be DAO owner to add community");

        community_input.validate();
        let mut dao_communities = self.dao_communities.get(&dao_id).unwrap_or(vec![]);
        dao_communities.iter().for_each(|c| {
            let dao_community:Community = self.get_community_by_id(c).into();
            assert_ne!(dao_community.handle, community_input.handle, "Community handle already exists");
            assert_ne!(dao_community.title, community_input.title, "Community title already exists");
        });
        category_list.iter().for_each(|c| {
            assert!(dao.category_list.contains(c), "Category not in DAO category list");
        });

        self.total_communities += 1;
        let id  = self.total_communities;

        let community = Community {
            id: id.clone(),
            dao_list: vec![dao_id],
            handle: community_input.handle,
            title: community_input.title,
            description: community_input.description,
            category_list,
            logo_url: community_input.logo_url,
            banner_url: community_input.banner_url,
            owners,
            metadata
        };
        self.communities.insert(&id, &community.into());

        dao_communities.push(id);
        self.dao_communities.insert(&dao_id, &dao_communities);

        id
    }

    // Edit DAO community
    // Access Level: DAO owners
    pub fn edit_dao_community(
        &mut self,
        id: CommunityId,
        description: String,
        logo_url: String,
        banner_url: String,
        owners: Vec<AccountId>,
        category_list: Vec<CategoryLabel>,
        metadata: HashMap<String, String>
    ) {
        let mut community: Community = self.get_community_by_id(&id).into();
        let mut can_edit = false;
        community.dao_list.iter().for_each(|dao_id| {
            let dao:DAO = self.get_dao_by_id(dao_id).into();
            if dao.owners.contains(&env::predecessor_account_id()) {
                can_edit = true;
            }
        });
        assert!(can_edit, "Must be DAO owner to edit community");

        community.description = description;
        community.logo_url = logo_url;
        community.banner_url = banner_url;
        community.owners = owners;
        community.category_list = category_list;
        community.metadata = metadata;

        self.communities.insert(&id, &community.into());
    }
}