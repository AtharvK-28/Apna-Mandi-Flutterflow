# Apna Mandi — FlutterFlow Build Kit

This folder is a **build kit for rebuilding Apna Mandi as a native FlutterFlow app**.
Nothing here touches the React SPA in `src/` — that app keeps running exactly as it does today.
Treat the React app as the reference implementation and this folder as the port spec.

FlutterFlow is a hosted visual builder, so this kit cannot click through its canvas for you.
What it *does* give you is everything the canvas asks for, pre-decided and pre-written:
theme hex values, Firestore collection schemas, page-by-page widget trees, and the
Dart custom code ready to paste into **Custom Code → Custom Actions / Functions / Widgets**.

## What's here

| File | What it gives you |
|---|---|
| [00-SETUP.md](00-SETUP.md) | Project creation, Firebase link, Phone Auth, packages, project settings |
| [01-DESIGN-SYSTEM.md](01-DESIGN-SYSTEM.md) | Every theme colour in hex (light + dark), typography, radii, component styles |
| [02-DATA-SCHEMA.md](02-DATA-SCHEMA.md) | Firestore collections, field types as FlutterFlow declares them |
| [03-APP-STATE.md](03-APP-STATE.md) | App State variables, constants, enums |
| [04-NAVIGATION.md](04-NAVIGATION.md) | Route table, role gating, per-role nav bars |
| [05-PAGES-VENDOR.md](05-PAGES-VENDOR.md) | 9 vendor pages, widget tree by widget tree |
| [06-PAGES-KARIGAR.md](06-PAGES-KARIGAR.md) | 4 karigar pages |
| [07-PAGES-SUPPLIER.md](07-PAGES-SUPPLIER.md) | 4 supplier pages |
| [08-PAGES-SHARED.md](08-PAGES-SHARED.md) | Login/OTP, Profile, 404 |
| [09-COMPONENTS.md](09-COMPONENTS.md) | Reusable FlutterFlow components shared across pages |
| [10-BUILD-ORDER.md](10-BUILD-ORDER.md) | Sprint-by-sprint checklist — start here once setup is done |
| `firebase/` | Security rules, composite indexes, and a seed script matching the React mock data |
| `custom-code/` | Dart for custom actions, functions and widgets — paste as-is |

## Build order (short version)

1. `00-SETUP.md` — create the project, link Firebase, enable Phone Auth.
2. `01-DESIGN-SYSTEM.md` — set the theme **before** building any page. Retrofitting colour is the single
   biggest time sink in a FlutterFlow port.
3. `02-DATA-SCHEMA.md` + `firebase/` — create collections, deploy rules, import seed data.
4. `custom-code/` — paste all custom functions first; pages reference them.
5. `09-COMPONENTS.md` — build shared components before pages that use them.
6. `04-NAVIGATION.md`, then the page files in whatever order `10-BUILD-ORDER.md` suggests.

## Rules carried over from the React app

These are not style preferences — each one exists because breaking it caused a real bug.
They are restated per-file where they apply, and the reasoning lives in the repo's `CLAUDE.md`.

- **Roles are config, not conditionals.** One place decides landing route, nav and capability
  per role (`custom-code/custom-functions/roleConfig.dart`). Never write `if role == 'vendor'`
  inline in a page.
- **Theme tokens only.** Never pick a raw colour from FlutterFlow's colour wheel. Every colour
  must come from the named theme entries in `01-DESIGN-SYSTEM.md`, or it will not flip in dark mode.
- **No emoji in the UI.** Use an icon in a brand-tinted container.
- **Vyapaar Readiness Score is not a credit score.** The wording constraints in
  `05-PAGES-VENDOR.md` are regulatory, not cosmetic. Read that section before touching the card.
- **Offline covers reading only.** There is no write replay. Do not add copy promising that an
  order placed offline will send later.
