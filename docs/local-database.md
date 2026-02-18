# Local Database (expo-sqlite)

## Overview

The app uses `expo-sqlite` to cache server data locally for offline access and faster loading. The database acts as a **read cache** — the server (GraphQL API) remains the source of truth. Data flows: **Server → GraphQL → Local DB → UI**.

## Architecture

```
lib/database.ts    → DB connection, migrations, schema
lib/repository.ts  → Types, CRUD operations, cache helpers
```

### Initialization

`getDatabase()` is called once in `app/_layout.tsx` during app startup, before the splash screen hides. It:

1. Opens (or creates) `ekoru.db`
2. Enables **WAL mode** for concurrent read/write performance
3. Enables **foreign keys** enforcement
4. Runs pending migrations via the `_migrations` version table

### Migration System

Migrations are version-based. Each migration has a `version` number and a `sql` string. On startup, the system checks the highest applied version and runs any newer migrations sequentially.

To add a new migration: append to the `migrations` array in `database.ts` with `version: 2` (or next number). Never modify an already-shipped migration — always create a new one.

```ts
// database.ts
const migrations: Migration[] = [
  { version: 1, sql: `...` },   // existing
  { version: 2, sql: `...` },   // new changes go here
];
```

## Schema (v1)

### Tables by Domain

| Domain | Tables | Translation Tables |
|--------|--------|--------------------|
| Geography | `country`, `country_config`, `region`, `city`, `county` | — |
| Sellers | `seller`, `person_profile`, `business_profile`, `seller_preferences` | — |
| Gamification | `seller_level`, `seller_label`, `seller_achieved_label` | — |
| Marketplace | `department`, `department_category`, `product_category`, `product` | `department_translation`, `department_category_translation`, `product_category_translation` |
| Store | `store_category`, `store_sub_category`, `store_product`, `product_variant` | `store_category_translation`, `store_sub_category_translation` |
| Services | `service_category`, `service_sub_category`, `service` | `service_category_translation`, `service_sub_category_translation` |
| Orders | `order`, `order_item` | — |
| Notifications | `notification` | — |
| Chat | `chat`, `message` | — |
| Environmental | `material_impact_estimate`, `product_category_material` | `material_impact_estimate_translation` |
| Blog | `blog_category`, `blog_post` | `blog_category_translation`, `blog_post_translation` |
| Util | `key_value` | — |

### Key Design Decisions

- **Booleans** are stored as `INTEGER` (0/1) — SQLite has no boolean type
- **JSON fields** (images, badges, social_media_links, etc.) are stored as `TEXT` — parse with `JSON.parse()` when reading
- **Dates** are stored as `TEXT` in ISO format
- **synced_at** columns track when a row was last synced from the server
- **Translation tables** use `UNIQUE(entity_id, language)` constraints for i18n support
- `"order"` table name is quoted because `ORDER` is a SQL reserved word

## Repository (lib/repository.ts)

### Pattern

Every entity follows the same pattern:

- **`upsert*(entity)`** — Insert or update (uses `ON CONFLICT ... DO UPDATE`)
- **`get*(id)`** — Fetch single row by ID
- **`get*ByX(foreignKey)`** — Fetch related rows with ordering and optional pagination

### Available Operations

| Domain | Functions |
|--------|-----------|
| Key-Value | `getValue`, `setValue`, `deleteValue` |
| Geography | `upsertCountry`, `upsertCountries`, `getCountries`, `upsertRegions`, `getRegionsByCountry`, `upsertCities`, `getCitiesByRegion`, `upsertCounties`, `getCountiesByCity` |
| Seller | `upsertSeller`, `getSeller`, `upsertPersonProfile`, `getPersonProfile`, `upsertBusinessProfile`, `getBusinessProfile`, `upsertSellerPreferences`, `getSellerPreferences`, `upsertSellerLevel` |
| Products | `upsertProduct`, `getProduct`, `getProductsBySeller`, `getProductsByCategory` |
| Store | `upsertStoreProduct`, `getStoreProduct`, `getStoreProductsBySeller`, `getStoreProductsByCategory` |
| Services | `upsertService`, `getService`, `getServicesBySeller` |
| Orders | `upsertOrder`, `getOrder`, `getOrdersBySeller`, `upsertOrderItem`, `getOrderItems` |
| Notifications | `upsertNotification`, `getNotifications`, `getUnreadNotificationCount`, `markNotificationRead`, `markAllNotificationsRead` |
| Chat | `upsertChat`, `getChatsBySeller`, `upsertMessage`, `getMessages` |
| Cache | `cacheCurrentUser` (transaction), `clearAllCache`, `clearSellerData` |

### Usage Example

```ts
import { cacheCurrentUser, getSeller, clearAllCache } from "@/lib/repository";

// After GraphQL `me` query, cache the full user
await cacheCurrentUser({
  seller: { id: "abc", email: "user@ekoru.org", seller_type: "PERSON", ... },
  personProfile: { id: "p1", seller_id: "abc", first_name: "Ignacio", ... },
  preferences: { ... },
  sellerLevel: { ... },
  country: { id: 1, country: "Chile" },
});

// Read from local cache
const seller = await getSeller("abc");

// On logout
await clearAllCache();
```

---

## What's Missing

### Repository Operations Not Yet Implemented

- **CountryConfig** — no `upsertCountryConfig` / `getCountryConfig` (table exists, no repo functions)
- **Seller Labels** — no CRUD for `seller_label` or `seller_achieved_label`
- **Departments & Categories** — no CRUD for `department`, `department_category`, `product_category` and their translation tables
- **Store Categories** — no CRUD for `store_category`, `store_sub_category` and their translation tables
- **Service Categories** — no CRUD for `service_category`, `service_sub_category` and their translation tables
- **Product Variants** — no CRUD for `product_variant`
- **Environmental Impact** — no CRUD for `material_impact_estimate`, `product_category_material` and their translations
- **Blog** — no CRUD for `blog_category`, `blog_post` and their translation tables
- **Bulk upserts** — only geography tables have bulk insert functions; products, store products, services, notifications, and messages need bulk upsert for efficient sync
- **Search/filter queries** — no full-text search, no product filtering by price/condition/brand, no store product search by tags

### Schema Gaps (vs Server Prisma)

These server tables were intentionally skipped but may be needed later:

- **Payments** — `transaction`, `payment_config`, `payment_provider`, `payment_webhook_log`
- **Reviews** — `product_review`, `store_product_review`, `service_review`
- **Favorites/Likes** — `product_like`, `store_product_like`, `service_like`, `seller_follower`
- **Addresses** — `shipping_address`, `billing_address`
- **Coupons/Discounts** — `coupon`, `discount`
- **Exchange system** — `exchange_request`, `exchange_offer`
- **Advertisements** — `ad`, `ad_impression`, `ad_click`
- **Community** — `community_post`, `community_comment`, `community_like`
- **Memberships** — `person_membership`, `business_membership` (referenced as FK but table not created)
- **Search analytics** — `search_log`, `popular_search`
- **Admin** — `admin_user`, `admin_log` (not needed on mobile)

### Sync Layer

There is no sync mechanism yet. Needs:

- **Sync service** — fetch from GraphQL, upsert into local DB, track last sync timestamps
- **Stale data detection** — compare `synced_at` to decide when to re-fetch
- **Conflict resolution** — strategy for when local and server data diverge (server wins recommended)
- **Incremental sync** — use `updated_at > lastSync` filter on GraphQL queries to avoid full re-fetches
- **Background sync** — periodic sync using `expo-background-fetch` or on app resume

### Other TODOs

- **Indexes** — no indexes beyond PKs and UNIQUE constraints; add for frequently queried columns (`seller_id`, `created_at`, `product_category_id`, `sub_category_id`)
- **DB size management** — no strategy for pruning old data (old messages, expired notifications)
- **Error handling** — repository functions don't handle DB errors gracefully; callers get raw exceptions
- **`clearSellerData`** uses string interpolation (SQL injection risk for internal use) — should use parameterized queries
- **Type safety** — `seller_type`, `condition`, `pricing_type`, `shipping_status` etc. are `string` instead of union types matching server enums
