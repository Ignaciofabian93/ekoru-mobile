# Data Flow Diagram

This document describes how data moves through the EKORU mobile app — from app startup through authentication, biometric verification, store hydration, and API communication.

---

## Application Startup

```
App Launch (_layout.tsx)
  │
  ├─ ApolloProvider wraps entire tree
  │    └─ Apollo Client (lib/apollo.ts)
  │         └─ HttpLink → GRAPHQL_URL (environment-dependent)
  │
  ├─ ThemeProvider
  ├─ DrawerContextProvider
  ├─ useFonts() — Cabin 400/500/600/700
  │
  ├─ useAuthStore.hydrate()
  │    └─ Reads from Expo Secure Store
  │         ├─ token  → state.token
  │         └─ seller → state.seller
  │              └─ state.isHydrated = true
  │
  └─ useLocationStore.hydrate()
       └─ Reads from Expo Secure Store
            └─ confirmed location → state.confirmed
                 └─ state.isHydrated = true
```

---

## Authentication Flow

```
User Action: Login
  │
  ├─ features/auth/screens/login.tsx
  │    └─ calls useAuthStore.login(email, password)
  │
  └─ useAuthStore.login()
       │
       ├─ [TODO] Apollo mutation: LOGIN (graphql/auth/login.ts)
       │    └─ POST → gateway.ekoru.cl/graphql
       │         └─ returns { token, seller }
       │
       └─ setSession(token, seller)
            ├─ Expo Secure Store.set("auth_token", token)
            ├─ Expo Secure Store.set("auth_seller", JSON.stringify(seller))
            ├─ state.token = token
            └─ state.seller = seller
                 └─ app navigates to authenticated (tabs)
```

```
User Action: Register
  │
  └─ features/auth/screens/register.tsx
       │
       ├─ sellerType === "PERSON"
       │    └─ Apollo mutation: RegisterPerson (graphql/auth/register.ts)
       │         └─ POST → gateway → returns { id, email, sellerType }
       │
       └─ sellerType === "STARTUP" | "COMPANY"
            └─ Apollo mutation: RegisterBusiness (graphql/auth/register.ts)
                 └─ POST → gateway → returns { id, email, sellerType }
```

```
User Action: Logout
  │
  └─ useAuthStore.logout()
       ├─ Expo Secure Store.delete("auth_token")
       ├─ Expo Secure Store.delete("auth_seller")
       ├─ state.token = null
       ├─ state.seller = null
       └─ state.requiresBiometric = false
            └─ app navigates to GuestScreen / (auth) stack
```

---

## Biometric Flow

```
App foreground with biometricEnabled = true
  │
  └─ state.requiresBiometric = true
       │
       └─ _layout.tsx renders <BiometricGateScreen />
            │
            ├─ useBiometricAuth.authenticate()
            │    └─ expo-local-authentication
            │         ├─ Device prompts Face ID / Fingerprint
            │         │
            │         ├─ SUCCESS
            │         │    └─ useAuthStore.unlockWithBiometric()
            │         │         └─ state.requiresBiometric = false
            │         │              └─ BiometricGate unmounts
            │         │
            │         └─ FAILURE / "Use password"
            │              └─ useAuthStore.logout()
            │                   └─ redirect to (auth) stack
            │
            └─ User sees app only after successful verification
```

---

## Profile Data Flow

```
ProfileScreen renders
  │
  ├─ useSeller() → reads state.seller from useAuthStore
  │    └─ Displays: name, email, sellerType, points, address, subscription
  │
  └─ (future) Apollo query: Me → refreshes seller from API
       └─ setSession(token, freshSeller)
```

```
EditProfileScreen: Save
  │
  ├─ sellerType === "PERSON"
  │    └─ Apollo mutation: UPDATE_PERSON_PROFILE
  │         └─ POST → gateway → returns updated profile
  │
  └─ sellerType !== "PERSON"
       └─ Apollo mutation: UPDATE_BUSINESS_PROFILE
            └─ POST → gateway → returns updated profile
```

```
ChangePasswordScreen: Submit
  │
  └─ Apollo mutation: UPDATE_PASSWORD
       └─ POST → gateway → success / error toast
```

---

## Settings & Preferences Flow

```
SettingsScreen
  │
  └─ useSettings() hook (features/profile/hooks/useSettings.tsx)
       │
       ├─ Local state: language, currency, notifications, 2FA
       │
       ├─ "Save" action
       │    └─ Apollo mutation: UPDATE_SELLER_PREFERENCES
       │         └─ POST → gateway → updates preferences
       │              ├─ showSuccess() toast
       │              └─ if twoFactorAuth changed:
       │                   └─ useAuthStore.setBiometricEnabled(value)
       │                        └─ state.biometricEnabled = value
       │                             └─ state.requiresBiometric = value
       │
       └─ Language change (LanguagesSection.tsx)
            ├─ i18n.changeLanguage(code) → immediate UI re-render
            └─ UPDATE_SELLER_PREFERENCES → persisted to API
```

---

## Cart Flow

```
User: Add item to cart
  │
  └─ useCartStore.addItem(product, quantity)
       └─ state.items = [...items, { product, quantity }]

User: View cart
  │
  └─ useCartStore.itemCount() → derived: items.length
  └─ useCartStore.subtotal()  → derived: sum of (price × qty)

User: Checkout (future)
  │
  └─ Apollo mutation → POST → gateway
       └─ clearCart() on success
```

---

## Location Flow

```
App start / Location detection
  │
  ├─ Device GPS / IP geolocation
  │    └─ useLocationStore.setDetected(location)
  │         └─ location modal shown in _layout.tsx
  │
  ├─ User confirms location
  │    └─ useLocationStore.confirm()
  │         ├─ Expo Secure Store.set("confirmed_location", JSON.stringify(location))
  │         └─ state.confirmed = state.detected
  │
  └─ User selects different location
       └─ useLocationStore.override(location)
            └─ Expo Secure Store.set("confirmed_location", ...)
```

---

## API Gateway Connection

```
Apollo Client (lib/apollo.ts)
  │
  ├─ Environment: development
  │    └─ http://192.168.0.5:4000/graphql  (local network)
  │
  ├─ Environment: qa
  │    └─ https://qa.gateway.ekoru.cl/graphql
  │
  └─ Environment: production
       └─ https://gateway.ekoru.cl/graphql

All requests:
  └─ InMemoryCache caches query results
       └─ Subsequent reads served from cache until invalidated
```

---

## Full Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  Device / User                                                  │
│                                                                 │
│  ┌──────────────┐    ┌─────────────────────────────────────┐   │
│  │  Expo Secure │    │  Zustand Stores                     │   │
│  │  Store       │    │  ┌─────────────┐ ┌───────────────┐  │   │
│  │  - token     │◄──►│  │ useAuthStore│ │useLocationStore│  │   │
│  │  - seller    │    │  │ useCartStore│ └───────────────┘  │   │
│  │  - location  │    │  └──────┬──────┘                   │   │
│  └──────────────┘    │         │                           │   │
│                      └─────────┼───────────────────────────┘   │
│  ┌───────────────────┐         │                               │
│  │ expo-local-auth   │         │ React Screens / Hooks         │
│  │ (biometrics)      │         │                               │
│  └─────────┬─────────┘         │                               │
│            │                   ▼                               │
│            └──────► BiometricGate ──► unlockWithBiometric()   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Apollo Client                                            │ │
│  │  InMemoryCache ◄──── Queries & Mutations ────► HttpLink   │ │
│  └─────────────────────────────────────────┬─────────────────┘ │
└────────────────────────────────────────────┼────────────────────┘
                                             │ HTTP/GraphQL
                                             ▼
                              ┌──────────────────────────┐
                              │  EKORU API Gateway       │
                              │  gateway.ekoru.cl/graphql│
                              └──────────────────────────┘
```
