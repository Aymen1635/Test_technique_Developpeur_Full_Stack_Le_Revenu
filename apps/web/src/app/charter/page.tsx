import React from 'react';
import { SideNav } from '@/components/layout/side-nav';

export const metadata = {
  title: 'Charte de la communauté - Le Revenu',
  description: 'Les sept règles de bienveillance et de conformité AMF de la communauté Le Revenu.',
};

export default function CharterPage() {
  const rules = [
    {
      title: 'Bienveillance',
      desc: 'On débat des idées, jamais des personnes. Les débutants sont les bienvenus : aucune question n’est bête.',
    },
    {
      title: 'Expérience, pas conseil personnalisé',
      desc: 'Partagez ce que vous faites et pourquoi. Chacun reste pleinement responsable de ses décisions d’investissement selon les règles de l’AMF.',
    },
    {
      title: 'Pas de sollicitation commerciale',
      desc: 'Aucune promotion de produit financier non sollicitée, de lien de parrainage ou de démarchage.',
    },
    {
      title: 'Des liens vers des sources fiables',
      desc: 'Privilégiez les sources officielles : lerevenu.com, sites publics (.gouv.fr, service-public.fr), l’AMF, la Banque de France et l’Insee.',
    },
    {
      title: 'Pas de rumeurs de marché',
      desc: 'Les « tuyaux » non sourcés et les incitations directes à acheter ou vendre un titre coté sont strictement proscrits.',
    },
    {
      title: 'Protégez votre anonymat',
      desc: 'Ne publiez jamais vos coordonnées bancaires, numéros de contrats ou informations permettant de vous identifier personnellement.',
    },
    {
      title: 'Signalez plutôt que répondre',
      desc: 'Un message vous semble enfreindre la charte ? Utilisez le bouton « Signaler » pour alerter notre équipe de modération.',
    },
  ];

  return (
    <div className="layout no-right">
      <SideNav />

      <main className="main max-w-3xl">
        <header className="mb-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
            La charte de la communauté
          </h1>
          <p className="text-ink-2 text-sm">
            Sept règles simples pour que les échanges restent utiles, bienveillants et conformes au
            cadre réglementaire de l’AMF.
          </p>
        </header>

        <ol className="flex flex-col gap-3 list-none p-0 m-0">
          {rules.map((rule, idx) => (
            <li
              key={idx}
              className="card grid grid-cols-[40px_minmax(0,1fr)] gap-3 p-4 items-start"
            >
              <span className="font-display text-2xl font-black text-brand text-center">
                {idx + 1}
              </span>
              <div>
                <h3 className="font-bold text-base mb-1">{rule.title}</h3>
                <p className="text-ink-2 text-sm leading-relaxed">{rule.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
