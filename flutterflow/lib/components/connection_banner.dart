import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../app_state.dart';

class ConnectionBanner extends StatelessWidget {
  const ConnectionBanner({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    if (appState.isOnline) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      color: const Color(0xFFD97706),
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(Icons.wifi_off, color: Colors.white, size: 16),
          SizedBox(width: 8),
          Text(
            'Offline Mode Active — Viewing saved prices and offline catalog',
            style: TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
