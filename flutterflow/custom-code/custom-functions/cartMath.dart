// FlutterFlow → Custom Code → Custom Functions
//
// Cart arithmetic. Port of the derived values in src/contexts/CartContext.jsx.
//
// `cartItems` is App State (persisted), typed List<CartItem>. In FlutterFlow
// these functions take `List<CartItemStruct>`; the parameter type name below is
// what FlutterFlow generates for the `CartItem` data type in 02-DATA-SCHEMA.md.
//
// Money is computed here, in one place, and never inline in a widget. Two
// screens computing a total slightly differently — one including delivery, one
// not — is the classic version of this bug, and the user only finds out at the
// payment screen.

/// FF: cartItemCount(List<CartItemStruct> items) -> int
///
/// Distinct lines, not total units. The badge shows how many *things* are in
/// the cart; "12" on the badge for 12kg of one item reads as twelve products.
int cartItemCount(List<CartItemStruct> items) => items.length;

/// FF: cartSubtotal(List<CartItemStruct> items) -> double
double cartSubtotal(List<CartItemStruct> items) {
  var total = 0.0;
  for (final item in items) {
    total += (item.unitPrice ?? 0) * (item.quantity ?? 0);
  }
  return total;
}

/// FF: cartDeliveryFee(List<CartItemStruct> items, double fee, double threshold) -> double
///
/// Free over the threshold. Also free for an empty cart — charging delivery on
/// nothing shows "₹30" under an empty cart, which looks broken.
double cartDeliveryFee(
  List<CartItemStruct> items,
  double fee,
  double threshold,
) {
  if (items.isEmpty) return 0;
  return cartSubtotal(items) >= threshold ? 0 : fee;
}

/// FF: cartTotal(List<CartItemStruct> items, double fee, double threshold) -> double
double cartTotal(List<CartItemStruct> items, double fee, double threshold) =>
    cartSubtotal(items) + cartDeliveryFee(items, fee, threshold);

/// FF: cartSavings(List<CartItemStruct> items, List<dynamic> originalPrices) -> double
///
/// Total saved against list price. `originalPrices` is a parallel list of the
/// deals' `originalPrice` values, since CartItem stores only what was paid.
/// A null original means the item was never discounted and contributes zero —
/// counting it as full price would invent a saving.
double cartSavings(List<CartItemStruct> items, List<dynamic> originalPrices) {
  var saved = 0.0;
  for (var i = 0; i < items.length; i++) {
    if (i >= originalPrices.length) break;
    final original = originalPrices[i];
    if (original is! num) continue;
    final paid = items[i].unitPrice ?? 0;
    if (original <= paid) continue;
    saved += (original - paid) * (items[i].quantity ?? 0);
  }
  return saved;
}

/// FF: amountToFreeDelivery(List<CartItemStruct> items, double threshold) -> double
/// Returns 0 once free delivery is reached, so the prompt can hide itself.
double amountToFreeDelivery(List<CartItemStruct> items, double threshold) {
  final remaining = threshold - cartSubtotal(items);
  return remaining > 0 ? remaining : 0;
}

/// FF: cartIndexOfDeal(List<CartItemStruct> items, DocumentReference dealRef) -> int
///
/// Where a deal already sits in the cart, or -1. Cart identity is the deal
/// reference — adding the same deal twice must bump the quantity of the
/// existing line, never append a second line for the same product.
int cartIndexOfDeal(List<CartItemStruct> items, DocumentReference? dealRef) {
  if (dealRef == null) return -1;
  for (var i = 0; i < items.length; i++) {
    if (items[i].dealRef?.path == dealRef.path) return i;
  }
  return -1;
}

/// FF: isValidCartQuantity(double quantity, double available, double? minQuantity) -> bool
///
/// Bulk-discount deals carry a minimum. Enforce it at the moment of adding, not
/// at checkout — a vendor who gets to the payment screen and is told their
/// order is invalid has already spent the time.
bool isValidCartQuantity(double quantity, double available, double? minQuantity) {
  if (quantity <= 0) return false;
  if (quantity > available) return false;
  if (minQuantity != null && quantity < minQuantity) return false;
  return true;
}

/// FF: cartQuantityError(double quantity, double available, double? minQuantity, String unit) -> String
///
/// The message to show when the above returns false. Says what to do, not just
/// what is wrong — "Only 5 kg left" beats "Invalid quantity".
String cartQuantityError(
  double quantity,
  double available,
  double? minQuantity,
  String unit,
) {
  if (quantity <= 0) return 'Enter how much you need';
  if (quantity > available) {
    return 'Only ${available.toStringAsFixed(available.truncateToDouble() == available ? 0 : 1)} $unit left';
  }
  if (minQuantity != null && quantity < minQuantity) {
    return 'Bulk deal — order at least ${minQuantity.toStringAsFixed(0)} $unit';
  }
  return '';
}
