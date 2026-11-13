import { DM_Sans } from "next/font/google";
import "../globals.css";
import { langues } from "@/i18n/config";
import { chargerDictionnaire } from "@/i18n/dictionnaires";

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://connectbatack3-site.vercel.app"),
  };
}

// Mise en page racine, commune à la vitrine (dossier « (site) ») et à l'espace de gestion (« gestion »).
export default async function MiseEnPageRacine({ children, params }) {
  const { lang } = await params;
  await chargerDictionnaire(lang); // renvoie une page 404 si la langue est inconnue
  return (
    <html lang={lang} className={police.variable}>
      <body>{children}</body>
    </html>
  );
}
