"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// MAQUETTE : le formulaire n'envoie rien. Il mène directement à l'espace de gestion.
// Pio remplacera `seConnecter` par l'appel à la vraie route d'authentification
// (voir docs/SUGGESTIONS_CONNEXION.md). Le mot de passe ne doit jamais être stocké côté navigateur.
export default function FormulaireConnexion({ t, lang }) {
  const router = useRouter();
  const [oubli, setOubli] = useState(false);

  function seConnecter(e) {
    e.preventDefault();
    router.push(`/${lang}/gestion`);
  }

  return (
    <form className="formulaire-connexion" onSubmit={seConnecter}>
      <label className="champ">
        {t.email}
        <input type="email" name="email" autoComplete="username" required maxLength={254} />
      </label>
      <label className="champ">
        {t.motDePasse}
        <input type="password" name="motDePasse" autoComplete="current-password" required maxLength={200} />
      </label>
      <button type="submit" className="bouton bouton-principal bouton-grand">{t.bouton}</button>
      <button type="button" className="bouton-texte" onClick={() => setOubli(true)}>{t.oubli}</button>
      {oubli && <p className="aide" role="status">{t.oubliTexte}</p>}
    </form>
  );
}
