import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const cover = {
  rainRisk: '60% chance tomorrow, 4–8 PM',
  pincode: '400028',
  premium: 9,
  payout: 1500,
  threshold: '10 mm',
  basis: 'sized from your ₹1,850 average daily stock spend',
  lastPayout: { amount: 1200, date: '28 Jun', rainfall: '34 mm' },
  coveredDays: 14
};

const steps = [
  { icon: 'CloudRain', text: `Rainfall in your pincode (${cover.pincode}) is measured by public weather stations — no claims form, no inspector visiting your cart` },
  { icon: 'Zap', text: `The moment rainfall crosses ${cover.threshold}, the payout triggers automatically` },
  { icon: 'IndianRupee', text: `₹${cover.payout.toLocaleString('en-IN')} lands in your UPI account the same evening — covering the stock a washed-out day would have spoiled` }
];

const BarsaatCoverCard = () => {
  const [isCovered, setIsCovered] = useState(false);
  const [showHow, setShowHow] = useState(false);

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Identity + context */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Umbrella" size={20} color="white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-semibold text-card-foreground">Barsaat Cover</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Parametric insurance
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Mausam Engine sees a {cover.rainRisk} rain window. Cover tomorrow's stock — {cover.basis}.
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <div className="text-center">
              <p className="text-lg font-bold text-card-foreground">₹{cover.premium}</p>
              <p className="text-[10px] text-muted-foreground">premium/day</p>
            </div>
            <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-bold text-success">₹{cover.payout.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-muted-foreground">auto payout &gt;{cover.threshold} rain</p>
            </div>
            {isCovered ? (
              <div className="flex items-center text-success text-sm font-medium">
                <Icon name="ShieldCheck" size={16} className="mr-1.5" />
                Covered for tomorrow
              </div>
            ) : (
              <Button size="sm" iconName="Umbrella" onClick={() => setIsCovered(true)}>
                Cover Tomorrow — ₹{cover.premium}
              </Button>
            )}
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <Icon name="CheckCircle" size={12} className="inline mr-1 text-success" />
            Last payout: ₹{cover.lastPayout.amount.toLocaleString('en-IN')} on {cover.lastPayout.date} ({cover.lastPayout.rainfall} rain) · {cover.coveredDays} days covered this monsoon
          </p>
          <button
            onClick={() => setShowHow(!showHow)}
            className="flex items-center text-xs text-primary font-medium hover:text-primary/80 transition-colors flex-shrink-0"
          >
            How it pays without a claims form
            <Icon name={showHow ? 'ChevronUp' : 'ChevronDown'} size={14} className="ml-0.5" />
          </button>
        </div>

        {showHow && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start space-x-2 bg-muted rounded-md p-2.5">
                <Icon name={step.icon} size={15} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarsaatCoverCard;
