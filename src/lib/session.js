import "server-only";

// POINT D'ACCROCHE POUR L'AUTHENTIFICATION (à remplacer par Pio).
// Aujourd'hui, l'espace de gestion est une maquette ouverte : cette fonction renvoie toujours
// un utilisateur fictif. Quand la vraie connexion existera, elle devra :
//   1. lire le cookie de session (httpOnly, Secure, SameSite=Lax) ;
//   2. vérifier la session côté serveur (base de données ou jeton signé) ;
//   3. renvoyer null si la session est absente ou expirée.
// Les pages de gestion redirigeront alors vers la connexion quand elle renvoie null.
// Voir docs/SUGGESTIONS_CONNEXION.md.
export async function lireSession() {
  return { maquette: true, nom: "Membre du COVIDEBA", role: "membre" };
}
