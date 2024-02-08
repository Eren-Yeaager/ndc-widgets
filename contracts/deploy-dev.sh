#!/bin/bash

OWNER_ACCOUNT=mdao-owner.testnet
CONTRACT=v1.mdao-owner.testnet

#near account create-account sponsor-by-faucet-service $CONTRACT autogenerate-new-keypair save-to-keychain network-config testnet create
#near contract deploy $CONTRACT use-file ./res/mdao.wasm with-init-call new json-args {} prepaid-gas '1 TGas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send
#near dev-deploy ./res/mdao.wasm --initFunction new --initArgs '{}' --accountId "$OWNER_ACCOUNT"

#near call "$CONTRACT" add_dao --accountId "$CONTRACT" --args '{"body": {"title":"First DAO", "handle":"first-dao", "description":"Some description...","logo_url":"logo", "banner_url":"banner","is_congress":false}, "owners":["'$OWNER_ACCOUNT'"], "category_list":[], "metrics":[], "metadata":{"website":"test website"}}'
#near call "$CONTRACT" add_dao_post --accountId $OWNER_ACCOUNT --args '{"dao_id":1, "body":{"title":"Post title", "description":"Post description...", "labels":[], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}'
#
#near view "$CONTRACT" get_posts_by_author '{"author":"'$OWNER_ACCOUNT'"}'
#near view "$CONTRACT" get_dao_posts '{"dao_id":1}'
#near view "$CONTRACT" get_post_by_id '{"post_id":1}'

# Migration - near call
#CONTRACT_BYTES=`cat ./res/mdao.wasm | base64`
#near call "$CONTRACT" unsafe_self_upgrade "$(base64 < res/mdao.wasm)" --base64 --accountId $OWNER_ACCOUNT --gas 300000000000000
