# Translations

This document explains how internationalization (i18n) works in the EKORU mobile app — at the root level and inside each feature.

---

## Stack

| Package | Role |
|---|---|
| `i18next` | Core i18n engine |
| `react-i18next` | React bindings (`useTranslation` hook) |
| `expo-localization` | Reads the device's locale setting |

---

## Root i18n Setup

**File:** `i18n/index.ts`

The root i18n instance is initialized once at app startup:

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

const deviceLanguage = getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: deviceLanguage,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});
```

- Device language is detected via `expo-localization` on first load
- Supported languages: **English** (`en`), **Spanish** (`es`), **French** (`fr`)
- Fallback language is **Spanish** when a key or language is missing
- `escapeValue: false` — React handles XSS escaping, so i18next doesn't need to

### Root Locale Files

```
i18n/
└── locales/
    ├── en.json
    ├── es.json
    └── fr.json
```

The root namespace covers app-wide UI strings:

- Tab bar labels: `home`, `marketplace`, `stores`, `publish`, `services`, `education`, `notifications`, `recycle`, `profile`
- Screen titles and generic navigation labels
- Location confirmation dialog: `detectedTitle`, `detectedSubtitle`, `confirm`, `notMyLocation`

---

## Feature-Scoped Namespaces

Each feature maintains its own translation namespace, separate from the root. This keeps translation files small and co-located with their feature.

### How it works

Each feature has an `i18n/` directory:

```
features/
└── profile/
    └── i18n/
        ├── index.ts       ← registers the namespace
        └── locales/
            ├── en.json
            ├── es.json
            └── fr.json
```

**File:** `features/profile/i18n/index.ts`

```typescript
import i18n from "@/i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

export const NAMESPACE = "profile";

i18n.addResourceBundle("en", NAMESPACE, en);
i18n.addResourceBundle("es", NAMESPACE, es);
i18n.addResourceBundle("fr", NAMESPACE, fr);
```

The feature imports the root i18n instance and registers its own bundle under a named namespace. This is called once when the feature module loads.

### Using translations inside a feature screen

```typescript
import "@/features/profile/i18n"; // side-effect: registers the namespace
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";

const { t } = useTranslation(NAMESPACE);

// Basic key
t("editProfile")

// Interpolation
t("greenImpactSubtitle_other", { name: seller.profile.firstName })

// Pluralization
t("item", { count: order.itemCount })
// → "1 item" or "3 items"
```

---

## Supported Languages

| Code | Language |
|---|---|
| `en` | English |
| `es` | Spanish (default fallback) |
| `fr` | French |

Locale files in the `auth` feature use region-specific codes (`en-US`, `es-CL`, `fr-CA`), while the profile and root namespaces use base codes (`en`, `es`, `fr`).

---

## Language Switching at Runtime

**File:** `features/profile/ui/LanguagesSection.tsx`

The user can change language in Settings → Language:

```typescript
// Changes UI language immediately
i18n.changeLanguage(lang.code);

// Persists the preference to the API
await updateSellerPreferences({ preferredLanguage: lang.code });
```

The change takes effect instantly across all components using `useTranslation`. No app restart is required.

Available options come from:

**File:** `config/languages.ts`

```typescript
export const LANGUAGES_SUPPORTED = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];
```

---

## Profile Feature Translation Keys

The profile namespace (`features/profile/i18n/locales/`) covers:

**Navigation & menu:**
`editProfile`, `changePassword`, `orderHistory`, `favorites`, `environmentalImpact`, `subscription`, `settings`, `logOut`

**Profile fields:**
`firstName`, `lastName`, `displayName`, `bio`, `businessName`, `description`, `legalBusinessName`, `taxId`
Plus placeholders for each field: `firstName_placeholder`, etc.

**Address:**
`phone`, `address`, `county`, `city`, `region`, `country`

**Seller types:**
`sellerType_PERSON`, `sellerType_STARTUP`, `sellerType_COMPANY`

**Subscription plans:**
`plan_FREEMIUM`, `plan_BASIC`, `plan_ADVANCED`, `plan_STARTUP`, `plan_EXPERT`

**Password change:**
`currentPassword`, `newPassword`, `confirmNewPassword`, `updatePassword`
`error_fillFields`, `error_passwordMismatch`

**Settings sections:**
`pushNotifications`, `emailNotifications`, `orderUpdates`, `communityUpdates`, `securityAlerts`, `weeklySummary`, `twoFactorAuth`
`language`, `currency`, `detectedCurrency`, `about`, `version`, `termsOfService`, `privacyPolicy`

**Order history:**
`noOrders`, `total`
`item_one` (singular), `item_other` (plural) — used with `{ count }` interpolation
`status_Delivered`, `status_Shipped`, `status_Processing`, `status_Cancelled`

**Favorites:**
`noFavorites`, `browseMarketplace`

**Environmental impact:**
`yourGreenImpact`, `greenImpactSubtitle_other` (with `{{name}}` interpolation)
`co2Saved`, `itemsRecycled`, `waterSaved`, `equivalentTrees`
`howCalculated`, `calculationExplanation`

**Guest screen:**
`joinCommunity`, `guestSubtitle`
`perk_points_title`, `perk_points_desc`
`perk_impact_title`, `perk_impact_desc`
`perk_badge_title`, `perk_badge_desc`
`perk_deals_title`, `perk_deals_desc`
`perk_trees_title`, `perk_trees_desc`
`createAccount`, `signIn`

---

## Adding a New Language

1. Add locale JSON files in each namespace directory:
   - `i18n/locales/<code>.json`
   - `features/<feature>/i18n/locales/<code>.json`

2. Register the new language in `i18n/index.ts`:
   ```typescript
   import newLang from "./locales/<code>.json";
   resources: { ..., <code>: { translation: newLang } }
   ```

3. Register in each feature's `i18n/index.ts`:
   ```typescript
   import newLang from "./locales/<code>.json";
   i18n.addResourceBundle("<code>", NAMESPACE, newLang);
   ```

4. Add the language option to `config/languages.ts`:
   ```typescript
   { code: "<code>", label: "Language Name" }
   ```

---

## Adding a New Feature with Translations

1. Create `features/<name>/i18n/locales/en.json` (and `es.json`, `fr.json`)
2. Create `features/<name>/i18n/index.ts` following the profile pattern
3. Import the i18n side-effect at the top of each screen: `import "@/features/<name>/i18n";`
4. Use `useTranslation(NAMESPACE)` in components
