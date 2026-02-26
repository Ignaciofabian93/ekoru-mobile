# Features

A high-level summary of all features in the EKORU mobile app. The app is a marketplace platform focused on sustainability, enabling sellers (individuals and businesses) to buy, sell, and track their environmental impact.

---

## Feature Map

```
features/
├── auth/          — Login & registration
├── profile/       — Account management
├── home/          — Main feed & publishing
├── marketplace/   — Product browsing
├── cart/          — Shopping cart
├── recycle/       — Recycling map
├── blog/          — Articles & education
├── community/     — Community interaction
├── services/      — Service listings
├── stores/        — Seller/store directory
└── tour/          — Onboarding
```

---

## Auth

Login and account creation screens.

- **Login** — Email and password form. Calls the auth store which will hit the GraphQL login mutation. On success, session is persisted to Secure Store.
- **Register** — Seller type selection (Person, Startup, Company) followed by a registration form. Calls `RegisterPerson` or `RegisterBusiness` mutation.

---

## Profile

Full user account management. This is the most developed feature currently.

| Screen | Description |
|---|---|
| `ProfileScreen` | Header with cover photo and avatar, seller info (name, email, type, plan), address details, seller level/points badge, and navigation to all sub-screens |
| `EditProfileScreen` | Form to update profile fields. Person: first name, last name, display name, bio. Business: business name, description, legal name, tax ID. Shared: phone, website |
| `ChangePasswordScreen` | Three-field form: current password, new password, confirm. Validates match before submitting |
| `SettingsScreen` | Four sections: Notifications, Language, Currency, About. Saves preferences via `UPDATE_SELLER_PREFERENCES` mutation |
| `OrderHistoryScreen` | FlatList of past orders with status badges (Delivered, Shipped, Processing, Cancelled) and totals |
| `FavoritesScreen` | Saved products list. Currently shows empty state with a browse CTA |
| `EnvironmentalImpactScreen` | Personal green stats: CO₂ saved, items recycled, water saved, equivalent trees. Data will come from API |
| `GuestScreen` | Shown when user is not authenticated. Lists platform perks and CTAs to sign up or sign in |
| `SubscriptionScreen` | Subscription plan display (Freemium, Basic, Advanced, Startup, Expert) |

**Sub-sections:**
- `ui/NotificationsSection` — Toggles for push, email, orders, community, security, weekly summary, 2FA
- `ui/LanguagesSection` — Language picker that switches i18n immediately and persists to API
- `ui/CurrencySection` — Currency preference picker

---

## Home

- **MainScreen** — Main feed of content and listings
- **PublishScreen** — Interface for sellers to create a new listing or post

---

## Marketplace

- **ProductScreen** — Product detail view with images, description, price, and add-to-cart action

Browsable product catalog with filtering and search (structure in place, detail screens being built).

---

## Cart

Shopping cart management:
- Add / remove items
- Update quantities
- View subtotal
- Checkout flow (in progress)

State managed in `useCartStore` (Zustand). No persistence — cart resets on app restart.

---

## Recycle

- **RecycleMapScreen** — Interactive map (via `react-native-maps`) showing nearby recycling collection points. Allows users to locate where to drop off recyclable items.

---

## Blog / Education

Article and educational content viewer. Covers sustainability topics, recycling guides, and eco tips. Content served from the API.

---

## Community

Community interaction features (structure in place). Intended for seller-to-seller and user-to-seller communication, forums, or group activity around sustainability initiatives.

---

## Services

Service marketplace listings. Similar to the product marketplace but for service-based sellers (e.g., repair, upcycling, consulting).

---

## Stores

Seller and store directory. Allows browsing verified seller profiles, their listings, ratings, and contact info.

---

## Tour / Onboarding

First-run onboarding flow that introduces the app's core concepts and guides new users through setup steps before landing on the main tabs.

---

## Seller Account Types

The app supports three seller types, each with a different profile shape:

| Type | Profile Fields |
|---|---|
| `PERSON` | firstName, lastName, displayName, bio, birthday |
| `STARTUP` | businessName, description, legalBusinessName, taxId, businessStartDate |
| `COMPANY` | Same as STARTUP plus: legalRepresentative, certifications, shippingPolicy, returnPolicy, serviceArea |

---

## Seller Levels

Sellers earn points through activity. Points determine their level:

| Level | Example Name |
|---|---|
| Entry | Eco Starter |
| Mid | Eco Warrior |
| Top | Eco Champion |

Level, badge icon, and point thresholds come from the API via `SellerLevelFields` fragment.

---

## Subscription Plans

| Plan | Notes |
|---|---|
| `FREEMIUM` | Default free tier |
| `BASIC` | Paid tier 1 |
| `ADVANCED` | Paid tier 2 |
| `STARTUP` | For startup accounts |
| `EXPERT` | Top tier |

Plan is displayed on the profile screen and controls feature access (details TBD).
