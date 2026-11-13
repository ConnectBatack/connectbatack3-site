"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { langues, nomsLangues } from "@/i18n/config";
import Drapeau from "@/components/Drapeau";

// Sélecteur de langue fixé en bas de l'écran : il reste visible pendant le défilement.
// Chaque langue est un vrai lien (il fonctionne sans JavaScript). Avec JavaScript, une fenêtre
// explique d'abord, dans la langue choisie, d'où vient la traduction.
// La fenêtre est un <dialog> natif : focus gardé dans la fenêtre, Échap, page bloquée derrière,
// focus rendu au bouton à la fermeture.
export default function BoutonLangue({ langue, textes }) {
  const [ouvert, setOuvert] = useState(false);
  const [cible, setCible] = useState(null);
  const conteneur = useRef(null);
  const bouton = useRef(null);
  const fenetre = useRef(null);
  const chemin = usePathname();
  const router = useRouter();
  const reste = chemin.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  // Menu : fermeture avec Échap et au clic à l'extérieur.
  useEffect(() => {
    if (!ouvert) return;
    const clavier = (e) => {
      if (e.key === "Escape") {
        setOuvert(false);
        bouton.current?.focus();
      }
    };
    const clic = (e) => {
      if (!conteneur.current?.contains(e.target)) setOuvert(false);
    };
    document.addEventListener("keydown", clavier);
    document.addEventListener("mousedown", clic);
    return () => {
      document.removeEventListener("keydown", clavier);
      document.removeEventListener("mousedown", clic);
    };
  }, [ouvert]);

  // Ouverture de la fenêtre quand une autre langue est choisie.
  useEffect(() => {
    if (cible && fenetre.current && !fenetre.current.open) fenetre.current.showModal();
  }, [cible]);

  function choisir(e, l) {
    setOuvert(false);
    if (l === langue) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setCible(l);
  }

  function confirmer() {
    const securise = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `langue=${cible}; path=/; max-age=31536000; SameSite=Lax${securise}`;
    fenetre.current?.close();
    router.push(`/${cible}${reste}`);
  }

  const t = cible ? textes[cible] : null;

  return (
    <>
      <div className="langue-flottante" ref={conteneur}>
        {ouvert && (
          <ul className="langue-menu">
            {langues.map((l) => (
              <li key={l}>
                <a href={`/${l}${reste}`} hrefLang={l} lang={l} aria-current={l === langue ? "true" : undefined} onClick={(e) => choisir(e, l)}>
                  <Drapeau langue={l} />
                  {nomsLangues[l]}
                </a>
              </li>
            ))}
          </ul>
        )}
        <button type="button" ref={bouton} className="langue-bouton" aria-expanded={ouvert} onClick={() => setOuvert(!ouvert)}>
          <Drapeau langue={langue} />
          {langue.toUpperCase()}
          <span className="visuellement-cache">, {textes[langue].bouton} : {nomsLangues[langue]}</span>
        </button>
      </div>

      <dialog
        ref={fenetre}
        className="fenetre"
        aria-labelledby="titre-langue"
        lang={cible ?? undefined}
        onClose={() => {
          setCible(null);
          bouton.current?.focus();
        }}
      >
        {t && (
          <>
            <h2 id="titre-langue">{t.titre}</h2>
            <p>{t.texte}</p>
            <div className="fenetre-actions">
              <button type="button" className="bouton bouton-contour" onClick={() => fenetre.current?.close()}>
                {t.annuler}
              </button>
              <button type="button" className="bouton bouton-principal" autoFocus onClick={confirmer}>
                {t.continuer}
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
