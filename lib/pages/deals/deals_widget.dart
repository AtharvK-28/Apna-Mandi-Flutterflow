import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app_state.dart';

class DealsWidget extends StatelessWidget {
  const DealsWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    final List<Map<String, dynamic>> deals = [
      {
        'id': 'd1',
        'name': 'Fresh Nashik Red Onions',
        'price': 28.0,
        'unit': 'kg',
        'supplier': 'Kisan Mandi Direct',
        'category': 'Vegetables',
        'image': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
      },
      {
        'id': 'd2',
        'name': 'Indore Special Potatoes (Aloo)',
        'price': 22.0,
        'unit': 'kg',
        'supplier': 'Malwa Agro Traders',
        'category': 'Vegetables',
        'image': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
      },
      {
        'id': 'd3',
        'name': 'Refined Peanut Oil (15L Tin)',
        'price': 2150.0,
        'unit': 'tin',
        'supplier': 'Gujarat Oil Traders',
        'category': 'Oils & Spices',
        'image': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
      },
      {
        'id': 'd4',
        'name': 'Premium Besan (Gram Flour 50kg)',
        'price': 3800.0,
        'unit': 'bag',
        'supplier': 'Rajdhani Foods',
        'category': 'Grains',
        'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mandi Wholesale Deals', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: deals.length,
        itemBuilder: (context, index) {
          final item = deals[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(item['image'], width: 80, height: 80, fit: BoxFit.cover),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 4),
                        Text(item['supplier'], style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                        const SizedBox(height: 8),
                        Text(
                          '₹${item['price'].toInt()} / ${item['unit']}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF16A34A)),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      appState.addToCart(
                        CartItem(
                          id: item['id'],
                          name: item['name'],
                          price: item['price'],
                          unit: item['unit'],
                          supplier: item['supplier'],
                          image: item['image'],
                        ),
                      );
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('${item['name']} added to cart!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A)),
                    child: const Text('Add', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
