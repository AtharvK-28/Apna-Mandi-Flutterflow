# 06 — Karigar Pages

Four pages. A karigar's app really is four screens — resist padding it out with vendor tools.

Every page guards with `guardRoute(context, '<path>', ['karigar'], false)`. None allow guests:
there is nothing here to browse without an identity, since every screen is about *your* work.

The karigar reads the same `gigs` collection the vendor writes. One collection, two audiences —
do not build a parallel "jobs" collection.

---

## `/karigar/find-work` — `FindWork`

The landing page after a karigar signs in.

```
PageShell(title: 'Find work', subtitle: '{count} shifts near you', navIndex: 0)
├── AvailabilityToggle — "Available now" switch, writes users.isOnline
├── Filter chips: All · Emergency · Prep help · Training · Today · This week
├── SortRow: Newest · Highest pay · Closest
└── ListView of GigCard (karigar action slot)
```

**Query:** `gigs` where `status == 'open'`, ordered by `postedAt` desc, paginated at 20.
Filter chips add `gigType`; the date chips add a `startAt` range.

### The availability toggle is a promise

`isOnline` is what puts this karigar in front of vendors browsing for help. Two consequences:

- The switch must reflect a real, current value — read it from the user document, not from local
  state that drifts.
- It needs an automatic expiry. A karigar who forgets to switch off appears available at 2am, gets
  called, and stops trusting the app. Store `availableUntil` alongside it and treat "available" as
  `isOnline && availableUntil > now`, defaulting to end of day.

### The apply flow

Tap a card → `GigDetailsSheet`:

```
├── Image
├── Title (Display Small) · SpeakButton(spokenGig(...), 'gig-detail')
├── Vendor row: name, RatingStars, location, Call button
├── StatusChip(urgencyLabel, urgencyTone) · StatusChip(gigTypeLabel, 'terracotta')
├── shiftWhen(startAt, endAt) with a calendar icon
├── Pay block: formatRupees(totalPay) large · "{formatRupees(ratePerHour)}/hr × {durationHours}h"
├── Skills as chips
├── Description
├── "{applicantCount} others have applied"
└── AppButton('Apply for this shift', primary, fullWidth)
```

**The speak button matters more here than anywhere else in the app.** A karigar may have limited
literacy in the app's language, and this is the screen where they decide whether to take work.
Build the summary with `spokenGig(...)` — never by concatenating the raw UI strings.

Applying writes to `gigs/{id}/applications` with `status: 'applied'` and increments
`applicantCount`.

**Check for an existing application before rendering the button.** If one exists, show
`StatusChip('Applied', 'leaf')` instead. Offering an action that the security rules will reject is
a small betrayal, and it happens every time the karigar re-opens a gig they already applied to.

**Show the pay before the description.** Pay and timing are the decision; the description is
detail. The React app's ordering here was right.

**Empty state:** `EmptyState('search', 'No open shifts near you', 'New shifts are posted through
the day — check back before the evening rush.', null)`. No action button, because there is genuinely
nothing the karigar can do to create work. A fake action here is worse than none.

---

## `/karigar/my-work` — `MyWork`

```
PageShell(title: 'My work', navIndex: 1)
├── TabBar: Applied · Upcoming · Completed
├── Applied:    applications (collection group) where karigarRef == me, status == 'applied'
├── Upcoming:   gigs where assignedKarigarRef == me, startAt >= now, order by startAt asc
└── Completed:  shifts where karigarRef == me, order by workedAt desc
```

The Applied tab needs the `applications` **collection-group** index in
`firebase/firestore.indexes.json` — it queries across every gig's subcollection.

**Applied row:** gig title, vendor, `shiftWhen(...)`, pay, `timeAgo(appliedAt)`, and a Withdraw
button. Withdrawing sets `status: 'withdrawn'` — never deletes. The vendor may already have made
plans around that application, and a silent disappearance is worse than a visible withdrawal.

**Upcoming row:** the same, plus a countdown (`timeUntil(startAt)`), Message and Call buttons, and
"Mark completed" once `endAt` has passed. Sort ascending — the next shift is the one that matters,
and it belongs at the top.

**Completed row:** title, vendor, date, hours, pay,
`StatusChip(paymentStatus, tone)` — `paid` in `leaf`, `processing` in `turmeric`, `pending` in
`chili` — and the vendor's rating as `RatingStars`.

**`pending` payment is `chili`, deliberately.** Money owed to someone who worked a shift is the
single most important thing on this screen, and a neutral grey chip buries it.

---

## `/karigar/earnings` — `Earnings`

```
PageShell(title: 'Earnings', navIndex: 2)
├── EarningsSummaryCard
│   ├── This month: formatRupees(sum of pay where workedAt in this month)  — Display Large
│   ├── Row: Paid · Processing · Pending — three totals, each with its tone
│   └── SpeakButton(summary, 'earnings-summary')
├── BarChart (fl_chart) — last 8 weeks
├── SectionHeader('Shifts')
└── ListView of ShiftRow
```

**Query:** `shifts` where `karigarRef == me`, ordered by `workedAt` desc.

Totals are computed client-side from the loaded shifts. That is fine at this scale, but it means
**the header must say what it counted** — "From your last 50 shifts" — rather than presenting a
partial sum as a lifetime total.

`ShiftRow`: date, title, vendor, hours, `formatRupees(pay)`, payment chip.

**Do not add a "Withdraw" or "Transfer to bank" button.** There is no payment rail in this app.
Payments happen between the vendor and the karigar; this screen is a record of them, and a withdraw
button that does nothing is worse on this screen than any other in the app.

**The speak summary earns its place here.** Something like: "This month you earned 4,090 rupees
across 5 shifts. 3,190 rupees paid. 900 rupees still processing." Build it with `spokenAmount(...)`
— "₹4,090" read verbatim is announced as a symbol name or dropped.

---

## `/karigar/messages` — `Messages`

```
PageShell(title: 'Messages', navIndex: 3)
└── ListView of ChatRow  →  ChatPage
```

**Query:** `chats` where `participantRefs` array-contains my user ref, ordered by `lastMessageAt`
desc. This needs the array-contains composite index.

`ChatRow`: the other participant's name (from `participantNames`, so rendering a row costs no extra
read), the gig title when `gigRef` is set, `lastMessage` truncated to one line,
`timeAgo(lastMessageAt)`, and an unread count badge in `terracotta`.

### `ChatPage`

A sub-route, not in the nav.

```
├── AppHeader: other participant's name, subtitle = gig title, Call button
├── ListView (reverse: true) of MessageBubble
│   — mine: terracotta background, onPrimary text, right-aligned
│   — theirs: paperLight background, ink text, left-aligned, 1px paperDark border
└── Composer: TextField + VoiceInput + send button
```

**Query:** `chats/{id}/messages` ordered by `sentAt` desc, `reverse: true` on the ListView so the
newest message is at the bottom without a scroll-to-end jump on every rebuild.

Sending writes the message and updates the parent chat's `lastMessage`, `lastMessageAt` and
`unreadCount`. Do both in one batch — a chat list showing a stale last message while the thread has
newer ones looks broken from the outside.

The security rules allow updating only `readAt` on a sent message. **There is no edit or delete.**
This is a record of an agreement about work and money, and both sides benefit from it being fixed.

`VoiceInput` in the composer is the most-used dictation surface in the app. It respects
`FFAppState().speechLanguage`, which is the setting in Profile → Settings — unlike `SpeakButton`,
which is always `en-IN`.
