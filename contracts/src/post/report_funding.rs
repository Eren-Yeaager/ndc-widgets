use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{require, NearSchema, AccountId};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct ReportMilestone {
    pub id: u32,
    pub description: String,
    pub payment: u32,
    pub progress_pct: u8,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum ReportCategory {
    FundsTransfer,
    ProjectOnboarding,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum ReportFundsTransferCategory {
    Development,
    Marketing,
    Operational,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct ReportFunding {
    pub category: ReportCategory,
    pub sub_category: Option<ReportFundsTransferCategory>,
    pub milestones: Vec<ReportMilestone>,
    pub ipfs_proofs: Vec<String>,
    pub transactions: Vec<String>,
    pub participants: Vec<AccountId>,
    pub start_date: Option<u64>,
    pub end_date: Option<u64>,
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct ReportV2 {
//     pub title: String,
//     pub description: String,
// }

impl Default for ReportFunding {
    fn default() -> Self {
        Self {
            category: ReportCategory::FundsTransfer,
            sub_category: Some(ReportFundsTransferCategory::Operational),
            milestones: vec![],
            ipfs_proofs: vec![],
            transactions: vec![],
            participants: vec![],
            start_date: None,
            end_date: None,
        }
    }
}

impl ReportFunding {
    pub fn validate(&self) {
        if self.category == ReportCategory::FundsTransfer {
            require!(
                self.sub_category.is_some(),
                "Sub category is required for Funds Transfer"
            );

            if let Some(sub_category) = &self.sub_category {
                match sub_category {
                    ReportFundsTransferCategory::Development => {
                        require!(self.transactions.len() > 0, "No transactions for Development report");
                        require!(self.milestones.len() > 0, "No milestones for Development report");
                    },
                    ReportFundsTransferCategory::Marketing => {
                        require!(self.start_date.is_some(), "No date for Marketing report");
                        require!(self.transactions.len() > 0, "No transactions for Marketing report");
                    },
                    ReportFundsTransferCategory::Operational => {

                        // TODO: add tx type

                        require!(self.transactions.len() > 0, "No transactions for Operational report");
                    },
                }
            }
        } else {
            require!(self.milestones.len() > 0, "No milestones for new Project/dApp onboarding");
        }

        if self.milestones.len() > 0 {
            for milestone in &self.milestones {
                require!(!milestone.description.is_empty(), "Milestone description cannot be empty");
                require!(milestone.progress_pct <= 100, "Milestone completion percentage must be between 0 and 100");
            }
        }
    }
}