import Link from "next/link";
import { chargerDictionnaire } from "@/i18n/dictionnaires";

export default async function PageMerci({ params, searchParams }) {
  const { lang } = await params;
  const { ref } = await searchParams;
  const dict = await chargerDictionnaire(lang);
  return (
    <section className="section section-etroite">
      <h1>{dict.merci.titre}</h1>
      <p>{dict.merci.texte}</p>
      {ref && (
        <p className="aide">
          <strong>{dict.merci.reference}</strong> <code>{ref}</code>
        </p>
      )}
      <Link className="bouton bouton-principal" href={`/${lang}`}>
        {dict.nav.accueil}
      </Link>
    </section>
  );
}
