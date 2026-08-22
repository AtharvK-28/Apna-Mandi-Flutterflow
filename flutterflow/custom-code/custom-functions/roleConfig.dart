// FlutterFlow → Custom Code → Custom Functions
//
// Port of src/config/roles.js — the single source of truth for who each user
// type is and what they can reach.
//
// Apna Mandi is three apps sharing one shell. A vendor runs a stall (buys stock,
// hires help, sells food), a karigar sells skilled labour by the shift, and a
// supplier sells goods wholesale. Their jobs barely overlap, so their landing
// page, navigation and permitted routes are defined here rather than assembled
// ad-hoc in each page's widget tree.
//
// Anything that needs to know "can this person see X" reads from this file.
//
// ── Adding each function in FlutterFlow ───────────────────────────────────────
// Each `///  FF:` block below gives the exact signature to declare in the
// Custom Function dialog. Declare them as separate functions with these names —
// FlutterFlow does not import one custom function file into another, so the
// private helpers (_...) must be pasted into every function that uses them, or
// kept in a shared Custom Code file added under Custom Code → Custom Files.

// ═════════════════════════════════════════════════════════════════════════════
// Roles
// ═════════════════════════════════════════════════════════════════════════════

const String kRoleVendor = 'vendor';
const String kRoleKarigar = 'karigar';
const String kRoleSupplier = 'supplier';

// Not a real role — the state of someone browsing without an account.
const String kGuest = 'guest';

const List<String> kAllRoles = [kRoleVendor, kRoleKarigar, kRoleSupplier];

const String kGuestHome = '/home';
const String kLoginRoute = '/login';

/// FF: isRole(String? role) -> bool
bool isRole(String? role) => kAllRoles.contains(role);

// ═════════════════════════════════════════════════════════════════════════════
// Role identity
// ═════════════════════════════════════════════════════════════════════════════

/// FF: roleLabel(String? role) -> String
String roleLabel(String? role) {
  switch (role) {
    case kRoleVendor:
      return 'Vendor';
    case kRoleKarigar:
      return 'Karigar';
    case kRoleSupplier:
      return 'Supplier';
    default:
      return 'Guest';
  }
}

/// FF: roleLabelHi(String? role) -> String
/// The Devanagari label. Shown beside the English one on the login role picker,
/// because the target user may read one and not the other.
String roleLabelHi(String? role) {
  switch (role) {
    case kRoleVendor:
      return 'विक्रेता';
    case kRoleKarigar:
      return 'कारीगर';
    case kRoleSupplier:
      return 'आपूर्तिकर्ता';
    default:
      return 'अतिथि';
  }
}

/// FF: roleTagline(String? role) -> String
String roleTagline(String? role) {
  switch (role) {
    case kRoleVendor:
      return 'Run your stall — stock, help and sales in one place';
    case kRoleKarigar:
      return 'Find shifts near you and get paid for your skill';
    case kRoleSupplier:
      return 'Fulfil vendor orders and grow your route';
    default:
      return 'Browse deals and food streets near you';
  }
}

/// FF: roleIcon(String? role) -> String
/// Returns a Material icon name. Map it to an Icon widget in the page.
String roleIcon(String? role) {
  switch (role) {
    case kRoleVendor:
      return 'storefront';
    case kRoleKarigar:
      return 'handyman';
    case kRoleSupplier:
      return 'local_shipping';
    default:
      return 'person_outline';
  }
}

/// FF: homeRouteForRole(String? role) -> String
///
/// Where each user lands after login, and where the route guard sends someone
/// who has wandered into another role's screen. An unknown role falls through
/// to the guest home rather than throwing — a null role during the first frame
/// of a cold start is normal, not an error.
String homeRouteForRole(String? role) {
  switch (role) {
    case kRoleVendor:
      return '/home';
    case kRoleKarigar:
      return '/karigar/find-work';
    case kRoleSupplier:
      return '/supplier';
    default:
      return kGuestHome;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// Primary navigation
// ═════════════════════════════════════════════════════════════════════════════

/// FF: navItemsForRole(String? role) -> List<dynamic>   [Return type: JSON]
///
/// Each entry is {route, icon, label}. Bind a Row/ListView to this and build
/// the bar from it, so adding a screen is a change here and nowhere else.
///
/// Deliberately short lists. A karigar's app really is four screens — padding
/// it out with vendor tools is what made the old shared header confusing.
List<dynamic> navItemsForRole(String? role) {
  switch (role) {
    case kRoleVendor:
      return [
        {'route': '/home', 'icon': 'home_outlined', 'label': 'Home'},
        {'route': '/deals', 'icon': 'sell_outlined', 'label': 'Deals'},
        {'route': '/karigar-connect', 'icon': 'handyman', 'label': 'Hire'},
        {'route': '/vendor-exchange', 'icon': 'swap_horiz', 'label': 'Exchange'},
        {'route': '/virasaat', 'icon': 'workspace_premium', 'label': 'Virasaat'},
        {'route': '/dashboard', 'icon': 'bar_chart', 'label': 'Dashboard'},
      ];
    case kRoleKarigar:
      return [
        {'route': '/karigar/find-work', 'icon': 'search', 'label': 'Find work'},
        {'route': '/karigar/my-work', 'icon': 'receipt_long', 'label': 'My work'},
        {'route': '/karigar/earnings', 'icon': 'currency_rupee', 'label': 'Earnings'},
        {'route': '/karigar/messages', 'icon': 'chat_bubble_outline', 'label': 'Messages'},
      ];
    case kRoleSupplier:
      return [
        {'route': '/supplier', 'icon': 'dashboard_outlined', 'label': 'Overview'},
        {'route': '/supplier/orders', 'icon': 'receipt_long', 'label': 'Orders'},
        {'route': '/supplier/inventory', 'icon': 'inventory_2_outlined', 'label': 'Inventory'},
        {'route': '/supplier/deliveries', 'icon': 'local_shipping', 'label': 'Deliveries'},
      ];
    default:
      return [
        {'route': '/home', 'icon': 'home_outlined', 'label': 'Home'},
        {'route': '/khau-galli', 'icon': 'place_outlined', 'label': 'Khau Galli'},
        {'route': '/deals', 'icon': 'sell_outlined', 'label': 'Deals'},
      ];
  }
}

/// FF: navIndexForRoute(String? role, String currentRoute) -> int
///
/// Which nav item is selected. Returns 0 rather than -1 when the current screen
/// is not in the bar (Cart, Orders, Profile) — a bar with nothing highlighted
/// reads as a rendering bug to most users.
int navIndexForRoute(String? role, String currentRoute) {
  final items = navItemsForRole(role);
  for (var i = 0; i < items.length; i++) {
    if (items[i]['route'] == currentRoute) return i;
  }
  return 0;
}

// ═════════════════════════════════════════════════════════════════════════════
// Capabilities
// ═════════════════════════════════════════════════════════════════════════════

/// FF: can(String? role, String capability) -> bool
///
/// Capability checks read better at call sites than role equality, and they
/// keep role logic out of the widget tree. Only vendors buy, so only vendors
/// get a cart:  can(userRole, 'cart')  — not  userRole == 'vendor'.
bool can(String? role, String capability) {
  const caps = <String, List<String>>{
    kRoleVendor: ['cart', 'buy', 'hire', 'trade', 'sell-food', 'vyapaar-score'],
    kRoleKarigar: ['work', 'hunar-profile'],
    kRoleSupplier: ['fulfil', 'inventory', 'wholesale-analytics'],
    kGuest: ['browse'],
  };
  return (caps[role] ?? caps[kGuest]!).contains(capability);
}

// ═════════════════════════════════════════════════════════════════════════════
// Route access
// ═════════════════════════════════════════════════════════════════════════════

/// FF: routeAllowsGuest(String route) -> bool
///
/// Account-less browsing. Everything a guest can see is read-only — there is no
/// guest-writable screen, so this list is also the list of pages that need no
/// write rule in Firestore.
bool routeAllowsGuest(String route) =>
    const ['/home', '/deals', '/khau-galli', '/login', '/'].contains(route);

/// FF: canAccessRoute(String? role, bool isGuest, String route, List<String> allowedRoles) -> bool
bool canAccessRoute(
  String? role,
  bool isGuest,
  String route,
  List<String> allowedRoles,
) {
  if (isGuest) return routeAllowsGuest(route);
  if (!isRole(role)) return false;
  return allowedRoles.contains(role);
}
