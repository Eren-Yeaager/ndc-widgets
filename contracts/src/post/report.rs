use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use std::collections::HashMap;
use near_sdk::{require, NearSchema};
use super::{PostId};
use crate::{Vertical, CommunityId, MetricLabel, PostLabel};
use crate::post::report_funding::{ReportFunding, VersionedReportFunding};

// TODO: Remove V0
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct ReportV1 {
    pub title: String,
    pub description: String,
    pub attachments: Vec<String>,
    pub labels: Vec<PostLabel>,
    pub metrics: HashMap<MetricLabel, String>,
    pub community_id: Option<CommunityId>,
    pub vertical: Option<Vertical>,

    // Specific fields
    pub funding: HashMap<String, String>,
    pub proposal_id: Option<PostId>,
    #[serde(skip_deserializing)]
    pub is_spam: bool,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Report {
    pub title: String,
    pub description: String,
    pub attachments: Vec<String>,
    pub labels: Vec<PostLabel>,
    pub metrics: HashMap<MetricLabel, String>,
    pub community_id: Option<CommunityId>,
    pub vertical: Option<Vertical>,

    // Specific fields
    pub funding: VersionedReportFunding,
    pub proposal_id: Option<PostId>,
    #[serde(skip_deserializing)]
    pub is_spam: bool,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "report_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedReport {
    V1(ReportV1),
    V2(Report),
}

impl VersionedReport {
    pub fn latest_version(&self) -> Report {
        match self {
            VersionedReport::V1(report) => {
                Report {
                    title: report.title.clone(),
                    description: report.description.clone(),
                    attachments: report.attachments.clone(),
                    labels: report.labels.clone(),
                    metrics: report.metrics.clone(),
                    community_id: report.community_id.clone(),
                    vertical: report.vertical.clone(),
                    funding: ReportFunding::default().into(),
                    proposal_id: report.proposal_id.clone(),
                    is_spam: report.is_spam,
                }
            },
            VersionedReport::V2(report) => report.clone(),
            // Handle other versions as needed
        }
    }

    pub fn validate(&self) {
        let report = self.latest_version();

        require!(
            matches!(report.title.chars().count(), 5..=500),
            "Report title must contain 5 to 500 characters"
        );

        require!(
            !report.description.is_empty(),
            "No description provided for report"
        );
    }
}

impl From<VersionedReport> for Report {
    fn from(vi: VersionedReport) -> Self {
        match vi {
            VersionedReport::V1(v1) => v1.into(),
            VersionedReport::V2(v2) => v2,
        }
    }
}

impl From<ReportV1> for Report {
    fn from(report: ReportV1) -> Self {
        Report {
            title: report.title,
            description: report.description,
            attachments: report.attachments,
            labels: report.labels,
            metrics: report.metrics,
            community_id: report.community_id,
            vertical: report.vertical,
            funding: ReportFunding::default().into(),
            proposal_id: report.proposal_id,
            is_spam: report.is_spam,
        }
    }
}

impl From<Report> for VersionedReport {
    fn from(report: Report) -> Self {
        VersionedReport::V2(report)
    }
}
