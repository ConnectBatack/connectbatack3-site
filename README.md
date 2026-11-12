# Plateforme ConnectBatack 3 (branche `refonte-nextjs`)

Site de dons et de gestion pour le village de Batack (Cameroun), porté par le COVIDEBA,
des étudiants de la Faculté polytechnique de Mons (UMONS) et l'ENSPY.

Cette branche reprend le travail de Dolly (React + Vite, branche `main`) et le passe en **Next.js 16**.
Next.js permet :

- le référencement : les pages sont générées côté serveur ;
- les adresses par langue ;
- des routes serveur pour Stripe ;
- un déploiement direct sur Vercel.

La branche `main` n'a pas été modifiée.

## Lancer le site en local

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev          # http://localhost:3000
```

Autres commandes :

- `npm run build` : compile le site ;
- `npm run lint` : vérifie le code.

Pour tester le paiement en local :

1. copier `.env.example` en `.env.local` ;
2. y mettre des clés Stripe **de test** (`sk_test_...`).

Sans clé, le site fonctionne, et le formulaire de don affiche « paiement pas encore activé ».

## Déployer sur Vercel

1. Créer le compte Vercel avec l'adresse e-mail du projet.
2. Importer le dépôt GitHub, puis choisir la branche `refonte-nextjs` pour les préversions.
3. Dans *Settings > Environment Variables*, ajouter les variables de `.env.example`.
4. Chaque `git push` crée une préversion avec sa propre adresse, à partager avec l'équipe.

**Point à vérifier :** d'après ses conditions, le plan gratuit Hobby de Vercel est réservé à un usage
personnel et non commercial. C'est suffisant pour les préversions de l'équipe, mais il faut le vérifier
avant d'ouvrir publiquement un site qui collecte des dons.

## Organisation du code

```text
src/
  proxy.js                 ajoute la langue à l'adresse (/don devient /fr/don)
  i18n/                    langues (fr, en, es, nl) et textes ; fr.json est la référence
  donnees/projets.js       projets affichés (DONNÉES D'EXEMPLE)
  lib/regles-don.js        règles du don, vérifiées côté navigateur ET côté serveur
  lib/stripe.js            client Stripe (refuse les clés de production pour l'instant)
  components/              en-tête, pied de page, sélecteur de langue, formulaire de don
  app/[lang]/              pages : accueil, don, don/merci, connexion
  app/api/paiement/        crée la session Stripe Checkout
  app/api/stripe-webhook/  reçoit les notifications signées de Stripe
```

**Textes :** tout texte affiché passe par les fichiers `src/i18n/*.json`. Pour modifier une phrase,
on la change dans les quatre fichiers. Les traductions anglaise, espagnole et néerlandaise doivent
être relues par des personnes qui parlent ces langues.

**Règles d'écriture :**

- pas de tiret cadratin (« — ») ;
- pas de slogans vides ;
- des phrases concrètes : un montant, une utilisation.

## État d'avancement

| Fait | Pas encore fait |
|---|---|
| Accueil : prochain besoin, projets avec barre de progression, montants mis en contexte, étapes, présentation | Vrais contenus et montants (à fournir par le COVIDEBA) |
| Don sans compte, en 3 étapes, ponctuel ou mensuel, Bancontact ou carte | Activation de Stripe avec le compte de l'institution agréée |
| Attestation fiscale demandée dans le formulaire ; adresse collectée par Stripe | Transmission des données à l'institution, numéro national |
| 4 langues, sélecteur qui suit le défilement, fenêtre de confirmation | Relecture des traductions |
| Route de paiement validée côté serveur, notifications Stripe signées | Base de données : enregistrer les dons et les écritures |
| En-têtes de sécurité (CSP, HSTS, anti-iframe) | Connexion, rôles, espace de gestion, registre, solveur |
| Page « Espace COVIDEBA » d'attente | Pages légales : conditions, confidentialité (RGPD) |

## Sécurité : ce qui est déjà en place

- **Validation côté serveur :** la route de paiement revérifie tout. Montant entier entre 5 € et 5 000 €, projet connu, langue connue, e-mail valide, conditions acceptées.
- **Aucune donnée de carte sur le site :** le paiement se fait sur la page Stripe.
- **Redirection limitée :** le navigateur ne suit que des adresses `https://checkout.stripe.com/`.
- **Notifications Stripe vérifiées :** chacune est vérifiée par signature, sinon elle est refusée.
- **Mode test obligatoire :** une clé Stripe de production est refusée tant que la variable `PAIEMENT_REEL_AUTORISE=oui` n'est pas posée. Cette variable ne doit être posée qu'après validation du compte de l'institution agréée.
- **Pas de donnée personnelle dans les métadonnées Stripe ni dans les journaux.**
- **En-têtes de sécurité :** CSP, `X-Frame-Options: DENY`, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.

À faire lors de l'analyse de sécurité complète :

- une CSP avec nonce, à la place de `'unsafe-inline'` ;
- une limite de requêtes sur `/api/paiement` ;
- l'authentification et les rôles ;
- la base de données ;
- le RGPD.
