import React from 'react';
import Icon from '../../../components/AppIcon';
import QrPattern from '../../../components/QrPattern';

// Deterministic mock content hash so the "sealed record" looks real and stable
const mockHash = (seed) => {
  let h1 = 0x811c9dc5;
  const out = [];
  for (let i = 0; i < 64; i++) {
    const c = seed.charCodeAt(i % seed.length) + i;
    h1 = (h1 ^ c) * 0x01000193;
    out.push(((h1 >>> (i % 24)) & 0xf).toString(16));
  }
  return out.join('');
};

const ProvenanceModal = ({ legacy, onClose }) => {
  if (!legacy) return null;
  const hash = mockHash(legacy.name);
  const recordId = `VRS-${String(legacy.id).padStart(4, '0')}`;

  const protections = [
    { icon: 'BadgeCheck', label: 'Trademark filed', sub: `"${legacy.name}" — name & label registered` },
    { icon: 'FileText', label: 'Packaging copyright', sub: 'Label art & story text protected' },
    { icon: 'Lock', label: 'Trade-secret contract', sub: 'Recipe shared with licensees under platform NDA' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-terracotta-dark to-chili text-white px-6 py-5 rounded-t-2xl">
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Icon name="X" size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 border border-white/40 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Fingerprint" size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-80">Virasaat Provenance · Record {recordId}</p>
              <h2 className="text-lg font-bold leading-tight">{legacy.name}</h2>
              <p className="text-xs opacity-80">Created by {legacy.masterVendor} · {legacy.location}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Sealed record */}
          <div className="bg-muted rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Stamp" size={15} className="text-terracotta" />
              <p className="text-sm font-semibold text-card-foreground">Sealed 14 Feb 2026, 11:42 IST</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1.5">
              Recipe story, ingredient list, and preparation video were hashed and timestamped when {legacy.masterVendor} onboarded. The record can't be edited — only verified.
            </p>
            <p className="font-mono text-[10px] text-muted-foreground break-all bg-background rounded-md p-2 border border-border">
              sha256:{hash}
            </p>
          </div>

          {/* Video proof */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Witness: preparation on camera</p>
            <div className="relative h-36 rounded-xl overflow-hidden bg-muted">
              <img src={legacy.image} alt={legacy.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Icon name="Play" size={20} className="text-terracotta-dark ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">2:34</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {legacy.masterVendor} preparing the original at their own stall — the proof no copycat brand can fake.
            </p>
          </div>

          {/* Protection status */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Protection on record</p>
            <div className="space-y-2.5">
              {protections.map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <Icon name={item.icon} size={15} className="text-terracotta mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-card-foreground font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-pack QR */}
          <div className="flex items-center gap-4 bg-muted rounded-xl p-3">
            <div className="bg-white p-1.5 rounded-lg flex-shrink-0">
              <QrPattern seed={recordId} size={72} />
            </div>
            <p className="text-xs text-muted-foreground">
              Every jar carries this QR → <span className="font-medium text-card-foreground">apnamandi.in/v/{recordId}</span>.
              Customers see the dated record and who actually gets paid — verified authenticity is the whole price premium.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvenanceModal;
