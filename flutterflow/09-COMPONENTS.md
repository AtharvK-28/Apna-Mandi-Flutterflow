# 09 — Shared Components

Build these before the pages that use them. In FlutterFlow: **Components → New Component**.

A component here is worth the setup cost only if two or more pages use it. Everything below is
used by at least two.

---

## `PageShell`

Every page's outer wrapper. The React app has the same component, and pages that re-implemented it
drifted apart on width, padding and heading size — which is how an app starts looking like several
apps.

**Parameters:** `title` (String), `subtitle` (String, nullable), `showBack` (bool, default false),
`navIndex` (int), `body` (Widget builder — FlutterFlow "Widget Builder" parameter).

**Tree:**

```
Scaffold  (backgroundColor: paper)
├── appBar: AppHeader(title, subtitle, showBack)
├── body: Stack
│   ├── Container  (gradient wash — see 01-DESIGN-SYSTEM.md)
│   ├── SafeArea
│   │   └── Container  (maxWidth 560, centred, padding 16 horizontal)
│   │       └── [body]
│   ├── Align(bottomLeft)  → ConnectionBanner   (padding 16)
│   └── Align(bottomRight) → FloatingCartButton (padding 16, visible when can(userRole,'cart'))
└── bottomNavigationBar: AppNavBar(navIndex)
```

The two floating children sit on opposite corners deliberately. Both bottom-right means one of them
becomes untappable, and it is always the one you did not test.

---

## `AppHeader`

**Parameters:** `title` (String), `subtitle` (String, nullable), `showBack` (bool).

Left: back chevron when `showBack`, otherwise the Apna Mandi mark.
Centre-left: `title` in Display Medium, `subtitle` in Body Small underneath.
Right, in order: `ThemeToggle`, `NotificationBell`, `AccountMenu`.

Background `paperLight`, `1px` `paperDark` bottom border, elevation `0`.

---

## `AppNavBar`

**Parameters:** `currentIndex` (int).

Do **not** use FlutterFlow's global NavBar — it renders one item set for the whole app, and a
karigar must never see "Cart". Build a `Row` from `navItemsForRole(FFAppState().userRole)` so
adding a screen is a change in one Dart file and nowhere else.

The vendor list has six items, one over Material's comfortable maximum. Use `type: fixed` with
`selectedFontSize: 11`, or a horizontally scrollable Row. Do not drop an item to make it fit —
which one you drop is a product decision, not a layout one.

Selected `terracotta`, unselected `inkMedium`, background `paperLight`, `1px` `paperDark` top
border, elevation `0`.

---

## `FloatingCartButton`

**Visible when:** `can(FFAppState().userRole, 'cart')` — the capability, not `role == 'vendor'`.

56×56 circle, `terracotta`, elevation `6` (the one place in the app with a shadow — it has to
separate from scrolling content). `shopping_cart_outlined` in `onPrimary`, with a badge showing
`cartItemCount(FFAppState().cartItems)` when greater than zero.

Badge: 18×18 circle, `chili`, white Label Medium text, top-right, `99+` above 99.

Tap → `/cart`. Hidden on `/cart` itself, since a button that navigates to the page you are on
reads as broken.

---

## `AppButton`

FlutterFlow's Button widget with per-instance styling drifts within a day. Wrap it once.

**Parameters:** `label` (String), `variant` (String), `icon` (String, nullable),
`loading` (bool), `fullWidth` (bool), `onTap` (Action).

| variant | Background | Text | Border |
|---|---|---|---|
| `primary` | `terracotta` | `onPrimary` | none |
| `secondary` | `turmericLight` | `turmericDark` | none |
| `outline` | transparent | `ink` | `1px paperDark` |
| `ghost` | transparent | `inkLight` | none |
| `danger` | `chili` | `onPrimary` | none |

Height `48` — the target user taps this with a wet or flour-dusted thumb, and Material's default
`36` is genuinely too small. Radius `12`, Title Medium label.

When `loading`: replace the label with a 20px `CircularProgressIndicator` in the text colour and
**disable the tap**. Keep the button's width fixed so the layout does not jump — a button that
shrinks on tap makes people tap twice, which on checkout means two orders.

---

## `StatusChip`

**Parameters:** `label` (String), `tone` (String — `leaf` / `turmeric` / `chili` / `terracotta`).

Padding `6/10`, radius `999`, background `<tone>Light`, text `<tone>Dark` in Label Medium.

Always the `Light`/`Dark` pair, never a hand-picked colour. `leafLight` is nearly black in dark
mode, so a chip with hardcoded dark-green text disappears entirely.

---

## `IconTile`

The single icon pattern across the app: 40×40 Container, radius `12`, background `<brand>Light`,
icon size `20`, colour `<brand>Dark`.

**Parameters:** `icon` (String), `tone` (String), `size` (double, default 40).

Never an emoji. Emoji render differently on every platform, cannot be recoloured to match the
theme, and are announced unpredictably by screen readers.

---

## `EmptyState`

**Parameters:** `icon` (String), `title` (String), `message` (String),
`actionLabel` (String, nullable), `onAction` (Action, nullable).

Centred column: `IconTile` at size 64 in `terracotta` tone, title in Headline Small, message in
Body Medium `inkMedium`, then an `AppButton` in `primary` if an action was given.

**Every list that can be empty gets one.** The rule from the React app: name what *would* appear
here, and offer the action that creates it. "No gigs" is a dead end; "No open gigs near you right
now — post one and karigars nearby will see it" is a screen someone can act on.

---

## `SpeakButton`

**Parameters:** `text` (String), `speakId` (String).

A 36×36 ghost icon button, `volume_up` in `inkMedium`. When
`FFAppState().activeSpeakId == speakId`, swap to `stop_circle` in `terracotta`.

- **Tap** → `speakText(text, speakId, 'en-IN')`. Tapping while active → `stopSpeaking()`.
- `speakId` must be unique per page, or every speak button on the page lights up at once.
- **Never pass a raw UI string.** Build `text` with a formatter from `speechText.dart` —
  "₹750" is announced as a symbol name or skipped, and "5:00 PM - 10:00 PM" becomes
  "five colon zero zero".
- Language is `en-IN` regardless of the user's dictation setting. The summaries are generated in
  English, and a hi-IN voice reading English words is close to unintelligible. The Profile setting
  governs *dictation* only.

---

## `VoiceInput`

**Parameters:** `hint` (String), `onTranscript` (Action with String param).

A mic icon button inside a text field's suffix. Tap → `startDictation(FFAppState().speechLanguage)`,
then pass the result to `onTranscript`.

**Renders nothing when `isDictationAvailable()` is false, and nothing when
`FFAppState().voiceEnabled` is false.** A mic button that cannot work is worse than no mic button:
the user taps it, nothing happens, and concludes the app is broken rather than that the feature is
unsupported here.

While listening: pulse the icon in `terracotta` and show "Listening…" as the field's helper text.
An empty result must show "Didn't catch that — try again" and **leave the field's existing text
alone**. Silently clearing what someone already typed is the worst possible failure here.

---

## `DealCard`

Used on Deals, Home and the supplier's inventory preview.

```
Container (paperLight, radius 12, 1px paperDark border)
├── Stack
│   ├── Image (16:9, cover, AppImage-style error fallback)
│   ├── TopLeft:  StatusChip(dealTypeLabel(dealType), tone by type)   — hidden when 'regular'
│   └── TopRight: discount badge "-28%"  — hidden when discountPercent() == 0
└── Padding 12
    ├── Row: name (Headline Small, maxLines 2) · SpeakButton(spokenDeal(...), 'deal-{id}')
    ├── Row: supplierName (Body Small) · verified_user icon in leaf when isVerified
    ├── Row: formatRupees(price) (Mukta 600, +1 size, ink)
    │        · struck-through formatRupees(originalPrice) in inkMedium  — hidden when null
    │        · "/ {unit}" in Body Small
    ├── Row: star_rounded turmeric + rating · "•" · "{distanceKm} km"
    ├── timeUntil(expiresAt) in chili Label Medium  — hidden when null
    └── AppButton('Add', primary, fullWidth)
```

The price is in `ink`, not `terracotta`. A grid where every price is brand-orange reads as a screen
of alarms, and nothing stands out because everything does.

---

## `GigCard`

Used on Karigar Connect (vendor view) and Find Work (karigar view) — same card, different actions.

```
Container (paperLight, radius 12, border 1px paperDark)
└── Padding 16
    ├── Row: IconTile(gig type icon, tone) · Column(title Headline Small, vendorName Body Small)
    │        · StatusChip(urgencyLabel, urgencyTone)
    ├── Wrap: skills as small outline chips (max 3 + "+2")
    ├── Row: schedule icon · shiftWhen(startAt, endAt) (Body Medium)
    ├── Row: place icon · vendorLocation · "•" · distance
    ├── Divider (paperDark)
    ├── Row: formatRupees(totalPay) (Mukta 600, +2 size)
    │        · "{formatRupees(ratePerHour)}/hr" (Body Small inkMedium)
    │        · SpeakButton(spokenGig(...), 'gig-{id}')
    └── Row: [action slot]
```

**Action slot by role** — pass as a widget-builder parameter rather than branching on role inside
the card:

- Vendor: `AppButton('{applicantCount} applicants', outline)` → applicants sheet
- Karigar: `AppButton('Apply', primary)`, or a disabled `StatusChip('Applied', leaf)` when already
  applied. Check that before rendering, not after the tap — offering an action that will be
  rejected is a small betrayal that people remember.

---

## `RatingStars`

**Parameters:** `rating` (double), `size` (double, default 14), `showNumber` (bool).

Five `star_rounded` icons, filled in `turmeric` up to `rating`, `paperDark` beyond. Half-stars via
a `ShaderMask` — or round to the nearest half and use `star_half`, which is simpler and looks the
same at 14px.

---

## `SectionHeader`

**Parameters:** `title` (String), `actionLabel` (String, nullable), `onAction` (Action).

Row: title in Display Small, spacer, a text button in `terracotta` Title Medium. Vertical padding
`24` above, `12` below. Used on every page that stacks sections, which is most of them.

---

## `ConfirmSheet`

**Parameters:** `title`, `message`, `confirmLabel`, `variant`, `onConfirm`.

A bottom sheet — radius `20` top corners, `paperLight`, a `40×4` `paperDark` grab handle.

Use it for: cancelling an order, accepting an applicant, deleting a listing, confirming a
voice-matched command.

**Never use `alert()`-style blocking dialogs**, and never skip confirmation on a voice command.
Keyword matching gets things wrong, and a silently wrong action mid-service is far worse than one
extra tap.
