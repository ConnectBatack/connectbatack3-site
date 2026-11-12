import "server-only";
import { redirect } from "next/navigation";

// POINT D'ACCROCHE POUR L'AUTHENTIFICATION (à remplacer par Pio).
// Aujourd'hui, l'espace de gestion est une maquette ouverte : lireSession() renvoie toujours
// un utilisateur fictif. Quand la vraie connexion existera, elle devra :
//   1. lire le cookie de session (httpOnly, Secure, SameSite=Lax) ;
//   2. vérifier la session côté serveur (base de données ou jeton signé) ;
//   3. renvoyer null si la session est absente ou expirée.
// Voir docs/SUGGESTIONS_CONNEXION.md.
export async function lireSession() {
  return { maquette: true, nom: "Membre du COVIDEBA", role: "membre" };
}

// Rôles de l'espace de gestion (diagrammes UML v2).
export const ROLES = { membre: "membre", tresorier: "tresorier", encadrant: "encadrant" };

// À appeler EN PREMIÈRE LIGNE de chaque page, route d'API et Server Action de gestion.
// La mise en page (layout) n'est pas rendue à nouveau à chaque navigation : elle ne suffit pas
// à protéger les pages (documentation Next.js 16, guide « authentication »).
// Sans session, ou rôle non autorisé : redirection vers la connexion.
// (forbidden() de Next.js 16 demande une option expérimentale : à voir avec Pio.)
export async function exigerSession(lang, rolesAutorises = Object.values(ROLES)) {
  const session = await lireSession();
  if (!session) redirect(`/${lang}/connexion`);
  if (!rolesAutorises.includes(session.role)) redirect(`/${lang}/connexion`);
  return session;
}
