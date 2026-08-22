import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const campaign = {
  festival: 'Ganesh Chaturthi',
  date: '14 Sep',
  weeksAway: 10,
  item: 'Ukadiche Modak (box of 6)',
  presold: 84,
  capacity: 150,
  escrow: 25200,
  advancePct: 60,
  orders: { corporate: 3, family: 61 }
};

const TyoharBookCard = () => {
  const [advanceDrawn, setAdvanceDrawn] = useState(false);
  const advance = Math.round(campaign.escrow * (campaign.advancePct / 100));
  const progress = (campaign.presold / campaign.capacity) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-semibold text-foreground">Tyohar Book</h2>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-chili/10 text-chili">
          <Icon name="PartyPopper" size={12} className="mr-1" />
          Festival pre-orders
        </span>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        {/* Campaign header */}
        <div className="bg-gradient-to-r from-chili/15 to-secondary/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-chili rounded-full flex items-center justify-center">
              <Icon name="CalendarHeart" size={20} color="white" />
            </div>
            <div>
              <p className="font-semibold text-card-foreground">{campaign.festival} · {campaign.date}</p>
              <p className="text-xs text-muted-foreground">
                {campaign.weeksAway} weeks away · pre-orders open for {campaign.item}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-card-foreground">{campaign.presold} boxes</p>
            <p className="text-xs text-muted-foreground">already pre-sold</p>
          </div>
        </div>

        <div className="p-4">
          {/* Escrow + progress */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">
              ₹{campaign.escrow.toLocaleString('en-IN')} held in escrow · {campaign.orders.corporate} corporate + {campaign.orders.family} family orders
            </span>
            <span className="text-xs font-medium text-muted-foreground">{campaign.presold}/{campaign.capacity} capacity</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
            <div className="h-full bg-chili rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {/* Advance against pre-sold demand */}
          <div className="border border-primary/30 bg-primary/5 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-foreground">
                  Advance available: ₹{advance.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {campaign.advancePct}% of escrow, released now for ingredients — settled from delivery, not a loan
                </p>
              </div>
              {advanceDrawn ? (
                <span className="flex items-center text-success text-sm font-medium flex-shrink-0">
                  <Icon name="CheckCircle" size={16} className="mr-1" />
                  Credited to UPI
                </span>
              ) : (
                <Button size="sm" iconName="IndianRupee" onClick={() => setAdvanceDrawn(true)}>
                  Draw Advance
                </Button>
              )}
            </div>
          </div>

          {/* Trust note */}
          <div className="flex items-center space-x-2">
            <Icon name="ShieldCheck" size={14} className="text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Escrow protects both sides: customers know a Swachh Grade-A stall delivers, you know the money is already there.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TyoharBookCard;
