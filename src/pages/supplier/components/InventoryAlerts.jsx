import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryAlerts = ({ alerts, onRestockItem, onUpdateStock }) => {
  const [expandedAlerts, setExpandedRows] = useState(new Set());
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [localAlerts, setLocalAlerts] = useState(alerts);

  // Update local alerts when props change
  React.useEffect(() => {
    setLocalAlerts(alerts);
  }, [alerts]);

  const toggleAlert = (alertId) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedRows(newExpanded);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_stock': return 'AlertTriangle';
      case 'out_of_stock': return 'XCircle';
      case 'expiring': return 'Clock';
      case 'expired': return 'Trash2';
      default: return 'AlertCircle';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'low_stock': return 'text-warning';
      case 'out_of_stock': return 'text-error';
      case 'expiring': return 'text-warning';
      case 'expired': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'low_stock': return 'bg-warning/10';
      case 'out_of_stock': return 'bg-error/10';
      case 'expiring': return 'bg-warning/10';
      case 'expired': return 'bg-error/10';
      default: return 'bg-muted';
    }
  };

  const getAlertBorderColor = (type) => {
    switch (type) {
      case 'low_stock': return 'border-warning/20';
      case 'out_of_stock': return 'border-error/20';
      case 'expiring': return 'border-warning/20';
      case 'expired': return 'border-error/20';
      default: return 'border-border';
    }
  };

  // New handler functions
  const handleCreateDeal = (alert) => {
    alert(`Create Deal - would create a discount deal for ${alert.productName} to clear expiring stock`);
  };

  const handleRemoveItem = (alert) => {
    if (confirm(`Are you sure you want to remove ${alert.productName} from inventory?`)) {
      // Remove the alert from local state
      setLocalAlerts(prev => prev.filter(item => item.id !== alert.id));
      alert(`Remove Item - would remove ${alert.productName} from inventory`);
    }
  };

  const handleRestockClick = (alert) => {
    setSelectedAlert(alert);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

  const handleRestockSubmit = () => {
    if (restockQuantity && selectedAlert) {
      const quantity = parseFloat(restockQuantity);
      if (quantity > 0) {
        // Update the local alerts with new stock
        setLocalAlerts(prev => prev.map(item => 
          item.id === selectedAlert.id 
            ? { 
                ...item, 
                currentStock: item.currentStock + quantity,
                type: (item.currentStock + quantity) >= item.minimumStock ? 'normal' : item.type
              }
            : item
        ));
        
        alert(`Restocked ${selectedAlert.productName} with ${quantity} ${selectedAlert.unit}`);
        setShowRestockModal(false);
        setSelectedAlert(null);
        setRestockQuantity('');
      } else {
        alert('Please enter a valid quantity');
      }
    }
  };

  const handleUpdateStock = (alert) => {
    const newStock = prompt(`Enter new stock quantity for ${alert.productName}:`, alert.currentStock);
    if (newStock !== null) {
      const quantity = parseFloat(newStock);
      if (quantity >= 0) {
        // Update the local alerts
        setLocalAlerts(prev => prev.map(item => 
          item.id === alert.id 
            ? { 
                ...item, 
                currentStock: quantity,
                type: quantity >= item.minimumStock ? 'normal' : item.type
              }
            : item
        ));
        alert(`Stock updated to ${quantity} ${alert.unit}`);
      }
    }
  };

  // Filter out alerts that are no longer problematic
  const activeAlerts = localAlerts.filter(alert => {
    if (alert.type === 'low_stock' || alert.type === 'out_of_stock') {
      return alert.currentStock < alert.minimumStock;
    }
    return true; // Keep expiring and expired alerts
  });

  if (activeAlerts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <h3 className="text-lg font-semibold text-card-foreground">Inventory Alerts</h3>
        </div>
        <p className="text-muted-foreground">No inventory alerts at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h3 className="text-lg font-semibold text-card-foreground">Inventory Alerts</h3>
          <span className="bg-warning text-warning-foreground text-xs font-medium px-2 py-1 rounded-full">
            {activeAlerts.length}
          </span>
        </div>

        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${getAlertBgColor(alert.type)} ${getAlertBorderColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon name={getAlertIcon(alert.type)} size={20} className={`mt-0.5 ${getAlertColor(alert.type)}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-card-foreground mb-1">
                      {alert.productName}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    
                    {expandedAlerts.has(alert.id) && (
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Current Stock:</span>
                          <span className="font-medium">{alert.currentStock} {alert.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Minimum Required:</span>
                          <span className="font-medium">{alert.minimumStock} {alert.unit}</span>
                        </div>
                        {alert.expiryDate && (
                          <div className="flex justify-between">
                            <span>Expires:</span>
                            <span className="font-medium">{alert.expiryDate}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="p-1 hover:bg-background rounded transition-colors duration-200"
                  >
                    <Icon 
                      name={expandedAlerts.has(alert.id) ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                {(alert.type === 'low_stock' || alert.type === 'out_of_stock') && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateStock(alert)}
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Update Stock
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleRestockClick(alert)}
                    >
                      <Icon name="Plus" size={14} className="mr-1" />
                      Restock
                    </Button>
                  </>
                )}
                
                {alert.type === 'expiring' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateDeal(alert)}
                  >
                    <Icon name="Tag" size={14} className="mr-1" />
                    Create Deal
                  </Button>
                )}
                
                {alert.type === 'expired' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleRemoveItem(alert)}
                  >
                    <Icon name="Trash2" size={14} className="mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full">
            <Icon name="Settings" size={16} className="mr-2" />
            Manage Alert Settings
          </Button>
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Restock {selectedAlert.productName}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowRestockModal(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Current Stock</label>
                  <p className="text-sm text-muted-foreground">{selectedAlert.currentStock} {selectedAlert.unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Restock Quantity</label>
                  <input 
                    type="number" 
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="w-full p-2 border border-border rounded-md" 
                    placeholder={`Enter quantity in ${selectedAlert.unit}`}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Supplier</label>
                  <select className="w-full p-2 border border-border rounded-md">
                    <option>Fresh Produce Co.</option>
                    <option>Veggie World</option>
                    <option>Dairy Fresh</option>
                    <option>Spice Garden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Expected Delivery</label>
                  <select className="w-full p-2 border border-border rounded-md">
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>2-3 days</option>
                    <option>1 week</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowRestockModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRestockSubmit} className="flex-1">
                  Place Restock Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryAlerts;