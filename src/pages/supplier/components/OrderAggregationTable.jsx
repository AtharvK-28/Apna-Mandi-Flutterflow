import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import AnimatedOrderButton from '../../../components/ui/AnimatedOrderButton';
import { useToast } from '../../../contexts/ToastContext';

const OrderAggregationTable = ({ orders, onConfirmOrder, onViewRoute }) => {
  const toast = useToast();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [orderStatuses, setOrderStatuses] = useState({});

  const toggleRowExpansion = (orderId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-warning bg-warning/10';
      case 'Confirmed': return 'text-primary bg-primary/10';
      case 'Out for Delivery': return 'text-accent bg-accent/10';
      case 'Completed': return 'text-success bg-success/10';
      case 'Cancelled': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleBulkActions = () => {
    setShowBulkActionsModal(true);
  };

  const handleOrderSelection = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleConfirmOrder = (order) => {
    // Update local status
    setOrderStatuses(prev => ({
      ...prev,
      [order.id]: 'Confirmed'
    }));
    
    // Call the parent handler
    onConfirmOrder(order);
  };

  const handleBulkConfirm = () => {
    selectedOrders.forEach(orderId => {
      setOrderStatuses(prev => ({
        ...prev,
        [orderId]: 'Confirmed'
      }));
    });
    toast.success(`Confirmed ${selectedOrders.size} orders.`);
    setSelectedOrders(new Set());
    setShowBulkActionsModal(false);
  };

  const handleBulkAssignRoute = () => {
    toast.success(`Route assigned to ${selectedOrders.size} orders.`);
    setSelectedOrders(new Set());
    setShowBulkActionsModal(false);
  };

  const handleBulkCancel = () => {
    // Cancelling is destructive and cannot be undone from this table, so it
    // stays behind an explicit confirmation.
    if (window.confirm(`Cancel ${selectedOrders.size} orders? Vendors will be notified and this cannot be undone.`)) {
      selectedOrders.forEach(orderId => {
        setOrderStatuses(prev => ({
          ...prev,
          [orderId]: 'Cancelled'
        }));
      });
      toast.error(`Cancelled ${selectedOrders.size} orders.`);
      setSelectedOrders(new Set());
      setShowBulkActionsModal(false);
    }
  };

  const getOrderStatus = (order) => {
    return orderStatuses[order.id] || order.status;
  };

  const handleExportData = (format, dateRange, includeDetails) => {
    // Create export data
    const exportData = orders.map(order => ({
      OrderID: order.orderId,
      CustomerName: order.customerName,
      Items: order.items,
      TotalAmount: `₹${order.totalAmount}`,
      RouteName: order.routeName,
      EstimatedTime: order.estimatedTime,
      Status: getOrderStatus(order),
      ...(includeDetails && {
        OrderTime: '2 hours ago',
        DeliveryAddress: 'Dadar West, Mumbai',
        PaymentMethod: 'Online Payment',
        Contact: '+91 98765 43210'
      })
    }));

    // Create CSV content
    if (format === 'CSV (.csv)') {
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${dateRange.replace(/\s+/g, '_').toLowerCase()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'Excel (.xlsx)') {
      // For Excel, we'll create a simple CSV that Excel can open
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join('\t'),
        ...exportData.map(row => headers.map(header => row[header]).join('\t'))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/tab-separated-values' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${dateRange.replace(/\s+/g, '_').toLowerCase()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'PDF (.pdf)') {
      // For PDF, we'll show a message (in real app, you'd use a PDF library)
      toast.info('PDF export is not available yet — use Excel or CSV for now.');
      setShowExportModal(false);
      return;
    }

    toast.success(`Orders exported as ${format}.`);
    setShowExportModal(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-card-foreground">Order Aggregation</h3>
          <div className="flex items-center space-x-2">
            {selectedOrders.size > 0 && (
              <Button variant="outline" size="sm" onClick={handleBulkActions}>
                <Icon name="Settings" size={14} className="mr-1" />
                Bulk Actions ({selectedOrders.size})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Icon name="Filter" size={14} className="mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Icon name="Download" size={14} className="mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/30 sticky top-0">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                <input 
                  type="checkbox" 
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(new Set(orders.map(order => order.id)));
                    } else {
                      setSelectedOrders(new Set());
                    }
                  }}
                  checked={selectedOrders.size === orders.length && orders.length > 0}
                />
              </th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Order ID</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Items</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Route</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-muted/30 transition-colors duration-200">
                  <td className="p-3">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleOrderSelection(order.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRowExpansion(order.id)}
                        className="p-1 hover:bg-muted rounded-md transition-colors duration-200"
                      >
                        <Icon 
                          name={expandedRows.has(order.id) ? "ChevronDown" : "ChevronRight"} 
                          size={14} 
                        />
                      </button>
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <Icon name="Package" size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-card-foreground">{order.orderId}</p>
                        <p className="text-xs text-muted-foreground">{order.estimatedTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="text-xs font-semibold text-card-foreground">{order.customerName}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="text-xs font-medium text-card-foreground">{order.items} items</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="text-xs font-semibold text-card-foreground">₹{order.totalAmount}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-card-foreground">{order.routeName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.estimatedTime}</p>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getOrderStatus(order))}`}>
                      {getOrderStatus(order)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewRoute(order)}
                        className="text-xs px-2 py-1"
                      >
                        <Icon name="Map" size={12} className="mr-1" />
                        Route
                      </Button>
                      {getOrderStatus(order) === 'Pending' && (
                        <AnimatedOrderButton
                          onComplete={() => handleConfirmOrder(order)}
                          defaultText="Confirm"
                          successText="Confirmed!"
                          disabled={false}
                          className="text-xs px-2 py-1 h-8 text-sm"
                        />
                      )}
                    </div>
                  </td>
                </tr>
                
                {expandedRows.has(order.id) && (
                  <tr>
                    <td colSpan="8" className="p-0">
                      <div className="bg-muted/20 border-t border-border">
                        <div className="p-3">
                          <h4 className="text-xs font-medium text-card-foreground mb-2">Order Details</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-card rounded-md border border-border">
                              <div>
                                <p className="text-xs font-medium text-card-foreground">Order Time</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-card-foreground">Delivery Address</p>
                                <p className="text-xs text-muted-foreground">Dadar West, Mumbai</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-card rounded-md border border-border">
                              <div>
                                <p className="text-xs font-medium text-card-foreground">Payment Method</p>
                                <p className="text-xs text-muted-foreground">Online Payment</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-card-foreground">Contact</p>
                                <p className="text-xs text-muted-foreground">+91 98765 43210</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions Modal */}
      {showBulkActionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Bulk Actions</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowBulkActionsModal(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Selected {selectedOrders.size} orders for bulk action
                </p>
                <AnimatedOrderButton
                  onComplete={handleBulkConfirm}
                  defaultText="Confirm All Orders"
                  successText="All Orders Confirmed!"
                  disabled={selectedOrders.size === 0}
                  className="w-full justify-start"
                />
                <Button 
                  variant="outline" 
                  onClick={handleBulkAssignRoute}
                  className="w-full justify-start"
                >
                  <Icon name="Map" size={16} className="mr-2" />
                  Assign Route
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBulkCancel}
                  className="w-full justify-start text-error"
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Cancel Orders
                </Button>
              </div>
              <div className="mt-6">
                <Button onClick={() => setShowBulkActionsModal(false)} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Filter Orders</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilterModal(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Status</label>
                  <select className="w-full p-2 border border-border rounded-md">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Out for Delivery</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Date Range</label>
                  <select className="w-full p-2 border border-border rounded-md">
                    <option>All Time</option>
                    <option>Today</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Amount Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" className="p-2 border border-border rounded-md" placeholder="Min" />
                    <input type="number" className="p-2 border border-border rounded-md" placeholder="Max" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowFilterModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Filter applied.');
                  setShowFilterModal(false);
                }} className="flex-1">
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Export Orders</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowExportModal(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Export Format</label>
                  <select id="exportFormat" className="w-full p-2 border border-border rounded-md">
                    <option>Excel (.xlsx)</option>
                    <option>CSV (.csv)</option>
                    <option>PDF (.pdf)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Date Range</label>
                  <select id="dateRange" className="w-full p-2 border border-border rounded-md">
                    <option>All Orders</option>
                    <option>Today</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Include Details</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" id="includeDetails" defaultChecked />
                      <span className="text-sm">Customer Information</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Order Items</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Delivery Details</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowExportModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => {
                  const format = document.getElementById('exportFormat').value;
                  const dateRange = document.getElementById('dateRange').value;
                  const includeDetails = document.getElementById('includeDetails').checked;
                  handleExportData(format, dateRange, includeDetails);
                }} className="flex-1">
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAggregationTable;