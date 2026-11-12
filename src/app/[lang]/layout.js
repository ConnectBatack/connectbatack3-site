import { DM_Sans } from "next/font/google";
import "../globals.css";
import { langues } from "@/i18n/config";
import { chargerDictionnaire, chargerTextesChangementLangue } from "@/i18n/dictionnaires";
import EnTete from "@/components/EnTete";
import PiedDePage from "@/components/PiedDePage";
import BoutonLangue from "@/components/BoutonLangue";

const police = DM_Sans({ subsets: ["latin"], variable: "--police" });

export async function generateStaticParams() {
  return langues.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  return {
    title: dict.meta.titre,
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(langues.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function MiseEnPage({ children, params }) {
  const { lang } = await params;
  const dict = await chargerDictionnaire(lang);
  const textesLangue = await chargerTextesChangementLangue();

  return (
    <html lang={lang} className={police.variable}>
      <body>
        <p className="bandeau-preversion">{dict.preversion}</p>
        <EnTete dict={dict} lang={lang} />
        <main id="contenu">{children}</main>
        <PiedDePage dict={dict} />
        <BoutonLangue langue={lang} textes={textesLangue} />
      </body>
    </html>
  );
}
