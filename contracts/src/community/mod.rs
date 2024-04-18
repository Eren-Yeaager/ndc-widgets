use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, near_bindgen, NearSchema};
use super::{Contract, DaoId};
use crate::{Vertical, CommunityId};
use std::collections::HashMap;
use crate::dao::DAO;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct CommunityInput {
    pub handle: String,
    pub title: String,
    pub description: String,
    pub logo_url: String,
    pub banner_url: String,
    pub accounts: Vec<AccountId>,
}

impl CommunityInput {
    pub fn validate(&self) {
        assert!(!self.handle.is_empty(), "Handle is required");
        assert!(!self.title.is_empty(), "Title is required");
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum CommunityStatus {
    InReview,
    Active,
    Inactive,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Community {
    pub id: CommunityId,
    pub dao_id: DaoId,
    pub handle: String,
    pub title: String,
    pub description: String,
    pub verticals: Vec<Vertical>,
    pub logo_url: String,
    pub banner_url: String,
    pub status: CommunityStatus,
    pub owners: Vec<AccountId>,
    pub accounts: Vec<AccountId>,
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
    // Access Level: DAO council
    pub fn add_community(
        &mut self,
        dao_id: DaoId,
        owners: Vec<AccountId>,
        community_input: CommunityInput,
        verticals: Vec<Vertical>,
        metadata: HashMap<String, String>
    ) -> CommunityId {
        self.validate_dao_ownership(&env::predecessor_account_id(), &dao_id);
        community_input.validate();

        self.validate_community_uniqueness(&dao_id, &community_input.title, &community_input.handle);
        if verticals.len() > 0 {
            self.validate_verticals_exists(&verticals);
        }

        self.add_community_internal(
            dao_id,
            community_input.title,
            community_input.handle,
            community_input.description,
            community_input.logo_url,
            community_input.banner_url,
            community_input.accounts,
            verticals,
            owners,
            metadata,
            CommunityStatus::Active
        )
    }

    pub fn remove_community(&mut self, id: CommunityId) {
        let community = self.get_community_by_id(&id);

        let dao_id = community.latest_version().dao_id;
        self.validate_dao_ownership(&env::predecessor_account_id(), &dao_id);

        let mut dao_communities = self.dao_communities.get(&dao_id).unwrap_or(vec![]);
        dao_communities.retain(|c| c != &id);
        self.dao_communities.insert(&dao_id, &dao_communities);

        self.communities.remove(&id);
    }

    // Validate uniqueness of community (handle and title)
    pub(crate) fn validate_community_uniqueness(&self, dao_id: &DaoId, title: &String, handle: &String) {
        let dao_communities = self.dao_communities.get(dao_id).unwrap_or(vec![]);
        dao_communities.iter().for_each(|c| {
            let dao_community: Community = self.get_community_by_id(c).into();
            assert_ne!(&dao_community.title, title, "Community title already exists");
        });

        // check if handle exists
        assert!(!self.community_handles.contains_key(&handle), "Community handle already exists");
    }

    // Validate verticals - if they exist in any DAO
    pub(crate) fn validate_verticals_exists(&self, verticals: &Vec<Vertical>) {
        let all_exists = self.get_all_verticals();
        verticals.iter().for_each(|c| {
            assert!(all_exists.contains(c), "Vertical not found");
        });
    }

    // Add community to DAO community list
    fn add_dao_communities_internal(&mut self, dao_id: &DaoId, community_id: CommunityId) {
        let mut dao_communities = self.dao_communities.get(dao_id).unwrap_or(vec![]);
        dao_communities.push(community_id);
        self.dao_communities.insert(dao_id, &dao_communities);
    }

    fn add_community_handle_internal(&mut self, handle: &String, community_id: &CommunityId) {
        self.community_handles.insert(handle, &community_id);
    }

    // Change community status
    // Access Level: DAO council
    pub fn change_community_status(&mut self, id: CommunityId, status: CommunityStatus) {
        let mut community: Community = self.get_community_by_id(&id).into();
        self.validate_community_edit_access(&community);

        community.status = status;
        self.communities.insert(&id, &community.into());
    }

    pub(crate) fn add_community_by_report(&mut self, dao_id: &DaoId, title: String, handle: String) -> CommunityId {
        self.add_community_internal(
            dao_id.clone(),
            title,
            handle,
            String::new(),
            String::new(),
            String::new(),
            Vec::new(),
            Vec::new(),
            Vec::new(),
            HashMap::new(),
            CommunityStatus::InReview
        )
    }

    fn add_community_internal(
        &mut self,
        dao_id: DaoId,
        title: String,
        handle: String,
        description: String,
        logo_url: String,
        banner_url: String,
        accounts: Vec<AccountId>,
        verticals: Vec<Vertical>,
        owners: Vec<AccountId>,
        metadata: HashMap<String, String>,
        status: CommunityStatus
    ) -> CommunityId {
        self.total_communities += 1;
        let id = self.total_communities;
        let community = Community {
            id: id.clone(),
            dao_id,
            handle: handle.clone(),
            title,
            description,
            verticals,
            status,
            logo_url,
            banner_url,
            accounts,
            owners,
            metadata
        };
        self.communities.insert(&id, &community.into());

        self.add_dao_communities_internal(&dao_id, id.clone());
        self.add_community_handle_internal(&handle, &id);

        id
    }

    // Edit DAO community
    // Access Level: DAO council
    pub fn edit_community(
        &mut self,
        id: CommunityId,
        description: String,
        logo_url: String,
        banner_url: String,
        owners: Vec<AccountId>,
        accounts: Vec<AccountId>,
        verticals: Vec<Vertical>,
        metadata: HashMap<String, String>
    ) {
        let mut community: Community = self.get_community_by_id(&id).into();

        self.validate_community_edit_access(&community);

        community.description = description;
        community.logo_url = logo_url;
        community.banner_url = banner_url;
        community.owners = owners;
        community.verticals = verticals;
        community.metadata = metadata;
        community.accounts = accounts;

        self.communities.insert(&id, &community.into());
    }

    // Validate community edit access
    fn validate_community_edit_access(&self, community: &Community) {
        let dao: DAO = self.get_dao_by_id(&community.dao_id).into();
        assert!(dao.owners.contains(&env::predecessor_account_id()), "Must be DAO owner to edit community");
    }

    // User follow Community
    pub fn user_follow_community(&mut self, id: CommunityId){
        let account_id = env::predecessor_account_id();
        self.get_community_by_id(&id);

        let mut user_follow_list = self.user_follow.get(&(FollowType::Community, account_id.clone())).unwrap_or(vec![]);
        if !user_follow_list.contains(&id) {
            user_follow_list.push(id);
            self.user_follow.insert(&(FollowType::Community, account_id), &user_follow_list);
        }
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::collections::HashMap;
    use near_sdk::VMContext;
    use crate::community::{Community, CommunityInput};
    use crate::{CommunityId, Contract, DaoId};
    use crate::tests::{setup_contract, create_new_dao};

    pub fn add_community(contract: &mut Contract, context: &VMContext, dao_id: DaoId) -> CommunityId {
        contract.add_community(
            dao_id.clone(),
            vec![context.signer_account_id.clone()],
            CommunityInput {
                handle: "test".to_string(),
                title: "Test Community".to_string(),
                description: "Test Community Description".to_string(),
                logo_url: "https://test.com/logo.png".to_string(),
                banner_url: "https://test.com/banner.png".to_string(),
                accounts: vec![]
            },
            vec!["gaming".to_string()],
            HashMap::new()
        )
    }

    #[test]
    pub fn test_add_community() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let community_id = add_community(&mut contract, &context, dao_id.clone());
        let community:Community = contract.get_community_by_id(&community_id).into();

        assert_eq!(community.handle, "test", "No community handle");
        assert_eq!(community.title, "Test Community", "No community title");
        assert_eq!(community.dao_id, dao_id, "Community not added to DAO");
        assert!(community.owners.contains(&context.signer_account_id), "Community owner not added");
        assert!(community.verticals.contains(&"gaming".to_string()), "Community vertical not added");
    }

    #[test]
    pub fn test_edit_community() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let community_id = add_community(&mut contract, &context, dao_id.clone());

        contract.edit_community(
            community_id.clone(),
            "New Description".to_string(),
            "https://new.com/logo.png".to_string(),
            "https://new.com/banner.png".to_string(),
            vec![context.signer_account_id.clone()],
            vec![],
            vec!["gaming".to_string()],
            HashMap::new()
        );

        let community:Community = contract.get_community_by_id(&community_id).into();
        assert!(community.owners.contains(&context.signer_account_id), "Community owner not updated");
        assert_eq!(community.description, "New Description", "Community description not updated");
        assert_eq!(community.logo_url, "https://new.com/logo.png", "Community logo not updated");
        assert_eq!(community.banner_url, "https://new.com/banner.png", "Community banner not updated");
    }

    #[test]
    pub fn test_follow_community() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let community_id = add_community(&mut contract, &context, dao_id.clone());

        contract.user_follow_community(community_id.clone());

        let user_follow_list = contract.get_follow_community(context.signer_account_id.clone());
        assert_eq!(user_follow_list.len(), 1);
    }

    #[test]
    pub fn test_remove_community() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let community_id = add_community(&mut contract, &context, dao_id.clone());

        contract.remove_community(community_id.clone());

        let dao_communities = contract.get_dao_communities(Some(vec![dao_id.clone()]));
        assert_eq!(dao_communities.len(), 0);
    }
}