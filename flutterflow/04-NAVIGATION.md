# 04 — Navigation and Role Gating

The React app's rule is: **roles are config, not conditionals.** `src/config/roles.js` is the single
source of truth for who each user is, where they land, what nav they see, and what they can do.
That file ports to `custom-code/custom-functions/roleConfig.dart`, and this document describes how
FlutterFlow consumes it.

Adding a page means adding it here **and** to the route table. Never write a role comparison inline
in a page.

## Route table

FlutterFlow route names are the page names; the URL path matters for the web build. Keep the paths
identical to the React app so existing links, QR codes and the pitch deck's screenshots stay valid.

| Path | Page | Allowed | Notes |
|---|---|---|---|
| `/` | `SplashRouter` | everyone | Decides where to send you; renders a loader, never UI |
| `/login` | `LoginPage` | signed out | |
| **Vendor** | | | |
| `/home` | `VendorHome` | vendor, **guest** | |
| `/deals` | `DealsPage` | vendor, **guest** | |
| `/cart` | `CartPage` | vendor | |
| `/orders` | `OrdersPage` | vendor | |
| `/dashboard` | `VendorDashboard` | vendor | |
| `/karigar-connect` | `KarigarConnect` | vendor | Vendor's hiring view |
| `/vendor-exchange` | `VendorExchange` | vendor | |
| `/virasaat` | `VirasaatPage` | vendor | |
| `/khau-galli` | `KhauGalliLive` | vendor, **guest** | |
| **Karigar** | | | |
| `/karigar/find-work` | `FindWork` | karigar | |
| `/karigar/my-work` | `MyWork` | karigar | |
| `/karigar/earnings` | `Earnings` | karigar | |
| `/karigar/messages` | `Messages` | karigar | |
| **Supplier** | | | |
| `/supplier` | `SupplierOverview` | supplier | |
| `/supplier/orders` | `SupplierOrders` | supplier | |
| `/supplier/inventory` | `SupplierInventory` | supplier | |
| `/supplier/deliveries` | `SupplierDeliveries` | supplier | |
| **Shared** | | | |
| `/profile` | `ProfilePage` | all signed-in | |
| `*` | `NotFoundPage` | everyone | |

### One canonical URL per page

The React app keeps `/vendor-dashboard`, `/deal-discovery-shopping`, `/shopping-cart-checkout`,
`/order-tracking-history` and `/supplier-dashboard` alive **only as redirects**. In FlutterFlow, do
not create pages for them at all. If an old link must keep working on web, add them as route
aliases under Settings → Navigation that push-replace to the canonical page.

Two routes rendering the same page is how the React app got into trouble in the first place: the two
copies drift, and a fix lands on only one of them.

## `SplashRouter`

`/` is not a page anyone looks at. It is the decision point.

**On Page Load action chain:**

1. If **not** logged in and `isGuest` is false → Navigate to `/login` (replace route).
2. If `isGuest` is true → Navigate to `/home` (replace route).
3. Read the current user's `users` document.
4. If the document does not exist, or `role` is empty → Navigate to `/login` with a
   `needsRegistration = true` parameter. This is a real state: Firebase Auth succeeded but the
   profile was never completed, and dropping such a user on a vendor home shows them an app they
   have no account for.
5. Set App State `userRole` from the document.
6. Navigate (replace route) to `homeRouteForRole(userRole)`.

Body: a centred `CircularProgressIndicator` in `terracotta` on a `paper` background. Nothing else —
any content here flashes on every cold start.

**Use "Replace Route", not "Navigate To".** Otherwise the Android back button from a role's home
returns to the splash, which re-runs the chain and looks like the app is stuck.

## Route guards

FlutterFlow has no route-guard concept, so the guard is a page-level action. Build it once as a
**Custom Action** and add it as the first On Page Load action of every gated page.

`custom-code/custom-actions/guardRoute.dart` — takes `allowedRoles` (List\<String\>) and
`allowGuest` (Boolean), and:

- signed-out and not guest → stores the current path in App State `pendingRoute`, goes to `/login`
- guest on a route without `allowGuest` → goes to `/login`
- signed-in user on **another role's** route → goes to their own home, **not** an error page

That last one matters. A karigar who taps a stale link to `/cart` has not done anything wrong; they
should land on their own find-work screen, not a "403" that reads like an accusation. The same rule
makes the role-specific PWA shortcuts safe: a vendor tapping "Find work" gets sent home.

Guard parameters per page are exactly the "Allowed" column of the route table.

## Navigation bars

**Do not use FlutterFlow's global NavBar.** It renders one item set for the whole app, and these are
three different apps sharing a shell — a karigar must never see "Cart".

Build `AppNavBar` as a **component** (see [09-COMPONENTS.md](09-COMPONENTS.md)) that reads
`userRole` and renders from `navItemsForRole()`. Place it in each page's `bottomNavigationBar` slot
with the current index passed in.

### Items per role

Deliberately short lists. A karigar's app really is four screens; padding it out with vendor tools
is what made the shared header confusing in the first place.

**Vendor** — six items, which is one over Material's comfortable maximum, so use a scrollable or
compact bar:

| Label | Icon | Route |
|---|---|---|
| Home | `home_outlined` | `/home` |
| Deals | `sell_outlined` | `/deals` |
| Hire | `handyman` | `/karigar-connect` |
| Exchange | `swap_horiz` | `/vendor-exchange` |
| Virasaat | `workspace_premium` | `/virasaat` |
| Dashboard | `bar_chart` | `/dashboard` |

Cart is **not** in the nav — it is the floating button. Orders, Khau Galli and Profile are reached
from the header and home screen.

**Karigar:**

| Label | Icon | Route |
|---|---|---|
| Find work | `search` | `/karigar/find-work` |
| My work | `receipt_long` | `/karigar/my-work` |
| Earnings | `currency_rupee` | `/karigar/earnings` |
| Messages | `chat_bubble_outline` | `/karigar/messages` |

**Supplier:**

| Label | Icon | Route |
|---|---|---|
| Overview | `dashboard_outlined` | `/supplier` |
| Orders | `receipt_long` | `/supplier/orders` |
| Inventory | `inventory_2_outlined` | `/supplier/inventory` |
| Deliveries | `local_shipping` | `/supplier/deliveries` |

**Guest:**

| Label | Icon | Route |
|---|---|---|
| Home | `home_outlined` | `/home` |
| Khau Galli | `place_outlined` | `/khau-galli` |
| Deals | `sell_outlined` | `/deals` |

Selected item: `terracotta`. Unselected: `inkMedium`. Bar background `paperLight` with a `1px`
`paperDark` top border, elevation `0`.

## Capabilities

Prefer a capability check over a role comparison at the call site — it keeps role logic out of the
widget tree and reads better.

| Role | Capabilities |
|---|---|
| vendor | `cart`, `buy`, `hire`, `trade`, `sell-food`, `vyapaar-score` |
| karigar | `work`, `hunar-profile` |
| supplier | `fulfil`, `inventory`, `wholesale-analytics` |
| guest | `browse` |

`can(role, capability)` lives in `roleConfig.dart`. Use it for conditional visibility — the floating
cart button is visible when `can(userRole, 'cart')`, not when `userRole == 'vendor'`. When a fourth
role or a trial capability appears, one table changes instead of thirty widgets.

## Deep links / PWA shortcuts

Web build → Settings → Web → PWA shortcuts, mirroring `public/manifest.json`:

| Name | URL |
|---|---|
| Find work | `/karigar/find-work` |
| Post a gig | `/karigar-connect` |
| Deals | `/deals` |
| Khau Galli | `/khau-galli` |

These are role-specific on purpose, and the route guard handles the mismatch. That is correct
behaviour, not a bug to design around in the manifest.
