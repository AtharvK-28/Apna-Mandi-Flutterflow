import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import { useCart } from '../../contexts/CartContext';
import AutoExchangeBanner from './components/AutoExchangeBanner';

const VendorExchange = () => {
  const { cartCount } = useCart();
  const [surplusItems, setSurplusItems] = useState([
    {
      id: 1,
      item: "Idli Batter",
      quantity: "3 Litres",
      originalPrice: 150,
      discountedPrice: 60,
      condition: "Fresh, good for 10 more hours",
      location: "Dadar Station West",
      distance: "200m away",
      vendorName: "Mumbai Dosa Corner",
      vendorRating: 4.5,
      vendorPhone: "+91 98765 43210",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
      description: "Rainy day, less customers. Need to clear stock before it goes bad.",
      postedAt: "2 hours ago"
    },
    {
      id: 2,
      item: "Fresh Paneer",
      quantity: "2kg",
      originalPrice: 400,
      discountedPrice: 160,
      condition: "Fresh from this morning",
      location: "Bandra Market",
      distance: "500m away",
      vendorName: "Dairy Delights",
      vendorRating: 4.8,
      vendorPhone: "+91 98765 43211",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
      description: "Extra stock from morning batch. Perfect for sweets and curries.",
      postedAt: "1 hour ago"
    },
    {
      id: 3,
      item: "Mixed Vegetables",
      quantity: "5kg",
      originalPrice: 200,
      discountedPrice: 80,
      condition: "Fresh, all good quality",
      location: "Andheri Station",
      distance: "300m away",
      vendorName: "Fresh Veggies",
      vendorRating: 4.2,
      vendorPhone: "+91 98765 43212",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
      description: "Closing early today. All vegetables fresh and clean.",
      postedAt: "30 minutes ago"
    }
  ]);

  const [urgentNeeds, setUrgentNeeds] = useState([
    {
      id: 1,
      item: "Lemons",
      quantity: "1kg",
      urgency: "Urgent",
      location: "Dadar Station West",
      distance: "150m away",
      vendorName: "Chaat Corner",
      vendorRating: 4.6,
      vendorPhone: "+91 98765 43213",
      description: "Running out of lemons for chaat. Need within 2 hours.",
      postedAt: "15 minutes ago"
    },
    {
      id: 2,
      item: "Onions",
      quantity: "3kg",
      urgency: "Critical",
      location: "Bandra Market",
      distance: "400m away",
      vendorName: "Spice King",
      vendorRating: 4.4,
      vendorPhone: "+91 98765 43214",
      description: "Critical shortage. Can't make any dishes without onions.",
      postedAt: "45 minutes ago"
    }
  ]);

  const [tradeProposals, setTradeProposals] = useState([
    {
      id: 1,
      offerItem: "2kg Potatoes",
      wantItem: "1kg Chutney",
      location: "Dadar Station West",
      distance: "250m away",
      vendorName: "Potato Vendor",
      vendorRating: 4.3,
      vendorPhone: "+91 98765 43215",
      description: "Have extra potatoes, need chutney for my dishes.",
      postedAt: "1 hour ago"
    },
    {
      id: 2,
      offerItem: "1kg Rice",
      wantItem: "500g Spices",
      location: "Andheri Station",
      distance: "350m away",
      vendorName: "Rice Merchant",
      vendorRating: 4.7,
      vendorPhone: "+91 98765 43216",
      description: "Fresh rice available. Looking for good quality spices.",
      postedAt: "2 hours ago"
    }
  ]);

  const [showSurplusModal, setShowSurplusModal] = useState(false);
  const [showNeedModal, setShowNeedModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('surplus');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handlePostSurplus = (formData) => {
    const newItem = {
      id: Date.now(),
      ...formData,
      vendorName: "Your Stall",
      vendorRating: 4.5,
      vendorPhone: "+91 98765 43217",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
      postedAt: "Just now"
    };
    setSurplusItems(prev => [newItem, ...prev]);
    setShowSurplusModal(false);
  };

  const handleAutoPublish = (formData) => {
    const newItem = {
      id: Date.now(),
      ...formData,
      distance: 'Your stall',
      vendorName: "Your Stall",
      vendorRating: 4.5,
      vendorPhone: "+91 98765 43217",
      postedAt: "Just now"
    };
    setSurplusItems(prev => [newItem, ...prev]);
    setActiveTab('surplus');
  };

  const handlePostNeed = (formData) => {
    const newNeed = {
      id: Date.now(),
      ...formData,
      vendorName: "Your Stall",
      vendorRating: 4.5,
      vendorPhone: "+91 98765 43217",
      postedAt: "Just now"
    };
    setUrgentNeeds(prev => [newNeed, ...prev]);
    setShowNeedModal(false);
  };

  const handleProposeTrade = (formData) => {
    const newTrade = {
      id: Date.now(),
      ...formData,
      vendorName: "Your Stall",
      vendorRating: 4.5,
      vendorPhone: "+91 98765 43217",
      postedAt: "Just now"
    };
    setTradeProposals(prev => [newTrade, ...prev]);
    setShowTradeModal(false);
  };

  const handleStartChat = (item, vendor) => {
    setSelectedItem(item);
    setSelectedVendor(vendor);
    setShowChatModal(true);
    
    // Initialize chat with user initiating conversation with vendor
    const initialMessages = [
      {
        id: 1,
        sender: 'You',
        message: `Namaste! I saw your ${item.item} listing. Is it still available?`,
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        isVendor: false
      },
      {
        id: 2,
        sender: vendor.vendorName,
        message: `Yes, it's still available! ${item.quantity} for ₹${item.discountedPrice || 'negotiable'}. ${item.description}`,
        timestamp: new Date(Date.now() - 240000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        isVendor: true
      },
      {
        id: 3,
        sender: 'You',
        message: `Great! Can you deliver to my location? I need it within 2 hours.`,
        timestamp: new Date(Date.now() - 180000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        isVendor: false
      }
    ];
    
    setChatMessages(initialMessages);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        isVendor: false
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate vendor response based on the item type and context
      setTimeout(() => {
        let vendorResponses = [];
        
        if (activeTab === 'surplus') {
          // Vendor selling surplus items
          vendorResponses = [
            'Yes, still available! Can you come to my stall?',
            'Sure! I can deliver. Extra ₹20 for delivery charge.',
            'The quality is very good. Fresh from this morning.',
            'Can you pay in cash? I prefer cash payment.',
            'Yes, I can hold it for you. When will you come?',
            'The price is fixed. It\'s already 60% off original price.',
            'I can give you a sample to check quality first.',
            'Do you want to see it before buying?',
            'I can deliver to your location. Where are you?',
            'Perfect! I\'ll keep it aside for you.'
          ];
        } else if (activeTab === 'needs') {
          // Vendor looking for items
          vendorResponses = [
            'Do you have this item available?',
            'I need it urgently. Can you help?',
            'What\'s your price for this item?',
            'Can you deliver quickly? I\'m running out.',
            'Do you have fresh stock?',
            'I can pay extra for quick delivery.',
            'What\'s the minimum quantity you can provide?',
            'Can you give me a good price for bulk?',
            'I need it for my customers today.',
            'Do you accept UPI payment?'
          ];
        } else if (activeTab === 'trades') {
          // Vendor proposing trades
          vendorResponses = [
            'Yes, I\'m interested in the trade!',
            'Can we meet to see the items?',
            'Is your item fresh and good quality?',
            'I can bring my item to show you.',
            'Let\'s meet halfway to exchange.',
            'Do you want to see my item first?',
            'Perfect trade! When can we meet?',
            'I can deliver my item to your location.',
            'Let\'s finalize the trade quickly.',
            'Can we do the exchange tomorrow?'
          ];
        }
        
        const randomResponse = vendorResponses[Math.floor(Math.random() * vendorResponses.length)];
        const vendorMessage = {
          id: chatMessages.length + 2,
          sender: selectedVendor?.vendorName || 'Vendor',
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isVendor: true
        };
        
        setChatMessages(prev => [...prev, vendorMessage]);
      }, 2000);
    }
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
  };

  const filteredItems = () => {
    let items = [];
    if (activeTab === 'surplus') items = surplusItems;
    else if (activeTab === 'needs') items = urgentNeeds;
    else if (activeTab === 'trades') items = tradeProposals;

    return items.filter(item => {
      const matchesSearch = item.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.vendorName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || item.item?.toLowerCase().includes(filterType);
      return matchesSearch && matchesFilter;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Vendor Exchange - Apna Mandi</title>
        <meta name="description" content="Connect with other vendors to buy, sell, and trade surplus items" />
      </Helmet>

      {/* Global App Header */}
      <Header />

      {/* Page Header */}
      <div id="main-content" tabIndex={-1} className="outline-none bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/home" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                <Icon name="Home" size={20} />
                <span className="font-semibold">Home</span>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Vendor Exchange</h1>
                <p className="text-sm text-muted-foreground">Circular economy for street vendors</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setIsMapVisible(!isMapVisible)}>
                <Icon name="Map" size={16} className="mr-1" />
                {isMapVisible ? 'Hide Map' : 'Show Map'}
              </Button>
              <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-1">
                <Icon name="ShoppingCart" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-card-foreground">{cartCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Auto-Exchange — predicted surplus, pre-drafted listings */}
        <AutoExchangeBanner onPublish={handleAutoPublish} />

        {/* Search and Filter */}
        <div className="bg-card rounded-lg border border-border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search items, vendors, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'vegetables', label: 'Vegetables' },
                  { value: 'fruits', label: 'Fruits' },
                  { value: 'batter', label: 'Batter & Dough' },
                  { value: 'bread', label: 'Bread & Bakery' },
                  { value: 'dairy', label: 'Dairy' },
                  { value: 'spices', label: 'Spices & Condiments' }
                ]}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button onClick={() => setShowSurplusModal(true)} className="bg-leaf hover:bg-leaf-dark">
            <Icon name="Plus" size={16} className="mr-2" />
            Post Surplus
          </Button>
          <Button onClick={() => setShowNeedModal(true)} variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta-light">
            <Icon name="AlertTriangle" size={16} className="mr-2" />
            Urgent Need
          </Button>
          <Button onClick={() => setShowTradeModal(true)} variant="outline" className="border-turmeric text-turmeric hover:bg-turmeric-light">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Propose Trade
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg border border-border mb-6">
          <div className="flex space-x-1 p-1">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'surplus'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveTab('surplus')}
            >
              <div className="flex flex-col items-center">
                <span>Surplus Items ({surplusItems.length})</span>
                <span className="text-xs opacity-75 mt-1">You can buy from vendors</span>
              </div>
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'needs'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveTab('needs')}
            >
              <div className="flex flex-col items-center">
                <span>Urgent Needs ({urgentNeeds.length})</span>
                <span className="text-xs opacity-75 mt-1">You can help vendors</span>
              </div>
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'trades'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveTab('trades')}
            >
              <div className="flex flex-col items-center">
                <span>Trade Proposals ({tradeProposals.length})</span>
                <span className="text-xs opacity-75 mt-1">You can trade with vendors</span>
              </div>
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems().map((item) => (
            <div key={item.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Item Image */}
              <div className="relative h-48 bg-muted">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400"}
                  alt={item.item}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    {activeTab === 'surplus' ? '60% OFF' : 
                     activeTab === 'needs' ? item.urgency : 'TRADE'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {item.distance}
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg mb-1">
                      {activeTab === 'surplus' ? item.item :
                       activeTab === 'needs' ? item.item :
                       `${item.offerItem} ↔ ${item.wantItem}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === 'surplus' ? item.quantity :
                       activeTab === 'needs' ? item.quantity :
                       'Trade Exchange'}
                    </p>
                  </div>
                  {activeTab === 'surplus' && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">₹{item.discountedPrice}</div>
                      <div className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</div>
                    </div>
                  )}
                </div>

                {/* Vendor Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{item.vendorName}</p>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} className="text-turmeric-dark fill-current" />
                        <span className="text-xs text-muted-foreground">{item.vendorRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                    <p className="text-xs text-muted-foreground">{item.postedAt}</p>
                  </div>
                </div>

                {/* Item Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.postedAt}</span>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStartChat(item, item)}
                    >
                      <Icon name="MessageCircle" size={14} className="mr-1" />
                      {activeTab === 'surplus' ? 'Buy' : activeTab === 'needs' ? 'Help' : 'Trade'}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleCall(item.vendorPhone)}
                    >
                      <Icon name="Phone" size={14} className="mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems().length === 0 && (
          <div className="text-center py-12">
            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => setShowSurplusModal(true)}>
              <Icon name="Plus" size={16} className="mr-2" />
              Post Your First Item
            </Button>
          </div>
        )}
      </div>

      {/* Map View */}
      {isMapVisible && (
        <div className="lg:w-96">
          <div className="bg-card rounded-lg border border-border p-4 sticky top-4">
            <h3 className="font-semibold text-card-foreground mb-4">Nearby Vendors</h3>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="Map" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Interactive map coming soon</p>
                <p className="text-sm text-muted-foreground">See vendors in your area</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Surplus Modal */}
      {showSurplusModal && (
        <PostSurplusModal
          onClose={() => setShowSurplusModal(false)}
          onSubmit={handlePostSurplus}
        />
      )}

      {/* Post Need Modal */}
      {showNeedModal && (
        <PostNeedModal
          onClose={() => setShowNeedModal(false)}
          onSubmit={handlePostNeed}
        />
      )}

      {/* Propose Trade Modal */}
      {showTradeModal && (
        <ProposeTradeModal
          onClose={() => setShowTradeModal(false)}
          onSubmit={handleProposeTrade}
        />
      )}

      {/* Chat Modal */}
      {showChatModal && selectedItem && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground">{selectedVendor.vendorName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'surplus' && `${selectedItem.item} • ₹${selectedItem.discountedPrice}`}
                    {activeTab === 'needs' && `Looking for ${selectedItem.item}`}
                    {activeTab === 'trades' && `Trade: ${selectedItem.offerItem} ↔ ${selectedItem.wantItem}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedItem.location} • {selectedItem.distance}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowChatModal(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isVendor ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.isVendor
                        ? 'bg-muted text-card-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              {/* Quick Message Suggestions */}
              {chatMessages.length <= 3 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {activeTab === 'surplus' && (
                    <>
                      <button
                        onClick={() => setNewMessage("Is the quality fresh?")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Quality check
                      </button>
                      <button
                        onClick={() => setNewMessage("Can you deliver?")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Delivery
                      </button>
                      <button
                        onClick={() => setNewMessage("Can you give better price?")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Negotiate price
                      </button>
                    </>
                  )}
                  {activeTab === 'needs' && (
                    <>
                      <button
                        onClick={() => setNewMessage("I can help you with this.")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        I can help
                      </button>
                      <button
                        onClick={() => setNewMessage("What's your budget?")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Budget
                      </button>
                      <button
                        onClick={() => setNewMessage("When do you need it?")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Timeline
                      </button>
                    </>
                  )}
                  {activeTab === 'trades' && (
                    <>
                      <button
                        onClick={() => setNewMessage("I'm interested in this trade.")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Interested
                      </button>
                      <button
                        onClick={() => setNewMessage("Can we meet to see items?")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Meet to see
                      </button>
                      <button
                        onClick={() => setNewMessage("Where can we exchange?")}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
                      >
                        Exchange location
                      </button>
                    </>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    activeTab === 'surplus' ? "Ask about quality, delivery, or price..." :
                    activeTab === 'needs' ? "Offer to help or ask about requirements..." :
                    "Discuss trade details..."
                  }
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal Components
const PostSurplusModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    originalPrice: '',
    discountedPrice: '',
    condition: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-card-foreground">Post Surplus Item</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Item Name</label>
            <Input
              value={formData.item}
              onChange={(e) => setFormData({...formData, item: e.target.value})}
              placeholder="e.g., Idli Batter, Fresh Paneer"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Quantity</label>
            <Input
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder="e.g., 3 Litres, 2kg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Original Price</label>
              <Input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                placeholder="₹150"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Discounted Price</label>
              <Input
                type="number"
                value={formData.discountedPrice}
                onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                placeholder="₹60"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Condition</label>
            <Input
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              placeholder="e.g., Fresh, good for 10 more hours"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Dadar Station West"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Why are you selling this surplus?"
              className="w-full p-3 border border-border rounded-lg bg-background text-card-foreground resize-none"
              rows={3}
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-leaf hover:bg-leaf-dark">
              Post Surplus
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostNeedModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    urgency: 'Urgent',
    location: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-card-foreground">Broadcast Urgent Need</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Item Needed</label>
            <Input
              value={formData.item}
              onChange={(e) => setFormData({...formData, item: e.target.value})}
              placeholder="e.g., Lemons, Onions"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Quantity</label>
            <Input
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder="e.g., 1kg, 2 dozen"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Urgency Level</label>
            <Select
              value={formData.urgency}
              onChange={(value) => setFormData({...formData, urgency: value})}
              options={[
                { value: 'Urgent', label: 'Urgent' },
                { value: 'Critical', label: 'Critical' },
                { value: 'Low', label: 'Low Priority' }
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Dadar Station, Andheri Market"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of your need..."
              className="w-full p-3 border border-border rounded-lg bg-background text-card-foreground resize-none"
              rows={3}
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-terracotta hover:bg-terracotta-dark">
              Broadcast Need
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProposeTradeModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    offerItem: '',
    wantItem: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-card-foreground">Propose a Trade</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Item You're Offering</label>
            <Input
              value={formData.offerItem}
              onChange={(e) => setFormData({...formData, offerItem: e.target.value})}
              placeholder="e.g., 2kg Potatoes"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Item You Want</label>
            <Input
              value={formData.wantItem}
              onChange={(e) => setFormData({...formData, wantItem: e.target.value})}
              placeholder="e.g., 1kg Chutney"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Dadar Station West"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of your trade proposal..."
              className="w-full p-3 border border-border rounded-lg bg-background text-card-foreground resize-none"
              rows={3}
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-turmeric hover:bg-turmeric/80">
              Propose Trade
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorExchange; 