import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AnimatedOrderButton from '../../../components/ui/AnimatedOrderButton';

const OrderSummary = ({ 
  cartItems, 
  supplierGroups, 
  onPlaceOrder, 
  isPlacingOrder = false,
  groupBuyingSavings = 0,
  groupBuyingDeliverySplit = 0,
  joinedGroups = []
}) => {
  const totalItems = cartItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);
  
  const totalDeliveryFees = supplierGroups.reduce((sum, group) => {
    const groupSubtotal = group.items.reduce((itemSum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return itemSum + (price * quantity);
    }, 0);
    const isMinimumMet = groupSubtotal >= (group.supplier.minimumOrder || 0);
    return sum + (isMinimumMet ? (group.supplier.deliveryFee || 0) : (group.supplier.deliveryFee || 0));
  }, 0);

  const totalSavings = cartItems.reduce((sum, item) => {
    const originalPrice = parseFloat(item.originalPrice) || 0;
    const price = parseFloat(item.price) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    if (originalPrice > price) {
      return sum + ((originalPrice - price) * quantity);
    }
    return sum;
  }, 0);

  // Calculate final totals with group buying benefits
  const finalDeliveryFees = Math.max(0, totalDeliveryFees - groupBuyingDeliverySplit);
  const finalSavings = totalSavings + groupBuyingSavings;
  const grandTotal = subtotal + finalDeliveryFees - finalSavings;
  
  const estimatedDeliveryTime = Math.max(...supplierGroups.map(group => 
    parseInt(group.supplier.estimatedDelivery.split('-')[1]) || 30
  ));

  const canPlaceOrder = supplierGroups.every(group => {
    const groupSubtotal = group.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
    return groupSubtotal >= (group.supplier.minimumOrder || 0);
  });

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-elevation-2">
      <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
        <Icon name="Receipt" size={20} className="text-primary" />
        <span>Order Summary</span>
      </h3>

      <div className="space-y-3 mb-4">
        {/* Items Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Items ({totalItems.toFixed(1)})</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Fees */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground">Delivery Fees</span>
            <Icon name="Info" size={12} className="text-muted-foreground" />
          </div>
          <span className="font-medium">
            {totalDeliveryFees === 0 ? 'Free' : `₹${totalDeliveryFees.toFixed(2)}`}
          </span>
        </div>

        {/* Delivery Details */}
        {totalDeliveryFees > 0 && (
          <div className="bg-terracotta-light/60 border border-terracotta/25 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Truck" size={14} className="text-terracotta" />
              <span className="text-sm font-medium text-terracotta-dark">Delivery Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={10} className="text-terracotta" />
                <span className="text-terracotta-dark">Est. Time:</span>
                <span className="text-terracotta-dark font-medium">30-45 min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={10} className="text-terracotta" />
                <span className="text-terracotta-dark">Distance:</span>
                <span className="text-terracotta-dark font-medium">2.5 km</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={10} className="text-terracotta" />
                <span className="text-terracotta-dark">Insurance:</span>
                <span className="text-terracotta-dark font-medium">Included</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Package" size={10} className="text-terracotta" />
                <span className="text-terracotta-dark">Packaging:</span>
                <span className="text-terracotta-dark font-medium">Eco-friendly</span>
              </div>
            </div>
            
            <div className="text-xs text-terracotta bg-terracotta-light rounded-md p-2">
              <div className="flex items-center space-x-1 mb-1">
                <Icon name="CheckCircle" size={10} className="text-terracotta" />
                <span className="font-medium">Free delivery on orders above ₹500</span>
              </div>
              <span>Contactless delivery • Real-time tracking • Quality guarantee</span>
            </div>
          </div>
        )}

        {/* Group Buying Benefits */}
        {(groupBuyingSavings > 0 || groupBuyingDeliverySplit > 0) && (
          <div className="bg-gradient-to-r from-leaf-light/60 to-leaf-light/40 border border-leaf/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} className="text-leaf-dark" />
              <span className="text-sm font-medium text-leaf-dark">Group Buying Benefits</span>
            </div>
            
            {groupBuyingSavings > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-leaf-dark">Bulk Discount</span>
                <span className="font-medium text-leaf-dark">-₹{groupBuyingSavings.toFixed(2)}</span>
              </div>
            )}
            
            {groupBuyingDeliverySplit > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-leaf-dark">Delivery Split</span>
                <span className="font-medium text-leaf-dark">-₹{groupBuyingDeliverySplit.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-leaf-dark">Total Group Savings</span>
              <span className="text-leaf-dark">-₹{(groupBuyingSavings + groupBuyingDeliverySplit).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Regular Savings */}
        {totalSavings > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-success">Deal Savings</span>
            <span className="font-medium text-success">-₹{totalSavings.toFixed(2)}</span>
          </div>
        )}

        {/* Platform Fee */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Platform Fee</span>
          <span className="font-medium text-success">Free</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-border pt-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-card-foreground">Total Amount</span>
          <span className="text-xl font-bold text-primary">₹{grandTotal.toFixed(2)}</span>
        </div>
        
        {/* Show total savings */}
        {(finalSavings + groupBuyingDeliverySplit) > 0 && (
          <div className="text-sm text-leaf-dark mt-1">
            You save ₹{(finalSavings + groupBuyingDeliverySplit).toFixed(2)} total!
          </div>
        )}
      </div>

      {/* Joined Groups Info */}
      {joinedGroups.length > 0 && (
        <div className="bg-terracotta-light/60 border border-terracotta/25 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={16} className="text-terracotta" />
            <span className="text-sm font-medium text-terracotta-dark">Joined Groups</span>
          </div>
          <div className="space-y-1">
            {joinedGroups.map((group, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-terracotta-dark">{group.supplierName}</span>
                <span className="text-terracotta-dark">{group.discount}% off</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estimated Delivery */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Icon name="Clock" size={16} />
        <span>Estimated delivery in {estimatedDeliveryTime}-{estimatedDeliveryTime + 15} minutes</span>
      </div>

      {/* Supplier Count */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Icon name="Store" size={16} />
        <span>Ordering from {supplierGroups.length} supplier{supplierGroups.length > 1 ? 's' : ''}</span>
      </div>

      {/* Minimum Order Warning */}
      {!canPlaceOrder && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning font-medium">
              Some suppliers have minimum order requirements
            </span>
          </div>
        </div>
      )}

      {/* Place Order Button */}
      <AnimatedOrderButton
        onComplete={onPlaceOrder}
        defaultText={`Place Order • ₹${grandTotal.toFixed(2)}`}
        successText="Order Placed!"
        disabled={!canPlaceOrder || isPlacingOrder || totalItems === 0}
        className="w-full h-12 text-lg font-semibold"
      />

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        By placing this order, you agree to our{' '}
        <span className="text-primary cursor-pointer hover:underline">Terms & Conditions</span>
      </p>
    </div>
  );
};

export default OrderSummary;