import 'package:flutter/material.dart';

class CartItem {
  final String id;
  final String name;
  final double price;
  final String unit;
  int quantity;
  final String supplier;
  final String image;

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    required this.unit,
    this.quantity = 1,
    required this.supplier,
    required this.image,
  });
}

class AppState extends ChangeNotifier {
  static final AppState _instance = AppState._internal();
  factory AppState() => _instance;
  AppState._internal();

  String _userRole = 'vendor';
  String get userRole => _userRole;

  bool _isOnline = true;
  bool get isOnline => _isOnline;

  int _vyapaarScore = 780;
  int get vyapaarScore => _vyapaarScore;

  final List<CartItem> _cart = [
    CartItem(
      id: 'p1',
      name: 'Fresh Red Onions (Nashik Quality)',
      price: 28.0,
      unit: 'kg',
      quantity: 25,
      supplier: 'Kisan Mandi Direct',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    ),
    CartItem(
      id: 'p2',
      name: 'Refined Peanut Oil (15L Tin)',
      price: 2150.0,
      unit: 'tin',
      quantity: 1,
      supplier: 'Gujarat Oil Traders',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    ),
  ];

  List<CartItem> get cart => _cart;

  double get cartTotal {
    return _cart.fold(0, (sum, item) => sum + (item.price * item.quantity));
  }

  int get cartCount {
    return _cart.fold(0, (sum, item) => sum + item.quantity);
  }

  void addToCart(CartItem item) {
    final index = _cart.indexWhere((element) => element.id == item.id);
    if (index >= 0) {
      _cart[index].quantity += item.quantity;
    } else {
      _cart.add(item);
    }
    notifyListeners();
  }

  void removeFromCart(String id) {
    _cart.removeWhere((item) => item.id == id);
    notifyListeners();
  }

  void updateQuantity(String id, int quantity) {
    final index = _cart.indexWhere((item) => item.id == id);
    if (index >= 0) {
      if (quantity <= 0) {
        _cart.removeAt(index);
      } else {
        _cart[index].quantity = quantity;
      }
      notifyListeners();
    }
  }

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }

  void setRole(String role) {
    _userRole = role;
    notifyListeners();
  }

  void toggleOnline() {
    _isOnline = !_isOnline;
    notifyListeners();
  }
}
