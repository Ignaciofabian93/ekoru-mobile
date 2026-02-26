# EAS Build & Development Builds

This document explains how the EKORU mobile app is configured, built, and run across different environments using Expo and EAS (Expo Application Services).

---

## App Configuration

**File:** `app.json`

The root configuration for the Expo app:

| Field | Value | Notes |
|---|---|---|
| `name` | `EKORU` | Display name on the device |
| `slug` | `EKORU` | Unique identifier on Expo's servers |
| `version` | `1.0.0` | App version shown in stores |
| `scheme` | `ekoru` | Deep link scheme (`ekoru://`) |
| `orientation` | `portrait` | Locked to portrait mode |
| `newArchEnabled` | `true` | React Native New Architecture enabled |
| `userInterfaceStyle` | `automatic` | Follows system light/dark mode |

### Platform-specific settings

**iOS:**
- Supports tablet layouts

**Android:**
- Adaptive icon with foreground image and white background
- Edge-to-edge display enabled
- Predictive back gesture disabled

**Web:**
- Metro bundler
- Static output mode
- Same favicon as app icon

### Expo Plugins

```json
"plugins": [
  "expo-router",
  "expo-localization",
  "expo-secure-store"
]
```

- `expo-router` — file-based navigation
- `expo-localization` — device locale detection
- `expo-secure-store` — encrypted on-device storage (requires native build)

### Experimental Features

```json
"experiments": {
  "typedRoutes": true
}
```

Enables TypeScript types for all Expo Router route paths.

---

## Environments

**File:** `config/environment.ts`

The app reads the environment from:
1. `NEXT_PUBLIC_ENVIRONMENT` env var
2. `ENVIRONMENT` env var
3. Falls back to `"development"`

**File:** `config/endpoints.ts`

Each environment points to a different API gateway:

| Environment | GraphQL Endpoint |
|---|---|
| `development` | `http://192.168.0.5:4000/graphql` (local network IP) |
| `qa` | `https://qa.gateway.ekoru.cl/graphql` |
| `production` | `https://gateway.ekoru.cl/graphql` |

> **Note:** The local development IP (`192.168.0.5`) needs to match the machine running the API server. Update this when working from a different network.

---

## Running the App Locally

Scripts defined in `package.json`:

```bash
# Start Expo dev server (opens QR code for Expo Go or dev build)
npm start

# Open directly on Android emulator or device
npm run android

# Open directly on iOS simulator or device
npm run ios

# Open in browser (web)
npm run web

# Run tests
npm test
```

### Development with Expo Go vs Development Build

**Expo Go** is the Expo sandbox app available on app stores. It works for most features but does not support native modules that require custom native code.

**Development Build** is a custom version of the app installed directly on the device. It includes all native plugins (like `expo-secure-store` and `expo-local-authentication`) and is required for testing biometric auth and secure storage.

To create a development build with EAS:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build a development client for Android
eas build --profile development --platform android

# Build a development client for iOS
eas build --profile development --platform ios
```

Once installed, start the dev server and connect:

```bash
npx expo start --dev-client
```

---

## EAS Build Profiles

EAS build profiles are defined in `eas.json` (to be configured). Common profile structure:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "ENVIRONMENT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "ENVIRONMENT": "qa"
      }
    },
    "production": {
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

| Profile | Purpose | Distribution |
|---|---|---|
| `development` | Dev client with hot reload | Internal (testers) |
| `preview` | QA testing against staging API | Internal (testers) |
| `production` | App Store / Play Store submission | Public |

---

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~54.0.33 | Core Expo SDK |
| `react-native` | 0.81.5 | React Native runtime |
| `react` | 19.1.0 | React library |
| `expo-router` | ~6.0.23 | File-based navigation |
| `expo-secure-store` | ~15.0.8 | Encrypted key-value storage |
| `expo-local-authentication` | ~17.0.8 | Biometric / Face ID |
| `expo-localization` | ~17.0.8 | Device locale detection |
| `@apollo/client` | ^4.1.4 | GraphQL client |
| `zustand` | ^5.0.11 | State management |
| `nativewind` | ^4.2.1 | Tailwind CSS for React Native |
| `react-i18next` | ^16.5.4 | i18n / translations |
| `react-native-maps` | 1.20.1 | Map rendering |
| `lucide-react-native` | ^0.564.0 | Icon set |

---

## CI with GitHub Actions

**File:** `.github/workflows/ci.yml`

Runs on every PR and push to `main` / `develop`:

1. Install dependencies (`npm ci`)
2. TypeScript type check (`tsc --noEmit`)
3. Jest test suite (`npm test`)

EAS builds and store submissions are triggered manually via the EAS CLI — not automated.

---

## EAS Build Profiles

**File:** `eas.json`

| Profile | Distribution | Environment | Android output |
|---|---|---|---|
| `development` | Internal | development (local IP) | APK (debug) |
| `preview` | Internal | qa | APK |
| `production` | Store | production | AAB (release) |

All profiles extend a `base` config that sets Node 22 and a shared cache key.

`autoIncrement: true` on the production profile lets EAS manage build numbers automatically so you don't have to bump them manually before every release.

---

## New Architecture

The app runs with React Native's **New Architecture** enabled (`newArchEnabled: true`). This activates:

- **JSI (JavaScript Interface)** — synchronous native module calls
- **Fabric** — new concurrent rendering engine
- **TurboModules** — lazy-loaded native modules

All dependencies must be compatible with the New Architecture. Verify compatibility when adding new native packages.

---

## Assets

| Asset | Path |
|---|---|
| App icon | `assets/images/logo.png` |
| Splash screen | `assets/images/logo.png` |
| Adaptive icon (Android) | `assets/images/logo.png` |
| Favicon (Web) | `assets/images/logo.png` |

The splash background color is `#ffffff` (white).
