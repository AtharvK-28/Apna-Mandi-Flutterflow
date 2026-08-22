import 'package:flutter/material.dart';

class VendorDashboardWidget extends StatelessWidget {
  const VendorDashboardWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vendor Analytics & OS Dashboard', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Revenue overview
            Row(
              children: [
                _statTile('Today\'s Revenue', '₹4,850', Icons.payments, const Color(0xFF16A34A)),
                const SizedBox(width: 12),
                _statTile('Orders Fulfilled', '38 Stalls', Icons.shopping_basket, const Color(0xFF0284C7)),
              ],
            ),
            const SizedBox(height: 16),

            // Mausam Intelligence Card
            _cardContainer(
              title: '🌧️ Mausam Engine — Monsoon Forecast',
              color: const Color(0xFF0284C7),
              child: const Text(
                'Heavy rains predicted in Dadar/Wadala area between 3 PM - 6 PM today. Recommend enabling Barsaat Waterproofing Cover & ordering +20% extra fried snacks inventory.',
                style: TextStyle(fontSize: 13, color: Color(0xFF0F172A)),
              ),
            ),
            const SizedBox(height: 16),

            // Tyohar Book Event Catering Card
            _cardContainer(
              title: '🎉 Tyohar Book — Event Catering Lead',
              color: const Color(0xFFEA580C),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Ganesh Chaturthi Community Feast (250 Plates Vada Pav)',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text('Event Date: 28 Aug 2026 • Budget: ₹12,500', style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEA580C)),
                    child: const Text('Accept Catering Contract', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statTile(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Color(0xFF0F172A))),
            Text(title, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _cardContainer({required String title, required Color color, required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: color)),
          const SizedBox(height: 8),
          child,
        ],
      ),
    );
  }
}
