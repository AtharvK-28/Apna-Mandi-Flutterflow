import 'package:flutter/material.dart';

class VirasaatWidget extends StatelessWidget {
  const VirasaatWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Virasaat — Cultural Recipes & Heritage', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _recipeCard(
            title: 'Authentic Mumbai Vada Pav Masala Ratio',
            author: 'Master Chef Prakash (40 Yrs Stall)',
            description: 'Secret garlic chili chutney ratio perfected for high-volume street sales with 3-day shelf life.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
          ),
          _recipeCard(
            title: 'Crispy Kanda Bhajji Batter Dynamics',
            author: 'Kalyan Mandi Virasaat Collection',
            description: 'How to keep bhajjis crispy during rainy monsoon hours using rice flour ratios.',
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
          ),
        ],
      ),
    );
  }

  Widget _recipeCard({required String title, required String author, required String description, required String image}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Image.network(image, height: 160, width: double.infinity, fit: BoxFit.cover),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(author, style: const TextStyle(color: Color(0xFF16A34A), fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(description, style: TextStyle(color: Colors.grey.shade700, fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
