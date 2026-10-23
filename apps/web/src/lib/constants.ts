import { Category } from '@/types';

export const STATIC_CATEGORIES: Category[] = [
  { id: 1, name: 'Bourse & actions', slug: 'bourse', description: "Actions, ETF, PEA, compte-titres : stratégies et retours d'expérience.", icon: 'candles', color: '#007aff' },
  { id: 2, name: 'Économie', slug: 'economie', description: "Conjoncture, taux, inflation, emploi : l'actualité économique.", icon: 'globe', color: '#3d5a80' },
  { id: 3, name: 'Épargne & placements', slug: 'epargne', description: 'Livrets, fonds euros, obligations, comptes à terme.', icon: 'piggy', color: '#34c759' },
  { id: 4, name: 'Assurance-vie', slug: 'assurance-vie', description: 'Choisir son contrat, arbitrer, transmettre.', icon: 'umbrella', color: '#30b0c7' },
  { id: 5, name: 'Immobilier & SCPI', slug: 'immobilier', description: 'Résidence principale, locatif, SCPI, crédit immobilier.', icon: 'building', color: '#ff9500' },
  { id: 6, name: 'Impôts & fiscalité', slug: 'impots', description: 'Déclaration, niches fiscales, IFI : payer le juste impôt.', icon: 'receipt', color: '#5856d6' },
  { id: 7, name: 'Retraite', slug: 'retraite', description: 'PER, rachat de trimestres, cumul emploi-retraite.', icon: 'armchair', color: '#ff2d55' },
  { id: 8, name: 'Famille & transmission', slug: 'transmission', description: 'Donation, succession, protection du conjoint.', icon: 'family', color: '#af52de' },
  { id: 9, name: 'Or, cryptos & alternatifs', slug: 'alternatifs', description: 'Or physique, cryptoactifs, forêts, private equity.', icon: 'gem', color: '#00c7be' },
  { id: 10, name: 'Budget & conso', slug: 'budget', description: 'Banques, crédits, assurances, bons plans.', icon: 'wallet', color: '#8e8e93' },
  { id: 11, name: 'Le Café du Revenu', slug: 'cafe', description: 'Présentations, discussions libres, idées pour la rédaction.', icon: 'coffee', color: '#a2845e' },
];
