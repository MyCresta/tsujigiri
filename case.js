/* Ordered case materials. The investigation interface reveals one act at a time. */
window.CASEFILE = {
  title: "Tsujigiri",
  subtitle: "The Kageura Crossing",
  setting: "Kageura, Japan · Late autumn, 1752",
  intro: [
    "You are townspeople the headman trusts to hear witnesses and check the records. Sōhei wrote Kageura’s love letters for a copper and its complaints for free. Tonight he lies dead at the red bridge, paper clenched in his hand.",
    "Six weeks ago a stranger survived a sword attack on this road. Outside the inn you hear the word tsujigiri, a swordsman who strikes passersby. The headman wants to know whether the same man has struck again.",
    "At dawn the gates open and a rider leaves for the district office. The headman needs to sign your account before the rider leaves. Start with Tomo at the Reed Inn. Sōhei gave her something for safekeeping."
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
      event: "The road gates are shut. At the Reed Inn, strangers wait out the rain while Tomo clears a space on her tea table.",
      assignment: {
        question: "Where did Sōhei leave his packet, and which drawer holds it?",
        approach: "Follow his walking directions on the road map. Use the wooden tally to work out which drawer to ask the keeper to open.",
        firstLook: "Ask Tomo where the folded slip and the tally came from."
      },
      items: [
        {
          id: "storm-witness", kind: "witness", title: "Tomo’s statement", subtitle: "Tea seller · Reed Inn",
          asset: "assets/evidence/storm-witness.webp", caption: "Tomo at the Reed Inn.",
          exam: {
            purpose: "Sōhei gave his directions from a familiar doorstep. Tomo can place that door on the map.",
            action: "Listen for the place Tomo means by “my door.” Find that place on the road map."
          },
          body: [
            "“Sōhei left from my door, here at the Reed Inn. He meant to leave his papers in one of the deposit chests across the river.”",
            "“His niece Hana loves a walking riddle. He tucked one under my saucer for her, then he came back later and gave me this tally.”",
            "“He’d forgotten his coat again. When I took it to the east bridgepost that night, I found him dead.”"
          ]
        },
        {
          id: "town-plan", kind: "map", title: "The two river roads", subtitle: "Kageura · Headman’s road plan",
          asset: "assets/evidence/map.webp", caption: "North is up. Each crossing links the places in its row.",
          exam: {
            purpose: "The map shows which roads Sōhei could take and which buildings stand at their ends.",
            action: "Choose his starting place. Trace one road for each stretch in the slip and keep track of which hand faces the river."
          },
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
          exam: {
            purpose: "Sōhei wrote a route his niece could follow without knowing his destination.",
            action: "Read the slip aloud, one stretch at a time, while another player follows it on the road map."
          },
          body: [
            "“Hana, three stretches from Aunt Tomo’s door to the chest. The middle one crossed the river. On the first and last I kept the water on the same side of me.”",
            "“Match my tally’s cuts to the drawer list. I owe you a persimmon.”"
          ]
        },
        {
          id: "tally-half", kind: "object", title: "Half a deposit tally", subtitle: "From Tomo’s sleeve",
          asset: "assets/evidence/tally-half.webp", caption: "Three clean cuts along the split tally’s edge.",
          exam: {
            purpose: "The keeper marked the wood before splitting it. The cuts tell you how to claim the packet once you find the right chest.",
            action: "Inspect the long edge. Count the deliberate cuts and check what caused the damage at the corner."
          },
          body: [
            "The keeper cut the long edge before splitting the tally. Three cuts are smooth. The ragged corner chipped when Tomo dropped it.",
            "Its other half is tied to the packet. A keeper can hand back a sealed letter without reading a word of it."
          ]
        },
        {
          id: "drawer-list", kind: "document", title: "Keepers’ drawer list", subtitle: "Copied inside each chest lid",
          caption: "Drawer emblems by chest and tally.",
          exam: {
            purpose: "The same tally can mean different drawer emblems at different chests.",
            action: "Find the row for the place where the walk ends. Read across to the column that matches the tally."
          },
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
          "Set a finger on the door Tomo names. A stretch ends at the next place on the map.",
          "The middle stretch is the crossing. Follow the bank first and remember which hand faces the river.",
          "After the crossing, try each turn. Which keeps the river at that same hand? Use your destination’s drawer row and count only the keeper’s cuts."
        ],
        success: "The tally fits. In the Rice Store’s reed drawer are Sōhei’s shelter accounts. “Count what reached the people,” he wrote."
      }
    },
    {
      id: "the-stores",
      title: "What the river took",
      kicker: "Paper Loft",
      brief: "After the last flood, families slept in four communal shelters. Miyo saw them bed down. Sōhei went from door to door asking whether everyone had a mat.",
      event: "“Give me some charcoal,” Miyo says. “I helped unload that cart.”",
      assignment: {
        question: "Which shelter was overcharged, how many mats did it receive, and how many extra did the town pay for?",
        approach: "Work out what was on the cart for each shelter. Correct those totals with Miyo’s account, then compare them with the paid bill.",
        firstLook: "Look at the Cord rack. What exactly did the cart clerk count?"
      },
      items: [
        {
          id: "cord-board", kind: "object", title: "The carrier’s cord board", subtitle: "Samples kept by the cart shed",
          asset: "assets/evidence/cord-board.webp", caption: "Three specimens from the cart shed.",
          exam: {
            purpose: "The cart clerk recorded cords. Each kind held a different number of sleeping mats.",
            action: "Match the three cord samples to their load sizes. Keep those numbers beside the columns in the Cart book."
          },
          body: [
            "The carriers hung a sample of each binding on a peg. A clerk could count the loads as the cart went by, even in rain. Each cord tied one load."
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
          exam: {
            purpose: "This count tells you how many loads reached the gate before anyone checked the delivery.",
            action: "For each shelter, multiply the number of each kind of cord by the mats it held. Add the three results."
          },
          body: [
            "The clerk counted cords at the gate before Miyo checked the mats. The shelters took their names from the emblems painted on their doors."
          ],
          table: { head: ["Shelter", "Straw", "Indigo", "Linen"], rows: [
            ["Plum", "2", "2", "1"], ["Pine", "3", "0", "0"],
            ["Kite", "2", "1", "0"], ["Wave", "3", "1", "0"]
          ] }
        },
        {
          id: "loft-witness", kind: "witness", title: "Miyo’s corrections", subtitle: "Paper merchant · Delivery witness",
          asset: "assets/evidence/loft-witness.webp", caption: "Miyo kept spare stock in her loft.",
          exam: {
            purpose: "Miyo handled the mats after the clerk counted the cart. She can explain any difference between the cart and the shelter floor.",
            action: "Listen for anything added or sent back. Apply each change to the right shelter, using the Cord rack for roll sizes."
          },
          body: [
            "“At Wave shelter I added one loose mat from my own stock. I’d hung it on a rafter to dry, so it never went on the cart.”",
            "“At Kite shelter the middle of the half roll was still wet. I sent the whole half roll back, and my grandsons shared a mat.”",
            "“Plum and Pine received exactly what was on the cart. I kept the shelters’ keys until the families went home, and none of the four received another delivery.”"
          ]
        },
        {
          id: "claim-roll", kind: "document", title: "The settled account", subtitle: "Shelter expenses · Paid in full",
          caption: "Quantities the town paid for.",
          exam: {
            purpose: "The town paid this bill in full. Compare the amounts charged with what families actually received.",
            action: "Work across the four shelters. For each, subtract the corrected delivery from the number of mats paid for."
          },
          body: [
            "Figures are individual mats. The town paid the same agreed rate for cart deliveries and mats supplied from local stock. Officers could also claim repayment for private purchases delivered to a shelter.",
            "Four relief officers handled the money. In the margin Sōhei has written, “Ask the people who unrolled them.”"
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
          "The spare mat never passed the gate. The half roll that went back still appears in the cart count.",
          "For each shelter, put mats actually laid out beside mats paid for. Subtract the first figure from the second."
        ],
        success: "Six mats never reached Kite. An officer claimed that he bought those six himself. The clerk goes for the payment slips."
      }
    },
    {
      id: "the-watch",
      title: "A space between sounds",
      kicker: "Relay Office",
      brief: "The relay workers spent the storm shoring up buildings along the river. The officers changed posts at the sound of the work calls. Some have people who can vouch for where they stood.",
      event: "Isuke arrives in mismatched sandals, carrying a sewing basket Tomo recovered from beneath the bridge bench.",
      assignment: {
        question: "When was Sōhei killed, and which invited officers could have reached him?",
        approach: "Put the last sighting and the call for help in order. Use the duty records to check where each officer was during that interval.",
        firstLook: "Speak to Isuke. Which part of his journey can he place most precisely?"
      },
      items: [
        {
          id: "gate-witness", kind: "witness", title: "Isuke and the sewing basket", subtitle: "Relay porter · Last sighting",
          asset: "assets/evidence/gate-witness.webp", caption: "Isuke, the relay porter.",
          exam: {
            purpose: "Isuke saw Sōhei alive and later heard Tomo call for help. His journey puts those events in order.",
            action: "Listen for the sounds he heard at the bridge and at the Rice Store. Place each beside his observations."
          },
          body: [
            "“My sister Ume repairs lanterns, and she was due to meet Sōhei. I took her sewing basket to him at the east bridgepost.”",
            "“When the hoist clapper sounded, he raised the basket to his ear. ‘Did your needles hear that too?’ he asked me.”",
            "“I left Sōhei at the bridge and went down the lane. By the time I reached the Rice Store, Tomo was calling for help.”",
            "“The men had their shoulders against the new timber braces. I told them what I’d heard, and only after that did the store drum sound.”"
          ]
        },
        {
          id: "signal-log", kind: "document", title: "The signal keeper’s slate", subtitle: "River work · Order of calls",
          caption: "The calls in the order they sounded.",
          exam: {
            purpose: "The river crews kept time by their work calls. This slate gives their order that night.",
            action: "Find the calls Isuke remembers. Which part of the watch falls between the last sighting and news of the death?"
          },
          body: [
            "The workers had to hear their change of duty over the river and the rain. Each call on the slate sounded just once that night."
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
          exam: {
            purpose: "Workers at two stations can account for the officers who stayed with them. Their evidence applies only to the interval they signed for.",
            action: "Read the row for the interval you established. Cross its two posted officers off the list of invitees."
          },
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
          exam: {
            purpose: "Sōhei sent the same invitation to four officers. The copies establish who had a reason to come to the bridge.",
            action: "Check whom Isuke reached and when. Compare the invitation list with the officers accounted for on the duty roll."
          },
          body: [
            "“Meet me at the east bridgepost. A woman deserves a hearing. The Kite shelter account needs correcting.”",
            "Isuke delivered copies to Daigo, Iori, Kichibei and Renji before dark. Sōhei’s note to Ume reads, “There will be a lamp this time.”"
          ]
        }
      ],
      puzzle: {
        title: "Reconstruct the watch",
        prompt: "Between which calls was Sōhei killed? Which two officers still lack a witnessed alibi?",
        fields: [
          { id: "interval", label: "Interval of the killing", options: ["Ferry gong to hoist clapper", "Hoist clapper to store drum", "Store drum to gate rattle"], answer: "Hoist clapper to store drum" },
          { id: "possible", label: "Officers still under inquiry", options: ["Daigo and Iori", "Kichibei and Renji", "Daigo and Kichibei", "Iori and Renji", "Daigo and Renji", "Iori and Kichibei"], answer: "Iori and Renji" }
        ],
        hints: [
          "Find the last time Isuke heard Sōhei speak.",
          "One sound interrupted a conversation. Another came after news of the death. Find both sounds on the slate.",
          "Read only the row between those calls. Set the two posted officers aside and check which invitees remain."
        ],
        success: "Daigo and Kichibei are excused. Iori and Renji wait apart. Isuke lights a candle for his sister outside."
      }
    },
    {
      id: "the-hearing",
      title: "The woman at the rail",
      kicker: "Headman’s Room",
      brief: "The first account of the roadside attack calls its survivor “a traveler.” Ume sets her repaired lantern before the headman. “First, put down my name.”",
      event: "The clerk brings four counterfoils from the pay desk. Outside, the first birds call.",
      assignment: {
        question: "Who struck Sōhei, which payment slip did he carry, and what had he claimed?",
        approach: "Compare the eyewitness and the duty records to identify the man. Reunite the torn paper, then check its payment against the shelter accounts.",
        firstLook: "Hear Ume describe what she saw at the rail."
      },
      items: [
        {
          id: "hearing-witness", kind: "witness", title: "Ume gives her name", subtitle: "Lantern mender · Eyewitness",
          asset: "assets/evidence/hearing-witness.webp", caption: "Ume with her repaired lantern.",
          exam: {
            purpose: "Ume can connect a face and a piece of paper with the attack.",
            action: "Listen for how she recognized the man and how the paper changed hands. Check those details separately."
          },
          body: [
            "“Six weeks ago a stranger struck me on the road. My lamp fell sideways and lit his face from below. An old white scar ran through his left eyebrow.”",
            "“A week ago I saw him among the four relief officers at the pay desk. I knew his face, although I had never learned his name.”",
            "“Tonight I heard Sōhei say, ‘Give the shelter its money back. Then we will hear Ume.’ When the man turned toward my lamp, I saw the same face and brow.”",
            "“I saw him strike Sōhei. As Sōhei fell, his hand caught a paper slip on the man’s purse cord and tore it free.”",
            "“I hid on the river stair until Tomo came. I could hear her calling for help, and all that time I had my hand over my own mouth.”"
          ]
        },
        {
          id: "pass-register", kind: "document", title: "The pass keeper’s descriptions", subtitle: "Renewal book · Four relief officers",
          caption: "Descriptions taken before either attack.",
          exam: {
            purpose: "The keeper described each officer before either attack. Those descriptions can put names to Ume’s observation.",
            action: "Find every description that fits the witness. Test each name against the duty interval you established at the Relay Office."
          },
          body: [
            "The keeper entered these marks in daylight when the officers renewed their road passes. Left and right refer to the officer’s own body."
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
          exam: {
            purpose: "Tomo saved the torn paper from Sōhei’s hand. Part of its edge and a coloured fibre survived the rain.",
            action: "Read down from the knot hole. Note the shape of each turn and where the blue fibre crosses."
          },
          body: [
            "Knot hole uppermost, the torn edge reads OUT, IN, IN from top to bottom. A blue fibre crosses at the middle turn.",
            "Both holes belong at the top. Outward turns fit inward turns. The fibre must meet across the join.",
            "A patch of dry ink gives the amount, the price of six sleeping mats. The clerk needs the other half to learn what the officer said he bought."
          ]
        },
        {
          id: "counterfoils", kind: "document", title: "Four counterfoils", subtitle: "Pay desk · The clerk’s register",
          caption: "Counterfoil edges read down from their knot holes.",
          exam: {
            purpose: "A counterfoil is the half the pay desk kept. A physical match identifies the voucher the attacker carried.",
            action: "Try joining each counterfoil to the recovered slip. Check the whole edge and the blue fibre."
          },
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
          exam: {
            purpose: "The matching voucher mark tells you what the collector said the town was paying for.",
            action: "Look up the mark you matched. Compare its claim with the delivery finding from the Paper Loft."
          },
          body: [
            "When a collector took the money he declared that the goods had been delivered. The clerk copied his words into the register."
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
          "Keep the holes uppermost. A hollow on one edge needs a bulge on the other. Check the fibre after fitting the turns.",
          "Two officers share the feature Ume saw. Check their alibis. Two counterfoils fit the edge. Compare their fibres before opening the payments register."
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
