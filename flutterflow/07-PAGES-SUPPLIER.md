# 07 — Supplier Pages

Four pages, all guarded with `guardRoute(context, '<path>', ['supplier'], false)`.

In the React app these are one component with a `view` prop. **In FlutterFlow, build four separate
pages.** A single page switching its whole body on a parameter is how the React version reached a
2,000-line component before it was split — and FlutterFlow's canvas is far worse than a text editor
at showing you that it has happened.

The supplier is the only role whose screens contain commercially sensitive data. `inventory` holds
`costPrice`, which is the supplier's margin — the security rules keep vendors out of that
collection entirely, and no supplier screen should ever surface a cost price in a shared context.

---

## `/supplier` — `SupplierOverview`

```
PageShell(title: 'Overview', subtitle: user.businessName, navIndex: 0)
└── ListView
    ├── StatGrid (2×2) — StatTile ×4
    ├── RevenueChart
    ├── InventoryAlerts
    ├── SectionHeader('Mandi Pools', 'All' → /supplier/orders)
    │   └── PoolCard ×2
    ├── SectionHeader('Top products')
    └── SectionHeader('Top vendors')
```

### `StatTile`

**Parameters:** `title`, `value`, `change`, `changeIsPositive`, `icon`.

`IconTile` top-left, value in Display Small, title in Body Small, and the change as a small chip —
`leaf` when positive, `chili` when negative, with an arrow icon.

The four tiles: Today's orders · Revenue today · Pending deliveries · Vendor rating.

**"Pending deliveries" going down is good.** Do not colour every negative delta `chili`. Pass
`changeIsPositive` explicitly per tile rather than deriving it from the sign — that derivation is
wrong for exactly this tile, which is the one a supplier looks at first.

### `RevenueChart`

`fl_chart` `BarChart`, with a Week / Month toggle. Bars in `terracotta`, grid lines in `paperDark`,
labels in Body Small. Y-axis labels via `formatRupeesCompact(...)` — "₹12.4K" fits, "₹12,450" does
not, and the axis silently clips it.

Aggregate client-side from `orders` where `supplierRef == me` and `placedAt` within the range. That
is a real read cost at volume; cap the range at 30 days and say so on the toggle.

### `InventoryAlerts`

**Alerts are derived, never stored.** An item is low-stock when `currentStock < minimumStock`, and
expiring when `expiryDate` is within 3 days. A stored `alertType` field goes stale the instant
stock changes without the alert being recomputed, and a supplier acting on a stale alert reorders
something they already have.

Each row: `IconTile` (`turmeric` for low stock, `chili` for expiring), product name, the reason in
plain words ("5 kg left, minimum 10 kg" — not "LOW_STOCK"), and a Restock button.

Show nothing at all when there are no alerts. An "All good" card that is present most of the time
trains people to skip the region where the real alerts appear.

---

## `/supplier/orders` — `SupplierOrders`

```
PageShell(title: 'Orders', navIndex: 1)
├── TabBar: New · Confirmed · Out for delivery · Delivered
├── SegmentedControl: Individual · Mandi Pools
├── Individual: ListView of SupplierOrderCard
└── Pools:      ListView of PoolCard
```

**Query:** `orders` where `supplierRef == me` and `status == <tab>`, ordered by `placedAt` desc.

`SupplierOrderCard`: order number, vendor name and location, item count, `formatRupees(totalAmount)`,
delivery slot, route name when assigned, `timeAgo(placedAt)`, and the action for the current status:

| Status | Action |
|---|---|
| `pending` | Accept / Decline |
| `confirmed` | Mark packed |
| `packed` | Assign to route |
| `out-for-delivery` | Mark delivered |
| `delivered` | — |

One action per status, and the security rules allow the supplier to change only `status`,
`deliveredAt`, `routeRef`, `deliverySlot` and `paymentStatus`. They cannot edit items or totals —
an order is a record of what was agreed, not a working document.

Tapping the card opens the full item list. **Show quantities prominently**; a supplier picking
stock reads this on a phone in a warehouse, and the quantity is the only number that matters at
that moment.

### `PoolCard`

Mandi Pools — several stalls buying together so one delivery serves all of them.

Pool name, `{vendorCount} vendors`, pickup point, the aggregated item list with quantities,
`formatRupees(totalAmount)`, delivery window, and `StatusChip(priority, tone)`.

The aggregated quantities are the point of the whole module: "Potatoes 100 kg" as one line, not
eight vendors' rows to add up. Render the total per item large, and the per-vendor breakdown behind
a disclosure.

---

## `/supplier/inventory` — `SupplierInventory`

```
PageShell(title: 'Inventory', navIndex: 2)
├── SearchField
├── Filter chips: All · Low stock · Expiring · by category
├── AppButton('Add product', primary)
└── ListView of InventoryRow
```

**Query:** `inventory` where `supplierRef == me`, ordered by `productName`.

`InventoryRow`: product name, category chip, `{currentStock} {unit}` with a progress bar against
`minimumStock`, cost and selling price, margin, `timeUntil(expiryDate)` when set, and an edit
button.

The stock bar is `chili` below minimum, `turmeric` within 25% of it, `leaf` above. This is the one
place in the app where a colour carries information on its own — pair it with the numeric value
beside it, so it still works for a colour-blind user and in bright sunlight on a market street.

**Editing stock is the most frequent action on this screen.** Put a `−` / `+` stepper directly in
the row rather than behind an edit sheet. A supplier adjusting twelve items should not open twelve
sheets.

`AddProductSheet` writes to `inventory`. Offer "Also list as a deal" — creating a `deals` document
from the same fields — because stock that is not listed cannot be bought, and that gap is invisible
from this screen.

---

## `/supplier/deliveries` — `SupplierDeliveries`

```
PageShell(title: 'Deliveries', navIndex: 3)
├── SegmentedControl: Routes · Pickup points
├── Routes: ListView of RouteCard
└── Points: ListView of PickupPointCard
```

**Query:** `deliveryRoutes` where `supplierRef == me`, ordered by `scheduledFor`.

`RouteCard`: route name, `StatusChip(status)` — `active` `leaf`, `planned` `turmeric`,
`completed` `inkMedium` — `{totalDistanceKm} km`, `{estimatedMinutes} mins`, `{stops.length} stops`,
and an expandable stop list showing each stop's name with a completion tick.

Tapping a stop marks it complete and advances the route. **Confirm before marking complete** —
this is a one-way action on a phone being used while driving, and an accidental tap marks an
undelivered order delivered.

`PickupPointCard`: name, address, `StatusChip(status)`, `{completedOrders}/{totalOrders}`, and a
Directions button opening the coordinates in the device's map app via `url_launcher`.

Pickup points are staffed collection points where vendors collect rather than each getting a drop —
they are operations-managed, and the security rules make them read-only for the app. Do not add an
edit button; there is nothing behind it.

---

## What is deliberately absent

- **No supplier-side chat.** The React app has no supplier messaging, and adding it means a chat
  UI with no counterpart flow on the vendor side. Orders carry the conversation for now.
- **No pricing analytics beyond top products.** "Vendors who viewed this also bought" needs event
  data this app does not collect. Do not fabricate the panel for the demo — a chart with invented
  numbers on a supplier's business screen is the kind of thing that gets believed.
