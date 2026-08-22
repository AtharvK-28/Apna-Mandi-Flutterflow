import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GroupBuyingSuggestion = ({ cartItems, onJoinGroup, onCreateGroup }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [timeLeft, setTimeLeft] = useState('2h 30m');
  const [isJoining, setIsJoining] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const [joinedGroupIds, setJoinedGroupIds] = useState(new Set());
  // Browser alert() blocks the page and cannot be styled or dismissed by
  // keyboard on mobile; an inline status message says the same thing.
  const [status, setStatus] = useState(null);
  const expandedRef = useRef(null);

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const [hours, minutes] = prev.split('h ');
        const mins = parseInt(minutes);
        if (mins > 0) {
          return `${hours}h ${mins - 1}m`;
        } else if (parseInt(hours) > 0) {
          return `${parseInt(hours) - 1}h 59m`;
        }
        return '0h 0m';
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Generate meaningful group buying suggestions
  const generateSuggestions = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) {
      return [];
    }

    // Group items by supplier
    const supplierGroups = {};
    Object.values(cartItems).forEach(item => {
      const supplierName = item.supplierName || 'Unknown Supplier';
      if (!supplierGroups[supplierName]) {
        supplierGroups[supplierName] = [];
      }
      supplierGroups[supplierName].push(item);
    });

    // Create meaningful suggestions
    const suggestions = [];
    Object.entries(supplierGroups).forEach(([supplierName, items]) => {
      const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (totalValue >= 200) { // Show for orders above ₹200
        const discount = totalValue >= 500 ? 20 : totalValue >= 300 ? 15 : 10;
        const requiredMembers = 5; // Fixed to 5 for all groups
        const currentMembers = 4; // Fixed to 4, so joining completes the group
        
        // Use stable, realistic order counts based on supplier name
        const getOrderCount = (name) => {
          const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
          const baseCount = (hash % 100) + 50; // Between 50-150 orders
          return baseCount;
        };
        
        suggestions.push({
          id: `group-${supplierName}`,
          supplierName,
          discount,
          currentMembers,
          requiredMembers,
          timeLeft,
          commonItems: items.slice(0, 3).map(item => item.name),
          totalValue,
          potentialSavings: totalValue * (discount / 100),
          deliveryFee: 60,
          items: items,
          location: 'Mumbai Central',
          rating: 4.2,
          ordersCompleted: getOrderCount(supplierName)
        });
      }
    });

    return suggestions;
  };

  const suggestions = generateSuggestions();

  // Create meaningful demo suggestions when no cart items
  const demoSuggestions = suggestions.length === 0 ? [
    {
      id: 'demo-fresh-harvest',
      supplierName: 'Fresh Harvest Co.',
      discount: 20,
      currentMembers: 4,
      requiredMembers: 5,
      timeLeft,
      commonItems: ['Organic Tomatoes', 'Bell Peppers', 'Fresh Onions'],
      totalValue: 650,
      potentialSavings: 130,
      deliveryFee: 60,
      items: [],
      location: 'Mumbai Central',
      rating: 4.5,
      ordersCompleted: 127,
      isDemo: true
    },
    {
      id: 'demo-daily-veggies',
      supplierName: 'Daily Veggies Market',
      discount: 15,
      currentMembers: 4,
      requiredMembers: 5,
      timeLeft,
      commonItems: ['Carrots', 'Potatoes', 'Green Beans'],
      totalValue: 420,
      potentialSavings: 63,
      deliveryFee: 60,
      items: [],
      location: 'Andheri West',
      rating: 4.3,
      ordersCompleted: 89,
      isDemo: true
    }
  ] : suggestions;

  if (demoSuggestions.length === 0) return null;

  const handleJoinGroup = (suggestion) => {
    setSelectedGroup(suggestion);
    setIsExpanded(true);
    
    // Smooth scroll to the expanded section after a short delay
    setTimeout(() => {
      if (expandedRef.current) {
        expandedRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
    
    if (onJoinGroup) {
      onJoinGroup(suggestion);
    }
  };

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
    // Generate a unique group link
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const link = `${window.location.origin}/join-group/${uniqueId}`;
    setGroupLink(link);
  };

  const handleConfirmJoin = async () => {
    setIsJoining(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsJoining(false);
    
    // Mark this group as joined
    setJoinedGroupIds(prev => new Set([...prev, selectedGroup.id]));
    
    // Call the onJoinGroup callback to update the parent component
    if (onJoinGroup) {
      onJoinGroup(selectedGroup);
    }
    
    setStatus(`Joined the ${selectedGroup.supplierName} group. Your bulk discount is applied at checkout.`);
    setIsExpanded(false);
  };

  const copyGroupLink = async () => {
    try {
      await navigator.clipboard.writeText(groupLink);
      setStatus('Link copied. Share it with nearby vendors to fill your group.');
    } catch {
      // Clipboard access is refused outside a secure context or without
      // permission — show the link so it can still be copied by hand.
      setStatus(`Copy this link manually: ${groupLink}`);
    }
  };

  const isGroupJoined = (groupId) => joinedGroupIds.has(groupId);

  const joinedGroupsCount = joinedGroupIds.size;
  const availableGroupsCount = demoSuggestions.filter(s => !isGroupJoined(s.id)).length;

  return (
    <div className="bg-gradient-to-br from-terracotta-light/60 via-paper-light to-turmeric-light/40 border border-terracotta/25 rounded-xl shadow-sm mb-6">
      {/* Dropdown Header */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-terracotta-light/50 transition-colors duration-200 rounded-xl"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-terracotta-light rounded-lg">
            <Icon name="Users" size={24} className="text-terracotta" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-ink">Group buying</h3>
            <p className="text-sm text-ink-light">
              {joinedGroupsCount > 0 
                ? `You've joined ${joinedGroupsCount} group${joinedGroupsCount > 1 ? 's' : ''} • ${availableGroupsCount} more available`
                : `${availableGroupsCount} groups available • Join to unlock bulk discounts`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {joinedGroupsCount > 0 && (
            <div className="bg-leaf-light text-leaf-dark px-3 py-1 rounded-full text-sm font-medium">
              +{joinedGroupsCount} joined
            </div>
          )}
          <div className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
            <Icon name="ChevronDown" size={20} className="text-ink-medium" />
          </div>
        </div>
      </button>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="px-6 pb-6 border-t border-terracotta/25">
          <div className="space-y-4 mt-4">
            {demoSuggestions.map((suggestion) => {
              const isJoined = isGroupJoined(suggestion.id);
              const isCompleted = isJoined || suggestion.currentMembers >= suggestion.requiredMembers;
              
              return (
                <div key={suggestion.id} className={`border border-paper-dark rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 ${
                  isCompleted ? 'bg-paper opacity-75' : 'bg-paper-light'
                }`}>
                  {suggestion.isDemo && (
                    <div className="mb-3">
                      <span className="bg-gradient-to-r from-turmeric-light to-terracotta-light text-turmeric-dark text-xs px-3 py-1 rounded-full font-medium border border-turmeric/30">
                        Example — add items to your cart to see real suggestions
                      </span>
                    </div>
                  )}
                  
                  {isJoined && (
                    <div className="mb-3">
                      <span className="bg-gradient-to-r from-leaf-light to-leaf-light text-leaf-dark text-xs px-3 py-1 rounded-full font-medium border border-leaf/30">
                        Joined — discount applied
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div>
                          <h4 className={`text-lg font-semibold ${isCompleted ? 'text-ink-medium' : 'text-ink'}`}>
                            {suggestion.supplierName}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-ink-medium">
                            <Icon name="MapPin" size={12} />
                            <span>{suggestion.location}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Icon name="Star" size={12} className="text-turmeric" />
                              <span>{suggestion.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{suggestion.ordersCompleted} orders</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-gradient-to-r from-leaf-light to-leaf-light text-leaf-dark text-sm px-3 py-1 rounded-full font-semibold border border-leaf/30">
                          {suggestion.discount}% OFF
                        </span>
                        <span className="bg-gradient-to-r from-terracotta-light to-turmeric-light text-terracotta-dark text-sm px-3 py-1 rounded-full font-semibold border border-terracotta/25">
                          Save ₹{suggestion.potentialSavings.toFixed(0)}
                        </span>
                        <span className="bg-gradient-to-r from-chili-light to-terracotta-light text-chili text-sm px-3 py-1 rounded-full font-semibold border border-chili/30">
                          Split Delivery
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-ink-light mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon name="Users" size={14} className="text-terracotta" />
                          <span>{isCompleted ? suggestion.requiredMembers : suggestion.currentMembers}/{suggestion.requiredMembers} vendors</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Clock" size={14} className="text-terracotta" />
                          <span>{suggestion.timeLeft} left</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Truck" size={14} className="text-leaf" />
                          <span>₹{suggestion.deliveryFee} delivery</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Package" size={14} className="text-chili" />
                          <span>{suggestion.commonItems.length} items</span>
                        </div>
                      </div>

                      <div className="text-sm text-ink-light mb-3">
                        <strong>Common items:</strong> {suggestion.commonItems.join(', ')}
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-ink-medium mb-1">
                          <span>Group Progress</span>
                          <span>{Math.round((isCompleted ? suggestion.requiredMembers : suggestion.currentMembers) / suggestion.requiredMembers * 100)}%</span>
                        </div>
                        <div className="w-full bg-paper-dark rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-leaf to-leaf/80' 
                                : 'bg-gradient-to-r from-terracotta to-chili'
                            }`}
                            style={{ width: `${(isCompleted ? suggestion.requiredMembers : suggestion.currentMembers) / suggestion.requiredMembers * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-sm text-ink-light">
                        <strong>Your order value:</strong> ₹{suggestion.totalValue.toFixed(2)} | 
                        <strong>Potential savings:</strong> ₹{suggestion.potentialSavings.toFixed(2)}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button
                        onClick={() => handleJoinGroup(suggestion)}
                        disabled={isCompleted}
                        className={`px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${
                          isCompleted
                            ? 'bg-paper-dark text-ink-medium cursor-not-allowed'
                            : 'bg-gradient-to-r from-terracotta to-chili hover:from-terracotta-dark hover:to-chili text-white'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Join Group'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Group Details */}
          {isExpanded && selectedGroup && (
            <div ref={expandedRef} className="mt-6 p-6 bg-paper-light border border-terracotta/25 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-ink">Group Details - {selectedGroup.supplierName}</h4>
                  <p className="text-sm text-ink-light">{selectedGroup.location} • {selectedGroup.rating} • {selectedGroup.ordersCompleted} orders</p>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-paper-dark/50 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} className="text-ink-medium" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-terracotta-light/60 to-turmeric-light/50 p-4 rounded-xl border border-terracotta/25">
                  <h5 className="font-semibold text-terracotta-dark mb-3 flex items-center">
                    <Icon name="DollarSign" size={16} className="mr-2" />
                    Savings breakdown
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-ink-light">Original Total:</span>
                      <span className="font-medium">₹{selectedGroup.totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-leaf-dark">
                      <span>Bulk Discount ({selectedGroup.discount}%):</span>
                      <span className="font-medium">-₹{selectedGroup.potentialSavings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-terracotta">
                      <span>Delivery Split:</span>
                      <span className="font-medium">-₹{(selectedGroup.deliveryFee / selectedGroup.requiredMembers).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-terracotta/25 pt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Final Total:</span>
                        <span className="text-leaf-dark">₹{(selectedGroup.totalValue - selectedGroup.potentialSavings - (selectedGroup.deliveryFee / selectedGroup.requiredMembers)).toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-ink-medium mt-1">
                        You save ₹{(selectedGroup.potentialSavings + (selectedGroup.deliveryFee - selectedGroup.deliveryFee / selectedGroup.requiredMembers)).toFixed(2)} total!
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-leaf-light/60 to-leaf-light/40 p-4 rounded-xl border border-leaf/30">
                  <h5 className="font-semibold text-leaf-dark mb-3 flex items-center">
                    <Icon name="Users" size={16} className="mr-2" />
                    Group members
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-leaf-light rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-leaf rounded-full"></div>
                        <span>Vendor 1</span>
                      </div>
                      <span className="text-leaf-dark">₹280</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-leaf-light rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-leaf rounded-full"></div>
                        <span>Vendor 2</span>
                      </div>
                      <span className="text-leaf-dark">₹320</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-leaf-light rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-leaf rounded-full"></div>
                        <span>Vendor 3</span>
                      </div>
                      <span className="text-leaf-dark">₹190</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-leaf-light rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-leaf rounded-full"></div>
                        <span>Vendor 4</span>
                      </div>
                      <span className="text-leaf-dark">₹250</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-terracotta-light rounded-lg border-2 border-terracotta/40">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-terracotta rounded-full animate-pulse"></div>
                        <span className="font-medium text-terracotta-dark">You (Current Order)</span>
                      </div>
                      <span className="text-terracotta-dark font-medium">₹{selectedGroup.totalValue.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-turmeric-light/60 border border-turmeric/30 rounded-lg">
                    <p className="text-xs text-turmeric-dark">
                      <strong>Almost there.</strong> One more vendor completes this group and the discount applies immediately.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleConfirmJoin}
                  disabled={isJoining || isGroupJoined(selectedGroup.id)}
                  className={`flex-1 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isGroupJoined(selectedGroup.id)
                      ? 'bg-paper-dark text-ink-medium cursor-not-allowed'
                      : 'bg-gradient-to-r from-leaf to-leaf-dark hover:from-leaf-dark hover:to-leaf-dark text-white'
                  }`}
                >
                  {isJoining ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Joining Group...
                    </>
                  ) : isGroupJoined(selectedGroup.id) ? (
                    <>
                      <Icon name="Check" size={16} className="mr-2" />
                      Already Joined
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={16} className="mr-2" />
                      Join & Complete Group
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="border-paper-dark text-ink-light hover:bg-paper py-3 px-6 rounded-lg font-medium"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Create Group Modal */}
          {showCreateGroup && (
            <div className="mt-6 p-6 bg-paper-light border border-terracotta/25 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-ink">Create New Group Order</h4>
                  <p className="text-sm text-ink-light">Share this link with other vendors to join your group</p>
                </div>
                <button 
                  onClick={() => setShowCreateGroup(false)}
                  className="p-2 hover:bg-paper-dark/50 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} className="text-ink-medium" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-terracotta-light/60 to-turmeric-light/50 p-4 rounded-xl border border-terracotta/25">
                  <h5 className="font-semibold text-terracotta-dark mb-2">Group details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Group ID:</span>
                      <span className="font-mono text-terracotta">{groupLink.split('/').pop()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Members:</span>
                      <span>5 vendors</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>15% off</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Split:</span>
                      <span>₹12 each (₹60 total)</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-paper p-4 rounded-xl border border-paper-dark">
                  <h5 className="font-semibold text-ink mb-2">Share link</h5>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={groupLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-paper-dark rounded-lg text-sm bg-paper-light"
                    />
                    <Button
                      onClick={copyGroupLink}
                      className="bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2 rounded-lg text-sm"
                    >
                      <Icon name="Copy" size={14} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-ink-medium mt-2">
                    Share this link via WhatsApp, email, or any messaging app
                  </p>
                </div>
                
                <div className="bg-turmeric-light/60 p-4 rounded-xl border border-turmeric/30">
                  <h5 className="font-semibold text-turmeric-dark mb-2">How it works</h5>
                  <ul className="text-sm text-turmeric-dark space-y-1">
                    <li>• Share the link with 4 other vendors</li>
                    <li>• Each vendor adds their items to the group</li>
                    <li>• When 5 vendors join, everyone gets 15% discount</li>
                    <li>• Delivery cost is split among all members</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <Button
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white py-3 rounded-lg font-semibold"
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-terracotta/25">
            <Button
              variant="ghost"
              onClick={handleCreateGroup}
              className="w-full text-terracotta hover:bg-terracotta-light/60 py-3 rounded-lg font-medium"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Create New Group Order
            </Button>
          </div>
        </div>
      )}

      {status && (
        <div
          role="status"
          className="mx-6 mb-6 flex items-start gap-3 bg-leaf-light border border-leaf/30 rounded-xl px-4 py-3"
        >
          <Icon name="CheckCircle" size={17} className="text-leaf-dark flex-shrink-0 mt-0.5" />
          <p className="text-sm text-ink flex-1 break-words">{status}</p>
          <button
            type="button"
            onClick={() => setStatus(null)}
            aria-label="Dismiss"
            className="press text-ink-medium hover:text-ink flex-shrink-0"
          >
            <Icon name="X" size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupBuyingSuggestion;