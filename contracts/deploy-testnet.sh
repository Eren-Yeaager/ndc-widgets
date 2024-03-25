#!/bin/bash

 ACCOUNT_ID=mdao-owner.testnet
 CONTRACT=v2.mdao-owner.testnet

 near call "$CONTRACT" unsafe_self_state_cleanup '' --accountId "$CONTRACT"
 near delete "$CONTRACT" "$ACCOUNT_ID" --force
 near create-account "$CONTRACT" --masterAccount "$ACCOUNT_ID" --initialBalance 10

 near deploy "$CONTRACT" ./res/mdao.wasm --initFunction new --initArgs '{}'

## -------- Data Seed --------

 DAO_OWNERS='["'"$ACCOUNT_ID"'","new_owner.testnet"]'

# Add DAO
 near call "$CONTRACT" add_dao '{"body": {"title":"NDC", "handle":"ndc", "description":"Some description...","logo_url":"logo", "banner_url":"banner","dao_type":"NDC"}, "owners":'"$DAO_OWNERS"', "verticals":["Gaming","NFT"], "metrics":[], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"
 near call "$CONTRACT" add_dao '{"body": {"title":"Second DAO", "handle":"second-dao", "account_id":"some_account2_id.testnet", "description":"Some description 2...","logo_url":"logo2", "banner_url":"banner2","dao_type":"DAO"}, "owners":'"$DAO_OWNERS"', "verticals":[], "metrics":[], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"

 near call "$CONTRACT" edit_dao '{"id":1, "body": {"title":"NDC updated", "handle":"ndc", "account_id":"some_account_id.near", "description":"Some description...","logo_url":"logo url", "banner_url":"banner url","dao_type":"DAO"}, "verticals":[], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 near call "$CONTRACT" edit_dao_owners '{"id":1, "owners":["'$ACCOUNT_ID'", "new_owner.testnet"]}' --accountId "$CONTRACT"

# Add DAO Proposal
#for i in {1..2}
#do
  near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Proposal title #1", "description":"Proposal description 1 Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1... @vlodkow.near @vlodkow1.near @vlodkow2.near @vlodkow3.near @vlodkow4.near @vlodkow5.near @vlodkow6.near @vlodkow7.near @vlodkow8.near @vlodkow9.near @vlodkow10.near", "attachments":[], "labels":[], "metrics":{}, "reports":[], "requested_amount": 3000, "post_type": "Proposal", "proposal_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
  near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title #2", "description":"Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...", "attachments":["https://some_attachment.com", "https://some2_attachment.com"], "labels":["report-label", "gaming"], "metrics":{}, "proposal_id":1, "post_type": "Report", "report_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
  near call "$CONTRACT" add_post '{"dao_id":2, "body":{"title":"Proposal title #3", "description":"Proposal description 3...", "attachments":[], "labels":[], "metrics":{}, "reports":[], "requested_amount": 10000, "post_type": "Proposal", "proposal_version": "V1"}}' --deposit 0.01 --accountId "$ACCOUNT_ID"
#done

# Like Proposal/Report
 near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"

# Add Comment
 near call "$CONTRACT" add_comment '{"post_id":1, "description":"Some comment text", "attachments":["https://attachment.com"]}' --deposit 0.01 --accountId "$ACCOUNT_ID"

# Add Comment reply
 near call "$CONTRACT" add_comment '{"post_id":1, "description":"Reply comment text", "attachments":[], "reply_id":1}' --deposit 0.01 --accountId "$ACCOUNT_ID"

# Like comment
 near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"

# Remove like from post
 near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"

# Add Community
 near call "$CONTRACT" add_community '{"dao_id":1, "community_input":{"handle":"community-handle", "title":"Community title", "description":"Some description", "logo_url":"logo url", "banner_url":"banner url", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" edit_community '{"id":1, "description":"Some description upd...","logo_url":"logo url upd", "banner_url":"banner url upd","owners":["'$ACCOUNT_ID'"], "accounts":[], "verticals":[], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" change_community_status '{"id":1, "status":"Inactive"}' --accountId "$ACCOUNT_ID"

# Edit proposal
 near call "$CONTRACT" edit_post '{"id":1, "body":{"title":"Proposal title upd", "description":"Proposal description upd", "attachments":[], "labels":["label1"], "metrics":{}, "reports":[], "requested_amount": 2000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"

# Edit report
 near call "$CONTRACT" edit_post '{"id":2, "body":{"title":"Report title upd", "description":"Report description upd", "attachments":["some_url"], "labels":["label2"], "metrics":{}, "proposal_id":1, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" change_post_is_spam '{"id":1, "is_spam":true}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" change_post_status '{"id":1, "status":"New"}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" change_proposal_state '{"id":1, "state":{"dao_council_approved":true, "hom_approved":true, "coa_approved":false, "report_accepted":true}}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" edit_comment '{"comment_id":1, "description":"Some text upd", "attachments":[]}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" change_comment_is_spam '{"id":1, "is_spam":true}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" user_follow_dao '{"id":1}' --accountId "$ACCOUNT_ID"

 near call "$CONTRACT" user_follow_community '{"id":1}' --accountId "$ACCOUNT_ID"

# Check views
 near view "$CONTRACT" get_dao_list ''
 near view "$CONTRACT" get_dao_list '{"dao_type":"DAO"}'
 near view "$CONTRACT" get_dao_by_id '{"id":1}'
 near view "$CONTRACT" get_dao_by_handle '{"handle":"second-dao"}'

 near view "$CONTRACT" get_all_posts '{"page":1, "limit":100}'
 near view "$CONTRACT" get_dao_posts '{"dao_id":1,"page":1, "limit":100}'
 near view "$CONTRACT" get_dao_posts '{"dao_id":1, "status":"InReview","page":1, "limit":100}'
 near view "$CONTRACT" get_posts_by_author '{"author":"'$ACCOUNT_ID'","page":1, "limit":100}'
 near view "$CONTRACT" get_post_by_id '{"id":1}'
 near view "$CONTRACT" get_post_history '{"id":1}'
 near view "$CONTRACT" get_all_statuses ''

 near view "$CONTRACT" get_post_comments '{"post_id":1}'
 near view "$CONTRACT" get_comment_by_id '{"id":1}'
 near view "$CONTRACT" get_comments_by_author '{"author":"'$ACCOUNT_ID'"}'
 near view "$CONTRACT" get_comment_history '{"id":1}'

near view "$CONTRACT" get_dao_communities '{"dao_id":1}'
near view "$CONTRACT" get_community_by_handle '{"handle":"community-handle"}'

near view "$CONTRACT" get_account_access '{"account_id":"'$ACCOUNT_ID'"}'
near view "$CONTRACT" get_follow_dao '{"account_id":"'$ACCOUNT_ID'"}'
near view "$CONTRACT" get_follow_community '{"account_id":"'$ACCOUNT_ID'"}'