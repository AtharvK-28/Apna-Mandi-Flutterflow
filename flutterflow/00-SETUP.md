# 00 — Project Setup

Everything in this file happens once, before any page exists.

## 1. Create the FlutterFlow project

| Setting | Value | Why |
|---|---|---|
| Project name | `apna-mandi` | |
| Package name | `com.apnamandi.app` | Must match the Firebase Android app exactly |
| Template | **Blank** | Any starter template ships its own theme and nav, both of which you then have to delete |
| Platforms | Android, iOS, Web | Web matters — the current product is a PWA and the pitch demo runs in a browser |
| State management | Default (FlutterFlow-managed) | |

**Project name is not the display name.** Set the display name to `Apna Mandi` under
Settings → General → App Details, so the launcher and the browser tab read correctly.

## 2. Firebase

Create the Firebase project first at console.firebase.google.com, then connect it from
FlutterFlow (Settings → Firebase → *Enter your Firebase project ID* → **Auto-generate config files**).

Enable in the Firebase console:

- **Authentication → Sign-in method → Phone.** This is the only method the app uses.
  Under *Phone numbers for testing*, add the demo pairs so a pitch demo never waits on a real SMS:

  | Role | Phone | Code |
  |---|---|---|
  | Vendor | `+91 9876543210` | `123456` |
  | Karigar | `+91 9876543212` | `111111` |
  | Supplier | `+91 9876543211` | `654321` |

  These are the same pairs the React app hardcodes, so demo scripts and screenshots stay valid.
  Test numbers bypass SMS entirely and are free — the real quota is small, so relying on live
  SMS during a demo is a genuine failure risk.

- **Firestore Database → Create database → production mode**, region `asia-south1` (Mumbai).
  Region cannot be changed later, and every user of this app is in India.

- **Storage** — needed for vendor stall photos, karigar profile photos and Virasaat product shots.

Then in FlutterFlow: Settings → Authentication → **Enable Authentication**, provider **Phone**,
`Logged In` page = `SplashRouter`, `Logged Out` page = `LoginPage`.
Do not set the logged-in page to a role's home — which home depends on the role, and that decision
belongs to `SplashRouter` (see [04-NAVIGATION.md](04-NAVIGATION.md)).

## 3. Firestore rules and indexes

Deploy from `firebase/` in this folder rather than editing rules in the console — the console has no
version history worth relying on.

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes --project <your-project-id>
```

FlutterFlow also writes rules when you create collections in its UI. **It will overwrite yours.**
Create the collections in FlutterFlow first, then deploy `firebase/firestore.rules` last.

## 4. Packages

Add under Settings → App Settings → **Dependencies → pub.dev packages**. Only these; each is
pulled in by a specific custom action or widget in `custom-code/`.

| Package | Version | Used by |
|---|---|---|
| `flutter_tts` | `^4.2.0` | `speakText` action — read-aloud |
| `speech_to_text` | `^7.0.0` | `startDictation` action — voice input |
| `intl` | `^0.19.0` | `formatRupees`, `timeAgo` functions |
| `connectivity_plus` | `^6.1.0` | `ConnectionBanner` widget |
| `fl_chart` | `^0.69.0` | Supplier revenue chart, earnings chart |
| `url_launcher` | `^6.3.0` | "Call vendor" / "Call karigar" buttons |

`intl` and `url_launcher` may already be present — FlutterFlow includes them for some widgets.
Adding a duplicate is a build error, so check the existing list before adding.

## 5. Permissions

Settings → App Settings → **Permissions**:

| Permission | Rationale string (shown to the user) |
|---|---|
| Microphone | `Apna Mandi uses your microphone so you can speak instead of typing.` |
| Location | `Apna Mandi uses your location to show deals, gigs and stalls near you.` |
| Camera | `Apna Mandi uses your camera to add photos of your stall and stock.` |
| Photo Library | `Apna Mandi uses your photos to add pictures of your stall and stock.` |

iOS rejects a build with an empty usage string, and a vague one ("needs microphone access") is a
common App Store review rejection. Write what it is *for*.

## 6. Localisation

Settings → App Settings → **Localization**. Enable `English (en)`, `Hindi (hi)`, `Marathi (mr)`.
Set `en` as the default.

Do not translate every string in the first pass. The React app localises the login screen and the
role labels only; the rest is English with Hindi vocabulary carried in the product names
("Karigar", "Virasaat", "Mandi Pool", "Khau Galli"). Those are **names, not words to translate** —
leave them identical in all three locales.

## 7. Project-wide settings worth changing now

- **Settings → General → Default Font**: `Mukta`. Headings use `Baloo 2` — both are on Google Fonts,
  both cover Devanagari. A font without Devanagari coverage renders Hindi as tofu boxes, and
  FlutterFlow's default `Roboto`/`Inter` do not cover it.
- **Settings → General → Theme Mode**: `System`, with dark mode enabled.
- **Settings → App Settings → Web → PWA**: enable, so the browser build stays installable like the
  current one. Name `Apna Mandi`, short name `Apna Mandi`, theme colour `#C1532F`.
- **Settings → App Details → App Icon**: generate from `../public/icon.svg` — do not redraw it.
