# MDAO smart-contract

## Overview

The smart contract responsible for managing DAOs, communities, requests/reports, and permissions made available via the [MDAO frontend](https://mdao.near.social).

## Getting Started

### Requirements
- NEAR CLI
- Rust 1.6.9+

## Building

From the root directory, run:

```cmd
cd contracts
./build.sh
```

## Deploying

Using [NEAR CLI RS](https://github.com/near/near-cli-rs), run the following command. Be sure to set your own account id and corresponding network.

```cmd
cd contracts
near contract deploy mdao-owner.testnet use-file ./res/mdao.wasm with-init-call new json-args {} prepaid-gas '1 TGas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send
```

```cmd
cd contracts

ACCOUNT_ID=mdao-owner.testnet
CONTRACT=v1.mdao-owner.testnet

near call "$CONTRACT" unsafe_self_upgrade "$(base64 < res/mdao.wasm)" --base64 --accountId $ACCOUNT_ID --gas 300000000000000
```

## Running Tests

From the root directory, run:

```cmd
npm run contract:test
```

## Smart-contract methods

To use the smart-contract methods, you need to set variables: 
```cmd
ACCOUNT_ID=test-mdao.near
CONTRACT=v1.test-mdao.near
```

### DAO

- Add DAO
```cmd
near call "$CONTRACT" add_dao '{"body": {"title":"First DAO", "handle":"first-dao", "description":"Some description...","logo_url":"logo url", "banner_url":"banner url","is_congress":false}, "owners":["'$OWNER_ACCOUNT'", "owner2.testnet"], "category_list":["label1","label2"], "metrics":["metric-title"], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"
```

- Get list of all DAOs (view)
```cmd
near view "$CONTRACT" get_dao_list ''
```

- Get DAO by ID (view)
```cmd
near view "$CONTRACT" get_dao_by_id '{"id":1}'
```

- Get DAO by handle (view)
```cmd
near view "$CONTRACT" get_dao_by_handle '{"handle":"first-dao"}'
```

### Requests/reports

- Add Proposal
```cmd
near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"Proposal title", "description":"Proposal description", "labels":["label1","label2"], "metrics":{"metric-title":"metric-value"}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
```

- Add Report
```cmd
near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"Report title", "description":"Report description", "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
```


- Edit proposal
```cmd
near call "$CONTRACT" edit_dao_post '{"id":1, "body":{"title":"Proposal title upd", "description":"Proposal description upd", "labels":["label1"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
```


- Edit report
```cmd
near call "$CONTRACT" edit_dao_post '{"id":1, "body":{"title":"Report title upd", "description":"Report description upd", "labels":["label2"], "metrics":{}, "proposal_id":1, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
```


- Like proposals/reports
```cmd
near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"
```


- Remove like from proposals/reports
```cmd
near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Get all proposals/reports EXCEPT "in_review" (view)
```cmd
near view "$CONTRACT" get_all_posts '{"page":0, "limit":100}'
```


- Get all proposals/reports for specific DAO EXCEPT "in_review" (view)
```cmd
near view "$CONTRACT" get_dao_posts '{"dao_id":1}'
```


- Get all DAO proposals/reports by status, for example "in_review" (view)
```cmd
near view "$CONTRACT" get_dao_posts '{"dao_id":1, "status":"InReview"}'
```
Status list: InReview, New, Approved, Rejected, Closed


- Get proposals/reports by author (view)
```cmd
 near view "$CONTRACT" get_posts_by_author '{"author":"'$ACCOUNT_ID'"}'
```


- Get post by ID (view)
```cmd
near view "$CONTRACT" get_post_by_id '{"id":1}'
```


- Get post history (view)
```cmd
near view "$CONTRACT" get_post_history '{"id":1}'
```


### Comments

- Add Comment
```cmd
near call "$CONTRACT" add_comment '{"post_id":1, "description":"Some comment text"}' --accountId "$ACCOUNT_ID"
```


- Add reply to comment
```cmd
near call "$CONTRACT" add_comment '{"reply_to":1, "post_id":1, "description":"Reply comment text"}' --accountId "$ACCOUNT_ID"
```

- Edit comment
```cmd
near call "$CONTRACT" edit_comment '{"id":1, "description":"Some text upd"}' --accountId "$ACCOUNT_ID"
```

- Get all comments for post (view)
```cmd
near view "$CONTRACT" get_post_comments '{"post_id":1}'
```


- Get comment by ID (view)
```cmd
near view "$CONTRACT" get_comment_by_id '{"id":1}'
```


- Get comments by author (view)
```cmd
near view "$CONTRACT" get_comments_by_author '{"author":"'$ACCOUNT_ID'"}'
```


- Get comment history (view)
```cmd
near view "$CONTRACT" get_comment_history '{"id":1}'
```


- Like comment
```cmd
near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Remove like from comment
```cmd
near call "$CONTRACT" comment_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
```

### Communities
- Add community
```cmd
```

- Edit community
```cmd
```

- Get list of DAO communities (view)
```cmd
near view "$CONTRACT" get_dao_communities '{"dao_id":1}'
```

- Get community by ID (view)
```cmd
near view "$CONTRACT" get_dao_communities '{"id":1}'
```

- Get community by handle (view)
```cmd
near view "$CONTRACT" get_community_by_handle '{"handle":"some-community"}'
```

### Access Control
- Get user access roles (view)
```cmd
near view "$CONTRACT" get_account_access '{"account_id":"account.near"}'
```