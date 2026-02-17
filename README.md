# ekoru-mobile

<div align="center">
  <p><strong>React Native mobile app for Ekoru — Chile's sustainable marketplace</strong></p>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg)](https://expo.dev/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo%20Client-E10098.svg)](https://www.apollographql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Overview

Mobile client for the [Ekoru](https://ekoru.cl) platform — a sustainable marketplace where users can buy, sell and exchange second-hand and recycled products, tracking the environmental impact of every transaction.

This app connects to Ekoru's GraphQL Federation backend built with NestJS microservices, sharing the same design language as the web platform through shared design tokens with [`ekoru-ui`](https://github.com/your-org/ekoru-ui).

---

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | React Native + Expo SDK 54          |
| Language         | TypeScript (strict)                 |
| Data fetching    | Apollo Client 3 + GraphQL           |
| Navigation       | Expo Router (file-based)            |
| Styling          | NativeWind (Tailwind for RN)        |
| State management | Apollo cache + Zustand              |
| Auth             | JWT via Apollo auth link            |
| Notifications    | Expo Notifications                  |
| Testing          | Jest + React Native Testing Library |

---

## Architecture

```
ekoru-mobile/
├── app/                        # Expo Router — file-based navigation
│   ├── (auth)/                 # Auth screens (login, register)
│   ├── (tabs)/                 # Main tab navigator
│   │   ├── index.tsx           # Home / feed
│   │   ├── explore.tsx         # Product search & browse
│   │   ├── sell.tsx            # Create listing
│   │   ├── impact.tsx          # Environmental impact dashboard
│   │   └── profile.tsx         # User profile
│   └── product/[id].tsx        # Product detail
│
├── components/                 # Shared UI components (RN-specific)
│   ├── ui/                     # Base components (Button, Input, Card...)
│   ├── product/                # Product-specific components
│   └── impact/                 # Environmental impact widgets
│
├── lib/
│   ├── apollo/                 # Apollo Client setup + auth link
│   ├── graphql/                # Generated types + query/mutation files
│   └── hooks/                  # Custom hooks
│
├── tokens/                     # Design tokens (shared with ekoru-ui)
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
│
└── types/                      # Global TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 15+ / macOS
- Android: Android Studio + emulator, or physical device with Expo Go

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/ekoru-mobile.git
cd ekoru-mobile

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# .env.local
EXPO_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_ENV=development
```

### Running the App

```bash
# Start Expo dev server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on web (for testing)
pnpm web
```

---

## GraphQL

This app connects to Ekoru's Apollo Federation gateway which composes the following subgraphs:

| Subgraph        | Responsibility                      |
| --------------- | ----------------------------------- |
| `users`         | Auth, profiles, sessions            |
| `products`      | Listings, categories, search        |
| `transactions`  | Purchases, exchanges, payments      |
| `notifications` | Push notifications, in-app alerts   |
| `impact`        | Environmental metrics, CO₂ tracking |

## Scripts

```bash
npm start          # Start Expo dev server
npm ios            # Run on iOS simulator
npm android        # Run on Android emulator
npm test           # Run tests with Jest
npm test:watch     # Run tests in watch mode
npm lint           # ESLint
npm typecheck      # TypeScript type check
```

---

## Related Repos

[`ekoru-web`](https://github.com/Ignaciofabian93/app) | Next.js web marketplace

---

## Contributing

This is a private project. For questions or contributions, contact the Ekoru engineering team.

---

## License

MIT — see [LICENSE](LICENSE) for details.
