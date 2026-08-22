import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import LocationHeader from '../../components/ui/LocationHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import { useCart } from '../../contexts/CartContext';

// Import components
import MetricsCard from './components/MetricsCard';
import DealCard from './components/DealCard';
import CategoryFilter from './components/CategoryFilter';
import OrderStatusCard from './components/OrderStatusCard';
import QuickActionButton from './components/QuickActionButton';
import GroupBuyingModal from './components/GroupBuyingModal';
import MausamEngineCard from './components/MausamEngineCard';
import MandiPoolSection from './components/MandiPoolSection';
import VyapaarScoreCard from './components/VyapaarScoreCard';
import CateringOrderCard from './components/CateringOrderCard';
import BoloMandi from './components/BoloMandi';
import BarsaatCoverCard from './components/BarsaatCoverCard';
import TyoharBookCard from './components/TyoharBookCard';
import RatingModal from '../order-tracking-history/components/RatingModal';

const VendorDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [deals, setDeals] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [showGroupBuyingModal, setShowGroupBuyingModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Dadar West, Mumbai');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratedOrders, setRatedOrders] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Mock data
  const metrics = [
    {
      title: "Today\'s Savings",
      value: "₹450",
      subtitle: "vs regular prices",
      icon: "TrendingDown",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Pending Orders",
      value: "3",
      subtitle: "awaiting delivery",
      icon: "Clock",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Nearby Suppliers",
      value: "12",
      subtitle: "within 5km",
      icon: "Store",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'Grid3X3', count: 24 },
    { id: 'vegetables', name: 'Vegetables', icon: 'Carrot', count: 12 },
    { id: 'dairy', name: 'Dairy', icon: 'Milk', count: 6 },
    { id: 'spices', name: 'Spices', icon: 'Flame', count: 4 },
    { id: 'grains', name: 'Grains', icon: 'Wheat', count: 2 }
  ];

  const mockDeals = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: 25,
      unit: "kg",
      availableQuantity: 50,
      supplierName: "Fresh Produce Co.",
      isVerified: true,
      rating: 4.5,
      distance: 1.2,
      image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg",
      dealType: "regular",
      category: "vegetables"
    },
    {
      id: 2,
      name: "Red Onions",
      price: 30,
      unit: "kg",
      availableQuantity: 25,
      supplierName: "Veggie World",
      isVerified: true,
      rating: 4.2,
      distance: 0.8,
      image: "https://images.pexels.com/photos/144248/onions-food-vegetables-healthy-144248.jpeg",
      dealType: "end-of-day",
      category: "vegetables"
    },
    {
      id: 3,
      name: "Fresh Milk",
      price: 55,
      unit: "liter",
      availableQuantity: 20,
      supplierName: "Dairy Fresh",
      isVerified: true,
      rating: 4.8,
      distance: 2.1,
      image: "https://images.pexels.com/photos/416656/pexels-photo-416656.jpeg",
      dealType: "next-morning-fresh",
      category: "dairy"
    },
    {
      id: 4,
      name: "Green Chilies",
      price: 80,
      unit: "kg",
      availableQuantity: 10,
      supplierName: "Spice Garden",
      isVerified: false,
      rating: 4.0,
      distance: 3.5,
      image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
      dealType: "regular",
      category: "vegetables"
    },
    {
      id: 5,
      name: "Basmati Rice",
      price: 120,
      unit: "kg",
      availableQuantity: 100,
      supplierName: "Grain Master",
      isVerified: true,
      rating: 4.6,
      distance: 4.2,
      image: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg",
      dealType: "regular",
      category: "grains"
    },
    {
      id: 6,
      name: "Turmeric Powder",
      price: 200,
      unit: "kg",
      availableQuantity: 5,
      supplierName: "Spice Junction",
      isVerified: true,
      rating: 4.4,
      distance: 1.8,
      image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
      dealType: "regular",
      category: "spices"
    }
  ];

  const mockOrders = [
    {
      id: "#1234",
      supplierName: "Fresh Produce Co.",
      status: "Out for Delivery",
      totalAmount: 125,
      orderTime: "2 hours ago",
      estimatedDelivery: "30 mins",
      items: [
        { name: "Tomatoes", quantity: 2, unit: "kg" },
        { name: "Onions", quantity: 1, unit: "kg" }
      ],
      qrCode: "QR123456"
    },
    {
      id: "#1233",
      supplierName: "Dairy Fresh",
      status: "Confirmed",
      totalAmount: 110,
      orderTime: "4 hours ago",
      estimatedDelivery: "2 hours",
      items: [
        { name: "Milk", quantity: 2, unit: "liter" }
      ]
    },
    {
      id: "#1232",
      supplierName: "Spice Garden",
      status: "Completed",
      totalAmount: 240,
      orderTime: "1 day ago",
      items: [
        { name: "Green Chilies", quantity: 0.5, unit: "kg" },
        { name: "Turmeric", quantity: 1, unit: "kg" }
      ],
      qrCode: "QR123455"
    }
  ];

  useEffect(() => {
    setDeals(mockDeals);
    setRecentOrders(mockOrders);
  }, []);

  const filteredDeals = deals.filter(deal => 
    activeCategory === 'all' || deal.category === activeCategory
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Mock refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleAddToCart = async (deal, quantity) => {
    try {
      // Add to global cart context
      addToCart({
        id: deal.id,
        name: deal.name,
        price: deal.price,
        unit: deal.unit,
        supplierName: deal.supplierName,
        image: deal.image,
        dealType: deal.dealType,
        category: deal.category
      }, quantity);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCreateGroup = async (groupData) => {
    // Mock group creation
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    // Refresh deals based on new location
  };

  const handleSubmitRating = (ratingData) => {
    setRatedOrders(prev => ({ ...prev, [ratingData.orderId]: ratingData }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* LocationHeader carries the delivery address, the search box and the
          cart link. LocationBanner underneath it stated the same address a
          second time, so it has been dropped rather than shown twice. */}
      <LocationHeader onLocationChange={handleLocationChange} />

      <div id="main-content" tabIndex={-1} className="outline-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Pull to Refresh Indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <Icon name="Loader2" size={20} className="animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Refreshing deals...</span>
          </div>
        )}

        {/* Mausam Engine + Vyapaar Score */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 items-start">
          <MausamEngineCard />
          <VyapaarScoreCard />
        </div>

        {/* Barsaat Cover — rain insurance triggered by the forecast */}
        <BarsaatCoverCard />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              color={metric.color}
              bgColor={metric.bgColor}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QuickActionButton
            title="Vendor Exchange"
            subtitle="Reduce waste, increase profits"
            icon="RefreshCw"
            to="/vendor-exchange"
            color="text-leaf-dark"
            bgColor="bg-leaf-light"
          />
          <QuickActionButton
            title="Virasaat"
            subtitle="License legendary recipes"
            icon="Crown"
            to="/virasaat"
            color="text-terracotta"
            bgColor="bg-terracotta-light"
          />
          <QuickActionButton
            title="Karigar Connect"
            subtitle="Find skilled kitchen help"
            icon="Wrench"
            to="/karigar-connect"
            color="text-turmeric-dark"
            bgColor="bg-turmeric-light"
          />
          <QuickActionButton
            title="Order History"
            subtitle="Track all your orders"
            icon="Package"
            onClick={() => navigate('/orders')}
            color="text-leaf-dark"
            bgColor="bg-leaf-light"
          />
        </div>

        {/* Mandi Pool — corridor group buying */}
        <MandiPoolSection onStartPool={() => setShowGroupBuyingModal(true)} />

        {/* Order the Street — corporate catering broadcast */}
        <CateringOrderCard />

        {/* Tyohar Book — festival pre-order escrow */}
        <TyoharBookCard />

        {/* Recent Orders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            <Button variant="ghost" size="sm">
              <span className="text-sm">View All</span>
              <Icon name="ChevronRight" size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentOrders.slice(0, 2).map((order) => (
              <OrderStatusCard
                key={order.id}
                order={order}
                onViewDetails={handleViewOrderDetails}
              />
            ))}
          </div>
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Order Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowOrderDetails(false)}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-card-foreground">Order ID:</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Supplier:</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.supplierName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Total Amount:</p>
                      <p className="text-sm text-muted-foreground">₹{selectedOrder.totalAmount}</p>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Status:</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.status === 'Completed' ? 'text-success bg-success/10' : selectedOrder.status === 'Out for Delivery' ? 'text-warning bg-warning/10' : 'text-primary bg-primary/10'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Order Time:</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.orderTime}</p>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <p className="font-medium text-card-foreground">Estimated Delivery:</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.estimatedDelivery}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Items:</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-card-foreground">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.quantity} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setShowOrderDetails(false)} className="flex-1">
                    Close
                  </Button>
                  {selectedOrder.status === 'Completed' && !ratedOrders[selectedOrder.id] && (
                    <Button variant="default" onClick={() => setShowRatingModal(true)} className="flex-1">
                      <Icon name="Star" size={16} className="mr-2" />
                      Rate Supplier
                    </Button>
                  )}
                  {selectedOrder.status === 'Completed' && ratedOrders[selectedOrder.id] && (
                    <span className="flex-1 flex items-center justify-center text-success font-medium">
                      <Icon name="Star" size={16} className="mr-1" />
                      Rated
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Rating Modal */}
            <RatingModal
              order={selectedOrder}
              isOpen={showRatingModal}
              onClose={() => setShowRatingModal(false)}
              onSubmitRating={handleSubmitRating}
            />
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-4">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Deals Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Available Deals ({filteredDeals.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <Icon name="RefreshCw" size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </Button>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No deals available</p>
              <p className="text-sm text-muted-foreground">
                Try changing your location or category filter
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Button - Group Buying */}
        <button
          onClick={() => setShowGroupBuyingModal(true)}
          className="fixed bottom-8 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevation-2 flex items-center justify-center hover:shadow-elevation-3 transition-all duration-200 z-50"
        >
          <Icon name="Users" size={24} />
        </button>
      </div>

      {/* Bolo Mandi — voice assistant */}
      <BoloMandi />

      {/* Group Buying Modal */}
      <GroupBuyingModal
        isOpen={showGroupBuyingModal}
        onClose={() => setShowGroupBuyingModal(false)}
        onCreateGroup={handleCreateGroup}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userType="vendor"
      />

    </div>
  );
};

export default VendorDashboard;