import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import FormulaireConnexion from "@/components/FormulaireConnexion";

export const metadata = { robots: { index: false, follow: false } };

// Connexion à l'espace COVIDEBA. Maquette : la vraie authentification sera branchée par Pio.
export default async function PageConnexion({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const c = dict.connexion;
  return (
    <section className="section section-etroite">
      <h1>{c.titre}</h1>
      <p>{c.reserve}</p>
      <p className="avertissement">{c.maquette}</p>
      <FormulaireConnexion t={c} lang={lang} />
      <p className="aide-donateur">
        {c.donateur}{" "}
        <Link className="lien-fleche" href={`/${lang}/don`}>{dict.nav.don}</Link>
      </p>
    </section>
  );
}
