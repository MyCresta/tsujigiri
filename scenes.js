// Coordinates locate the center of each interactive exhibit in the full illustration.
window.SCENES = [
  {
    place: 'The Reed Inn',
    lead: 'The copyist is dead. Find the papers he left behind.',
    image: './assets/scenes/act1.webp', width: 1672, height: 941,
    spots: [
      { id: 'storm-witness', x: 18, y: 42, label: 'Tomo' },
      { id: 'town-plan', x: 73, y: 49, label: 'Road map' },
      { id: 'journey-slip', x: 38, y: 82, label: 'Folded slip' },
      { id: 'tally-half', x: 53, y: 81, label: 'Wooden tally' },
      { id: 'drawer-list', x: 92, y: 50, label: 'Drawer list' }
    ]
  },
  {
    place: 'The Paper Loft',
    lead: 'Check what the shelters received against what the town paid.',
    image: './assets/scenes/act2.webp', width: 1672, height: 941,
    spots: [
      { id: 'cord-board', x: 20.7, y: 51, label: 'Cord rack' },
      { id: 'carrier-book', x: 44.2, y: 75.5, label: 'Cart book' },
      { id: 'loft-witness', x: 62.2, y: 42, label: 'Miyo' },
      { id: 'claim-roll', x: 80.4, y: 70, label: 'Account roll' }
    ]
  },
  {
    place: 'The Relay Office',
    lead: 'Reconstruct the watch on the night of the killing.',
    image: './assets/scenes/act3.webp', width: 1672, height: 941,
    spots: [
      { id: 'gate-witness', x: 28, y: 40, label: 'Isuke' },
      { id: 'signal-log', x: 48, y: 37, label: 'Signal slate' },
      { id: 'crew-roll', x: 61, y: 72, label: 'Duty roll' },
      { id: 'invitation', x: 91, y: 57, label: 'Letters' }
    ]
  },
  {
    place: 'The Headman’s Room',
    lead: 'Bring the testimony and the physical evidence together.',
    image: './assets/scenes/act4.webp', width: 1672, height: 941,
    spots: [
      { id: 'hearing-witness', x: 30.7, y: 39, label: 'Ume' },
      { id: 'pass-register', x: 10, y: 65, label: 'Pass register' },
      { id: 'wrapper', x: 51.2, y: 79, label: 'Cloth wrapper' },
      { id: 'counterfoils', x: 66.3, y: 66.5, label: 'Counterfoils' },
      { id: 'payments', x: 84.2, y: 70.1, label: 'Payments' }
    ]
  }
];
