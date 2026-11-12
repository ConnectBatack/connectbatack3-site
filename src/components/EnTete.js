import Link from "next/link";

export default function EnTete({ dict, lang }) {
  return (
    <header className="entete">
      <Link className="logo" href={`/${lang}`}>
        <strong>Batack</strong>
        <small>ConnectBatack 3 · COVIDEBA</small>
      </Link>
      <nav className="navigation" aria-label="Navigation principale">
        <Link href={`/${lang}#projets`}>{dict.nav.projets}</Link>
        <Link href={`/${lang}#votre-don`}>{dict.nav.fonctionnement}</Link>
        <Link href={`/${lang}#qui-sommes-nous`}>{dict.nav.apropos}</Link>
        <Link className="lien-discret" href={`/${lang}/connexion`}>
          {dict.nav.connexion}
        </Link>
      </nav>
      <Link className="bouton bouton-principal" href={`/${lang}/don`}>
        {dict.nav.don}
      </Link>
    </header>
  );
}
