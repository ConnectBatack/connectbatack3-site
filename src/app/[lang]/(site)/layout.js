import { chargerDictionnaire, chargerTextesChangementLangue } from "@/i18n/dictionnaires";
import EnTete from "@/components/EnTete";
import PiedDePage from "@/components/PiedDePage";
import BoutonLangue from "@/components/BoutonLangue";

// Habillage de la vitrine publique : en-tête, pied de page et sélecteur de langue.
export default async function MiseEnPageSite({ children, params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const textesLangue = await chargerTextesChangementLangue();
  return (
    <>
      <a className="lien-evitement" href="#contenu">{dict.nav.allerContenu}</a>
      <p className="bandeau-preversion">{dict.preversion}</p>
      <EnTete dict={dict} lang={lang} />
      <main id="contenu">{children}</main>
      <PiedDePage dict={dict} lang={lang} />
      <BoutonLangue langue={lang} textes={textesLangue} />
    </>
  );
}
