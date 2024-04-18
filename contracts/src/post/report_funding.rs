use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{require, NearSchema, AccountId};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct ReportMilestones {
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
    pub milestones: Vec<ReportMilestones>,
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

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "report_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedReportFunding {
    V1(ReportFunding),
    // V2(ReportFundsV2),
}

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

impl VersionedReportFunding {
    pub fn latest_version(&self) -> &ReportFunding {
        match self {
            VersionedReportFunding::V1(report_funding) => report_funding,
            // Handle other versions as needed
        }
    }

    // pub fn validate(&self) {
    //     return match self {
    //         VersionedReportFunds::V1(report) => {
    //             require!(
    //                 matches!(report.title.chars().count(), 5..=500),
    //                 "Report title must contain 5 to 500 characters"
    //             );
    //             require!(
    //                  !report.description.is_empty(),
    //                 "No description provided for report"
    //             );
    //         },
    //     };
    // }
}

impl From<VersionedReportFunding> for ReportFunding {
    fn from(vi: VersionedReportFunding) -> Self {
        match vi {
            VersionedReportFunding::V1(v1) => v1,
            // VersionedReportFunds::V1(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedReportFunds> for ReportV2 {
//     fn from(vi: VersionedReportFunds) -> Self {
//         match vi {
//             VersionedReportFunds::V1(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<ReportFunding> for VersionedReportFunding {
    fn from(report_funding: ReportFunding) -> Self {
        VersionedReportFunding::V1(report_funding)
    }
}
