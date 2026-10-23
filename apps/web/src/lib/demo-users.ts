export interface DemoUserOption {
  username: string;
  name: string;
  email: string;
  role: string;
  points: number;
  is_subscriber: boolean;
  avatar_color: string;
  bio?: string;
}

export const DEMO_USERS: DemoUserOption[] = [
  {
    username: 'Camille_B',
    name: 'Camille',
    email: 'camille@exemple.fr',
    role: 'Membre actif',
    points: 142,
    is_subscriber: true,
    avatar_color: 'var(--av-5)',
    bio: 'Cadre, 41 ans. Je prépare ma retraite et celle de mes parents.',
  },
  {
    username: 'Vincent_ETF',
    name: 'Vincent',
    email: 'vincent@exemple.fr',
    role: 'Contributeur averti',
    points: 612,
    is_subscriber: true,
    avatar_color: 'var(--av-1)',
    bio: 'Ingénieur, investisseur passif depuis 2015. Fan des ETF monde.',
  },
  {
    username: 'LaRedaction',
    name: 'La rédaction du Revenu',
    email: 'redaction@lerevenu.com',
    role: 'Rédaction officielle',
    points: 1250,
    is_subscriber: true,
    avatar_color: 'var(--brand)',
    bio: 'Les journalistes du Revenu, présents chaque semaine pour répondre à vos questions.',
  },
  {
    username: 'PapyBoursier',
    name: 'Papy Boursier',
    email: 'papy@exemple.fr',
    role: 'Pilier de la communauté',
    points: 804,
    is_subscriber: true,
    avatar_color: 'var(--av-4)',
    bio: '40 ans de Bourse, des erreurs et quelques réussites.',
  },
];
