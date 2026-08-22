// FlutterFlow → Custom Code → Custom Actions
//
// Checkout. Turns the App State cart into `orders` documents.
//
//   Name:        placeOrder
//   Arguments:   paymentMethod (String) — 'cod' | 'upi'
//                deliverySlot  (String)
//   Return type: List<String>  (the order numbers created)
//   Async:       yes
//
// ── Why this is a custom action and not a chain of Firestore blocks ──────────
//
// A cart can contain items from several suppliers, and one supplier cannot
// fulfil another's items. So one cart becomes ONE ORDER PER SUPPLIER. Doing
// that with FlutterFlow's built-in "Create Document" blocks means a loop over a
// grouping you cannot express in the action editor, with no transaction around
// it — and a half-written checkout leaves a vendor charged for an order that
// does not exist.
//
// Everything here runs in a single Firestore batch: all the orders commit, or
// none do.
//
// ── What this deliberately does NOT do ───────────────────────────────────────
//
// It does not take payment. There is no payment integration in this app, and
// `paymentStatus` is written as 'pending' for both methods. Do not wire a UPI
// deep link to this action and call the result paid — the app has no way to
// confirm a UPI transfer completed, and marking an unpaid order paid is worse
// than having no payment feature.
//
// It does not queue offline. There is no write replay anywhere in this app.
// If the device is offline, this throws and the caller must say so plainly.
// Do not add copy implying the order will send later — it will not.

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

Future<List<String>> placeOrder(String paymentMethod, String deliverySlot) async {
  final uid = FirebaseAuth.instance.currentUser?.uid;
  if (uid == null) throw Exception('Not signed in');

  final items = FFAppState().cartItems;
  if (items.isEmpty) throw Exception('Cart is empty');

  final firestore = FirebaseFirestore.instance;
  final vendorRef = firestore.collection('users').doc(uid);
  final vendorSnap = await vendorRef.get();
  final vendorName = (vendorSnap.data()?['stallName'] ??
          vendorSnap.data()?['displayName'] ??
          '') as String;

  // Group the cart by supplier.
  final bySupplier = <String, List<CartItemStruct>>{};
  for (final item in items) {
    final key = item.supplierRef?.path ?? 'unknown';
    bySupplier.putIfAbsent(key, () => []).add(item);
  }

  final batch = firestore.batch();
  final orderNumbers = <String>[];
  final now = DateTime.now();

  // Sequence within this checkout, so a two-supplier cart produces two
  // distinguishable numbers rather than the same one twice.
  var sequence = 0;

  for (final entry in bySupplier.entries) {
    final supplierItems = entry.value;

    var subtotal = 0.0;
    final orderItems = <Map<String, dynamic>>[];
    for (final item in supplierItems) {
      final lineTotal = (item.unitPrice ?? 0) * (item.quantity ?? 0);
      subtotal += lineTotal;
      orderItems.add({
        'dealRef': item.dealRef,
        'name': item.name,
        'image': item.image,
        'unit': item.unit,
        'unitPrice': item.unitPrice,
        'quantity': item.quantity,
        'supplierName': item.supplierName,
        'supplierRef': item.supplierRef,
        'lineTotal': lineTotal,
      });
    }

    // Delivery is charged per supplier, because each supplier delivers
    // separately. Charging it once for a multi-supplier cart would be
    // undercharging, and the vendor would find out at the door.
    final deliveryFee = subtotal >= FFAppState().freeDeliveryThreshold
        ? 0.0
        : FFAppState().deliveryFee;

    final orderRef = firestore.collection('orders').doc();

    // Display-only. Never used as a key — the document id is the key.
    final orderNumber =
        '#ORD${now.millisecondsSinceEpoch.toString().substring(7)}${sequence.toString().padLeft(2, '0')}';
    sequence++;

    batch.set(orderRef, {
      'orderNumber': orderNumber,
      'vendorRef': vendorRef,
      'vendorName': vendorName,
      'supplierRef': supplierItems.first.supplierRef,
      'supplierName': supplierItems.first.supplierName,
      'items': orderItems,
      'itemCount': orderItems.length,
      'subtotal': subtotal,
      'deliveryFee': deliveryFee,
      'totalAmount': subtotal + deliveryFee,
      'status': 'pending',
      'paymentMethod': paymentMethod,
      // Always 'pending'. See the note at the top of this file.
      'paymentStatus': 'pending',
      'placedAt': FieldValue.serverTimestamp(),
      'deliverySlot': deliverySlot,
      'deliveredAt': null,
      'routeRef': null,
      'poolRef': null,
      'rating': null,
    });

    orderNumbers.add(orderNumber);
  }

  await batch.commit();

  // Only clear the cart once the commit has actually succeeded. Clearing it
  // optimistically and then failing loses the vendor's entire basket, which on
  // a bad connection is the difference between a retry and a lost customer.
  FFAppState().cartItems = [];

  return orderNumbers;
}
