import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QRCodeScanner from '../../components/ui/QRCodeScanner';
import NotificationCenter from '../../components/ui/NotificationCenter';

// Import page components
import OrderCard from './components/OrderCard';
import OrderTabs from './components/OrderTabs';
import SearchAndFilter from './components/SearchAndFilter';
import OrderDetailsModal from './components/OrderDetailsModal';
import RatingModal from './components/RatingModal';
import EmptyState from './components/EmptyState';
import ChatModal from '../../components/ui/ChatModal';

const OrderTrackingHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        orderId: '#ORD001',
        supplierName: 'Fresh Produce Co.',
        supplierLocation: 'Dadar West, Mumbai',
        supplierPhone: '+91 98765 43210',
        supplierRating: 4.5,
        supplierReviews: 128,
        supplierFSSAI: 'FSSAI12345678901234',
        status: 'Out for Delivery',
        orderDate: '2025-01-25T08:30:00Z',
        confirmedDate: '2025-01-25T08:45:00Z',
        dispatchedDate: '2025-01-25T10:15:00Z',
        estimatedDelivery: 'Today, 2:00 PM',
        totalAmount: 285,
        subtotal: 260,
        deliveryFee: 25,
        discount: 0,
        deliveryAddress: 'Rajesh Corner, Dadar West, Mumbai',
        items: [
          {
            name: 'Fresh Tomatoes',
            quantity: 2,
            unit: 'kg',
            price: 50,
            pricePerUnit: 25
          },
          {
            name: 'Red Onions',
            quantity: 3,
            unit: 'kg',
            price: 90,
            pricePerUnit: 30
          },
          {
            name: 'Green Chilies',
            quantity: 0.5,
            unit: 'kg',
            price: 40,
            pricePerUnit: 80
          },
          {
            name: 'Fresh Coriander',
            quantity: 1,
            unit: 'bunch',
            price: 20,
            pricePerUnit: 20
          },
          {
            name: 'Ginger',
            quantity: 0.25,
            unit: 'kg',
            price: 60,
            pricePerUnit: 240
          }
        ],
        rated: false
      },
      {
        orderId: '#ORD002',
        supplierName: 'Veggie World',
        supplierLocation: 'Bandra Market, Mumbai',
        supplierPhone: '+91 87654 32109',
        supplierRating: 4.2,
        supplierReviews: 95,
        supplierFSSAI: 'FSSAI23456789012345',
        status: 'Confirmed',
        orderDate: '2025-01-25T07:15:00Z',
        confirmedDate: '2025-01-25T07:30:00Z',
        estimatedDelivery: 'Today, 3:30 PM',
        totalAmount: 180,
        subtotal: 165,
        deliveryFee: 15,
        discount: 0,
        deliveryAddress: 'Rajesh Corner, Dadar West, Mumbai',
        items: [
          {
            name: 'Potatoes',
            quantity: 5,
            unit: 'kg',
            price: 100,
            pricePerUnit: 20
          },
          {
            name: 'Carrots',
            quantity: 1,
            unit: 'kg',
            price: 40,
            pricePerUnit: 40
          },
          {
            name: 'Capsicum',
            quantity: 0.5,
            unit: 'kg',
            price: 25,
            pricePerUnit: 50
          }
        ],
        rated: false
      },
      {
        orderId: '#ORD003',
        supplierName: 'Spice Garden',
        supplierLocation: 'Andheri East, Mumbai',
        supplierPhone: '+91 76543 21098',
        supplierRating: 4.8,
        supplierReviews: 203,
        supplierFSSAI: 'FSSAI34567890123456',
        status: 'Pending',
        orderDate: '2025-01-25T09:45:00Z',
        estimatedDelivery: 'Today, 4:00 PM',
        totalAmount: 95,
        subtotal: 85,
        deliveryFee: 10,
        discount: 0,
        deliveryAddress: 'Rajesh Corner, Dadar West, Mumbai',
        items: [
          {
            name: 'Turmeric Powder',
            quantity: 0.5,
            unit: 'kg',
            price: 60,
            pricePerUnit: 120
          },
          {
            name: 'Red Chili Powder',
            quantity: 0.25,
            unit: 'kg',
            price: 25,
            pricePerUnit: 100
          }
        ],
        rated: false
      },
      {
        orderId: '#ORD004',
        supplierName: 'Fresh Produce Co.',
        supplierLocation: 'Dadar West, Mumbai',
        supplierPhone: '+91 98765 43210',
        supplierRating: 4.5,
        supplierReviews: 128,
        supplierFSSAI: 'FSSAI12345678901234',
        status: 'Completed',
        orderDate: '2025-01-24T10:20:00Z',
        confirmedDate: '2025-01-24T10:35:00Z',
        dispatchedDate: '2025-01-24T12:00:00Z',
        deliveredDate: '2025-01-24T14:30:00Z',
        totalAmount: 320,
        subtotal: 295,
        deliveryFee: 25,
        discount: 0,
        deliveryAddress: 'Rajesh Corner, Dadar West, Mumbai',
        items: [
          {
            name: 'Fresh Tomatoes',
            quantity: 3,
            unit: 'kg',
            price: 75,
            pricePerUnit: 25
          },
          {
            name: 'Red Onions',
            quantity: 4,
            unit: 'kg',
            price: 120,
            pricePerUnit: 30
          },
          {
            name: 'Fresh Coriander',
            quantity: 2,
            unit: 'bunch',
            price: 40,
            pricePerUnit: 20
          },
          {
            name: 'Ginger',
            quantity: 0.5,
            unit: 'kg',
            price: 120,
            pricePerUnit: 240
          }
        ],
        rated: true
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on active tab
  const getFilteredOrdersByTab = () => {
    const baseFiltered = filteredOrders.filter(order => {
      if (activeTab === 'active') {
        return ['pending', 'confirmed', 'out for delivery'].includes(order.status.toLowerCase());
      } else {
        return ['completed', 'cancelled'].includes(order.status.toLowerCase());
      }
    });

    return baseFiltered;
  };

  const displayedOrders = getFilteredOrdersByTab();
  const activeOrdersCount = orders.filter(order => 
    ['pending', 'confirmed', 'out for delivery'].includes(order.status.toLowerCase())
  ).length;
  const historyOrdersCount = orders.filter(order => 
    ['completed', 'cancelled'].includes(order.status.toLowerCase())
  ).length;

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredOrders(orders);
      return;
    }

    let filtered = orders.filter(order =>
      order.orderId.toLowerCase().includes(query.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(query.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredOrders(filtered);
  };

  // Filter functionality
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    let filtered = [...orders];

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (newFilters.status) {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === newFilters.status.toLowerCase()
      );
    }

    // Apply supplier filter
    if (newFilters.supplier) {
      filtered = filtered.filter(order => 
        order.supplierName.toLowerCase().includes(newFilters.supplier.toLowerCase())
      );
    }

    // Apply amount range filter
    if (newFilters.minAmount) {
      filtered = filtered.filter(order => order.totalAmount >= parseFloat(newFilters.minAmount));
    }
    if (newFilters.maxAmount) {
      filtered = filtered.filter(order => order.totalAmount <= parseFloat(newFilters.maxAmount));
    }

    // Apply date range filter
    if (newFilters.dateRange) {
      const now = new Date();
      let startDate;

      switch (newFilters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'yesterday':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= startDate && orderDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
          });
          break;
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }

      if (startDate && newFilters.dateRange !== 'yesterday') {
        filtered = filtered.filter(order => new Date(order.orderDate) >= startDate);
      }
    }

    setFilteredOrders(filtered);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({});
    setFilteredOrders(orders);
  };

  // Order actions
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleReorder = (order) => {
    // Add items to cart and navigate to cart
    navigate('/shopping-cart-checkout');
  };

  const handleRateOrder = (order) => {
    setSelectedOrder(order);
    setIsRatingModalOpen(true);
  };

  const handleContactSupplier = (order) => {
    // Hand off to the device dialler rather than describing the call in a
    // dialog. On desktop this opens whatever handles tel: links.
    window.location.href = `tel:${String(order.supplierPhone).replace(/[^+\d]/g, '')}`;
  };

  const handleMessageSupplier = (order) => {
    // Create a proper supplier object from the order data
    const supplierData = {
      supplierName: order.supplierName,
      supplierLocation: order.supplierLocation,
      supplierPhone: order.supplierPhone,
      supplierRating: order.supplierRating,
      supplierReviews: order.supplierReviews,
      supplierFSSAI: order.supplierFSSAI,
      orderId: order.orderId
    };
    setSelectedSupplier(supplierData);
    setShowChatModal(true);
  };

  const handleScanQR = (order) => {
    setSelectedOrder(order);
    setIsQRScannerOpen(true);
  };

  const handleQRScanSuccess = (scanData) => {
    // Update order status to completed
    setOrders(prev => 
      prev.map(order => 
        order.orderId === selectedOrder.orderId 
          ? { ...order, status: 'Completed', deliveredDate: new Date().toISOString() }
          : order
      )
    );
    setIsQRScannerOpen(false);
  };

  const handleSubmitRating = (ratingData) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.orderId === ratingData.orderId 
          ? { ...order, rated: true }
          : order
      )
    );
    setIsRatingModalOpen(false);
  };

  // Function to simulate placing a new order (for testing)
  const handlePlaceNewOrder = () => {
    const newOrder = {
      orderId: `#ORD${String(orders.length + 1).padStart(3, '0')}`,
      supplierName: 'Fresh Grocery Store',
      supplierLocation: 'Dadar Station, Mumbai',
      supplierPhone: '+91 98765 43210',
      supplierRating: 4.3,
      supplierReviews: 156,
      supplierFSSAI: 'FSSAI45678901234567',
      status: 'Pending',
      orderDate: new Date().toISOString(),
      estimatedDelivery: 'Today, 5:00 PM',
      totalAmount: 320,
      subtotal: 300,
      deliveryFee: 20,
      discount: 0,
      deliveryAddress: 'Rajesh Corner, Dadar West, Mumbai',
      items: [
        {
          name: 'Fresh Apples',
          quantity: 2,
          unit: 'kg',
          price: 120,
          pricePerUnit: 60
        },
        {
          name: 'Bananas',
          quantity: 3,
          unit: 'dozen',
          price: 90,
          pricePerUnit: 30
        },
        {
          name: 'Oranges',
          quantity: 1.5,
          unit: 'kg',
          price: 90,
          pricePerUnit: 60
        }
      ],
      rated: false
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchQuery.trim() !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div id="main-content" tabIndex={-1} className="outline-none flex items-center justify-center py-20">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div id="main-content" tabIndex={-1} className="outline-none bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Track your current orders and view order history
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationOpen(true)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQRScannerOpen(true)}
            >
              <Icon name="QrCode" size={16} className="mr-2" />
              Scan QR
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handlePlaceNewOrder}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              New Order
            </Button>
          </div>
        </div>
      </div>

      {/* Order Tabs */}
      <OrderTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeOrdersCount={activeOrdersCount}
        historyOrdersCount={historyOrdersCount}
      />

      {/* Search and Filter */}
      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filters}
      />

      {/* Orders List */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedOrders.length === 0 ? (
          <EmptyState
            type={activeTab}
            searchQuery={searchQuery}
            hasFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          displayedOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onViewDetails={handleViewDetails}
              onReorder={handleReorder}
              onRateOrder={handleRateOrder}
              onContactSupplier={handleContactSupplier}
              onScanQR={handleScanQR}
              onMessageSupplier={handleMessageSupplier}
            />
          ))
        )}
      </div>

      {/* Floating Action Button for QR Scanner - Removed to reduce UI clutter */}

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onContactSupplier={handleContactSupplier}
        onReorder={handleReorder}
        onRateOrder={handleRateOrder}
      />

      <RatingModal
        order={selectedOrder}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmitRating={handleSubmitRating}
      />

      <QRCodeScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
        orderData={selectedOrder}
      />

      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userType="vendor"
      />

      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        supplier={selectedSupplier}
        orderId={selectedSupplier?.orderId?.replace('#', '')}
      />
    </div>
  );
};

export default OrderTrackingHistory;