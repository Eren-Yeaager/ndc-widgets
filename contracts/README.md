# MDAO smart-contract

## Overview

The smart contract responsible for managing DAOs, communities, requests/reports, and permissions made available via the [MDAO frontend](https://mdao.near.social).

## Getting Started

### Requirements

- NEAR CLI
- Rust 1.6.9+

## Building

From the root directory, run:

```bash
cd contracts
./build.sh
```

## Deploying

Using [NEAR CLI RS](https://github.com/near/near-cli-rs), run the following command. Be sure to set your own account id and corresponding network.

```bash
cd contracts
near contract deploy mdao-owner.testnet use-file ./res/mdao.wasm with-init-call new json-args {} prepaid-gas '1 TGas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send
```

```bash
cd contracts

 ACCOUNT_ID=test-dao.near
 CONTRACT=v3.test-dao.near

near call "$CONTRACT" unsafe_self_upgrade "$(base64 < res/mdao.wasm)" --base64 --accountId $ACCOUNT_ID --gas 300000000000000
```

## Running Tests

From the root directory, run:

```bash
npm run contract:test
```

## Smart-contract methods

To use the smart-contract methods, you need to set variables:

```bash
ACCOUNT_ID=test-dao.near
CONTRACT=v1.test-dao.near
```

### DAO

- Add DAO/NDC (dao_type param)
```bash
NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"First DAO", "handle":"first-dao", "account_id":"some_account_id.near", "checkin_account_id":"aurora.dao-check.near", "description":"Some description...","logo_url":"logo url", "banner_url":"banner url","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["vertical1","vertical2"], "metrics":["metric-title"], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"
```
dao_type options: NDC, DAO

- Edit DAO/NDC
```bash
NEAR_ENV=mainnet near call "$CONTRACT" edit_dao '{"id":1, "body": {"title":"First DAO updated", "handle":"first-dao", "account_id":"some_account_id.near", "description":"Some description...","logo_url":"logo url", "banner_url":"banner url","dao_type":"DAO"}, "verticals":["vertical1","vertical2"], "metrics":["metric-title"], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"
```

- Edit Council Members
```bash
NEAR_ENV=mainnet near call "$CONTRACT" edit_dao_owners '{"id":1, "owners":["'$ACCOUNT_ID'"]}' --accountId "$ACCOUNT_ID"
```

- Get list of all DAOs, NDC included (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_list ''
```

- Get list of DAOs by type, "DAO" or "NDC" (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_list '{"dao_type":"DAO"}'
```


- Get DAO by ID (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_by_id '{"id":1}'
```

- Get DAO by handle (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_by_handle '{"handle":"first-dao"}'
```


### Requests/reports

- Add Proposal

```bash
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Proposal title", "description":"Proposal description", "attachments":["some_url"], "labels":["label1","label2"], "metrics":{"metric-title":"metric-value"}, "reports":[], "requested_amount": 1000, "post_type": "Proposal", "proposal_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Add Report

```bash
# Funds Transfer > Development funding
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title ", "description":"Report description", "attachments":[], "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "report_funding":{"category":"FundsTransfer", "sub_category":"Development", "transactions":["tx_hash"], "milestones":[{"description":"Some Text", "attachment":"", "payment":1000, "complete_pct":0}], "community_id":1}, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"

# Funds Transfer > Marketing campaign (end_date is optional)
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title", "description":"Report description", "attachments":[], "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "report_funding":{"category":"FundsTransfer", "sub_category":"Marketing", "transactions":["tx_hash"], "participants":["account1.near"], "ipfs_proofs":["ipfs_url"], "start_date":1713360000, "end_date":"1713399999"}, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"

# Operational Spending > Tooling
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title", "description":"Report description", "attachments":[], "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "report_funding":{"category":"FundsTransfer", "sub_category":"OperationTooling", "ipfs_proofs":["ipfs_url"]}, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"

# Operational Spending > Salaries
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title", "description":"Report description", "attachments":[], "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "report_funding":{"category":"FundsTransfer", "sub_category":"OperationSalaries", "transactions":["tx_hash"]}, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"

# New project/dApp > existing project
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title", "description":"Report description", "attachments":[], "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "report_funding":{"category":"ProjectOnboarding", "community_id":1, "milestones":[{"description":"Some Text", "attachment":"", "payment":1000, "complete_pct":0}]}, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"

# New project/dApp > new project
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title", "description":"Report description", "attachments":[], "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "report_funding":{"category":"ProjectOnboarding", "new_community_title":"Some new project", "milestones":[{"description":"Some Text", "attachment":"", "payment":1000, "complete_pct":0}]}, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```
NOTES:
report_funding > category options: FundsTransfer, ProjectOnboarding
report_funding > sub_category options: Development, Marketing, OperationTooling, OperationSalaries
complete_pct is % of milestone completion, 0-100

- Edit Proposal

```bash
NEAR_ENV=mainnet near call "$CONTRACT" edit_post '{"id":1, "body":{"title":"Proposal title upd", "description":"Proposal description upd", "attachments":[], "labels":["label1"], "metrics":{}, "reports":[], "requested_amount": 2000, "post_type": "Proposal", "proposal_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Edit Report

```bash
NEAR_ENV=mainnet near call "$CONTRACT" edit_post '{"id":1, "body":{"title":"Report title upd", "description":"Report description upd", "attachments":["some_url"], "labels":["label2"], "metrics":{}, "proposal_id":1, "funding":{}, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Change post status:

```bash
NEAR_ENV=mainnet near call "$CONTRACT" change_post_status '{"id":1, "status":"New"}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Change proposal state:

```bash
NEAR_ENV=mainnet near call "$CONTRACT" change_proposal_state '{"id":1, "state":{"dao_council_approved":true, "hom_approved":true, "coa_approved":true, "kyc_passed":true, "payment_executed":true, "report_accepted":true}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Change post spam status:

```bash
NEAR_ENV=mainnet near call "$CONTRACT" change_post_is_spam '{"id":1, "is_spam":true}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Like proposals/reports

```bash
NEAR_ENV=mainnet near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Remove like from proposals/reports

```bash
NEAR_ENV=mainnet near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Get all proposals/reports EXCEPT "in_review" for all DAO (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_all_posts '{"page":1, "limit":100}'
```

- Get all proposals/reports for specific DAO EXCEPT "in_review" (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_posts '{"dao_id":1, "page":1, "limit":100}'
```

- Get all DAO proposals/reports by status, for example "in_review" (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_posts '{"dao_id":1, "status":"InReview", "page":1, "limit":100}'
```

Status list: InReview, New, Approved, Rejected, Closed

- Get proposals/reports by author (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_posts_by_author '{"author":"'$ACCOUNT_ID'", "page":1, "limit":100}'
```

- Get post by ID (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_post_by_id '{"id":1}'
```

- Get post snapshot history (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_post_history '{"id":1}'
```

- Get all post statuses and all proposal states (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_all_statuses ''
```

### Comments

- Add Comment

```bash
NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Some comment text", "attachments":["some_url"]}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Add reply to comment

```bash
NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"reply_to":1, "post_id":1, "description":"Reply comment text", "attachments":[]}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Edit comment

```bash
NEAR_ENV=mainnet near call "$CONTRACT" edit_comment '{"comment_id":1, "description":"Some text upd", "attachments":[]}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Change comment spam status:

```bash
NEAR_ENV=mainnet near call "$CONTRACT" change_comment_is_spam '{"id":1, "is_spam":true}' --deposit 0.01 --accountId "$ACCOUNT_ID"
```

- Get all comments for post (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_post_comments '{"post_id":1}'
```

- Get comment by ID (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_comment_by_id '{"id":1}'
```

- Get comments by author (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_comments_by_author '{"author":"'$ACCOUNT_ID'"}'
```

- Get comment history (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_comment_history '{"id":1}'
```

- Like comment

```bash
NEAR_ENV=mainnet near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Remove like from comment

```bash
NEAR_ENV=mainnet near call "$CONTRACT" comment_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
```


### Communities

- Add community

```bash
NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":1, "community_input":{"handle":"community-handle", "title":"Community title", "description":"Some description", "logo_url":"logo url", "banner_url":"banner url"}, "owners":["'$ACCOUNT_ID'"], "accounts":[], "verticals":[], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"
```

- Edit community

```bash
NEAR_ENV=mainnet near call "$CONTRACT" edit_community '{"id":1, "description":"Some description upd...","logo_url":"logo url upd", "banner_url":"banner url upd","owners":["'$ACCOUNT_ID'"], "accounts":[], "verticals":[], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"
```

- Remove community

```bash
NEAR_ENV=mainnet near call "$CONTRACT" remove_community '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Change community status

```bash
NEAR_ENV=mainnet near call "$CONTRACT" change_community_status '{"id":1, "status":"Inactive"}' --accountId "$ACCOUNT_ID"
```

- Get list of communities for DAO (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_communities '{"dao_list":[1,2,3]}'
```

- Get community by ID (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_community_by_id '{"id":1}'
```

- Get community by handle (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_community_by_handle '{"handle":"some-community"}'
```

- Get DAOs community smart-contracts list (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_community_accounts '{"dao_list":[2,3,4]}'
```

- Get list of all verticals (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_all_verticals ''
```

### Access Control

- Get user access roles (view)

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_account_access '{"account_id":"account.near"}'
```

### User

- User follow DAO

```bash
NEAR_ENV=mainnet near call "$CONTRACT" user_follow_dao '{"id":1}' --accountId "$ACCOUNT_ID"
```

- User follow Community

```bash
NEAR_ENV=mainnet near call "$CONTRACT" user_follow_community '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Get user follow DAO list

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_follow_dao '{"account_id":"'$ACCOUNT_ID'"}'
```

- Get user follow Community list

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_follow_community '{"account_id":"'$ACCOUNT_ID'"}'
```

- Add Event

```bash
NEAR_ENV=mainnet near call "$CONTRACT" add_event '{"dao_id":1, "event_input":{"title":"Event title", "description": "Event description", "image_url":"Image URL", "event_type":"Online", "start_timestamp":1710000000, "end_timestamp":1720000000}, "hosts":{}, "metadata":{}}' --accountId "$ACCOUNT_ID"
```
event_type options: Online / Offline
start_timestamp and end_timestamp are optional

- Edit Event

```bash
NEAR_ENV=mainnet near call "$CONTRACT" edit_event '{"id":1, "event_input":{"title":"Event title", "description": "Event description", "image_url":"Image URL", "event_type":"Online", "start_timestamp":1800000000}, "hosts":{}, "metadata":{}}' --accountId "$ACCOUNT_ID"
```

- Change Event Status

```bash
NEAR_ENV=mainnet near call "$CONTRACT" change_event_status '{"id":1, "status":"Inactive"}' --accountId "$ACCOUNT_ID"
```
status options: Active / Inactive

- Get list of Active events for DAO

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_all_events '{"page":1, "limit":100, "event_status":"Active", "dao_id":1}'
```

- Get list of all events

```bash
NEAR_ENV=mainnet near view "$CONTRACT" get_all_events '{"page":1, "limit":100}'
```