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
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Build DAO", "handle":"build-dao", "description":"Supports projects with open-source infrastructure & web applications, trains a growing community of Builders and Projects.","logo_url":"https://ipfs.near.social/ipfs/bafkreih3tpybg4ke3qnjzy7kl62av2zjtn7etwfhkzppppyulse6lrsijq", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Gaming DAO", "handle":"gaming-dao", "description":"Focuses on the development of the NEAR gaming ecosystem, increasing the number of games and players on NEAR.","logo_url":"https://ipfs.near.social/ipfs/bafkreice2ucs37bdbsywljcg2is5eqtrihk26btyuxnqofv5xttbeqenhm", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Projects Funding","Gaming"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Marketing DAO", "handle":"marketing-dao", "description":"Is a place for collaboration between Builders, Influencers, and Founders, to empower awareness and drive the growth of the NEAR Community and Ecosystem.","logo_url":"https://ipfs.near.social/ipfs/bafkreiakufnvhu6zmqn6h6mv25eoba7jihtikiumjpplwbnmqlcz5h4enu", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Marketing"], "metrics":[], "metadata":{"website":"https://near.org/ndcdev.near/widget/MDAO.App?page=home"}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Near Research Collective", "handle":"near-research-collective", "description":"Empowers and educates within the NEAR ecosystem, cultivating a new wave of experts in blockchain technology and its applications.","logo_url":"https://ipfs.near.social/ipfs/bafkreihqqh7mt5duaaxrxly4mbhi2lw7azh3cmzqh6oepth25tw6i54a5y", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Degen DAO", "handle":"degen-dao", "description":"Brings together experienced enthusiasts and empowers them to support the Near, Aurora, and NDC ecosystem, actively promoting, generating content, and attracting new users.","logo_url":"https://ipfs.near.social/ipfs/bafkreidimyjmiqwnbnm6ukjcj5mo3ezq4jsjl7yld53wvuve6bxq27svcu", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Marketing"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Onboard DAO", "handle":"onboard-dao", "description":"Is a place for collaboration between Builders, Influencers, and Founders, to empower awareness and drive the growth of the NEAR Community and Ecosystem.","logo_url":"https://ipfs.near.social/ipfs/bafkreif7d2lqujuiqm2q7frdw5vf2xmreqiwjdto7k2gkg4nidqejubha4", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Aurora Community DAO", "handle":"aurora-community-dao", "description":"Stands at the heart of the Aurora ecosystem, embodying collaboration, expanding user base, increasing transactions on Aurora  and Near networks.","logo_url":"https://ipfs.near.social/ipfs/bafkreicrzuu26iw7fbr5uxjnul7mpx7fbk6eex7jml6gwax72kajlhbc2a", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding","Projects Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Near Globe DAO", "handle":"near-globe-dao", "description":"Leads and supports regional communities to represent NEAR in different countries and work on building communities in specific languages.","logo_url":"https://ipfs.near.social/ipfs/bafkreiguw5wrgnlbczog5ao3jcj3tce33w57lrvqn6zfnu3b42nyfhpzja", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Regional Development"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"NFT DAO", "handle":"nft-dao", "description":"Is a community-driven initiative, aims to provide solutions and standards for NFTs on NEAR. Primary objective is to revitalize and expand the Near NFT ecosystem.","logo_url":"https://ipfs.near.social/ipfs/bafkreida5pz4kltz5joed77rwscdtyho7m5ptojysylg2j7lc67cauzjf4", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["NFT"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"SHE IS NEAR", "handle":"she-is-near", "description":"Empowers women on Near and fortifies the NEAR Protocol with fresh female talent, spreading awareness about NEAR within the Women-in-web3 communities.","logo_url":"https://ipfs.near.social/ipfs/bafkreidmwibzmgae343yxjddkw6v64yzbiyjjsl5y6vncjcee7akso5mpm", "banner_url":"","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"

#
## Add DAO Proposal
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"NEAR Media - March, 2024", "description":"Hello, NEAR Fam! We are excited to present our work here. It’s a wonderful experience to be with you all. Please Look out for our proposal!", "attachments":[], "labels":["near-media"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG)", "description":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG) Our vision is to revolutionize marketing, promotion, and community outreach efforts for blockchain companies through strategic leveraging of our extensive network and partnerships. By harnessing the power of our 47 LinkedIn Groups, combined with the Blockchain Industry Group (BIG), we aim to provide unparalleled visibility and engagement opportunities for brands within the blockchain ecosystem.", "attachments":[], "labels":[], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":1, "body":{"title":"ETH Denver Vibe Check 2.0", "description":"<b>ETH Denver Vibe Check 2.0</b><br />The second edition of Vibe Check is coming to Denver! Proof of Vibes is hosting and producing this event in partnership with Illust, Denver MCA, Denver Walls, Groovy Gravy, DotConnector, and Sukuri Protocol.", "attachments":[], "labels":["ar", "live-music", "food", "art", "web3", "vr"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":2, "body":{"title":"Zombie Killer Event - February, 2024", "description":"Create kill event for ZomLand community", "attachments":[], "labels":["zomland"], "metrics":{}, "reports":[], "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_dao_post '{"dao_id":2, "body":{"title":"Zombie Killer Event ended report", "description":"Zombie Killer Event ended with more than 13k Zombies killed! <br />💰The rewards have already been distributed to the 25 winners in their wallets according to the Leaderboard!", "attachments":[], "labels":["near-gaming", "zomland"], "metrics":{}, "proposal_id":4, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
#
#
## Like Proposal/Report
# NEAR_ENV=mainnet near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"
#
## Add Comment
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Impressive work presented at NEAR today!", "attachments":[]}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Thrilled to be part of the NEAR community! The presentation today was truly inspiring. It is great to see such innovative ideas coming to life! Looking forward to reviewing your proposal in detail. These events always remind me of the incredible talent and innovation within our community.", "attachments":[]}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Fantastic presentation! Waiting to explore your proposal in depth. The NEAR community never ceases to amaze.", "attachments":[]}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Ok, attached NEAR logo", "attachments":["https://near.org/_next/static/media/near-logo.1416a213.svg"]}' --accountId "$ACCOUNT_ID"
#
## Add Comment reply
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_id":1, "description":"Level 2 comment, some reply comment text", "attachments":[]}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":1, "description":"Level 2 comment. Thank you!", "attachments":[]}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":1, "description":"Level 2 comment. Thank you!", "attachments":[]}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":5, "description":"Level 3 comment. Yep, fantastic opportunity to witness the unveiling of your work at NEAR. Your enthusiasm is contagious, and I am eagerly anticipating the proposal. This gathering of like-minded individuals is what makes these events so special", "attachments":[]}' --accountId "$ACCOUNT_ID"
# NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":5, "description":"Level 3 comment. Agree, comment with 2 attachments!", "attachments":["https://public.bnbstatic.com/static/academy/uploads-original/e196996f8ae34464b849c4b6e0ea9112.png", "https://nearweek.com/uploads/embed,f_webp,w_320/placeholder_medium_1_b968e77065.jpg"]}' --accountId "$ACCOUNT_ID"
#
#
## Like comment
# NEAR_ENV=mainnet near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"
#
## Remove like from post
# NEAR_ENV=mainnet near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
