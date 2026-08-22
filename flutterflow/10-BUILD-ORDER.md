# 10 — Build Order

Six sprints. The ordering is not arbitrary: each one is chosen so the next has nothing left to
retrofit. The two things that genuinely hurt to fix later are **theme colours** and **the role
config**, so both land in Sprint 1.

Check items off as you go.

---

## Sprint 1 — Foundation

Nothing visible ships from this sprint, and it is still the one worth doing carefully.

- [ ] FlutterFlow project created, blank template, `com.apnamandi.app` — `00-SETUP.md`
- [ ] Firebase project linked, region `asia-south1`
- [ ] Phone Auth enabled, three demo numbers registered as test numbers
- [ ] All six pub.dev packages added
- [ ] Permissions declared with real rationale strings (iOS rejects empty ones)
- [ ] **Every custom colour created, light and dark** — `01-DESIGN-SYSTEM.md`
- [ ] Typography styles created, Baloo 2 + Mukta
- [ ] Built-in theme slots pointed at the same values
- [ ] App State variables, constants and enums — `03-APP-STATE.md`
- [ ] Firestore collections and data types — `02-DATA-SCHEMA.md`
- [ ] `firestore.rules` and `firestore.indexes.json` deployed
- [ ] Seed data imported (`firebase/seed/seed.mjs`), demo uids reconciled with Auth

**Do not skip the colours to get to a screen faster.** Every widget built before the theme exists
gets a hand-picked colour, and hand-picked colours do not flip in dark mode. Finding them later
means opening every widget on every page.

---

## Sprint 2 — Custom code and shared components

- [ ] Paste all six custom function files — `custom-code/custom-functions/`
- [ ] Paste all five custom actions — `custom-code/custom-actions/`
- [ ] Paste both custom widgets — `custom-code/custom-widgets/`
- [ ] `PageShell`, `AppHeader`, `AppNavBar`
- [ ] `AppButton`, `StatusChip`, `IconTile`, `EmptyState`, `SectionHeader`
- [ ] `FloatingCartButton`, `ConfirmSheet`, `RatingStars`
- [ ] `SpeakButton`, `VoiceInput`
- [ ] `DealCard`, `GigCard`

**Compile after each paste.** FlutterFlow reports Dart errors only at build time, and a batch of
twelve files with one typo means bisecting twelve files.

`roleConfig.dart` first — almost everything else references it.

---

## Sprint 3 — Auth and navigation

- [ ] `LoginPage`, all four steps — `08-PAGES-SHARED.md`
- [ ] `SplashRouter` with the full decision chain
- [ ] Route table entered, every path from `04-NAVIGATION.md`
- [ ] `guardRoute` wired as the first On Page Load action on every gated page
- [ ] `ProfilePage`, including the voice privacy sentence
- [ ] `NotFoundPage`

**End-of-sprint test — do all six:**

1. Sign in as each demo role → lands on its own home.
2. Signed out, open `/cart` directly → `/login`, and after signing in you land on `/cart`.
3. Signed in as karigar, open `/cart` → karigar home, no error page.
4. "Browse without an account" → `/home` works, `/cart` bounces.
5. Kill and relaunch the app → still signed in, same role.
6. Toggle dark mode → nothing becomes unreadable on any screen built so far.

Test 6 is the one people skip and the one that catches a whole sprint of hardcoded colours while
there are still only three screens to fix.

---

## Sprint 4 — Vendor

The largest sprint. It is also the demo path, so build it in this order and you have something
showable partway through.

- [ ] `DealsPage` — grid, categories, filters, add-to-cart with quantity validation
- [ ] `CartPage` — line items, totals, multi-supplier notice, `placeOrder`
- [ ] `OrdersPage` — tabs, cards, details sheet, status stepper
- [ ] `VendorHome` — greeting, sections, quick actions, guest variant
- [ ] `KarigarConnect` — post gig, my gigs, browse karigars, applicants
- [ ] `VendorExchange` — surplus, needs, listing sheet
- [ ] `VirasaatPage` — cards, provenance sheet
- [ ] `KhauGalliLive` — list and map
- [ ] `VendorDashboard` — six modules, **`VyapaarScoreCard` last**

`VyapaarScoreCard` goes last on purpose: it has the most constraints on its wording, and building it
while rushing to finish a sprint is how the disclaimer gets dropped. Re-read the regulatory section
in `05-PAGES-VENDOR.md` immediately before starting it, not from memory.

**Checkpoint after the first three:** deals → cart → order is the complete demo path. If the
schedule slips, this is the line worth defending.

---

## Sprint 5 — Karigar and supplier

- [ ] `FindWork`, `MyWork`, `Earnings`, `Messages` + `ChatPage` — `06-PAGES-KARIGAR.md`
- [ ] `SupplierOverview`, `SupplierOrders`, `SupplierInventory`, `SupplierDeliveries`

**Cross-role test, which is where the real bugs are:**

1. Vendor posts a gig → sign out → karigar sees it in Find Work.
2. Karigar applies → vendor sees the applicant with the correct count.
3. Vendor accepts → gig shows `filled`, karigar sees it under Upcoming.
4. Vendor places an order → supplier sees it under New.
5. Supplier advances it to delivered → vendor sees each status change.

Each of these crosses a security rule. A rule that is too strict fails silently in FlutterFlow —
the query returns empty and the screen shows its empty state, which looks exactly like "no data"
rather than "permission denied". Watch the browser console during this test.

---

## Sprint 6 — Polish and release

- [ ] Every list has an `EmptyState` that names what would appear and offers the action
- [ ] Every async action has a loading state; every failure has a message saying what to do next
- [ ] Offline: `ConnectionBanner` appears, order button disables, copy promises no replay
- [ ] Dark mode audited on all 20 screens
- [ ] Voice: read-aloud completes on the longest summary; dictation works in all three languages
- [ ] Voice on Firefox / an unsupported device: buttons render **nothing**, not a dead control
- [ ] App icon generated from `public/icon.svg`
- [ ] PWA settings for the web build
- [ ] Tested on a real low-end Android phone, not only the simulator

That last one is not a formality. The target user opens this in a market on one bar of signal, on a
phone several years old. A screen that is fine in the simulator and janky at 60fps→12fps on a real
device is a screen that has not been tested.

---

## Known gaps — decide before demo day, do not discover them during it

| Gap | Status | If asked |
|---|---|---|
| **Payments** | Not implemented. `paymentStatus` is always `pending` | Say so. Do not label the UPI path "Paid" |
| **Geo radius queries** | Firestore cannot do "within 2 km" natively. Sorted by recency with a stored `distanceKm` | Do not put a radius filter in the UI until geohashing is real |
| **Offline writes** | Reading only. No queue, no replay | Never imply an order placed offline will send later |
| **Search** | Client-side over the loaded page. No Algolia/Typesense | The empty state says "in the deals loaded so far" |
| **Push notifications** | `notifications` documents exist; no FCM delivery | One sprint of work, not wired yet |
| **Lending** | Vyapaar is a platform metric only | Not a credit score, not an offer of credit. See `05-PAGES-VENDOR.md` |

The pattern in this table is one rule: **the app never claims a capability it does not have.** A
demo that over-promises costs more when it is believed than a demo that is honest about its edges.

---

## Keeping the React app and this app in step

`src/` stays the reference implementation while the FlutterFlow build catches up. Two things keep
them from drifting:

- **Field names are identical** between `src/data/*.js` and `02-DATA-SCHEMA.md`, deliberately, so
  the two can be diffed by eye.
- **Behaviour that exists for a reason is commented in the Dart**, not just in the spec — the TTS
  chunking, the strong/weak keyword split, the guard's redirect-home-not-403 rule. Those comments
  are the record of what broke last time. Do not strip them as noise.

When a rule changes in one app, change it in the other in the same session. The gap between them is
never smaller than it is right now.
