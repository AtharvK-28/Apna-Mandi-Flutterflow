// FlutterFlow → Custom Code → Custom Functions
//
// Display and speech formatting. Ports src/utils/speech.js plus the currency
// and relative-time helpers scattered through the React components.
//
// Requires the `intl` package (see 00-SETUP.md).

import 'package:intl/intl.dart';

// ═════════════════════════════════════════════════════════════════════════════
// Currency
// ═════════════════════════════════════════════════════════════════════════════

/// FF: formatRupees(double? amount) -> String
///
/// "₹1,20,450" — Indian digit grouping (lakh/crore), not the Western
/// thousands grouping Flutter's default NumberFormat gives you. `₹1,20,450`
/// and `₹120,450` are the same number, but only one of them is readable to
/// the person this app is for.
///
/// No decimals: every price in this app is a whole rupee, and "₹25.00" on a
/// vegetable price reads like a supermarket receipt, not a mandi.
String formatRupees(double? amount) {
  if (amount == null) return '';
  return NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  ).format(amount);
}

/// FF: formatRupeesCompact(double? amount) -> String
/// "₹1.2L" / "₹45K" — for dashboard tiles where the full number does not fit.
String formatRupeesCompact(double? amount) {
  if (amount == null) return '';
  if (amount >= 10000000) return '₹${(amount / 10000000).toStringAsFixed(1)}Cr';
  if (amount >= 100000) return '₹${(amount / 100000).toStringAsFixed(1)}L';
  if (amount >= 1000) return '₹${(amount / 1000).toStringAsFixed(1)}K';
  return formatRupees(amount);
}

/// FF: discountPercent(double? price, double? originalPrice) -> int
/// Returns 0 when there is no genuine discount, so the card can hide the badge
/// rather than showing "0% off".
int discountPercent(double? price, double? originalPrice) {
  if (price == null || originalPrice == null) return 0;
  if (originalPrice <= 0 || originalPrice <= price) return 0;
  return (((originalPrice - price) / originalPrice) * 100).round();
}

// ═════════════════════════════════════════════════════════════════════════════
// Time
// ═════════════════════════════════════════════════════════════════════════════

/// FF: timeAgo(DateTime? when) -> String
/// "2 hours ago". Below a minute it says "just now" rather than "0 minutes ago".
String timeAgo(DateTime? when) {
  if (when == null) return '';
  final diff = DateTime.now().difference(when);
  if (diff.isNegative) return 'just now';
  if (diff.inSeconds < 60) return 'just now';
  if (diff.inMinutes < 60) {
    return '${diff.inMinutes} minute${diff.inMinutes == 1 ? '' : 's'} ago';
  }
  if (diff.inHours < 24) {
    return '${diff.inHours} hour${diff.inHours == 1 ? '' : 's'} ago';
  }
  if (diff.inDays < 7) {
    return '${diff.inDays} day${diff.inDays == 1 ? '' : 's'} ago';
  }
  if (diff.inDays < 30) {
    final w = (diff.inDays / 7).floor();
    return '$w week${w == 1 ? '' : 's'} ago';
  }
  return DateFormat('d MMM').format(when);
}

/// FF: timeUntil(DateTime? deadline) -> String
/// "Ends in 3h 20m" for expiring deals. Returns 'Expired' once past.
String timeUntil(DateTime? deadline) {
  if (deadline == null) return '';
  final diff = deadline.difference(DateTime.now());
  if (diff.isNegative) return 'Expired';
  if (diff.inHours >= 24) return '${diff.inDays}d left';
  if (diff.inHours >= 1) return '${diff.inHours}h ${diff.inMinutes % 60}m left';
  return '${diff.inMinutes}m left';
}

/// FF: shiftWhen(DateTime? start, DateTime? end) -> String
/// "Today, 5:00 PM – 10:00 PM". Relative day names for today and tomorrow —
/// a karigar deciding whether to take a shift cares about "today", not "22 Aug".
String shiftWhen(DateTime? start, DateTime? end) {
  if (start == null) return '';
  final now = DateTime.now();
  final startDay = DateTime(start.year, start.month, start.day);
  final today = DateTime(now.year, now.month, now.day);
  final dayDiff = startDay.difference(today).inDays;

  final String day;
  if (dayDiff == 0) {
    day = 'Today';
  } else if (dayDiff == 1) {
    day = 'Tomorrow';
  } else if (dayDiff > 1 && dayDiff < 7) {
    day = DateFormat('EEEE').format(start);
  } else {
    day = DateFormat('d MMM').format(start);
  }

  final from = DateFormat('h:mm a').format(start);
  if (end == null) return '$day, $from';
  return '$day, $from – ${DateFormat('h:mm a').format(end)}';
}

// ═════════════════════════════════════════════════════════════════════════════
// Status labels
//
// The single place a status string becomes user-facing text. Adding a status to
// Firestore without adding it here shows the raw value ("out-for-delivery") in
// the UI, which is how these lists drift apart.
// ═════════════════════════════════════════════════════════════════════════════

/// FF: orderStatusLabel(String? status) -> String
String orderStatusLabel(String? status) {
  switch (status) {
    case 'pending':
      return 'Awaiting confirmation';
    case 'confirmed':
      return 'Confirmed';
    case 'packed':
      return 'Packed';
    case 'out-for-delivery':
      return 'On the way';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

/// FF: orderStatusTone(String? status) -> String
/// A theme colour name from 01-DESIGN-SYSTEM.md — never a hex value.
String orderStatusTone(String? status) {
  switch (status) {
    case 'delivered':
      return 'leaf';
    case 'cancelled':
      return 'chili';
    case 'out-for-delivery':
    case 'packed':
      return 'turmeric';
    default:
      return 'terracotta';
  }
}

/// FF: orderStatusStep(String? status) -> int
/// 0-based position on the tracking stepper. Cancelled returns -1 so the page
/// can render a cancelled state instead of a half-finished progress line.
int orderStatusStep(String? status) {
  const steps = ['pending', 'confirmed', 'packed', 'out-for-delivery', 'delivered'];
  if (status == 'cancelled') return -1;
  final i = steps.indexOf(status ?? '');
  return i < 0 ? 0 : i;
}

/// FF: urgencyLabel(String? urgency) -> String
String urgencyLabel(String? urgency) {
  switch (urgency) {
    case 'high':
      return 'Urgent';
    case 'medium':
      return 'Soon';
    case 'low':
      return 'Flexible';
    default:
      return '';
  }
}

/// FF: urgencyTone(String? urgency) -> String
String urgencyTone(String? urgency) {
  switch (urgency) {
    case 'high':
      return 'chili';
    case 'medium':
      return 'turmeric';
    default:
      return 'leaf';
  }
}

/// FF: gigTypeLabel(String? gigType) -> String
String gigTypeLabel(String? gigType) {
  switch (gigType) {
    case 'emergency':
      return 'Emergency';
    case 'prep':
      return 'Prep help';
    case 'training':
      return 'Training';
    default:
      return '';
  }
}

/// FF: dealTypeLabel(String? dealType) -> String
String dealTypeLabel(String? dealType) {
  switch (dealType) {
    case 'fresh-morning':
      return 'Fresh this morning';
    case 'end-of-day':
      return 'End of day';
    case 'bulk-discount':
      return 'Bulk discount';
    default:
      return '';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// Greeting
// ═════════════════════════════════════════════════════════════════════════════

/// FF: greeting(String? displayName) -> String
///
/// There is no placeholder identity in this app. An unnamed user has a null
/// displayName and the caller decides how to greet them — inventing "User" or
/// "Vendor" as a name is worse than not using one.
String greeting(String? displayName) {
  final hour = DateTime.now().hour;
  final part = hour < 12
      ? 'Good morning'
      : (hour < 17 ? 'Good afternoon' : 'Good evening');
  if (displayName == null || displayName.trim().isEmpty) return part;
  return '$part, ${displayName.trim()}';
}
