#!/bin/bash

ACCOUNT_ID=mdao-owner.testnet
CONTRACT=v1.mdao-owner.testnet

## First deploy
# NEAR_ENV=mainnet near deploy "$CONTRACT" ./res/mdao.wasm

# Update
NEAR_ENV=mainnet near deploy "$CONTRACT" ./res/mdao.wasm --initFunction new --initArgs '{}'

## -------- Data Seed --------
## Add DAO
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Marketing DAO", "handle":"marketing-dao", "description":"Marketing DAO is one of the longest standing community funding verticals of the NEAR ecosystem. Founded in 2021, the original vision for the Marketing DAO was to fund Passion Projects.","logo_url":"https://ipfs.near.social/ipfs/bafkreigx7nkumnrr5wx22ykgwb26zyo76miu3d2ogsl7y5wbamx2sxi3lm", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":["gaming", "ndc", "nft"], "metrics":[], "metadata":{"website":"https://near.org/ndcdev.near/widget/MDAO.App?page=home"}}' --accountId "$CONTRACT"
#
## Add DAO Proposal
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"NEAR Media - March, 2024", "description":"Hello, NEAR Fam! We are excited to present our work here. It’s a wonderful experience to be with you all. Please Look out for our proposal!", "labels":["near-media"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
#
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG)", "description":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG) Our vision is to revolutionize marketing, promotion, and community outreach efforts for blockchain companies through strategic leveraging of our extensive network and partnerships. By harnessing the power of our 47 LinkedIn Groups, combined with the Blockchain Industry Group (BIG), we aim to provide unparalleled visibility and engagement opportunities for brands within the blockchain ecosystem.", "labels":[], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
#
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"ETH Denver Vibe Check 2.0", "description":"ETH Denver Vibe Check 2.0 <br />The second edition of Vibe Check is coming to Denver! Proof of Vibes is hosting and producing this event in partnership with Illust, Denver MCA, Denver Walls, Groovy Gravy, DotConnector, and Sukuri Protocol.", "labels":["ar", "live-music", "food", "art", "web3", "vr"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
#
## Like Proposal/Report
# NEAR_ENV=mainnet near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"
#
## Add Comment
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Some comment text"}' --accountId "$ACCOUNT_ID"
#
## Add Comment reply
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Reply comment text", "reply_id":1}' --accountId "$ACCOUNT_ID"
#
## Like comment
# NEAR_ENV=mainnet near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"
#
## Remove like from post
# NEAR_ENV=mainnet near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
