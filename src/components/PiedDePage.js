import Link from "next/link";
import Image from "next/image";
import logoBatack from "../../public/images/logos/logo-batack.png";
import logoCovideba from "../../public/images/logos/logo-covideba.png";

export default function PiedDePage({ dict, lang }) {
  const legal = dict.legal.pages;
  return (
    <footer className="pied">
      <div>
        <div className="pied-logos">
          <Image src={logoBatack} alt="Batack" height={56} />
          <Image src={logoCovideba} alt="COVIDEBA" height={64} />
        </div>
        <p>{dict.pied.texte}</p>
        <small>{dict.pied.droits}</small>
      </div>
      <div>
        <strong>{dict.pied.projet}</strong>
        <ul>
          <li><Link href={`/${lang}/notre-histoire`}>{dict.nav.histoire}</Link></li>
          <li><Link href={`/${lang}/transparence`}>{dict.nav.transparence}</Link></li>
          <li><Link href={`/${lang}/qui-sommes-nous`}>{dict.nav.apropos}</Link></li>
          <li><Link href={`/${lang}/connexion`}>{dict.nav.connexion}</Link></li>
        </ul>
      </div>
      <div>
        <strong>{dict.pied.informations}</strong>
        <ul>
          {Object.entries(legal).map(([id, page]) => (
            <li key={id}><Link href={`/${lang}/informations/${id}`}>{page.titre}</Link></li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
