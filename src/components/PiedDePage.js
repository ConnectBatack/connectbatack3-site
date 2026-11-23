import Link from "next/link";
import Image from "next/image";
import { covidebaContact } from "@/donnees/covideba";
import logoBatack from "../../public/images/logos/logo-batack.png";
import logoCovideba from "../../public/images/logos/logo-covideba.png";

export default function PiedDePage({ dict, lang, contact = covidebaContact }) {
  const legal = dict.legal.pages;
  const telHref = contact.telephone ? `tel:${contact.telephone.replace(/\s+/g, "")}` : "";
  const mailHref = contact.email ? `mailto:${contact.email}` : "";

  return (
    <footer className="pied">
      <div>
        <div className="pied-logos">
          <Image src={logoBatack} alt="Batack" height={56} />
          <Image src={logoCovideba} alt="COVIDEBA" height={64} />
        </div>
        <p>{dict.pied.texte}</p>
        {(contact.telephone || contact.email) && (
          <p className="pied-contact">
            {contact.telephone && <a href={telHref}>{contact.telephone}</a>}
            {contact.telephone && contact.email && " · "}
            {contact.email && <a href={mailHref}>{contact.email}</a>}
          </p>
        )}
        {contact.adressePostale && <p className="pied-adresse">{contact.adressePostale}</p>}
        <div className="pied-espace">
          <Link className="bouton bouton-contour bouton-espace" href={`/${lang}/connexion`}>
            {dict.nav.connexion}
          </Link>
        </div>
        <small>{dict.pied.droits}</small>
      </div>
      <div>
        <strong>{dict.pied.projet}</strong>
        <ul>
          <li><Link href={`/${lang}/notre-histoire`}>{dict.nav.histoire}</Link></li>
          <li><Link href={`/${lang}/transparence`}>{dict.nav.transparence}</Link></li>
          <li><Link href={`/${lang}/qui-sommes-nous`}>{dict.nav.apropos}</Link></li>
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
