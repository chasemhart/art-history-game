// The 32 works students study: Chase's collection, one entry per painting.
//
// Used by: every screen. Rounds are dealt from this list, the wall label shows
// its facts, and grading checks typed answers against it.
// Why it exists as its own file: this is the file Chase edits most. Keeping the
// collection apart from the game's rules means adding or correcting a painting
// never touches game code. The tests in paintings.test.js check every entry.
//
// To add a painting:
// 1. Put the original image in public/images/.
// 2. Copy an entry below and edit it. `id` must be unique: lowercase words
//    joined by hyphens. `movement` must be an id from movements.js.
// 3. Run `npm run images` to make the fast web versions, then `npm run test`.
//
// The fields:
// - title: the title as a museum label shows it.
// - titleAccepted: other names students may fairly use (a French title, the
//   title without a subtitle). The title itself always counts, so list only
//   alternatives. Written normalized: lowercase, no accents, no punctuation,
//   no leading "the" or "a".
// - artist.last is what the exam asks for. The full and last names always
//   count; artistAccepted lists only other spellings.
// - year and medium are display text for the label.
// - alsoAccept (optional): extra movement ids that also count as correct, for
//   works that sit between two movements.
// - image.original: the file name in public/images/. image.alt describes the
//   picture for screen readers without naming the movement.
// - explanation: Chase's text.
//
// Facts marked VERIFY were drafted during the rebuild, not taken from Chase's
// original file. They are listed in docs/LEARNING.md for Chase to check.

const paintings = [
  {
    id: 'the-swing',
    title: 'The Swing',
    titleAccepted: ['les hasards heureux de l escarpolette', 'happy accidents of the swing'], // VERIFY
    artist: { full: 'Jean-Honoré Fragonard', last: 'Fragonard' }, // VERIFY full name
    artistAccepted: [],
    year: '1767', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'rococo',
    image: {
      original: 'The Swing, Fragonard.jpg',
      alt: 'A young woman in a billowing pink dress swings high in a leafy garden, kicking a slipper into the air, while a young man reclines in the bushes below and an older man pulls the ropes from behind.',
    },
    explanation:
      'The Swing is a quintessential Rococo painting, characterized by its playful subject matter, pastel colors, and ornate details. It reflects the frivolity and elegance of the 18th-century French aristocracy.',
  },
  {
    id: 'oath-of-the-horatii',
    title: 'Oath of the Horatii',
    titleAccepted: ['le serment des horaces'], // VERIFY
    artist: { full: 'Jacques-Louis David', last: 'David' }, // VERIFY full name
    artistAccepted: [],
    year: '1784', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'neo-classical',
    image: {
      original: 'Oath of the Horatii, David.jpg',
      alt: 'Three brothers in Roman armor stretch their arms toward swords held up by their father, framed by stone arches, while grieving women and children slump together on the right.',
    },
    explanation:
      'Oath of the Horatii is a seminal work of the Neo-Classical movement, known for its dramatic composition, clear lines, and emphasis on heroic themes.',
  },
  {
    id: 'liberty-leading-the-people',
    title: 'Liberty Leading the People',
    titleAccepted: ['la liberte guidant le peuple'], // VERIFY
    artist: { full: 'Eugène Delacroix', last: 'Delacroix' }, // VERIFY full name
    artistAccepted: [],
    year: '1830', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'romantic',
    image: {
      original: 'Liberty Leading the People, Delacroix.jpg',
      alt: 'A bare-breasted woman in a red cap raises the French tricolor flag and a rifle as she strides over a barricade of fallen bodies, leading armed men and a boy through smoke.',
    },
    explanation:
      "Liberty Leading the People is a Romantic painting that personifies the concept of liberty and idealizes the struggle for freedom. Delacroix's use of color, movement, and emotion exemplifies the Romantic style.",
  },
  {
    id: 'the-stonebreakers',
    title: 'The Stonebreakers',
    titleAccepted: ['stone breakers', 'les casseurs de pierres'], // VERIFY
    artist: { full: 'Gustave Courbet', last: 'Courbet' }, // VERIFY full name
    artistAccepted: [],
    year: '1849', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'The Stonebreakers, Courbet.jpg',
      alt: 'Two laborers in ragged clothes break and carry stones by a roadside, one an old man kneeling with a hammer, the other a youth lifting a heavy basket, their faces turned away.',
    },
    explanation:
      'The Stonebreakers is a Realist painting that depicts the harsh realities of labor and social conditions, emphasizing the dignity of the working class.',
  },
  {
    id: 'a-burial-at-ornans',
    title: 'A Burial at Ornans',
    titleAccepted: ['burial at ornans', 'un enterrement a ornans'], // VERIFY
    artist: { full: 'Gustave Courbet', last: 'Courbet' }, // VERIFY full name
    artistAccepted: [],
    year: '1849 to 1850', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'A Burial at Ornans, Courbet.jpg',
      alt: 'A long row of villagers in black, with clergy and a crucifix, gathers around an open grave beneath gray cliffs, a dog standing in the foreground.',
    },
    explanation:
      'A Burial at Ornans is a Realist painting that portrays a funeral in a small French town with unidealized figures and a focus on everyday life.',
  },
  {
    id: 'the-third-of-may-1808',
    title: 'The Third of May 1808',
    titleAccepted: ['third of may', '3rd of may 1808', 'el tres de mayo de 1808', 'el tres de mayo'], // VERIFY
    artist: { full: 'Francisco Goya', last: 'Goya' }, // VERIFY full name
    artistAccepted: ['francisco de goya'], // VERIFY
    year: '1814', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'romantic',
    image: {
      original: 'The Third of May 1808, Goya.jpg',
      alt: 'At night, a firing squad aims rifles at a man in a white shirt who throws his arms wide in the light of a lantern, surrounded by terrified captives and the bodies of the already dead.',
    },
    explanation:
      'The Third of May 1808 is a Romantic painting that depicts the horrors of war and the resilience of the human spirit. Dramatic lighting and emotional intensity are hallmarks of Romanticism, which Goya masterfully employs in this work.',
  },
  {
    id: 'the-death-of-marat',
    title: 'The Death of Marat',
    titleAccepted: ['marat assassinated', 'la mort de marat'], // VERIFY
    artist: { full: 'Jacques-Louis David', last: 'David' }, // VERIFY full name
    artistAccepted: [],
    year: '1793', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'neo-classical',
    image: {
      original: 'The Death of Marat, David.jpg',
      alt: 'A man lies dead in a bathtub, his head wrapped in a cloth and one arm hanging to the floor with a quill, a letter in his other hand, against a bare dark wall.',
    },
    explanation:
      "The Death of Marat is a Neo-Classical painting that depicts the assassination of Jean-Paul Marat. David utilizes the neoclassical themes of civic duty and public virtue to frame Marat's death as one of martyrdom and heroism.",
  },
  {
    id: 'impression-sunrise',
    title: 'Impression, Sunrise',
    titleAccepted: ['impression soleil levant'], // VERIFY
    artist: { full: 'Claude Monet', last: 'Monet' }, // VERIFY full name
    artistAccepted: [],
    year: '1872', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'Impression, Sunrise, Monet.jpg',
      alt: 'A small orange sun and its reflection glow through blue-gray haze over a harbor, where dark rowboats drift in the foreground and ships and cranes fade into the mist.',
    },
    explanation:
      "Impression, Sunrise is the painting that gave the Impressionist movement its name. Monet's loose brushwork and focus on capturing the fleeting effects of light and atmosphere exemplify the core principles of Impressionism.",
  },
  {
    id: 'the-secret-meeting',
    title: 'The Secret Meeting',
    titleAccepted: ['meeting', 'la rencontre'], // VERIFY
    artist: { full: 'Jean-Honoré Fragonard', last: 'Fragonard' }, // VERIFY full name
    artistAccepted: [],
    year: '1771 to 1773', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'rococo',
    image: {
      original: 'The Secret Meeting, Fragonard.jpg',
      alt: 'In a lush garden, a young man climbs over a wall toward a young woman in a pale dress who glances back anxiously, beside a marble statue of Venus and Cupid.',
    },
    explanation:
      'The Secret Meeting is a Rococo painting that depicts a clandestine encounter between two lovers. The work is characterized by its delicate brushwork, soft colors, and theme of aristocratic romance.',
  },
  {
    id: 'the-death-of-socrates',
    title: 'The Death of Socrates',
    titleAccepted: ['la mort de socrate'], // VERIFY
    artist: { full: 'Jacques-Louis David', last: 'David' }, // VERIFY full name
    artistAccepted: [],
    year: '1787', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'neo-classical',
    image: {
      original: 'The Death of Socrates, David.jpg',
      alt: 'An old man sits upright on a bed in a stone prison, one hand raised as he reaches for a cup of poison, while grieving followers in robes surround him.',
    },
    explanation:
      'The Death of Socrates is a Neo-Classical painting that dramatizes the moment just before the philosopher Socrates dies by state-ordered execution by poisoning. The use of classical subject matter, clear lines, and moral themes exemplifies the principles of Neo-Classicism.',
  },
  {
    id: 'the-raft-of-the-medusa',
    title: 'The Raft of the Medusa',
    titleAccepted: ['raft of medusa', 'radeau de la meduse', 'le radeau de la meduse'], // VERIFY
    artist: { full: 'Théodore Géricault', last: 'Géricault' }, // VERIFY full name
    artistAccepted: [],
    year: '1818 to 1819', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'romantic',
    image: {
      original: 'The Raft of the Medusa, Gericault.jpg',
      alt: 'Survivors of a shipwreck crowd a makeshift raft on a rough sea, the dead and dying in the foreground, while a man at the top of a pyramid of bodies waves a cloth toward a tiny ship on the horizon.',
    },
    explanation:
      "The Raft of the Medusa is a painting about the aftermath of a naval disaster that was infamous at the time. Géricault's dramatic composition and emotional intensity are hallmarks of Romanticism.",
  },
  {
    id: 'dance-at-le-moulin-de-la-galette',
    title: 'Dance at Le Moulin de la Galette',
    titleAccepted: ['dance at moulin de la galette', 'bal du moulin de la galette', 'moulin de la galette'], // VERIFY
    artist: { full: 'Pierre-Auguste Renoir', last: 'Renoir' }, // VERIFY full name
    artistAccepted: [],
    year: '1876', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'Dance at Le Moulin de la Galette, Renoir.jpg',
      alt: 'A crowd of fashionably dressed Parisians dances, talks, and drinks at an open-air garden on a sunny afternoon, dappled light falling through the trees onto their clothes.',
    },
    explanation:
      "Dance at Le Moulin de la Galette is an Impressionist painting that captures a lively outdoor dance scene in Paris. Renoir's use of light, color, and loose brushwork exemplifies the Impressionist focus on capturing the fleeting moments of modern life.",
  },
  {
    id: 'summertime',
    title: 'Summertime',
    titleAccepted: [],
    artist: { full: 'Mary Cassatt', last: 'Cassatt' }, // VERIFY full name
    artistAccepted: [],
    year: '1894', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'Summertime, Cassatt.jpg',
      alt: 'A woman in a pink dress and a girl in a wide straw hat lean over the side of a small boat to watch ducks on rippling, sunlit water painted in quick strokes of blue, violet, and orange.',
    },
    explanation:
      "Summertime is an Impressionist painting that depicts a mother and child enjoying a leisurely moment outdoors. Cassatt's use of light and reflection, captured en plein air, are characteristic of the Impressionist movement.",
  },
  {
    id: 'boulevard-des-capucines',
    title: 'Boulevard des Capucines',
    titleAccepted: [],
    artist: { full: 'Claude Monet', last: 'Monet' }, // VERIFY full name
    artistAccepted: [],
    year: '1873 to 1874', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'Boulevard des Capucines, Monet.jpg',
      alt: 'Seen from a high window, a wide Paris boulevard in winter is lined with bare trees and filled with crowds and carriages suggested by quick dark dabs of paint.',
    },
    explanation:
      "Boulevard des Capucines is an Impressionist painting that captures a bustling Parisian street scene. Monet's emphasis on atmosphere, color, and form exemplifies the Impressionist aesthetic.",
  },
  {
    id: 'the-gleaners',
    title: 'The Gleaners',
    titleAccepted: ['des glaneuses', 'les glaneuses'], // VERIFY
    artist: { full: 'Jean-François Millet', last: 'Millet' }, // VERIFY full name
    artistAccepted: [],
    year: '1857', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'The Gleaners, Millet.jpg',
      alt: 'Three peasant women bend low in a harvested field to pick up leftover stalks of grain, while haystacks, workers, and a farm stand far behind them in golden light.',
    },
    explanation:
      "The Gleaners is a Realist painting that depicts three peasant women gleaning a field of stray grains of wheat after the harvest. Millet's focus on the dignity of labor and the harsh realities of rural life exemplifies the principles of Realism.",
  },
  {
    id: 'wanderer-above-the-sea-of-fog',
    title: 'Wanderer above the Sea of Fog',
    titleAccepted: ['wanderer above a sea of fog', 'wanderer over the sea of fog', 'der wanderer uber dem nebelmeer'], // VERIFY
    artist: { full: 'Caspar David Friedrich', last: 'Friedrich' }, // VERIFY full name
    artistAccepted: [],
    year: 'c. 1818', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'romantic',
    image: {
      original: 'Wanderer above the Sea of Fog, Friedrich.jpeg',
      alt: 'A man in a dark coat stands with his back to us on a rocky summit, holding a walking stick and gazing out over a landscape of mountain peaks rising from a sea of fog.',
    },
    explanation:
      "Wanderer above the Sea of Fog exemplifies the Romantic emphasis on nature's sublime power and the individual's relationship with it.",
  },
  {
    id: 'olympia',
    title: 'Olympia',
    titleAccepted: [],
    artist: { full: 'Édouard Manet', last: 'Manet' }, // VERIFY full name
    artistAccepted: [],
    year: '1863', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'Olympia, Manet.jpg',
      alt: 'A nude woman reclines on white sheets and looks directly at the viewer, a flower in her hair and a ribbon at her neck, while a servant brings her a bouquet and a black cat arches its back at the foot of the bed.',
    },
    explanation:
      "Olympia is a Realist painting that depicts, instead of an idealized goddess, two actual women: the art models Victorine Meurent (who later became a successful painter in her own right) posed as the titular sex worker and Laure (who also appeared in at least two other paintings by Manet) in the role of Olympia's servant. Manet's use of direct gaze and contemporary subject matter challenged traditional representations of the female nude and scandalized the bourgeois public.",
  },
  {
    id: 'the-luncheon-on-the-grass',
    title: 'The Luncheon on the Grass',
    titleAccepted: ['luncheon on grass', 'le dejeuner sur l herbe', 'dejeuner sur l herbe'], // VERIFY
    artist: { full: 'Édouard Manet', last: 'Manet' }, // VERIFY full name
    artistAccepted: [],
    year: '1863', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'Luncheon on the Grass, Manet.jpg',
      alt: 'A nude woman sits on the grass in a wooded clearing beside two clothed men in dark jackets, a picnic spilling from a basket beside her, while a second woman bathes in a stream behind them.',
    },
    explanation:
      "The Luncheon on the Grass is an early Realist painting that depicts a nude woman picnicking with two fully clothed men in a contemporary setting. Manet's use of modern subject matter and unconventional composition challenged traditional artistic norms.",
  },
  {
    id: 'the-third-class-carriage',
    title: 'The Third Class Carriage',
    titleAccepted: ['le wagon de troisieme classe'], // VERIFY
    artist: { full: 'Honoré Daumier', last: 'Daumier' }, // VERIFY full name
    artistAccepted: [],
    year: 'c. 1862 to 1864', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'The Third Class Carriage, Daumier.jpg',
      alt: 'In a dim, crowded railway carriage, an old woman sits on a wooden bench with a basket in her lap beside a young mother nursing a baby and a sleeping boy, while rows of passengers fill the seats behind.',
    },
    explanation:
      'The Third Class Carriage is a Realist painting that depicts the inhabitants of a third-class train carriage in simple factual detail that suggests dignity and stoicism. As one commentator states, “Daumier shows them to us in the unposed attitudes and unplanned arrangements of the millions thronging the modern city, anonymous, insignificant, dumbly patient with a lot they cannot change.”',
  },
  {
    id: 'the-barricade',
    title: 'The Barricade (Memory of Civil War)',
    titleAccepted: ['barricade', 'memory of civil war', 'barricade rue de la mortellerie', 'souvenir de guerre civile'], // VERIFY
    artist: { full: 'Ernest Meissonier', last: 'Meissonier' }, // VERIFY full name
    artistAccepted: ['jean louis ernest meissonier'], // VERIFY
    year: '1849', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'The Barricade (Memory of Civil War), Meissonier.jpg',
      alt: 'The bodies of men lie heaped among scattered paving stones in a narrow, shuttered Paris street, one with a bloodstained shirt, another in red trousers.',
    },
    explanation:
      "The Barricade (Memory of Civil War) is a Realist painting that depicts a scene from the 1848 French Revolution. Meissonier's attention to detail and historical accuracy exemplifies the Realist commitment to representing contemporary life and events.",
  },
  {
    id: 'what-is-called-vagrancy',
    title: 'What is Called Vagrancy',
    titleAccepted: ['ce qu on appelle le vagabondage'], // VERIFY
    artist: { full: 'Alfred Stevens', last: 'Stevens' }, // VERIFY full name
    artistAccepted: [],
    year: 'c. 1854', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'What is Called Vagrancy, Stevens.jpg',
      alt: 'On a snowy street beside a gray wall, armed soldiers in tall hats escort a poor family: a mother holding a baby, a weeping boy, and a man with a crutch, as a woman in black pleads with one of the soldiers.',
    },
    explanation:
      "What is Called Vagrancy is a Realist painting that depicts a scene of social injustice, showing a group of 'vagrants' being arrested by the police. Stevens' focus on the harsh realities of poverty and social inequality exemplifies the principles of Realism. When Napoleon III saw this painting, he was outraged, believing such spectacles could stir up conflict. He ordered that vagrants should be transported to prison in closed coaches.",
  },
  {
    id: 'the-harvester',
    title: 'The Harvester',
    titleAccepted: [],
    artist: { full: 'Julien Dupré', last: 'Dupré' }, // VERIFY full name (signed "Julien Dupré" on the canvas)
    artistAccepted: [],
    year: null, // VERIFY: date not yet found; the label leaves it out until it is filled in
    medium: 'Oil on canvas', // VERIFY
    movement: 'realist',
    image: {
      original: 'The Harvester, Dupre.JPG',
      alt: 'A young peasant woman in a blue apron and orange headscarf bends to pitch hay onto a large haystack with a wooden fork in a green field under a cloudy sky.',
    },
    explanation:
      "The Harvester is a Realist painting that depicts a peasant harvesting wheat in a rural setting. Dupré's attention to the honest work of the countryside and the dignity of labor exemplifies the principles of Realism.",
  },
  {
    id: 'simon-chenard-as-a-sans-culotte',
    title: 'Simon Chenard as a Sans-culotte',
    titleAccepted: ['simon chenard', 'sans culotte', 'portrait of simon chenard'], // VERIFY
    artist: { full: 'Louis-Léopold Boilly', last: 'Boilly' }, // VERIFY full name
    artistAccepted: [],
    year: '1792', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'neo-classical',
    image: {
      original: 'Simon Chenard as a Sans-culotte, Boilly.jpg',
      alt: 'A man in a striped waistcoat, loose trousers, and a cap with a cockade stands on a hilltop holding a pipe in his mouth and a tall red, white, and blue banner, under a stormy sky.',
    },
    explanation:
      'Simon Chenard as a Sans-culotte is a Neo-Classical painting that depicts a French revolutionary figure from the early First Republic. While anticipating themes of early Romanticism (compare the idealized patriotism of Liberty Leading the People), Boilly\'s work reflects the civic virtue, dramatic lighting, and revolutionary iconography characteristic of late Neo-Classical art.',
  },
  {
    id: 'cornelia-pointing-to-her-children',
    title: 'Cornelia Pointing to her Children as Treasures',
    titleAccepted: ['cornelia pointing to her children as her treasures', 'cornelia mother of the gracchi pointing to her children as her treasures', 'cornelia pointing to her children'], // VERIFY
    artist: { full: 'Angelica Kauffmann', last: 'Kauffmann' }, // VERIFY full name (also often spelled Kauffman)
    artistAccepted: ['kauffman', 'angelica kauffman', 'angelika kauffmann'],
    year: 'c. 1785', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'neo-classical',
    image: {
      original: 'Cornelia Pointing to her Children as Treasures, Kauffmann.jpg',
      alt: 'A Roman mother in classical robes gestures toward her two young sons as a seated visitor shows off a box of jewels, in a simple room with a column and a doorway.',
    },
    explanation:
      "Cornelia Pointing to her Children as Treasures is a Neo-Classical painting that depicts the Roman matron Cornelia, mother of the Gracchi brothers, presenting her children as her most valuable treasures. Kauffmann's use of classical subject matter, clear lines, and moral themes exemplifies the principles of Neo-Classicism.",
  },
  {
    id: 'monet-painting',
    title: 'Monet Painting',
    titleAccepted: ['claude monet painting by the edge of a wood', 'monet painting by the edge of a wood'], // VERIFY
    artist: { full: 'John Singer Sargent', last: 'Sargent' }, // VERIFY full name
    artistAccepted: [],
    year: 'c. 1885', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'Monet Painting, Sargent.jpg',
      alt: 'A bearded man in a straw hat sits at an easel painting outdoors at the edge of a sunlit wood, while a young woman in a long dress sits in the grass behind him.',
    },
    explanation:
      "Monet Painting is an Impressionist painting that depicts the artist Claude Monet at work in his garden. Sargent's loose brushwork en plein air (painting outdoors 'in the open air') and focus on capturing the effects of light and atmosphere exemplify the Impressionist style.",
  },
  {
    id: 'the-childs-bath',
    title: "The Child's Bath",
    titleAccepted: ['childs bath', 'bath'], // VERIFY
    artist: { full: 'Mary Cassatt', last: 'Cassatt' }, // VERIFY full name
    artistAccepted: [],
    year: '1893', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: "The Child's Bath, Cassatt.jpg",
      alt: 'Seen from above, a woman in a striped dress holds a small child on her lap and gently washes the child\'s foot in a basin, both looking down at the water.',
    },
    explanation:
      "The Child's Bath is an Impressionist painting that depicts a mother bathing her child. Cassatt's use of the high, downward-looking vantage point mimics a casual, unobserved glance into a private room, echoing the Impressionist ideal of recording a fleeting, intimate slice of life.",
  },
  {
    id: 'regatta-at-argenteuil',
    title: 'Regatta at Argenteuil',
    titleAccepted: ['regates a argenteuil'], // VERIFY
    artist: { full: 'Claude Monet', last: 'Monet' }, // VERIFY full name
    artistAccepted: [],
    year: '1872', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'Regatta at Argenteuil, Monet.jpg',
      alt: 'White sailboats glide on a river beside a red-roofed house and green trees, their reflections broken into thick, quick strokes of color on the rippling water.',
    },
    explanation:
      "Regatta at Argenteuil is an Impressionist painting that captures a lively boating scene on the Seine River. Monet's use of light, reflection, color, and loose brushwork exemplifies the Impressionist focus on capturing the transient effects of nature and modern life.",
  },
  {
    id: 'stack-of-wheat-snow-effect',
    title: 'Stack of Wheat (Snow Effect, Overcast Day)',
    titleAccepted: ['stack of wheat', 'stacks of wheat', 'wheatstack', 'wheatstacks', 'wheatstack snow effect overcast day'], // VERIFY
    artist: { full: 'Claude Monet', last: 'Monet' }, // VERIFY full name
    artistAccepted: [],
    year: '1890 to 1891', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'Stack of Wheat (Snow Effect, Overcast Day), Monet.jpg',
      alt: 'A single large stack of harvested wheat with a rounded top stands in a snow-covered field under a pale, overcast sky, painted in soft blues, lilacs, and pinks.',
    },
    explanation:
      "Stack of Wheat (Snow Effect, Overcast Day) is an Impressionist painting from Monet's series of wheat stacks in various lighting conditions throughout the year. His exploration of light and texture exemplifies the Impressionist focus on capturing the fleeting effects of nature and atmosphere.",
  },
  {
    id: 'the-boating-party',
    title: 'The Boating Party',
    titleAccepted: [],
    artist: { full: 'Mary Cassatt', last: 'Cassatt' }, // VERIFY full name
    artistAccepted: [],
    year: '1893 to 1894', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: 'The Boating Party, Cassatt.jpg',
      alt: 'A man in dark clothes rows a boat with a yellow interior across bright blue water toward a woman in a hat holding a small child on her lap, a white sail curving above them.',
    },
    explanation:
      "The Boating Party is an Impressionist painting that depicts a leisurely outing on the water. Cassatt's vibrant colors, based on plein air observation, exemplify the Impressionist focus on capturing modern life and the effects of light and atmosphere.",
  },
  {
    id: 'summers-day',
    title: "Summer's Day",
    titleAccepted: ['summers day', 'lake in the bois de boulogne'], // VERIFY
    artist: { full: 'Berthe Morisot', last: 'Morisot' }, // VERIFY full name
    artistAccepted: [],
    year: '1879', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'impressionist',
    image: {
      original: "Summer's Day, Morisot.jpg",
      alt: 'Two young women in hats sit side by side in a small boat on a park lake, one holding a parasol, with ducks on the water nearby, all painted in rapid, feathery strokes.',
    },
    explanation:
      "Summer's Day is an Impressionist painting that captures a serene moment in a park. Morisot's use of light, color, and loose brushwork exemplifies the Impressionist focus on capturing the fleeting effects of nature and modern life. Morisot was the daughter of a wealthy bourgeois civil servant. According to Katz and Dars' book, 'The Impressionists,' when her family hired a private tutor to teach her and her sister to paint, the tutor warned, 'Considering the character of your daughters, my teaching will not endow them with minor drawing room accomplishments: they will become painters. Do you realize what this means? In the haute bourgeois milieu to which you belong, this will be revolutionary, I might almost add catastrophic. Are you sure that you will not curse the day when art, having gained admission to your home, now so respectable and peaceful, will become the sole arbiter of the fate of your two children?'",
  },
  {
    id: 'a-bar-at-the-folies-bergere',
    title: 'A Bar at the Folies-Bergère',
    titleAccepted: ['bar at folies bergere', 'un bar aux folies bergere'], // VERIFY
    artist: { full: 'Édouard Manet', last: 'Manet' }, // VERIFY full name
    artistAccepted: [],
    year: '1882', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    // Chase's description says this work straddles Realism and Impressionism.
    // It counts as Realist only until Chase decides whether both count. To
    // accept both, add: alsoAccept: ['impressionist'],
    movement: 'realist',
    image: {
      original: 'A Bar at the Folies-Bergère, Manet.jpg',
      alt: 'A barmaid in a dark velvet jacket stands behind a marble counter crowded with bottles, oranges, and flowers, gazing outward, while a mirror behind her reflects a glittering crowded hall and a man in a top hat.',
    },
    explanation:
      'A Bar at the Folies-Bergère is a painting that straddles Realism and Impressionism. It exemplifies the realist commitment to contemporary subject matter and social consciousness while also exhibiting the Impressionist focus on capturing the effects of light, reflection, and atmosphere.',
  },
  {
    id: 'the-nightmare',
    title: 'The Nightmare',
    titleAccepted: [],
    artist: { full: 'Henry Fuseli', last: 'Fuseli' }, // VERIFY full name
    artistAccepted: ['fussli', 'fuessli', 'johann heinrich fussli'], // VERIFY
    year: '1781', // VERIFY
    medium: 'Oil on canvas', // VERIFY
    movement: 'romantic',
    image: {
      original: 'The Nightmare, Fuseli.jpg',
      alt: 'A woman in a white gown lies sprawled across a bed in the dark, her head and arms hanging over the edge, while a small demon crouches on her chest and a wild-eyed horse pushes its head through the curtains.',
    },
    explanation:
      "The Nightmare is a Romantic painting that explores the darker aspects of the human psyche. Fuseli's use of dramatic lighting, fantastical imagery, and psychological intensity exemplifies the Romantic fascination with emotion, imagination, and the supernatural.",
  },
]

export default paintings
