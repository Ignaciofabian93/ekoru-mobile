# Auth Feature

## Overview

The `auth` feature handles user registration and login for the Ekoru mobile app. It follows the project's feature-based architecture: each sub-directory has a single, clearly-scoped responsibility.

```
features/auth/
├── docs/              ← you are here
├── hooks/
│   ├── useLogin.tsx
│   └── useRegister.tsx
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en-US.json
│       ├── es-CL.json
│       └── fr-CA.json
├── screens/
│   ├── login.tsx
│   └── register.tsx
├── tests/
│   ├── useLogin.test.ts
│   └── useRegister.test.ts
└── ui/
    ├── LoginForm.tsx
    └── RegisterForm.tsx
```

---

## Authentication Flow

### Login

1. The user fills in email + password in `LoginForm`.
2. `useLogin.handleLogin` fires:
   - **Step 1 — REST** → `api/auth/login` (sets the auth cookie and returns a JWT + optional refreshToken).
   - **Step 2 — GraphQL** → `GET_ME` query (fetches the full `Seller` profile). The `Authorization` header is passed explicitly because `setSession` has not run yet.
   - **Step 3 — Persist** → `useAuthStore.setSession` writes the token, refreshToken, and seller object to `expo-secure-store` and Zustand.
3. The router navigates to `/(tabs)`.

### Registration

1. The user selects a seller type (`PERSON` | `STARTUP` | `COMPANY`) and fills in the form via `RegisterForm`.
2. `useRegister.handleRegister` validates required fields and password match, then fires either `REGISTER_PERSON` or `REGISTER_BUSINESS` GraphQL mutation.
3. On success, a toast is shown and the router navigates back to the login screen.

---

## Hooks

### `useLogin`

| Return value | Type | Description |
|---|---|---|
| `email` | `string` | Controlled email field value |
| `password` | `string` | Controlled password field value |
| `showPassword` | `boolean` | Toggle password visibility |
| `setShowPassword` | `(v: boolean) => void` | Setter for password visibility |
| `loading` | `boolean` | True while the login request is in-flight |
| `handleFieldChange` | `({name, value}) => void` | Generic field handler (name: `"email"` \| `"password"`) |
| `handleLogin` | `() => Promise<void>` | Validates inputs and performs the login flow |

### `useRegister`

| Return value | Type | Description |
|---|---|---|
| `sellerType` | `SellerType` | Selected account type (`"PERSON"` \| `"STARTUP"` \| `"COMPANY"`) |
| `setSellerType` | `(t: SellerType) => void` | Setter for seller type |
| `firstName`, `lastName`, `email`, `password`, `confirmPassword` | `string` | Controlled form field values |
| `loading` | `boolean` | True while the mutation is in-flight |
| `handleFieldChange` | `({name, value}) => void` | Generic field handler |
| `handleRegister` | `() => Promise<void>` | Validates inputs and fires the appropriate mutation |

---

## GraphQL Queries & Mutations

### `GET_ME` — `graphql/auth/login.ts`

Fetches the authenticated seller's full profile. Used immediately after REST login to populate the auth store.

```graphql
query Me {
  me {
    ...SellerFields
    profile {
      ... on BusinessProfile { ...BusinessProfileFields }
      ... on PersonProfile   { ...PersonProfileFields  }
    }
  }
}
```

### `REGISTER_PERSON` / `REGISTER_BUSINESS` — `graphql/auth/register.ts`

Create a new seller account. Both accept a common `input` shape:

```graphql
mutation RegisterPerson($input: RegisterPersonInput!) {
  registerPerson(input: $input) { id email }
}
mutation RegisterBusiness($input: RegisterBusinessInput!) {
  registerBusiness(input: $input) { id email }
}
```

---

## i18n

The auth feature registers its own namespace (`"auth"`) via `features/auth/i18n/index.ts`. Supported locales: `en-US`, `es-CL`, `fr-CA`.

Import the namespace initialiser at the top of every hook/screen that uses it:

```ts
import "../i18n"; // side-effect: registers bundles
import { useTranslation } from "react-i18next";

const { t } = useTranslation("auth");
```

---

## State Management

Auth state lives in `store/useAuthStore.ts` (Zustand). Key selectors:

| Selector | Returns |
|---|---|
| `useIsAuthenticated()` | `boolean` — true when token + seller are present |
| `useSeller()` | `Seller \| null` |
| `useSellerType()` | `SellerType \| null` |
| `usePersonProfile()` | `PersonProfile \| null` |
| `useBusinessProfile()` | `BusinessProfile \| null` |

The store also persists data to `expo-secure-store` so the session survives app restarts. Call `useAuthStore.hydrate()` on app startup (see `app/_layout.tsx`).

---

## Testing

Tests live in `features/auth/tests/`. They use `@testing-library/react-native` `renderHook` + `act` and mock the following modules:

- `react-i18next` — returns translation key strings as-is
- `@/i18n` — no-op
- `expo-router` — captures `useRouter` calls
- `@/lib/toast` — captures `showError` / `showSuccess` calls
- `@apollo/client` — mutations are mocked to avoid real network calls

Run tests:

```bash
npm test
# or in watch mode
npm run test:watch
```

Run individual auth hook tests:

```bash
# useLogin
npx jest features/auth/tests/useLogin.test.ts

# useRegister
npx jest features/auth/tests/useRegister.test.ts
```
