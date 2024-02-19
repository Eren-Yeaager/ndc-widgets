#!/bin/bash

ACCOUNT_ID=test-mdao.near
CONTRACT=v1.test-mdao.near

## Full redeploy
# NEAR_ENV=mainnet near delete "$CONTRACT" "$ACCOUNT_ID" --force
# NEAR_ENV=mainnet near create-account "$CONTRACT" --masterAccount "$ACCOUNT_ID" --initialBalance 5
# NEAR_ENV=mainnet near deploy "$CONTRACT" ./res/mdao.wasm --initFunction new --initArgs '{}'

 # Update
 NEAR_ENV=mainnet near deploy "$CONTRACT" ./res/mdao.wasm

## -------- Data Seed --------
## Add DAOs
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Marketing DAO", "handle":"marketing-dao", "description":"Marketing DAO is one of the longest standing community funding verticals of the NEAR ecosystem. Founded in 2021, the original vision for the Marketing DAO was to fund Passion Projects.","logo_url":"https://ipfs.near.social/ipfs/bafkreigx7nkumnrr5wx22ykgwb26zyo76miu3d2ogsl7y5wbamx2sxi3lm", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":["marketing", "ndc", "nft"], "metrics":[], "metadata":{"website":"https://near.org/ndcdev.near/widget/MDAO.App?page=home"}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Gaming DAO", "handle":"gaming-dao", "description":"Сommunity of gamers and game creators based on NEAR Protocol.","logo_url":"https://pbs.twimg.com/profile_images/1662444707144781828/V2OZ7XBo_400x400.jpg", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":["gaming", "nft"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"She is Near", "handle":"she-is-near-dao", "description":"She is Near description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":[], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Near Research Collective", "handle":"near-research-collective", "description":"Near Research Collective description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":["research"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Onboarding DAO", "handle":"onboarding-dao", "description":"Onboarding DAO description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":[], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Build DAO", "handle":"build-dao", "description":"Build DAO description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":[], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Aurora DAO", "handle":"aurora-dao", "description":"Aurora DAO description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":["aurora"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Degens DAO", "handle":"degens-dao", "description":"Degens DAO description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":[], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Globe DAO", "handle":"globe-dao", "description":"Globe DAO description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":[], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"NFT DAO", "handle":"nft-dao", "description":"NFT DAO description","logo_url":"", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "category_list":["nft"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
#
#
## Add DAO Proposal
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"NEAR Media - March, 2024", "description":"Hello, NEAR Fam! We are excited to present our work here. It’s a wonderful experience to be with you all. Please Look out for our proposal!", "labels":["near-media"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG)", "description":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG) Our vision is to revolutionize marketing, promotion, and community outreach efforts for blockchain companies through strategic leveraging of our extensive network and partnerships. By harnessing the power of our 47 LinkedIn Groups, combined with the Blockchain Industry Group (BIG), we aim to provide unparalleled visibility and engagement opportunities for brands within the blockchain ecosystem.", "labels":[], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"ETH Denver Vibe Check 2.0", "description":"<b>ETH Denver Vibe Check 2.0</b><br />The second edition of Vibe Check is coming to Denver! Proof of Vibes is hosting and producing this event in partnership with Illust, Denver MCA, Denver Walls, Groovy Gravy, DotConnector, and Sukuri Protocol.", "labels":["ar", "live-music", "food", "art", "web3", "vr"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
#
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":2, "body":{"title":"Zombie Killer Event - February, 2024", "description":"Create kill event for ZomLand community", "labels":["zomland"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":2, "body":{"title":"Zombie Killer Event ended report", "description":"Zombie Killer Event ended with more than 13k Zombies killed! <br />💰The rewards have already been distributed to the 25 winners in their wallets according to the Leaderboard!", "labels":["near-gaming", "zomland"], "metrics":{}, "proposal_id":4, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
#
#
## Like Proposal/Report
# NEAR_ENV=mainnet near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"
#
## Add Comment
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Impressive work presented at NEAR today!"}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Thrilled to be part of the NEAR community! The presentation today was truly inspiring. It is great to see such innovative ideas coming to life! Looking forward to reviewing your proposal in detail. These events always remind me of the incredible talent and innovation within our community."}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Fantastic presentation! Waiting to explore your proposal in depth. The NEAR community never ceases to amaze."}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Ok"}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":2, "description":"Thank you!"}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":6, "description":"Yep, fantastic opportunity to witness the unveiling of your work at NEAR. Your enthusiasm is contagious, and I am eagerly anticipating the proposal. This gathering of like-minded individuals is what makes these events so special"}' --accountId "$ACCOUNT_ID"
#
## Add Comment reply
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Reply comment text", "reply_id":1}' --accountId "$ACCOUNT_ID"
#
## Like comment
# NEAR_ENV=mainnet near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"
#
## Remove like from post
# NEAR_ENV=mainnet near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
