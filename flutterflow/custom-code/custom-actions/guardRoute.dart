// FlutterFlow → Custom Code → Custom Actions
//
// The route guard. Port of src/components/RouteGuard.jsx.
//
//   Name:        guardRoute
//   Arguments:   currentRoute (String)
//                allowedRoles (List<String>)
//                allowGuest   (Boolean)
//   Return type: none
//   Async:       yes
//
// FlutterFlow has no route-guard concept, so this runs as the FIRST On Page
// Load action of every gated page. Add it to every page in the route table in
// 04-NAVIGATION.md — a page without it is reachable by anyone with the URL on
// the web build, which is not a theoretical concern for a deployed PWA.
//
// Three outcomes, in this order:
//
//   1. Signed out and not a guest → /login, remembering where they were going.
//   2. Guest on a route that does not allow guests → /login.
//   3. Signed in, wrong role → THEIR OWN HOME, not an error page.
//
// Rule 3 is the one that is easy to get wrong. A karigar who taps a stale link
// to /cart has not done anything wrong; they should land on their own find-work
// screen, not a "403" that reads like an accusation. The same rule is what makes
// the role-specific PWA shortcuts safe — a vendor tapping "Find work" is sent
// home, which is correct behaviour rather than a bug to design around.

import 'package:firebase_auth/firebase_auth.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

Future<void> guardRoute(
  BuildContext context,
  String currentRoute,
  List<String> allowedRoles,
  bool allowGuest,
) async {
  final isGuest = FFAppState().isGuest;
  final signedIn = FirebaseAuth.instance.currentUser != null;

  // 1. Signed out, not browsing as a guest.
  if (!signedIn && !isGuest) {
    // Remember the destination so login can return them to it. Without this,
    // every deep link from a WhatsApp share dumps the user on a generic home
    // and they have to find the thing again themselves.
    FFAppState().pendingRoute = currentRoute;
    if (context.mounted) context.goNamed('LoginPage');
    return;
  }

  // 2. Guest on a gated route.
  if (isGuest && !allowGuest) {
    FFAppState().pendingRoute = currentRoute;
    if (context.mounted) context.goNamed('LoginPage');
    return;
  }

  if (isGuest) return; // Allowed guest route — nothing more to check.

  // 3. Signed in with the wrong role.
  final role = FFAppState().userRole;

  // An empty role during the very first frame of a cold start is normal, not an
  // error — SplashRouter is still resolving the user document. Bouncing here
  // would fight with that and produce a redirect loop.
  if (role.isEmpty) return;

  if (!allowedRoles.contains(role)) {
    if (context.mounted) context.go(homeRouteForRole(role));
  }
}

/// resumePendingRoute — call after a successful login, before navigating to the
/// role home. Returns the stored destination and clears it, or '' if there was
/// none.
///
/// Clearing it matters: a stale pendingRoute left behind sends the user
/// somewhere unexpected on their *next* login, which is baffling to debug.
String resumePendingRoute() {
  final target = FFAppState().pendingRoute;
  FFAppState().pendingRoute = '';
  return target;
}
