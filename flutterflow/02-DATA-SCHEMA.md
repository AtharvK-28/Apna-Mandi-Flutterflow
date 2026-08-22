# 02 — Firestore Schema

Create these in FlutterFlow (**Firestore → Collections**), not in the Firebase console. FlutterFlow
generates a Dart document class per collection, and a collection created outside FlutterFlow is
invisible to the widget tree until you re-declare it there anyway.

Types below are FlutterFlow's names: `String`, `Integer`, `Double`, `Boolean`, `Timestamp`,
`DocumentReference`, `LatLng`, `Image Path`, `Data Struct`, `List<...>`.

Field naming is `camelCase` throughout, matching the React models so the two stay diffable.

---

## Data types (structs)

Create under **Firestore → Data Types** first — collections below reference them.

### `CartItem`
| Field | Type | Notes |
|---|---|---|
| `dealRef` | DocumentReference → `deals` | |
| `name` | String | Denormalised so a deleted deal still renders in order history |
| `image` | Image Path | Denormalised for the same reason |
| `unit` | String | `kg`, `liter`, `dozen`, `bunches` |
| `unitPrice` | Double | Price **at time of adding**, not current price |
| `quantity` | Double | Double, not Integer — `2.5 kg` is a normal order |
| `supplierName` | String | |
| `supplierRef` | DocumentReference → `users` | |

Storing `unitPrice` on the item rather than reading it from `deals` at checkout is deliberate: a
supplier editing a price must not silently change what is already in someone's cart.

### `OrderItem`
Same fields as `CartItem` plus `lineTotal` (Double). An order is an immutable record — it never
re-derives its own total from live prices.

### `PoolItem`
| Field | Type |
|---|---|
| `name` | String |
| `quantity` | Double |
| `unit` | String |

### `ScoreFactor`
| Field | Type | Notes |
|---|---|---|
| `factorId` | String | `procurement`, `gigPayments`, `exchange`, `ratings`, `hygiene` |
| `earned` | Integer | |
| `detail` | String | Human-readable: `47 orders paid, steady weekly cycle` |
| `trend` | Integer | Signed month-over-month change |

### `RouteStop`
| Field | Type |
|---|---|
| `name` | String |
| `vendorRef` | DocumentReference → `users` |
| `location` | LatLng |
| `completed` | Boolean |

---

## `users`

One collection for all three roles. Splitting into `vendors`/`karigars`/`suppliers` looks tidier
but breaks the moment you need a chat between a vendor and a karigar — every message reference
would need to know which collection to point at.

**Document ID = Firebase Auth UID.**

| Field | Type | Notes |
|---|---|---|
| `uid` | String | |
| `phoneNumber` | String | E.164, `+919876543210` |
| `role` | String | `vendor` / `karigar` / `supplier`. Never null after registration |
| `displayName` | String | **Nullable.** There is no placeholder identity — an unnamed user is null and callers decide how to greet them |
| `photoUrl` | Image Path | |
| `createdAt` | Timestamp | |
| `language` | String | `en` / `hi` / `mr`, default `en` |
| `voiceEnabled` | Boolean | Default `false` — opt-in, see the privacy note in 08-PAGES-SHARED |
| `location` | LatLng | |
| `locationName` | String | `Dadar Station West` |
| `rating` | Double | Rolling average |
| `totalRatings` | Integer | |
| **Vendor only** | | |
| `stallName` | String | `Rajesh Juice Corner` |
| `cuisineType` | String | |
| `hygieneGrade` | String | `A` / `B` / `C` / null — Swachh badge |
| `hygieneAuditedAt` | Timestamp | |
| `vyapaarScore` | Integer | Cached; recomputed by `computeVyapaarScore` |
| `vyapaarFactors` | List\<ScoreFactor\> | |
| **Karigar only** | | |
| `skills` | List\<String\> | |
| `verifiedSkills` | List\<String\> | `Dosa Master`, `Wok Master` — awarded, not self-declared |
| `hourlyRate` | Double | |
| `availability` | String | `Flexible`, `Morning & Evening`, `Evening Only`, `All Day` |
| `bio` | String | |
| `totalGigs` | Integer | |
| `isOnline` | Boolean | |
| `age` | Integer | |
| **Supplier only** | | |
| `businessName` | String | |
| `gstNumber` | String | Optional — most small wholesalers are below the threshold |
| `isVerified` | Boolean | |
| `deliveryAreas` | List\<String\> | |

---

## `deals`

Supplier product listings — what vendors buy. Backs `/deals`.

| Field | Type | Notes |
|---|---|---|
| `name` | String | |
| `category` | String | `vegetables`, `fruits`, `dairy`, `spices`, `grains`, `oil`, `pulses`, `herbs`, `dry-fruits`, `beverages` |
| `price` | Double | Current price |
| `originalPrice` | Double | **Nullable** — null means "not on discount". Do not default it to `price`, or every card shows a struck-through identical number |
| `unit` | String | |
| `availableQuantity` | Double | |
| `supplierRef` | DocumentReference → `users` | |
| `supplierName` | String | Denormalised — avoids N reads to render a grid |
| `isVerified` | Boolean | |
| `rating` | Double | |
| `distanceKm` | Double | |
| `image` | Image Path | |
| `dealType` | String | `fresh-morning` / `end-of-day` / `bulk-discount` / `regular` |
| `expiresAt` | Timestamp | Nullable — only time-limited deal types have one |
| `minQuantity` | Double | Nullable — `bulk-discount` only |
| `description` | String | |
| `isActive` | Boolean | |

Categories are a fixed list of ten, not user-created. Keep them as an App State constant
(see [03-APP-STATE.md](03-APP-STATE.md)), not a Firestore collection — a collection read to render
ten static chips is a wasted round trip on a slow connection.

---

## `orders`

Vendor → supplier procurement orders. Backs `/orders` and the supplier's order views.

| Field | Type | Notes |
|---|---|---|
| `orderNumber` | String | `#ORD001` — display only, never a key |
| `vendorRef` | DocumentReference → `users` | |
| `vendorName` | String | Denormalised |
| `supplierRef` | DocumentReference → `users` | |
| `supplierName` | String | |
| `items` | List\<OrderItem\> | |
| `itemCount` | Integer | |
| `subtotal` | Double | |
| `deliveryFee` | Double | |
| `totalAmount` | Double | |
| `status` | String | `pending` / `confirmed` / `packed` / `out-for-delivery` / `delivered` / `cancelled` |
| `paymentMethod` | String | `cod` / `upi` |
| `paymentStatus` | String | `pending` / `paid` |
| `placedAt` | Timestamp | |
| `deliverySlot` | String | `Tomorrow, 6–8 AM` |
| `deliveredAt` | Timestamp | |
| `routeRef` | DocumentReference → `deliveryRoutes` | Nullable |
| `poolRef` | DocumentReference → `pools` | Nullable — set when the order was placed via a Mandi Pool |
| `rating` | Integer | Nullable until rated |

The status list is closed. Adding a status means updating `orderStatusLabel` in
`custom-code/custom-functions/` — do not introduce a status only some screens understand.

---

## `gigs`

Karigar Connect. Read by the vendor's hiring view **and** the karigar's job search — one collection,
two audiences.

| Field | Type | Notes |
|---|---|---|
| `title` | String | `Emergency Juice Stall Cover` |
| `vendorRef` | DocumentReference → `users` | |
| `vendorName` | String | |
| `vendorPhone` | String | |
| `vendorRating` | Double | |
| `vendorLocation` | String | |
| `location` | LatLng | |
| `gigType` | String | `emergency` / `prep` / `training` |
| `skills` | List\<String\> | |
| `description` | String | |
| `startAt` | Timestamp | **Timestamp, not the React app's `date`/`time` strings.** `"Today"` + `"5:00 PM - 10:00 PM"` cannot be sorted, filtered or compared, and goes stale the next day |
| `endAt` | Timestamp | |
| `durationHours` | Double | |
| `ratePerHour` | Double | |
| `totalPay` | Double | |
| `urgency` | String | `high` / `medium` / `low` |
| `applicantCount` | Integer | |
| `status` | String | `open` / `filled` / `completed` / `cancelled` |
| `assignedKarigarRef` | DocumentReference → `users` | Nullable |
| `postedAt` | Timestamp | |
| `image` | Image Path | |

### `gigs/{gigId}/applications` (subcollection)

| Field | Type | Notes |
|---|---|---|
| `karigarRef` | DocumentReference → `users` | |
| `karigarName` | String | |
| `karigarPhoto` | Image Path | |
| `karigarRating` | Double | |
| `message` | String | |
| `status` | String | `applied` / `accepted` / `rejected` / `withdrawn` |
| `appliedAt` | Timestamp | |

A subcollection, not an array on the gig: applications are written by a different user than the one
who owns the gig, and array-union writes cannot be secured per-element in Firestore rules.

---

## `shifts`

Completed work — backs the karigar's earnings view.

| Field | Type | Notes |
|---|---|---|
| `gigRef` | DocumentReference → `gigs` | |
| `karigarRef` | DocumentReference → `users` | |
| `vendorRef` | DocumentReference → `users` | |
| `title` | String | |
| `vendorName` | String | |
| `workedAt` | Timestamp | |
| `hours` | Double | |
| `pay` | Double | |
| `paymentStatus` | String | `pending` / `processing` / `paid` |
| `paidAt` | Timestamp | |
| `ratingFromVendor` | Integer | |
| `ratingFromKarigar` | Integer | |

---

## `chats` and `chats/{chatId}/messages`

`chats`:

| Field | Type | Notes |
|---|---|---|
| `participantRefs` | List\<DocumentReference → `users`\> | Exactly two |
| `participantNames` | List\<String\> | Same order — avoids two reads to render a list row |
| `gigRef` | DocumentReference → `gigs` | Nullable — the gig the conversation is about |
| `lastMessage` | String | |
| `lastMessageAt` | Timestamp | |
| `unreadCount` | Integer | |

`messages` subcollection:

| Field | Type |
|---|---|
| `senderRef` | DocumentReference → `users` |
| `text` | String |
| `sentAt` | Timestamp |
| `readAt` | Timestamp |

---

## `exchangeListings`

Vendor Exchange — surplus stock offered to nearby vendors, and urgent needs.

| Field | Type | Notes |
|---|---|---|
| `listingType` | String | `surplus` / `need`. One collection for both, because the Exchange screen shows them interleaved and a merged client-side sort of two streams is a needless complication |
| `item` | String | `Idli Batter` |
| `quantity` | Double | |
| `unit` | String | |
| `originalPrice` | Double | Nullable — `surplus` only |
| `askingPrice` | Double | Nullable — `surplus` only |
| `budget` | Double | Nullable — `need` has a budget, not a price |
| `condition` | String | `Fresh, good for 10 more hours` |
| `description` | String | |
| `vendorRef` | DocumentReference → `users` | |
| `vendorName` | String | |
| `vendorPhone` | String | |
| `vendorRating` | Double | |
| `location` | LatLng | |
| `locationName` | String | |
| `image` | Image Path | |
| `urgency` | String | `high` / `medium` / `low` |
| `acceptsBarter` | Boolean | |
| `status` | String | `open` / `matched` / `completed` / `expired` |
| `expiresAt` | Timestamp | Perishables genuinely expire — a listing without one turns the Exchange into a graveyard |
| `postedAt` | Timestamp | |

---

## `virasaatProducts`

Heritage commerce — a vendor's signature recipe as a licensable product.

| Field | Type | Notes |
|---|---|---|
| `name` | String | `Aunty's Schezwan Chutney` |
| `masterVendorRef` | DocumentReference → `users` | |
| `masterVendorName` | String | |
| `masterVendorStory` | String | The provenance narrative — this is the product, not decoration |
| `masterVendorRating` | Double | |
| `ingredientName` | String | `Schezwan Chutney` |
| `packageSize` | String | `500ml Bottle` |
| `yieldClaim` | String | `Makes 200 Schezwan Dosas` |
| `originalPrice` | Double | |
| `licensePrice` | Double | One-time |
| `subscriptionPrice` | Double | Monthly |
| `category` | String | `chutneys` / `masalas` / `pastes` / `blends` |
| `locationName` | String | |
| `image` | Image Path | |
| `description` | String | |
| `ingredients` | List\<String\> | Declared ingredients, not the secret ratio |
| `usage` | String | |
| `subscriberCount` | Integer | |
| `status` | String | `active` / `paused` |
| `createdAt` | Timestamp | |

`virasaatProducts/{id}/testimonials`: `vendorName` (String), `rating` (Integer),
`comment` (String), `createdAt` (Timestamp).

---

## `inventory`

Supplier stock.

| Field | Type | Notes |
|---|---|---|
| `supplierRef` | DocumentReference → `users` | |
| `productName` | String | |
| `category` | String | |
| `currentStock` | Double | |
| `minimumStock` | Double | Threshold for the low-stock alert |
| `unit` | String | |
| `costPrice` | Double | |
| `sellingPrice` | Double | |
| `expiryDate` | Timestamp | Nullable |
| `updatedAt` | Timestamp | |

Alerts are **derived, not stored**: an item is low-stock when `currentStock < minimumStock`, and
expiring when `expiryDate` is within 3 days. Storing an `alertType` field means it goes stale the
moment stock changes without the alert being recomputed.

---

## `pools`

Mandi Pools — several stalls buying together so one delivery serves all of them.

| Field | Type |
|---|---|
| `name` | String |
| `pickupPointRef` | DocumentReference → `pickupPoints` |
| `leadVendorRef` | DocumentReference → `users` |
| `memberRefs` | List\<DocumentReference → `users`\> |
| `vendorCount` | Integer |
| `items` | List\<PoolItem\> |
| `totalAmount` | Double |
| `targetVendorCount` | Integer |
| `status` | String — `forming` / `pending` / `confirmed` / `delivered` |
| `deliveryWindow` | String |
| `priority` | String — `high` / `medium` / `low` |
| `closesAt` | Timestamp |

## `pickupPoints`

`name` (String), `address` (String), `location` (LatLng), `status` (String: `active` /
`inactive`), `totalOrders` (Integer), `completedOrders` (Integer).

## `deliveryRoutes`

`supplierRef` (DocumentReference), `name` (String), `totalDistanceKm` (Double),
`estimatedMinutes` (Integer), `stops` (List\<RouteStop\>), `status` (String: `planned` /
`active` / `completed`), `scheduledFor` (Timestamp).

## `khauGalliStalls`

The guest-browsable food-street directory.

`stallName` (String), `vendorRef` (DocumentReference), `cuisineType` (String),
`signatureDish` (String), `location` (LatLng), `locationName` (String), `image` (Image Path),
`rating` (Double), `hygieneGrade` (String), `isOpenNow` (Boolean), `openHours` (String),
`priceRange` (String).

## `notifications`

`userRef` (DocumentReference), `type` (String: `orders` / `inventory` / `payment` / `gigs` /
`exchange`), `title` (String), `message` (String), `isRead` (Boolean), `priority` (String),
`actionRequired` (Boolean), `deepLink` (String), `createdAt` (Timestamp).

---

## Queries that need a composite index

Firestore will not run these without one, and the error only appears at runtime. They are
pre-declared in `firebase/firestore.indexes.json`, so deploy that file rather than waiting for the
console to suggest them one failure at a time.

| Collection | Query | Fields |
|---|---|---|
| `deals` | Active deals in a category, cheapest first | `isActive` ASC, `category` ASC, `price` ASC |
| `deals` | Expiring deals | `isActive` ASC, `dealType` ASC, `expiresAt` ASC |
| `gigs` | Open gigs, newest first | `status` ASC, `postedAt` DESC |
| `gigs` | A vendor's own gigs | `vendorRef` ASC, `postedAt` DESC |
| `orders` | A vendor's order history | `vendorRef` ASC, `placedAt` DESC |
| `orders` | A supplier's open orders | `supplierRef` ASC, `status` ASC, `placedAt` DESC |
| `shifts` | A karigar's earnings | `karigarRef` ASC, `workedAt` DESC |
| `exchangeListings` | Open listings by type | `status` ASC, `listingType` ASC, `postedAt` DESC |
| `inventory` | A supplier's stock | `supplierRef` ASC, `productName` ASC |
| `notifications` | Unread first | `userRef` ASC, `isRead` ASC, `createdAt` DESC |

**Geo queries are the one gap.** Firestore cannot do "gigs within 2 km" natively. The React app fakes
distance with a stored string. Two honest options: keep sorting by `postedAt` and show a stored
`distanceKm` (fine for the demo), or add geohash prefixes later. Do not put a radius filter in the
UI until one of those is actually implemented.
