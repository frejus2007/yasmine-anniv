/** Personnalise tous les messages ici — rien d'autre à chercher. */
export const PERSONAL_CONFIG = {
  authorName: 'Fréjus',
  guideName: 'Lionel',
  greetingTitle: 'Joyeux 20 ans, Yasmine',
  introMessage:
    "J'avais envie de créer quelque chose rien que pour toi. Tu me fais sourire, et aujourd'hui quelqu'un pense très fort à toi.",
  cardMessage:
    "Je te trouve spéciale. J'aime beaucoup la personne que tu es , tu savais déjà tout ça, ta lumière, ta douceur, et la façon dont tu rends les jours plus beaux. Joyeux anniversaire, Yasmine.",
  envelopeMessage:
    "Yasmine,\n\n,Pour tes 20 ans, je voulais simplement prendre un moment pour te rappeler à quel point tu es une belle personne.Tu as une personnalité rare, à la fois douce, lumineuse et sincère. Tu sais apporter de la bonne humeur autour de toi, souvent sans même t’en rendre compte (je te dis ça souvent), et ta façon d’être laisse toujours une impression positive. J’apprécie beaucoup ta gentillesse, ta sensibilité, ton authenticité et cette belle énergie qui te rend unique.Tu mérites d’être entourée de personnes qui reconnaissent ta valeur et qui te souhaitent réellement le meilleur. J’espère que cette nouvelle étape de ta vie t’apportera beaucoup de bonheur, de confiance, de réussite et de beaux projets.Continue à avancer à ton rythme, à rester fidèle à toi-même et à croire en tout ce dont tu es capable. Tu as énormément de qualités, et j’espère que tu n’oublieras jamais de les voir en toi.Joyeux anniversaire pour tes 20 ans, Yasmine. Profite pleinement de cette belle journée et de tout ce que cette nouvelle année peut t’apporter.\n\nMerci d'être toi.\n\n— Fréjus",
  starCompliments: [
    'Ton sourire illumine tout.',
    "J'aime beaucoup la personne que tu es.",
    'Tu fais sourire, simplement.',
    'Ton énergie et surtout ta bonne humeur sont contagieuses.',
    'Tu es spéciale — vraiment.',
  ],

  /** Carte du ciel — grande surprise de fin. */
  nightSky: {
    title: 'La nuit du 13 septembre',
    subtitle: 'Le ciel de notre jour à nous',
    entryWhisper: 'Regarde… le ciel s’ouvre rien que pour toi.',
    lead: 'Touche chaque étoile. Une constellation va naître avec ton prénom.',
    centerMessage:
      'Nous partageons la même date d’anniversaire. Ce soir-là, le ciel a dû sourire deux fois.',
    surpriseTitle: 'Ta constellation, Yasmine',
    surpriseMessage:
      'Huit étoiles. Huit petites vérités. Et au centre — notre 13 septembre.\n\nQuelqu’un a construit tout ça pour toi, parce que tu mérites d’être célébrée comme une étoile qu’on reconnaît tout de suite dans le ciel.',
    surpriseCta: 'Continuer, avec le sourire',
    /** Ordre dans lequel les traits de constellation se dessinent. */
    constellationOrder: ['a', 'c', 'b', 'e', 'g', 'd', 'h', 'f'] as const,
    /** Traits entre étoiles (ids). */
    constellationLinks: [
      ['a', 'c'],
      ['c', 'b'],
      ['c', 'd'],
      ['c', 'e'],
      ['d', 'g'],
      ['e', 'g'],
      ['g', 'h'],
      ['d', 'f'],
    ] as const,
    stars: [
      {
        id: 'a',
        x: 18,
        y: 22,
        size: 1.1,
        label: 'Notre jour',
        message: 'Le 13 septembre — le tien, le mien. Comme si le calendrier nous avait rapprochés avant même qu’on le sache.',
      },
      {
        id: 'b',
        x: 72,
        y: 18,
        size: 0.9,
        label: 'Ta lumière',
        message: 'Tu illumines la pièce sans effort. C’est une de ces choses qu’on remarque tout de suite.',
      },
      {
        id: 'c',
        x: 48,
        y: 35,
        size: 1.3,
        label: '20 ans',
        message: 'Joyeux 20 ans, Yasmine. Quelqu’un pense très fort à toi aujourd’hui — vraiment.',
      },
      {
        id: 'd',
        x: 28,
        y: 52,
        size: 0.85,
        label: 'Ton sourire',
        message: 'Tu me fais sourire, simplement. Sans artifice.',
      },
      {
        id: 'e',
        x: 82,
        y: 48,
        size: 1,
        label: 'Ta douceur',
        message: "J'aime beaucoup la personne que tu es — ta lumière, ta douceur, et la façon dont tu rends les jours plus beaux.",
      },
      {
        id: 'f',
        x: 12,
        y: 68,
        size: 0.75,
        label: 'Spéciale',
        message: 'Tu es spéciale — vraiment. Pas comme un compliment vide. Comme une évidence.',
      },
      {
        id: 'g',
        x: 58,
        y: 62,
        size: 1.15,
        label: 'Un vœu',
        message: 'Pour cette année : que tu sois heureuse. C’est le plus important.',
      },
      {
        id: 'h',
        x: 38,
        y: 78,
        size: 0.8,
        label: 'Pour toi',
        message: 'J’avais envie de créer quelque chose rien que pour toi. Merci d’être passée par ici.',
      },
    ],
  },

  lionelIntro: {
    hello: 'Salut… moi c’est Lionel.',
    role: 'Je vais t’accompagner tout au long de cette petite aventure.',
    ask: 'Tu viens avec moi, Yasmine ?',
  },

  /** Répliques de Lionel — à confirmer avant chaque étape. */
  guideLines: {
    intro: 'Parfait. Regarde bien… une surprise t’attend. Quand tu es prête, on ouvre.',
    cake: 'Ici, chaque bougie attend ton touché. Éteins-les une par une.',
    celebration: 'Bravo… maintenant, un vœu t’attend. On continue ?',
    wish: 'Écris ce que ton cœur murmure. Je m’occupe de l’envoyer tout là-haut.',
    card: 'Cette carte est pour toi. Ouvre-la doucement.',
    envelope: 'Le sceau en cœur… c’est la dernière lettre du voyage. Clique dessus.',
    'night-sky':
      'Chut… regarde bien. Le ciel va s’illuminer pour toi. Touche chaque étoile — une surprise t’attend à la fin.',
    reply: 'Si tu veux laisser un mot à Fréjus, c’est ici. Sinon, tu peux continuer.',
    finale: 'C’est la fin du voyage. Merci d’être passée par ici, Yasmine.',
  },

  /**
   * Boîte de réception Fréjus (Netlify).
   * Ouvre : https://TON-SITE.netlify.app/#admin
   * Variable Netlify : ADMIN_PASSWORD (identique à adminPassword)
   */
  adminPassword: 'frejus-1309',
  messagesApiUrl: '/api',

  replyPrompt: {
    title: 'Un mot pour Fréjus ?',
    lead: 'Ce n’est pas obligatoire. Si tu as envie de lui répondre, tu peux laisser un message ici. Sinon, tu peux simplement continuer.',
    writeCta: 'Écrire un message',
    skipCta: 'Non merci, continuer',
  },

  /**
   * Photo + mot de fin — dépose l’image dans public/photos/yasmine.jpg
   * (jpg, png ou webp — adapte photoSrc si besoin).
   */
  finalePhoto: {
    src: '/photos/yasmine.jpg',
    alt: 'Yasmine',
    word: 'Ta lumière.',
    caption: 'Pour tes 20 ans — avec tout mon cœur.',
  },
} as const;

export type Scene =
  | 'lionel-intro'
  | 'intro'
  | 'cake'
  | 'celebration'
  | 'wish'
  | 'card'
  | 'envelope'
  | 'night-sky'
  | 'reply'
  | 'finale';

export type GuideLineScene = keyof typeof PERSONAL_CONFIG.guideLines;
