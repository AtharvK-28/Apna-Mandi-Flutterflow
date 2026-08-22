import 'package:flutter/material.dart';

class SupplierDashboardWidget extends StatelessWidget {
  const SupplierDashboardWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Supplier Order Aggregation', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Bulk Aggregated Demand (Dadar Hub)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 12),
            _demandTile('Nashik Red Onions', '3.8 Tons Demanded', '14 Vendor Orders Combined'),
            _demandTile('Refined Peanut Oil (15L)', '42 Tins Demanded', '8 Vendor Orders Combined'),
            _demandTile('Besan Flour (50kg)', '18 Bags Demanded', '5 Vendor Orders Combined'),
          ],
        ),
      ),
    );
  }

  Widget _demandTile(String name, String total, String subtitle) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        trailing: Text(total, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
      ),
    );
  }
}
