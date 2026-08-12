/** Personnalise tous les messages ici — rien d'autre à chercher. */
export const PERSONAL_CONFIG = {
  authorName: 'Fréjus',
  guideName: 'Lionel',
  greetingTitle: 'Joyeux 20 ans, Yasmine',
  introMessage:
    "J'avais envie de créer quelque chose rien que pour toi. Tu me fais sourire, et aujourd'hui quelqu'un pense très fort à toi.",
  cardMessage:
    "Je te trouve spéciale. J'aime beaucoup la personne que tu es — ta lumière, ta douceur, et la façon dont tu rends les jours plus beaux. Joyeux anniversaire, Yasmine.",
  envelopeMessage:
    "Yasmine,\n\nPour tes 20 ans, j'ai voulu t'offrir un petit univers. Pas une déclaration trop lourde — juste une pensée sincère : tu comptes, tu inspires, et tu mérites d'être célébrée.\n\nMerci d'être toi.\n\n— Fréjus",
  starCompliments: [
    'Tu illumines la pièce sans effort.',
    "J'aime beaucoup la personne que tu es.",
    'Tu me fais sourire, simplement.',
    'Quelqu’un pense très fort à toi.',
    'Tu es spéciale — vraiment.',
  ],

  /** Code secret = 13 septembre → 1309 (accepte aussi 13/09). */
  secretCode: '1309',
  secretHint:
    'Indice : ce qu’on a en commun .',
  loveTitle: 'Mon univers pour toi',
  loveMessage: `Yasmine,

Ici, plus de surprise légère — juste mon cœur, sans filtre.

Je t’aime. Pas à moitié, pas « un peu », pas en silence seulement.
Je t’aime quand tu ris, quand tu es dans ta bulle, quand tu ne te rends même pas compte de la lumière que tu laisses derrière toi.


Si tu lis ces lignes, sache que chaque battement ici est pour toi.
Que tu me manques même quand tu es là.
Que je craque pour toi, encore, et encore.

Je t’aime, Yasmine.

Malheureusemnt, tout ne s'est pas passé comme je l'aurais voulu
Pas jusqu’au bout.
Et c’est la chose la plus triste que j’aie à t’écrire ici — te laisser partir alors que mon cœur, lui, reste.

Alors écoute-moi bien : sois heureuse.
C’est le plus important. Plus important que nous, plus important que ce que j’aurais voulu garder.
Si tu brilles, même loin de moi, alors une partie de moi sera en paix.

Je t’aimerai sûrement encore en silence.
Et je te souhaiterai le meilleur, toujours.

— Fréjus`,

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
    finale: 'Attends… il reste une porte que je ne peux ouvrir pour toi. Seulement toi.',
    'secret-gate':
      'Le code, c’est ce qu’on partage tous les deux — votre date. Jour puis mois.',
    'heart-draw':
      'Je m’arrête ici. Je ne peux pas aller plus loin… le reste, c’est entre Fréjus et toi.',
  },

  /** Confirmation solennelle avant le monde secret. */
  secretConfirm: {
    title: 'Es-tu vraiment sûre ?',
    warning:
      'Ce monde ne s’ouvre qu’une fois. Si tu refuses d’y entrer maintenant, il se fermera à jamais — pour de vrai. Plus personne ne pourra le rouvrir.',
    question: 'Yasmine… veux-tu vraiment franchir cette porte ?',
    accept: 'Oui. Je veux y entrer',
    refuse: 'Non. Fermez ce monde pour toujours',
    sealedTitle: 'Ce monde s’est refermé',
    sealedMessage:
      'Tu as choisi de ne pas y entrer. La porte s’est close pour toujours. Ce qui devait rester entre Fréjus et toi restera non dit — et c’est respecté.',
  },

  /**
   * Boîte de réception Fréjus (Netlify).
   * - Site : https://TON-SITE.netlify.app/#admin
   * - Mot de passe : doit être identique à la variable d’environnement
   *   ADMIN_PASSWORD sur Netlify (Site settings → Environment variables).
   * - En local : npm run dev  (via Netlify Dev sur le port 8888)
   */
  adminPassword: 'frejus-1309',
  messagesApiUrl: '/api',

  replyPrompt: {
    title: 'Un mot pour Fréjus ?',
    lead: 'Ce n’est pas obligatoire. Si tu as envie de lui répondre, tu peux laisser un message ici. Sinon, tu peux simplement continuer.',
    writeCta: 'Écrire un message',
    skipCta: 'Non merci, continuer',
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
  | 'finale'
  | 'secret-gate'
  | 'heart-draw'
  | 'love-universe'
  | 'reply';

export type GuideLineScene = keyof typeof PERSONAL_CONFIG.guideLines;

/** Normalise une saisie de date (1309, 13/09, 13-09…) vers JJMM. */
export function normalizeSecretCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}
