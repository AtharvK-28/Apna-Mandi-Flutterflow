# 03 — App State

Create under **App Values → App State**. Persisted variables survive an app restart; the rest reset.

Keep this list short. Every App State variable is global mutable state, and the usual failure in a
FlutterFlow project this size is a screen reading a stale copy of something Firestore already
streams live. **If Firestore has it, read it from Firestore** — do not mirror documents into App State.

## Variables

| Name | Type | Persisted | Initial | Purpose |
|---|---|---|---|---|
| `userRole` | String | Yes | `''` | `vendor` / `karigar` / `supplier` / `guest`. Every route guard and nav bar reads this |
| `isGuest` | Boolean | Yes | `false` | Browsing without an account |
| `cartItems` | List\<CartItem\> | **Yes** | `[]` | The cart |
| `pendingRoute` | String | No | `''` | Where a signed-out visitor was heading, so login can return them there |
| `themeMode` | String | Yes | `system` | `system` / `light` / `dark` |
| `voiceEnabled` | Boolean | Yes | `false` | Master switch for dictation |
| `speechLanguage` | String | Yes | `en-IN` | Dictation language: `en-IN` / `hi-IN` / `mr-IN` |
| `activeSpeakId` | String | No | `''` | Which SpeakButton is currently reading aloud |
| `isOffline` | Boolean | No | `false` | Set by `ConnectionBanner` |
| `selectedCategory` | String | No | `''` | Deals filter — empty means all |
| `dealSearchQuery` | String | No | `''` | |

### Why the cart is App State and not Firestore

The React app persists the cart to `localStorage`, not a server. Keep that: a cart is a draft, it is
worthless to anyone but its owner, and writing every quantity tap to Firestore costs a write on a
connection that may not be there. It syncs to Firestore exactly once — at checkout, as an `orders`
document.

`cartItems` is the one App State list that must be **Persisted**, or a vendor loses their cart when
the app is backgrounded on a low-memory phone. That is the target device.

### Why `userRole` is duplicated from the `users` document

It is also on the user's Firestore document, which is the source of truth. The App State copy exists
so route guards can decide **before** the first Firestore read resolves — otherwise every page flashes
its empty state for a moment on cold start. Write it in exactly two places: after login, and in
`SplashRouter`. Never anywhere else.

## Constants

Create under **App Values → Constants**. These are the fixed lists the React app keeps in
`src/config/` and `src/data/`.

### `dealCategories` — List\<Data Struct: `Category` { id: String, name: String, icon: String }\>

| id | name | icon |
|---|---|---|
| `vegetables` | Vegetables | `eco` |
| `fruits` | Fruits | `nutrition` |
| `dairy` | Dairy | `water_drop` |
| `spices` | Spices | `local_fire_department` |
| `grains` | Grains | `grass` |
| `oil` | Oil & Ghee | `opacity` |
| `pulses` | Pulses | `circle` |
| `herbs` | Herbs | `spa` |
| `dry-fruits` | Dry Fruits | `park` |
| `beverages` | Beverages | `local_cafe` |

### Other constants

| Name | Type | Value |
|---|---|---|
| `deliveryFee` | Double | `30.0` |
| `freeDeliveryThreshold` | Double | `500.0` |
| `maxScore` | Integer | `900` — Vyapaar |
| `baseScore` | Integer | `300` — Vyapaar |
| `speechChunkSize` | Integer | `110` — see the TTS note in `custom-code/custom-actions/speakText.dart` |
| `supportPhone` | String | `+919876543200` |

## Enums

FlutterFlow enums generate Dart enums and are usable in dropdowns and conditional visibility. Create
these; use them everywhere instead of loose strings in the widget tree.

| Enum | Values |
|---|---|
| `UserRole` | `vendor`, `karigar`, `supplier`, `guest` |
| `OrderStatus` | `pending`, `confirmed`, `packed`, `outForDelivery`, `delivered`, `cancelled` |
| `GigUrgency` | `high`, `medium`, `low` |
| `GigType` | `emergency`, `prep`, `training` |
| `DealType` | `freshMorning`, `endOfDay`, `bulkDiscount`, `regular` |
| `ListingType` | `surplus`, `need` |
| `PaymentStatus` | `pending`, `processing`, `paid` |

**Firestore stores the kebab-case string, the enum uses camelCase.** `outForDelivery` in Dart is
`out-for-delivery` in the document. Convert at the boundary with `orderStatusFromString` /
`orderStatusToString` in `custom-code/custom-functions/` — never store an enum's Dart name directly,
or the React app and the Flutter app stop reading each other's data.
