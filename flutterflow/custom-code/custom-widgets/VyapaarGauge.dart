// FlutterFlow → Custom Code → Custom Widgets
//
// The Vyapaar Readiness Score arc.
//
//   Name:       VyapaarGauge
//   Parameters: width (double), height (double),
//               score (int),
//               arcColor (Color), trackColor (Color), textColor (Color)
//
// Pass arcColor from vyapaarBandTone(score) mapped to a theme colour — never a
// hardcoded hex, or the gauge stops matching the card in dark mode.
//
// ═══ THE LABEL UNDER THE NUMBER IS NOT DECORATION ════════════════════════════
//
// Apna Mandi is not an RBI-licensed credit information company. This number must
// never be presented as a credit score, and the "Not a credit score" line below
// the arc is the thing that keeps that true at a glance — someone seeing a
// 300–900 arc will assume CIBIL otherwise, because that is the range CIBIL uses.
// Do not remove it, shrink it into invisibility, or move it off the gauge.
//
// The card around this widget carries the fuller disclaimer (it does not affect
// CIBIL / Experian / Equifax / CRIF). See 05-PAGES-VENDOR.md.

import 'dart:math' as math;
import 'package:flutter/material.dart';

class VyapaarGauge extends StatelessWidget {
  const VyapaarGauge({
    super.key,
    this.width,
    this.height,
    required this.score,
    required this.arcColor,
    required this.trackColor,
    required this.textColor,
  });

  final double? width;
  final double? height;
  final int score;
  final Color arcColor;
  final Color trackColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    // Measured from the 300 floor, not from zero. An arc starting at zero shows
    // every brand-new vendor as one third full for reasons they had no part in,
    // which reads as a score they earned and did not.
    const base = 300.0;
    const max = 900.0;
    final fraction = ((score - base) / (max - base)).clamp(0.0, 1.0);

    return SizedBox(
      width: width ?? 200,
      height: height ?? 140,
      child: CustomPaint(
        painter: _GaugePainter(
          fraction: fraction,
          arcColor: arcColor,
          trackColor: trackColor,
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 18),
              Text(
                '$score',
                style: TextStyle(
                  fontFamily: 'Baloo 2',
                  fontSize: 40,
                  fontWeight: FontWeight.w700,
                  color: textColor,
                  height: 1.0,
                ),
              ),
              Text(
                'of 900',
                style: TextStyle(
                  fontFamily: 'Mukta',
                  fontSize: 12,
                  color: textColor.withOpacity(0.65),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Not a credit score',
                style: TextStyle(
                  fontFamily: 'Mukta',
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: textColor.withOpacity(0.55),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GaugePainter extends CustomPainter {
  _GaugePainter({
    required this.fraction,
    required this.arcColor,
    required this.trackColor,
  });

  final double fraction;
  final Color arcColor;
  final Color trackColor;

  // A 220° sweep opening downward, so the gap sits under the number rather than
  // cutting through it.
  static const _startAngle = math.pi * 0.9;
  static const _sweep = math.pi * 1.2;

  @override
  void paint(Canvas canvas, Size size) {
    final stroke = 14.0;
    final rect = Rect.fromLTWH(
      stroke / 2,
      stroke / 2,
      size.width - stroke,
      (size.height * 1.5) - stroke,
    );

    final track = Paint()
      ..color = trackColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;

    final value = Paint()
      ..color = arcColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(rect, _startAngle, _sweep, false, track);
    if (fraction > 0) {
      canvas.drawArc(rect, _startAngle, _sweep * fraction, false, value);
    }
  }

  @override
  bool shouldRepaint(_GaugePainter old) =>
      old.fraction != fraction ||
      old.arcColor != arcColor ||
      old.trackColor != trackColor;
}
