import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import AnimatedCartButton from '../../../components/ui/AnimatedCartButton';

const DealCard = ({ deal, onAddToCart, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [editQuantityValue, setEditQuantityValue] = useState('');

  const handleQuantityIncrease = () => {
    const newQuantity = quantity + 0.5;
    if (newQuantity <= deal.availableQuantity) {
      setQuantity(newQuantity);
      onQuantityChange(deal.id, newQuantity);
    }
  };

  const handleQuantityDecrease = () => {
    const newQuantity = Math.max(0, quantity - 0.5);
    setQuantity(newQuantity);
    onQuantityChange(deal.id, newQuantity);
  };

  const handleDirectQuantityInput = (e) => {
    const inputValue = parseFloat(e.target.value) || 0;
    const newQuantity = Math.max(0, Math.min(inputValue, deal.availableQuantity));
    setQuantity(newQuantity);
    onQuantityChange(deal.id, newQuantity);
  };

  const handleQuantityClick = () => {
    setIsEditingQuantity(true);
    setEditQuantityValue(quantity.toString());
  };

  const handleQuantityEdit = (e) => {
    setEditQuantityValue(e.target.value);
  };

  const handleQuantityEditComplete = () => {
    const inputValue = parseFloat(editQuantityValue) || 0;
    const newQuantity = Math.max(0, Math.min(inputValue, deal.availableQuantity));
    setQuantity(newQuantity);
    onQuantityChange(deal.id, newQuantity);
    setIsEditingQuantity(false);
  };

  const handleQuantityEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleQuantityEditComplete();
    } else if (e.key === 'Escape') {
      setIsEditingQuantity(false);
      setEditQuantityValue(quantity.toString());
    }
  };

  const handleAddToCart = async () => {
    if (quantity > 0) {
      setIsAdding(true);
      await onAddToCart(deal, quantity);
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const getTimeRemaining = () => {
    if (!deal.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(deal.expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getDealTypeBadge = () => {
    switch (deal.dealType) {
      case 'fresh-morning':
        return {
          label: 'Fresh Morning',
          color: 'badge-success',
          icon: 'Sunrise',
          gradient: 'from-leaf to-leaf-dark'
        };
      case 'end-of-day':
        return {
          label: 'End of Day',
          color: 'badge-warning',
          icon: 'Clock',
          gradient: 'from-turmeric to-terracotta'
        };
      case 'bulk-discount':
        return {
          label: 'Bulk Discount',
          color: 'badge-primary',
          icon: 'Package',
          gradient: 'from-terracotta to-chili'
        };
      default:
        return null;
    }
  };

  const timeRemaining = getTimeRemaining();
  const isExpired = timeRemaining === 'Expired';
  const dealTypeBadge = getDealTypeBadge();
  const isBulkDeal = deal.dealType === 'bulk-discount';
  const minQuantity = deal.minQuantity || 0;

  return (
    <div className="group bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:scale-[1.02]">
      {/* Product Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="skeleton w-full h-full" />
          </div>
        )}
        {/* `relative` keeps the image painted above the skeleton, so a cached
            image (whose onLoad never fires) still shows instead of the skeleton */}
        <Image
          src={deal.image}
          alt={deal.name}
          className="relative w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Deal Type Badge */}
        {dealTypeBadge && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${dealTypeBadge.gradient} shadow-sm`}>
            <Icon name={dealTypeBadge.icon} size={12} className="mr-1" />
            {dealTypeBadge.label}
          </div>
        )}
        
        {/* Time Remaining Badge */}
        {timeRemaining && !isExpired && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
            <Icon name="Clock" size={12} className="mr-1" />
            {timeRemaining}
          </div>
        )}
        
        {/* Expired Badge */}
        {isExpired && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-chili text-white">
            Expired
          </div>
        )}
        
        {/* Supplier Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Store" size={12} />
              </div>
              <span className="text-sm font-medium truncate">{deal.supplierName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-turmeric fill-current" />
              <span className="text-sm">{deal.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Product Name and Rating */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 flex-1 group-hover:text-primary transition-colors">
            {deal.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Icon name="Star" size={12} className="text-warning fill-current" />
            <span className="text-xs text-muted-foreground">{deal.rating}</span>
          </div>
        </div>

        {/* Description */}
        {deal.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {deal.description}
          </p>
        )}

        {/* Distance and Available */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={12} />
            <span>{deal.distance}km away</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Package" size={12} />
            <span>{deal.availableQuantity} {deal.unit} available</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                ₹{deal.price}
              </span>
              {deal.originalPrice && deal.originalPrice > deal.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{deal.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              per {deal.unit}
            </span>
          </div>
          
          {/* Savings Badge */}
          {deal.originalPrice && deal.originalPrice > deal.price && (
            <div className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
              Save ₹{deal.originalPrice - deal.price}
            </div>
          )}
        </div>

        {/* Bulk Discount Info */}
        {isBulkDeal && minQuantity > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={14} className="text-primary" />
              <div>
                <p className="text-xs font-medium text-primary">Bulk Discount</p>
                <p className="text-xs text-muted-foreground">
                  Min {minQuantity} {deal.unit} for discount
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quantity Selector & Add to Cart */}
        {!isExpired && (
          <div className="flex items-center space-x-2">
            {quantity === 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const initialQuantity = isBulkDeal ? minQuantity : 0.5;
                  setQuantity(initialQuantity);
                  onQuantityChange(deal.id, initialQuantity);
                }}
                className="flex-1 group-hover:border-primary group-hover:text-primary transition-all duration-200"
              >
                <Icon name="Plus" size={16} className="mr-1" />
                {isBulkDeal ? `Add ${minQuantity} ${deal.unit}` : 'Add to Cart'}
              </Button>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="flex items-center space-x-1 bg-muted rounded-lg border border-border">
                    <button
                      onClick={handleQuantityDecrease}
                      className="p-2 hover:bg-background rounded-l-lg transition-colors duration-200 disabled:opacity-50"
                      disabled={isBulkDeal && quantity <= minQuantity}
                    >
                      <Icon name="Minus" size={14} />
                    </button>
                    <span className="px-3 py-2 text-sm font-medium min-w-[50px] text-center">
                      {isEditingQuantity ? (
                        <input
                          type="number"
                          min="0"
                          max={deal.availableQuantity}
                          step="0.5"
                          value={editQuantityValue}
                          onChange={handleQuantityEdit}
                          onBlur={handleQuantityEditComplete}
                          onKeyDown={handleQuantityEditKeyDown}
                          className="w-full px-2 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Qty"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={handleQuantityClick}
                          className="w-full text-center hover:bg-muted/50 rounded transition-colors duration-200 cursor-pointer"
                        >
                          {quantity}
                        </button>
                      )}
                    </span>
                    <button
                      onClick={handleQuantityIncrease}
                      className="p-2 hover:bg-background rounded-r-lg transition-colors duration-200 disabled:opacity-50"
                      disabled={quantity >= deal.availableQuantity}
                    >
                      <Icon name="Plus" size={14} />
                    </button>
                  </div>
                  
                  <div className="ml-[55px] flex-1 min-w-0">
                    <AnimatedCartButton
                      onComplete={handleAddToCart}
                      defaultText="Add to Cart"
                      successText="Added!"
                      disabled={isAdding || quantity <= 0 || isExpired}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isExpired && (
          <div className="text-center py-3 bg-muted/50 rounded-lg">
            <Icon name="Clock" size={16} className="text-muted-foreground mx-auto mb-1" />
            <span className="text-sm text-muted-foreground font-medium">Deal Expired</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCard;