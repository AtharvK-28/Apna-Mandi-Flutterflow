# 05 — Vendor Pages

Nine pages. Every one wraps in `PageShell` and starts its On Page Load chain with
`guardRoute(context, '<path>', ['vendor'], <allowGuest>)`.

---

## `/home` — `VendorHome`

**Guard:** `['vendor']`, `allowGuest: true`.

Guests reach this page. Everything gated must therefore be visible-but-inert for them rather than
absent — a guest who sees an empty screen has no reason to sign up.

```
PageShell(title: greeting(user.displayName), subtitle: user.stallName, navIndex: 0)
└── ListView
    ├── LocationBar            — locationName + "Change" text button
    ├── SearchField            — tap navigates to /deals with the query, does not search in place
    ├── BoloMandiCard          — see below
    ├── QuickActions           — 2×2 grid: Deals, Hire, Exchange, Virasaat
    ├── SectionHeader('Fresh this morning', 'See all' → /deals)
    │   └── Horizontal ListView of DealCard (width 260)
    │       query: deals where isActive == true, dealType == 'fresh-morning', limit 8
    ├── SectionHeader('Ending soon', 'See all')
    │   └── Horizontal ListView of DealCard, dealType == 'end-of-day', order by expiresAt asc
    ├── MandiPoolStrip         — pools where status == 'forming', limit 3
    ├── SectionHeader('Karigars near you', 'See all' → /karigar-connect)
    │   └── Horizontal ListView of KarigarMiniCard, users where role=='karigar' && isOnline
    └── InstallAppCard         — web build only
```

**For a guest:** replace `greeting(...)` with "Apna Mandi", hide `BoloMandiCard` and
`MandiPoolStrip`, and make every "Add" button open a "Sign in to order" sheet. The sheet says what
signing in gets them, not just that they must.

### `BoloMandiCard` — speak instead of tapping

For a vendor whose hands are busy. The React version's history is a warning: it originally opened
no microphone at all — you tapped one of three pre-written phrases, a timer ran, and it revealed a
"transcript" it already had. It also advertised "Hindi, Marathi, Tamil & 6 more".

Build the real thing or do not build it:

1. Mic button → `startDictation(FFAppState().speechLanguage)`.
2. `parseVoiceCommand(transcript)`.
3. **Always** show `describeCommand(result)` in a `ConfirmSheet` before doing anything.
4. Confirm → navigate to `result['route']` with the parsed quantity/unit/item prefilled.
5. `intent == 'unknown'` → "Didn't catch that. Try: *das kilo pyaaz mangwa do*." Show the raw
   transcript so the user can see what was heard. Never guess at an intent.

The card must claim only the languages actually offered — English, Hindi, Marathi. Hide the whole
card when `voiceEnabled` is false or `isDictationAvailable()` returns false.

---

## `/deals` — `DealsPage`

**Guard:** `['vendor']`, `allowGuest: true`.

```
PageShell(title: 'Deals', navIndex: 1)
├── SearchField (bound to App State dealSearchQuery)
├── Horizontal category chips from the dealCategories constant
│   — an "All" chip first, selected when selectedCategory is empty
├── FilterRow: sort dropdown (Price / Distance / Rating / Ending soon) · Filters button
└── GridView (2 columns, childAspectRatio 0.62, spacing 12)
    └── DealCard
```

**Query:** `deals` where `isActive == true`, plus `category` when `selectedCategory` is non-empty,
ordered by the sort choice. Paginate at 20 — the full catalogue on one screen is a slow first paint
on the connection this app is used over.

Search filters the loaded page client-side. Firestore has no substring search, and adding
Algolia/Typesense for a demo is not worth it — but say so in the empty state ("No match in the
deals loaded so far") rather than implying an exhaustive search happened.

**Empty state:** `EmptyState('sell_outlined', 'No deals in {category}', 'Try another category, or
check back in the morning when suppliers post fresh stock.', 'See all deals')`.

**Add to cart:** open a quantity sheet, not an instant add. Validate with
`isValidCartQuantity(qty, availableQuantity, minQuantity)` and show `cartQuantityError(...)`.
Bulk-discount deals carry a minimum — enforce it here, not at checkout, so a vendor is not told
their order is invalid after they have spent the time.

Use `cartIndexOfDeal(...)` before appending: adding the same deal twice bumps the existing line's
quantity, it never appends a second line for the same product.

---

## `/cart` — `CartPage`

**Guard:** `['vendor']`, `allowGuest: false`.

```
PageShell(title: 'Cart', showBack: true)
├── (empty) EmptyState('shopping_cart_outlined', 'Your cart is empty',
│             'Deals from nearby suppliers are added here.', 'Browse deals')
└── (items)
    ├── ListView of CartItemRow  — image 56, name, supplier, unit price,
    │      stepper (− qty +), line total, remove
    ├── FreeDeliveryNudge — "Add {formatRupees(amountToFreeDelivery(...))} for free delivery",
    │      hidden once it returns 0
    ├── GroupBuyingSuggestion — a matching forming pool, if any
    ├── OrderSummary card
    │   ├── Subtotal        formatRupees(cartSubtotal(items))
    │   ├── Delivery        formatRupees(cartDeliveryFee(...)) or "Free" in leaf
    │   ├── You save        formatRupees(cartSavings(...)) in leaf — hidden when 0
    │   └── Total           formatRupees(cartTotal(...)) in Headline Medium
    ├── Delivery slot selector
    ├── Payment method: Cash on delivery · UPI
    └── AppButton('Place order', primary, fullWidth)
```

**A cart spanning several suppliers becomes several orders** — one per supplier, since one supplier
cannot fulfil another's items. Say so above the button: "This will create 2 orders, one per
supplier." Discovering that on the confirmation screen feels like a bug.

**Place order** → `placeOrder(paymentMethod, deliverySlot)`, then a success sheet, then `/orders`.

Two things that action deliberately does not do, and the UI must not claim otherwise:

- **It does not take payment.** `paymentStatus` is written `pending` for both methods. Do not
  label the UPI path "Paid".
- **It does not queue offline.** There is no write replay anywhere in this app. When
  `FFAppState().isOffline`, disable the button and say "You need a connection to place an order" —
  never "we'll send it when you're back online".

---

## `/orders` — `OrdersPage`

**Guard:** `['vendor']`.

```
PageShell(title: 'Orders', showBack: true)
├── TabBar: Active · Completed · Cancelled
└── ListView of OrderCard
```

**Query:** `orders` where `vendorRef == currentUser`, ordered by `placedAt` desc. Tabs filter on
`status` — Active is `pending`/`confirmed`/`packed`/`out-for-delivery`.

`OrderCard`: order number, supplier name, `timeAgo(placedAt)`,
`StatusChip(orderStatusLabel(status), orderStatusTone(status))`, item thumbnails (max 3 + "+2"),
total, and a `SpeakButton(spokenOrder(...), 'order-{id}')`.

Tap → `OrderDetailsSheet` with a stepper driven by `orderStatusStep(status)`. When that returns
`-1` (cancelled), render a cancelled state instead of a half-finished progress line — a stepper
frozen at step 2 on a cancelled order looks like it is still coming.

Delivered orders show a rate prompt; the security rules allow the vendor to write `rating` only
after `status == 'delivered'`.

---

## `/dashboard` — `VendorDashboard`

**Guard:** `['vendor']`.

The showcase page. Six modules, in this order:

```
PageShell(title: 'Dashboard', navIndex: 5)
└── ListView
    ├── VyapaarScoreCard      ← read the warning below before building
    ├── MausamEngineCard
    ├── MandiPoolSection
    ├── TyoharBookCard
    ├── BarsaatCoverCard
    └── CateringOrderCard
```

### `VyapaarScoreCard`

```
Container (paperLight, radius 12, border 1px paperDark, padding 16)
├── Row: 'Vyapaar Readiness' (Headline Medium) · info icon → explainer sheet
├── VyapaarGauge(score, arcColor: vyapaarBandTone → theme colour)
├── Row: StatusChip(vyapaarBandLabel(score), vyapaarBandTone(score))
│        · "+{vyapaarMonthlyChange} this month" in leaf
├── vyapaarBandSummary(score) in Body Medium
├── Divider
├── ListView of vyapaarBreakdown(...):
│     IconTile · label · detail · LinearProgressIndicator(share) · "{earned}/{max}"
├── SectionHeader('What this unlocks')
│   └── vyapaarUnlocks(score) — lock icon when not unlocked
└── DisclaimerBlock   ← MANDATORY, see below
```

**This is not a credit score, and the wording must stay that way.** These are regulatory
constraints, not style preferences:

- In India a credit score is issued by an RBI-licensed credit information company (CIBIL,
  Experian, Equifax, CRIF) from regulated bureau data. Apna Mandi has no such licence and no bureau
  feed. **Never present this as a credit score.**
- The card **must** carry a visible disclaimer that this does not affect CIBIL / Experian /
  Equifax / CRIF. Not in a collapsed section — visible on the card.
- Apna Mandi is not a lender. **Do not add "pre-approved" amounts, interest rates, or offers**
  anywhere near this number, however good the demo would look.
- The only lending action permitted is consent to share the record with **named** regulated
  lenders, who decide for themselves.
- If a real lending flow is ever added it needs a named RBI-registered lender, a Key Fact
  Statement, APR (not "% per month"), a cooling-off period, and a grievance contact.

The `VyapaarGauge` widget carries "Not a credit score" inside the arc for the same reason: a
300–900 arc looks exactly like CIBIL's range, and people will assume it is one.

### `MausamEngineCard`

Tomorrow's demand forecast, blending weather, the festival calendar, local events and anonymised
corridor demand. Shows a footfall change (`-30%`), a confidence figure, the corridor vendor count
the signal is drawn from, and the contributing signals as icon rows.

**Always show the confidence number and the sample size.** A forecast presented as certainty is
how a vendor over-buys on your advice and eats the loss.

### `MandiPoolSection`

Pools where `status == 'forming'`. Each: name, `{vendorCount}/{targetVendorCount}` with a progress
bar, item list, `formatRupees(totalAmount)`, `timeUntil(closesAt)`, and a Join button.

Leading a pool needs a Vyapaar score of 650. Show the requirement rather than hiding the button —
"Lead a pool at 650" tells someone what to work toward; a missing button tells them nothing.

### `TyoharBookCard`

Festival pre-sales: festival name and date, item, `{presold}/{capacity}` sold with a progress bar,
escrow held, and an advance draw at 60% of escrow.

Money held in escrow is other people's money until delivery. Label it "held in escrow", never
"your balance", and make the advance clearly a draw against it.

### `BarsaatCoverCard`

Parametric rain cover: rainfall in the vendor's pincode is measured by public weather stations, and
crossing the threshold triggers the payout automatically — no claims form, no inspector.

This is an insurance product. State the premium, the payout, the trigger threshold, the covered
period, and how the sum was sized. **Do not describe it as guaranteed income**, and do not omit
that it pays only when the threshold is crossed — a 9 mm day pays nothing, and the vendor must know
that before they buy, not after.

### `CateringOrderCard`

A bulk catering order split across several vendors: company, location and distance, event, date,
total plates and value, and this vendor's share (items, plates, payout).

---

## `/karigar-connect` — `KarigarConnect`

**Guard:** `['vendor']`. The vendor's hiring view. The karigar's side is
[06-PAGES-KARIGAR.md](06-PAGES-KARIGAR.md), reading the same `gigs` collection.

```
PageShell(title: 'Karigar Connect', subtitle: 'Hire skilled help nearby', navIndex: 2)
├── AppButton('Post a gig', primary, fullWidth) → PostGigSheet
├── TabBar: My gigs · Browse karigars
├── Tab 1: ListView of GigCard (vendor action slot)
│          gigs where vendorRef == me, order by postedAt desc
└── Tab 2: GridView of KarigarCard
           users where role == 'karigar', filter chips: skill, availability, online now
```

**`PostGigSheet`** — title, gig type, skills (multi-select), description (with `VoiceInput`),
date + start/end time, rate per hour, computed total pay, urgency.

Store `startAt`/`endAt` as **Timestamps**, not the React app's `"Today"` + `"5:00 PM - 10:00 PM"`
strings. Those cannot be sorted, filtered or compared, and are wrong the next morning.

Show the computed total pay live as the rate and duration change. A vendor entering ₹600/hr for
2 hours should see ₹1,200 before they post, not discover it when someone applies.

**`ApplicantsSheet`** — `gigs/{id}/applications` ordered by `appliedAt`. Each: photo, name, rating,
verified skills, message, Accept / Decline. Accepting sets the application to `accepted`, the gig to
`filled`, and `assignedKarigarRef`. Confirm first via `ConfirmSheet` — accepting is not reversible
from the UI.

**`KarigarProfileSheet`** — photo, name, age, location, rating, total gigs, bio, skills, verified
skills as `HunarCertificate` badges, hourly rate, availability, and Message / Call buttons.

Verified skills are **awarded, not self-declared**. Render them visually differently from
self-listed skills, or the badge means nothing.

---

## `/vendor-exchange` — `VendorExchange`

**Guard:** `['vendor']`.

Peer-to-peer trading of surplus and urgent needs between nearby stalls.

```
PageShell(title: 'Vendor Exchange', subtitle: 'Trade surplus with stalls nearby', navIndex: 3)
├── AutoExchangeBanner — opt-in auto-matching of your surplus to nearby needs
├── SegmentedControl: Surplus nearby · Urgent needs · My listings
├── AppButton('List surplus', primary) / ('Post a need', secondary) — follows the tab
└── ListView of ExchangeCard
```

**Query:** `exchangeListings` where `status == 'open'` and `listingType == <tab>`, ordered by
`postedAt` desc.

`ExchangeCard`: image, item + quantity, `StatusChip(urgencyLabel, urgencyTone)`, condition,
`formatRupees(askingPrice)` with `originalPrice` struck through (surplus) or
`formatRupees(budget)` (need), vendor name + `RatingStars`, distance, `timeUntil(expiresAt)`, and
Buy / Offer trade / Call buttons.

**`expiresAt` is not optional here.** These are perishables measured in hours — a listing without
an expiry turns the Exchange into a graveyard of yesterday's tomatoes, which is exactly the failure
the module exists to fix. Default it to 12 hours from posting and let the vendor shorten it.

Barter: when `acceptsBarter`, "Offer trade" opens a sheet to propose an item in exchange. Do not
compute a "fair" equivalence — the two vendors negotiate, and a number the app invents will be
wrong and will be believed.

---

## `/virasaat` — `VirasaatPage`

**Guard:** `['vendor']`.

Heritage commerce: a vendor's signature recipe, licensed as a product.

```
PageShell(title: 'Virasaat', subtitle: 'Heritage recipes, licensed', navIndex: 4)
├── HeroCard — what Virasaat is, in two sentences, with a "List your recipe" button
├── Category chips: All · Chutneys · Masalas · Pastes · Blends
├── ListView of VirasaatCard
└── FranchiseSection — vendors already licensing their recipe, as social proof
```

`VirasaatCard`: product image, name, master vendor + rating, package size, yield claim,
`formatRupees(licensePrice)` (one-time) and `formatRupees(subscriptionPrice)` (monthly) side by
side, and `{subscriberCount} vendors using this`.

Tap → `ProvenanceSheet`: the master vendor's story in full, declared ingredients, usage
instructions, testimonials, and the two purchase options.

**The story is the product, not decoration.** Give `masterVendorStory` real space — Display Small,
full width, unclipped. A three-line truncation with "read more" defeats the point of the module.

**Declared ingredients are not the recipe.** List what is in it; never the ratios. The ratio is the
asset being licensed, and publishing it destroys the thing the vendor is selling.

---

## `/khau-galli` — `KhauGalliLive`

**Guard:** `['vendor']`, `allowGuest: true`.

The public-facing food-street directory — the one collection a signed-out visitor can read.

```
PageShell(title: 'Khau Galli', subtitle: 'Food streets near you')
├── SegmentedControl: List · Map
├── Filter chips: Open now · Hygiene A · cuisine types
├── List: ListView of StallCard
└── Map: GoogleMap with a marker per stall, tap → StallCard bottom sheet
```

`StallCard`: image, stall name, cuisine, signature dish, `RatingStars`, `SwachhBadge(hygieneGrade)`,
open/closed with hours, price range, distance, Directions button.

`SwachhBadge` — grade A in `leaf`, B in `turmeric`, C in `chili`, and **render nothing when the
grade is null**. An ungraded stall must not be shown as failing; it has simply not been audited,
and implying otherwise is a claim about a real business.
