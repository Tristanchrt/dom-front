## Cahier des charges — DÖM (Application mobile de social e-commerce)

### Contexte et objectifs

DÖM est une application mobile de social e-commerce bâtie avec React Native et Expo. L’objectif est de combiner des fonctionnalités sociales (fil, profils, messagerie) avec des capacités e‑commerce (produits, commandes), dans une expérience fluide sur iOS, Android et Web.

### Portée fonctionnelle actuelle (état du code)

- **Fonctionnel**
  - **Feeds**: deux flux (Abonnements, Explorer) pour découvrir et suivre le contenu.
  - **Interactions**: like, commentaire, partage, navigation vers profils et posts.
  - **Recherche**: page de recherche (utilisateurs, posts, produits) avec barre de recherche et navigation vers les fiches résultats.
  - **Messagerie**: conversations 1:1 (UI et données locales prêtes); envoi d’images depuis caméra/galerie. Notifications push (OneSignal) à intégrer.
  - **Produits**: fiche produit dédiée `product/[id].tsx` (détails, images, prix, vendeur).
  - **Panier / Paiement**: ajout au panier et flux de checkout (à câbler avec le backend/paiement).
  - **Onboarding**: écrans d’amorçage en `src/app/onboarding/*`.
  - **Authentification**: écrans présents (`login.tsx`) pour e‑mail et social; intégration prévue avec Clerk (à faire).

- **Technique**
  - **Navigation**: Expo Router (routage par fichiers) en `src/app`, `initialRouteName: 'login'`.
  - **État**: `zustand` (`src/store/auth.store.ts`) pour l’utilisateur/erreurs/chargement.
  - **Données**: repositories locaux `Local*Repository.impl.ts` + cas d’usage (`src/domain/usecases`). `AuthApi` placeholder à remplacer/adapter (Clerk fournit l’identité, API distante pour données).
  - **Hooks**: `useAuth` cable `AuthUseCases`/`AuthRepositoryImpl` (évolution prévue vers Clerk).
  - **Internationalisation**: `src/i18n` (en, fr) avec utilitaire `t()`.
  - **Caméra & média**: `expo-camera`, `expo-image-picker` (TODO: renvoi de résultat aux écrans appelants et upload serveur).
  - **Notifications push**: OneSignal à intégrer (SDK, permissions, réception et handlers).
  - **Design/Thème**: composants communs (`src/components/common`), couleurs dans `src/constants/Colors.ts`.

### Architecture logicielle

- **App (UI & Navigation)**
  - Expo Router. Point d’entrée `src/app/_layout.tsx` avec `initialRouteName: 'login'` et stack d’écrans.
- **Domaine (`src/domain`)**
  - **Modèles**: `User`, `Profile`, `Product`, `Post`, `Order`, etc.
  - **Cas d’usage**: orchestrent la logique (ex. `AuthUseCases`, `PostsUseCases`, `ProductsUseCases`, ...).
- **Données (`src/data`)**
  - **Repositories locaux**: `Local*Repository.impl.ts` fournissent des données de démonstration (fixtures) côté client.
  - **API**: `src/data/api/auth.api.ts` expose des appels d’exemple (baseUrl placeholder) pour l’auth.
  - **Composition**: `src/data/container/index.ts` instancie les cas d’usage avec des dépôts locaux par défaut.
- **État & Hooks**
  - **Store**: `zustand` dans `src/store/auth.store.ts` (utilisateur, état de chargement, erreur, isAuthenticated).
  - **Hook Auth**: `src/hooks/useAuth.ts` qui câble `AuthUseCases` (via `AuthRepositoryImpl` et `AuthApi`).
- **Tests**
  - Tests unitaires présents (Jest) pour usecases et repositories locaux (`src/__tests__`, `src/store/*.test.ts`).

### Pile technologique

- **Framework**: Expo `~54.0.7`, React `19.1.0`, React Native `0.81.4`.
- **Langage**: TypeScript `~5.9.x`.
- **Navigation**: `expo-router ~6.0.4`.
- **État**: `zustand ^5.0.2`.
- **Caméra / Média**: `expo-camera`, `expo-image-picker`, `expo-media-library`.
- **UI**: `@expo/vector-icons`, `react-native-safe-area-context`, `react-native-screens`.
- **Outils**: Jest + Testing Library, Prettier, PNPM.
- **Authentification**: Clerk (Expo/React Native SDK).
- **Push Notifications**: OneSignal (SDK Expo compatible).

### Structure des dossiers (extrait utile)

```
src/
  app/                 # Écrans (Expo Router)
    (tabs)/            # Onglets principaux
    login.tsx          # Écran d’authentification (TODO login réel)
    camera.tsx         # Caméra (prise photo / galerie)
  components/
    common/            # Boutons, Inputs, Themed, etc.
  constants/           # Couleurs, Layout
  data/
    api/               # Clients API (ex: auth.api.ts)
    repositories/      # Implémentations Local* et AuthRepository.impl.ts
    container/         # Assemblage des cas d’usage
  domain/
    models/            # Entités du domaine
    usecases/          # Cas d’usage (Auth/Posts/Products/...)
  hooks/               # useAuth, useProfile, etc.
  i18n/                # en.ts, fr.ts, index.ts (t())
  store/               # Zustand (auth.store.ts)
```

### Configuration & environnements

- **app.json**: nom, icônes, `scheme`, `newArchEnabled`, plugins (camera, image-picker, media-library). EAS projectId présent.
- **Variables d’environnement**: prévoir une `EXPO_PUBLIC_API_URL` pour l’API backend. Le fichier `expo-env.d.ts` est présent; ajouter un `.env` et/ou `eas.json` avec secrets.
- **Permissions**: gérées par les plugins Expo. Vérifier les messages d’usage iOS/Android selon les stores.
- **Clerk**: variables d’env (`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, clés secrètes côté backend/EAS), config du SDK et redirections OAuth.
- **OneSignal**: `EXPO_PUBLIC_ONESIGNAL_APP_ID`, configuration des capacités de notifications iOS/Android et gestion des permissions runtime.

### Flux principaux (haut niveau)

- **Authentification (Clerk)**: `login.tsx` -> Clerk SDK (OAuth e‑mail/social) -> gestion de session par Clerk -> exposition d’un jeton/verif côté backend si nécessaire. Les `AuthUseCases`/`AuthApi` actuels seront adaptés/simplifiés pour déléguer l’identité à Clerk.
- **Session**: `auth.store.ts` conserve l’utilisateur en mémoire; persistance sécurisée (token) non encore branchée.
- **Navigation conditionnelle**: `initialRouteName: 'login'`; une garde basée sur l’état auth est à implémenter pour basculer automatiquement vers `/(tabs)`.
- **Messagerie**: aujourd’hui pilotée par des dépôts locaux; pas de temps réel configuré.
- **Caméra/Médias**: capture et sélection fonctionnelles côté UI; pas d’upload serveur implémenté.

### API & données

- **Actuel**: Les repositories locaux (`Local*Repository.impl.ts`) simulent les données. `AuthApi` utilise une `baseUrl` placeholder (`https://api.example.com`) et ne stocke pas de jeton.
- **Cible**: Créer des repositories distants (ex: `RemotePostsRepository`, `RemoteProductsRepository`, etc.) consommant un backend (`EXPO_PUBLIC_API_URL`), avec gestion d’auth, erreurs, pagination et sérialisation.
  - Pour l’auth côté API, utiliser le jeton/claims fournis par Clerk (en-tête `Authorization: Bearer <token>` ou middleware dédié côté backend).
 - **Statut backend**: le backend est en cours de développement. Une base Swagger/OpenAPI sera fournie pour référencer les endpoints et faciliter l’intégration, mais l’instance ne sera pas encore accessible publiquement au début. En attendant, s’appuyer sur les repositories locaux/mocks.

### Sécurité & conformité

- Stockage de session gérée par Clerk (SDK) et/ou jeton applicatif en SecureStore si nécessaire pour des appels API propriétaires.
- Communication HTTPS, gestion d’expiration/refresh token, verrouillage des écrans sensibles.
- Respect RGPD: consentements analytics/notifications, gestion des données utilisateur et suppression de compte.

### À faire pour que l’application fonctionne correctement (Backlog de mise en production)

- **Authentification (Clerk)**
  - [ ] Intégrer le SDK Clerk pour Expo/React Native (provider, hooks).
  - [ ] Brancher l’écran `login.tsx` sur les méthodes Clerk (e‑mail + sociaux).
  - [ ] Gérer logout via Clerk, et redirections post‑auth (guards de navigation).
  - [ ] Mot de passe oublié / magic link (flows proposés par Clerk) et écrans associés.
  - [ ] Exposer le jeton Clerk aux repositories distants si le backend a besoin d’autorisation applicative.

- **Configuration & Environnements**
  - [ ] Créer `.env` avec `EXPO_PUBLIC_API_URL` et secrets requis (EAS pour builds).
  - [ ] Ajouter `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` et configurer EAS pour les clés secrètes Clerk.
  - [ ] Ajouter `EXPO_PUBLIC_ONESIGNAL_APP_ID` pour les notifications push.
  - [ ] Lire `EXPO_PUBLIC_API_URL` dans `AuthApi` (et futurs clients API) au lieu de la `baseUrl` hardcodée.
  - [ ] Ajuster `app.json` (`extra`) pour exposer les valeurs nécessaires côté app si besoin.

- **Navigation & Garde d’auth**
  - [ ] Remplacer `initialRouteName: 'login'` par une garde: si session valide -> `/(tabs)`, sinon `login`.
  - [ ] Protéger les écrans sensibles (tabs, profil, messages) par un check `isAuthenticated`.

- **Données & Repositories**
  - [ ] Créer des repositories « Remote* » pour posts/produits/profils/commandes/messagerie.
  - [ ] Remplacer l’injection des `Local*Repository` par les `Remote*Repository` dans `src/data/container/index.ts` (ou via flags d’environnement).
  - [ ] Implémenter un utilitaire HTTP (wrapper fetch) pour erreurs, timeouts, retry/backoff, parsing JSON typé.

- **Messagerie & Temps réel**
  - [ ] Afficher des notifications push (OneSignal) en cas de nouveau message.

- **Caméra & Upload média**
  - [ ] Uploader les images capturées/sélectionnées vers le backend (endpoint d’upload + gestion du progrès/erreurs).
  - [ ] Traitement d’images (compression/redimensionnement) si nécessaire.
  - [ ] Demander et gérer les permissions push (OneSignal) au premier lancement pertinent.

- **Internationalisation & Accessibilité**
  - [ ] Remplacer les chaînes en dur (ex. dans `login.tsx`, `camera.tsx`) par `t('...')`.
  - [ ] Couvrir l’intégralité de l’UI en FR/EN, vérifier contrastes et tailles.

- **Design & Responsive**
  - [ ] Aligner le design actuel avec la maquette (typographie, couleurs, composants, espacements).
  - [ ] Mobile first: garantir un responsive fonctionnel sur iOS/Android (petits et grands écrans).
  - [ ] Gérer correctement les safe areas, les orientations (portrait/paysage) et les comportements de scroll.
  - [ ] Factoriser le design system (tokens, composants communs) pour assurer la cohérence visuelle.

- **Feed & Interactions**
  - [ ] Implémenter les actions sur les posts: like, commentaire, signaler, bloquer utilisateur.
  - [ ] Mettre à jour l’UI de manière optimiste et gérer les erreurs/rollback.
  - [ ] Brancher les endpoints/repositories distants correspondants et la modération.
  - [ ] Implémenter follow/unfollow (suivre/ne plus suivre), mettre à jour les feeds en conséquence.
  - [ ] Ajouter les états vides/erreurs/chargement pour les flux Abonnements et Explorer.

- **E‑commerce**
  - [ ] Implémenter un panier géré côté front (état local/persisté) avec synchro backend au checkout.
  - [ ] Définir le panier, le checkout et le paiement (ex. Stripe) côté mobile et backend.
  - [ ] Historique des commandes et gestion des statuts.

- **Recherche**
  - [ ] Implémenter la barre de recherche (saisie, debounce, clear, soumission) sur `search`.
  - [ ] Interroger les repositories distants (utilisateurs, posts, produits) et fusionner/segmenter les résultats.
  - [ ] Afficher les listes de résultats, états vides/erreurs, et navigation vers profil/post/produit.
  - [ ] Prévoir la mise en cache rapide et pagination/infinite scroll si nécessaire.

### Critères d’acceptation (MVP)

- Connexion/déconnexion e‑mail opérationnelles avec session persistée et redirection automatique.
- Affichage des listes (posts/produits) depuis l’API distante avec états de chargement/erreur.
- Capture/sélection d’image et upload réussi (retour d’URL) avec feedback utilisateur.
- Messagerie fonctionnelle (au moins en pull/refresh), envoi de texte et d’images.
- Garde d’auth sur les écrans protégés, et i18n appliquée sur toutes les chaînes visibles.

