  const paintings = [
    {
      title: "The Swing by Fragonard",
      movement: "Rococo",
      image: "/images/The Swing, Fragonard.jpg",
      explanation: "The Swing is a quintessential Rococo painting, characterized by its playful subject matter, pastel colors, and ornate details. It reflects the frivolity and elegance of the 18th-century French aristocracy.",
    },
    {
      title: "Oath of the Horatii by David",
      movement: "Neo-Classical",
      image: "/images/Oath of the Horatii, David.jpg",
      explanation: "Oath of the Horatii is a seminal work of the Neo-Classical movement, known for its dramatic composition, clear lines, and emphasis on heroic themes.",
    },
    {
      title: "Liberty Leading the People by Delacroix",
      movement: "Romantic",
      image: "/images/Liberty Leading the People, Delacroix.jpg",
      explanation: "Liberty Leading the People is a Romantic painting that personifies the concept of liberty and idealizes the struggle for freedom. Delacroix's use of color, movement, and emotion exemplifies the Romantic style.",},
    {
      title: "The Stonebreakers by Courbet",
      movement: "Realist",
      image: "/images/The Stonebreakers, Courbet.jpg",
      explanation: "The Stonebreakers is a Realist painting that depicts the harsh realities of labor and social conditions, emphasizing the dignity of the working class.",
    },
    {
      title: "A Burial at Ornans by Courbet",
      movement: "Realist",
      image: "/images/A Burial at Ornans, Courbet.jpg",
      explanation: "A Burial at Ornans is a Realist painting that portrays a funeral in a small French town with unidealized figures and a focus on everyday life.",
    },
    {
      title: "The Third of May 1808 by Goya",
      movement: "Romantic",
      image: "/images/The Third of May 1808, Goya.jpg",
      explanation: "The Third of May 1808 is a Romantic painting that depicts the horrors of war and the resilience of the human spirit. Dramatic lighting and emotional intensity are hallmarks of Romanticism, which Goya masterfully employs in this work.",
    },
    {
      title: "The Death of Marat by David",
      movement: "Neo-Classical",
      image: "/images/The Death of Marat, David.jpg",
      explanation: "The Death of Marat is a Neo-Classical painting that depicts the assassination of Jean-Paul Marat. David utilizes the neoclassical themes of civic duty and public virtue to frame Marat's death as one of martyrdom and heroism.",
    },
    {
      title: "Impression, Sunrise by Monet",
      movement: "Impressionist",
      image: "/images/Impression, Sunrise, Monet.jpg",
      explanation: "Impression, Sunrise is the painting that gave the Impressionist movement its name. Monet's loose brushwork and focus on capturing the fleeting effects of light and atmosphere exemplify the core principles of Impressionism.",
    },
    { title: "The Secret Meeting by Fragonard",
      movement: "Rococo",
      image: "/images/The Secret Meeting, Fragonard.jpg",
      explanation: "The Secret Meeting is a Rococo painting that depicts a clandestine encounter between two lovers. The work is characterized by its delicate brushwork, soft colors, and theme of artistocratic romance."
    },
    { title: "The Death of Socrates by David",
      movement: "Neo-Classical",
      image: "/images/The Death of Socrates, David.jpg",
      explanation: "The Death of Socrates is a Neo-Classical painting that dramatizes the moment just before the philosopher Socrates dies by state-ordered execution by poisoning. The use of classical subject matter, clear lines, and moral themes exemplifies the principles of Neo-Classicism."
    },
    { title: "The Raft of the Medusa by Gericault",
      movement: "Romantic",
      image: "/images/The Raft of the Medusa, Gericault.jpg",
      explanation: "The Raft of the Medusa is a painting about the aftermath of a naval disaster that was infamous at the time. Géricault's dramatic composition and emotional intensity are hallmarks of Romanticism."
    },
    { title: "Dance at Le Moulin de la Galette by Renoir",
      movement: "Impressionist",
      image: "/images/Dance at Le Moulin de la Galette, Renoir.jpg",
      explanation: "Dance at Le Moulin de la Galette is an Impressionist painting that captures a lively outdoor dance scene in Paris. Renoir's use of light, color, and loose brushwork exemplifies the Impressionist focus on capturing the fleeting moments of modern life."
    },
    { title: "Summertime by Cassatt",
      movement: "Impressionist",
      image: "/images/Summertime, Cassatt.jpg",
      explanation: "Summertime is an Impressionist painting that depicts a mother and child enjoying a leisurely moment outdoors. Cassatt's use of light and reflection, captured en plein air, are characteristic of the Impressionist movement."
    },
    { title: "Boulevard des Capucines by Monet",
      movement: "Impressionist",
      image: "/images/Boulevard des Capucines, Monet.jpg",
      explanation: "Boulevard des Capucines is an Impressionist painting that captures a bustling Parisian street scene. Monet's emphasis on atmosphere, color, and form exemplifies the Impressionist aesthetic."
    },
    { title: "The Gleaners by Millet",
      movement: "Realist",
      image: "/images/The Gleaners, Millet.jpg",
      explanation: "The Gleaners is a Realist painting that depicts three peasant women gleaning a field of stray grains of wheat after the harvest. Millet's focus on the dignity of labor and the harsh realities of rural life exemplifies the principles of Realism."
    },
    { title: "Wanderer above the Sea of Fog by Friedrich",
      movement: "Romantic",
      image: "/images/Wanderer above the Sea of Fog, Friedrich.jpeg",
      explanation: "Wanderer above the Sea of Fog exemplifies the Romantic emphasis on nature's sublime power and the individual's relationship with it."
    },
    { title: "Olympia by Manet",
      movement: "Realist",
      image: "/images/Olympia, Manet.jpg",
      explanation: "Olympia is a Realist painting that depicts, instead of an idealized goddess, two actual women: the art models Victorine Meurent (who later became a successful painter in her own right) posed as the titular sex worker and Laure (who also appeared in at least two other paintings by Manet) in the role of Olympia's servant. Manet's use of direct gaze and contemporary subject matter challenged traditional representations of the female nude and scandalized the bourgeois public."
    },
    { title: "The Luncheon on the Grass by Manet",
      movement: "Realist",
      image: "/images/Luncheon on the Grass, Manet.jpg",
      explanation: "The Luncheon on the Grass is an early Realist painting that depicts a nude woman picnicking with two fully clothed men in a contemporary setting. Manet's use of modern subject matter and unconventional composition challenged traditional artistic norms."
    },
    { title: "The Third Class Carriage by Daumier",
      movement: "Realist",
      image: "/images/The Third Class Carriage, Daumier.jpg",
      explanation: "The Third Class Carriage is a Realist painting that depicts the inhabitants of a third-class train carriage in simple factual detail that suggests dignity and stoicism. As one commentator states, “Daumier shows them to us in the unposed attitudes and unplanned arrangements of the millions thronging the modern city---anonymous, insignificant, dumbly patient with a lot they cannot change."
    },
    { title: "The Barricade (Memory of Civil War) by Meissonier",
      movement: "Realist",
      image: "/images/The Barricade (Memory of Civil War), Meissonier.jpg",
      explanation: "The Barricade (Memory of Civil War) is a Realist painting that depicts a scene from the 1848 French Revolution. Meissonier's attention to detail and historical accuracy exemplifies the Realist commitment to representing contemporary life and events."
    },
    { title: "What is Called Vagrancy by Stevens",
      movement: "Realist",
      image: "/images/What is Called Vagrancy, Stevens.jpg",
      explanation: "What is Called Vagrancy is a Realist painting that depicts a scene of social injustice, showing a group of 'vagrants' being arrested by the police. Stevens' focus on the harsh realities of poverty and social inequality exemplifies the principles of Realism. When Napoleon III saw this painting, he was outraged, believing such spectacles could stir up conflict. He ordered that vagrants should be transported to prison in closed coaches."
    },
    { title: "The Harvester by Dupre",
      movement: "Realist",
      image: "/images/The Harvester, Dupre.JPG",
      explanation: "The Harvester is a Realist painting that depicts a peasant harvesting wheat in a rural setting. Dupre's attention to the honest work of the countryside and the dignity of labor exemplifies the principles of Realism."
    },
    { title: "Simon Chenard as a Sans-culotte by Boilly",
      movement: "Neo-Classical",
      image: "/images/Simon Chenard as a Sans-culotte, Boilly.jpg",
      explanation: "Simon Chenard as a Sans-culotte is a Neo-Classical painting that depicts a French revolutionary figure from the early First Republic. While anticpating themes of early Romanticism (compare the idealized patriotisim of Liberty Leading the People), Boilly's work reflects the civic virtue, dramatic lighting, and revolutionary iconography characteristic of late Neo-Classical art."
    },
    { title: "Cornelia Pointing to her Children as Treasures by Kauffmann",
      movement: "Neo-Classical",
      image: "/images/Cornelia Pointing to her Children as Treasures, Kauffmann.jpg",
      explanation: "Cornelia Pointing to her Children as Treasures is a Neo-Classical painting that depicts the Roman matron Cornelia, mother of the Gracchi brothers, presenting her children as her most valuable treasures. Kauffmann's use of classical subject matter, clear lines, and moral themes exemplifies the principles of Neo-Classicism."
    },
    { title: "Monet Painting by Sargent",
      movement: "Impressionist",
      image: "/images/Monet Painting, Sargent.jpg",
      explanation: "Monet Painting is an Impressionist painting that depicts the artist Claude Monet at work in his garden. Sargent's loose brushwork en plein air (painting outdoors 'in the open air') and focus on capturing the effects of light and atmosphere exemplify the Impressionist style."
    },
    { title: "The Child's Bath by Cassatt",
      movement: "Impressionist",
      image: "/images/The Child's Bath, Cassatt.jpg",
      explanation: "The Child's Bath is an Impressionist painting that depicts a mother bathing her child. Cassatt's use of the high, downward-looking vantage point mimics a casual, unobserved glance into a private room, echoing the Impressionist ideal of recording a fleeting, intimate slice of life."
    },
    { title: "Regatta at Argenteuil by Monet",
      movement: "Impressionist",
      image: "/images/Regatta at Argenteuil, Monet.jpg",
      explanation: "Regatta at Argenteuil is an Impressionist painting that captures a lively boating scene on the Seine River. Monet's use of light, reflection, color, and loose brushwork exemplifies the Impressionist focus on capturing the transient effects of nature and modern life."
    },
    { title: "Stack of Wheat (Snow Effect, Overcast Day) by Monet",
      movement: "Impressionist",
      image: "/images/Stack of Wheat (Snow Effect, Overcast Day), Monet.jpg",
      explanation: "Stack of Wheat (Snow Effect, Overcast Day) is an Impressionist painting from Monet's series of wheat stacks in various lighting conditions throughout the year. His exploration of light and texture exemplifies the Impressionist focus on capturing the fleeting effects of nature and atmosphere."
    },
    { title: "The Boating Party by Cassatt",
      movement: "Impressionist",
      image: "/images/The Boating Party, Cassatt.jpg",
      explanation: "The Boating Party is an Impressionist painting that depicts a leisurely outing on the water. Cassatt's vibrant colors, based on plein air observation, exemplify the Impressionist focus on capturing modern life and the effects of light and atmosphere."
    },
    { title: "Summer's Day by Morisot",
      movement: "Impressionist",
      image: "/images/Summer's Day, Morisot.jpg",
      explanation: "Summer's Day is an Impressionist painting that captures a serene moment in a park. Morisot's use of light, color, and loose brushwork exemplifies the Impressionist focus on capturing the fleeting effects of nature and modern life. Morisot was the daughter of a wealthy Bourgeoisie civil servant. According to Katz & Dars book, 'The Impressionists,' when her family hired a private tutor to teach her and her sister to paint, the tutor warned, 'Considering the character of your daughters, my teaching will not endow them with minor drawing room accomplishments: they will become painters. Do you realize what this means?  In the haute bourgeois milieu to which you belong, this will be revolutionary, I might almost add catastrophic. Are you sure that you will not curse the day when art, having gained admission to your home, now so respectable and peaceful, will become the sole arbiter of the fate of your two children?'"
    },
    { title: "A Bar at the Folies-Bergère by Manet",
      movement: "Realist",
      image: "/images/A Bar at the Folies-Bergère, Manet.jpg",
      explanation: "A Bar at the Folies-Bergère is a painting that straddles Realism and Impressionism. It exemplifies the realist commitment to contemporary subject matter and social consciousness while also exhibiting the Impressionist focus on capturing the effects of light, reflection, and atmosphere."
    },
    { title: "The Nightmare by Fuseli",
      movement: "Romantic",
      image: "/images/The Nightmare, Fuseli.jpg",
      explanation: "The Nightmare is a Romantic painting that explores the darker aspects of the human psyche. Fuseli's use of dramatic lighting, fantastical imagery, and psychological intensity exemplifies the Romantic fascination with emotion, imagination, and the supernatural."
    },

  ];

  export default paintings;