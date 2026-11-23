"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormulaireConnexion({ t, lang }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [besoinTotp, setBesoinTotp] = useState(false);
  const [oubli, setOubli] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  async function seConnecter(e) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          ...(totpCode.trim() ? { totp_code: totpCode.trim() } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.detail || "Connexion refusée.";
        if (msg.toLowerCase().includes("totp")) setBesoinTotp(true);
        setErreur(msg);
        return;
      }
      const cible = data.user?.must_change_password ? `/${lang}/gestion/parametres` : `/${lang}/gestion`;
      router.push(cible);
      router.refresh();
    } catch {
      setErreur("Impossible de contacter le serveur de connexion.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form className="formulaire-connexion" onSubmit={seConnecter}>
      <label className="champ">
        {t.email}
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="champ">
        {t.motDePasse}
        <input
          type="password"
          name="motDePasse"
          autoComplete="current-password"
          required
          maxLength={200}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {besoinTotp && (
        <label className="champ">
          Code TOTP (2FA)
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={12}
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
          />
        </label>
      )}
      {!besoinTotp && (
        <button type="button" className="bouton-texte" onClick={() => setBesoinTotp(true)}>
          Code TOTP (si 2FA active)
        </button>
      )}
      {erreur && (
        <p className="message message-erreur" role="alert">
          {erreur}
        </p>
      )}
      <button type="submit" className="bouton bouton-principal bouton-grand" disabled={envoi}>
        {envoi ? "..." : t.bouton}
      </button>
      <button type="button" className="bouton-texte" onClick={() => setOubli(true)}>
        {t.oubli}
      </button>
      {oubli && (
        <p className="aide" role="status">
          {t.oubliTexte}
        </p>
      )}
    </form>
  );
}
