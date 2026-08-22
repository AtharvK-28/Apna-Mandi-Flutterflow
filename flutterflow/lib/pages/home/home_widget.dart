import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app_state.dart';
import '../../components/connection_banner.dart';
import '../../components/vyapaar_gauge.dart';

class HomeWidget extends StatefulWidget {
  const HomeWidget({Key? key}) : super(key: key);

  @override
  State<HomeWidget> createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> {
  bool _isListening = false;
  String _voicePrompt = 'Tap the mic and say e.g. "50kg Aloo and 10L Oil chahiye"';

  void _triggerVoice() {
    setState(() {
      _isListening = true;
      _voicePrompt = 'Listening... Speak now';
    });

    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _isListening = false;
          _voicePrompt = 'Recognized: "25kg Nashik Onion + 15L Oil" — Items Added to Cart!';
        });
        Provider.of<AppState>(context, listen: false).addToCart(
          CartItem(
            id: 'v1',
            name: 'Voice Order: Nashik Red Onions (25kg)',
            price: 28.0,
            unit: 'kg',
            quantity: 25,
            supplier: 'Kisan Mandi Direct',
            image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: Row(
          children: const [
            Icon(Icons.storefront, color: Color(0xFF16A34A)),
            SizedBox(width: 8),
            Text(
              'Apna Mandi',
              style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              appState.isOnline ? Icons.wifi : Icons.wifi_off,
              color: appState.isOnline ? const Color(0xFF16A34A) : Colors.orange,
            ),
            onPressed: () => appState.toggleOnline(),
          ),
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined, color: Color(0xFF0F172A)),
                onPressed: () => Navigator.pushNamed(context, '/cart'),
              ),
              if (appState.cartCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEA580C),
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${appState.cartCount}',
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          const ConnectionBanner(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Bolo Mandi AI Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF16A34A), Color(0xFF15803D)],
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'Bolo Mandi — Voice Order AI',
                          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _voicePrompt,
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 13),
                        ),
                        const SizedBox(height: 16),
                        FloatingActionButton.extended(
                          onPressed: _triggerVoice,
                          backgroundColor: _isListening ? Colors.red : Colors.white,
                          icon: Icon(
                            _isListening ? Icons.graphic_eq : Icons.mic,
                            color: _isListening ? Colors.white : const Color(0xFF16A34A),
                          ),
                          label: Text(
                            _isListening ? 'Listening...' : 'Tap to Speak',
                            style: TextStyle(
                              color: _isListening ? Colors.white : const Color(0xFF16A34A),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Vyapaar Gauge
                  VyapaarGauge(score: appState.vyapaarScore),
                  const SizedBox(height: 20),

                  // Mandi Group Buy Pool Card
                  _buildPoolCard(context),
                  const SizedBox(height: 20),

                  // Section Title
                  const Text(
                    'Today\'s Mandi Wholesale Deals',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 12),
                  _buildDealItem(
                    title: 'Nashik Red Onions (Grade A)',
                    price: '₹28 / kg',
                    discount: '18% Group Savings',
                    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
                  ),
                  _buildDealItem(
                    title: 'Refined Peanut Oil (15L Tin)',
                    price: '₹2,150 / tin',
                    discount: 'Save ₹320 vs retail',
                    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(context, 0),
    );
  }

  Widget _buildPoolCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFEDD5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFEA580C).withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                '👥 Mandi Pool Active in Dadar Market',
                style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFEA580C)),
              ),
              Chip(
                label: Text('3.2 Tons Joined', style: TextStyle(fontSize: 10, color: Colors.white)),
                backgroundColor: Color(0xFFEA580C),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            '14 neighboring street food stalls joined the bulk onion order. Unlock wholesale pricing at ₹24/kg!',
            style: TextStyle(fontSize: 12, color: Color(0xFF7C2D12)),
          ),
        ],
      ),
    );
  }

  Widget _buildDealItem({required String title, required String price, required String discount, required String image}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(image, width: 56, height: 56, fit: BoxFit.cover),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(discount, style: const TextStyle(color: Color(0xFF16A34A), fontSize: 12)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(price, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
            const SizedBox(height: 4),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF16A34A),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              ),
              child: const Text('Add', style: TextStyle(fontSize: 12, color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context, int currentIndex) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      selectedItemColor: const Color(0xFF16A34A),
      unselectedItemColor: Colors.grey,
      type: BottomNavigationBarType.fixed,
      onTap: (index) {
        switch (index) {
          case 0:
            Navigator.pushReplacementNamed(context, '/home');
            break;
          case 1:
            Navigator.pushReplacementNamed(context, '/deals');
            break;
          case 2:
            Navigator.pushReplacementNamed(context, '/orders');
            break;
          case 3:
            Navigator.pushReplacementNamed(context, '/dashboard');
            break;
          case 4:
            Navigator.pushReplacementNamed(context, '/profile');
            break;
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.shopping_bag), label: 'Deals'),
        BottomNavigationBarItem(icon: Icon(Icons.receipt_long), label: 'Orders'),
        BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
      ],
    );
  }
}
