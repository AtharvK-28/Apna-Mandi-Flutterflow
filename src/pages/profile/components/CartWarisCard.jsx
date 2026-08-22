import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const valuation = {
  total: 420000,
  years: 12,
  components: [
    { label: 'Spot goodwill — Dadar, 12 yrs', value: 160000, icon: 'MapPin' },
    { label: 'Regular customers (340 repeat)', value: 90000, icon: 'Users' },
    { label: 'Recipe & brand (via Virasaat)', value: 80000, icon: 'Crown' },
    { label: 'Supplier terms & Vyapaar history', value: 50000, icon: 'Landmark' },
    { label: 'Cart & equipment', value: 40000, icon: 'Store' }
  ]
};

const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

const CartWarisCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [path, setPath] = useState(null); // 'sale' | 'royalty'
  const [listed, setListed] = useState(false);
  const maxValue = Math.max(...valuation.components.map(c => c.value));

  const handleList = () => {
    setListed(true);
    setShowModal(false);
  };

  return (
    <div className="bg-paper-light rounded-2xl border border-paper-dark/60 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-ink-medium uppercase tracking-widest">Cart Waris</h3>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-turmeric-light text-turmeric-dark border-turmeric/30">
          <Icon name="Landmark" size={13} />
          Succession ready
        </span>
      </div>

      {/* Valuation header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-turmeric flex flex-col items-center justify-center text-white flex-shrink-0">
          <span className="text-lg font-bold leading-none">{fmt(valuation.total)}</span>
          <span className="text-[9px] opacity-80 mt-0.5">est. value</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Your business, valued from its records</p>
          <p className="text-xs text-ink-medium mt-0.5">
            {valuation.years} years of daily work — now provable, inheritable, and sellable
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5 mb-4">
        {valuation.components.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-ink-light">
                <Icon name={row.icon} size={12} className="text-ink-medium" />
                {row.label}
              </span>
              <span className="text-xs font-bold text-ink">{fmt(row.value)}</span>
            </div>
            <div className="h-1.5 bg-paper-dark/50 rounded-full overflow-hidden">
              <div className="h-full bg-turmeric rounded-full" style={{ width: `${(row.value / maxValue) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {listed ? (
        <div className="flex items-center justify-center gap-2 py-2.5 text-leaf-dark text-sm font-semibold bg-leaf-light rounded-xl border border-leaf/30">
          <Icon name="CheckCircle" size={16} />
          Listed privately — buyers see finances only after your approval
        </div>
      ) : (
        <button
          onClick={() => { setPath(null); setShowModal(true); }}
          className="w-full px-4 py-2.5 text-sm font-semibold text-[#2C2016] bg-turmeric rounded-xl hover:brightness-95 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="ArrowRightLeft" size={16} />
          Explore Succession Listing
        </button>
      )}

      {/* Succession modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-paper-light rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-ink">Pass on the cart, keep the legacy</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-paper-dark/50 transition-colors">
                <Icon name="X" size={18} className="text-ink-medium" />
              </button>
            </div>
            <p className="text-xs text-ink-medium mb-4">Choose how you want to exit — both are escrowed and platform-verified.</p>

            {/* Two exit paths */}
            <div className="space-y-2 mb-5">
              <button
                onClick={() => setPath('sale')}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  path === 'sale' ? 'border-turmeric bg-turmeric-light' : 'border-paper-dark hover:bg-paper'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">Full sale</p>
                  <p className="text-sm font-bold text-turmeric-dark">{fmt(valuation.total)} once</p>
                </div>
                <p className="text-xs text-ink-medium mt-0.5">Everything transfers; you hand over in 4 weeks</p>
              </button>
              <button
                onClick={() => setPath('royalty')}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  path === 'royalty' ? 'border-turmeric bg-turmeric-light' : 'border-paper-dark hover:bg-paper'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">Retire on royalty</p>
                  <p className="text-sm font-bold text-turmeric-dark">₹1.5L + 4% of sales</p>
                </div>
                <p className="text-xs text-ink-medium mt-0.5">Smaller upfront, lifelong income — like a pension your cart pays you</p>
              </button>
            </div>

            {/* What happens */}
            <p className="text-xs font-semibold text-ink-medium uppercase tracking-wider mb-2">How the handover works</p>
            <div className="space-y-2 mb-5">
              {[
                { icon: 'FileText', text: 'Valuation is computed from your real records — orders, ratings, Vyapaar Score — not a broker\'s guess' },
                { icon: 'ShieldCheck', text: 'Buyer\'s money sits in escrow until the Town Vending Committee spot transfer completes' },
                { icon: 'GraduationCap', text: 'Your 4-week handover is booked as paid Karigar Connect training gigs — you train your successor' },
                { icon: 'Crown', text: 'Your recipe stays protected under its Virasaat provenance record, licensed — never lost' }
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 bg-turmeric-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={step.icon} size={13} className="text-turmeric-dark" />
                  </div>
                  <p className="text-xs text-ink-medium pt-1.5">{step.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleList}
              disabled={!path}
              className="w-full px-4 py-3 text-sm font-semibold text-[#2C2016] bg-turmeric rounded-xl hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="Send" size={15} />
              Create Succession Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartWarisCard;
