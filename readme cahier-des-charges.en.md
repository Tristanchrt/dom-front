## Specifications — DÖM (Mobile social e‑commerce application)

### Context and goals

DÖM is a mobile social e‑commerce application built with React Native and Expo. The goal is to combine social features (feed, profiles, messaging) with e‑commerce capabilities (products, orders) in a smooth experience across iOS, Android, and Web.

### Current scope (state of the code)

- **Functional**
  - **Feeds**: two feeds (Following and Explore) to discover and follow content.
  - **Interactions**: like, comment, share, navigate to profiles and posts.
  - **Search**: search page (users, posts, products) with a search bar and navigation to result details.
  - **Messaging**: 1:1 conversations (UI and local data ready); send images from camera/gallery. Push notifications (OneSignal) to be integrated.
  - **Products**: dedicated product page `product/[id].tsx` (details, images, price, seller).
  - **Cart / Payment**: add to cart and checkout flow (to be wired with backend/payment).
  - **Onboarding**: onboarding screens in `src/app/onboarding/*`.
  - **Authentication**: screen present (`login.tsx`) for email and social; integration planned with Clerk (to do).

- **Technical**
  - **Navigation**: Expo Router (file‑based) in `src/app`, `initialRouteName: 'login'`.
  - **State**: `zustand` (`src/store/auth.store.ts`) for user/errors/loading.
  - **Data**: local repositories `Local*Repository.impl.ts` + use cases (`src/domain/usecases`). `AuthApi` is a placeholder to be replaced/adapted (Clerk provides identity, remote API for data).
  - **Hooks**: `useAuth` wires `AuthUseCases`/`AuthRepositoryImpl` (planned evolution towards Clerk).
  - **Internationalization**: `src/i18n` (en, fr) with `t()` utility.
  - **Camera & media**: `expo-camera`, `expo-image-picker` (TODO: return results to caller screens and server upload).
  - **Push notifications**: OneSignal to integrate (SDK, permissions, reception and handlers).
  - **Design/Theme**: common components (`src/components/common`), colors in `src/constants/Colors.ts`.

### Software architecture

- **App (UI & Navigation)**
  - Expo Router. Entry point `src/app/_layout.tsx` with `initialRouteName: 'login'` and stack screens.
- **Domain (`src/domain`)**
  - **Models**: `User`, `Profile`, `Product`, `Post`, `Order`, etc.
  - **Use cases**: orchestrate logic (e.g., `AuthUseCases`, `PostsUseCases`, `ProductsUseCases`, ...).
- **Data (`src/data`)**
  - **Local repositories**: `Local*Repository.impl.ts` provide client‑side demo data (fixtures).
  - **API**: `src/data/api/auth.api.ts` exposes example calls (placeholder baseUrl) for auth.
  - **Composition**: `src/data/container/index.ts` instantiates use cases with local repositories by default.
- **State & Hooks**
  - **Store**: `zustand` in `src/store/auth.store.ts` (user, loading state, error, isAuthenticated).
  - **Auth Hook**: `src/hooks/useAuth.ts` wiring `AuthUseCases` (via `AuthRepositoryImpl` and `AuthApi`).
- **Tests**
  - Unit tests (Jest) for use cases and local repositories (`src/__tests__`, `src/store/*.test.ts`).

### Tech stack

- **Framework**: Expo `~54.0.7`, React `19.1.0`, React Native `0.81.4`.
- **Language**: TypeScript `~5.9.x`.
- **Navigation**: `expo-router ~6.0.4`.
- **State**: `zustand ^5.0.2`.
- **Camera / Media**: `expo-camera`, `expo-image-picker`, `expo-media-library`.
- **UI**: `@expo/vector-icons`, `react-native-safe-area-context`, `react-native-screens`.
- **Tooling**: Jest + Testing Library, Prettier, PNPM.
- **Authentication**: Clerk (Expo/React Native SDK).
- **Push Notifications**: OneSignal (Expo‑compatible SDK).

### Folder structure (useful excerpt)

```
src/
  app/                 # Screens (Expo Router)
    (tabs)/            # Main tabs
    login.tsx          # Auth screen (real login TBD)
    camera.tsx         # Camera (capture / gallery)
  components/
    common/            # Buttons, Inputs, Themed, etc.
  constants/           # Colors, Layout
  data/
    api/               # API clients (e.g., auth.api.ts)
    repositories/      # Local* implementations and AuthRepository.impl.ts
    container/         # Use cases composition
  domain/
    models/            # Domain entities
    usecases/          # Use cases (Auth/Posts/Products/...)
  hooks/               # useAuth, useProfile, etc.
  i18n/                # en.ts, fr.ts, index.ts (t())
  store/               # Zustand (auth.store.ts)
```

### Configuration & environments

- **app.json**: name, icons, `scheme`, `newArchEnabled`, plugins (camera, image‑picker, media‑library). EAS projectId present.
- **Environment variables**: plan an `EXPO_PUBLIC_API_URL` for the backend API. `expo-env.d.ts` is present; add `.env` and/or `eas.json` with secrets.
- **Permissions**: handled by Expo plugins. Verify iOS/Android usage strings for store submissions.
- **Clerk**: env vars (`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, server secrets via EAS), SDK config and OAuth redirects.
- **OneSignal**: `EXPO_PUBLIC_ONESIGNAL_APP_ID`, mobile push capabilities and runtime permission handling.

### High‑level flows

- **Authentication (Clerk)**: `login.tsx` -> Clerk SDK (email/social OAuth) -> session handled by Clerk -> token/verification exposed to backend if needed. Current `AuthUseCases`/`AuthApi` will be adapted/simplified to delegate identity to Clerk.
- **Session**: `auth.store.ts` keeps user in memory; secure persistence (token) not yet wired.
- **Conditional navigation**: `initialRouteName: 'login'`; add an auth guard to automatically switch to `/(tabs)` when authenticated.
- **Messaging**: currently powered by local repositories; no realtime configured.
- **Camera/Media**: capture and selection functional on UI; server upload not implemented.

### API & data

- **Current**: Local repositories (`Local*Repository.impl.ts`) simulate data. `AuthApi` uses a placeholder `baseUrl` (`https://api.example.com`) and does not store a token.
- **Target**: Create remote repositories (e.g., `RemotePostsRepository`, `RemoteProductsRepository`, etc.) consuming a backend (`EXPO_PUBLIC_API_URL`), with auth, errors, pagination, and serialization.
  - For API auth, leverage tokens/claims provided by Clerk (`Authorization: Bearer <token>` header or backend middleware).
- **Backend status**: backend is under active development. A Swagger/OpenAPI base will be provided to reference endpoints and aid integration, but the live instance will not be publicly accessible initially. In the meantime, rely on local repositories/mocks.

### Security & compliance

- Session handled by Clerk (SDK) and/or app token in SecureStore if needed for proprietary API calls.
- HTTPS communication, token expiration/refresh handling, secure screen locking.
- GDPR: analytics/notifications consent, user data management, account deletion.

### Backlog to reach a working application (production readiness)

- **Authentication (Clerk)**
  - [ ] Integrate Clerk SDK for Expo/React Native (provider, hooks).
  - [ ] Wire `login.tsx` to Clerk methods (email + social).
  - [ ] Handle logout via Clerk and post‑auth redirects (navigation guards).
  - [ ] Forgot password / magic link (Clerk flows) and related screens.
  - [ ] Expose Clerk token to remote repositories if backend requires app authorization.

- **Configuration & Environments**
  - [ ] Create `.env` with `EXPO_PUBLIC_API_URL` and required secrets (EAS for builds).
  - [ ] Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and configure Clerk secrets via EAS.
  - [ ] Add `EXPO_PUBLIC_ONESIGNAL_APP_ID` for push notifications.
  - [ ] Read `EXPO_PUBLIC_API_URL` in `AuthApi` (and future API clients) instead of the hardcoded baseUrl.
  - [ ] Adjust `app.json` (`extra`) to expose needed values to the app if required.

- **Navigation & Auth Guard**
  - [ ] Replace `initialRouteName: 'login'` with a guard: if valid session -> `/(tabs)`, else `login`.
  - [ ] Protect sensitive screens (tabs, profile, messages) with an `isAuthenticated` check.

- **Data & Repositories**
  - [ ] Create "Remote*" repositories for posts/products/profiles/orders/messaging.
  - [ ] Replace `Local*Repository` injection with `Remote*Repository` in `src/data/container/index.ts` (or with env flags).
  - [ ] Implement an HTTP utility (fetch wrapper) for errors, timeouts, retry/backoff, typed JSON parsing.

- **Messaging & Realtime**
  - [ ] Show push notifications (OneSignal) on new messages.

- **Camera & Media Upload**
  - [ ] Upload captured/selected images to the backend (upload endpoint + progress/error handling).
  - [ ] Image processing (compression/resizing) if needed.
  - [ ] Request and manage push permissions (OneSignal) at the appropriate first launch.

- **Internationalization & Accessibility**
  - [ ] Replace hardcoded strings (e.g., in `login.tsx`, `camera.tsx`) with `t('...')`.
  - [ ] Cover the entire UI in EN/FR, verify contrast and sizes.

- **Design & Responsive**
  - [ ] Align the current design with the mockups (typography, colors, components, spacing).
  - [ ] Mobile‑first: ensure reliable responsive behavior on iOS/Android (small and large screens).
  - [ ] Proper safe areas, orientations (portrait/landscape), and scrolling behaviors.
  - [ ] Factor the design system (tokens, common components) for visual consistency.

- **Feed & Interactions**
  - [ ] Implement post actions: like, comment, report, block user.
  - [ ] Optimistic UI updates with error/rollback handling.
  - [ ] Wire remote endpoints/repositories and moderation.
  - [ ] Implement follow/unfollow, update feeds accordingly.
  - [ ] Add empty/error/loading states for Following and Explore feeds.

- **E‑commerce**
  - [ ] Implement a front‑managed cart (local/persisted state) with backend sync at checkout.
  - [ ] Define cart, checkout, and payment (e.g., Stripe) on mobile and backend.
  - [ ] Orders history and status management.

- **Search**
  - [ ] Implement the search bar (input, debounce, clear, submit) on `search`.
  - [ ] Query remote repositories (users, posts, products) and merge/segment results.
  - [ ] Display result lists, empty/error states, and navigation to profile/post/product.
  - [ ] Add quick caching and pagination/infinite scroll if needed.

### Acceptance criteria (MVP)

- Working email login/logout with persisted session and automatic redirection.
- Lists (posts/products) fetched from the remote API with loading/error states.
- Image capture/selection and successful upload (URL returned) with user feedback.
- Messaging functional (at least pull/refresh), sending text and images.
- Auth guard on protected screens, and i18n applied across all visible strings.


