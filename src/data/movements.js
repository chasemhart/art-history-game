// The five movements on the final exam, in historical order.
//
// Used by: the Sort answer buttons (names and order), grading of typed
// movement answers (accepted spellings), and the reveal after each answer
// (colors and era light).
// Why it exists as its own file: these are facts about each movement, not
// about any one painting. Every painting points here by `id`, so a movement's
// name or color is written once, and a typo like "Impressionism" in a painting
// entry is caught by the data tests instead of creating a sixth movement.
//
// Colors (DESIGN.md section 7), all shown only after the student answers,
// because showing them earlier would give the answer away:
// - accent: decorative lines and marks only, never text
// - ink: a text-safe version, at least 4.5:1 on the label background
// - light: the era light the gallery spotlight shifts to

const movements = [
  {
    id: 'rococo',
    name: 'Rococo',
    // Accepted answers are written already normalized: lowercase, no accents,
    // no punctuation. Grading normalizes what the student types the same way.
    accepted: ['rococo', 'rococo style', 'rococo era', 'rococo period'],
    // Fragonard's pinks and powdered pastels; salons lit by candles
    accent: '#C98E8E',
    ink: '#8E4E52',
    light: 'rgba(255, 226, 196, 0.75)',
  },
  {
    id: 'neo-classical',
    name: 'Neo-Classical',
    accepted: [
      'neo classical',
      'neoclassical',
      'neo classic',
      'neoclassic',
      'neo classicism',
      'neoclassicism',
    ],
    // The red cloaks of the Oath of the Horatii; even, rational light
    accent: '#9E3B32',
    ink: '#8A2F27',
    light: 'rgba(248, 248, 246, 0.75)',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    accepted: ['romantic', 'romanticism', 'romantic era', 'romantic period'],
    // Friedrich's fog and Géricault's sea; low, dramatic light
    accent: '#56606A',
    ink: '#3F4851',
    light: 'rgba(255, 232, 200, 0.70)',
  },
  {
    id: 'realist',
    name: 'Realist',
    accepted: ['realist', 'realism', 'realists'],
    // Millet's wheat fields and Courbet's earth; unidealized daylight
    accent: '#8A7553',
    ink: '#5E4E36',
    light: 'rgba(244, 241, 234, 0.75)',
  },
  {
    id: 'impressionist',
    name: 'Impressionist',
    accepted: ['impressionist', 'impressionism', 'impressionists'],
    // The water at Argenteuil; painting outdoors in natural light
    accent: '#6E93B5',
    ink: '#3F6585',
    light: 'rgba(236, 244, 255, 0.75)',
  },
]

// Look up a movement by its id, for example movementById.romantic.name
export const movementById = Object.fromEntries(movements.map((m) => [m.id, m]))

export default movements
