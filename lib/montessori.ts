// Authentic Montessori curriculum areas and their core materials.
// Used by the progress-tracking and reports pages.

export const MONTESSORI_AREAS = [
  'Practical Life',
  'Sensorial',
  'Math',
  'Language',
  'Cultural',
] as const

export type MontessoriArea = (typeof MONTESSORI_AREAS)[number]

export const MATERIALS_BY_AREA: Record<MontessoriArea, string[]> = {
  'Practical Life': [
    'Pouring Water',
    'Spooning',
    'Dry Transfer with Tongs',
    'Buttoning Frame',
    'Bow-Tying Frame',
    'Table Washing',
    'Polishing',
    'Sweeping',
    'Care of Plants',
    'Walking on the Line',
    'Silence Game',
  ],
  Sensorial: [
    'Pink Tower',
    'Brown Stair',
    'Red Rods',
    'Knobbed Cylinders',
    'Knobless Cylinders',
    'Color Tablets',
    'Geometric Cabinet',
    'Constructive Triangles',
    'Binomial Cube',
    'Trinomial Cube',
    'Sound Cylinders',
    'Baric Tablets',
  ],
  Math: [
    'Number Rods',
    'Sandpaper Numbers',
    'Spindle Boxes',
    'Cards and Counters',
    'Golden Beads Introduction',
    'Teen Boards (Seguin)',
    'Ten Boards (Seguin)',
    'Hundred Board',
    'Stamp Game',
    'Bead Chains',
    'Addition Strip Board',
    'Multiplication Board',
  ],
  Language: [
    'Sandpaper Letters',
    'Metal Insets',
    'Movable Alphabet',
    'Object Boxes',
    'Phonetic Reading Cards',
    'Puzzle Words',
    'Phonogram Booklets',
    'Grammar Symbols',
    'Reading Classification Cards',
    'Sentence Analysis',
  ],
  Cultural: [
    'Sandpaper Globe',
    'Continents Globe',
    'Puzzle Map of Continents',
    'Puzzle Map of the Country',
    'Land and Water Forms',
    'Parts of a Plant',
    'Parts of an Animal',
    'Life Cycles',
    'Living vs. Non-Living Sorting',
    'Time Line of Life',
  ],
}

export type ProgressStatus = 'introduced' | 'practicing' | 'mastered'

export const STATUS_ORDER: ProgressStatus[] = [
  'introduced',
  'practicing',
  'mastered',
]

export const STATUS_LABELS: Record<ProgressStatus, string> = {
  introduced: 'Introduced',
  practicing: 'Practicing',
  mastered: 'Mastered',
}

export const STATUS_COLORS: Record<ProgressStatus, string> = {
  introduced: '#94a3b8',
  practicing: '#f5c800',
  mastered: '#16a34a',
}
