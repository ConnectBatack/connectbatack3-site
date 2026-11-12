import Link from "next/link";
import { redirect } from "next/navigation";
import { chargerGestion, langueGestion } from "@/i18n/gestion";
import { lireSession } from "@/lib/session";
import MenuGestion from "@/components/gestion/MenuGestion";

export const metadata = { robots: { index: false, follow: false } };

// Habillage de l'espace de gestion (COVIDEBA, trésorier, encadrants).
export default async function MiseEnPageGestion({ children, params }) {
  const { lang } = await params;
  const session = await lireSession();
  if (!session) redirect(`/${lang}/connexion`);
  const g = await chargerGestion(lang);
  const l = langueGestion(lang);

  return (
    <div className="gestion" lang={l}>
      <p className="bandeau-preversion">{g.maquette}</p>
      <div className="gestion-cadre">
        <aside className="gestion-menu">
          <Link className="logo" href={`/${lang}/gestion`}>
            <strong>Batack</strong>
            <small>{g.titreEspace}</small>
          </Link>
          <MenuGestion
            lang={lang}
            liens={[
              { href: `/${lang}/gestion`, texte: g.menu.tableau },
              { href: `/${lang}/gestion/poids`, texte: g.menu.poids },
              { href: `/${lang}/gestion/plan`, texte: g.menu.plan },
              { href: `/${lang}/gestion/registre`, texte: g.menu.registre },
            ]}
          />
          <div className="gestion-menu-bas">
            <p>{g.utilisateur}</p>
            <nav className="gestion-langues" aria-label="Langue / Language">
              <Link href={`/fr/gestion`} aria-current={l === "fr" ? "true" : undefined}>FR</Link>
              <Link href={`/en/gestion`} aria-current={l === "en" ? "true" : undefined}>EN</Link>
            </nav>
            <Link href={`/${lang}`}>{g.menu.site}</Link>
            <Link href={`/${lang}/connexion`}>{g.menu.deconnexion}</Link>
          </div>
        </aside>
        <main className="gestion-contenu" id="contenu">{children}</main>
      </div>
    </div>
  );
}
