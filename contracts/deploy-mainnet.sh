#!/bin/bash

## ---- Backup contract:
# ACCOUNT_ID=backup-dao.near
# CONTRACT=v1.backup-dao.near

## ---- Main contract:
 ACCOUNT_ID=test-dao.near
 CONTRACT=v1.test-dao.near

 NEAR_ENV=mainnet near call "$CONTRACT" unsafe_self_state_cleanup '' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near delete "$CONTRACT" "$ACCOUNT_ID" --force
 NEAR_ENV=mainnet near create-account "$CONTRACT" --masterAccount "$ACCOUNT_ID" --initialBalance 7

## Full redeploy - cleanup storage and remove account
 NEAR_ENV=mainnet near deploy "$CONTRACT" ./res/mdao.wasm --initFunction new --initArgs '{}'

## Update contract
# NEAR_ENV=mainnet near deploy "$CONTRACT" ./res/mdao.wasm

## -------- Data Seed --------
## Add DAOs

 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"NDC", "handle":"ndc", "description":"","logo_url":"https://ipfs.near.social/ipfs/bafkreifwiv2wn3xwht4j5b5incugly7r7andg3ehlp7dxh4jtbylcqrlha", "banner_url":"","dao_type":"NDC"}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Build DAO", "handle":"build-dao", "account_id":"build.sputnik-dao.near", "description":"Supports projects with open-source infrastructure & web applications, trains a growing community of Builders and Projects.","logo_url":"https://ipfs.near.social/ipfs/bafkreih3tpybg4ke3qnjzy7kl62av2zjtn7etwfhkzppppyulse6lrsijq", "banner_url":"https://ipfs.near.social/ipfs/bafkreigalpr5v5cxw5slgyzw3voynhmx2s33w4wbjwlm6wzyp33l7wevoq","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Gaming DAO", "handle":"gaming-dao", "account_id":"gaming-dao.sputnik-dao.near", "description":"Focuses on the development of the NEAR gaming ecosystem, increasing the number of games and players on NEAR.","logo_url":"https://ipfs.near.social/ipfs/bafkreice2ucs37bdbsywljcg2is5eqtrihk26btyuxnqofv5xttbeqenhm", "banner_url":"https://ipfs.near.social/ipfs/bafkreibxm5mu7uau45park42ucxuaoalu5mi2sqmd3mtme64kbidhxao2i","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Projects Funding","Gaming"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Marketing DAO", "handle":"marketing-dao", "account_id":"marketing.sputnik-dao.near", "description":"Empowers collaboration between Builders, Influencers, and Founders.Brings awareness and drive the growth of the NEAR Community and Ecosystem.","logo_url":"https://ipfs.near.social/ipfs/bafkreiakufnvhu6zmqn6h6mv25eoba7jihtikiumjpplwbnmqlcz5h4enu", "banner_url":"https://ipfs.near.social/ipfs/bafkreicfyo53etls6ob6hwkkll2w27xulkt33oq5ymt2kbkndnb77nvu2a","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Marketing"], "metrics":[], "metadata":{"website":"https://near.org/ndcdev.near/widget/MDAO.App?page=home"}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Near Research Collective", "handle":"near-research-collective", "account_id":"research-collective.sputnik-dao.near", "description":"Empowers and educates within the NEAR ecosystem, cultivating a new wave of experts in blockchain technology and its applications.","logo_url":"https://ipfs.near.social/ipfs/bafkreihqqh7mt5duaaxrxly4mbhi2lw7azh3cmzqh6oepth25tw6i54a5y", "banner_url":"https://ipfs.near.social/ipfs/bafkreieuveej6jfh6u3ko7wukceqhktooenmd6omjboqlplbxvfc5nrdve","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Degen DAO", "handle":"degen-dao", "account_id":"ndc-degens.sputnik-dao.near", "description":"Brings together experienced enthusiasts and empowers them to support the Near, Aurora, and NDC ecosystem, actively promoting, generating content, and attracting new users.","logo_url":"https://ipfs.near.social/ipfs/bafkreidimyjmiqwnbnm6ukjcj5mo3ezq4jsjl7yld53wvuve6bxq27svcu", "banner_url":"https://ipfs.near.social/ipfs/bafkreidvahrk3owbuv5zeihdulnueg2qdctrkshhl2j7mky5vcn6hh3nce","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Marketing"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Onboard DAO", "handle":"onboard-dao", "account_id":"onboarddao.sputnik-dao.near", "description":"Is a place for collaboration between Builders, Influencers, and Founders, to empower awareness and drive the growth of the NEAR Community and Ecosystem.","logo_url":"https://ipfs.near.social/ipfs/bafkreif7d2lqujuiqm2q7frdw5vf2xmreqiwjdto7k2gkg4nidqejubha4", "banner_url":"https://ipfs.near.social/ipfs/bafkreiboy2xscy6vllumek7d3g6lvt746d5qdmwm6rovcyfs6h2heqgw5m","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Aurora Community DAO", "handle":"aurora-community-dao", "account_id":"ac_dao.near", "description":"Stands at the heart of the Aurora ecosystem, embodying collaboration, expanding user base, increasing transactions on Aurora  and Near networks.","logo_url":"https://ipfs.near.social/ipfs/bafkreicrzuu26iw7fbr5uxjnul7mpx7fbk6eex7jml6gwax72kajlhbc2a", "banner_url":"https://ipfs.near.social/ipfs/bafkreiecpgmtr7zeucrizhbtdrfo7dyiitalycus2nwlbf35h6rgbvxmj4","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding","Projects Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Near Globe DAO", "handle":"near-globe-dao", "account_id":"nearglobedao.sputnik-dao.near", "description":"Leads and supports regional communities to represent NEAR in different countries and work on building communities in specific languages.","logo_url":"https://ipfs.near.social/ipfs/bafkreiguw5wrgnlbczog5ao3jcj3tce33w57lrvqn6zfnu3b42nyfhpzja", "banner_url":"https://ipfs.near.social/ipfs/bafkreid4jfmjvz7t4yja2o5kkhdnlysetq7lvr4pqxxj7spj7cwtfmaiyq","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Regional Development"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"NFT DAO", "handle":"nft-dao", "account_id":"nearnftwg.sputnik-dao.near", "description":"Aims to provide solutions and standards for NFTs on NEAR. Primary objective is to revitalize and expand the Near NFT ecosystem.","logo_url":"https://ipfs.near.social/ipfs/bafkreida5pz4kltz5joed77rwscdtyho7m5ptojysylg2j7lc67cauzjf4", "banner_url":"https://ipfs.near.social/ipfs/bafkreic673qfqd32hgqfwskzh5aovrcuxdmqcpmpucz6jwfzzym5ypl2oq","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["NFT"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"SHE IS NEAR", "handle":"she-is-near", "account_id":"she-is-near.sputnik-dao.near", "description":"Empowers women on Near and fortifies the NEAR Protocol with fresh female talent, spreading awareness about NEAR within the Women-in-web3 communities.","logo_url":"https://ipfs.near.social/ipfs/bafkreidmwibzmgae343yxjddkw6v64yzbiyjjsl5y6vncjcee7akso5mpm", "banner_url":"https://ipfs.near.social/ipfs/bafkreigtxc7finmp6ywdwouji56m5aie3wtlcbzwm7nhs2rama44p22lku","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Africa Community DAO", "handle":"africa-community-dao", "description":"Leads and supports Africa regional communities. Aims to support growth and dApps development specifically for African users.","logo_url":"https://ipfs.near.social/ipfs/bafkreia64hznuedqg5z4ywwp7ryhphuv6c4psuo753twnwlqbutvugrkxm", "banner_url":"https://ipfs.near.social/ipfs/bafkreifmvtok2tgebbyxi27bdcwetvnv3hwulxrvqmhp24tr2nzqehaska","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Regional Development"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"
 NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"Freelancer DAO", "handle":"freelancer-dao", "description":"Empowers self-governed development and content creation. Supports new users education and onboarding.","logo_url":"https://ipfs.near.social/ipfs/bafkreia64hznuedqg5z4ywwp7ryhphuv6c4psuo753twnwlqbutvugrkxm", "banner_url":"https://ipfs.near.social/ipfs/bafkreifmvtok2tgebbyxi27bdcwetvnv3hwulxrvqmhp24tr2nzqehaska","dao_type":"DAO"}, "owners":["'$ACCOUNT_ID'"], "verticals":["Ecosystem Funding"], "metrics":[], "metadata":{}}' --accountId "$CONTRACT"

# Add Communities
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"zomland", "title":"Zomland", "description":"ZomLand is an interactive P2E NFT card game with exciting gameplay and a lot of fun. ", "logo_url":"https://ipfs.near.social/ipfs/bafkreihjdumhjzt27ybka4av4bspwhevpsvxrtywso3injjldqpu3dbwnu", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"boneyard-gaming", "title":"Boneyard Gaming", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreiepzlnfbbskveylhsgf6z6ltrpvfqxxwpaxxfzsid4kadkw4nlqm4", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"marma", "title":"Marma", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreial4eokhjq2tzatij3f3v7jg4y5v7ivcrm5dtshbi6pstmjo4rsae", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"bloksy-royale", "title":"Bloksy Royale", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreib7ya575x5bdimv3lmnx32sbh5wjpkoclxximnteytm5djecxftzi", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"vex", "title":"VEX", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreid7a3u6zi4qkskuxqgsmss7gbw4jm3wreuku5wfx6d7bl6qdakixy", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"],  "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"spear-on-near", "title":"Spear on NEAR", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreigq6kur3ioduyo3mafqneaf24syamnl35scu3jwc7zerplzsmbewa", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"meteor-wallet", "title":"Meteor Wallet", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreibmmrunaghewheeyqizoyejij2lsjs2foz32tnemltmfdjjaz3uuy", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"here-wallet", "title":"HERE Wallet", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreieuwsmt3cfr56z5w6n2vqm5wqddw7hx4k6csuxogs33sr6km2xmzy", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"2048", "title":"2048", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreib33ebpn57quj7rityubwpmngef4jb6iteqdcxvpcx47nagzopbw4", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"aurora-play", "title":"Aurora Play", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreia7qvmzhas72sv5y42ly5rf25ufd7yulsmnuquqzbuwuvceccufp4", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"aurora-tip-bot", "title":"Aurora Tip Bot", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreigi4b2wfgoxncqtlgdjtecvfphirirnaotydx6zj2crte4rydu4yq", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"mental-maze", "title":"Mental Maze", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreiebq6mgpt7764ntyoiptgkrak75nplymd6rfb3totq4u6zfqrwbqm", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"orbit", "title":"Orbit", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreicitq7purr2dmky75dxfgxyy247bjvqotvfwwojih4woutyuqceae", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"pipeflare", "title":"PipeFlare", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreib5gt5gxat2ca75slssqpkhjbwkv3wk7xmypeyjiy2odwinosna2u", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"sookast", "title":"SOOKAST", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreicvyp4hw7imberhvcvevgykne2napmsv7ebtxu724fqmmcpniioqu", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"synergy", "title":"Synergy", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreiavxmr6gdeznaevhjeqnevdjawovvtqevgx5chcvqx2jbl373laum", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"talentum", "title":"Talentum", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreigdimmiugukwrglwcxnolwk4l6xoce7p2rdxiadjncz4fwqypw6ny", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":2, "community_input":{"handle":"wordl", "title":"Wordl", "description":"", "logo_url":"https://ipfs.near.social/ipfs/bafkreiay4mudunrbpvknonst4ema4vmxbd3j2t3gfbv5znj5iso64wclaq", "banner_url":"", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{}}' --accountId "$ACCOUNT_ID"

#
# Add DAO Proposal
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"NEAR Media - March, 2024", "description":"Hello, NEAR Fam! We are excited to present our work here. It’s a wonderful experience to be with you all. Please Look out for our proposal!", "attachments":[], "labels":["near-media"], "metrics":{}, "reports":[], "requested_amount": 1200, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG)", "description":"Marketing and Community Outreach Grant Proposal from the Blockchain Industry Group (BIG) Our vision is to revolutionize marketing, promotion, and community outreach efforts for blockchain companies through strategic leveraging of our extensive network and partnerships. By harnessing the power of our 47 LinkedIn Groups, combined with the Blockchain Industry Group (BIG), we aim to provide unparalleled visibility and engagement opportunities for brands within the blockchain ecosystem.", "attachments":[], "labels":[], "metrics":{}, "reports":[], "requested_amount": 7000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"ETH Denver Vibe Check 2.0", "description":"<b>ETH Denver Vibe Check 2.0</b><br />The second edition of Vibe Check is coming to Denver! Proof of Vibes is hosting and producing this event in partnership with Illust, Denver MCA, Denver Walls, Groovy Gravy, DotConnector, and Sukuri Protocol.", "attachments":[], "labels":["ar", "live-music", "food", "art", "web3", "vr"], "metrics":{}, "reports":[], "requested_amount": 800, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Zombie Killer Event ended report", "description":"Zombie Killer Event ended with more than 13k Zombies killed! <br />💰The rewards have already been distributed to the 25 winners in their wallets according to the Leaderboard!", "attachments":[], "labels":["near-gaming", "zomland"], "metrics":{}, "proposal_id":4, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":2, "body":{"title":"Zombie Killer Event - February, 2024", "description":"Create kill event for ZomLand community", "attachments":[], "labels":["zomland"], "metrics":{}, "reports":[], "requested_amount": 3000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":3, "body":{"title":"NEAR Developer Conference 2024", "description":"We are thrilled to announce the NEAR Developer Conference 2024! Event dedicated to developers, innovators, and creators in the NEAR ecosystem. The conference will feature workshops, keynote speeches, and networking opportunities to explore the latest in blockchain technology and its applications. Stay tuned for more details!", "attachments":[], "labels":["near-blockchain", "innovation"], "metrics":{}, "reports":[], "requested_amount": 500, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":3, "body":{"title":"Sustainable Blockchain Solutions Challenge", "description":"We are launching the Sustainable Blockchain Solutions Challenge! This initiative aims to encourage projects that leverage blockchain technology for sustainable environmental solutions. Participants can submit their projects for a chance to win funding and support from our expert panel.", "attachments":[], "labels":["sustainability", "blockchain-innovation", "challenge"], "metrics":{}, "reports":[], "requested_amount": 2500, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":3, "body":{"title":"NEAR Education Grant Program", "description":"Introducing the NEAR Education Grant Program, aimed at supporting educational initiatives and projects that promote blockchain literacy and skills. We invite educational institutions, non-profits, and community leaders to apply for grants to launch or expand their blockchain education efforts.", "attachments":[], "labels":["education", "blockchain-literacy", "grants"], "metrics":{}, "reports":[], "requested_amount": 15700, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":3, "body":{"title":"NEAR Art Gallery Virtual Exhibition", "description":"Join us for the NEAR Art Gallery Virtual Exhibition, showcasing the works of artists from around the world who are integrating blockchain technology into their art. This virtual event will feature interactive galleries, artist talks, and live performances.", "attachments":[], "labels":["art", "virtual-exhibition", "blockchain-art"], "metrics":{}, "proposal_id":2, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":3, "body":{"title":"Blockchain for Social Impact Initiative", "description":"We are excited to launch the Blockchain for Social Impact Initiative. This program focuses on supporting projects that use blockchain technology to create positive social change. Projects focusing on areas like financial inclusion, healthcare, and education are encouraged to apply.", "attachments":[], "labels":[], "metrics":{}, "reports":[], "requested_amount": 20000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"

# Change posts status to new
 NEAR_ENV=mainnet near call "$CONTRACT" change_post_status '{"id":1, "status":"New"}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" change_post_status '{"id":2, "status":"New"}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" change_post_status '{"id":3, "status":"Closed"}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" change_post_status '{"id":4, "status":"New"}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" change_post_status '{"id":6, "status":"New"}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" change_post_status '{"id":7, "status":"Rejected"}' --accountId "$ACCOUNT_ID"

# Like Proposal/Report
 NEAR_ENV=mainnet near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"

# Add Comment
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Impressive work presented at NEAR today!", "attachments":[]}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Thrilled to be part of the NEAR community! The presentation today was truly inspiring. It is great to see such innovative ideas coming to life! Looking forward to reviewing your proposal in detail. These events always remind me of the incredible talent and innovation within our community.", "attachments":[]}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Fantastic presentation! Waiting to explore your proposal in depth. The NEAR community never ceases to amaze.", "attachments":[]}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Ok, attached NEAR logo", "attachments":["https://near.org/_next/static/media/near-logo.1416a213.svg"]}' --accountId "$ACCOUNT_ID"

# Add Comment reply
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_id":1, "description":"Level 2 comment, some reply comment text", "attachments":[]}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":1, "description":"Level 2 comment. Thank you!", "attachments":[]}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":1, "description":"Level 2 comment. Thank you!", "attachments":[]}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":5, "description":"Level 3 comment. Yep, fantastic opportunity to witness the unveiling of your work at NEAR. Your enthusiasm is contagious, and I am eagerly anticipating the proposal. This gathering of like-minded individuals is what makes these events so special", "attachments":[]}' --accountId "$ACCOUNT_ID"
 NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "reply_to":5, "description":"Level 3 comment. Agree, comment with 2 attachments!", "attachments":["https://public.bnbstatic.com/static/academy/uploads-original/e196996f8ae34464b849c4b6e0ea9112.png", "https://nearweek.com/uploads/embed,f_webp,w_320/placeholder_medium_1_b968e77065.jpg"]}' --accountId "$ACCOUNT_ID"

# Like comment
 NEAR_ENV=mainnet near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"