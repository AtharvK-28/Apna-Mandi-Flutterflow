# Apna Mandi — Pitch Deck Source Document

> **How to use this file:** Upload this markdown into NotebookLM (or paste it in) and ask it to generate a slide-by-slide pitch deck script/outline from the 16 sections below. Market sizing, competitor data, industry growth rates, and regulatory details have been researched and cited with sources (July 2026). The financial projections (Sections 10–12) are a worked illustrative model built from those sourced figures, with explicit assumptions you should tune once you have real internal cost data. Only two things remain genuinely founder-specific and can't be researched externally: the **funding ask** (Section 1) and the **team/founders** (Section 15) — fill those in directly.

---

## 1. Executive Summary

**Company:** Apna Mandi ("Our Marketplace")

**Elevator pitch:** Apna Mandi is a mobile-first marketplace platform built for India's street food economy — connecting street food vendors, skilled kitchen workers ("Karigars"), raw-material suppliers, and everyday customers in one ecosystem. It digitizes four things that today happen informally, inefficiently, and offline: hiring temporary kitchen help, sourcing/trading raw materials between vendors, procuring supplies from wholesalers, and monetizing generations-old recipe secrets as branded products.

**Problem:** Street food vendors — one of India's largest informal-economy workforces — run high-friction, cash-only, word-of-mouth operations with no digital tools for staffing, sourcing, or brand-building.

**Solution:** A single app with four integrated modules:
- **Karigar Connect** — on-demand gig marketplace for kitchen help (e.g., a wok master to cover a shift, an extra hand for bulk chopping, a "dosa master" to train a vendor on a new skill).
- **Vendor Exchange** — peer-to-peer marketplace where vendors buy, sell, or barter surplus/perishable stock with nearby vendors instead of letting it spoil or scrambling for last-minute supply.
- **Virasaat** ("heritage/legacy") — a storytelling-driven commerce module that helps vendors license and sell their secret spice blends/recipes as branded packaged products, turning oral tradition into IP and recurring revenue.
- **Supplier / Deal Discovery marketplace** — vendor-to-supplier procurement with deal discovery, cart/checkout, order tracking, and dashboards for both vendors and suppliers.

**Target market:** India's street food vendor population (commonly cited at ~10 million+ vendors nationally), plus the adjacent supplier/wholesaler network and a growing base of consumers seeking authentic regional food products.

**Ask [VALIDATE]:** *Insert funding amount being raised, use of funds, and current stage (pre-seed/seed/etc.) here.*

---

## 2. Problem Statement

Street food vendors in India operate one of the largest informal economies in the world, but face structural problems that have never been solved with technology:

1. **Staffing is manual and unreliable.** When a vendor is short-staffed (illness, festival rush, needing a specialized skill like a wok technique or a dosa tawa), there is no way to quickly find and hire vetted, skilled help nearby. Today this relies entirely on personal networks.
2. **Perishable stock is wasted or under-supplied.** Vendors frequently have surplus stock (a slow rainy day, over-preparation) that spoils, while a nearby vendor may be in urgent shortage (e.g., out of onions or lemons) the same day. There is no real-time local channel to match this supply and demand.
3. **Procurement is fragmented and opaque.** Sourcing raw materials from suppliers/wholesalers involves manual negotiation, no price discovery, and no order tracking — vendors can't easily compare deals or track delivery status.
4. **Generational recipes are an untapped, undocumented asset.** Many vendors have a legendary, word-of-mouth "secret ingredient" (a masala blend, a chutney, a spice mix) that built their local reputation, but they have no way to package, brand, protect, or monetize it beyond their own stall — the knowledge and brand equity dies with the cart.
5. **No formal business tooling.** No dashboards, no order history, no digital record of transactions — everything is cash and memory-based, which also blocks access to credit, insurance, and formal-economy benefits.

**Why now:** Rising smartphone penetration among India's informal workforce, government pushes for informal-sector digitization (e.g., PM SVANidhi vendor micro-credit scheme), and growing consumer demand for "authentic"/heritage food products create the conditions for a vendor-first digital layer.

---

## 3. Solution / Product

Apna Mandi is a single web/mobile platform (React SPA) with role-based experiences for **Vendors**, **Karigars** (skilled kitchen workers/suppliers of labor), and **Suppliers**, plus a customer-facing storefront layer. Core modules:

### Karigar Connect
A gig-economy marketplace purpose-built for kitchen work. Vendors post short-term or one-off jobs (e.g., "Chinese Wok Master needed — urgent," "Juice Stall Cover," "Bulk Veg Chopping — 20kg") with pay, location, distance, and urgency. Karigars browse and apply; vendors can also browse available Karigars' profiles and message them directly to hire. Solves the "I need reliable, skilled help right now" problem with a real-time, location-aware board.

### Vendor Exchange
A vendor-to-vendor barter and trade marketplace for surplus or urgently needed ingredients/stock — e.g., a vendor with excess vegetables lists them at a discount before end of day, while another vendor posts an urgent need for lemons within 2 hours. Reduces spoilage/waste and helps vendors cover shortfalls without a supplier order cycle. Supports both direct sale and trade/barter proposals.

### Virasaat (Heritage Commerce)
A storytelling + e-commerce module that helps vendors turn a signature recipe (a spice blend, chutney, masala) into a packaged, branded product with a named story (e.g., "Thatha's Sambhar Secret," "Abdul Bhai ka Raaz"). This creates a new, scalable revenue line for vendors beyond their physical cart — shipping nationally/internationally rather than being limited to foot traffic at one stall.

### Vendor–Supplier Procurement
Deal discovery and shopping for vendors to source raw materials from suppliers, with a cart/checkout flow, order tracking & history, and separate dashboards for vendors and suppliers to manage listings, orders, and performance.

### Platform-wide
Persistent cart across the app (with a global floating cart button), light/dark theme support, and a unified authentication flow supporting three user types (Vendor, Karigar, Supplier) with OTP-based signup/login.

---

## 4. Novelty / Unique Value Proposition (USP)

- **Only platform bundling labor, inventory, procurement, and IP monetization for street vendors in one app.** Existing food-tech and gig platforms typically solve one problem (either gig staffing *or* B2B ordering *or* D2C food sales) — Apna Mandi is vendor-first across all four.
- **Hyperlocal, real-time matching for both people (Karigars) and perishable goods (Vendor Exchange)** — built around urgency and proximity, which generic marketplaces (OLX, WhatsApp groups) don't structure or surface well.
- **Turns oral tradition into a brand asset (Virasaat).** No incumbent platform is positioned to help an individual street vendor license and scale a recipe as a packaged, story-branded product — this is a genuinely novel monetization layer for the informal sector.
- **Bottom-up digitization of the informal economy** — creates a transaction and reputation trail (orders, gigs completed, ratings) for a population that is otherwise invisible to formal credit, insurance, and supply-chain systems, positioning Apna Mandi as future-facing infrastructure (e.g., for embedded finance) as well as a marketplace.
- **Community-first network effects:** vendors, Karigars, and suppliers in the same neighborhood transact repeatedly across modules (a Karigar hired via Karigar Connect might also be a Vendor Exchange trading partner), increasing retention and switching cost versus single-purpose apps.

---

## 5. Target Market (TAM / SAM / SOM) — researched

**Base population figures (sourced):**
- India has an estimated **~10 million street vendors**, accounting for ~14% of total urban informal employment (widely cited government/NASVI estimate). *(Source: [NASVI — Indian Street Vendor Market](https://nasvinet.org/indian-street-vendor-market-the-sunrise-sector-of-food-tech/))*
- Under **PM SVANidhi**, 4.7 million vendors/families have been formally profiled as of Dec 2025, with the restructured scheme (approved Aug 2025) targeting **11.5 million** vendor beneficiaries by 2030 — i.e., the government's own working number for the addressable formal-outreach base is converging toward ~10–11.5 million. *(Source: [PIB — SVANidhi: Empowering Street Vendors, Dec 2025](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc20251220739401.pdf))*
- India's overall **street food market is estimated at ~USD 41 billion**, with daily street-vending trade estimated around **₹8,000 crore/day** (~USD 960M/day in aggregate vendor sales) — this is the vendor economy Apna Mandi sits on top of, not revenue the platform itself captures. *(Sources: [Business Standard](https://www.business-standard.com/content/press-releases-ani/gastronomix-transforms-the-street-food-landscape-a-usd-41b-industry-disrupted-by-innovation-124012000375_1.html), [NASVI](https://nasvinet.org/indian-street-vendor-market-the-sunrise-sector-of-food-tech/))*

**TAM (Total Addressable Market):** ~10 million street vendors nationally, sitting on top of a ~USD 41B street food trade economy, plus adjacent pools this multiplies against:
- Gig/labor pool: India's gig workforce is ~7.7M workers (2020–21), projected to reach **23.5 million by 2029–30** (NITI Aayog) — Karigar Connect draws from this growth curve. *(Source: [NITI Aayog gig economy policy brief](https://www.niti.gov.in/sites/default/files/2023-06/Policy_Brief_India's_Booming_Gig_and_Platform_Economy_27062022.pdf))*
- Recipe/IP monetization pool: India's blended-spices market alone is valued at **USD 941.9M (2025)**, growing at a **13.8% CAGR** — the addressable pool Virasaat converts vendor recipes into. *(Source: [Fortune Business Insights — Blended Spices Market](https://www.fortunebusinessinsights.com/blended-spices-market-114339))*
- **Combined TAM, conservatively:** low-single-digit-billion-USD annual opportunity across take-rates/commissions on gig pay, trade volume, procurement GMV, and Virasaat product revenue — not the full $41B vendor economy itself, but the layer of new/redirected spend the platform enables.

**SAM (Serviceable Addressable Market):** Vendors in smartphone-penetrated metro and tier-1/tier-2 cities where density supports hyperlocal matching (Mumbai, Delhi NCR, Bengaluru, Pune, Ahmedabad, Lucknow, etc.) — realistically **2–3 million vendors** (roughly a quarter to a third of the national base, concentrated in the highest-density urban clusters PM SVANidhi data already shows the heaviest registration in).

**SOM (Serviceable Obtainable Market):** Bottom-up, city-by-city:
- Year 1: 1 launch cluster (e.g., a Mumbai neighborhood corridor) — target **2,000–5,000 active vendors**, **300–500 active Karigars**, a handful of anchor Virasaat vendor-brands.
- Year 2–3: 3–5 cities — target **50,000–150,000 active vendors** cumulatively, assuming ~5–10% penetration of each city's registered vendor base (a penetration rate consistent with early-stage gig marketplaces like Apna/WorkIndia's city-level ramp before their national scale-up).

**Recommendation:** Keep the sourced TAM figures above for credibility, but replace the SAM/SOM ranges with your actual target-city vendor counts (available from local municipal Town Vending Committee data or PM SVANidhi city-level dashboards) once you've picked launch cities.

---

## 6. Competitor Analysis — researched

| Category | Competitors (with sourced data points) | What they do | Gap Apna Mandi fills |
|---|---|---|---|
| B2B vendor procurement | **Udaan** — ₹5,700 crore revenue (FY23-24), $1.99B total raised, $1.8B valuation (Series G, June 2025); **Jumbotail** — became a unicorn after a $120M Series D (June 2025, $1B valuation), now with Solv India serving 500,000+ small retailers across 400+ cities *(Sources: [Digital Commerce 360](https://www.digitalcommerce360.com/2023/12/15/indias-b2b-marketplace-udaan-raises-340-million/), [Caproasia](https://www.caproasia.com/2025/07/03/india-b2b-marketplace-retail-platform-jumbotail-raised-120-million-in-series-d-funding-at-1-billion-valuation-founded-in-2015-by-s-karthik-venkateswaran-ashish-jhina-investors-include-standard/))* | Wholesale sourcing for kirana/food/retail businesses | Neither is vendor-labor or recipe-IP focused; both carry heavier logistics/warehousing stacks than a single street cart needs — validates investor appetite for vendor-facing commerce infra at scale |
| Gig/blue-collar staffing | **WorkIndia** — 30M job seekers/100,000 businesses matched monthly, ₹65.8 crore revenue (2024, +21% YoY), reached **profitability in FY25** (first in blue-collar recruitment to do so); **Apna** — 16M+ users, unicorn within 21 months of launch, subscription-based employer model since 2022 *(Sources: [Inc42](https://inc42.com/buzz/workindia-raises-inr-97-cr-to-formalise-blue-collar-hiring-beyond-tier-i/), [Insidestartups](https://insidestartups.substack.com/p/apna-jobs-how-does-a-blue-collar))* | General blue-collar job-matching, not shift-by-shift or skill-specific | Neither is built for same-day, skill-specific kitchen gigs (a wok specialist, a dosa trainer) or urgency-based matching — they solve "find a job," not "cover my shift in 2 hours" |
| Local classifieds/barter | OLX, Facebook Marketplace, informal WhatsApp vendor groups | Generic buy/sell, no structure | No structure for perishables, urgency, or vendor-specific trust/verification |
| D2C heritage/artisan food brands | India's D2C food brand segment has grown **25%+ annually for three years**; brands like **Grannyways** are already proving the "heritage/authentic story" positioning works commercially *(Source: [Rare Ideas — D2C Food Brands 2025](https://rareideas.in/blog/why-indian-consumers-choose-d2c-food-brands-2025))* | Sell branded regional food products direct-to-consumer | These brands are typically built by outside founders/marketers *around* a heritage story — none originate from or share upside with the actual street vendor who created the recipe; no cart-to-brand pipeline exists |
| Vendor welfare/credit | PM SVANidhi (government), microfinance NBFCs | Micro-credit for vendors | Financial-only, no marketplace/commerce layer |

**Apna Mandi's whitespace:** Every adjacent category has well-funded, in some cases profitable or unicorn-status players — proving investor and consumer appetite for vendor-adjacent digital commerce and blue-collar gig platforms. But none combine hyperlocal gig staffing + surplus/perishables trading + procurement + recipe/IP monetization for the *same* street-vendor user base. Competitors are single-purpose; Apna Mandi is the vendor's operating system, capturing a slice of each of these already-proven, already-funded markets through one relationship.

---

## 7. Go-to-Market (GTM) Strategy

1. **Hyperlocal cluster launch:** Start in one dense vendor corridor (e.g., a Mumbai neighborhood cluster like Bandra–Dadar, reflected in current product data) where vendor density is high enough for Karigar Connect and Vendor Exchange to have immediate liquidity.
2. **Karigar-first supply seeding:** Recruit and onboard Karigars (skilled kitchen workers) first in each cluster so vendors see immediate value the first time they open the app (a populated gig/Karigar board, not an empty marketplace).
3. **Anchor "hero" vendors for Virasaat:** Identify a handful of vendors with genuinely famous local recipes to launch as flagship Virasaat brand stories — use their launch as press/social-content hooks (the in-app founder stories already demonstrate this narrative playbook).
4. **On-ground community managers / vendor associations:** Partner with local vendor unions/associations (e.g., NASVI-style bodies) and government schemes (PM SVANidhi) for trusted-channel onboarding, given the low digital literacy and trust barriers of the target segment.
5. **Referral loops between modules:** A Karigar hired through Karigar Connect becomes a candidate to also trade in Vendor Exchange or supply to Virasaat — cross-module activation drives organic growth without pure paid acquisition.
6. **Supplier-side B2B sales motion:** Direct outreach to wholesale suppliers to list on the procurement/deal-discovery module, creating the supply side vendors need for everyday sourcing.
7. **City-by-city expansion playbook:** Prove density/liquidity in city 1, then replicate the same cluster-first playbook in city 2–3 rather than expanding thin across many cities at once.

---

## 8. Business Model / Revenue Streams

Apna Mandi can monetize each module distinctly:

- **Karigar Connect:** Commission/service fee on completed gigs (percentage of gig pay), and/or a subscription for vendors who post frequently or want priority listing/urgent visibility.
- **Vendor Exchange:** Small transaction fee on completed trades/sales, or a freemium model where basic listing is free but boosted visibility (e.g., "Urgent" flagging, wider radius) is paid.
- **Virasaat:** Revenue share / licensing commission on each unit of a branded product sold through the platform, plus potential paid services (photography, label design, story production, logistics/shipping partnerships) — a higher-margin, higher-LTV product line than the gig/exchange modules.
- **Supplier procurement / Deal Discovery:** Take-rate commission on vendor-supplier transactions, and/or featured placement fees for suppliers wanting visibility in deal discovery.
- **Value-added services (future):** Embedded finance (working-capital credit informed by in-app transaction history), insurance, and premium vendor-dashboard analytics.

*(Business Model Canvas — key building blocks):*
- **Key Partners:** Vendor associations, PM SVANidhi/government schemes, wholesale suppliers, logistics/shipping partners (for Virasaat), payment gateway providers.
- **Key Activities:** Marketplace matching (gigs, trades), trust & verification, product/brand support for Virasaat, supplier onboarding.
- **Key Resources:** Vendor/Karigar/Supplier network, brand stories & IP relationships (Virasaat), technology platform.
- **Value Propositions:** See Section 4.
- **Customer Relationships:** Community-led onboarding, in-app messaging, ratings/reputation.
- **Channels:** Mobile/web app, on-ground community managers, vendor association partnerships, social content (Virasaat stories).
- **Customer Segments:** Street food vendors, skilled kitchen workers (Karigars), raw-material suppliers/wholesalers, end consumers (Virasaat storefront).
- **Cost Structure:** Engineering/product, on-ground community/ops teams per city, payment processing, logistics support for Virasaat shipping, marketing.
- **Revenue Streams:** Commissions (Karigar Connect, Vendor Exchange, procurement), licensing/revenue share (Virasaat), subscriptions/boosted listings.

---

## 9. Industry Growth Rate & Market Opportunity — researched, with citations

- **Gig/platform economy:** India's gig workforce grew from **7.7 million workers (2020–21)** and is projected to reach **23.5 million by 2029–30** — a **~3x increase in under a decade**, with gig workers rising from 1.5% to 4.1% of the total workforce. Karigar Connect sits directly inside this growth curve, targeting the "medium-skilled" gig segment (currently ~47% of gig work) that includes kitchen/food-service skills. *(Source: [NITI Aayog — India's Booming Gig and Platform Economy](https://www.niti.gov.in/sites/default/files/2023-06/Policy_Brief_India's_Booming_Gig_and_Platform_Economy_27062022.pdf); [IndiaTracker](https://www.indiatracker.in/story/india-has-77-million-gig-workers-will-triple-to-235-crore-by-2030-says-niti-aayog-report))*
- **B2B grocery/wholesale supply:** Udaan (₹5,700 crore FY23-24 revenue) and Jumbotail (unicorn status, $120M raised June 2025) show continued, large-scale venture capital appetite for vendor/kirana-facing commerce infrastructure even in 2025 — a mature but still well-capitalized category adjacent to Apna Mandi's procurement module. *(Sources as cited in Section 6.)*
- **D2C heritage/regional food:** D2C food brands in India have grown **25%+ year-over-year for three consecutive years**, and the blended-spices category specifically is growing at a **13.8% CAGR** (2025–2033), reaching an estimated **USD 941.9M market in 2025** — direct tailwind for Virasaat. India's broader spices market (₹221.83 thousand crore in 2025) is itself growing at a ~10.14% CAGR. *(Sources: [Rare Ideas](https://rareideas.in/blog/why-indian-consumers-choose-d2c-food-brands-2025), [Fortune Business Insights](https://www.fortunebusinessinsights.com/blended-spices-market-114339))*
- **Government policy tailwinds:** The restructured **PM SVANidhi** scheme (approved August 2025) is expanding its target beneficiary base to **11.5 million vendors** (up from ~4.7 million profiled as of Dec 2025) with lending extended to March 2030 — both a signal of continued government investment in formalizing this exact population, and a large primed-for-onboarding user base. *(Source: [PIB, Dec 2025](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc20251220739401.pdf))*

**Takeaway for the deck:** Every layer Apna Mandi touches — gig labor, B2B wholesale, D2C heritage food, and government-backed vendor formalization — is independently growing at double-digit-to-3x rates, and each has already produced funded/profitable/unicorn companies serving adjacent-but-not-identical user needs. This is evidence of category-level investability, not just a single company's thesis.

---

## 10. Financial Plan — P&L Summary & Key Assumptions

*No real financial model exists yet in this repository (it is a frontend-only prototype with mocked data), so no company-internal cost figures could be "researched" — those are decisions only you can make. What follows is a worked, bottom-up illustrative model built from the sourced market data above, so the deck has real numbers behind it instead of empty brackets. Replace the assumption inputs (in bold) with your own once you have real cost/pricing data; the structure and market anchors are ready to reuse.*

**Assumption inputs used for this model (tune these):**
- Average vendor daily sales revenue: **₹800/day** (derived from the ₹8,000 crore/day street-vending trade estimate ÷ ~10M vendors — see Section 5) — used only as a sanity-check anchor for vendor purchasing power, not as platform GMV.
- Karigar Connect: average gig value **₹700**, average vendor posts **1.5 gigs/month**, platform take-rate **15%**.
- Vendor Exchange: average trade value **₹400**, average vendor completes **2 trades/month**, platform take-rate **8%**.
- Procurement/Deal Discovery: average vendor monthly spend routed through platform **₹3,000**, take-rate **5%**.
- Virasaat: only a small fraction of vendors qualify/participate (**2%** of active base), average monthly product revenue per participating vendor **₹8,000**, platform revenue share **20%** (in line with the blended-spices D2C category's growth economics cited in Section 9).
- City launch fixed cost (community managers, onboarding incentives, local marketing): **₹15 lakh/city/year**.

**Blended monthly platform revenue per active vendor (illustrative):**
`(₹700 × 1.5 × 15%) + (₹400 × 2 × 8%) + (₹3,000 × 5%) + (2% × ₹8,000 × 20%)`
`= ₹157.50 + ₹64 + ₹150 + ₹32 = ~₹403/vendor/month` → **~₹4,840/vendor/year**

**P&L summary template (populate with your real cost lines; revenue row is modeled from the above):**

| Line item | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Active vendors (from Section 11) | 3,500 | 40,000 | 120,000 |
| Revenue (active vendors × ~₹4,840/yr) | ~₹1.7 crore | ~₹19.4 crore | ~₹58 crore |
| Cost of revenue (payment processing, logistics — est. 10% of revenue) | [ ] | [ ] | [ ] |
| Gross margin | [ ] | [ ] | [ ] |
| Sales & marketing / community ops (city launch costs) | [ ] | [ ] | [ ] |
| Product & engineering | [ ] | [ ] | [ ] |
| G&A | [ ] | [ ] | [ ] |
| EBITDA | [ ] | [ ] | [ ] |

---

## 11. 5-Year Revenue Projection

*Modeled from the SOM figures in Section 5 and the blended per-vendor revenue derived in Section 10. Treat as an illustrative scenario to defend in diligence, not a forecast guarantee — swap in your own penetration and ARPU assumptions once available.*

| Year | Cities live | Active vendors | Active Karigars | Blended revenue/vendor/yr | Total revenue |
|---|---|---|---|---|---|
| Year 1 | 1 | 3,500 | 400 | ~₹4,840 | ~₹1.7 crore |
| Year 2 | 2–3 | 40,000 | 4,000 | ~₹5,300 (module adoption deepens) | ~₹21 crore |
| Year 3 | 5–7 | 120,000 | 12,000 | ~₹5,800 | ~₹70 crore |
| Year 4 | 10+ | 300,000 | 30,000 | ~₹6,300 | ~₹189 crore |
| Year 5 | 15+ | 600,000 | 60,000 | ~₹6,800 | ~₹408 crore |

*(Note: even Year 5's 600,000 vendors is only ~6% of the ~10M national street-vendor base and ~20-30% of the 2-3M-vendor SAM from Section 5 — a deliberately conservative penetration assumption, not a ceiling.)*

**Narrative for pitch:** Emphasize multi-module revenue stacking per vendor (a single vendor can generate Karigar Connect commission + Vendor Exchange fees + procurement take-rate + potentially a Virasaat revenue share), which raises blended revenue per vendor over time as module adoption deepens within the same user base — a stronger unit economics story than a single-purpose marketplace like WorkIndia or Udaan, both of which monetize only one layer of the same vendor's spend.

---

## 12. Break-even Analysis

**Framework:**
- Fixed cost per city (from Section 10: **₹15 lakh/city/year** for community ops/onboarding/local marketing) ÷ contribution margin per active vendor (~₹4,840/yr revenue less ~10% cost of revenue, so **~₹4,350/vendor/year** contribution) = **~345 active vendors per city** needed to cover that city's direct launch cost.
- At the Year-1 target of 3,500 active vendors in the first city (Section 11), a single cluster clears its own direct city-cost break-even well within the first year, *before* accounting for central costs (engineering, G&A) — those are amortized across cities as the network scales.
- Company-wide break-even (covering central engineering/G&A on top of per-city contribution) is the number to model once you have real central cost estimates — plug your engineering/G&A run-rate against the cumulative contribution margin rows in Section 11 to solve for the year it crosses zero.
- Company-level break-even = the point where aggregate contribution margin across all live cities covers central costs (engineering, G&A, leadership).

**Narrative for pitch:** *"We expect each city cluster to cover its own direct launch cost within the first year, once it reaches roughly 345 active vendors — a threshold our Year-1 target city (3,500 vendors) clears within its first year of operation. Company-wide break-even, after central engineering/G&A, follows once enough cities are stacking contribution margin — modeled once real central-cost figures are set."*

---

## 13. Regulatory Status / Licenses / IP — researched

- **Current state:** Apna Mandi is a software platform (frontend web/mobile app) facilitating connections between vendors, Karigars, and suppliers; it does not itself handle food preparation or sale, so core food-safety licensing is generally the responsibility of the individual vendor/Karigar/supplier operating in the physical world. This should still be confirmed with legal counsel as the product matures, especially for Virasaat, where the platform is more directly involved in packaged product commerce.
- **FSSAI licensing tiers (confirmed via FSSAI/FoSCoS):** Every vendor, stall, or hawker selling food — packaged or freshly prepared — needs FSSAI registration or a license, tiered by annual turnover:
  - **Basic Registration:** turnover up to ₹12 lakh/year (covers most individual street vendors).
  - **State License:** turnover between ₹12 lakh and ₹20 crore/year (the tier most Virasaat-scale vendor-brands would fall into once they start shipping nationally).
  - **Central License:** multi-state operations or turnover above ₹20 crore/year.
  - Packaged products must carry a 14-digit FSSAI registration number on-pack — relevant directly to Virasaat's packaged spice/masala products. *(Source: [FoSCoS — Kind of Business Eligibility](https://foscos.fssai.gov.in/assets/docs/KindofBusinessEligibilityLatest.pdf))*
  - **2026 regulatory simplification:** under 2026 reforms, a street vendor already registered with a local **Town Vending Committee** under the Street Vendors Act, 2014 is now treated as "deemed registered" for FSSAI purposes — removing a separate registration step for vendors already in the PM SVANidhi/Town Vending Committee system. This directly lowers the compliance friction for onboarding vendors already reached via PM SVANidhi partnerships (see Section 7). *(Source: [PurshoLOGY — PM SVANidhi 2026 guide](https://www.purshology.com/2026/04/pm-svanidhi-scheme-for-street-vendors-online-registration-guide-2026/))*
  - **Virasaat implication:** Apna Mandi should define upfront whether it acts as a marketplace facilitator (vendor/product owner holds the FSSAI license) or a co-seller of record (platform would need its own license) — the facilitator model is standard for D2C marketplace platforms and is the lower-friction path.
- **Recipe/IP protection:** Traditional recipes generally cannot be patented, but Apna Mandi can help vendors protect their *brand* (trademark for product names like "Thatha's Sambhar Secret"), packaging/label copyright, and could explore trade-secret-style contractual protections for the platform's role in "licensing" a recipe to scale it.
- **Data privacy:** Standard compliance with India's **Digital Personal Data Protection (DPDP) Act** for user data (phone numbers, OTP auth, location) should be addressed as the platform moves from prototype to production, especially given `.env` references to third-party services (Supabase, payment processors) that aren't yet wired up.
- **No current real backend/licenses exist** — the repository is presently a frontend-only prototype with mocked authentication and data (see codebase notes), so all of the above should be treated as a roadmap for productionization, not current compliance status.

---

## 14. Growth & Expansion Plan

**Phase 1 — Prove the model (single city/cluster):** Launch and reach liquidity (repeat usage across Karigar Connect + Vendor Exchange) in one dense vendor cluster; validate unit economics and vendor retention.

**Phase 2 — Replicate city-by-city:** Use the proven cluster playbook (Section 7) to expand to 2–3 more metro clusters, focusing on cities with dense, organized vendor populations and existing vendor associations for faster trust-building.

**Phase 3 — Deepen module monetization:** Scale Virasaat as a distinct D2C/heritage brand engine (potentially spinning into its own consumer-facing storefront/app), and expand supplier-side procurement to formal wholesale partnerships and possibly private-label sourcing.

**Phase 4 — Horizontal expansion:** 
- Geographic: Expand beyond initial metro clusters into tier-2 cities, and evaluate international relevance (South Asian diaspora demand for Virasaat-style heritage products, as reflected in current in-app founder narratives referencing international customers).
- Vertical: Explore embedded financial services (working capital credit, insurance) leveraging in-app transaction/gig history as an alternative credit signal for an otherwise credit-invisible population.
- Platform: Open Karigar Connect and Vendor Exchange concepts to adjacent informal-economy verticals beyond street food (e.g., small retail, home-based manufacturing) once the core playbook is proven.

**Partnership expansion:** Deepen ties with government schemes (PM SVANidhi), vendor associations/unions, logistics providers (for Virasaat shipping), and payment/fintech partners to support the credit/insurance roadmap.

---

## 15. Team / Founders [VALIDATE — fill in with real details]

*This section requires your input — the repository does not contain team information. Suggested structure for the slide:*

- **Founder(s) name, role, and one-line background** (prior companies, relevant domain expertise — e.g., experience in food-tech, gig marketplaces, or direct connection to the street vendor community).
- **Why this team:** What gives you and your co-founders credibility/unfair advantage to build this specific platform (e.g., on-ground relationships with vendor associations, prior marketplace-building experience, technical background evidenced by this working product prototype).
- **Key early hires / advisors**, if any (especially anyone with FSSAI/regulatory, logistics, or gig-economy operations experience).
- **Current team size and roles** (engineering, product, on-ground community ops).

---

## 16. The Wow Layer — "Why Hasn't Anyone Built This Yet?" Features

*Each feature below is worked through as a business case: what it is, why it genuinely doesn't exist in the market today, how it makes money, and which existing Apna Mandi module it grows out of. The unifying insight: every one of these is impossible for a single-purpose competitor (Udaan, WorkIndia, Zomato) to copy, because each depends on data or relationships that only exist when labor + trading + procurement + IP monetization run through one platform for the same vendor. That cross-module data exhaust IS the moat — the features are how you cash it in.*

### Angle 1 — Fintech: the vendor's invisible balance sheet

**16.1 Vyapaar Score — a credit score built from woks, not W-2s**
- **What:** An alternative credit score computed from a vendor's in-app activity: procurement order regularity, Vendor Exchange trade velocity, gigs posted and paid on time, Virasaat royalty income, customer ratings. Surfaced on the vendor dashboard as a single number the vendor *owns* and can share with lenders.
- **Why it doesn't exist:** Banks and NBFCs can't underwrite a cash business with no records. PM SVANidhi proved demand (4.7M vendors took micro-loans) but lends flat amounts because it has no risk signal. Nobody else *can* build this score — no other platform sees a vendor's purchasing, selling, hiring, and earning in one place.
- **Revenue:** Lead-generation and origination fees from NBFC/bank partners; over time, first-loss-backed co-lending. Fintech margins (2–4% of loan value) dwarf marketplace take-rates.
- **Builds on:** Vendor Dashboard + all transaction modules. PM SVANidhi's restructured 11.5M-vendor target (Section 9) is the distribution channel.

**16.2 Barsaat Cover — parametric rain-day insurance for perishable stock**
- **What:** A vendor pays ~₹5–10/day; if rainfall in their pincode crosses a threshold (verified by public weather data, no claims adjuster needed), they get an automatic same-day payout covering that day's typical stock cost. Payout math is possible because the platform knows their procurement spend.
- **Why it doesn't exist:** Parametric insurance is proven in Indian agriculture (crop schemes), but no insurer can distribute it to street vendors — the acquisition cost per ₹10 policy is absurd without an app the vendor already opens daily. Distribution, not actuarial science, is the blocker; Apna Mandi *is* the distribution.
- **Revenue:** Commission on premiums as corporate agent of an insurance partner; near-zero marginal cost.
- **Builds on:** Procurement history (to size cover) + the weather signal below.

### Angle 2 — Data network effects: the platform that thinks ahead of the vendor

**16.3 Mausam Engine — hyperlocal prep forecasting**
- **What:** "Tomorrow: light rain + Ekadashi + cricket final. Expected footfall down ~30%; fried snacks up, juice down. Suggested prep: 12kg batter, not 20kg." A daily push notification blending weather, festival calendar, local events, and — the unfair part — anonymized real demand data from every Apna Mandi vendor in the same corridor.
- **Why it doesn't exist:** Every vendor already does this in their head, badly, alone. Nobody has aggregate street-level demand data because nobody has vendors transacting digitally. Zomato has restaurant data, not cart data. The forecast gets better with every vendor who joins — a compounding data moat.
- **Revenue:** Free tier drives daily retention (the "check the app every morning" habit that carries every other module); premium tier with corridor-level analytics for ₹99/month.
- **Builds on:** Vendor Exchange listings (what's in surplus = what was over-prepped) + procurement orders (what's being bought = what's being prepped).

**16.4 Auto-Exchange — spoilage prevention that acts before the vendor does**
- **What:** The Mausam Engine's forecast wired into Vendor Exchange: at 4pm, the app detects a vendor's likely surplus (bought 20kg onions, slow day predicted) and pre-drafts a discounted listing to nearby vendors — one tap to publish. End-of-day surplus that even vendors won't buy flows into a consumer-facing "5 o'clock flash sale" feed (the Too Good To Go model, which has 100M+ users in Europe and **no Indian street-food equivalent**).
- **Why it doesn't exist:** Too Good To Go never entered India; Swiggy/Zomato won't cannibalize full-price orders. Street vendors are the single biggest source of urban prepared-food waste and the only sellers with zero channel conflict.
- **Revenue:** Standard Exchange take-rate on rescued stock — revenue from goods that were previously a 100% loss. Also the deck's strongest SDG/sustainability slide (SDG 12.3: halve food waste).
- **Builds on:** Vendor Exchange + Mausam Engine.

### Angle 3 — Franchising: the McDonald's playbook, inverted

**16.5 Cart Franchise — a famous recipe becomes a multi-city brand without the vendor leaving their stall**
- **What:** Virasaat today packages a recipe as a product. Cart Franchise licenses it as a *live business*: a legendary Dadar vada pav vendor licenses recipe + brand + methods to a vetted vendor in Pune. The Pune vendor is trained by a certified Karigar (a paid Karigar Connect gig), sources the signature masala through procurement (quality control built into the supply chain), operates under the brand, and royalties flow back automatically.
- **Why it doesn't exist:** Franchising requires training, supply-chain control, and royalty collection — infrastructure no street vendor has, and no single-purpose platform can assemble. Apna Mandi already has all three as separate modules; this feature is just connecting them. It is the single clearest demonstration that the four-module bundle is a strategy, not a feature list.
- **Revenue:** Cut of ongoing royalties (high-margin, recurring, compounding) + certification fees + captive procurement volume for the signature ingredients.
- **Builds on:** Virasaat + Karigar Connect + Procurement — the only feature on this list that needs all three, which is exactly why it's the flagship.

**16.6 Hunar Certified — skill credentials for the uncredentialed**
- **What:** Micro-certifications for Karigars ("Certified Dosa Master — Level 2"), earned via completed gigs, vendor ratings, and video skill assessments. Certified Karigars command higher rates; certification is a prerequisite for Cart Franchise training gigs.
- **Why it doesn't exist:** Skill India / PMKVY certify formal trades, not "wok technique." WorkIndia/Apna match on self-declared skills. Nobody has verified, transaction-backed proof of informal culinary skill — yet it's exactly what a vendor hiring a stranger for a 4-hour shift needs most.
- **Revenue:** Assessment fees, subsidized by alignment with government skilling budgets (PMKVY partner model); certified Karigars justify a higher take-rate tier.
- **Builds on:** Karigar Connect ratings + gig history.

### Angle 4 — Demand aggregation: buying and selling as a swarm

**16.7 Mandi Pool — group buying that beats the wholesaler's own price**
- **What:** Ten vendors in one corridor need onions this week. The app aggregates their carts into one wholesale order, suppliers bid on the pooled lot, and the winning price (typically 15–30% below individual rates) is locked for everyone with one delivery drop-point.
- **Why it doesn't exist:** Udaan and Jumbotail aggregate *sellers*, not *buyers* — their model needs warehouses and inventory risk. Buyer-side pooling needs hyperlocal density plus daily trust between competing vendors, which only a cluster-first platform (Section 7's GTM) has. Community group-buying worked at scale in China (Pinduoduo, $100B+ company on this exact mechanic) and has never been applied to Indian B2B street-vendor procurement.
- **Revenue:** Same procurement take-rate on dramatically higher, stickier GMV; suppliers pay for access to guaranteed pooled demand.
- **Builds on:** Deal Discovery / cart / checkout — pooling is a checkout option, not a new product.

**16.8 Order the Street — corporate catering from carts, not caterers**
- **What:** An office orders "authentic street food for 200" for an event. The platform splits the order across 5–8 hygiene-verified vendors in the corridor, coordinates prep via the same infrastructure as Vendor Exchange, and delivers one invoice — with GST — to the company.
- **Why it doesn't exist:** Corporates *want* street food (every office party proves it) but can't procure it: no invoices, no food-safety paper trail, no single counterparty. Caterers imitate street food at 4x the price. The missing piece is an aggregation-and-compliance layer, not the food.
- **Revenue:** 15–20% catering margin — the highest-value order type any vendor on the platform will ever receive, and a B2B revenue line with predictable repeat customers.
- **Builds on:** Hygiene verification (16.9) + multi-vendor order splitting.

### Angle 5 — Trust as a product

**16.9 Swachh Badge — hygiene rating that pays for itself**
- **What:** An opt-in hygiene certification: vendors submit a short video walkthrough (water source, storage, gloves), verified by trained Karigars doing paid audit gigs, refreshed quarterly. Certified carts get a QR-coded badge customers can scan to see the audit, the vendor's story, and their Virasaat products.
- **Why it doesn't exist:** FSSAI registration is paperwork, not observed practice, and municipal inspection is adversarial — vendors hide from it. Nobody has made hygiene *profitable* for the vendor. Here the badge is the gate to catering orders (16.8), Virasaat listing, and better Vyapaar Scores — compliance becomes a revenue upgrade, so vendors chase it instead of dodging it.
- **Revenue:** Certification fee; more importantly it unlocks the two highest-margin lines (catering, Virasaat) and de-risks them.
- **Builds on:** Karigar Connect (auditors are gig workers — the platform's labor supply audits its own goods supply).

**16.10 Virasaat Provenance — a tamper-proof birth certificate for every recipe**
- **What:** When a vendor onboards a recipe to Virasaat, the platform records a timestamped, hash-sealed provenance bundle: video of the vendor making it, the story, the named creator. Every packaged unit carries a QR linking to it. If a copycat brand launches "Abdul Bhai ka Raaz," the original has dated, public proof of authorship — and customers can verify which one pays the actual Abdul Bhai.
- **Why it doesn't exist:** Recipe IP is legally weak (Section 13), so everyone gave up on protecting it. But the defensible asset was never the recipe — it's the *provenance of the person*, which D2C heritage brands (Section 6) fake with marketing. Only a platform with the real vendor relationship can sell verified authenticity, and verified authenticity is the entire price premium of the heritage category.
- **Revenue:** Included in Virasaat's revenue share — it's what justifies premium pricing and licensing deals; also the trademark-filing service upsell from Section 13.
- **Builds on:** Virasaat's existing storytelling flow — provenance is the storytelling made legally and commercially load-bearing.

### Angle 6 — Access: features for hands that are busy cooking

**16.11 Bolo Mandi — voice-first, in nine languages, over WhatsApp if needed**
- **What:** Every core action — post a gig, list surplus, reorder stock, check the Mausam forecast — doable by voice note in Hindi, Marathi, Tamil, etc. A vendor mid-rush says "kal ke liye 10 kilo pyaaz mangwa do" and the order is drafted. Same interface exposed as a WhatsApp bot so the app install isn't a prerequisite for the first transaction.
- **Why it doesn't exist:** Incumbents build English-first, form-first UIs for smartphone-native users, then bolt on translation. A vendor with wet hands, a queue of customers, and limited literacy will never fill a form — which is why every prior "digitize the vendor" attempt stalled at onboarding. Voice-first is not an accessibility checkbox here; it is the difference between 5% and 50% activation. Modern speech models made this nearly free to build in 2026; the incumbents' UI assumptions are two product generations deep.
- **Revenue:** Not a revenue line — an activation multiplier on every other line. Worth a dedicated demo moment in the pitch: speak a sentence, watch the gig go live.
- **Builds on:** Every module; the existing OTP-phone-number auth means the phone number is already the identity.

### Round 2 — deeper cuts (money that sits, assets too big for one cart, the demand side, and exits)

**16.12 Tyohar Book — festival demand, pre-sold.** Customers and corporates pre-order festival items (Diwali sweets, Holi thandai, Ramzan iftar boxes) two to six weeks ahead; payment sits in platform escrow; the vendor sees guaranteed demand and can draw an advance against it. This is working capital that isn't a loan — it's revenue that already happened. *Why it doesn't exist:* pre-ordering from a cart requires trust (will a stranger's stall honor it?) and escrow — exactly what ratings, Swachh Badge, and Vyapaar Score already provide. *Revenue:* take-rate + advance fee + escrow float. *Builds on:* cart/checkout + Vyapaar Score.

**16.13 Bhav Lock — tomorrow's onion price, locked today.** A vendor pays a small premium to lock next week's price on key inputs. The platform can offer this because it aggregates corridor demand (Mandi Pool) into forward commitments suppliers happily discount for — guaranteed offtake is worth more to a wholesaler than spot sales. *Why it doesn't exist:* commodity hedging has never reached micro-buyers; the aggregation layer is the missing instrument, not the finance. *Revenue:* spread between locked and negotiated forward price + premiums. *Builds on:* Mandi Pool + procurement data.

**16.14 Tel Wapasi — used cooking oil buyback.** FSSAI's RUCO program requires used-oil disposal, and biodiesel aggregators pay well per litre — but nobody can economically collect from millions of scattered carts. Corridor density solves the routing problem: scheduled pickups, vendor earns per litre, compliance feeds the Swachh Badge. *Why it doesn't exist:* collection economics fail without cluster density; Apna Mandi's GTM *is* cluster density. *Revenue:* margin per litre; also the strongest ESG/sustainability slide after Auto-Exchange. *Builds on:* Swachh Badge + corridor ops.

**16.15 Thanda Hub — cold storage by the crate, by the night.** Micro cold-rooms at corridor anchor points, booked per-crate-per-night in the app. Auto-Exchange already predicts which stock is at risk tonight — the nudge writes itself. *Why it doesn't exist:* a fridge never pays for itself for one cart, and standalone cold-storage operators can't predict utilization; the platform's stock-level data de-risks every placement decision. *Revenue:* crate-night fees, plus reduced spoilage lifts every other module's volume.

**16.16 Cart Waris — the first exit market for street businesses.** A retiring vendor sells the business: the spot's goodwill, the customer base, supplier relationships, the recipe (via Virasaat licensing), and a documented earnings history. Platform provides valuation (from transaction data), escrow, and handover training booked as Karigar gigs. *Why it doesn't exist:* informal businesses are unsellable because nothing is provable — the platform is the proof. *Revenue:* brokerage on each sale. *Pitch note:* emotionally, this is the endgame slide — "a cart becomes inheritable wealth instead of dying with its owner."

**16.17 Gullak — retirement, ten rupees at a time.** Auto-skim a tiny round-up from every settlement into micro-savings and PM-SYM pension enrollment (the government co-contributes for informal workers — uptake is dismal purely because of distribution friction). *Why it doesn't exist:* no one owns the vendor's daily cash-flow moment; auto-enrollment from settlements removes the entire friction. *Revenue:* modest distribution/AUM fees — the real value is retention cement and deposit rails for future lending.

**16.18 Khau Galli Live — the demand-side flywheel.** A consumer map of what's cooking right now, queue-ahead ordering, and creator-curated food trails; every Swachh QR scan converts a customer into a user. *Why it doesn't exist:* Swiggy/Zomato can't list unaddressed carts with no menus and no delivery fit — the vendor graph plus the Swachh trust layer is the missing infrastructure. *Revenue:* small convenience fees; strategically, it feeds real footfall data back into the Mausam Engine, closing the loop between demand prediction and demand generation.

**16.19 Beesi Digital — the credit circle, formalized.** Vendors already run informal rotating-savings circles (beesi/chit); the app digitizes collections, makes draws transparent, escrows the pot (killing the organizer-absconds failure mode), and feeds participation into the Vyapaar Score. *Why it doesn't exist:* regulated and trust-heavy — but records plus reputation are precisely what the platform has and a standalone fintech doesn't. *Revenue:* small facilitation fee; deepens the savings rails under the whole fintech stack.

*(Honorable mentions for the appendix: **Thela GPS** — data-driven "where to park tonight" recommendations plus a legal vending-zone compliance layer with Town Vending Committee data; **Ghar ka Swaad** — diaspora gift vouchers redeemable at any Swachh-verified cart, remittance meets street food.)*

### Sequencing note for the deck

Pitch these as three waves, each funded by the last: **Wave 1 (activation):** Bolo Mandi, Mausam Engine, Mandi Pool — get vendors opening the app daily. **Wave 2 (trust & margin):** Swachh Badge, Auto-Exchange, Order the Street, Hunar Certified — convert daily usage into high-margin order types. **Wave 3 (compounding moats):** Vyapaar Score, Barsaat Cover, Virasaat Provenance, Cart Franchise — monetize the accumulated data and relationships nobody else has. If the deck has room for only one wow slide, lead with **Cart Franchise** (the story investors retell) and close with **Vyapaar Score** (the fintech endgame that reframes the whole company from "marketplace" to "financial infrastructure for 10 million invisible businesses").

---

## Appendix: Product Snapshot (for reference / consistency in slides)

- **Platform type:** Frontend-only React single-page application (prototype stage), with mocked authentication (phone/OTP) and mocked data across modules — no live backend yet.
- **Core user roles:** Vendor, Karigar, Supplier (plus end consumers on Virasaat).
- **Core modules/pages:** Home, Karigar Connect, Vendor Exchange, Virasaat, Deal Discovery/Shopping, Shopping Cart & Checkout, Order Tracking & History, Vendor Dashboard, Supplier Dashboard, Profile, Authentication (Login/Register).
- **Brand identity:** Warm, culturally-rooted visual language (brand colors named terracotta, turmeric, leaf, chili, paper, ink), Baloo 2 display font + Mukta body font — designed to feel authentically Indian and food-market-native.
- **Stage:** Product prototype/demo built on Vite + React + Tailwind, deployable to Netlify/Vercel; no production backend, payments, or real user data pipeline yet.
