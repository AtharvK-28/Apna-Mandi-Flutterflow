import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app_state.dart';
import 'pages/auth/login_widget.dart';
import 'pages/home/home_widget.dart';
import 'pages/deals/deals_widget.dart';
import 'pages/cart/cart_widget.dart';
import 'pages/orders/orders_widget.dart';
import 'pages/dashboard/vendor_dashboard_widget.dart';
import 'pages/karigar/karigar_connect_widget.dart';
import 'pages/supplier/supplier_dashboard_widget.dart';
import 'pages/virasaat/virasaat_widget.dart';
import 'pages/profile/profile_widget.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppState(),
      child: const ApnaMandiApp(),
    ),
  );
}

class ApnaMandiApp extends StatelessWidget {
  const ApnaMandiApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Apna Mandi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        useMaterial3: true,
        fontFamily: 'Inter',
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginWidget(),
        '/home': (context) => const HomeWidget(),
        '/deals': (context) => const DealsWidget(),
        '/cart': (context) => const CartWidget(),
        '/orders': (context) => const OrdersWidget(),
        '/dashboard': (context) => const VendorDashboardWidget(),
        '/karigar-connect': (context) => const KarigarConnectWidget(),
        '/supplier': (context) => const SupplierDashboardWidget(),
        '/virasaat': (context) => const VirasaatWidget(),
        '/profile': (context) => const ProfileWidget(),
      },
    );
  }
}
