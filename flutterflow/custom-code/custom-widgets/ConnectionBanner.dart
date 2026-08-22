// FlutterFlow → Custom Code → Custom Widgets
//
// Offline notice. Port of src/components/ui/ConnectionStatus.jsx.
//
//   Name:       ConnectionBanner
//   Parameters: width (double, nullable), height (double, nullable)
//   Pub deps:   connectivity_plus: ^6.1.0
//
// Place it in a Stack on PageShell, bottom-LEFT. Bottom-right is where the
// floating cart button lives, and two overlapping floating elements is how one
// of them becomes untappable.
//
// ── The copy is the point ────────────────────────────────────────────────────
//
// connectivity_plus reports whether a network INTERFACE is up, not whether
// anything is actually reachable. A phone connected to a captive-portal wifi,
// or on one bar of 2G with no throughput, reports "connected". So the negative
// is trustworthy and the positive is not:
//
//   • when it says disconnected, say "No connection" — that is reliable.
//   • when it says connected, say NOTHING. Never render "You're back online"
//     or a green "Connected" pill, because the app cannot know that.
//
// The target user opens this in a market on one bar of signal. A banner that
// claims the connection is fine while nothing loads is worse than no banner.
//
// ── What offline actually covers ─────────────────────────────────────────────
//
// Reading only. There is no backend queue and no write replay anywhere in this
// app. Do not extend this copy to promise that an order placed offline will
// send later — it will not.

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class ConnectionBanner extends StatefulWidget {
  const ConnectionBanner({super.key, this.width, this.height});

  final double? width;
  final double? height;

  @override
  State<ConnectionBanner> createState() => _ConnectionBannerState();
}

class _ConnectionBannerState extends State<ConnectionBanner> {
  StreamSubscription<List<ConnectivityResult>>? _sub;
  bool _offline = false;

  @override
  void initState() {
    super.initState();
    _check();
    _sub = Connectivity().onConnectivityChanged.listen((results) {
      final offline = results.every((r) => r == ConnectivityResult.none);
      if (mounted && offline != _offline) {
        setState(() => _offline = offline);
        FFAppState().update(() => FFAppState().isOffline = offline);
      }
    });
  }

  Future<void> _check() async {
    final results = await Connectivity().checkConnectivity();
    final offline = results.every((r) => r == ConnectivityResult.none);
    if (mounted) {
      setState(() => _offline = offline);
      FFAppState().update(() => FFAppState().isOffline = offline);
    }
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Occupies no space at all when online — not an empty SizedBox with a
    // height, which pushes content around every time connectivity flickers.
    if (!_offline) return const SizedBox.shrink();

    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: widget.width,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: theme.secondaryBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.warning.withOpacity(0.4)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.wifi_off_rounded, size: 18, color: theme.warning),
          const SizedBox(width: 10),
          Flexible(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'No connection',
                  style: theme.titleMedium.copyWith(fontSize: 14),
                ),
                Text(
                  'You can still browse what has loaded.',
                  style: theme.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
