import { notFound } from "next/navigation";
import { chargerDictionnaire } from "@/i18n/dictionnaires";
import { langues, alternatesPage } from "@/i18n/config";

// Pages légales (mentions légales, confidentialité, conditions). Textes PROVISOIRES :
// ils seront relus avant l'ouverture des dons réels (voir le journal des décisions).
const pagesLegales = ["mentions-legales", "confidentialite", "conditions"];

export async function generateStaticParams() {
  return langues.flatMap((lang) => pagesLegales.map((page) => ({ lang, page })));
}

export async function generateMetadata({ params }) {
  const { lang, page } = await params;
  const dict = await chargerDictionnaire(lang);
  const p = dict.legal.pages[page];
  return p ? { title: `${p.titre} | ConnectBatack 3`, alternates: alternatesPage(lang, `/informations/${page}`) } : {};
}

export default async function PageLegale({ params }) {
  const { lang, page } = await params;
  if (!pagesLegales.includes(page)) notFound();
  const dict = await chargerDictionnaire(lang);
  const p = dict.legal.pages[page];

  return (
    <section className="section section-etroite texte-legal">
      <h1>{p.titre}</h1>
      <p className="note-exemple">{dict.legal.miseAJour}</p>
      <p className="avertissement">{dict.legal.avertissement}</p>
      {p.sections.map((s) => (
        <div key={s.titre}>
          <h2>{s.titre}</h2>
          {s.texte.map((t) => (
            <p key={t.slice(0, 24)}>{t}</p>
          ))}
        </div>
      ))}
    </section>
  );
}
