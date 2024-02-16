#!/bin/bash

OWNER_ACCOUNT=mdao-owner.testnet
CONTRACT=v1.mdao-owner.testnet

near delete "$CONTRACT" "$OWNER_ACCOUNT" --force
near create-account "$CONTRACT" --masterAccount "$OWNER_ACCOUNT" --initialBalance 5

near deploy "$CONTRACT" ./res/mdao.wasm --initFunction new --initArgs '{}'

# -------- Data Seed --------
# Add DAO
 near call "$CONTRACT" add_dao '{"body": {"title":"First DAO", "handle":"first-dao", "description":"Some description...","logo_url":"logo", "banner_url":"banner","is_congress":false}, "owners":["'$OWNER_ACCOUNT'"], "category_list":[], "metrics":[], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"

# Add DAO Proposal
 near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"Proposal title", "description":"Proposal description...", "labels":[], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$OWNER_ACCOUNT"

# Like Proposal/Report
 near call "$CONTRACT" post_like '{"id":1}' --accountId "$OWNER_ACCOUNT"

# Add Comment
 near call "$CONTRACT" add_comment '{"post_id":1, "description":"Some comment text"}' --accountId "$OWNER_ACCOUNT"

# Add Comment reply
 near call "$CONTRACT" add_comment '{"post_id":1, "description":"Reply comment text", "reply_id":1}' --accountId "$OWNER_ACCOUNT"

# Like comment
 near call "$CONTRACT" comment_like '{"id":1}' --accountId "$OWNER_ACCOUNT"

# Remove like from post
 near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$OWNER_ACCOUNT"

# -------- Views --------
# near view "$CONTRACT" get_posts_by_author '{"author":"'$OWNER_ACCOUNT'"}'
# near view "$CONTRACT" get_dao_posts '{"dao_id":1}'
# near view "$CONTRACT" get_post_by_id '{"post_id":1}'

# -------- Smart-contract migration --------
# near call "$CONTRACT" unsafe_self_upgrade "$(base64 < res/mdao.wasm)" --base64 --accountId $OWNER_ACCOUNT --gas 300000000000000
