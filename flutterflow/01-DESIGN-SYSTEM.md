# 01 — Design System

Set this up **before building any page.** FlutterFlow lets you pick a colour anywhere from a colour
wheel, and every colour picked that way is a fixed value that will not flip in dark mode. Retrofitting
theme colours across finished pages is the single biggest time sink in a port like this.

Values below are the exact HSL tokens from `src/styles/index.css`, converted to hex.

## Custom colours

FlutterFlow's built-in theme slots (Primary, Secondary, Tertiary, Alternate, Primary Background…)
are too few for this palette. Create these under **Theme Settings → Colors → Custom Colors**, each
with a Light and a Dark value. Naming them exactly as below means a spec line like
`bg: paperLight` maps to one click.

### Brand palette

| Name | Light | Dark | Used for |
|---|---|---|---|
| `paper` | `#F4EBDC` | `#17110C` | Page background |
| `paperLight` | `#FFFEFA` | `#231B15` | Card / sheet / popover surface |
| `paperDark` | `#E8DCC9` | `#362D26` | Borders, dividers, input outlines |
| `ink` | `#2C2016` | `#F0EAE0` | Primary text |
| `inkLight` | `#6B5A47` | `#C9BEB1` | Secondary text |
| `inkMedium` | `#897761` | `#A29486` | Muted text, placeholders, captions |
| `terracotta` | `#C1532F` | `#DA653E` | Primary action, brand |
| `terracottaLight` | `#F9E7DC` | `#3B2016` | Tinted icon tiles, primary chips |
| `terracottaDark` | `#9C3C1C` | `#EF916C` | Text/icon **on** `terracottaLight` |
| `turmeric` | `#E3A53B` | `#EAAB3E` | Secondary, warning, ratings |
| `turmericLight` | `#FAECD1` | `#392B13` | Warning chip background |
| `turmericDark` | `#9C6511` | `#F1BD55` | Text/icon **on** `turmericLight` |
| `leaf` | `#6E9150` | `#7DA857` | Success, "in stock", fresh |
| `leafLight` | `#E4EDD9` | `#202A18` | Success chip background |
| `leafDark` | `#4F7237` | `#97C775` | Text/icon **on** `leafLight` |
| `chili` | `#BF3A2B` | `#DD5040` | Urgent, error, destructive |
| `chiliLight` | `#FBDFDB` | `#391814` | Urgent chip background |

### Semantic aliases

Same values, second name. Worth creating because page specs read better as `surface` than `paperLight`.

| Name | Light | Dark |
|---|---|---|
| `onPrimary` | `#FFFDFA` | `#FFFDFA` |
| `muted` | `#E9E0D2` | `#2E251F` |
| `destructive` | `#C3392C` | `#D03D2F` |
| `success` | `#5C8349` | `#6E9F56` |

### The pairing rule that keeps dark mode readable

Notice that `terracottaLight` is a *pale tint* in light mode and a *deep tint* in dark mode, while
`terracottaDark` inverts the other way. That is deliberate: the pair
**`background: xLight` + `foreground: xDark`** stays legible in both themes automatically.

Always use them as a pair. A chip with `background: leafLight` and hardcoded dark-green text
becomes unreadable in dark mode, where `leafLight` is nearly black.

### Also set the built-in slots

Some FlutterFlow widgets (date pickers, default dialogs) read the built-in slots and ignore custom
colours. Point them at the same values so those widgets do not appear in stock Material blue:

| Built-in slot | Light | Dark |
|---|---|---|
| Primary | `#C1532F` | `#DA653E` |
| Secondary | `#E3A53B` | `#EAAB3E` |
| Tertiary | `#6E9150` | `#7DA857` |
| Alternate | `#E8DCC9` | `#362D26` |
| Primary Background | `#F4EBDC` | `#17110C` |
| Secondary Background | `#FFFEFA` | `#231B15` |
| Primary Text | `#2C2016` | `#F0EAE0` |
| Secondary Text | `#897761` | `#A29486` |
| Error | `#C3392C` | `#D03D2F` |
| Success | `#5C8349` | `#6E9F56` |
| Warning | `#E3A53B` | `#EAAB3E` |
| Info | `#6B5A47` | `#C9BEB1` |

## Typography

Theme Settings → Typography. Two families: **Baloo 2** for display/headings, **Mukta** for body.
Both cover Devanagari, which the FlutterFlow defaults do not.

| Style | Font | Size | Weight | Line height | Colour | Used for |
|---|---|---|---|---|---|---|
| Display Large | Baloo 2 | 34 | 700 | 1.2 | `ink` | Login hero only |
| Display Medium | Baloo 2 | 28 | 700 | 1.2 | `ink` | Page title in `PageShell` |
| Display Small | Baloo 2 | 22 | 600 | 1.3 | `ink` | Section headings |
| Headline Medium | Baloo 2 | 20 | 600 | 1.3 | `ink` | Card titles |
| Headline Small | Baloo 2 | 17 | 600 | 1.4 | `ink` | List item titles |
| Title Medium | Mukta | 16 | 600 | 1.4 | `ink` | Buttons, tab labels |
| Body Large | Mukta | 16 | 400 | 1.6 | `ink` | Body copy |
| Body Medium | Mukta | 14 | 400 | 1.6 | `inkLight` | Secondary copy |
| Body Small | Mukta | 13 | 400 | 1.5 | `inkMedium` | Captions, timestamps, "200m away" |
| Label Medium | Mukta | 12 | 600 | 1.3 | `inkMedium` | Chip text, field labels, overlines |

Prices are the exception: **Mukta 600 weight**, one step larger than the surrounding body, in
`ink` — never in `terracotta`. Colouring every price as brand-primary makes a screen of deals read
as a screen of alarms.

## Shape, spacing, elevation

- **Corner radius `12`** on cards, buttons, inputs, chips, sheets. This is `--radius: 0.75rem`.
  Two exceptions: full-round (`999`) on avatars and status dots, and `20` on bottom sheets.
- **Spacing scale: 4, 8, 12, 16, 24, 32.** Page horizontal padding is `16`; card internal padding
  is `16`; the gap between stacked cards is `12`.
- **Elevation 0 everywhere.** Depth comes from a `1px` `paperDark` border, not a shadow. Material
  shadows on a warm paper background go muddy grey. The one exception is `FloatingCartButton`,
  which needs elevation `6` to separate from scrolling content.
- **Max content width `560`** on tablet/web, centred. Without this, cards stretch edge to edge on a
  laptop and the app stops looking designed.

## The warm background wash

The React app paints two soft radial gradients over the page background. Reproduce it once, on the
`PageShell` component's outer Container, as a `Gradient` fill:

- Base `paper`
- Radial, top-right, `turmeric` at 7% opacity → transparent
- Radial, top-left, `terracotta` at 5% opacity → transparent

FlutterFlow allows one gradient per container, so stack two Containers to get both, or accept a
single top-right `turmeric` wash. It is subtle by design — large flat paper surfaces read as
"unfinished" without it.

## Icons

The React app resolves icons by name from `lucide-react`. FlutterFlow ships Material Icons and
Font Awesome. **Do not hunt for pixel-perfect Lucide equivalents** — pick the closest Material
outlined icon and stay consistent. The mapping used across the page specs:

| Meaning | React (Lucide) | FlutterFlow (Material) |
|---|---|---|
| Vendor | `Store` | `storefront` |
| Karigar | `Wrench` | `handyman` |
| Supplier | `Truck` | `local_shipping` |
| Home | `Home` | `home_outlined` |
| Deals | `Tag` | `sell_outlined` |
| Exchange | `RefreshCw` | `swap_horiz` |
| Virasaat | `Crown` | `workspace_premium` |
| Dashboard | `BarChart3` | `bar_chart` |
| Cart | `ShoppingCart` | `shopping_cart_outlined` |
| Orders | `ClipboardList` | `receipt_long` |
| Find work | `Search` | `search` |
| Earnings | `IndianRupee` | `currency_rupee` |
| Messages | `MessageSquare` | `chat_bubble_outline` |
| Inventory | `Package` | `inventory_2_outlined` |
| Khau Galli | `MapPin` | `place_outlined` |
| Rating | `Star` | `star_rounded` |
| Urgent | `Zap` | `bolt` |
| Verified | `ShieldCheck` | `verified_user` |
| Voice / speak | `Volume2` | `volume_up` |
| Mic | `Mic` | `mic_none` |

Icons in a tinted tile follow one pattern everywhere: a `40×40` Container, radius `12`,
background `<brand>Light`, icon size `20`, colour `<brand>Dark`.

## No emoji

Not a style preference. Emoji render differently on every platform, cannot be recoloured to match
the theme, and are announced unpredictably by screen readers. Use the icon-in-a-tile pattern above.
