import { notFound } from "next/navigation";
import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { projets } from "@/donnees/projets";
import { langues } from "@/i18n/config";
import Apparition from "@/components/Apparition";

const formatEuro = (lang, n) =>
  new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export async function generateStaticParams() {
  const params = [];
  for (const lang of langues) {
    for (const p of projets) {
      params.push({ lang, id: p.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const dict = await chargerDictionnaire(lang);
  const t = dict.projets[id];

  if (!t) return {};

  return {
    title: `${t.titre} - ConnectBatack 3`,
    description: t.description,
  };
}

export default async function PageProjet({ params }) {
  // Next.js 16 : les paramètres sont des promesses
  const { lang, id } = await params;
  const projet = projets.find((p) => p.id === id);

  if (!projet) {
    notFound();
  }

  const dict = await chargerDictionnaire(lang);
  const t = dict.projets[id];
  const a = dict.accueil;
  const pourcent = Math.min(100, Math.round((projet.collecte / projet.objectif) * 100));

  return (
    <section className="section section-etroite">
      <Apparition as="article" className={`carte carte-${projet.couleur}`}>
        <p className="carte-categorie">
          {t.categorie} <span className="badge-exemple">{dict.exemple}</span>
        </p>
        <h1>{t.titre}</h1>
        <p>{t.description}</p>
        
        <div
          className="progression"
          role="progressbar"
          aria-valuenow={pourcent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="progression-barre" style={{ "--p": `${pourcent}%` }} />
        </div>
        <p className="progression-texte">
          <strong>{formatEuro(lang, projet.collecte)}</strong> {a.collecte}{" "}
          {formatEuro(lang, projet.objectif)}
        </p>
        
        <div className="projet-actions">
          <Link className="bouton bouton-principal" href={`/${lang}/don?projet=${projet.id}`}>
            {a.soutenir}
          </Link>
        </div>
      </Apparition>
    </section>
  );
}