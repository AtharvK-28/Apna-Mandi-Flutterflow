import 'package:flutter/material.dart';

class KarigarConnectWidget extends StatelessWidget {
  const KarigarConnectWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Karigar Connect — Skilled Artisans', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _karigarCard(
            name: 'Ramesh Karigar',
            skill: 'Specialist Bhatti & Cart Repair',
            experience: '12 Years Exp.',
            rating: '4.9 ★',
            rate: '₹500 / visit',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          ),
          _karigarCard(
            name: 'Suresh Kumar',
            skill: 'Gas Pipeline & Stainless Steel Welding',
            experience: '8 Years Exp.',
            rating: '4.8 ★',
            rate: '₹450 / visit',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
          ),
        ],
      ),
    );
  }

  Widget _karigarCard({
    required String name,
    required String skill,
    required String experience,
    required String rating,
    required String rate,
    required String avatar,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(radius: 30, backgroundImage: NetworkImage(avatar)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(skill, style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(4)),
                        child: Text(rating, style: const TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 11)),
                      ),
                      const SizedBox(width: 8),
                      Text(experience, style: TextStyle(color: Colors.grey.shade500, fontSize: 11)),
                    ],
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A)),
              child: const Text('Hire', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }
}
