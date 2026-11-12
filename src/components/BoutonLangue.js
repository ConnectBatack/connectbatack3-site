"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { langues, nomsLangues } from "@/i18n/config";

// Sélecteur de langue fixé en bas de l'écran : il reste visible pendant le défilement.
// Avant de changer de langue, une fenêtre explique dans la langue choisie d'où vient la traduction.
export default function BoutonLangue({ langue, textes }) {
  const [ouvert, setOuvert] = useState(false);
  const [cible, setCible] = useState(null);
  const boutonContinuer = useRef(null);
  const chemin = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!cible) return;
    boutonContinuer.current?.focus();
    const fermer = (e) => e.key === "Escape" && setCible(null);
    window.addEventListener("keydown", fermer);
    return () => window.removeEventListener("keydown", fermer);
  }, [cible]);

  function choisir(l) {
    setOuvert(false);
    if (l !== langue) setCible(l);
  }

  function confirmer() {
    document.cookie = `langue=${cible}; path=/; max-age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    const reste = chemin.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    router.push(`/${cible}${reste}`);
    setCible(null);
  }

  const t = cible ? textes[cible] : null;

  return (
    <>
      <div className="langue-flottante">
        {ouvert && (
          <ul className="langue-menu" role="listbox" aria-label={textes[langue].bouton}>
            {langues.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l === langue}
                  lang={l}
                  onClick={() => choisir(l)}
                >
                  {nomsLangues[l]}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="langue-bouton"
          aria-expanded={ouvert}
          aria-label={`${textes[langue].bouton} : ${nomsLangues[langue]}`}
          onClick={() => setOuvert(!ouvert)}
        >
          {langue.toUpperCase()}
        </button>
      </div>

      {t && (
        <div className="fenetre-fond" onClick={() => setCible(null)}>
          <div
            className="fenetre"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-langue"
            lang={cible}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="titre-langue">{t.titre}</h2>
            <p>{t.texte}</p>
            <div className="fenetre-actions">
              <button type="button" className="bouton bouton-contour" onClick={() => setCible(null)}>
                {t.annuler}
              </button>
              <button
                type="button"
                className="bouton bouton-principal"
                ref={boutonContinuer}
                onClick={confirmer}
              >
                {t.continuer}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
