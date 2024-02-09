use std::collections::HashSet;
use near_sdk::AccountId;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use crate::access_control::rules::Rule;
use crate::Contract;

pub mod owners;
pub mod rules;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone, Ord, PartialOrd, Eq, PartialEq, Hash)]
#[borsh(crate = "near_sdk::borsh")]
pub enum AccessPermissionType {
    DAO,
    Community
}

use crate::*;
use crate::access_control::owners::AccessMetadata;

// Access-control call functions
#[near_bindgen]
impl Contract {

    // Check if the account has access to a specific rule or access exists
    pub fn is_account_access(&self, account_id: &AccountId, permission_type: &AccessPermissionType, permission_id: u64, rule: Option<Rule>) -> bool {
        let access_list = self.owner_access.get(&account_id).unwrap_or(vec![]);
        for access_item in access_list {
            let access_item:AccessMetadata = access_item.into();
            if &access_item.permission_type == permission_type && access_item.permission_id == permission_id {
                return if rule.is_some() {
                    access_item.rules_list.contains(&rule.unwrap())
                } else {
                    true
                };
            }
        }
        return false;
    }

    pub(crate) fn add_owners_access(&mut self, owners: &Vec<AccountId>, permission_type: AccessPermissionType, permission_id: u64) {
        let mut assigned_owners: Vec<AccountId> = vec![];

        for owner in owners {
            // skip if exists - use edit/remove access to change account permission
            if !self.is_account_access(owner, &permission_type, permission_id, None) {
                let mut account_access = self.owner_access.get(&owner).unwrap_or(vec![]);
                let metadata = AccessMetadata {
                    permission_type: permission_type.clone(),
                    permission_id,
                    rules_list: HashSet::new(),
                    children: HashSet::new(),
                    parent: env::predecessor_account_id(),
                };

                account_access.push(metadata.into());
                assigned_owners.push(owner.clone());
                self.owner_access.insert(owner.into(), &account_access);
            }
        }

        // Assign children accounts
        if env::predecessor_account_id() != env::current_account_id() && !assigned_owners.is_empty() {
            let mut my_account_access: Vec<VersionedAccessMetadata> = self.owner_access.get(&env::predecessor_account_id()).unwrap();

            // Find metadata in Vec and add children
            for (i, metadata) in my_account_access.clone().into_iter().enumerate() {
                let metadata:AccessMetadata = metadata.into();
                if metadata.permission_type == permission_type && metadata.permission_id == permission_id {
                    let mut metadata:AccessMetadata = metadata.into();
                    metadata.children.extend(assigned_owners.clone());
                    my_account_access[i] = metadata.into();
                    self.owner_access.insert(&env::predecessor_account_id(), &my_account_access);
                    break;
                }
            }
        }
    }

}