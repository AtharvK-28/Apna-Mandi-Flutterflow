import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const order = {
  company: 'TechSpire Solutions',
  location: 'BKC office campus, 4.5 km',
  event: 'Team offsite lunch',
  date: 'Friday 12 Jul, 1 PM',
  totalPlates: 200,
  totalValue: 24000,
  yourShare: {
    items: 'Pani Puri + Bhel counter',
    plates: 60,
    payout: 4800
  },
  otherStalls: [
    { name: 'Mumbai Dosa Corner', items: 'Mini dosa counter', plates: 50 },
    { name: 'Chaat Corner', items: 'Sev puri + dahi puri', plates: 40 },
    { name: 'Spice King', items: 'Pav bhaji counter', plates: 30 },
    { name: 'Dairy Delights', items: 'Kulfi + chaas', plates: 20 }
  ]
};

const CateringOrderCard = () => {
  const [status, setStatus] = useState('open'); // open | accepted | dismissed
  const [showSplit, setShowSplit] = useState(false);

  if (status === 'dismissed') return null;

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-semibold text-foreground">Order the Street</h2>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
          <Icon name="Building2" size={12} className="mr-1" />
          Corporate catering
        </span>
      </div>

      <div className="bg-card rounded-lg border-2 border-secondary/30 shadow-sm overflow-hidden">
        {/* Order header */}
        <div className="bg-gradient-to-r from-secondary/15 to-primary/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="Building2" size={20} color="white" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">{order.company}</p>
                <p className="text-xs text-muted-foreground">
                  {order.event} · {order.date} · {order.location}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-card-foreground">{order.totalPlates} plates</p>
              <p className="text-xs text-muted-foreground">₹{order.totalValue.toLocaleString('en-IN')} total</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Your share */}
          <div className="border border-primary/30 bg-primary/5 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <p className="text-sm font-semibold text-card-foreground">Your counter: {order.yourShare.items}</p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success">
                    <Icon name="ShieldCheck" size={10} className="mr-0.5" />
                    Grade A required — you qualify
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{order.yourShare.plates} plates · biggest single order this month</p>
              </div>
              <p className="text-xl font-bold text-primary flex-shrink-0 ml-3">₹{order.yourShare.payout.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Split across corridor */}
          <button
            onClick={() => setShowSplit(!showSplit)}
            className="flex items-center justify-between w-full text-left mb-3 p-2 bg-muted rounded-md hover:bg-muted/70 transition-colors duration-200"
          >
            <span className="flex items-center text-xs text-muted-foreground">
              <Icon name="Users" size={14} className="text-secondary mr-2" />
              Split across 5 Swachh-verified stalls in your corridor
            </span>
            <Icon name={showSplit ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground" />
          </button>

          {showSplit && (
            <div className="space-y-1.5 mb-3 px-1">
              {order.otherStalls.map((stall) => (
                <div key={stall.name} className="flex items-center justify-between text-xs">
                  <span className="text-card-foreground">{stall.name} <span className="text-muted-foreground">· {stall.items}</span></span>
                  <span className="text-muted-foreground">{stall.plates} plates</span>
                </div>
              ))}
            </div>
          )}

          {/* Compliance note */}
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="FileText" size={14} className="text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Apna Mandi issues one GST invoice to {order.company} and coordinates pickup at 11:30 AM — you just cook.
            </p>
          </div>

          {/* Actions */}
          {status === 'accepted' ? (
            <div className="flex items-center justify-center py-2.5 text-success text-sm font-medium bg-success/10 rounded-md">
              <Icon name="CheckCircle" size={16} className="mr-1.5" />
              You're in — prep list sent to your orders
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => setStatus('dismissed')}>
                Pass
              </Button>
              <Button className="flex-1" iconName="Check" onClick={() => setStatus('accepted')}>
                Accept — ₹{order.yourShare.payout.toLocaleString('en-IN')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CateringOrderCard;
