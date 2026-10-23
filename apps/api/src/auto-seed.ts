import type { Core } from '@strapi/strapi';

export async function autoSeed(strapi: Core.Strapi) {
  strapi.log.info('🌱 Seeding database with initial Le Revenu community data...');

  try {
    const roles = await strapi.documents('plugin::users-permissions.role').findMany();
    const authenticatedRole = roles.find((r: any) => r.type === 'authenticated');

    if (!authenticatedRole) {
      strapi.log.warn('Authenticated role not found during auto-seed');
      return;
    }

    // 1. Seed Demo Users
    const usersData = [
      {
        username: 'LaRedaction',
        email: 'redaction@lerevenu.com',
        password: 'Password123!',
        points: 1250,
        role_title: 'La rédaction du Revenu',
        is_subscriber: true,
        bio: 'Les journalistes du Revenu, présents chaque semaine pour répondre à vos questions.',
        avatar_color: 'var(--brand)',
      },
      {
        username: 'Camille_B',
        email: 'camille@exemple.fr',
        password: 'Password123!',
        points: 142,
        role_title: 'Camille',
        is_subscriber: true,
        bio: 'Cadre, 41 ans. Je prépare ma retraite et celle de mes parents.',
        avatar_color: 'var(--av-5)',
      },
      {
        username: 'Vincent_ETF',
        email: 'vincent@exemple.fr',
        password: 'Password123!',
        points: 612,
        role_title: 'Vincent',
        is_subscriber: true,
        bio: 'Ingénieur, investisseur passif depuis 2015. Fan des ETF monde.',
        avatar_color: 'var(--av-1)',
      },
      {
        username: 'PapyBoursier',
        email: 'papy@exemple.fr',
        password: 'Password123!',
        points: 804,
        role_title: 'Papy Boursier',
        is_subscriber: true,
        bio: '40 ans de Bourse, des erreurs et quelques réussites.',
        avatar_color: 'var(--av-4)',
      },
      {
        username: 'Odile.Retraite',
        email: 'odile@exemple.fr',
        password: 'Password123!',
        points: 286,
        role_title: 'Odile',
        is_subscriber: false,
        bio: 'Jeune retraitée, je gère mon patrimoine en famille.',
        avatar_color: 'var(--av-2)',
      },
      {
        username: 'Nadia.Patrimoine',
        email: 'nadia@exemple.fr',
        password: 'Password123!',
        points: 197,
        role_title: 'Nadia',
        is_subscriber: true,
        bio: 'Mère de trois enfants, je prépare la transmission sereinement.',
        avatar_color: 'var(--av-5)',
      },
      {
        username: 'Thomas_PEA',
        email: 'thomas@exemple.fr',
        password: 'Password123!',
        points: 58,
        role_title: 'Thomas',
        is_subscriber: false,
        bio: '32 ans, je débute en Bourse.',
        avatar_color: 'var(--av-4)',
      },
      {
        username: 'Sandrine_CGP',
        email: 'sandrine@exemple.fr',
        password: 'Password123!',
        points: 238,
        role_title: 'Conseillère en gestion de patrimoine',
        is_pro: true,
        is_subscriber: false,
        bio: 'CGP indépendante depuis quinze ans. Je partage ici à titre informatif, sans démarchage.',
        avatar_color: 'var(--av-2)',
      },
      {
        username: 'Me_Garnier',
        email: 'garnier@exemple.fr',
        password: 'Password123!',
        points: 175,
        role_title: 'Notaire',
        is_pro: true,
        is_subscriber: false,
        bio: 'Notaire en région lyonnaise. Successions, donations, régimes matrimoniaux.',
        avatar_color: 'var(--av-1)',
      },
      {
        username: 'Karim_Immo',
        email: 'karim@exemple.fr',
        password: 'Password123!',
        points: 131,
        role_title: 'Karim',
        is_subscriber: false,
        bio: 'Investisseur immobilier, 3 biens locatifs et quelques SCPI.',
        avatar_color: 'var(--av-4)',
      },
      {
        username: 'Claire_Nantes',
        email: 'claire@exemple.fr',
        password: 'Password123!',
        points: 166,
        role_title: 'Claire',
        is_subscriber: false,
        bio: 'Je compare tout avant de signer.',
        avatar_color: 'var(--av-3)',
      },
      {
        username: 'Sophie.Invest',
        email: 'sophie@exemple.fr',
        password: 'Password123!',
        points: 151,
        role_title: 'Sophie',
        is_subscriber: true,
        bio: "Abonnée au Revenu, curieuse de tout ce qui touche à l'argent.",
        avatar_color: 'var(--av-1)',
      },
      {
        username: 'Bertrand59',
        email: 'bertrand@exemple.fr',
        password: 'Password123!',
        points: 118,
        role_title: 'Bertrand',
        is_subscriber: false,
        bio: 'Cadre dans le Nord, je prépare ma retraite.',
        avatar_color: 'var(--av-3)',
      },
      {
        username: 'Marc_Lyon',
        email: 'marc@exemple.fr',
        password: 'Password123!',
        points: 92,
        role_title: 'Marc',
        is_subscriber: false,
        bio: "Passionné d'or et d'histoire monétaire.",
        avatar_color: 'var(--av-2)',
      },
      {
        username: 'LeRentier',
        email: 'lerentier@exemple.fr',
        password: 'Password123!',
        points: 73,
        role_title: 'Le Rentier',
        is_subscriber: false,
        bio: 'Stratégie dividendes, patience et réinvestissement.',
        avatar_color: 'var(--av-1)',
      },
      {
        username: 'JeuneEpargnant',
        email: 'hugo@exemple.fr',
        password: 'Password123!',
        points: 37,
        role_title: 'Hugo',
        is_subscriber: false,
        bio: '25 ans, premier CDI, je veux bien démarrer.',
        avatar_color: 'var(--av-2)',
      },
      {
        username: 'Helene_R',
        email: 'helene@exemple.fr',
        password: 'Password123!',
        points: 22,
        role_title: 'Hélène',
        is_subscriber: false,
        bio: 'Je loue un studio meublé et découvre la fiscalité qui va avec.',
        avatar_color: 'var(--av-3)',
      },
      {
        username: 'Julie_Toulouse',
        email: 'julie@exemple.fr',
        password: 'Password123!',
        points: 44,
        role_title: 'Julie',
        is_subscriber: false,
        bio: 'Épargnante toulousaine, je prépare le financement des études de mes enfants.',
        avatar_color: 'var(--av-1)',
      },
    ];

    const usersMap: Record<string, any> = {};

    for (const u of usersData) {
      let user = await strapi.documents('plugin::users-permissions.user').findFirst({
        filters: { username: u.username },
      });

      if (!user) {
        user = await strapi.documents('plugin::users-permissions.user').create({
          data: {
            ...u,
            confirmed: true,
            blocked: false,
            role: authenticatedRole.id,
          },
        });
      }
      usersMap[u.username] = user;
    }

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Bourse & actions',
        slug: 'bourse',
        description: "Actions, ETF, PEA, compte-titres : stratégies et retours d'expérience.",
        icon: 'candles',
        color: '#007aff',
      },
      {
        name: 'Économie',
        slug: 'economie',
        description: "Conjoncture, taux, inflation, emploi : l'actualité économique en France, en Europe et dans le monde.",
        icon: 'globe',
        color: '#3d5a80',
      },
      {
        name: 'Épargne & placements',
        slug: 'epargne',
        description: 'Livrets, fonds euros, obligations, comptes à terme.',
        icon: 'piggy',
        color: '#34c759',
      },
      {
        name: 'Assurance-vie',
        slug: 'assurance-vie',
        description: 'Choisir son contrat, arbitrer, transmettre.',
        icon: 'umbrella',
        color: '#30b0c7',
      },
      {
        name: 'Immobilier & SCPI',
        slug: 'immobilier',
        description: 'Résidence principale, locatif, SCPI, crédit immobilier.',
        icon: 'building',
        color: '#ff9500',
      },
      {
        name: 'Impôts & fiscalité',
        slug: 'impots',
        description: 'Déclaration, niches fiscales, IFI : payer le juste impôt.',
        icon: 'receipt',
        color: '#5856d6',
      },
      {
        name: 'Retraite',
        slug: 'retraite',
        description: 'PER, rachat de trimestres, cumul emploi-retraite.',
        icon: 'armchair',
        color: '#ff2d55',
      },
      {
        name: 'Famille & transmission',
        slug: 'transmission',
        description: 'Donation, succession, protection du conjoint.',
        icon: 'family',
        color: '#af52de',
      },
      {
        name: 'Or, cryptos & alternatifs',
        slug: 'alternatifs',
        description: 'Or physique, cryptoactifs, forêts, private equity.',
        icon: 'gem',
        color: '#00c7be',
      },
      {
        name: 'Budget & conso',
        slug: 'budget',
        description: 'Banques, crédits, assurances, bons plans.',
        icon: 'wallet',
        color: '#8e8e93',
      },
      {
        name: 'Le Café du Revenu',
        slug: 'cafe',
        description: 'Présentations, discussions libres, idées pour la rédaction.',
        icon: 'coffee',
        color: '#a2845e',
      },
    ];

    const categoriesMap: Record<string, any> = {};

    for (const c of categoriesData) {
      let category = await strapi.documents('api::category.category').findFirst({
        filters: { slug: c.slug },
      });

      if (!category) {
        category = await strapi.documents('api::category.category').create({
          data: c,
        });
      }
      categoriesMap[c.slug] = category;
    }

    // 3. Seed Realistic Discussions & Replies
    const discussionsData = [
      {
        title: 'Bienvenue dans la Communauté du Revenu ! Présentez-vous ici',
        slug: 'bienvenue-dans-la-communaute-du-revenu',
        cat: 'cafe',
        type: 'discussion',
        author: 'LaRedaction',
        pinned: true,
        featured: 'none',
        likes: 64,
        views: 2140,
        content: `Bonjour à toutes et à tous,

Cet espace est le vôtre : posez vos questions, partagez vos expériences, aidez les autres membres. Les journalistes du Revenu passent chaque jour et répondent aux questions les plus utiles.

**Pour bien démarrer :**
- Présentez-vous en une phrase en réponse à ce message
- Choisissez les espaces qui vous intéressent
- Marquez « Utile » les réponses qui vous aident : c'est ce qui fait remonter les meilleures contributions

Bienvenue !`,
        replies: [
          {
            author: 'Sophie.Invest',
            content: "Bonjour ! Abonnée au magazine depuis 6 ans, ravie de pouvoir enfin échanger avec d'autres lecteurs.",
            likes: 12,
          },
          {
            author: 'JeuneEpargnant',
            content: "Salut tout le monde, Hugo, 25 ans. Premier CDI et premier salaire à placer : je suis là pour apprendre !",
            likes: 18,
          },
          {
            author: 'PapyBoursier',
            content: "Bienvenue aux jeunes ! N'hésitez pas à poser des questions, même basiques. On est tous passés par là.",
            likes: 25,
          },
        ],
      },
      {
        title: 'Ouvrir un PEA avec 5 000 € : par où commencer ?',
        slug: 'ouvrir-un-pea-avec-5000-euros-par-ou-commencer',
        cat: 'bourse',
        type: 'question',
        author: 'Thomas_PEA',
        pinned: false,
        featured: 'none',
        likes: 19,
        views: 1210,
        content: `Bonjour, je viens d'ouvrir un PEA en ligne et j'ai 5 000 € à y placer. Je ne connais pas grand-chose aux actions.

Vaut-il mieux tout investir d'un coup ou étaler ? Et sur quoi : des ETF, quelques actions ?`,
        hasSolutionIndex: 1,
        replies: [
          {
            author: 'PapyBoursier',
            content: "Première chose : vous avez bien une épargne de précaution à côté ? Le PEA, c'est de l'argent qu'on oublie au moins cinq ans.",
            likes: 14,
          },
          {
            author: 'Vincent_ETF',
            content: `Mon expérience : pour débuter, un ETF éligible au PEA qui réplique un indice mondial fait très bien le travail. Une seule ligne, des frais faibles, une large diversification.

Pour l'entrée : investir une partie maintenant puis programmer un versement mensuel. On lisse son point d'entrée et on prend l'habitude.

Rappel utile : le PEA est plafonné à 150 000 € de versements, et après cinq ans les gains sont exonérés d'impôt sur le revenu (les prélèvements sociaux restent dus).`,
            likes: 47,
            verified: true,
          },
          {
            author: 'LaRedaction',
            content: "Très bonne réponse de @Vincent_ETF. Nous avons consacré un dossier aux ETF : comparez surtout les frais courants et la taille du fonds avant de choisir. Et gardez la tête froide les jours de baisse : c'est là que la régularité paie.",
            likes: 29,
          },
        ],
      },
      {
        title: "Assurance-vie après 70 ans : est-ce encore intéressant ?",
        slug: 'assurance-vie-apres-70-ans-est-ce-encore-interessant',
        cat: 'assurance-vie',
        type: 'question',
        author: 'Odile.Retraite',
        pinned: false,
        featured: 'none',
        likes: 24,
        views: 1340,
        content: "J'ai 71 ans et je me demande s'il est encore utile de verser sur une assurance-vie, notamment pour la transmission à mes petits-enfants. On m'a dit que la fiscalité était moins avantageuse après 70 ans ?",
        hasSolutionIndex: 0,
        replies: [
          {
            author: 'Nadia.Patrimoine',
            content: "Oui, mais ça reste souvent intéressant. Pour les versements après 70 ans, l'abattement est de 30 500 € au total (tous bénéficiaires confondus) et il ne porte que sur les primes versées : les gains, eux, sont exonérés de droits de succession. Sur une longue durée, ça peut peser lourd.",
            likes: 38,
            verified: true,
          },
          {
            author: 'LaRedaction',
            content: "Précision utile : pour les primes versées avant 70 ans, l'abattement est de 152 500 € par bénéficiaire. Les deux régimes peuvent se combiner sur un même contrat.",
            likes: 27,
          },
        ],
      },
      {
        title: "J'ai 25 ans et 10 000 € de côté : je fais quoi ?",
        slug: 'j-ai-25-ans-et-10000-euros-de-cote-je-fais-quoi',
        cat: 'epargne',
        type: 'question',
        author: 'JeuneEpargnant',
        pinned: false,
        featured: 'none',
        likes: 33,
        views: 1890,
        content: `Premier CDI depuis un an, j'ai réussi à mettre 10 000 € de côté sur un livret. Pas de projet immobilier avant quatre ou cinq ans.

Je me sens un peu perdu entre PEA, assurance-vie, PER… Comment auriez-vous réparti à mon âge ?`,
        replies: [
          {
            author: 'Claire_Nantes',
            content: "Garde déjà trois à six mois de dépenses sur ton livret. Le reste peut travailler.",
            likes: 21,
          },
          {
            author: 'Vincent_ETF',
            content: "À 25 ans, ouvrir un PEA et une assurance-vie tôt, même avec peu, c'est surtout prendre date pour la fiscalité. L'antériorité compte.",
            likes: 26,
          },
          {
            author: 'PapyBoursier',
            content: "Le PER peut attendre à mon avis : l'argent est bloqué jusqu'à la retraite (sauf achat de la résidence principale) et l'avantage fiscal est faible si ton taux d'imposition est bas.",
            likes: 19,
          },
        ],
      },
      {
        title: 'SCPI : vous avez renforcé ces derniers mois ou vous attendez ?',
        slug: 'scpi-vous-avez-renforce-ces-derniers-mois-ou-vous-attendez',
        cat: 'immobilier',
        type: 'discussion',
        author: 'Karim_Immo',
        pinned: false,
        featured: 'none',
        likes: 15,
        views: 760,
        content: `Après les baisses de prix de parts de certaines SCPI, je vois deux écoles autour de moi : ceux qui en profitent pour renforcer et ceux qui ne veulent plus en entendre parler.

Et vous, comment avez-vous réagi ?`,
        replies: [
          {
            author: 'Helene_R',
            content: "J'attends. J'ai été échaudée par les délais de revente sur une de mes SCPI.",
            likes: 6,
          },
          {
            author: 'PapyBoursier',
            content: "J'ai renforcé, mais uniquement sur des SCPI récentes, sans immobilier de bureaux acheté au plus haut.",
            likes: 13,
          },
        ],
      },
      {
        title: 'Question de la semaine : quel est le meilleur conseil d’argent que vous ayez reçu ?',
        slug: 'question-de-la-semaine-meilleur-conseil-argent',
        cat: 'cafe',
        type: 'discussion',
        author: 'LaRedaction',
        pinned: false,
        featured: 'question',
        likes: 41,
        views: 980,
        content: `Chaque semaine, la rédaction pose une question à la communauté. Les réponses les plus inspirantes pourront être reprises, avec votre accord, dans la newsletter.

Alors : quel conseil d'argent a changé votre vie ? Qui vous l'a donné ?`,
        replies: [
          {
            author: 'PapyBoursier',
            content: 'Mon père : « N\'investis jamais l\'argent dont tu auras besoin dans les cinq ans. » Ça m\'a évité bien des ventes en catastrophe.',
            likes: 31,
          },
          {
            author: 'Vincent_ETF',
            content: '« Le temps passé sur le marché compte plus que le moment où on y entre. » Investir tous les mois, sans se poser de questions.',
            likes: 22,
          },
        ],
      },
      {
        title: 'Sondage de la semaine : quel est votre placement prioritaire pour les 12 prochains mois ?',
        slug: 'sondage-de-la-semaine-placement-prioritaire-12-mois',
        cat: 'epargne',
        type: 'poll',
        author: 'LaRedaction',
        pinned: false,
        featured: 'poll',
        likes: 28,
        views: 1460,
        content: 'Votez puis expliquez votre choix en commentaire : les résultats seront commentés dans le prochain numéro.',
        poll_options: [
          { label: 'Assurance-vie', votes: 214 },
          { label: 'Actions / PEA', votes: 268 },
          { label: 'Immobilier / SCPI', votes: 87 },
          { label: 'Livrets et épargne sans risque', votes: 141 },
          { label: 'Or physique', votes: 64 },
          { label: 'Rembourser mes crédits', votes: 39 },
        ],
        replies: [
          {
            author: 'Vincent_ETF',
            content: 'PEA sans hésiter, versement programmé chaque mois sur un ETF monde.',
            likes: 11,
          },
        ],
      },
      {
        title: 'Frais réels ou abattement de 10 % : comment savoir ce qui est le plus avantageux ?',
        slug: 'frais-reels-ou-abattement-10-pourcent',
        cat: 'impots',
        type: 'question',
        author: 'Julie_Toulouse',
        pinned: false,
        featured: 'none',
        likes: 12,
        views: 910,
        content: 'Je fais 35 km aller-retour par jour en voiture pour aller travailler. Est-ce que je devrais passer aux frais réels ?',
        hasSolutionIndex: 0,
        replies: [
          {
            author: 'Bertrand59',
            content: 'Faites le calcul simplement : additionnez vos frais (barème kilométrique selon la puissance de la voiture, repas, etc.) et comparez avec 10 % de votre salaire. Si vos frais dépassent, les frais réels sont gagnants. Attention : il faut garder les justificatifs.',
            likes: 22,
          },
        ],
      },
      {
        title: 'Donation aux enfants : faut-il le faire maintenant ou attendre ?',
        slug: 'donation-aux-enfants-maintenant-ou-attendre',
        cat: 'transmission',
        type: 'question',
        author: 'Nadia.Patrimoine',
        pinned: false,
        featured: 'none',
        likes: 17,
        views: 690,
        content: 'Nos enfants ont 19, 22 et 25 ans. Nous pensons à leur donner une partie de notre épargne pour les aider à démarrer. Est-ce le bon moment ? Quels pièges éviter ?',
        replies: [
          {
            author: 'Odile.Retraite',
            content: 'Chaque parent peut donner 100 000 € par enfant en franchise de droits, et cet abattement se renouvelle tous les quinze ans. Plus on commence tôt, plus on peut en profiter plusieurs fois.',
            likes: 16,
          },
          {
            author: 'Me_Garnier',
            content: "J'ajoute un point de forme : une donation qui porte sur un bien immobilier passe obligatoirement devant notaire. Pour une somme d'argent, un don manuel suffit, mais il doit être déclaré à l'administration fiscale.",
            likes: 13,
          },
        ],
      },
      {
        title: "PER : vos retours d'expérience après quelques années ?",
        slug: 'per-vos-retours-d-experience-apres-quelques-annees',
        cat: 'retraite',
        type: 'discussion',
        author: 'Bertrand59',
        pinned: false,
        featured: 'none',
        likes: 9,
        views: 540,
        content: "J'ai ouvert un PER il y a trois ans pour la déduction fiscale. Je m'interroge sur les frais et la sortie. Vos retours ?",
        replies: [
          {
            author: 'Sandrine_CGP',
            content: "Un point que je vois souvent négligé : si vous avez déduit vos versements, la part de capital correspondante sera imposée à la sortie, et les gains aussi. Comparez votre taux marginal d'imposition actuel avec celui que vous anticipez à la retraite : c'est lui qui dit si la déduction est vraiment avantageuse.",
            likes: 15,
          },
        ],
      },
      {
        title: 'Location meublée : micro-BIC ou régime réel ?',
        slug: 'location-meublee-micro-bic-ou-regime-reel',
        cat: 'impots',
        type: 'question',
        author: 'Helene_R',
        pinned: false,
        featured: 'none',
        likes: 3,
        views: 96,
        content: "Je loue un studio meublé depuis deux mois. Je ne sais pas quel régime choisir pour ma première déclaration. Comment avez-vous fait votre choix ?",
        replies: [],
      },
      {
        title: 'Dividendes sur un compte-titres : flat tax ou barème ?',
        slug: 'dividendes-compte-titres-flat-tax-ou-bareme',
        cat: 'bourse',
        type: 'question',
        author: 'LeRentier',
        pinned: false,
        featured: 'none',
        likes: 2,
        views: 58,
        content: "Je perçois des dividendes sur un compte-titres ordinaire. Flat tax ou barème progressif : qu'avez-vous choisi et pourquoi ?",
        replies: [],
      },
    ];

    for (const d of discussionsData) {
      let discussion = await strapi.documents('api::discussion.discussion').findFirst({
        filters: { slug: d.slug },
      });

      const category = categoriesMap[d.cat] || categoriesMap['bourse'] || Object.values(categoriesMap)[0];
      const author = usersMap[d.author] || usersMap['Camille_B'] || Object.values(usersMap)[0];

      if (!discussion) {
        discussion = await strapi.documents('api::discussion.discussion').create({
          data: {
            title: d.title,
            slug: d.slug,
            content: d.content,
            type: d.type as any,
            pinned: d.pinned,
            featured: d.featured as any,
            likes: d.likes,
            views: d.views,
            poll_options: d.poll_options,
            category: category.documentId || category.id,
            author: author.documentId || author.id,
          },
        });

        if (d.replies && d.replies.length > 0) {
          const createdReplies: any[] = [];
          for (const r of d.replies) {
            const rAuthor = usersMap[r.author] || usersMap['Camille_B'] || Object.values(usersMap)[0];
            const createdReply = await strapi.documents('api::reply.reply').create({
              data: {
                content: r.content,
                likes: r.likes,
                verified: (r as any).verified || false,
                discussion: discussion.documentId || discussion.id,
                author: rAuthor.documentId || rAuthor.id,
              },
            });
            createdReplies.push(createdReply);
          }

          if ((d as any).hasSolutionIndex !== undefined && createdReplies[(d as any).hasSolutionIndex]) {
            const solutionValue = createdReplies[(d as any).hasSolutionIndex].documentId || createdReplies[(d as any).hasSolutionIndex].id;
            await strapi.documents('api::discussion.discussion').update({
              documentId: discussion.documentId,
              data: {
                solution: solutionValue,
              } as any,
            });
          }
        }
      }
    }

    strapi.log.info('✅ Initial database seed completed successfully!');
  } catch (err) {
    strapi.log.warn('Could not auto-seed database:', err);
  }
}
