import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

abstract class FlutterFlowTheme {
  static FlutterFlowTheme of(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? DarkModeTheme()
        : LightModeTheme();
  }

  late Color primary;
  late Color primaryLight;
  late Color secondary;
  late Color secondaryLight;
  late Color tertiary;
  late Color alternate;
  late Color primaryBackground;
  late Color secondaryBackground;
  late Color primaryText;
  late Color secondaryText;
  late Color success;
  late Color warning;
  late Color error;
  late Color info;

  TextStyle get title1 => GoogleFonts.inter(
        color: primaryText,
        fontWeight: FontWeight.bold,
        fontSize: 24.0,
      );
  TextStyle get title2 => GoogleFonts.inter(
        color: primaryText,
        fontWeight: FontWeight.w600,
        fontSize: 20.0,
      );
  TextStyle get title3 => GoogleFonts.inter(
        color: primaryText,
        fontWeight: FontWeight.w600,
        fontSize: 16.0,
      );
  TextStyle get subtitle1 => GoogleFonts.inter(
        color: primaryText,
        fontWeight: FontWeight.w500,
        fontSize: 14.0,
      );
  TextStyle get subtitle2 => GoogleFonts.inter(
        color: secondaryText,
        fontWeight: FontWeight.normal,
        fontSize: 14.0,
      );
  TextStyle get body1 => GoogleFonts.inter(
        color: primaryText,
        fontWeight: FontWeight.normal,
        fontSize: 14.0,
      );
  TextStyle get body2 => GoogleFonts.inter(
        color: secondaryText,
        fontWeight: FontWeight.normal,
        fontSize: 12.0,
      );
}

class LightModeTheme extends FlutterFlowTheme {
  @override
  Color primary = const Color(0xFF16A34A);
  @override
  Color primaryLight = const Color(0xFFDCFCE7);
  @override
  Color secondary = const Color(0xFFEA580C);
  @override
  Color secondaryLight = const Color(0xFFFFEDD5);
  @override
  Color tertiary = const Color(0xFF0284C7);
  @override
  Color alternate = const Color(0xFFE2E8F0);
  @override
  Color primaryBackground = const Color(0xFFF8FAFC);
  @override
  Color secondaryBackground = const Color(0xFFFFFFFF);
  @override
  Color primaryText = const Color(0xFF0F172A);
  @override
  Color secondaryText = const Color(0xFF64748B);
  @override
  Color success = const Color(0xFF16A34A);
  @override
  Color warning = const Color(0xFFD97706);
  @override
  Color error = const Color(0xFFDC2626);
  @override
  Color info = const Color(0xFF0284C7);
}

class DarkModeTheme extends FlutterFlowTheme {
  @override
  Color primary = const Color(0xFF22C55E);
  @override
  Color primaryLight = const Color(0xFF14532D);
  @override
  Color secondary = const Color(0xFFF97316);
  @override
  Color secondaryLight = const Color(0xFF7C2D12);
  @override
  Color tertiary = const Color(0xFF38BDF8);
  @override
  Color alternate = const Color(0xFF334155);
  @override
  Color primaryBackground = const Color(0xFF0F172A);
  @override
  Color secondaryBackground = const Color(0xFF1E293B);
  @override
  Color primaryText = const Color(0xFFF8FAFC);
  @override
  Color secondaryText = const Color(0xFF94A3B8);
  @override
  Color success = const Color(0xFF22C55E);
  @override
  Color warning = const Color(0xFFF59E0B);
  @override
  Color error = const Color(0xFFEF4444);
  @override
  Color info = const Color(0xFF38BDF8);
}
