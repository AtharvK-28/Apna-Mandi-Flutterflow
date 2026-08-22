/**
 * Apna Mandi — Firestore seed.
 *
 * Ports the mock data from src/data/ and the page components into Firestore, so
 * the FlutterFlow build has the same content the React app demos with. The pitch
 * deck's screenshots reference these exact names — "Rajesh Juice Corner",
 * "Aunty's Schezwan Chutney" — so keep them.
 *
 * A script rather than JSON files, because half these documents hold
 * DocumentReferences to each other and Firestore's JSON import cannot express a
 * reference. The users have to exist before anything can point at them.
 *
 * ── Running it ───────────────────────────────────────────────────────────────
 *
 *   npm install firebase-admin
 *   # Firebase console → Project settings → Service accounts → Generate new key
 *   export GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
 *   node seed.mjs
 *
 * Idempotent: every document has a fixed id, so re-running overwrites rather
 * than duplicating. Safe to run against a dev project as often as you like.
 *
 * ── Do not run this against production ───────────────────────────────────────
 *
 * It writes demo users with predictable ids. The guard below refuses unless you
 * pass --force, because "I seeded prod" is a very fast way to put fictional
 * vendors in front of real ones.
 */

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? '';
const FORCE = process.argv.includes('--force');

if (/prod/i.test(PROJECT_ID) && !FORCE) {
  console.error(
    `Refusing to seed "${PROJECT_ID}" — the project id looks like production.\n` +
      'Re-run with --force if you genuinely mean to.',
  );
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID || undefined });
const db = getFirestore();

const hoursFromNow = (h) => Timestamp.fromDate(new Date(Date.now() + h * 3600_000));
const daysAgo = (d) => Timestamp.fromDate(new Date(Date.now() - d * 86_400_000));
const ref = (collection, id) => db.doc(`${collection}/${id}`);

/* ── Users ──────────────────────────────────────────────────────────────────
 *
 * The three demo logins keep the phone numbers the React app hardcodes, so the
 * demo script in the pitch deck still works. Register these numbers as Firebase
 * Auth test numbers (see 00-SETUP.md) and set each uid to the one Auth issues —
 * the ids below are placeholders that let the rest of the seed resolve.
 */

const users = [
  // ── Demo vendor ──
  {
    id: 'demo-vendor',
    phoneNumber: '+919876543210',
    role: 'vendor',
    displayName: 'Rajesh Kumar',
    stallName: 'Rajesh Juice Corner',
    cuisineType: 'Juices & Beverages',
    locationName: 'Dadar Station West',
    location: { latitude: 19.0170, longitude: 72.8478 },
    rating: 4.8,
    totalRatings: 340,
    hygieneGrade: 'A',
    hygieneAuditedAt: daysAgo(160),
    language: 'en',
    voiceEnabled: false,
    // Matches DEMO_ACTIVITY in src/data/vyapaar.js — total 478 over the 300
    // base, giving 778: "Strong", and enough to demo every unlock tier.
    vyapaarScore: 778,
    vyapaarFactors: [
      { factorId: 'procurement', earned: 148, detail: '47 orders paid, steady weekly cycle', trend: 12 },
      { factorId: 'gigPayments', earned: 132, detail: '12 gigs settled on time, no disputes', trend: 18 },
      { factorId: 'exchange', earned: 74, detail: '23 trades completed with nearby stalls', trend: 4 },
      { factorId: 'ratings', earned: 76, detail: '4.9 average across 340 verified orders', trend: 0 },
      { factorId: 'hygiene', earned: 48, detail: 'Grade A, audited March 2026', trend: 0 },
    ],
  },
  // ── Demo karigar ──
  {
    id: 'demo-karigar',
    phoneNumber: '+919876543212',
    role: 'karigar',
    displayName: 'Amit Kumar',
    age: 28,
    locationName: 'Dadar Station West',
    location: { latitude: 19.0170, longitude: 72.8478 },
    rating: 4.9,
    totalRatings: 47,
    totalGigs: 47,
    skills: ['Dosa Making', 'Tawa Handling', 'Batter Prep'],
    verifiedSkills: ['Dosa Master'],
    hourlyRate: 400,
    availability: 'Flexible',
    bio: 'Expert dosa maker with 8 years experience. Trained under South Indian masters.',
    isOnline: true,
    language: 'hi',
    voiceEnabled: true,
  },
  // ── Demo supplier ──
  {
    id: 'demo-supplier',
    phoneNumber: '+919876543211',
    role: 'supplier',
    displayName: 'Suresh Patil',
    businessName: 'Fresh Harvest Co.',
    locationName: 'Dadar Market',
    location: { latitude: 19.0176, longitude: 72.8562 },
    rating: 4.8,
    totalRatings: 210,
    isVerified: true,
    deliveryAreas: ['Dadar', 'Bandra', 'Andheri'],
    language: 'mr',
    voiceEnabled: false,
  },

  // ── Other karigars, from src/data/karigars.js ──
  {
    id: 'karigar-priya', phoneNumber: '+919876543220', role: 'karigar',
    displayName: 'Priya Sharma', age: 24, locationName: 'Bandra Market',
    location: { latitude: 19.0596, longitude: 72.8295 },
    rating: 4.7, totalGigs: 32, hourlyRate: 150, availability: 'Morning & Evening',
    skills: ['Vegetable Chopping', 'Bulk Prep', 'Kitchen Organization'],
    verifiedSkills: ['Speed Chopper'], isOnline: true,
    bio: 'Fast and efficient vegetable chopper. Can handle bulk prep for any cuisine.',
  },
  {
    id: 'karigar-rajesh', phoneNumber: '+919876543221', role: 'karigar',
    displayName: 'Rajesh Patel', age: 35, locationName: 'Andheri Station',
    location: { latitude: 19.1197, longitude: 72.8464 },
    rating: 4.8, totalGigs: 89, hourlyRate: 350, availability: 'Evening Only',
    skills: ['Chinese Wok', 'High Heat Cooking', 'Stir Fry'],
    verifiedSkills: ['Wok Master'], isOnline: false,
    bio: 'Chinese cuisine specialist with 12 years experience. Expert in wok cooking.',
  },
  {
    id: 'karigar-sunita', phoneNumber: '+919876543222', role: 'karigar',
    displayName: 'Sunita Devi', age: 42, locationName: 'Dadar Station West',
    location: { latitude: 19.0170, longitude: 72.8478 },
    rating: 4.6, totalGigs: 56, hourlyRate: 180, availability: 'Afternoon & Evening',
    skills: ['Chaat Assembly', 'Garnish Work', 'Customer Service'],
    verifiedSkills: ['Chaat Expert'], isOnline: true,
    bio: 'Chaat specialist with perfect assembly skills. Known for beautiful garnishes.',
  },
  {
    id: 'karigar-vikram', phoneNumber: '+919876543223', role: 'karigar',
    displayName: 'Vikram Singh', age: 31, locationName: 'Bandra Market',
    location: { latitude: 19.0596, longitude: 72.8295 },
    rating: 4.9, totalGigs: 73, hourlyRate: 200, availability: 'All Day',
    skills: ['Juice Making', 'Cash Handling', 'Equipment Operation'],
    verifiedSkills: ['Juice Master'], isOnline: true,
    bio: 'Juice stall expert with equipment knowledge. Great with customers and cash.',
  },

  // ── Other suppliers ──
  { id: 'supplier-dairy', phoneNumber: '+919876543230', role: 'supplier', displayName: 'Anil Shah', businessName: 'Dairy Fresh', locationName: 'Dadar', rating: 4.9, isVerified: true, deliveryAreas: ['Dadar', 'Bandra'] },
  { id: 'supplier-grain', phoneNumber: '+919876543231', role: 'supplier', displayName: 'Mohan Gupta', businessName: 'Grain Masters', locationName: 'Vashi', rating: 4.8, isVerified: true, deliveryAreas: ['Dadar', 'Andheri'] },
  { id: 'supplier-veggie', phoneNumber: '+919876543232', role: 'supplier', displayName: 'Lata Nair', businessName: 'Veggie World', locationName: 'Bandra', rating: 4.6, isVerified: true, deliveryAreas: ['Bandra', 'Andheri'] },
  { id: 'supplier-pulse', phoneNumber: '+919876543233', role: 'supplier', displayName: 'Iqbal Sheikh', businessName: 'Pulse Traders', locationName: 'Kurla', rating: 4.7, isVerified: true, deliveryAreas: ['Dadar', 'Kurla'] },

  // ── Other vendors, so the Exchange and Khau Galli have real counterparties ──
  { id: 'vendor-dosa', phoneNumber: '+919876543240', role: 'vendor', displayName: 'Ganesh Iyer', stallName: 'Mumbai Dosa Corner', cuisineType: 'South Indian', locationName: 'Dadar Station West', location: { latitude: 19.0170, longitude: 72.8478 }, rating: 4.5, hygieneGrade: 'A' },
  { id: 'vendor-chaat', phoneNumber: '+919876543241', role: 'vendor', displayName: 'Rekha Yadav', stallName: 'Delhi Chaat House', cuisineType: 'Chaat', locationName: 'Andheri Station', location: { latitude: 19.1197, longitude: 72.8464 }, rating: 4.7, hygieneGrade: 'B' },
  { id: 'vendor-chinese', phoneNumber: '+919876543242', role: 'vendor', displayName: 'Aruna Rao', stallName: "Aunty's Chinese Corner", cuisineType: 'Indo-Chinese', locationName: 'Dadar Station West', location: { latitude: 19.0170, longitude: 72.8478 }, rating: 4.9, hygieneGrade: 'A' },
  { id: 'vendor-vadapav', phoneNumber: '+919876543243', role: 'vendor', displayName: 'Ram Shinde', stallName: "Ram's Vada Pav Empire", cuisineType: 'Maharashtrian', locationName: 'Bandra Market', location: { latitude: 19.0596, longitude: 72.8295 }, rating: 4.8, hygieneGrade: 'A' },
];

/* ── Deals ── from MOCK_DEALS in the deal-discovery page ─────────────────── */

const deals = [
  { id: 'deal-tomato', name: 'Fresh Tomatoes', category: 'vegetables', price: 25, originalPrice: 35, unit: 'kg', availableQuantity: 50, supplier: 'demo-supplier', supplierName: 'Fresh Harvest Co.', isVerified: true, rating: 4.8, distanceKm: 1.2, dealType: 'fresh-morning', expiresAt: hoursFromNow(4), description: 'Farm fresh tomatoes, picked this morning' },
  { id: 'deal-capsicum', name: 'Green Bell Peppers', category: 'vegetables', price: 40, originalPrice: 60, unit: 'kg', availableQuantity: 30, supplier: 'demo-supplier', supplierName: 'Fresh Harvest Co.', isVerified: true, rating: 4.7, distanceKm: 1.2, dealType: 'fresh-morning', expiresAt: hoursFromNow(4), description: 'Crisp and fresh bell peppers' },
  { id: 'deal-milk', name: 'Fresh Milk', category: 'dairy', price: 60, originalPrice: 80, unit: 'liter', availableQuantity: 100, supplier: 'supplier-dairy', supplierName: 'Dairy Fresh', isVerified: true, rating: 4.9, distanceKm: 0.8, dealType: 'fresh-morning', expiresAt: hoursFromNow(3), description: 'Pure cow milk, delivered fresh' },
  { id: 'deal-curd', name: 'Fresh Curd', category: 'dairy', price: 45, originalPrice: 65, unit: 'kg', availableQuantity: 40, supplier: 'supplier-dairy', supplierName: 'Dairy Fresh', isVerified: true, rating: 4.8, distanceKm: 0.8, dealType: 'fresh-morning', expiresAt: hoursFromNow(3), description: 'Homemade fresh curd' },
  { id: 'deal-coriander', name: 'Fresh Coriander', category: 'herbs', price: 20, originalPrice: 30, unit: 'bunches', availableQuantity: 100, supplier: 'supplier-veggie', supplierName: 'Green Garden', isVerified: false, rating: 4.4, distanceKm: 1.5, dealType: 'fresh-morning', expiresAt: hoursFromNow(2), description: 'Freshly harvested coriander' },
  { id: 'deal-banana', name: 'Ripe Bananas', category: 'fruits', price: 30, originalPrice: 50, unit: 'dozen', availableQuantity: 25, supplier: 'supplier-veggie', supplierName: 'Fruit Paradise', isVerified: true, rating: 4.6, distanceKm: 2.1, dealType: 'end-of-day', expiresAt: hoursFromNow(2), description: 'Ripe bananas, perfect for immediate use' },
  { id: 'deal-spinach', name: 'Fresh Spinach', category: 'vegetables', price: 15, originalPrice: 25, unit: 'kg', availableQuantity: 20, supplier: 'demo-supplier', supplierName: 'Fresh Harvest Co.', isVerified: true, rating: 4.5, distanceKm: 1.2, dealType: 'end-of-day', expiresAt: hoursFromNow(1), description: 'Fresh spinach, use today' },
  { id: 'deal-paneer', name: 'Paneer', category: 'dairy', price: 120, originalPrice: 180, unit: 'kg', availableQuantity: 15, supplier: 'supplier-dairy', supplierName: 'Dairy Fresh', isVerified: true, rating: 4.7, distanceKm: 0.8, dealType: 'end-of-day', expiresAt: hoursFromNow(1), description: 'Fresh paneer, best used today' },
  { id: 'deal-rice', name: 'Basmati Rice', category: 'grains', price: 80, originalPrice: 120, unit: 'kg', availableQuantity: 200, supplier: 'supplier-grain', supplierName: 'Grain Masters', isVerified: true, rating: 4.8, distanceKm: 3.2, dealType: 'bulk-discount', minQuantity: 10, description: 'Premium basmati rice, bulk order discount' },
  { id: 'deal-onion', name: 'Red Onions', category: 'vegetables', price: 20, originalPrice: 35, unit: 'kg', availableQuantity: 500, supplier: 'supplier-veggie', supplierName: 'Veggie World', isVerified: true, rating: 4.6, distanceKm: 2.1, dealType: 'bulk-discount', minQuantity: 5, description: 'Red onions, bulk purchase discount' },
  { id: 'deal-potato', name: 'Potatoes', category: 'vegetables', price: 25, originalPrice: 40, unit: 'kg', availableQuantity: 300, supplier: 'supplier-veggie', supplierName: 'Veggie World', isVerified: true, rating: 4.5, distanceKm: 2.1, dealType: 'bulk-discount', minQuantity: 5, description: 'Fresh potatoes, bulk order available' },
  { id: 'deal-toordal', name: 'Toor Dal', category: 'pulses', price: 90, originalPrice: 140, unit: 'kg', availableQuantity: 150, supplier: 'supplier-pulse', supplierName: 'Pulse Traders', isVerified: true, rating: 4.7, distanceKm: 2.8, dealType: 'bulk-discount', minQuantity: 5, description: 'Premium toor dal, bulk discount' },
  // originalPrice deliberately absent on the regular deals — null means "not on
  // discount", and the card must hide the struck-through price rather than show
  // the same number twice.
  { id: 'deal-chilli', name: 'Green Chilies', category: 'vegetables', price: 80, unit: 'kg', availableQuantity: 30, supplier: 'supplier-veggie', supplierName: 'Spice Garden', isVerified: false, rating: 4.4, distanceKm: 1.8, dealType: 'regular', description: 'Fresh green chilies' },
  { id: 'deal-turmeric', name: 'Turmeric Powder', category: 'spices', price: 200, unit: 'kg', availableQuantity: 50, supplier: 'supplier-grain', supplierName: 'Spice Junction', isVerified: true, rating: 4.4, distanceKm: 1.8, dealType: 'regular', description: 'Pure turmeric powder' },
  { id: 'deal-ghee', name: 'Ghee', category: 'oil', price: 600, unit: 'kg', availableQuantity: 40, supplier: 'supplier-dairy', supplierName: 'Dairy Fresh', isVerified: true, rating: 4.8, distanceKm: 0.8, dealType: 'regular', description: 'Pure cow ghee' },
  { id: 'deal-besan', name: 'Besan', category: 'grains', price: 70, unit: 'kg', availableQuantity: 120, supplier: 'supplier-grain', supplierName: 'Grain Masters', isVerified: true, rating: 4.6, distanceKm: 3.2, dealType: 'regular', description: 'Fine gram flour' },
];

/* ── Gigs ── from src/data/gigs.js ───────────────────────────────────────── */

const gigs = [
  { id: 'gig-juice', title: 'Emergency Juice Stall Cover', vendor: 'demo-vendor', vendorName: 'Rajesh Juice Corner', vendorPhone: '+919876543210', vendorRating: 4.8, vendorLocation: 'Dadar Station West', gigType: 'emergency', skills: ['Juice Making', 'Cash Handling', 'Customer Service'], description: 'Need someone to run my juice stall for the evening rush. Must know how to operate a juicer and handle cash transactions.', startAt: hoursFromNow(6), endAt: hoursFromNow(11), durationHours: 5, ratePerHour: 150, totalPay: 750, urgency: 'high', applicantCount: 3, postedAt: daysAgo(0.08) },
  { id: 'gig-chopping', title: 'Bulk Vegetable Chopping Help', vendor: 'vendor-chinese', vendorName: 'Mumbai Chinese Corner', vendorPhone: '+919876543242', vendorRating: 4.6, vendorLocation: 'Bandra Market', gigType: 'prep', skills: ['Vegetable Chopping', 'Bulk Prep', 'Kitchen Organization'], description: 'Need help with bulk chopping for my Chinese stall. Task: 20kg vegetables (onions, carrots, cabbage).', startAt: hoursFromNow(21), endAt: hoursFromNow(23), durationHours: 2, ratePerHour: 120, totalPay: 240, urgency: 'medium', applicantCount: 5, postedAt: daysAgo(0.17) },
  { id: 'gig-dosa', title: 'Dosa Master Training Session', vendor: 'vendor-vadapav', vendorName: 'Pav Bhaji King', vendorPhone: '+919876543243', vendorRating: 4.9, vendorLocation: 'Andheri Station', gigType: 'training', skills: ['Dosa Making', 'Tawa Handling', 'Batter Preparation'], description: 'Need a Dosa Master to train me on my new tawa. Want to add dosas to my menu. Premium skill training required.', startAt: hoursFromNow(72), endAt: hoursFromNow(74), durationHours: 2, ratePerHour: 600, totalPay: 1200, urgency: 'low', applicantCount: 1, postedAt: daysAgo(1) },
  { id: 'gig-chaat', title: 'Chaat Assembly Expert Needed', vendor: 'vendor-chaat', vendorName: 'Delhi Chaat House', vendorPhone: '+919876543241', vendorRating: 4.7, vendorLocation: 'Dadar Station West', gigType: 'prep', skills: ['Chaat Assembly', 'Garnish Work', 'Speed Service'], description: 'Need an expert in chaat assembly for the festival rush. Must be fast and maintain quality standards.', startAt: hoursFromNow(96), endAt: hoursFromNow(101), durationHours: 5, ratePerHour: 200, totalPay: 1000, urgency: 'high', applicantCount: 7, postedAt: daysAgo(0.13) },
  { id: 'gig-wok', title: 'Chinese Wok Master for Peak Hours', vendor: 'vendor-chinese', vendorName: 'Spice Garden', vendorPhone: '+919876543242', vendorRating: 4.5, vendorLocation: 'Bandra Market', gigType: 'emergency', skills: ['Wok Cooking', 'Chinese Cuisine', 'High Heat Cooking'], description: 'Need a wok master for the evening rush. Must know Chinese cooking techniques and handle high heat.', startAt: hoursFromNow(8), endAt: hoursFromNow(11), durationHours: 3, ratePerHour: 300, totalPay: 900, urgency: 'high', applicantCount: 2, postedAt: daysAgo(0.04) },
];

/* ── Completed shifts ── backs the karigar's earnings view ───────────────── */

const shifts = [
  { id: 'shift-108', title: 'Evening Chaat Rush', vendor: 'vendor-chaat', vendorName: 'Delhi Chaat House', workedAt: daysAgo(4), hours: 5, pay: 1000, paymentStatus: 'paid', ratingFromVendor: 5 },
  { id: 'shift-107', title: 'Juice Stall Cover', vendor: 'demo-vendor', vendorName: 'Rajesh Juice Corner', workedAt: daysAgo(6), hours: 5, pay: 750, paymentStatus: 'paid', ratingFromVendor: 5 },
  { id: 'shift-106', title: 'Bulk Prep — Onions & Carrots', vendor: 'vendor-chinese', vendorName: 'Mumbai Chinese Corner', workedAt: daysAgo(8), hours: 2, pay: 240, paymentStatus: 'paid', ratingFromVendor: 4 },
  { id: 'shift-105', title: 'Wok Station, Peak Hours', vendor: 'vendor-chinese', vendorName: 'Spice Garden', workedAt: daysAgo(10), hours: 3, pay: 900, paymentStatus: 'processing', ratingFromVendor: 5 },
  { id: 'shift-104', title: 'Dosa Tawa Training', vendor: 'vendor-vadapav', vendorName: 'Pav Bhaji King', workedAt: daysAgo(13), hours: 2, pay: 1200, paymentStatus: 'paid', ratingFromVendor: 5 },
];

/* ── Exchange listings ───────────────────────────────────────────────────── */

const listings = [
  { id: 'ex-batter', listingType: 'surplus', item: 'Idli Batter', quantity: 3, unit: 'litre', originalPrice: 150, askingPrice: 60, condition: 'Fresh, good for 10 more hours', description: 'Rainy day, less customers. Need to clear stock before it goes bad.', vendor: 'vendor-dosa', vendorName: 'Mumbai Dosa Corner', vendorPhone: '+919876543240', vendorRating: 4.5, locationName: 'Dadar Station West', urgency: 'high', acceptsBarter: true, expiresAt: hoursFromNow(10), postedAt: daysAgo(0.08) },
  { id: 'ex-paneer', listingType: 'surplus', item: 'Fresh Paneer', quantity: 2, unit: 'kg', originalPrice: 400, askingPrice: 160, condition: 'Fresh from this morning', description: 'Extra stock from morning batch. Perfect for sweets and curries.', vendor: 'vendor-chaat', vendorName: 'Dairy Delights', vendorPhone: '+919876543241', vendorRating: 4.8, locationName: 'Bandra Market', urgency: 'medium', acceptsBarter: false, expiresAt: hoursFromNow(14), postedAt: daysAgo(0.04) },
  { id: 'ex-veg', listingType: 'surplus', item: 'Mixed Vegetables', quantity: 5, unit: 'kg', originalPrice: 200, askingPrice: 80, condition: 'Fresh, all good quality', description: 'Closing early today. All vegetables fresh and clean.', vendor: 'vendor-vadapav', vendorName: 'Fresh Veggies', vendorPhone: '+919876543243', vendorRating: 4.2, locationName: 'Andheri Station', urgency: 'high', acceptsBarter: true, expiresAt: hoursFromNow(6), postedAt: daysAgo(0.02) },
  { id: 'ex-lemon', listingType: 'need', item: 'Lemons', quantity: 1, unit: 'kg', budget: 90, description: 'Ran out mid-rush. Can collect right now, cash in hand.', vendor: 'demo-vendor', vendorName: 'Rajesh Juice Corner', vendorPhone: '+919876543210', vendorRating: 4.8, locationName: 'Dadar Station West', urgency: 'high', acceptsBarter: true, expiresAt: hoursFromNow(2), postedAt: daysAgo(0.01) },
  { id: 'ex-oil', listingType: 'need', item: 'Refined Oil', quantity: 5, unit: 'litre', budget: 700, description: 'Delivery delayed. Need enough to finish today’s service.', vendor: 'vendor-chinese', vendorName: "Aunty's Chinese Corner", vendorPhone: '+919876543242', vendorRating: 4.9, locationName: 'Dadar Station West', urgency: 'medium', acceptsBarter: false, expiresAt: hoursFromNow(5), postedAt: daysAgo(0.05) },
];

/* ── Virasaat products ───────────────────────────────────────────────────── */

const virasaat = [
  {
    id: 'vir-schezwan',
    name: "Aunty's Schezwan Chutney",
    masterVendor: 'vendor-chinese',
    masterVendorName: "Aunty's Chinese Corner",
    masterVendorRating: 4.9,
    masterVendorStory:
      '30 years of perfecting the authentic Schezwan taste. Started as a small stall in Dadar, now famous across Mumbai for the most authentic Chinese street food.',
    ingredientName: 'Schezwan Chutney',
    packageSize: '500ml Bottle',
    yieldClaim: 'Makes 200 Schezwan Dosas',
    originalPrice: 800, licensePrice: 600, subscriptionPrice: 450,
    category: 'chutneys', locationName: 'Dadar Station West',
    description:
      'The secret blend of 15 spices that made Aunty\'s Chinese Corner legendary. Perfect balance of heat, tang, and umami. Used by 50+ vendors across Mumbai.',
    // Declared ingredients only — never the ratio. The ratio IS the product;
    // publishing it is the one thing that destroys the vendor's asset.
    ingredients: ['Red Chillies', 'Garlic', 'Ginger', 'Soy Sauce', 'Vinegar', 'Secret Spice Blend'],
    usage: '2-3 tbsp per dosa, mix with regular chutney for authentic taste',
    subscriberCount: 47,
    testimonials: [
      { vendorName: 'Mumbai Dosa King', rating: 5, comment: 'My dosa sales increased by 300% after using Aunty\'s chutney!' },
      { vendorName: 'Street Food Express', rating: 5, comment: 'Customers keep coming back asking for that special chutney' },
      { vendorName: 'Quick Bites', rating: 4, comment: 'Authentic taste that\'s hard to replicate. Worth every penny.' },
    ],
  },
  {
    id: 'vir-kolhapuri',
    name: "Ram's Kolhapuri Vada Pav Masala",
    masterVendor: 'vendor-vadapav',
    masterVendorName: "Ram's Vada Pav Empire",
    masterVendorRating: 4.8,
    masterVendorStory:
      'Started with a single stall in 1995. Now has 15 outlets across Mumbai. The secret masala recipe has been passed down for 3 generations.',
    ingredientName: 'Kolhapuri Masala Powder',
    packageSize: '1kg Pack',
    yieldClaim: 'Makes 500 Vada Pavs',
    originalPrice: 1200, licensePrice: 900, subscriptionPrice: 750,
    category: 'masalas', locationName: 'Bandra Market',
    description:
      'The legendary masala that made Ram\'s vada pav famous. Perfect blend of 12 spices including rare Kolhapuri chillies. Instant upgrade for any vada pav stall.',
    ingredients: ['Kolhapuri Red Chillies', 'Coriander', 'Cumin', 'Black Pepper', 'Garlic Powder', 'Secret Spice Mix'],
    usage: '1 tsp per vada, mix with potato filling for authentic Kolhapuri taste',
    subscriberCount: 31,
    testimonials: [
      { vendorName: 'Dadar Vada Corner', rating: 5, comment: 'Regulars noticed the difference the same day.' },
      { vendorName: 'Station Snacks', rating: 4, comment: 'Strong heat — worth warning customers, but it sells.' },
    ],
  },
];

/* ── Supplier inventory, pickup points, pools, stalls ────────────────────── */

const inventory = [
  { id: 'inv-tomato', productName: 'Fresh Tomatoes', category: 'vegetables', currentStock: 5, minimumStock: 10, unit: 'kg', costPrice: 18, sellingPrice: 25 },
  { id: 'inv-milk', productName: 'Milk', category: 'dairy', currentStock: 8, minimumStock: 5, unit: 'liters', costPrice: 48, sellingPrice: 60, expiryDate: hoursFromNow(48) },
  { id: 'inv-besan', productName: 'Besan', category: 'grains', currentStock: 12, minimumStock: 25, unit: 'kg', costPrice: 55, sellingPrice: 70 },
  { id: 'inv-onion', productName: 'Onions', category: 'vegetables', currentStock: 180, minimumStock: 50, unit: 'kg', costPrice: 14, sellingPrice: 20 },
  { id: 'inv-potato', productName: 'Potatoes', category: 'vegetables', currentStock: 240, minimumStock: 60, unit: 'kg', costPrice: 17, sellingPrice: 25 },
];

const pickupPoints = [
  { id: 'pp-dadar', name: 'Dadar Station West', address: 'Behind the bus stop at Dadar Station West', location: { latitude: 19.0170, longitude: 72.8478 }, status: 'active', totalOrders: 0, completedOrders: 0 },
  { id: 'pp-bandra', name: 'Bandra Market', address: 'Near Bandra Station, opposite the bus depot', location: { latitude: 19.0596, longitude: 72.8295 }, status: 'active', totalOrders: 0, completedOrders: 0 },
  { id: 'pp-andheri', name: 'Andheri Station', address: 'Andheri Station East, near the auto stand', location: { latitude: 19.1197, longitude: 72.8464 }, status: 'inactive', totalOrders: 0, completedOrders: 0 },
];

const pools = [
  { id: 'pool-dadar', name: 'Dadar Vada Pav Pool', pickupPoint: 'pp-dadar', leadVendor: 'vendor-vadapav', members: ['vendor-vadapav', 'vendor-dosa', 'demo-vendor'], vendorCount: 8, targetVendorCount: 8, items: [{ name: 'Potatoes', quantity: 100, unit: 'kg' }, { name: 'Onions', quantity: 50, unit: 'kg' }, { name: 'Besan', quantity: 25, unit: 'kg' }], totalAmount: 8500, status: 'pending', deliveryWindow: 'Tomorrow, 6–8 AM', priority: 'high', closesAt: hoursFromNow(14) },
  { id: 'pool-bandra', name: 'Bandra Breakfast Pool', pickupPoint: 'pp-bandra', leadVendor: 'vendor-dosa', members: ['vendor-dosa', 'vendor-chinese'], vendorCount: 5, targetVendorCount: 6, items: [{ name: 'Idli Rice', quantity: 60, unit: 'kg' }, { name: 'Urad Dal', quantity: 20, unit: 'kg' }, { name: 'Milk', quantity: 80, unit: 'liters' }], totalAmount: 12000, status: 'forming', deliveryWindow: 'Tomorrow, 7–9 AM', priority: 'medium', closesAt: hoursFromNow(16) },
];

const stalls = [
  { id: 'stall-rajesh', stallName: 'Rajesh Juice Corner', vendor: 'demo-vendor', cuisineType: 'Juices & Beverages', signatureDish: 'Mosambi juice, pressed to order', locationName: 'Dadar Station West', location: { latitude: 19.0170, longitude: 72.8478 }, rating: 4.8, hygieneGrade: 'A', isOpenNow: true, openHours: '7:00 AM – 11:00 PM', priceRange: '₹20–₹60' },
  { id: 'stall-aunty', stallName: "Aunty's Chinese Corner", vendor: 'vendor-chinese', cuisineType: 'Indo-Chinese', signatureDish: 'Schezwan dosa', locationName: 'Dadar Station West', location: { latitude: 19.0170, longitude: 72.8478 }, rating: 4.9, hygieneGrade: 'A', isOpenNow: true, openHours: '5:00 PM – 12:00 AM', priceRange: '₹60–₹150' },
  { id: 'stall-ram', stallName: "Ram's Vada Pav Empire", vendor: 'vendor-vadapav', cuisineType: 'Maharashtrian', signatureDish: 'Kolhapuri vada pav', locationName: 'Bandra Market', location: { latitude: 19.0596, longitude: 72.8295 }, rating: 4.8, hygieneGrade: 'A', isOpenNow: true, openHours: '6:00 AM – 10:00 PM', priceRange: '₹15–₹40' },
  { id: 'stall-delhi', stallName: 'Delhi Chaat House', vendor: 'vendor-chaat', cuisineType: 'Chaat', signatureDish: 'Raj kachori', locationName: 'Andheri Station', location: { latitude: 19.1197, longitude: 72.8464 }, rating: 4.7, hygieneGrade: 'B', isOpenNow: false, openHours: '4:00 PM – 11:00 PM', priceRange: '₹40–₹120' },
];

/* ── Write ──────────────────────────────────────────────────────────────── */

async function seed() {
  const batch = db.batch();

  for (const u of users) {
    const { id, ...rest } = u;
    batch.set(db.doc(`users/${id}`), {
      uid: id,
      language: 'en',
      voiceEnabled: false,
      createdAt: FieldValue.serverTimestamp(),
      ...rest,
    });
  }

  for (const d of deals) {
    const { id, supplier, ...rest } = d;
    batch.set(db.doc(`deals/${id}`), {
      ...rest,
      supplierRef: ref('users', supplier),
      isActive: true,
    });
  }

  for (const g of gigs) {
    const { id, vendor, ...rest } = g;
    batch.set(db.doc(`gigs/${id}`), {
      ...rest,
      vendorRef: ref('users', vendor),
      status: 'open',
      assignedKarigarRef: null,
    });
  }

  for (const s of shifts) {
    const { id, vendor, ...rest } = s;
    batch.set(db.doc(`shifts/${id}`), {
      ...rest,
      karigarRef: ref('users', 'demo-karigar'),
      vendorRef: ref('users', vendor),
    });
  }

  for (const l of listings) {
    const { id, vendor, ...rest } = l;
    batch.set(db.doc(`exchangeListings/${id}`), {
      ...rest,
      vendorRef: ref('users', vendor),
      status: 'open',
    });
  }

  for (const v of virasaat) {
    const { id, masterVendor, testimonials, ...rest } = v;
    batch.set(db.doc(`virasaatProducts/${id}`), {
      ...rest,
      masterVendorRef: ref('users', masterVendor),
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
    });
    testimonials.forEach((t, i) => {
      batch.set(db.doc(`virasaatProducts/${id}/testimonials/t${i}`), {
        ...t,
        createdAt: FieldValue.serverTimestamp(),
      });
    });
  }

  for (const i of inventory) {
    const { id, ...rest } = i;
    batch.set(db.doc(`inventory/${id}`), {
      ...rest,
      supplierRef: ref('users', 'demo-supplier'),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  for (const p of pickupPoints) {
    const { id, ...rest } = p;
    batch.set(db.doc(`pickupPoints/${id}`), rest);
  }

  for (const p of pools) {
    const { id, pickupPoint, leadVendor, members, ...rest } = p;
    batch.set(db.doc(`pools/${id}`), {
      ...rest,
      pickupPointRef: ref('pickupPoints', pickupPoint),
      leadVendorRef: ref('users', leadVendor),
      memberRefs: members.map((m) => ref('users', m)),
    });
  }

  for (const s of stalls) {
    const { id, vendor, ...rest } = s;
    batch.set(db.doc(`khauGalliStalls/${id}`), {
      ...rest,
      vendorRef: ref('users', vendor),
    });
  }

  await batch.commit();

  const counts = {
    users: users.length,
    deals: deals.length,
    gigs: gigs.length,
    shifts: shifts.length,
    exchangeListings: listings.length,
    virasaatProducts: virasaat.length,
    inventory: inventory.length,
    pickupPoints: pickupPoints.length,
    pools: pools.length,
    khauGalliStalls: stalls.length,
  };
  console.log('Seeded:', counts);
  console.log(
    '\nNext: register the three demo phone numbers as Firebase Auth test numbers,\n' +
      'then update the demo-vendor / demo-karigar / demo-supplier document ids to\n' +
      'the uids Auth issues, or sign in once and copy the uid across.',
  );
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
