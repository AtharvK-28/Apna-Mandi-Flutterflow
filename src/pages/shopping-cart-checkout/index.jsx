import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import LocationHeader from '../../components/ui/LocationHeader';
import SupplierGroupCard from './components/SupplierGroupCard';
import GroupBuyingSuggestion from './components/GroupBuyingSuggestion';
import AddressConfirmation from './components/AddressConfirmation';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import OrderSummary from './components/OrderSummary';
import SupplierMapView from './components/SupplierMapView';
import { useCart } from '../../contexts/CartContext';

const ShoppingCartCheckout = () => {
  const navigate = useNavigate();
  const { cartItems: globalCartItems, updateQuantity, removeFromCart, clearCart, addTestItem, resetCartData, inspectCartData } = useCart();
  const [supplierGroups, setSupplierGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [groupBuyingSuggestions, setGroupBuyingSuggestions] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);

  // Mock user location
  const userLocation = {
    lat: 19.228825,
    lng: 72.854118
  };

  // Convert global cart items to array format
  const cartItems = Object.values(globalCartItems);

  // Debug logging

  // Initialize supplier groups based on global cart items
  useEffect(() => {
    if (cartItems.length === 0) return;

    // Extract unique suppliers from cart items
    const suppliers = cartItems.reduce((acc, item) => {
      const existing = acc.find(s => s.name === item.supplierName);
      if (!existing) {
        // Use a consistent seed based on supplier name for stable values
        const seed = item.supplierName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const distance = (seed % 30) / 10 + 0.5; // 0.5-3.5km
        const deliveryTime = 20 + (seed % 20); // 20-40 min
        const rating = 4.0 + (seed % 10) / 10; // 4.0-5.0
        const minOrder = 30 + (seed % 50); // 30-80
        const deliveryFee = (seed % 3 === 0) ? 0 : 10 + (seed % 20); // 0 or 10-30
        
        acc.push({
          id: item.supplierName.replace(/\s+/g, '-').toLowerCase(),
          name: item.supplierName,
        isVerified: true,
          distance: distance,
          estimatedDelivery: `${deliveryTime}-${deliveryTime + 10} min`,
          rating: rating.toFixed(1),
          minimumOrder: minOrder,
          deliveryFee: deliveryFee,
          address: 'Mumbai, Maharashtra'
        });
      }
      return acc;
    }, []);

    // Group items by supplier
    const groups = suppliers.map(supplier => ({
      supplier,
      items: cartItems.filter(item => item.supplierName === supplier.name)
    })).filter(group => group.items.length > 0);

    // Set initial expanded state for all groups
    const initialExpanded = {};
    groups.forEach(group => {
      initialExpanded[group.supplier.id] = true;
    });

    setSupplierGroups(groups);
    setExpandedGroups(initialExpanded);

    // Mock group buying suggestions
    setGroupBuyingSuggestions([
      {
        id: 1,
        supplierName: suppliers[0]?.name || 'Fresh Produce Co.',
        discount: 15,
        currentMembers: 3,
        requiredMembers: 5,
        timeLeft: '2h 30m',
        commonItems: ['Tomatoes', 'Onions', 'Potatoes']
      },
      {
        id: 2,
        supplierName: suppliers[1]?.name || 'Veggie World',
        discount: 10,
        currentMembers: 2,
        requiredMembers: 4,
        timeLeft: '1h 45m',
        commonItems: ['Green Chilies', 'Ginger']
      }
    ]);

    // Mock delivery address
    setDeliveryAddress({
      stallName: 'Rajesh\'s Street Food Corner',
      street: 'Near Metro Station, Main Road',
      area: 'Borivali',
      city: 'Mumbai',
      pincode: '400066',
      instructions: 'Call when you reach the metro station'
    });
  }, [cartItems]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleToggleGroupExpanded = (supplierId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [supplierId]: !prev[supplierId]
    }));
  };

  const handleJoinGroup = (group) => {
    
    // Add the group to joined groups
    setJoinedGroups(prev => {
      // Check if already joined
      const alreadyJoined = prev.find(g => g.id === group.id);
      if (alreadyJoined) {
        return prev;
      }
      return [...prev, group];
    });
  };

  const handleCreateGroup = () => {
    // Implement group creation logic
  };

  const handleAddressUpdate = (newAddress) => {
    setDeliveryAddress(newAddress);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    try {
      // Mock order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock order IDs for each supplier group
      const orderIds = supplierGroups.map((group, index) => `ORD${Date.now()}${index + 1}`);
      
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to order tracking with order IDs
      navigate('/order-tracking-history', { 
        state: { 
          newOrders: orderIds,
          message: `${orderIds.length} order${orderIds.length > 1 ? 's' : ''} placed successfully!`
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);

  // Calculate group buying savings
  const groupBuyingSavings = joinedGroups.reduce((total, group) => {
    return total + group.potentialSavings;
  }, 0);

  // Calculate group buying delivery split savings
  const groupBuyingDeliverySplit = joinedGroups.reduce((total, group) => {
    const originalDeliveryFee = group.deliveryFee;
    const splitDeliveryFee = group.deliveryFee / group.requiredMembers;
    return total + (originalDeliveryFee - splitDeliveryFee);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LocationHeader />
        
        <div id="main-content" tabIndex={-1} className="outline-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find great deals from nearby suppliers.
            </p>
            <Link to="/deal-discovery-shopping">
              <Button size="lg" className="px-8">
                <Icon name="ShoppingBag" size={20} className="mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LocationHeader />

      <div id="main-content" tabIndex={-1} className="outline-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {totalItems} item{totalItems !== 1 ? 's' : ''} from {supplierGroups.length} supplier{supplierGroups.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Desktop Map Toggle */}
          <div className="hidden lg:block">
            <Button
              variant="outline"
              onClick={() => setShowMapView(!showMapView)}
              className="flex items-center space-x-2"
            >
              <Icon name="Map" size={16} />
              <span>{showMapView ? 'Hide Map' : 'Show Map'}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Buying Suggestions */}
            <GroupBuyingSuggestion
              cartItems={cartItems}
              onJoinGroup={handleJoinGroup}
              onCreateGroup={handleCreateGroup}
            />

            {/* Supplier Groups */}
            <div className="space-y-4">
              {supplierGroups.map((group) => (
                <SupplierGroupCard
                  key={group.supplier.id}
                  supplier={group.supplier}
                  items={group.items}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onToggleExpanded={handleToggleGroupExpanded}
                  isExpanded={expandedGroups[group.supplier.id]}
                />
              ))}
            </div>

            {/* Desktop Map View */}
            {showMapView && (
              <div className="hidden lg:block">
                <SupplierMapView
                  suppliers={supplierGroups.map(group => group.supplier)}
                  userLocation={userLocation}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Address Confirmation */}
            <AddressConfirmation
              address={deliveryAddress}
              onAddressUpdate={handleAddressUpdate}
            />

            {/* Payment Method */}
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodChange={handlePaymentMethodChange}
            />

            {/* Order Summary */}
            <OrderSummary
              cartItems={cartItems}
              supplierGroups={supplierGroups}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
              groupBuyingSavings={groupBuyingSavings}
              groupBuyingDeliverySplit={groupBuyingDeliverySplit}
              joinedGroups={joinedGroups}
            />
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link to="/deal-discovery-shopping">
            <Button variant="outline" size="lg">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ShoppingCartCheckout;