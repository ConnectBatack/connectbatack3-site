import { chargerDictionnaire, chargerTextesChangementLangue } from "@/i18n/dictionnaires";
import { chargerInfosCovideba } from "@/lib2/serveur";
import EnTete from "@/components/EnTete";
import PiedDePage from "@/components/PiedDePage";
import BoutonLangue from "@/components/BoutonLangue";

// Habillage de la vitrine publique : en-tête, pied de page et sélecteur de langue.
export default async function MiseEnPageSite({ children, params }) {
  const { lang } = await params;
  const [dict, textesLangue, { contact }] = await Promise.all([
    chargerDictionnaire(lang),
    chargerTextesChangementLangue(),
    chargerInfosCovideba(),
  ]);
  return (
    <>
      <a className="lien-evitement" href="#contenu">{dict.nav.allerContenu}</a>
      <EnTete dict={dict} lang={lang} contact={contact} />
      <main id="contenu">{children}</main>
      <PiedDePage dict={dict} lang={lang} contact={contact} />
      <BoutonLangue langue={lang} textes={textesLangue} />
    </>
  );
}
