use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{require, NearSchema, AccountId};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct ReportFundsInput {
    pub category: ReportFundCategory,
    pub sub_category: Option<ReportFundSubCategory>,
    pub milestones: Vec<ReportMilestones>,
    pub ipfs_proofs: Vec<String>,
    pub transactions: Vec<String>,
    pub participants: Vec<AccountId>,
    pub start_date: Option<u64>,
    pub end_date: Option<u64>,
    pub community_id: Option<u64>,
    pub new_community_title: Option<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct ReportMilestones {
    pub description: String,
    pub attachments: Vec<String>,
    pub payment: u32,
    pub complete_pct: u8,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum OperationOptions {
    Tooling,
    Salaries,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum ReportFundCategory {
    FundsTransfer,
    ProjectOnboarding,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum ReportFundSubCategory {
    Development,
    Marketing,
    Operations(OperationOptions),
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct ReportFunds {
    pub category: ReportFundCategory,
    pub sub_category: Option<ReportFundSubCategory>,
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
pub enum VersionedReportFunds {
    V1(ReportFunds),
    // V2(ReportFundsV2),
}

impl ReportFundsInput {
    pub fn validate(&self) {
        if self.category == ReportFundCategory::FundsTransfer {
            require!(
                self.sub_category.is_some(),
                "Sub category is required for Funds Transfer"
            );

            if let Some(sub_category) = &self.sub_category {
                match sub_category {
                    ReportFundSubCategory::Development => {
                        require!(self.transactions.len() > 0, "No transactions for Development report");
                        require!(self.milestones.len() > 0, "No milestones for Development report");
                        require!(self.community_id.is_some(), "No community selected for Development report");
                    },
                    ReportFundSubCategory::Marketing => {
                        require!(self.participants.len() > 0, "No participants for Marketing report");
                        require!(self.ipfs_proofs.len() > 0, "No IPFS proofs for Marketing report");
                        require!(self.start_date.is_some(), "No date for Marketing report");
                        require!(self.transactions.len() > 0, "No transactions for Marketing report");
                    },
                    ReportFundSubCategory::Operations(operation) => {
                        require!(
                            matches!(operation, OperationOptions::Tooling | OperationOptions::Salaries),
                            "Invalid operation option"
                        );

                        if let OperationOptions::Tooling = operation {
                            require!(self.ipfs_proofs.len() > 0, "No IPFS proofs for Operational report");
                        } else if let OperationOptions::Salaries = operation {
                            require!(self.transactions.len() > 0, "No transactions for Operational report");
                        }
                    }
                }
            }
        } else {
            require!(
                self.community_id.is_some() || self.new_community_title.is_some(),
                "Select Community or add Title to create new community"
            );

            require!(self.milestones.len() > 0, "No milestones for new Project/dApp onboarding");
        }
    }
}

impl VersionedReportFunds {
    pub fn latest_version(&self) -> &ReportFunds {
        match self {
            VersionedReportFunds::V1(report_funds) => report_funds,
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

impl From<VersionedReportFunds> for ReportFunds {
    fn from(vi: VersionedReportFunds) -> Self {
        match vi {
            VersionedReportFunds::V1(v1) => v1,
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

impl From<ReportFunds> for VersionedReportFunds {
    fn from(report_funds: ReportFunds) -> Self {
        VersionedReportFunds::V1(report_funds)
    }
}
