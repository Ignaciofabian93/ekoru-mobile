# Profile Feature

## Overview

The `profile` feature covers everything a logged-in seller can view or change about their own account: personal/business details, photos, password, two-factor authentication, notifications, language/currency settings, order history, favourites, environmental impact, and subscription tier.

```
features/profile/
├── constants/
│   ├── imageSize.ts        ← cover/avatar pixel constants
│   └── menuRows.ts         ← hook that builds the navigation menu items
├── docs/                   ← you are here
├── hooks/
│   ├── useChangePassword.tsx
│   ├── useLocation.tsx
│   ├── useProfileData.tsx
│   ├── useSettings.tsx
│   └── useTwoFactorAuth.tsx
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       ├── es.json
│       └── fr.json
├── screens/
│   ├── ChangePasswordScreen.tsx
│   ├── EditProfileScreen.tsx
│   ├── EnvironmentalImpactScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── GuestScreen.tsx
│   ├── OrderHistoryScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── SubscriptionScreen.tsx
│   ├── TwoFactorAuthScreen.tsx
│   └── legal/
│       ├── PrivacyPolicyScreen.tsx
│       └── TermsOfServiceScreen.tsx
├── tests/
│   ├── useChangePassword.test.ts
│   ├── useProfileData.test.ts
│   ├── useSettings.test.ts
│   └── useTwoFactorAuth.test.ts
├── ui/
│   ├── AboutSection.tsx
│   ├── CurrencySection.tsx
│   ├── LanguagesSection.tsx
│   ├── NotificationsSection.tsx
│   ├── editProfile/
│   │   ├── BusinessInfoForm.tsx
│   │   ├── ContactForm.tsx
│   │   ├── LocationForm.tsx
│   │   └── PersonInfoForm.tsx
│   ├── layout/
│   │   └── Container.tsx
│   └── main/
│       ├── CoverImage.tsx
│       ├── Identity.tsx
│       ├── NavigationMenu.tsx
│       ├── PhotoPicker.tsx
│       ├── ProfileDetails.tsx
│       ├── ProfileImage.tsx
│       └── ProfileImageModal.tsx
└── utils/
    ├── formatters.ts
    └── resolveImage.ts
```

---

## Screens & Routes

All profile screens are in the `(profile)` Expo Router group (`app/(profile)/`).

| Route | Screen | Description |
|---|---|---|
| `/(profile)/` | `ProfileScreen` | Main profile overview with photo, identity, and navigation menu |
| `/(profile)/edit-profile` | `EditProfileScreen` | Multi-section form for personal/business/contact/location data |
| `/(profile)/change-password` | `ChangePasswordScreen` | Change account password via `UPDATE_PASSWORD` mutation |
| `/(profile)/two-factor-auth` | `TwoFactorAuthScreen` | Enable / disable biometric 2FA |
| `/(profile)/order-history` | `OrderHistoryScreen` | Past purchase list |
| `/(profile)/favorites` | `FavoritesScreen` | Saved products and stores |
| `/(profile)/environmental-impact` | `EnvironmentalImpactScreen` | CO₂ saved, items recycled, water saved |
| `/(profile)/subscription` | `SubscriptionScreen` | Current plan and upgrade options |
| `/(profile)/settings` | `SettingsScreen` | Notifications, language, currency preferences |

Unauthenticated users see `GuestScreen` (rendered by `ProfileScreen` when `seller` is `null`).

---

## Hooks

### `useProfileData`

Manages **all edit-profile state and mutations** in one place.

| Return value | Description |
|---|---|
| `seller` | The current `Seller` from the auth store |
| `personValues` / `bizValues` | Controlled form state for the active profile type |
| `contactValues` | Phone, website, social links, preferred contact method |
| `locationValues` | Country → Region → City → County cascade |
| `isSaving` | Aggregate loading flag across all three mutations |
| `handleLocationChange(key, value)` | Cascades null-outs for dependent fields on change |
| `handleSave()` | Fires `UPDATE_SELLER`, `UPDATE_PERSON_PROFILE` / `UPDATE_BUSINESS_PROFILE` in parallel, then merges results back into the auth store |

### `useChangePassword`

Wraps the `UPDATE_PASSWORD` GraphQL mutation.

| Return value | Description |
|---|---|
| `currentPassword`, `newPassword`, `confirmPassword` | Controlled string values |
| `loading` | True while mutation is in-flight |
| `handleSubmit()` | Validates inputs, fires `UPDATE_PASSWORD`, shows a success/error toast, navigates back on success |

### `useSettings`

Manages seller notification and locale preferences.

| Return value | Description |
|---|---|
| `sellerPreferences` | `Partial<SellerPreferences>` — current toggle/select values |
| `handleSellerPreferences({preference, value})` | Updates a single preference key |
| `submitSellerPreferences()` | Fires `UPDATE_SELLER_PREFERENCES` and persists biometric flag via `setBiometricEnabled` |
| `loadingPreferences` | True while mutation is in-flight |

### `useTwoFactorAuth`

Controls the dedicated 2FA toggle screen.

| Return value | Description |
|---|---|
| `isEnabled` | Whether 2FA (biometric gate) is currently active |
| `isAvailable` | Whether the device has usable biometric hardware |
| `supportedTypes` | `("fingerprint" \| "face" \| "iris")[]` |
| `loading` | True while `UPDATE_SELLER_PREFERENCES` is in-flight |
| `toggle()` | If enabling, prompts biometrics first; then updates the server preference and the local auth store |

---

## GraphQL Queries & Mutations

All profile mutations are in `graphql/auth/profile.ts`.

### `UPDATE_SELLER`

Updates seller-level fields (phone, website, location, social links, preferred contact method).

```graphql
mutation UpdateSeller($input: UpdateSellerInput!) {
  updateSeller(input: $input) { ...SellerFields }
}
```

### `UPDATE_PERSON_PROFILE`

Updates `PersonProfile` fields (firstName, lastName, displayName, bio, birthday, allowExchanges).

```graphql
mutation UpdatePersonProfile($input: UpdatePersonProfileInput!) {
  updatePersonProfile(input: $input) { ...PersonProfileFields }
}
```

### `UPDATE_BUSINESS_PROFILE`

Updates `BusinessProfile` fields (businessName, description, taxId, policies, etc.).

```graphql
mutation UpdateBusinessProfile($input: UpdateBusinessProfileInput!) {
  updateBusinessProfile(input: $input) { ...BusinessProfileFields }
}
```

### `UPDATE_PASSWORD`

Changes the seller's password. Requires the current password for verification.

```graphql
mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
  updatePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
    id
    email
  }
}
```

### `UPDATE_SELLER_PREFERENCES`

Persists notification toggles, language, currency, and the 2FA flag.

```graphql
mutation UpdateSellerPreferences($input: UpdateSellerPreferencesInput!) {
  updateSellerPreferences(input: $input) { ...SellerPreferencesFields }
}
```

---

## Two-Factor Authentication (2FA)

Ekoru uses the device's **biometric hardware** (Face ID, fingerprint, iris) as a second authentication factor. There is no TOTP or SMS step.

**Enable flow:**
1. User taps "Enable 2FA" on `TwoFactorAuthScreen`.
2. `useTwoFactorAuth.toggle` triggers `LocalAuthentication.authenticateAsync` — the OS biometric prompt appears.
3. On success, `UPDATE_SELLER_PREFERENCES` sets `twoFactorAuth: true` on the server.
4. `useAuthStore.setBiometricEnabled(true)` persists the flag to `expo-secure-store`.
5. On next app launch, `hydrate()` sees `biometricEnabled = true` and sets `requiresBiometric = true`, which triggers the biometric gate in `app/_layout.tsx`.

**Disable flow:**
1. User taps "Disable 2FA" — no biometric prompt is required to turn it off.
2. Server preference and local store are updated to `false`.

If the device has no enrolled biometrics, the button is disabled and an explanatory message is shown.

---

## i18n

The profile feature registers two namespaces:

| Namespace | File | Used in |
|---|---|---|
| `"profile"` | `features/profile/i18n/index.ts` | All profile screens and hooks |
| `"profileMain"` | `features/profile/ui/main/i18n/index.ts` | `NavigationMenu`, `Identity`, `ProfileDetails` |
| `"editProfile"` | `features/profile/ui/editProfile/i18n/index.ts` | Edit-profile form sections |

---

## State

Profile data lives in `store/useAuthStore.ts`. After any mutation the hook calls `refreshSeller` to keep the store in sync without a full re-fetch.

Key selectors used by profile screens:

| Selector | Returns |
|---|---|
| `useSeller()` | Full `Seller` object |
| `usePersonProfile()` | `PersonProfile \| null` |
| `useBusinessProfile()` | `BusinessProfile \| null` |
| `useProfileImage()` | Resolved image URL for the avatar |
| `useCoverImage()` | Resolved image URL for the cover banner |
| `useInitials()` | Two-letter initials derived from the display name |

---

## Testing

Tests live in `features/profile/tests/`. Run with:

```bash
npm test
```

Each test file mocks: `react-i18next`, `@/i18n`, `expo-router`, `@/lib/toast`, `@apollo/client/react`, `expo-local-authentication`, and `@/store/useAuthStore` as needed.
