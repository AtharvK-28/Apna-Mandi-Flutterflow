import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const OrderCard = ({ order, onViewDetails, onReorder, onRateOrder, onContactSupplier, onScanQR, onMessageSupplier }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'confirmed':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'out for delivery':
        return 'text-terracotta bg-terracotta-light border-terracotta/25';
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'cancelled':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 25;
      case 'confirmed':
        return 50;
      case 'out for delivery':
        return 75;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-fit">
      {/* Order Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Package" size={18} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-card-foreground text-sm truncate">{order.orderId}</p>
              <p className="text-xs text-muted-foreground truncate">{order.supplierName}</p>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                <Icon name="MapPin" size={10} />
                <span className="truncate">{order.supplierLocation}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="font-bold text-lg text-card-foreground">₹{order.totalAmount}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.orderDate)}</p>
            <p className="text-xs text-muted-foreground">{formatTime(order.orderDate)}</p>
          </div>
        </div>

        {/* Status Badge and Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            {order.estimatedDelivery && order.status !== 'completed' && order.status !== 'cancelled' && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Est. Delivery</p>
                <p className="text-xs font-medium text-card-foreground">{order.estimatedDelivery}</p>
              </div>
            )}
          </div>
          
          {/* Progress Bar with Labels */}
          <div className="space-y-1">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(order.status)}%` }}
              />
            </div>
            {/* Progress Labels */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="text-[10px]">Placed</span>
              <span className="text-[10px]">Confirmed</span>
              <span className="text-[10px]">Delivery</span>
              <span className="text-[10px]">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="ShoppingBag" size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-card-foreground">
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center space-x-1 bg-muted/50 rounded-md px-2 py-1">
                <span className="text-xs text-muted-foreground">{item.quantity}{item.unit}</span>
                <span className="text-xs font-medium text-card-foreground truncate max-w-[60px]">{item.name}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="bg-muted/50 rounded-md px-2 py-1">
                <span className="text-xs text-muted-foreground">+{order.items.length - 2} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        {order.deliveryFee > 0 && (
          <div className="mb-3 p-2 bg-terracotta-light/60 border border-terracotta/25 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Truck" size={12} className="text-terracotta" />
                <span className="text-xs text-terracotta-dark">Delivery Fee: ₹{order.deliveryFee}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={10} className="text-terracotta" />
                <span className="text-xs text-terracotta">{order.estimatedDelivery || '30-45 min'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-1 text-xs text-terracotta">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={10} />
                <span>Insured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Package" size={10} />
                <span>Eco-packaging</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={10} />
                <span>2.5 km</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-1">
          {order.status === 'out for delivery' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onScanQR(order)}
              className="flex-1 min-w-[80px] text-xs"
            >
              <Icon name="QrCode" size={14} className="mr-1" />
              Scan QR
            </Button>
          )}
          
          {(order.status === 'completed' || order.status === 'out for delivery') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRateOrder(order)}
              className="flex-1 min-w-[60px] text-xs"
            >
              <Icon name="Star" size={14} className="mr-1" />
              {order.rated ? 'Rated' : 'Rate'}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 min-w-[70px] text-xs"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="mr-1" />
            Details
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onContactSupplier(order)}
            className="min-w-[40px] p-2"
          >
            <Icon name="Phone" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMessageSupplier(order)}
            className="min-w-[40px] p-2"
          >
            <Icon name="MessageCircle" size={14} />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="space-y-4">
            {/* Detailed Items List */}
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                        <Icon name="Package2" size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity}{item.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-card-foreground">₹{item.price}</p>
                      <p className="text-xs text-muted-foreground">₹{item.pricePerUnit}/{item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground">₹{order.subtotal}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-card-foreground">₹{order.deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-card-foreground">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            {order.deliveryFee > 0 && (
              <div className="bg-terracotta-light/60 border border-terracotta/25 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Truck" size={16} className="text-terracotta" />
                  <span className="text-sm font-medium text-terracotta-dark">Delivery Information</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={12} className="text-terracotta" />
                    <div>
                      <span className="text-terracotta">Est. Delivery</span>
                      <p className="text-terracotta-dark font-medium">{order.estimatedDelivery || '30-45 min'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={12} className="text-terracotta" />
                    <div>
                      <span className="text-terracotta">Distance</span>
                      <p className="text-terracotta-dark font-medium">2.5 km</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={12} className="text-terracotta" />
                    <div>
                      <span className="text-terracotta">Insurance</span>
                      <p className="text-terracotta-dark font-medium">Included</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Package" size={12} className="text-terracotta" />
                    <div>
                      <span className="text-terracotta">Packaging</span>
                      <p className="text-terracotta-dark font-medium">Eco-friendly</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-terracotta-light rounded-md">
                  <div className="flex items-center space-x-1 mb-1">
                    <Icon name="CheckCircle" size={10} className="text-terracotta" />
                    <span className="text-xs font-medium text-terracotta-dark">Delivery Features</span>
                  </div>
                  <div className="text-xs text-terracotta space-y-1">
                    <div>• Contactless delivery for safety</div>
                    <div>• Real-time tracking updates</div>
                    <div>• Quality guarantee on all items</div>
                    <div>• Free delivery on orders above ₹500</div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReorder(order)}
                className="flex-1"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Reorder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(order)}
                className="flex-1"
              >
                <Icon name="Eye" size={16} className="mr-2" />
                Full Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onContactSupplier(order)}
                className="flex-1"
              >
                <Icon name="Phone" size={16} className="mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessageSupplier(order)}
                className="flex-1"
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;