/* Ordered case materials. The investigation interface reveals one act at a time. */
window.CASEFILE = {
  title: "Tsujigiri",
  subtitle: "The Kageura Crossing",
  setting: "Kageura, Japan · Late autumn, 1752",
  intro: [
    "Sōhei wrote love letters for a copper and complaints for free. Tonight the town copyist lies dead at the red bridge, a scrap of paper in his hand.",
    "Six weeks ago a stranger survived a sword attack on this road. Now Kageura whispers tsujigiri, a swordsman who strikes passersby.",
    "The headman needs your findings before the gates open at dawn. Sōhei left papers somewhere in town."
  ],
  roles: [
    { name: "Reader", task: "Read the witnesses’ words aloud." },
    { name: "Cartographer", task: "Trace each journey on the map." },
    { name: "Reckoner", task: "Check figures and signal times." },
    { name: "Skeptic", task: "Test another explanation against the evidence." }
  ],
  acts: [
    {
      id: "the-crossing",
      title: "The copyist’s last errand",
      kicker: "Reed Inn",
      brief: "Tomo lays a split tally by her tea bowl. Its mate is with Sōhei’s papers.",
      event: "The headman shuts the road gates. Rain ticks against the inn shutters.",
      items: [
        {
          id: "storm-witness", kind: "witness", title: "Tomo’s statement", subtitle: "Tea seller · Reed Inn",
          asset: "assets/evidence/storm-witness.webp", caption: "Tomo at the Reed Inn.",
          body: [
            "“Sōhei left from my door to put his papers in one of the deposit chests across the river.”",
            "“He left a walking riddle for his niece Hana under my saucer. Later he came back with this tally.”",
            "“I went to take him his coat that night. He was dead at the east bridgepost.”"
          ]
        },
        {
          id: "town-plan", kind: "map", title: "The two river roads", subtitle: "Kageura · Headman’s road plan",
          asset: "assets/evidence/map.webp", caption: "North is up. Each crossing links the places in its row.",
          body: [
            "Each bank has a north–south lane linking neighboring places. A lane between neighbors or a crossing counts as one stretch.",
            "All three crossings were open. These are the only roads. Each east-bank place has a deposit chest."
          ],
          table: { head: ["Position", "West bank", "Crossing", "East bank"], rows: [
            ["North", "Lamp House", "Reed Ferry", "Paper Loft"],
            ["Middle", "Relay Office", "Red Bridge", "Indigo Yard"],
            ["South", "Reed Inn", "Willow Footway", "Rice Store"]
          ] }
        },
        {
          id: "journey-slip", kind: "document", title: "The slip under the saucer", subtitle: "A walking riddle · Sōhei’s hand",
          caption: "A tea bill folded under Tomo’s saucer.",
          body: [
            "“Hana, three stretches from Aunt Tomo’s door to the chest. The middle one crossed the river. On the first and last I kept the water on the same side of me.”",
            "“Match my tally’s cuts to the drawer list. I owe you a persimmon.”"
          ]
        },
        {
          id: "tally-half", kind: "object", title: "Half a deposit tally", subtitle: "From Tomo’s sleeve",
          asset: "assets/evidence/tally-half.webp", caption: "Three clean cuts along the split tally’s edge.",
          body: [
            "The keeper cut the long edge before splitting the tally. Three cuts are smooth. The ragged corner chipped when Tomo dropped it.",
            "Its other half is tied to the packet."
          ]
        },
        {
          id: "drawer-list", kind: "document", title: "Keepers’ drawer list", subtitle: "Copied inside each chest lid",
          caption: "Drawer emblems by chest and tally.",
          body: [
            "Choose the chest’s row. Each long-edge cut counts once."
          ],
          table: { head: ["Chest", "One cut", "Two cuts", "Three cuts"], rows: [
            ["Paper Loft", "Reed", "Heron", "Carp"],
            ["Indigo Yard", "Carp", "Reed", "Heron"],
            ["Rice Store", "Heron", "Carp", "Reed"]
          ] }
        }
      ],
      puzzle: {
        title: "Claim the copyist’s packet",
        prompt: "Trace Sōhei’s walk. Name the chest and the drawer emblem.",
        fields: [
          { id: "keeper", label: "Which chest?", options: ["Indigo Yard", "Rice Store", "Paper Loft"], answer: "Rice Store" },
          { id: "drawer", label: "Which drawer?", options: ["Carp", "Heron", "Reed"], answer: "Reed" }
        ],
        hints: [
          "Start at the Reed Inn. Your first stretch follows the bank.",
          "Walk north, then cross. Which turn keeps the water on the same side?",
          "South takes you to the Rice Store. Read the three-cut column."
        ],
        success: "The tally fits. In the Rice Store’s reed drawer are Sōhei’s shelter accounts. “Count what reached the people,” he wrote."
      }
    },
    {
      id: "the-stores",
      title: "What the river took",
      kicker: "Paper Loft",
      brief: "At the Paper Loft, Miyo lays out the accounts for four flood shelters.",
      event: "“Give me some charcoal,” Miyo says. “I helped unload that cart.”",
      items: [
        {
          id: "cord-board", kind: "object", title: "The carrier’s cord board", subtitle: "Samples kept by the cart shed",
          asset: "assets/evidence/cord-board.webp", caption: "Three specimens from the cart shed.",
          body: [
            "Each cord tied one load. The crew used these three sizes."
          ],
          table: { head: ["Cord", "What it held"], rows: [
            ["Rough straw", "One full roll of four sleeping mats"],
            ["Indigo-dyed cord", "One half roll of two sleeping mats"],
            ["Plain linen", "One loose sleeping mat"]
          ] }
        },
        {
          id: "carrier-book", kind: "document", title: "The cart gate count", subtitle: "Recorded before inspection",
          caption: "The gate clerk’s count before unloading.",
          body: [
            "The clerk counted cords before Miyo checked the mats. Each shelter uses its door emblem."
          ],
          table: { head: ["Shelter", "Straw", "Indigo", "Linen"], rows: [
            ["Plum", "2", "2", "1"], ["Pine", "3", "0", "0"],
            ["Kite", "2", "1", "0"], ["Wave", "3", "1", "0"]
          ] }
        },
        {
          id: "loft-witness", kind: "witness", title: "Miyo’s corrections", subtitle: "Paper merchant · Delivery witness",
          asset: "assets/evidence/loft-witness.webp", caption: "Miyo kept spare stock in her loft.",
          body: [
            "“Wave got one extra loose mat from my rafters. It never went on the cart.”",
            "“Kite’s half roll was soaked, so I sent it back. My grandsons shared a mat there.”",
            "“Plum and Pine got their cart loads exactly. None of the four shelters received another delivery.”"
          ]
        },
        {
          id: "claim-roll", kind: "document", title: "The settled account", subtitle: "Shelter expenses · Paid in full",
          caption: "Quantities the town paid for.",
          body: [
            "Figures are individual mats. The total includes officers’ private purchases. A private purchase earned repayment only if the shelter received it.",
            "Four officers handled the money."
          ],
          table: { head: ["Plum", "Pine", "Kite", "Wave"], rows: [["13 mats", "12 mats", "14 mats", "15 mats"]] }
        }
      ],
      puzzle: {
        title: "Balance the shelter accounts",
        prompt: "Find the overcharged shelter. Compare mats received with mats paid for.",
        fields: [
          { id: "shelter", label: "Disputed shelter", options: ["Pine", "Kite", "Wave", "Plum"], answer: "Kite" },
          { id: "received", label: "Mats actually issued there", options: ["6", "8", "10", "12", "13", "14", "15"], answer: "8" },
          { id: "excess", label: "Mats paid for in excess", options: ["1", "2", "4", "6", "8"], answer: "6" }
        ],
        hints: [
          "Convert each cord into mats before applying Miyo’s corrections.",
          "Add one at Wave. Take two away at Kite.",
          "Kite received eight. Subtract eight from the fourteen paid for."
        ],
        success: "Six mats never reached Kite. An officer claimed that he bought those six himself. The clerk goes for the payment slips."
      }
    },
    {
      id: "the-watch",
      title: "A space between sounds",
      kicker: "Relay Office",
      brief: "Four officers were invited to the bridge. Find out who could have gone.",
      event: "Isuke arrives in mismatched sandals, carrying a sewing basket Tomo recovered from beneath the bridge bench.",
      items: [
        {
          id: "gate-witness", kind: "witness", title: "Isuke and the sewing basket", subtitle: "Relay porter · Last sighting",
          asset: "assets/evidence/gate-witness.webp", caption: "Isuke, the relay porter.",
          body: [
            "“My sister Ume mends lanterns. I took her sewing basket to Sōhei at the east bridgepost.”",
            "“The hoist clapper sounded. Sōhei raised the basket and asked, ‘Did your needles hear that too?’”",
            "“I left him there. Tomo was calling for help when I reached the Rice Store braces.”",
            "“The men were still leaning on them. The store drum sounded after I told them.”"
          ]
        },
        {
          id: "signal-log", kind: "document", title: "The signal keeper’s slate", subtitle: "River work · Order of calls",
          caption: "The calls in the order they sounded.",
          body: [
            "Each flood-work signal sounded once and marked a change of duty."
          ],
          table: { head: ["In order", "Call", "What changed"], rows: [
            ["First", "Ferry gong", "Night crews took their first stations."],
            ["Second", "Hoist clapper", "The hoist was secured and the crews changed."],
            ["Third", "Store drum", "The new braces held and the crews changed again."],
            ["Fourth", "Gate rattle", "The last crews finished and signed out."]
          ] }
        },
        {
          id: "crew-roll", kind: "document", title: "The brace crews", subtitle: "Duty roll · Officers present",
          caption: "Officers stationed away from the bridge.",
          body: [
            "Two workers at each station swear its listed officer stayed throughout the interval. Neither station touches the east bridgepost.",
            "The four relief officers were Daigo, Iori, Kichibei and Renji."
          ],
          table: { head: ["Interval", "Paper Loft", "Rice Store"], rows: [
            ["Ferry gong to hoist clapper", "Renji", "Iori"],
            ["Hoist clapper to store drum", "Kichibei", "Daigo"],
            ["Store drum to gate rattle", "Iori", "Renji"]
          ] }
        },
        {
          id: "invitation", kind: "document", title: "Four invitations", subtitle: "Counterbook from Sōhei’s desk",
          caption: "Sōhei copied each invitation before sending it.",
          body: [
            "“Meet me at the east bridgepost. A woman deserves a hearing. The Kite shelter account needs correcting.”",
            "Isuke delivered this to all four officers before dark. Sōhei’s note to Ume reads, “There will be a lamp this time.”"
          ]
        }
      ],
      puzzle: {
        title: "Reconstruct the watch",
        prompt: "Between which calls was Sōhei killed? Which two officers were free?",
        fields: [
          { id: "interval", label: "Interval of the killing", options: ["Ferry gong to hoist clapper", "Hoist clapper to store drum", "Store drum to gate rattle"], answer: "Hoist clapper to store drum" },
          { id: "possible", label: "Officers still under inquiry", options: ["Daigo and Iori", "Kichibei and Renji", "Daigo and Kichibei", "Iori and Renji", "Daigo and Renji", "Iori and Kichibei"], answer: "Iori and Renji" }
        ],
        hints: [
          "Find the last time Isuke heard Sōhei speak.",
          "The clapper sounded while Sōhei lived. The drum came after Tomo called.",
          "Cross Kichibei and Daigo off the four invitations for that interval."
        ],
        success: "Daigo and Kichibei are excused. Iori and Renji wait apart. Isuke lights a candle for his sister outside."
      }
    },
    {
      id: "the-hearing",
      title: "The woman at the rail",
      kicker: "Headman’s Room",
      brief: "Ume sets her lantern before the headman. “First, put down my name.”",
      event: "The clerk brings four counterfoils from the pay desk. Outside, the first birds call.",
      items: [
        {
          id: "hearing-witness", kind: "witness", title: "Ume gives her name", subtitle: "Lantern mender · Eyewitness",
          asset: "assets/evidence/hearing-witness.webp", caption: "Ume with her repaired lantern.",
          body: [
            "“Six weeks ago a stranger struck me on the road. My fallen lamp lit an old white scar through his left eyebrow.”",
            "“I saw him again among the four relief officers at the pay desk. I knew his face, never his name.”",
            "“Tonight Sōhei said, ‘Give the shelter its money back. Then we will hear Ume.’ My lamp showed the same face and brow.”",
            "“I saw him strike Sōhei. As he fell, Sōhei caught a slip and tore it from the man’s purse cord.”",
            "“I hid behind the river stair. Tomo came moments later.”"
          ]
        },
        {
          id: "pass-register", kind: "document", title: "The pass keeper’s descriptions", subtitle: "Renewal book · Four relief officers",
          caption: "Descriptions taken before either attack.",
          body: [
            "Left and right refer to the officer’s own body. Compare Ume’s words and the brace crews’ roll."
          ],
          table: { head: ["Officer", "Marks recorded"], rows: [
            ["Daigo", "Old white scar through left eyebrow. Small mark on chin."],
            ["Renji", "Old white scar through right eyebrow. Left eyebrow entire."],
            ["Iori", "Old white scar through left eyebrow. Both ears pierced in childhood."],
            ["Kichibei", "Both eyebrows entire. Burn on back of right hand."]
          ] }
        },
        {
          id: "wrapper", kind: "object", title: "The copyist’s last handful", subtitle: "Found at the east bridgepost",
          asset: "assets/evidence/wrapper.webp", caption: "Tomo’s headcloth protects the torn slip.",
          body: [
            "Knot hole uppermost, the torn edge reads OUT, IN, IN from top to bottom. A blue fibre crosses at the middle turn.",
            "Both holes belong at the top. Outward turns fit inward turns. The fibre must meet across the join.",
            "The slip gives only an amount, the price of six sleeping mats."
          ]
        },
        {
          id: "counterfoils", kind: "document", title: "Four counterfoils", subtitle: "Pay desk · The clerk’s register",
          caption: "Counterfoil edges read down from their knot holes.",
          body: [
            "Officers kept pay slips on their purse cords until the week’s accounts closed. All four vouchers are for the same sum.",
            "Match the edge and fibre, then look up the voucher mark."
          ],
          table: { head: ["Mark", "Turns from the top", "Blue fibre"], rows: [
            ["Willow", "IN · OUT · OUT", "At the bottom turn"],
            ["Shell", "OUT · IN · IN", "At the middle turn"],
            ["Crane", "IN · OUT · OUT", "At the middle turn"],
            ["Fan", "IN · OUT · IN", "At the middle turn"]
          ] }
        },
        {
          id: "payments", kind: "document", title: "The voucher purposes", subtitle: "Pay desk · Entered upon collection",
          caption: "Declarations entered when the money was collected.",
          body: [
            "Each collector swore the work was complete. Check the declaration against the shelter count."
          ],
          table: { head: ["Mark", "Purpose named by the collector"], rows: [
            ["Fan", "New rope delivered for the ferry."],
            ["Crane", "Six privately purchased sleeping mats delivered to Kite shelter."],
            ["Willow", "A replacement beam delivered to the Relay Office."],
            ["Shell", "New lantern paper delivered to the flood watch."]
          ] }
        }
      ],
      puzzle: {
        title: "Enter your finding",
        prompt: "Identify the attacker, match the slip and name the false claim.",
        fields: [
          { id: "officer", label: "Officer identified", options: ["Renji", "Daigo", "Iori", "Kichibei"], answer: "Iori" },
          { id: "voucher", label: "Matching counterfoil", options: ["Shell", "Fan", "Willow", "Crane"], answer: "Crane" },
          { id: "claim", label: "False declaration", options: ["Lantern paper for the watch", "Six mats for Kite shelter", "Timber for the relay", "New rope for the ferry"], answer: "Six mats for Kite shelter" }
        ],
        hints: [
          "Compare the left-brow scar with the two officers left on the watch list.",
          "Find an IN, OUT, OUT counterfoil with its blue fibre at the middle.",
          "Daigo was at the Rice Store. Iori was free. Read the Crane payment against the Kite delivery."
        ],
        success: "The Crane halves fit. The clerk records Ume’s account of the slip torn from Iori’s purse."
      }
    }
  ],
  ending: {
    title: "The first rider",
    paragraphs: [
      "Iori asks for a brush. He admits taking the mat money. Six weeks ago he tried his sword on a stranger. At the bridge, he killed Sōhei, the copyist who had traced the false claim and brought Ume forward.",
      "Iori goes into custody. The first rider takes Ume’s statement, the joined voucher and Sōhei’s figures to the district office. The headman enters the debt owed to the Kite families.",
      "At the inn, Hana is waiting with a persimmon. Ume sits beside her and opens Sōhei’s papers. At the top of the first page he has written Ume’s name. She reads it aloud."
    ]
  },
  history: {
    notes: [
      "Kageura and its people are fictional. In 1752 Japan was under Tokugawa rule. Post stations provided lodging, porters and relay horses.",
      "Tsujigiri can mean a sword attack on a passerby or its perpetrator. Associated with testing a blade or skill, it was a crime.",
      "Split tallies have historical precedent. Kageura’s drawer marks, vouchers, flood signals and accounting rules were invented for this case. All records are fictional."
    ],
    sources: [
      { title: "Japan Search · Post Stations (Shukuba)", url: "https://jpsearch.go.jp/en/gallery/ndl-KV0dqVwa99UmBPB" },
      { title: "University of Manchester · Travels in Tokugawa Japan", url: "https://www.digitalexhibitions.manchester.ac.uk/s/travels-in-japan/page/introduction" },
      { title: "Japan Kanji Aptitude Testing Foundation · 辻斬り", url: "https://www.kanjipedia.jp/kotoba/0004912100" },
      { title: "Heibonsha World Encyclopedia via Kotobank · 辻斬", url: "https://kotobank.jp/word/%E8%BE%BB%E6%96%AC-1186446" },
      { title: "Komazawa University · Edo-period primer on merchandise and split tallies", url: "https://www.komazawa-u.ac.jp/~hagi/ko_tame50.html" }
    ]
  }
};
