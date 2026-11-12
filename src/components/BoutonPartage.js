"use client";

import { useState } from "react";

// Partage d'un projet : ouvre le partage du téléphone (WhatsApp, e-mail…) quand il existe,
// sinon copie le lien. Aucune donnée n'est collectée.
export default function BoutonPartage({ t, titre }) {
  const [copie, setCopie] = useState(false);

  async function partager() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, text: `${t.texte} ${titre}`, url });
        return;
      } catch (e) {
        if (e?.name === "AbortError") return; // partage annulé par la personne
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
    } catch {
      window.prompt(t.bouton, url);
    }
  }

  return (
    <>
      <button type="button" className="bouton bouton-contour bouton-sombre" onClick={partager}>
        {t.bouton}
      </button>
      {copie && <p className="aide" role="status">{t.copie}</p>}
    </>
  );
}
