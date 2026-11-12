# Connexion à l'espace COVIDEBA : suggestions pour Pio

Pio prend en charge la connexion et le backend. Ce document propose une base pour gagner du temps. **Ce sont des suggestions** : les choix finaux reviennent à Pio, en accord avec l'équipe.

## Où se brancher dans le code

| Fichier | Rôle aujourd'hui (maquette) | À faire |
|---|---|---|
| `src/lib/session.js` | `lireSession()` renvoie toujours un utilisateur fictif | lire et vérifier la vraie session ; renvoyer `null` si elle est absente ou expirée |
| `src/app/[lang]/gestion/layout.js` | redirige déjà vers `/connexion` si `lireSession()` renvoie `null` | rien de plus pour la redirection ; vérifier aussi le **rôle** page par page |
| `src/components/FormulaireConnexion.js` | n'envoie rien, mène directement à la gestion | appeler la vraie route de connexion |
| `src/proxy.js` | ajoute la langue à l'adresse | facultatif : redirection rapide si aucun cookie de session (la documentation de Next.js 16 réserve le proxy à ce genre de vérification « optimiste ») |

**Important :** la vérification de la session doit se faire **côté serveur**, dans chaque page et chaque route de gestion. Une vérification dans le navigateur, ou dans `proxy.js` seulement, ne protège rien.

## Rôles (diagrammes UML v2)

- **Membre du COVIDEBA** : il gère les tâches, saisit les comparaisons AHP, calcule et valide le plan, contresigne le Mobile Money.
- **Trésorier** : il a tous les droits du membre, et en plus il saisit les recettes et les dépenses.
- **Encadrant** : il consulte, vérifie l'intégrité du registre et exporte. Il ne peut rien modifier.
- **Point ouvert** : faut-il un rôle d'administrateur technique (pour l'équipe de l'ENSPY), qui crée les comptes ?

Les comptes sont **créés par un responsable**, sans inscription libre. Les donateurs n'ont pas besoin de compte.

## Mots de passe

- **Ne jamais écrire son propre hachage.** Utiliser une bibliothèque reconnue.
- **Argon2id**, avec les paramètres recommandés par l'OWASP (par exemple m = 19 Mio, t = 2, p = 1). À défaut, **bcrypt** avec un coût d'au moins 12. Le sel est géré par la bibliothèque.
- Au moins 12 caractères. On peut refuser les mots de passe connus pour avoir fuité, par exemple avec l'API Have I Been Pwned et sa vérification anonyme.
- Les messages d'erreur sont **identiques**, que l'e-mail existe ou non.

## Sessions

- Cookie `httpOnly`, `Secure`, `SameSite=Lax`, avec un identifiant aléatoire d'au moins 128 bits. En base, on stocke l'**empreinte** de cet identifiant, pas l'identifiant lui-même.
- Durée limitée (par exemple 8 heures d'inactivité), renouvelée à l'usage, effacée à la déconnexion.
- **Pour le trésorier hors ligne** (cahier des charges, §5.2), une session plus longue sur son téléphone sera peut-être nécessaire. C'est à discuter, car c'est un compromis de sécurité.

## Protection contre les attaques

- **Limiter les tentatives**, par exemple 5 essais par quart d'heure, par compte et par adresse IP.
- **Double authentification** (application TOTP) au moins pour le trésorier et les encadrants.
- **CSRF** : les *Server Actions* de Next.js comparent déjà l'origine de la requête. Pour d'éventuelles routes d'API, vérifier l'en-tête `Origin`.
- **Mot de passe oublié** : un lien à usage unique, qui expire après 30 minutes. L'autre option est une réinitialisation par un responsable, plus simple au début.
- **Journal** des connexions et des actions sensibles (validation du plan, écritures, contresignatures).

## Bibliothèques possibles (à vérifier au moment du choix)

- **Auth.js** (anciennement NextAuth), intégré à Next.js.
- **Better Auth**, une bibliothèque TypeScript récente, avec gestion des rôles et de la double authentification.
- **Supabase Auth**, si la base de données est sur Supabase.

Il faut vérifier que la bibliothèque choisie est **toujours maintenue**, et qu'elle est compatible avec Next.js 16 : `proxy.js` remplace `middleware.js`, et `params` est asynchrone.

## Données personnelles (RGPD)

On ne stocke que le minimum : nom, e-mail, rôle et empreinte du mot de passe. La durée de conservation est encore à fixer (voir la politique de confidentialité provisoire, `/fr/informations/confidentialite`).
