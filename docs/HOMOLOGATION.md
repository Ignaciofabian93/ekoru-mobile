# Homologating ekoru-mobile to the ekoru-web-app architecture

**Goal:** make `ekoru-mobile` mirror `ekoru-web-app`'s **feature-first architecture**
and share its **logic layer** (GraphQL operations, hooks, types, i18n content),
while keeping the parts that *must* differ on a native platform: **components,
styles, routing, and the data-loading seams**.

> The web app's own architecture rules live in
> [`ekoru-web-app/docs/ARCHITECTURE.md`](../../ekoru-web-app/docs/ARCHITECTURE.md).
> This document is the mobile-side translation of those rules.

Both apps talk to the **same federated GraphQL gateway** and the same REST auth /
image endpoints. So the data contract is identical — only the runtime differs
(Next.js React Server Components vs. Expo React Native). The web app's most
distinctive traits (async server-component screens, `DictionaryProvider`, Next.js
API routes) **cannot exist in React Native**, so we keep mobile's already-correct
native equivalents and homologate everything above them.

---

## 1. The golden rule

For every feature, three things must match the web app:

1. **Folder structure** — `features/<name>/{screens,ui,hooks,i18n,types.ts,constants}`.
2. **Shared logic** — GraphQL ops, hooks (same queries, same shape), and types are
   **copied from web** and only have their platform dependencies swapped.
3. **i18n content** — same namespaces, same keys, same translation copy.

What is *allowed* to differ (and must, on RN):

- **UI components & styles** — rebuilt with React Native primitives +
  `StyleSheet.create` + `@/design/tokens`.
- **Routing** — expo-router file routes instead of Next.js `app/[lang]`.
- **Data-loading seams** — Apollo provider, i18next, secure-store auth, REST image
  upload (all already wired natively).

---

## 2. What copies verbatim vs. what adapts

| Layer | Web source | Mobile treatment |
| --- | --- | --- |
| `graphql/<domain>/{queries,fragments,mutations}.ts` | source of truth | **Copy verbatim.** Same gateway → identical operations. Mobile's current graphql is a stale partial fork; bring it to parity. |
| `features/<name>/types.ts` | source of truth | **Copy.** Re-point `@/types/*` imports (mobile has the same `types/` layer). |
| `features/<name>/hooks/use*.ts` | source of truth | **Copy the data logic**, swap deps: navigation, toast, i18n, session (see §4). Same query, same returned shape. |
| `features/<name>/i18n/locales/*.json` | source of truth | **Copy the content** (same keys/copy). File names normalize to `en/es/fr.json`. |
| `store/`, `utils/`, `types/`, `constants/` | shared logic | Already largely present in mobile; sync any diverged/missing pieces. |
| `features/<name>/screens/*.tsx` | reference for structure & copy keys | **Rebuild** as RN client components (§4). |
| `features/<name>/ui/*.tsx` | reference for structure & copy keys | **Rebuild** with RN primitives + StyleSheet (§4, §6). |
| `app/**` routes | reference for the route graph | **Rebuild** as expo-router files (§5). |

---

## 3. Web → Mobile equivalents

| Concern | Web (Next.js RSC) | Mobile (Expo RN) |
| --- | --- | --- |
| Screen component | `async function X({ lang })`, `await getXDictionary(lang)`, `<DictionaryProvider>` | plain client component; `useTranslation(NAMESPACE)`; `import "../i18n"` for its bundle |
| i18n system | bespoke async loaders + `NestedKeyOf` + `DictionaryProvider` | **i18next / react-i18next** (`addResourceBundle` + `useTranslation`) |
| Current language | `[lang]` route param | `i18n.language` (`useTranslation().i18n.language`) / `appLanguage` |
| Markup primitives | `div`, `span`, `p`, `img`, `a`, `button` | `View`, `Text`, `Image`, `Pressable`, `ScrollView`, `FlatList` |
| Styling | Tailwind `className` | `StyleSheet.create` + `@/design/tokens` (see §6) |
| Navigation | `useNavigation` / `next/link` / `useRouter` | `useAppRouter` (`@/hooks/useAppRouter`) / expo-router `Link` |
| Route params | `useParams` / `useSearchParams` | expo-router `useLocalSearchParams` |
| Toasts | `useToast` | `showSuccess` / `showError` / `showInfo` (`@/lib/toast`) |
| Auth session | httpOnly cookie via Next API routes | JWT in **expo-secure-store**; `useAuthStore.setSession(token, seller, refresh)` |
| REST calls (login, image upload) | `lib/api/*` (server) | `@/api/*` (client, axios) |
| Apollo client | `ApolloWrapper` (RSC) | single client in `lib/apollo.ts`, `<ApolloProvider>` in `app/_layout.tsx` |
| Images | `next/image` | RN `Image` / `expo-image`; remote URLs via `@/utils/getImageUrl` |
| Icons | lucide-react | **lucide-react-native** |
| Logging | console | `@/lib/logger` |

---

## 4. Rebuilding a screen (the pattern)

Web screen (RSC): resolves `lang`, `await`s a dictionary, wraps children in a
`DictionaryProvider`. **Mobile has no RSC**, so:

```tsx
// features/<name>/screens/<Name>.tsx
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import "../i18n";                 // registers this feature's i18next bundle
import { NAMESPACE } from "../i18n";

export default function Name() {
  const { t } = useTranslation(NAMESPACE);
  // ...render with RN primitives; data via feature hooks
}
```

Hook adaptation — keep the GraphQL call identical, swap the platform deps:

```tsx
// web:    const { replace } = useNavigation(); const toast = useToast();
// mobile: const { replace } = useAppRouter(); import { showError } from "@/lib/toast";
// web:    const params = useParams<{ lang }>(); const lang = params.lang;
// mobile: const { i18n } = useTranslation(); const lang = i18n.language.toUpperCase(); // "ES"|"EN"|"FR"
```

Everything else in the hook (the `useQuery`/`useMutation`/`useLazyQuery`, the
variables, the returned shape) is copied from web unchanged.

---

## 5. Routing

Web: `app/[lang]/(group)/segment/page.tsx` → renders `features/<name>/screens/X`.
Mobile: `app/(group)/segment.tsx` → renders the same screen. Route files stay thin
(import + render the feature screen), exactly like web pages. No `[lang]` segment —
language is global via i18next. Dynamic segments use expo-router `[id].tsx` and
`useLocalSearchParams`.

---

## 6. Styling standard

**Use `StyleSheet.create` + `@/design/tokens`. Do not use NativeWind `className`.**
The codebase has already standardized on this (87 feature files use StyleSheet, 0
use `className`). NativeWind is installed but unused in feature code — treat it as
not present. Pull every color, spacing, radius, font, and shadow from
`@/design/tokens` (`colors`, `spacing`, `fontFamily`, `fontSize`, `borderRadius`,
`shadows`, …) rather than hardcoding values.

---

## 7. Naming & structure standard (matches web)

| Path | Rule |
| --- | --- |
| `features/<name>/` and subfolders | lowercase / kebab-case |
| `features/**/screens/*.tsx`, `features/**/ui/*.tsx` | PascalCase; **no `Screen` suffix** (`Login.tsx`, not `LoginScreen.tsx`) |
| `features/**/hooks/*` | camelCase `use*`, `.ts` (only `.tsx` if it renders JSX) |
| `features/**/i18n/locales/*.json` | `en.json`, `es.json`, `fr.json` — **no region suffixes** (`es-CL`, etc.) |
| `features/**/types.ts` | single file (add `types/` folder only if it grows large) |
| `ui/` | **flat** — no `ui/header/`, `ui/layout/`, `ui/skeletons/` nesting (match web) |
| `components/<Group>/<Name>/` | **Grouped** like web: `Primitives/`, `Patterns/`, `Layout/`, `Overlays/`, `Feedback/`, `Navigation/`, `Cards/`, `Drawer/`. PascalCase group + component (e.g., `components/Primitives/Text/Text.tsx`) |

Delete `features/**/data/dummy*.ts` — screens must render **live GraphQL data**,
never fixtures.

---

## 8. Per-feature homologation checklist

1. **graphql**: bring `graphql/<domain>/*` to parity with web (copy missing ops,
   enrich thin ones). Additive and safe — do first.
2. **types**: copy `features/<name>/types.ts` from web; re-point `@/types/*`.
3. **hooks**: port each `use*` hook; swap nav/toast/i18n/session deps only.
4. **i18n**: normalize locale filenames to `en/es/fr.json`; sync keys/copy with web;
   `i18n/index.ts` registers the bundle via `addResourceBundle`.
5. **screens + ui**: rebuild with RN primitives + StyleSheet + tokens; flatten `ui/`;
   delete dummy data.
6. **routes**: wire/verify expo-router files render the screens.
7. **verify**: `npm run typecheck` and `npm run lint` stay green (baseline is green).

---

## 9. Feature sequence & status

Order: shared graphql/types parity per domain → features in dependency order.

| Feature | Status | Notes |
| --- | --- | --- |
| marketplace | ✅ done | live GraphQL end-to-end (list/dept/deptCat/prodCat/detail), server-side filters/pagination, killed dummy usage; `ProductScreen` live via `GET_PRODUCT_BY_ID`. Deferred: `data/dummy*` + old `types/` folder kept (still imported by home/stores/publish/StoreCard); nested `ui/{header,layout,skeletons}` not yet flattened; stores category screens show an honest empty placeholder until stores is homologated. |
| home | 🟡 partial | `ProductsHighlight` + `UsedProductsSection` now live via marketplace `useProducts` (most-viewed / newest); deleted the big inline dummy array + the empty `useMarketplaceProducts` hook. Deferred: `StoresHighlight` (needs live stores — see stores row); the hardcoded English strings in `MainScreen`/highlights → home i18n bundle. |
| product | ✅ functional | Detail screen is live via `GET_PRODUCT_BY_ID` (currently in `marketplace/screens/ProductScreen`). Deferred: relocate to `features/product` + web's richer ui (exchange proposal, other-from-seller, propose-exchange). |
| seller | ✅ done | Built the live storefront from empty: `features/seller` (i18n + `useSellerStorefront` via `GET_SELLER_STOREFRONT` + `Seller` screen with header + product grid); wired `app/seller/[id]` (was an empty stub rendering nothing). Green. Deferred: web's richer seller ui (stats/about/business-info). |
| stores | ✅ done | Rebuilt to web's category-based store-products model: `getStoreCatalog` + `getStoreCategory/SubCategoryProductsBySlug`, state-only `useStoreProductFilters`, `StoreProductGrid`/`StoreProductCard`, `StoreCategoryList`. Deleted the whole dummy cluster (`dummyStores`, `types/Store`, `useStore`/`useStores`/old `useStoreFilters`, `StoreGrid`, `FeaturedStoresSection`, shared `StoreCard`). Home `StoresHighlight` now shows live store categories. Typecheck+lint green. Deferred: store-product **detail** screen (grid cards are non-navigating until the `store-product` feature exists). |
| ~~stores (old row)~~ | | | **Model divergence, not just dummy.** Mobile browses *individual stores* (`useStore`/`useStores` are pure dummy stubs — they don't query), but the gateway only exposes `getStoreCatalog` (category taxonomy) + store products *by category* — the web model. Homologating = adopting web's **category-based store-products** model (`useStoreCatalog`, `useProductsByStoreCategory/SubCategory`, `useStoreFilters`, `StoreProductGrid`) — a full rebuild on the scale of marketplace. Also finishes: home `StoresHighlight`, the two `StoreCategoryScreen`/`StoreSubcategoryScreen` empty placeholders left by the marketplace pass, and `StoreCard`/`StoreGrid`. |
| store-product | ⬜ **missing** | not present on mobile yet |
| services | ✅ done | Was an **inline fake-data screen written in the route file** (`SERVICE_CATEGORIES`/`FEATURED_SERVICES` hardcoded). Rebuilt to web's model: `graphql/services` at parity, `features/services` (types + `useServicesCatalog`/`useServicesByCategory`/`useServicesBySubcategory` + `ServiceList`/`ServiceCategoryList` + `Services`/`ServiceCategory`/`ServiceSubcategory` screens + i18n), thin routes + 2 new drill-down routes. Live data. Green. |
| cart | ⬜ | checkout + confirmation |
| profile | ⬜ | large; web-canonical reference |
| publish | ⬜ | multi-step create |
| recycle | ⬜ | |
| community | ✅ done | Was an inline fake-data route (`POSTS`/`EVENTS` feed hardcoded). The community graphql is **taxonomy-only** (no live post/event queries), so — consistent with the stores decision — rebuilt to web's taxonomy browser: `graphql/community` parity, `features/community` (types + `useCommunityCatalog`/`useCommunityCategory`/`useCommunitySubcategory` + `CommunityList` + `Community`/`CommunityCategory`/`CommunitySubcategory` + i18n), thin routes + 2 new. Live data. Green. The rich post/event feed is **deferred** (needs backend post queries) — shown as a "coming soon" note. |
| blog | ✅ done | Was an inline fake-data route (`FEATURED_POST`/`POSTS` hardcoded). Rebuilt to web's model: `graphql/blog` parity, `features/blog` (types + `useBlogCatalog`/`useBlogPosts`/`useBlogPost` + `BlogCategoryList`/`BlogPostCard` + `Blog`/`BlogCategory`/`BlogPost` screens + i18n), thin routes + 2 new drill-down routes. Live data. Green. (Post body rendered as plain text — rich/markdown render deferred.) |
| contact | ⬜ | form + mutation |
| legal | ⬜ | |
| tour | ⬜ | |
| deals | ✅ done | Built from scratch (missing on mobile): `features/deals` (types + `useDeals` [buyer/seller lists + reputation, polling] + `useDealActions` [accept/decline/confirm/cancel/dispute] + `DealCard` + `Deals` screen with buyer/seller tabs + i18n), `app/(deals)` route registered. Live + auth-gated. Deferred: evidence-photo on confirm (image-picker upload); propose flows are triggered from product pages, not here. |
| search | ✅ done | Built from scratch (missing on mobile): `features/search` (lean flat types + `useSearch` [federated products/store-products/services, market-scoped] + `SearchResultCard` + `Search` screen with live input + i18n), `app/(search)` route registered. Live. Deferred: debounce, store-product/service detail navigation (routes pending), market from location store (defaults to CL). |
| auth | 🟡 audit | already healthy; align naming (`LoginScreen`→`Login`), locale filenames, `.tsx`→`.ts` hooks, add `useLogout` |

Missing graphql domains to add: `checkout`, `deals`, `search`, `subscription`.

Legend: ⬜ todo · 🔧 in progress · 🟡 minor · ✅ done.

### Existing features — audit (no fake data found)
| Feature | Wiring | Status |
| --- | --- | --- |
| cart | zustand cart state (real, from live add-to-cart) | 🟡 functional; **checkout submission not wired** to `graphql/checkout` yet |
| contact | REST via `@/api/client` (`sendContactMessage`) | ✅ live |
| recycle | OpenStreetMap Overpass API (live external points) | ✅ live |
| legal | static terms/policies | ✅ correct (no data) |
| profile | GraphQL (10 query/mutation files across 102) | ✅ substantially live; consistency audit deferred |
| publish | GraphQL submit mutation (`usePublishProduct`) | ✅ live; still imports old `marketplace/types/` (CategoryStep) |

**Every `data/dummy*` file is deleted and every inline-fake screen (services/blog/community) is rebuilt on live data. No fabricated data remains in the app.**

### Still to build (smaller / polish)
- ✅ ~~deals~~ (built) · ✅ ~~search~~ (built)
- **store-product detail** screen (store-product grid cards + search STORE_PRODUCT hits are non-navigating until then).
- **tour** — empty feature folder (onboarding); no route.
- Wire **cart checkout** to `graphql/checkout` + webpay.
- **home i18n** bundle (hardcoded English in `MainScreen`), **auth** naming/locale-filename audit.
- Final cleanup: converge shared `types/product.ts`; delete old `marketplace/types/` folder (last consumer: `publish/CategoryStep`); lint-debt pass (`no-explicit-any` etc.).

---

## 10. Notes & gotchas

### Shared types: additive-first, converge per-feature
The shared `types/product.ts` is **deeply diverged** from web (mobile has
`hasOffer`/`offerPrice`, `id: number`, `Department.departmentName`,
`ProductCategory.productCategoryName`; web uses `isLiked`, `viewCount`,
`soldAt`/`soldVia`, `__typename`, and a `translation`-based Department/Category
shape). Swapping the shared types wholesale would cascade type errors across
**every** feature at once, breaking the green-at-each-boundary rule.

So shared-type homologation is **additive-first**:
- When a feature's rebuilt code needs a field the shared type lacks, add it as an
  **optional** field (`isLiked?`, `viewCount?`, …). Optional additions don't break
  existing consumers.
- Fully converge a shared type to web's shape only once **all** its consumers have
  been rebuilt — as its own dedicated milestone, not a side effect of one feature.

GraphQL files are exempt from this caution: gql documents are untyped
`DocumentNode`s, so bringing `graphql/**` to web parity never breaks typecheck.
Do it freely and first.

### Components are grouped like web (done)
`components/` was flattened PascalCase folders; now grouped into the web app's
categories: **Primitives** (Button, Text, Title, Input, Select, Checkbox, TextArea,
Links, DatePicker), **Patterns** (AdBanner, Banner, Breadcrumbs, HeroCarousel,
Pagination, PaymentCard, SearchBar, UploadImageCard, BiometricGate), **Overlays**
(Modal, LocationConfirmModal, EnvironmentalImpactModal), **Feedback** (ErrorScreen,
Toast), **Navigation** (Header, SubHeader, TabBar), **Cards** (MarketplaceCard),
**Layout** (Container/ScreenContainer/ScreenLayout — moved from the old top-level
`ui/`), **Drawer**. All ~348 import sites rewritten to `@/components/<Group>/<Name>/…`.
New components go in the matching group. Typecheck green.

**Pre-existing lint debt** (not from the migration): scattered `no-explicit-any`,
`no-non-null-assertion`, and `react-hooks/exhaustive-deps` warnings across some
components/features mean `npm run lint` (`--max-warnings=0`) was already failing
before this work. A dedicated lint-cleanup pass is its own task.

### Typed routes: new expo-router routes need a bridge cast
Expo Router generates the typed-route union from `app/**` on `expo start`/`expo export`.
When you add a **new** route file, `tsc` won't know it until typegen re-runs, so
`router.push({ pathname: "/(new)/route", … })` fails to typecheck. Bridge it with
`as unknown as Href` (import `type Href` from `expo-router`). Once the dev runs
`expo start`, the route enters the union and the cast can be dropped. Rewriting an
**existing** route's content needs no cast.

### Leftover git worktree
`ekoru-mobile/.claude/worktrees/keen-wright-03dfd1/` is a full repo copy from a
prior agent session. **Exclude it** from greps/searches (`grep -v worktrees`) and
ignore it in typecheck output — it is not part of the app and editing it does
nothing. Consider removing it once confirmed unneeded.
