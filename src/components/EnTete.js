import Link from "next/link";
import Image from "next/image";
import MenuMobile from "@/components/MenuMobile";
import { covidebaContact } from "@/donnees/covideba";
import logoBatack from "../../public/images/logos/logo-batack.png";
import logoCovideba from "../../public/images/logos/logo-covideba.png";

export default function EnTete({ dict, lang, contact = covidebaContact }) {
  const liens = [
    [`/${lang}#projets`, dict.nav.projets],
    [`/${lang}/notre-histoire`, dict.nav.histoire],
    [`/${lang}/transparence`, dict.nav.transparence],
    [`/${lang}/qui-sommes-nous`, dict.nav.apropos],
  ];
  const telHref = contact.telephone ? `tel:${contact.telephone.replace(/\s+/g, "")}` : "";
  const mailHref = contact.email ? `mailto:${contact.email}` : "";
  const aContact = Boolean(contact.telephone || contact.email);

  return (
    <header className="entete">
      {aContact && (
        <div className="barre-contact">
          {contact.telephone && <a href={telHref}>{contact.telephone}</a>}
          {contact.email && <a href={mailHref}>{contact.email}</a>}
        </div>
      )}
      <div className="entete-barre">
        <Link className="logo logo-image" href={`/${lang}`}>
          <Image src={logoBatack} alt="Batack" height={46} preload />
          {/* Logo du COVIDEBA à côté de celui de Batack, comme dans le pied de page (demande de Roy, 19/11/2026). */}
          <Image src={logoCovideba} alt="COVIDEBA" height={46} preload />
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
        <MenuMobile libelle={dict.nav.menu}>
          <nav aria-label={dict.nav.menu}>
            {liens.map(([href, texte]) => (
              <Link key={href} href={href}>
                {texte}
              </Link>
            ))}
            <Link href={`/${lang}/don`}>{dict.nav.don}</Link>
            {aContact && <hr className="menu-separateur" />}
            {contact.telephone && <a href={telHref}>{contact.telephone}</a>}
            {contact.email && <a href={mailHref}>{contact.email}</a>}
          </nav>
        </MenuMobile>
      </div>
    </header>
  );
}
