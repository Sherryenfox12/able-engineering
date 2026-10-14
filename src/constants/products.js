// Product catalogue used by the Products page.
//
// HOW TO ADD A PRODUCT
//   1. Put the photo in /public/products/ (e.g. /public/products/tc-31a-ball-screw.jpg)
//   2. Add one object to PRODUCTS below, with image: '/products/tc-31a-ball-screw.jpg'
//   Products without an image automatically show a tidy placeholder.
//
// Keep `highlights` SHORT (2-3 items) - customers can ask for full details via WhatsApp.

export const PRODUCT_CATEGORIES = [
  { id: 'machine', label: 'Machine', blurb: 'Used CNC machines, mainly Brother machining centres.' },
  { id: 'ball-screw', label: 'Ball Screw & Cover', blurb: 'Ball screw axis sets and covers for Brother machines.' },
  { id: 'lm-guide', label: 'LM Guide', blurb: 'Linear motion guides and blocks.' },
  { id: 'motor', label: 'Motor', blurb: 'Servo and spindle motors.' },
  { id: 'amplifier', label: 'Amplifier', blurb: 'Servo amplifiers and drives.' },
  { id: 'spare-parts', label: 'Spare Parts', blurb: 'Tool changers, control boards and other CNC parts.' },
]

export const PRODUCTS = [
  // ---------------- Machines ----------------
  {
    id: 'brother-speedio-s1000x1',
    category: 'machine',
    name: 'Brother SPEEDIO S1000X1',
    condition: 'Used',
    image:
      'https://www.yamazen.com/Portals/0/brother-speedio-s1000x1-machine-min.png?ver=w70tM-wxC_xh6PXsLCr_mw%3D%3D?format=webp',
    summary: 'High-speed compact machining centre built for precision and productivity.',
    highlights: ['Brother SPEEDIO series', '21-tool turret', 'Advanced digital control'],
    featured: true,
  },
  {
    id: 'brother-tc-31b-machine',
    category: 'machine',
    name: 'Brother TC-31B',
    condition: 'Used',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/5/310057709/BO/EC/FR/13595935/114-500x500.jpg',
    summary: 'Reliable vertical machining centre with proven build quality.',
    highlights: ['Brother vertical machining centre', 'Clear work view', 'Practical control panel'],
    featured: true,
  },

  // ---------------- Ball screws ----------------
  {
    id: 'ball-screw-x-tc-31a',
    category: 'ball-screw',
    name: 'Ball Screw Axis X - Brother TC-31A',
    condition: 'Parts',
    image: '',
    summary: 'X-axis ball screw set for Brother TC-31A.',
    highlights: ['Fits Brother TC-31A', 'X axis', 'Ball screw & nut'],
  },
  {
    id: 'ball-screw-x-tc-20a',
    category: 'ball-screw',
    name: 'Ball Screw Axis X - Brother TC-20A',
    condition: 'Parts',
    image: '',
    summary: 'X-axis ball screw set for Brother TC-20A.',
    highlights: ['Fits Brother TC-20A', 'X axis', 'Ball screw & nut'],
  },
  {
    id: 'ball-screw-x-tc-31b',
    category: 'ball-screw',
    name: 'Ball Screw Axis X - Brother TC-31B',
    condition: 'Parts',
    image: '',
    summary: 'X-axis ball screw set for Brother TC-31B.',
    highlights: ['Fits Brother TC-31B', 'X axis', 'Ball screw & nut'],
  },

  // ---------------- SAMPLE ITEMS (placeholders - replace with real stock) ----------------

  // LM Guide
  {
    id: 'lm-guide-block-set',
    category: 'lm-guide',
    name: 'LM Guide Block & Rail Set',
    condition: 'Parts',
    image: '',
    summary: 'Linear motion guide rail with sliding blocks for smooth, precise axis movement.',
    highlights: ['Rail & block set', 'For X / Y / Z axis', 'Cut to length on request'],
  },
  {
    id: 'lm-guide-block-only',
    category: 'lm-guide',
    name: 'LM Guide Slide Block',
    condition: 'Parts',
    image: '',
    summary: 'Replacement slide block to restore smooth travel and positioning accuracy.',
    highlights: ['Replacement block', 'Flanged type', 'Brother machines'],
  },
  {
    id: 'lm-guide-grease-nipple',
    category: 'lm-guide',
    name: 'LM Guide Lubrication Unit',
    condition: 'Parts',
    image: '',
    summary: 'Lubrication unit that keeps LM guide blocks protected and running longer.',
    highlights: ['Extends guide life', 'Easy to fit', 'Compatible units on request'],
  },

  // Motor
  {
    id: 'servo-motor-axis',
    category: 'motor',
    name: 'AC Servo Motor',
    condition: 'Used',
    image: '',
    summary: 'Axis servo motor for X / Y / Z drive, tested before sale.',
    highlights: ['X / Y / Z axis', 'Tested working', 'Brother & other brands'],
  },
  {
    id: 'spindle-motor',
    category: 'motor',
    name: 'Spindle Motor',
    condition: 'Used',
    image: '',
    summary: 'High-speed spindle motor for machining centres.',
    highlights: ['High-speed type', 'Tested working', 'Repair also available'],
  },
  {
    id: 'servo-motor-mitsubishi',
    category: 'motor',
    name: 'Mitsubishi Servo Motor',
    condition: 'Used',
    image: '',
    summary: 'Mitsubishi Electric servo motor for CNC and automation use.',
    highlights: ['Mitsubishi Electric', 'Tested working', 'Model list on request'],
  },

  // Amplifier
  {
    id: 'servo-amplifier',
    category: 'amplifier',
    name: 'Servo Amplifier',
    condition: 'Used',
    image: '',
    summary: 'Servo amplifier that drives and controls axis motors.',
    highlights: ['Axis drive', 'Tested working', 'Repair also available'],
  },
  {
    id: 'spindle-amplifier',
    category: 'amplifier',
    name: 'Spindle Amplifier',
    condition: 'Used',
    image: '',
    summary: 'Spindle drive unit for stable speed control.',
    highlights: ['Spindle drive', 'Tested working', 'Brother machines'],
  },
  {
    id: 'power-supply-unit',
    category: 'amplifier',
    name: 'Power Supply Module',
    condition: 'Used',
    image: '',
    summary: 'Power supply module for CNC drive and control units.',
    highlights: ['Drive power supply', 'Tested working', 'Fast replacement'],
  },

  // Spare parts
  {
    id: 'tool-changer-arm',
    category: 'spare-parts',
    name: 'Tool Changer Unit',
    condition: 'Parts',
    image: '',
    summary: 'Automatic tool changer parts for reliable, fast tool changes.',
    highlights: ['ATC parts', 'Brother SPEEDIO / TC series', 'Repair also available'],
  },
  {
    id: 'control-board',
    category: 'spare-parts',
    name: 'CNC Control Board (PCB)',
    condition: 'Used',
    image: '',
    summary: 'Control and I/O circuit boards, tested and ready to install.',
    highlights: ['Control / I/O boards', 'Tested working', 'Board repair available'],
  },
  {
    id: 'pneumatic-cylinder',
    category: 'spare-parts',
    name: 'Pneumatic Cylinder & Valve',
    condition: 'Parts',
    image: '',
    summary: 'Air cylinders and solenoid valves for door, clamp and tool-change functions.',
    highlights: ['SMC & compatible', 'Cylinders & valves', 'Quick replacement'],
  },
  {
    id: 'operator-panel',
    category: 'spare-parts',
    name: 'Operator Panel & Screen',
    condition: 'Used',
    image: '',
    summary: 'Control panel, display and keypad replacements for your machine.',
    highlights: ['Panel & display', 'Tested working', 'Brother machines'],
  },
]
