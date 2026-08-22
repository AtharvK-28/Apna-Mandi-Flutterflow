import 'package:flutter/material.dart';

class OrdersWidget extends StatelessWidget {
  const OrdersWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Order History & Live Tracking', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _orderCard(
            orderId: 'ORD-9821',
            status: 'Out for Delivery',
            statusColor: Colors.orange,
            date: 'Today, 08:30 AM',
            supplier: 'Kisan Mandi Direct',
            items: '25kg Nashik Onion, 15L Peanut Oil',
            total: '₹2,850',
          ),
          _orderCard(
            orderId: 'ORD-9764',
            status: 'Delivered',
            statusColor: const Color(0xFF16A34A),
            date: '20 Aug 2026',
            supplier: 'Malwa Agro Traders',
            items: '50kg Potato (Aloo)',
            total: '₹1,100',
          ),
        ],
      ),
    );
  }

  Widget _orderCard({
    required String orderId,
    required String status,
    required Color statusColor,
    required String date,
    required String supplier,
    required String items,
    required String total,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(orderId, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    status,
                    style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(supplier, style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF0F172A))),
            Text(items, style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(date, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                Text(total, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF16A34A))),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
