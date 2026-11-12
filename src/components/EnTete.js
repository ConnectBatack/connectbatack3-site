import Link from "next/link";

export default function EnTete({ dict, lang }) {
  const liens = [
    [`/${lang}#projets`, dict.nav.projets],
    [`/${lang}/notre-histoire`, dict.nav.histoire],
    [`/${lang}/transparence`, dict.nav.transparence],
    [`/${lang}/qui-sommes-nous`, dict.nav.apropos],
  ];
  return (
    <header className="entete">
      <Link className="logo" href={`/${lang}`}>
        <strong>Batack</strong>
        <small>ConnectBatack 3 · COVIDEBA</small>
      </Link>
      <nav className="navigation" aria-label={dict.nav.menu}>
        {liens.map(([href, texte]) => (
          <Link key={href} href={href}>
            {texte}
          </Link>
        ))}
      </nav>
      <Link className="bouton bouton-principal" href={`/${lang}/don`}>
        {dict.nav.don}
      </Link>
      {/* Menu pour téléphone : fonctionne sans JavaScript grâce à <details>. */}
      <details className="menu-mobile">
        <summary>{dict.nav.menu}</summary>
        <nav aria-label={dict.nav.menu}>
          {liens.map(([href, texte]) => (
            <Link key={href} href={href}>
              {texte}
            </Link>
          ))}
          <Link href={`/${lang}/don`}>{dict.nav.don}</Link>
        </nav>
      </details>
    </header>
  );
}
