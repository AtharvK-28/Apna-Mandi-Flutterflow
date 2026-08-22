import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import ChatModal from '../../../components/ui/ChatModal';

const OrderDetailsModal = ({ order, isOpen, onClose, onContactSupplier, onReorder, onRateOrder }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showChat, setShowChat] = useState(false);

  if (!isOpen || !order) return null;

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
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

  const orderTimeline = [
    {
      status: 'Order Placed',
      time: order.orderDate,
      completed: true,
      icon: 'ShoppingCart'
    },
    {
      status: 'Order Confirmed',
      time: order.confirmedDate,
      completed: ['confirmed', 'out for delivery', 'completed'].includes(order.status.toLowerCase()),
      icon: 'CheckCircle'
    },
    {
      status: 'Out for Delivery',
      time: order.dispatchedDate,
      completed: ['out for delivery', 'completed'].includes(order.status.toLowerCase()),
      icon: 'Truck'
    },
    {
      status: 'Delivered',
      time: order.deliveredDate,
      completed: order.status.toLowerCase() === 'completed',
      icon: 'Package'
    }
  ];

  const tabs = [
    { id: 'details', label: 'Order Details', icon: 'FileText' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' },
    { id: 'supplier', label: 'Supplier Info', icon: 'Store' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-card-foreground">{order.orderId}</h2>
            <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          <Icon name="Package2" size={20} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity}{item.unit} × ₹{item.pricePerUnit}/{item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-card-foreground">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-3">Order Summary</h4>
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
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-success">-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                    <span className="text-card-foreground">Total</span>
                    <span className="text-card-foreground">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h4 className="font-medium text-card-foreground mb-3">Delivery Information</h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-start space-x-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Estimated Delivery</p>
                        <p className="text-sm text-muted-foreground">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Order Timeline</h3>
              <div className="space-y-4">
                {orderTimeline.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name={step.icon} size={16} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.completed ? 'text-card-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.status}
                      </p>
                      {step.time && (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(step.time)} at {formatTime(step.time)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'supplier' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-card-foreground">Supplier Information</h3>
              
              {/* Supplier Details */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Store" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-card-foreground">{order.supplierName}</h4>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                      <Icon name="MapPin" size={14} />
                      <span>{order.supplierLocation}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                      <Icon name="Phone" size={14} />
                      <span>{order.supplierPhone}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < Math.floor(order.supplierRating) ? 'text-warning fill-current' : 'text-muted-foreground'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {order.supplierRating} ({order.supplierReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => onContactSupplier(order)}
                  className="w-full justify-start"
                >
                  <Icon name="Phone" size={16} className="mr-2" />
                  Call Supplier
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowChat(true)}
                  className="w-full justify-start"
                >
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  Chat with Supplier
                </Button>
              </div>

              {/* Business Information */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h5 className="font-medium text-card-foreground mb-2">Business Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FSSAI License</span>
                    <span className="text-card-foreground">{order.supplierFSSAI}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Hours</span>
                    <span className="text-card-foreground">6:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Range</span>
                    <span className="text-card-foreground">5 km radius</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onReorder(order)}
            className="flex-1"
          >
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reorder
          </Button>
          {(order.status === 'completed' || order.status === 'out for delivery') && !order.rated && (
            <Button
              variant="outline"
              onClick={() => onRateOrder(order)}
              className="flex-1"
            >
              <Icon name="Star" size={16} className="mr-2" />
              Rate Supplier
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onContactSupplier(order)}
            className="flex-1"
          >
            <Icon name="Phone" size={16} className="mr-2" />
            Contact
          </Button>
          <Button
            variant="default"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
      <ChatModal 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
        supplier={{
          supplierName: order.supplierName,
          supplierLocation: order.supplierLocation,
          supplierPhone: order.supplierPhone,
          supplierRating: order.supplierRating,
          supplierReviews: order.supplierReviews,
          supplierFSSAI: order.supplierFSSAI,
          orderId: order.orderId
        }}
        orderId={order.orderId?.replace('#', '')}
      />
    </div>
  );
};

export default OrderDetailsModal;