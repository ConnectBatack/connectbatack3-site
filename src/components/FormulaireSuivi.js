"use client";

import { useState } from "react";

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Inscription aux nouvelles d'un projet. L'adresse n'est envoyée qu'avec un consentement explicite.
export default function FormulaireSuivi({ t, projet, langue, lienConfidentialite }) {
  const [email, setEmail] = useState("");
  const [accord, setAccord] = useState(false);
  const [message, setMessage] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  async function inscrire(e) {
    e.preventDefault();
    if (!reEmail.test(email)) return setMessage({ erreur: true, texte: t.erreurEmail });
    if (!accord) return setMessage({ erreur: true, texte: t.erreurConsentement });
    setEnvoi(true);
    try {
      const reponse = await fetch("/api/suivi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, projet, langue, consentement: true }),
      });
      setMessage(reponse.ok ? { erreur: false, texte: t.merci } : { erreur: true, texte: t.nonActive });
    } catch {
      setMessage({ erreur: true, texte: t.nonActive });
    }
    setEnvoi(false);
  }

  return (
    <form className="formulaire-suivi" onSubmit={inscrire} noValidate>
      <h3>{t.titre}</h3>
      <p className="aide">{t.texte}</p>
      <div className="suivi-ligne">
        <label className="champ">
          <span className="visuellement-cache">{t.email}</span>
          <input type="email" autoComplete="email" maxLength={254} placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button type="submit" className="bouton bouton-principal" disabled={envoi}>{t.bouton}</button>
      </div>
      <label className="case">
        <input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} />
        {t.consentement}
      </label>
      <p className="aide">
        <a href={lienConfidentialite} target="_blank" rel="noopener">{t.lienConfidentialite}</a>
      </p>
      {message && (
        <p className={message.erreur ? "message message-erreur" : "message message-info"} role="status">{message.texte}</p>
      )}
    </form>
  );
}
