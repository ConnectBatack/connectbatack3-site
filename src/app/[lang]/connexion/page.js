import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";

// Page d'attente : l'authentification sera ajoutée quand le backend et les rôles seront décidés.
export default async function PageConnexion({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return (
    <section className="section section-etroite">
      <h1>{dict.connexion.titre}</h1>
      <p>{dict.connexion.texte}</p>
      <p>{dict.connexion.donateur}</p>
      <Link className="bouton bouton-principal" href={`/${lang}/don`}>
        {dict.nav.don}
      </Link>
    </section>
  );
}
