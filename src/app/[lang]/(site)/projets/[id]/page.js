import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { projets, cheminPhoto } from "@/donnees/projets";
import { langues } from "@/i18n/config";
import Apparition from "@/components/Apparition";
import Compteur from "@/components/Compteur";

const formatEuro = (lang, n) =>
  new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export async function generateStaticParams() {
  return langues.flatMap((lang) => projets.map((p) => ({ lang, id: p.id })));
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const dict = await chargerDictionnaire(lang);
  const t = dict.projets[id];
  if (!t) return {};
  return { title: `${t.titre} | ConnectBatack 3`, description: t.description };
}

export default async function PageProjet({ params }) {
  const { lang, id } = await params;
  const projet = projets.find((p) => p.id === id);
  if (!projet) notFound();

  const dict = await chargerDictionnaire(lang);
  const t = dict.projets[id];
  const a = dict.accueil;
  const pourcent = Math.min(100, Math.round((projet.collecte / projet.objectif) * 100));

  return (
    <>
      <section className="bandeau-photo bandeau-photo-court">
        <div className="diapo active">
          <Image src={cheminPhoto(projet.photo)} alt={dict.photos[projet.photo]} fill sizes="100vw" loading="eager" />
        </div>
        <div className="bandeau-contenu">
          <div>
            <span className="surtitre">{t.categorie}</span>
            <h1>{t.accroche}</h1>
          </div>
        </div>
      </section>

      <section className="section section-etroite">
        <Apparition>
          <h2>{t.titre}</h2>
          <p>{t.description}</p>
          <div className="progression" role="progressbar" aria-valuenow={pourcent} aria-valuemin={0} aria-valuemax={100}>
            <span className="progression-barre" style={{ "--p": `${pourcent}%` }} />
          </div>
          <p className="progression-texte">
            <strong>{formatEuro(lang, projet.collecte)}</strong> {a.collecte} {formatEuro(lang, projet.objectif)}
          </p>
          <ul className="stats-projet">
            <li>
              <Compteur valeur={pourcent} langue={lang} pourcentage />
              <span>{dict.projet.atteint}</span>
            </li>
            <li>
              <Compteur valeur={projet.contributeurs} langue={lang} />
              <span>{dict.projet.contributeurs}</span>
            </li>
            <li>
              <Compteur valeur={Math.max(0, projet.objectif - projet.collecte)} langue={lang} devise />
              <span>{dict.projet.reste}</span>
            </li>
          </ul>
          <p className="note-exemple">{dict.noteExemple}</p>
          <div className="projet-actions">
            <Link className="bouton bouton-principal bouton-grand" href={`/${lang}/don?projet=${projet.id}`}>
              {a.soutenir}
            </Link>
          </div>
        </Apparition>
      </section>
    </>
  );
}
