# 08 — Shared Pages

Login, Profile, and the 404. Reached by every role.

---

## `/login` — `LoginPage`

**Guard:** none — this is where the guard sends people.

Three steps on one page, driven by a `step` page-state variable: `role` → `phone` → `otp` →
(new users) `register`.

### Step 1 — role

```
├── Logo + 'Apna Mandi' (Display Large)
├── 'India's street food economy, in one app' (Body Large, inkMedium)
├── LanguageToggle: English · हिंदी · मराठी
├── Column of RoleCard ×3
└── TextButton('Browse without an account') → sets isGuest, goes to /home
```

`RoleCard`: `IconTile(roleIcon(role), 'terracotta', 56)`, `roleLabel(role)` in Headline Medium,
`roleLabelHi(role)` in Body Small beside it, `roleTagline(role)` underneath, chevron on the right.

**Show both the English and Devanagari labels together**, not one or the other behind the language
toggle. Someone who reads only Devanagari and someone who reads only English are both choosing on
this screen, before any language preference has been set.

**The guest path is a first-class option, not fine print.** `/home`, `/deals` and `/khau-galli`
work without an account, and a vendor evaluating the app in thirty seconds between customers will
not create one first.

### Step 2 — phone

```
├── Back to role
├── 'Your phone number' (Display Small)
├── 'We'll send a 6-digit code' (Body Medium)
├── PhoneField: fixed '+91' prefix · 10-digit numeric field
├── AppButton('Send code', primary, fullWidth, loading during send)
└── PrivacyNote
```

Fix the `+91` as a non-editable prefix and accept exactly 10 digits. Every user of this app is in
India, and a full international picker is a field to get wrong for no benefit. Format as
`98765 43210` while typing.

Firebase Phone Auth → `verifyPhoneNumber`. On the web build this triggers reCAPTCHA; test it early,
because it is the single most common thing to discover broken on demo day.

**Register the three demo numbers as Firebase Auth test numbers** (see `00-SETUP.md`). Real SMS has
a small free quota and can be slow — relying on it during a pitch is an avoidable risk.

### Step 3 — OTP

```
├── 'Enter the code' · 'Sent to +91 98765 43210' with an Edit link
├── OtpField — 6 boxes, auto-advance, paste-aware
├── Resend countdown: 'Resend in 0:45' → 'Resend code'
└── AppButton('Verify', primary, fullWidth)
```

The Edit link matters. A mistyped digit in a phone number is the most common failure here, and
without a way back the user must abandon and restart.

**On success:**

1. Read `users/{uid}`.
2. Missing, or `role` empty → step 4.
3. Otherwise set `FFAppState().userRole`, then navigate to `resumePendingRoute()` if it returns
   something, else `homeRouteForRole(role)`.

Honouring `pendingRoute` is what makes a shared deep link work: the guard stored where they were
going, and this is where it gets used and cleared.

### Step 4 — register

Fields by role, matching `02-DATA-SCHEMA.md`:

| Role | Fields |
|---|---|
| Vendor | Your name, Stall name, Cuisine type, Location |
| Karigar | Your name, Age, Skills (multi-select), Hourly rate, Availability, Short bio |
| Supplier | Your name, Business name, GST number (optional), Delivery areas (multi-select) |

**Multi-select fields hold an array.** Bind them to a `List<String>`, initialise to `[]`, and
validate with `.length > 0` — never against a string default. An empty list is truthy, so a
`|| ''` fallback silently passes validation with nothing selected.

`role` is settable exactly once, here. The security rules block changing it afterwards: every gig,
order and chat references this user as one kind of user, and switching role strands all of them.

Mark GST optional and say why in the helper text — most small wholesalers are below the
registration threshold, and an unexplained blank field reads as "you are not eligible".

---

## `/profile` — `ProfilePage`

**Guard:** `['vendor', 'karigar', 'supplier']`.

```
PageShell(title: 'Profile', showBack: true)
└── ListView
    ├── ProfileHeader — photo, displayName or a prompt, role chip, phone, rating
    ├── RoleSpecificCards
    ├── SectionHeader('Settings')
    │   ├── ThemeSetting
    │   ├── LanguageSetting
    │   ├── VoiceSetting          ← see the privacy note below
    │   └── NotificationSetting
    ├── SectionHeader('Support') — Help, Terms, Privacy, About
    └── AppButton('Sign out', danger, fullWidth)
```

### `ProfileHeader` and the missing name

There is no placeholder identity in this app. An unnamed user has `displayName == null`, and this
screen decides what to do about it: show "Add your name" as a tappable prompt in `terracotta`, not
"User" or "Vendor" rendered as though it were their name.

A fabricated name is worse than a blank. It looks like the app has confused them with someone else.

### Role-specific cards

| Role | Cards |
|---|---|
| Vendor | `CartWarisCard` (nominate who runs the stall if you cannot), `SwachhBadgeCard` (hygiene grade + audit date), Vyapaar summary → `/dashboard` |
| Karigar | `HunarProfileCard` (verified skills, total gigs, rating), availability, hourly rate |
| Supplier | Business details, delivery areas, verification status |

`SwachhBadgeCard` renders nothing when `hygieneGrade` is null. An un-audited stall must never be
displayed as failing.

### `VoiceSetting` — and the sentence that must stay next to it

```
├── Switch: 'Voice input'  → users.voiceEnabled + FFAppState().voiceEnabled
├── Dropdown: 'Speech language' — English · हिंदी · मराठी → speechLanguage
└── Body Small, inkMedium, directly beneath:
    'On the web, dictated audio is sent to Google for transcription.'
```

**That sentence is not optional and does not move.** Chrome sends dictated audio to Google. Stating
it next to the switch — where the decision is made — rather than in a policy page nobody opens is
the difference between informed consent and a dark pattern.

Voice defaults to **off**. A microphone feature that turns itself on is a feature people uninstall
the app over.

Hide the whole section when `isDictationAvailable()` is false. A setting for something the device
cannot do is a support ticket waiting to happen.

### Language vs read-aloud

`speechLanguage` governs **dictation only**. Read-aloud is always `en-IN`, because the summaries in
`speechText.dart` are generated in English and a hi-IN voice reading English words is close to
unintelligible. If the setting row implies it controls both, users will report read-aloud as broken.

### Sign out

`ConfirmSheet` first, then Firebase sign-out, clear `userRole`, `isGuest`, `pendingRoute`, and
navigate to `/login`.

**Do not clear `cartItems`.** It is keyed to the device, not the session, and a vendor who signs
out to hand the phone to their partner should not lose the morning's basket. Clear it on sign-out
only if the next sign-in is a different uid — check that in `SplashRouter`.

---

## `NotFoundPage`

**Guard:** none.

`EmptyState('search_off', 'Page not found', "This page doesn't exist, or it moved.", 'Go home')`.

The button goes to `/` — `SplashRouter`, which routes each role to their own front door. Hardcoding
`/home` here sends a karigar to a vendor screen and straight into a guard bounce, which looks like
the app is fighting them.

---

## What a guest can and cannot do

| Screen | Guest |
|---|---|
| `/home` | Yes, minus Bolo Mandi and Mandi Pools |
| `/deals` | Yes, browse only — "Add" prompts sign-in |
| `/khau-galli` | Yes, fully |
| Everything else | Redirected to `/login` |

Every gated action a guest can see must explain **what signing in gets them**, not merely that they
must. "Sign in to order from Fresh Harvest Co." beats "Please sign in."
