import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// Pre-drafted listings the engine builds from today's procurement + the
// Mausam Engine footfall forecast — vendor publishes with one tap
const predictedSurplus = [
  {
    id: 'auto-1',
    item: 'Red Onions',
    quantity: '6 kg',
    originalPrice: 180,
    discountedPrice: 90,
    condition: 'Fresh, bought this morning',
    description: 'Auto-listed: rain forecast cut evening demand. Fresh morning stock, priced to move before close.',
    reason: 'You bought 20 kg this morning — rain forecast predicts ~30% fewer customers tonight',
    image: 'https://images.pexels.com/photos/144248/onions-food-vegetables-healthy-144248.jpeg'
  },
  {
    id: 'auto-2',
    item: 'Dosa Batter',
    quantity: '4 Litres',
    originalPrice: 200,
    discountedPrice: 80,
    condition: 'Fresh, good for 10 more hours',
    description: 'Auto-listed: prep exceeds predicted plates. Perfect for a vendor short on batter tonight.',
    reason: 'Prep is ~35 servings ahead of tonight’s predicted demand',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400'
  }
];

const AutoExchangeBanner = ({ onPublish }) => {
  const [dismissed, setDismissed] = useState(false);
  const [publishedIds, setPublishedIds] = useState([]);

  if (dismissed) return null;

  const handlePublish = (suggestion) => {
    setPublishedIds(prev => [...prev, suggestion.id]);
    if (onPublish) {
      onPublish({
        item: suggestion.item,
        quantity: suggestion.quantity,
        originalPrice: suggestion.originalPrice,
        discountedPrice: suggestion.discountedPrice,
        condition: suggestion.condition,
        location: 'Dadar Station West',
        description: suggestion.description,
        image: suggestion.image
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border-2 border-primary/30 overflow-hidden mb-6">
      {/* Banner header */}
      <div className="bg-gradient-to-r from-primary/15 to-secondary/15 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-card-foreground">Auto-Exchange</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  <Icon name="CloudRain" size={12} className="mr-1" />
                  Surplus predicted tonight
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Slow evening ahead (rain, −30% footfall). Listings drafted before your stock spoils — publish in one tap.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-card-foreground transition-colors p-1"
            aria-label="Dismiss"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>

      {/* Pre-drafted listings */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {predictedSurplus.map((suggestion) => {
          const isPublished = publishedIds.includes(suggestion.id);
          return (
            <div key={suggestion.id} className="border border-border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-card-foreground">
                    {suggestion.item} <span className="text-muted-foreground font-normal">· {suggestion.quantity}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{suggestion.reason}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-lg font-bold text-primary">₹{suggestion.discountedPrice}</p>
                  <p className="text-xs text-muted-foreground line-through">₹{suggestion.originalPrice}</p>
                </div>
              </div>
              {isPublished ? (
                <div className="flex items-center justify-center py-2 text-success text-sm font-medium">
                  <Icon name="CheckCircle" size={16} className="mr-1.5" />
                  Listed on Vendor Exchange
                </div>
              ) : (
                <Button
                  size="sm"
                  fullWidth
                  iconName="Send"
                  onClick={() => handlePublish(suggestion)}
                >
                  Publish Listing
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Flash sale note */}
      <div className="px-4 pb-3 flex items-center space-x-2">
        <Icon name="Clock" size={14} className="text-secondary flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          Still unsold at 5 PM? It moves automatically to the customer <span className="font-medium text-card-foreground">5 o'Clock Flash Sale</span> feed — rescued stock instead of a 100% loss.
        </p>
      </div>
    </div>
  );
};

export default AutoExchangeBanner;
