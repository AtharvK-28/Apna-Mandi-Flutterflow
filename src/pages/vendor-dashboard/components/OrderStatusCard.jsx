import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import QRCodeScanner from '../../../components/ui/QRCodeScanner';

const OrderStatusCard = ({ order, onViewDetails }) => {
  const [showQRScanner, setShowQRScanner] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-warning bg-warning/10';
      case 'Confirmed':
        return 'text-primary bg-primary/10';
      case 'Out for Delivery':
        return 'text-accent bg-accent/10';
      case 'Completed':
        return 'text-success bg-success/10';
      case 'Cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return 'Clock';
      case 'Confirmed':
        return 'CheckCircle';
      case 'Out for Delivery':
        return 'Truck';
      case 'Completed':
        return 'CheckCircle2';
      case 'Cancelled':
        return 'XCircle';
      default:
        return 'Package';
    }
  };

  const handleQRScan = (scanResult) => {
    // Handle successful QR scan
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-card-foreground text-sm">
                Order {order.id}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                <Icon name={getStatusIcon(order.status)} size={12} className="inline mr-1" />
                {order.status}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{order.supplierName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {order.items.length} items • ₹{order.totalAmount}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{order.orderTime}</p>
            {order.estimatedDelivery && (
              <p className="text-xs text-primary font-medium mt-1">
                ETA: {order.estimatedDelivery}
              </p>
            )}
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {order.items.slice(0, 3).map((item, index) => (
              <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                {item.quantity}{item.unit} {item.name}
              </span>
            ))}
            {order.items.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{order.items.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(order)}
            className="flex-1"
          >
            <Icon name="Eye" size={14} className="mr-1" />
            View Details
          </Button>
          
          {order.status === 'Out for Delivery' && (
            <Button 
              size="sm" 
              onClick={() => setShowQRScanner(true)}
              className="flex-1"
            >
              <Icon name="QrCode" size={14} className="mr-1" />
              Scan QR
            </Button>
          )}
          
          {order.status === 'Completed' && order.qrCode && (
            <Button 
              variant="ghost" 
              size="sm"
              className="px-2"
            >
              <Icon name="QrCode" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      <QRCodeScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScan}
        orderData={order}
      />
    </>
  );
};

export default OrderStatusCard;