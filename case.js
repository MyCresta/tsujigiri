/* Ordered case materials. The investigation interface reveals one act at a time. */
window.CASEFILE = {
  title: "Tsujigiri",
  subtitle: "The Kageura Crossing",
  setting: "Kageura, Japan · Late autumn, 1752",
  intro: [
    "Sōhei copied letters for people who could not write their own. He charged a copper for a love letter and nothing for a complaint. Tonight a woman found him dead at the east end of Kageura’s red bridge. His writing hand was still closed around a scrap of paper.",
    "Six weeks ago, someone attacked a stranger on this same road. People have a name for a swordsman who strikes a passerby in the dark. Tsujigiri. Already the word is passing from house to house.",
    "The town headman has asked your little company to sit with him until dawn. He will open his gates for the morning relay. Before the first rider goes, he needs an account he can put his name to. Sōhei left something in town for just such a morning."
  ],
  roles: [
    { name: "Reader", task: "Give each witness a voice. Distinguish what they saw from what they heard." },
    { name: "Cartographer", task: "Follow the roads with your finger. Put each account in a place." },
    { name: "Reckoner", task: "Keep the figures and the order of events. Read a result back to the group." },
    { name: "Skeptic", task: "Try the next-best explanation. Ask which piece of evidence rules it out." }
  ],
  acts: [
    {
      id: "the-crossing",
      title: "The copyist’s last errand",
      kicker: "The crossing",
      brief: "The watch brings in Tomo, who sells tea at the Reed Inn. She sets a pale wooden tally beside the inkstone. Somewhere across the river is its other half.",
      event: "The headman closes the road gates for the night. Six households keep waking lamps along the river. Outside the inquiry room, someone is carefully wringing out Sōhei’s coat.",
      items: [
        {
          id: "storm-witness", kind: "witness", title: "Tomo’s statement", subtitle: "Tea seller · Reed Inn",
          asset: "assets/evidence/storm-witness.webp", caption: "Tomo, who kept the kettle at the Reed Inn.",
          body: [
            "“At my inn Sōhei asked for a sheet of paper and the price of a cup of tea. He was always paying yesterday’s debts. He said he meant to leave his papers in one of the deposit chests across the river. The chests are for people with business at the relay, so any of us can send a sealed letter even after the scribes go home.”",
            "“He always set his niece Hana a little walking riddle when he left something for her. He folded this one under my saucer. He came back later and handed me the tally. ‘Keep the two together,’ he said. ‘She’ll know where to start.’ So I can tell you his first door was mine. As for his last, I have never had the knack of his riddles.”",
            "“Much later that night I went to take him his coat. I found him at the east bridgepost. He was dead. They speak of the tsujigiri as though that word has told them everything. It has told Hana nothing at all.”"
          ]
        },
        {
          id: "town-plan", kind: "map", title: "The two river roads", subtitle: "Kageura · Headman’s road plan",
          asset: "assets/evidence/map.webp", caption: "North is at the top. Each row names the two places facing each other and the crossing between them.",
          body: [
            "Along each bank, a lane runs north and south through the three places in order. An unbroken lane between two neighboring places counts as one stretch. Crossing the river from one place to its opposite also counts as one stretch. These are all the roads on Sōhei’s slip. All three crossings were open when he left the inn.",
            "The deposit chests stand on the east bank. Each stands at the place that gives it its name."
          ],
          table: { head: ["Position", "West bank", "Crossing", "East bank"], rows: [
            ["North", "Lamp House", "Reed Ferry", "Paper Loft"],
            ["Middle", "Relay Office", "Red Bridge", "Indigo Yard"],
            ["South", "Reed Inn", "Willow Footway", "Rice Store"]
          ] }
        },
        {
          id: "journey-slip", kind: "document", title: "The slip under the saucer", subtitle: "A walking riddle · Sōhei’s hand",
          caption: "Three lines on the back of an old tea bill, addressed to Hana.",
          body: [
            "“Little Hana, from Aunt Tomo’s door I counted three stretches to the chest. The middle stretch took me across the water. On the first and the last I walked beside it, with the river at the same hand both times.”",
            "“There the keeper took my papers and split me a tally. Set its cut edge to the drawer list, fetch them at first light, and I shall owe you a persimmon.”"
          ]
        },
        {
          id: "tally-half", kind: "object", title: "Half a deposit tally", subtitle: "From Tomo’s sleeve",
          asset: "assets/evidence/tally-half.webp", caption: "A pale split tally, with three deliberate cuts in its long edge.",
          body: [
            "Three clean, evenly spaced cuts mark the long edge. A chipped corner is rough and ragged. Tomo says she dropped the tally on the threshold when the watch came.",
            "The keeper cut the marks before splitting the tally. Its mate is tied to the paper packet in the chest."
          ]
        },
        {
          id: "drawer-list", kind: "document", title: "Keepers’ drawer list", subtitle: "Copied inside each chest lid",
          caption: "The three deposit keepers use different drawer orders.",
          body: ["Each cut on the long edge counts once. Choose the row for the chest you have reached. The drawer fronts carry a simple carved emblem."],
          table: { head: ["Chest", "One cut", "Two cuts", "Three cuts"], rows: [
            ["Paper Loft", "Reed", "Heron", "Carp"],
            ["Indigo Yard", "Carp", "Reed", "Heron"],
            ["Rice Store", "Heron", "Carp", "Reed"]
          ] }
        }
      ],
      puzzle: {
        title: "Claim the copyist’s packet",
        prompt: "Trace the three stretches from Tomo’s door. The keeper will open the drawer when you give the chest location and its emblem.",
        fields: [
          { id: "keeper", label: "Which chest?", options: ["Indigo Yard", "Rice Store", "Paper Loft"], answer: "Rice Store" },
          { id: "drawer", label: "Which drawer?", options: ["Carp", "Heron", "Reed"], answer: "Reed" }
        ],
        hints: [
          "Find Tomo’s inn on the west bank. The first stretch must follow the bank. Only one neighboring house lies along that lane.",
          "Walk north to the Relay Office. The river is on your right. Cross the Red Bridge, then turn so that the river is on your right once more.",
          "On the east bank that last turn takes you south to the Rice Store. Use its row on the drawer list and the three clean cuts."
        ],
        success: "The two pieces of wood fit. In the Rice Store’s reed drawer, a keeper finds Sōhei’s copies of the shelter books wrapped in oilcloth. On the outside Sōhei wrote, ‘Count what reached the people. Then look at what the town paid.’"
      }
    },
    {
      id: "the-stores",
      title: "What the river took",
      kicker: "The shelter accounts",
      brief: "After the last flood, families slept in four common shelters. The town paid for new sleeping mats. Sōhei had been visiting the people who unrolled them.",
      event: "Miyo comes in from the Paper Loft with her hair still pinned up for work. She asks the headman for a stick of charcoal. ‘I was the one at the far end of that cart. Give me the back of your ledger.’",
      items: [
        {
          id: "cord-board", kind: "object", title: "The carrier’s cord board", subtitle: "Samples kept by the cart shed",
          asset: "assets/evidence/cord-board.webp", caption: "Three sample cords from the mat carrier’s rack.",
          body: ["The cart crew packed uneven orders in three sizes. Each entry in their carrier book counts a corded load. These are the crew’s own packing rules for this delivery."],
          table: { head: ["Cord", "What it held"], rows: [
            ["Rough straw", "One full roll of four sleeping mats"],
            ["Indigo-dyed cord", "One half roll of two sleeping mats"],
            ["Plain linen", "One loose sleeping mat"]
          ] }
        },
        {
          id: "carrier-book", kind: "document", title: "The cart gate count", subtitle: "Recorded before inspection",
          caption: "Loads counted when the delivery cart came in.",
          body: ["The gate clerk counted loads on the cart, before Miyo checked their condition. Each column records a number of cords, not a number of mats. The four names are the emblems on the shelter doors."],
          table: { head: ["Shelter", "Straw", "Indigo", "Linen"], rows: [
            ["Plum", "2", "2", "1"], ["Pine", "3", "0", "0"],
            ["Kite", "2", "1", "0"], ["Wave", "3", "1", "0"]
          ] }
        },
        {
          id: "loft-witness", kind: "witness", title: "Miyo’s corrections", subtitle: "Paper merchant · Delivery witness",
          asset: "assets/evidence/loft-witness.webp", caption: "Miyo kept the shelters’ dry stock under her own roof.",
          body: [
            "“At Wave I added the loose mat that had been drying on my rafters. It never went on the cart, so the boy at the gate never counted it. At Kite I sent the half roll back to the maker. It had soaked through. You must take that roll off the gate count.”",
            "“Plum and Pine got exactly what the cart carried. We never received another delivery. I know because I laid a place for each family with my own hands. At Kite the smallest children shared.”",
            "“I told all that to Sōhei. He asked if I was sure of the smallest children. I had to laugh. My grandsons are twins. At that age, if you have forgotten one, the other will tell you.”"
          ]
        },
        {
          id: "claim-roll", kind: "document", title: "The settled account", subtitle: "Shelter expenses · Paid in full",
          caption: "A fair copy of the quantities for which the town actually paid.",
          body: [
            "Each figure is in individual mats issued to a shelter. It includes any purchases an officer claimed to have made privately to complete the order. A payment for a privately bought mat is legitimate only if that mat actually reached the shelter.",
            "Four officers handled the relief money. Sōhei circled their names together in the margin. ‘The account can tell me which payment to question. It cannot tell me who stood on the bridge.’"
          ],
          table: { head: ["Plum", "Pine", "Kite", "Wave"], rows: [["13 mats", "12 mats", "14 mats", "15 mats"]] }
        }
      ],
      puzzle: {
        title: "Balance the shelter accounts",
        prompt: "One shelter was charged for mats that never arrived. Give the shelter, its actual delivery after Miyo’s corrections, and the number paid for in excess.",
        fields: [
          { id: "shelter", label: "Disputed shelter", options: ["Pine", "Kite", "Wave", "Plum"], answer: "Kite" },
          { id: "received", label: "Mats actually issued there", options: ["6", "8", "10", "12", "13", "14", "15"], answer: "8" },
          { id: "excess", label: "Mats paid for in excess", options: ["1", "2", "4", "6", "8"], answer: "6" }
        ],
        hints: [
          "Let one person read the cord board and another count each row of the carrier book. Apply Miyo’s testimony only after converting all the cords into mats.",
          "At Wave add one loose mat. At Kite remove two mats for the wet half roll. Plum and Pine need no correction.",
          "Kite’s cart carried ten mats, of which two went back. Compare the eight left at the shelter with the fourteen on the settled account."
        ],
        success: "Six mats paid for at Kite never arrived. The clerk turns back to the bundle of private payment slips. One officer swore that he bought precisely six additional mats for that shelter. The clerk goes to fetch the counterfoils. Until he returns, the watch can establish who was free to leave their post."
      }
    },
    {
      id: "the-watch",
      title: "A space between sounds",
      kicker: "The storm watch",
      brief: "Four relief officers had reason to speak to the copyist about his figures. In the dark, nobody looked at a clock. The people along the river marked the night by the work they did and the sounds that carried over the water.",
      event: "Isuke, the youngest porter, arrives with two different sandals on. He put them on in the dark when Tomo called. He sets his sister’s sewing basket on the table. Tomo found it under the bridge bench and brought it back to the inn.",
      items: [
        {
          id: "gate-witness", kind: "witness", title: "Isuke and the sewing basket", subtitle: "Relay porter · Last sighting",
          asset: "assets/evidence/gate-witness.webp", caption: "Isuke carried messages between the river crews that night.",
          body: [
            "“My sister Ume mends lanterns. Sōhei said she was meeting him and asked me to bring her sewing basket. He was sitting at the east bridgepost when the hoist clapper sounded. He held the basket up to his ear and said, ‘Do you think your needles heard it too?’ I put that on my word. He was alive when the clapper sounded.”",
            "“I left him there. By the time I got to the new braces at the Rice Store, Tomo was calling for help. The men on those braces were still leaning into them when I came through the door. They never let go while I was looking. After I told them what had happened, the store drum gave them leave to stand down.”"
          ]
        },
        {
          id: "signal-log", kind: "document", title: "The signal keeper’s slate", subtitle: "River work · Order of calls",
          caption: "The keeper wrote the calls down as they happened, highest line first.",
          body: ["These signals belong to flood work in Kageura. They divide the workers’ changes of duty. Each call sounds once during tonight’s account."],
          table: { head: ["In order", "Call", "What changed"], rows: [
            ["First", "Ferry gong", "Night crews took their first stations."],
            ["Second", "Hoist clapper", "The hoist was secured and the crews changed."],
            ["Third", "Store drum", "The new braces held and the crews changed again."],
            ["Fourth", "Gate rattle", "The last crews finished and signed out."]
          ] }
        },
        {
          id: "crew-roll", kind: "document", title: "The brace crews", subtitle: "Duty roll · Officers present",
          caption: "For each interval, the officers attested at the Paper Loft and Rice Store.",
          body: [
            "Both stations lie away from the east bridgepost. Two local workers at each station signed that the officer named in their column stayed beside them continuously from the first sound of the interval to the last.",
            "The four relief officers on the roll were Iori, Daigo, Kichibei and Renji. People near the road offered guesses about the officers off duty. The headman struck out the guesses."
          ],
          table: { head: ["Interval", "Paper Loft", "Rice Store"], rows: [
            ["Ferry gong to hoist clapper", "Renji", "Iori"],
            ["Hoist clapper to store drum", "Kichibei", "Daigo"],
            ["Store drum to gate rattle", "Iori", "Renji"]
          ] }
        },
        {
          id: "invitation", kind: "document", title: "Four invitations", subtitle: "Counterbook from Sōhei’s desk",
          caption: "Four leaves addressed to the relief officers, each bearing the same message.",
          body: [
            "“I shall wait at the east bridgepost with a woman who deserves a hearing. We have also an error in the Kite shelter account to put right. Come and speak before my papers go out on the morning relay.”",
            "Isuke delivered all four invitations before dark. A fifth leaf, addressed to Ume, has only a single line. “There will be a lamp this time. You have my word.”"
          ]
        }
      ],
      puzzle: {
        title: "Reconstruct the watch",
        prompt: "Place the killing between two signals. Then name the two invited officers whose whereabouts remain open for that whole interval.",
        fields: [
          { id: "interval", label: "Interval of the killing", options: ["Ferry gong to hoist clapper", "Hoist clapper to store drum", "Store drum to gate rattle"], answer: "Hoist clapper to store drum" },
          { id: "possible", label: "Officers still under inquiry", options: ["Daigo and Iori", "Kichibei and Renji", "Daigo and Kichibei", "Iori and Renji", "Daigo and Renji", "Iori and Kichibei"], answer: "Iori and Renji" }
        ],
        hints: [
          "Find the last moment at which someone spoke to Sōhei alive. Then find the first signal that came after Tomo had already called for help.",
          "He answered Isuke at the hoist clapper. Tomo had found him by the time Isuke reached the Rice Store, before the store drum.",
          "In that middle interval, Kichibei stayed at the Paper Loft and Daigo stayed at the Rice Store. Cross those two names off the invitations."
        ],
        success: "The watch excuses Daigo and Kichibei. The headman asks the two remaining officers to wait in separate rooms. Isuke leaves a candle on the threshold. His sister has been waiting outside, listening."
      }
    },
    {
      id: "the-hearing",
      title: "The woman at the rail",
      kicker: "The dawn hearing",
      brief: "Ume steps inside with a repaired lantern in her hands. The record of the earlier roadside attack calls her an unnamed traveler. ‘First,’ she says, ‘put down my name.’",
      event: "The clerk returns from the pay desk with its register. On the table lie the paper recovered from Sōhei’s hand and four old counterfoils. The first birds are beginning to call.",
      items: [
        {
          id: "hearing-witness", kind: "witness", title: "Ume gives her name", subtitle: "Lantern mender · Eyewitness",
          asset: "assets/evidence/hearing-witness.webp", caption: "Ume repaired the lantern she carried to her meeting with Sōhei.",
          body: [
            "“Six weeks ago I was walking home from mending lamps. A man I had never met stepped out of the dark. After he struck me, he looked at his sword with such interest that I knew I could run. My lamp fell over, but it lit his face. An old white scar divided his left eyebrow.”",
            "“A week ago I saw him again, lined up with the other three relief officers outside the pay desk. I could point him out in daylight. I had never learned his name. Tonight I wanted witnesses when I told him what he had done. I reached the rail in time to hear Sōhei say, ‘Give the shelter its money back. Then we will hear Ume.’ The man answered, ‘You have called them all here to hear her?’ He was facing my lamp. It was the same face. The same broken left brow.”",
            "“I saw him strike Sōhei. Sōhei caught a paper slip that hung from the man’s purse cord. It tore free in his hand. When the man turned towards me I dropped behind the river stair. Tomo came from the inn road a moment later. I wish I had gone out to her then.”"
          ]
        },
        {
          id: "pass-register", kind: "document", title: "The pass keeper’s descriptions", subtitle: "Renewal book · Four relief officers",
          caption: "A description taken in daylight when each officer renewed his road pass.",
          body: ["The keeper records left and right as they belong to the person described. These entries predate both incidents. Compare them with Ume’s words and the officers excluded by the brace crews."],
          table: { head: ["Officer", "Marks recorded"], rows: [
            ["Daigo", "Old white scar through left eyebrow. Small mark on chin."],
            ["Renji", "Old white scar through right eyebrow. Left eyebrow entire."],
            ["Iori", "Old white scar through left eyebrow. Both ears pierced in childhood."],
            ["Kichibei", "Both eyebrows entire. Burn on back of right hand."]
          ] }
        },
        {
          id: "wrapper", kind: "object", title: "The copyist’s last handful", subtitle: "Found at the east bridgepost",
          asset: "assets/evidence/wrapper.webp", caption: "A cloth wrapper protects the piece of paper taken from Sōhei’s closed hand.",
          body: [
            "Tomo wrapped the torn pay slip in her dry headcloth before the rain could soften it. The clerk unfolds it. The knot hole is at the top. Reading DOWN its torn edge, the paper sticks OUT, turns IN, then turns IN again.",
            "A blue fibre runs through the sheet exactly at the middle of those three turns. The writing on this half gives only the amount. It is the price of six sleeping mats.",
            "The pay desk splits each slip with both knot holes at the top. To reunite the halves, keep the holes at the top on both pieces. Each outward turn must meet an inward turn. The fibre must run unbroken across the join."
          ]
        },
        {
          id: "counterfoils", kind: "document", title: "Four counterfoils", subtitle: "Pay desk · The clerk’s register",
          caption: "Descriptions of the four torn edges, all read down from their knot holes.",
          body: [
            "Officers keep their torn pay slips on their purse cords until the week’s accounts close. Each mark identifies a voucher. All four are for the same sum. The register records the purpose claimed for each payment. Ume can say how one torn half came to be at the bridge.",
            "The following sheet gives the purpose entered by the collector. Pair the tear and the fibre before looking up the matching mark."
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
          caption: "A short extract from the payments register.",
          body: [
            "The collector of each sum declared that the named work was complete. The common shelters’ books and Miyo’s count independently establish which declaration was false.",
            "The headman lays a clean sheet on the table. ‘Give me the name that fits the witness and the watch. Give me the mark that fits the scrap. And tell me what the man with that slip took money for.’"
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
        prompt: "Name the man who struck Sōhei, reunite the pay slip he carried, and identify the declaration that the delivery evidence disproves.",
        fields: [
          { id: "officer", label: "Officer identified", options: ["Renji", "Daigo", "Iori", "Kichibei"], answer: "Iori" },
          { id: "voucher", label: "Matching counterfoil", options: ["Shell", "Fan", "Willow", "Crane"], answer: "Crane" },
          { id: "claim", label: "False declaration", options: ["Lantern paper for the watch", "Six mats for Kite shelter", "Timber for the relay", "New rope for the ferry"], answer: "Six mats for Kite shelter" }
        ],
        hints: [
          "One person can compare Ume’s description with the two names left after the watch. Another can trace the broken slip against the four counterfoils.",
          "Both Daigo and Iori have the left-brow scar. Only one could have been on the bridge. The slip needs an IN, OUT, OUT edge with a blue fibre at the middle turn.",
          "Daigo was at the Rice Store. Iori fits the sighting and the interval. The Crane counterfoil fits the paper. Read its purpose against the Kite delivery."
        ],
        success: "The clerk sets the Crane half against the paper from Sōhei’s hand. The blue fibre joins. He records that Ume saw the slip come from Iori’s purse. Then he turns the book so she can see."
      }
    }
  ],
  ending: {
    title: "The first rider",
    paragraphs: [
      "The riders are stamping their feet in the yard when Iori asks for a brush. He admits that he took the price of the missing mats. Six weeks ago, he says, he wanted to try his sword on a stranger and counted on the dark to keep her nameless. At the red bridge he learned that Sōhei had found both the false payment and the woman who could identify him. He killed the copyist to keep him from speaking.",
      "The headman gives the morning rider three things for the district office. Ume’s signed account. The paired Crane voucher. The figures in Sōhei’s careful hand. Iori goes into custody. The house clerk opens the relief chest and enters the missing payment as a debt owed to the families at Kite.",
      "When Tomo opens her shutters, Hana is waiting with a persimmon. She had been saving it to pay her uncle back. Ume sits beside her and reads the first page of the copyist’s papers aloud. At the top he has written Ume’s name in full, with a little space after it for her to tell the story herself.",
      "The bridge is open by then. They sit a while longer."
    ]
  },
  history: {
    notes: [
      "Kageura, its residents and this inquiry are fictional. The year 1752 falls within the Tokugawa or Edo period. Post stations in Japan provided lodging and organized the transfer of goods using porters and horses. Kageura is an imagined stop on a branch road.",
      "Tsujigiri, written 辻斬り, refers to attacking a passerby with a sword and can also name the attacker. The term is associated with testing a blade or one’s skill. Tokugawa authorities treated it as a crime.",
      "Split tallies have historical precedent. The markings, storage chests, flood signals, payment vouchers and local accounting practices in this game were invented for Kageura. The event order is internal to the story. All documents are original English renderings of fictional records."
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
