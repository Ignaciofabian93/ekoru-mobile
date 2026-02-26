# Authentication

This document covers how authentication works in the EKORU mobile app, including session management, secure storage, biometric unlock, and the GraphQL operations used.

---

## Overview

Authentication is handled through three layers:

1. **Zustand store** (`store/useAuthStore.ts`) — holds the in-memory session state and exposes actions/selectors
2. **Expo Secure Store** — persists the JWT token and seller data encrypted on the device
3. **GraphQL** (`graphql/auth/`) — handles login, registration, and profile mutations via the API gateway

---

## Auth Store

**File:** `store/useAuthStore.ts`

The store holds the full session and biometric state:

```
seller           — current authenticated Seller object (null if logged out)
token            — JWT string (null if logged out)
isHydrated       — true once persisted data has been loaded on startup
biometricEnabled — user's preference for biometric unlock
requiresBiometric — true when the app requires biometric verification before proceeding
```

### Actions

| Action | Description |
|---|---|
| `login(email, password)` | Authenticates the user and sets the session. Currently uses a mock response; will be wired to the GraphQL mutation. |
| `setSession(token, seller)` | Persists the token and seller to Secure Store and updates in-memory state. |
| `logout()` | Clears all session data from memory and Secure Store. Resets biometric requirement. |
| `hydrate()` | Called on app startup. Reads persisted token and seller from Secure Store and restores state. |
| `setBiometricEnabled(enabled)` | Saves the user's biometric preference and immediately sets `requiresBiometric` to match. |
| `unlockWithBiometric()` | Clears the `requiresBiometric` flag after a successful biometric verification. |

### Selectors

These are standalone hooks that subscribe to specific store slices:

| Selector | Returns |
|---|---|
| `useIsAuthenticated()` | `boolean` — true if `seller` is not null |
| `useSeller()` | `Seller \| null` |
| `useSellerType()` | `"PERSON" \| "STARTUP" \| "COMPANY" \| undefined` |
| `useIsSellerType(type)` | `boolean` |
| `useHasSellerType(...types)` | `boolean` — true if seller matches any of the given types |

---

## Session Persistence

Token and seller data are stored with `expo-secure-store`, which uses the device keychain (iOS) or Keystore (Android). The data is encrypted at rest and tied to the app bundle.

On app startup, `_layout.tsx` calls `hydrate()` which reads both values and restores the session before the first screen renders. The `isHydrated` flag prevents rendering authenticated routes before this completes.

---

## Biometric Authentication

### Hook

**File:** `hooks/useBiometricAuth.ts`

Uses `expo-local-authentication` to interact with the device's biometric hardware.

```
isAvailable     — whether the device supports biometrics
supportedTypes  — array of enrolled biometric types (fingerprint, face, iris)
authenticate()  — triggers the native biometric prompt, returns success/failure
```

The hook auto-initializes on mount and supports automatic fallback to device passcode.

### BiometricGate

**File:** `components/shared/BiometricGate/BiometricGateScreen.tsx`

A full-screen modal overlay rendered in `_layout.tsx` when `requiresBiometric` is `true`:

```tsx
{requiresBiometric && <BiometricGateScreen />}
```

Behavior:
- Displays the seller's name as a greeting
- Automatically triggers the biometric prompt on mount
- Shows the appropriate icon (Face ID or Fingerprint) based on `supportedTypes`
- On success, calls `unlockWithBiometric()` to clear the gate
- Offers a "Use password instead" fallback that calls `logout()` and redirects to the login screen

### Enabling Biometrics

The user toggles biometrics from the Settings screen. The `useSettings` hook (in `features/profile/hooks/useSettings.tsx`) calls `setBiometricEnabled(true|false)` on the auth store after saving the preference via the `UPDATE_SELLER_PREFERENCES` GraphQL mutation.

The biometric gate appears:
- On app foreground after it was backgrounded (when biometric is enabled)
- Any time `requiresBiometric` is set to `true`

---

## GraphQL Operations

### Registration

**File:** `graphql/auth/register.ts`

Two mutations exist depending on account type:

```graphql
mutation RegisterPerson($input: RegisterPersonInput!) {
  registerPerson(input: $input) {
    id
    email
    sellerType
    createdAt
    updatedAt
  }
}

mutation RegisterBusiness($input: RegisterBusinessInput!) {
  registerBusiness(input: $input) {
    id
    email
    sellerType
    createdAt
    updatedAt
  }
}
```

### Profile & Security Mutations

**File:** `graphql/auth/profile.ts`

| Mutation | Purpose |
|---|---|
| `UPDATE_SELLER` | Updates basic seller fields (address, phone, etc.) |
| `UPDATE_PERSON_PROFILE` | Updates personal profile (name, bio, birthday) |
| `UPDATE_BUSINESS_PROFILE` | Updates business profile (name, tax ID, description) |
| `UPDATE_SELLER_PREFERENCES` | Updates notification, language, and currency preferences |
| `UPDATE_PASSWORD` | Changes the account password |
| `REQUEST_PASSWORD_RESET` | Initiates a password reset flow |
| `DEACTIVATE_ACCOUNT` | Soft-deletes the seller account |
| `REACTIVATE_ACCOUNT` | Re-enables a previously deactivated account |
| `UPDATE_SELLER_CATEGORY` | Updates the seller's level or category |

### Me Query

**File:** `graphql/auth/login.ts`

Used to refresh the authenticated seller's data:

```graphql
query Me {
  me {
    ...SellerFields
    profile {
      ... on BusinessProfile { ...BusinessProfileFields }
      ... on PersonProfile   { ...PersonProfileFields }
    }
  }
}
```

---

## Guest State

When there is no authenticated session, the profile tab renders `GuestScreen.tsx` instead of the user's profile. It shows a list of perks (eco points, environmental impact, verified badge, deals, tree planting) and CTA buttons to sign up or sign in.

---

## Auth Screen Flow

```
App start
  └─ hydrate() reads Secure Store
       ├─ Token found → restore session → show authenticated tabs
       │     └─ biometricEnabled? → show BiometricGate
       └─ No token → show (auth) stack
             ├─ login.tsx    — email/password form
             └─ register.tsx — account type selection + registration form
```
