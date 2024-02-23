return {
  socialKey: "v3.ndc.mdao",
  contractName: "v1.test-mdao.near",
  assets: {
    logoWhite:
      "https://ipfs.near.social/ipfs/bafkreigycbheqwbwh73uqemyb4lt4r3dkmauubdkv5lio3nv3cdb6zguyq",
    logoColor:
      "https://ipfs.near.social/ipfs/bafkreieit24q3nlzzemyjblesy274gtlhjzbhmpfgpwfdfhjgntkhfc4fi",
    home: {
      hero: "https://ipfs.near.social/ipfs/bafkreihp7pgw377kch5eusvxhf3sqa54yf7uthoc5ldepza6gxwcdhekyu",
      puzzle:
        "https://ipfs.near.social/ipfs/bafkreicxfdmcfy7egla4x2i6ey3zpq5jni66eoxw7l7w6cmib3eh5zzb4e",
      support_bg:
        "https://ipfs.near.social/ipfs/bafkreihbp53f4mcvgi6mv2hyeslyudmsuw3tar5ypjfby5hz6qjt6kiudu",
    },
  },
  content: {
    home: {
      communityTreasury: {
        title: "Community Treasury",
        image:
          "https://ipfs.near.social/ipfs/bafkreihwcxkyr2pvfszwxpqs47y7gwlfz3363jead2odmrdwyqtqniuzca",
        metrics: {
          totalTreasury: "Total that we have",
          deliverTreasury: "How much was delivered",
          typeOfProject: "What types of projects do we support",
        },
      },

      whatIsNDC: {
        title: "What is NDC?",
        image:
          "https://ipfs.near.social/ipfs/bafkreiax4vgaur7pxljajkbmdedx5ynb6en7clh2vcrkciju5atd6xumiq",
        text: (
          <>
            <a href="https://app.neardc.org/">
              <b>Near Digital Collective</b>
            </a>{" "}
            (aka <a href="https://www.neardc.org/">NDC</a>) is the governance
            node of the Near blockchain ecosystem. NDC is the organisation that
            manages funding requests and learn more about the processes, ongoing
            initiatives and key members who participate in governance. The NDC's
            mission is to set up web3 governance on Near, restore grassroots
            community funding, and reboot the Near community by enabling
            community members to be rewarded for their contributions.
          </>
        ),
      },

      whatisGrassrootDAO: {
        title: "What is Grassroot DAO?",
        image:
          "https://ipfs.near.social/ipfs/bafkreiept3chqmiys74vvok62dmsp4i32wa4t754h5z6njx2hdw2zcx6wq",
        text: (
          <>
            <a href="">
              <b>NDC Grassroot DAO</b>
            </a>{" "}
            is a team of experts dedicated to contributing to the NEAR ecosystem
            Grassroot DAOs focus on specific areas\verticals like Engineering,
            Marketing, Gaming, Regional growth and employ their own grant
            program and funding strategy to funnel funds from the NDC.
          </>
        ),
      },

      createyourGrassrootDAO: {
        title: "Create your Grassroot DAO",
        items: {
          first:
            "Create your KPIs, process, prepare the team, create a presentation, and submit your proposal!",
          second: "Timelines: 13-19th of each month",
          third: (
            <a href={`//*__@replace:widgetPath__*/.App?page=proposals`}>
              Examples
            </a>
          ),
        },
      },

      GetFundingForYourProject: {
        title: "Get Funding for your project",
        image:
          "https://ipfs.near.social/ipfs/bafkreianbwxwl3i4ofrjicw7xsjizza2ixogaupcyu36b2n2uteui5povm",
        text: `Participate in Grassroot, as a member or a grant receiver (Join
          Ambassador Programs, Create Degen content and receive rewards,
          Participate in content creation or implement your development Idea and
          onboard 1mil users)`,
      },

      footerDesc:
        "Stay in the loop. Get the latest updates, announcements, opportunities, and insights from the ecosystem.",
    },
  },
  socials: {
    "twitter-x": "https://twitter.com/MarketingDAOers",
    telegram: "https://t.me/ndc_marketing",
    envelope: "mailto:marketingdao@proton.me",
  },
};
