// Single source of truth for who each user type is and what they can reach.
//
// Apna Mandi is three apps sharing one shell. A vendor runs a stall (buys stock,
// hires help, sells food), a karigar sells skilled labour by the shift, and a
// supplier sells goods wholesale. Their jobs barely overlap, so their navigation,
// landing page and permitted routes are defined here rather than assembled
// ad-hoc in each component.
//
// Anything that needs to know "can this person see X" reads from this file.

export const ROLES = {
  VENDOR: 'vendor',
  KARIGAR: 'karigar',
  SUPPLIER: 'supplier',
};

// Not a real role — the state of someone browsing without an account.
export const GUEST = 'guest';

export const ALL_ROLES = [ROLES.VENDOR, ROLES.KARIGAR, ROLES.SUPPLIER];

export const isRole = (value) => ALL_ROLES.includes(value);

/* ── Role identity ─────────────────────────────────────────────────────────── */

export const ROLE_META = {
  [ROLES.VENDOR]: {
    label: 'Vendor',
    labelHi: 'विक्रेता',
    icon: 'Store',
    home: '/home',
    tagline: 'Run your stall — stock, help and sales in one place',
  },
  [ROLES.KARIGAR]: {
    label: 'Karigar',
    labelHi: 'कारीगर',
    icon: 'Wrench',
    home: '/karigar/find-work',
    tagline: 'Find shifts near you and get paid for your skill',
  },
  [ROLES.SUPPLIER]: {
    label: 'Supplier',
    labelHi: 'आपूर्तिकर्ता',
    icon: 'Truck',
    home: '/supplier',
    tagline: 'Fulfil vendor orders and grow your route',
  },
};

// Where a guest lands, and where they get sent when they hit a gated route.
export const GUEST_HOME = '/home';
export const LOGIN_ROUTE = '/login';

export const getHomeRoute = (role) => ROLE_META[role]?.home ?? GUEST_HOME;

/* ── Primary navigation ────────────────────────────────────────────────────── */

// Deliberately short lists. A karigar's app really is four screens — padding it
// out with vendor tools is what made the old shared header confusing.
export const NAV_BY_ROLE = {
  [ROLES.VENDOR]: [
    { to: '/home', icon: 'Home', label: 'Home' },
    { to: '/deals', icon: 'Tag', label: 'Deals' },
    { to: '/karigar-connect', icon: 'Wrench', label: 'Hire' },
    { to: '/vendor-exchange', icon: 'RefreshCw', label: 'Exchange' },
    { to: '/virasaat', icon: 'Crown', label: 'Virasaat' },
    { to: '/dashboard', icon: 'BarChart3', label: 'Dashboard' },
  ],
  [ROLES.KARIGAR]: [
    { to: '/karigar/find-work', icon: 'Search', label: 'Find work' },
    { to: '/karigar/my-work', icon: 'ClipboardList', label: 'My work' },
    { to: '/karigar/earnings', icon: 'IndianRupee', label: 'Earnings' },
    { to: '/karigar/messages', icon: 'MessageSquare', label: 'Messages' },
  ],
  [ROLES.SUPPLIER]: [
    { to: '/supplier', icon: 'LayoutDashboard', label: 'Overview' },
    { to: '/supplier/orders', icon: 'ClipboardList', label: 'Orders' },
    { to: '/supplier/inventory', icon: 'Package', label: 'Inventory' },
    { to: '/supplier/deliveries', icon: 'Truck', label: 'Deliveries' },
  ],
  [GUEST]: [
    { to: '/home', icon: 'Home', label: 'Home' },
    { to: '/khau-galli', icon: 'MapPin', label: 'Khau Galli' },
    { to: '/deals', icon: 'Tag', label: 'Deals' },
  ],
};

export const getNavForRole = (role) => NAV_BY_ROLE[role] ?? NAV_BY_ROLE[GUEST];

/* ── Capabilities ──────────────────────────────────────────────────────────── */

// Capability checks read better at call sites than role equality, and they keep
// role logic out of components. Only vendors buy, so only vendors get a cart.
export const CAPABILITIES = {
  [ROLES.VENDOR]: ['cart', 'buy', 'hire', 'trade', 'sell-food', 'vyapaar-score'],
  [ROLES.KARIGAR]: ['work', 'hunar-profile'],
  [ROLES.SUPPLIER]: ['fulfil', 'inventory', 'wholesale-analytics'],
  [GUEST]: ['browse'],
};

export const can = (role, capability) =>
  (CAPABILITIES[role] ?? CAPABILITIES[GUEST]).includes(capability);
