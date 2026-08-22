import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useCart } from '../../contexts/CartContext';

const LocationHeader = ({ onLocationChange }) => {
  const [currentLocation, setCurrentLocation] = useState('Detecting location...');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Mock location detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLocation('Borivali, Mumbai');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Close modal on outside click
  useEffect(() => {
    if (!isLocationModalOpen) return;
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsLocationModalOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isLocationModalOpen]);

  // Close modal on Escape
  useEffect(() => {
    if (!isLocationModalOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsLocationModalOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isLocationModalOpen]);

  const handleLocationEdit = () => {
    setIsLocationModalOpen(true);
  };

  const applyLocation = (location) => {
    setCurrentLocation(location);
    onLocationChange?.(location);
  };

  const handleLocationSave = () => {
    if (searchQuery.trim()) {
      applyLocation(searchQuery.trim());
    }
    setSearchQuery('');
    setIsLocationModalOpen(false);
  };

  const handleLocationCancel = () => {
    setSearchQuery('');
    setIsLocationModalOpen(false);
  };

  const detectCurrentLocation = () => {
    setCurrentLocation('Detecting location...');
    setTimeout(() => {
      applyLocation('Borivali, Mumbai');
      setIsLocationModalOpen(false);
    }, 2000);
  };

  const handleSearchClick = () => {
    // Navigate to deals page with search focus
    navigate('/deals');
    // You could also implement a global search modal here
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <>
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Location Section */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Icon name="MapPin" size={18} className="text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <button
                  onClick={handleLocationEdit}
                  className="flex items-center space-x-1 text-left hover:bg-muted rounded-md px-2 py-1 transition-colors duration-200 w-full"
                  aria-label="Edit delivery location"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Delivering to</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {currentLocation}
                    </p>
                  </div>
                  <Icon name="ChevronDown" size={14} className="text-muted-foreground flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-3 ml-4">
              {/* Search Button */}
              <Button variant="ghost" size="sm" className="p-2" onClick={handleSearchClick}>
                <Icon name="Search" size={18} />
              </Button>

              {/* Cart Button */}
              <Button variant="ghost" size="sm" className="relative p-2" onClick={handleCartClick}>
                <Icon name="ShoppingCart" size={18} />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4" aria-modal="true" role="dialog">
          <div ref={modalRef} className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Select Location</h3>
                <Button variant="ghost" size="sm" onClick={handleLocationCancel} className="p-1" aria-label="Close location modal">
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Current Location Button */}
              <Button
                variant="outline"
                onClick={detectCurrentLocation}
                className="w-full justify-start mb-4"
                disabled={currentLocation === 'Detecting location...'}
              >
                <Icon name="Navigation" size={18} className="mr-2" />
                <span>Use Current Location</span>
                {currentLocation === 'Detecting location...' && (
                  <Icon name="Loader2" size={16} className="ml-auto animate-spin" />
                )}
              </Button>

              {/* Search Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Search for area, street name...
                  </label>
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter your location"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                      onKeyDown={(e) => e.key === 'Enter' && handleLocationSave()}
                      aria-label="Location search input"
                    />
                  </div>
                </div>

                {/* Popular Locations */}
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-2">Popular Locations</p>
                  <div className="space-y-2">
                    {['Dadar West, Mumbai', 'Bandra Station, Mumbai', 'Andheri East, Mumbai', 'Borivali, Mumbai'].map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          applyLocation(location);
                          setIsLocationModalOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center space-x-2 w-full p-2 text-left hover:bg-muted rounded-md transition-colors duration-200"
                        aria-label={`Select ${location}`}
                      >
                        <Icon name="MapPin" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-card-foreground">{location}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={handleLocationCancel} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleLocationSave} 
                  className="flex-1"
                  disabled={!searchQuery.trim()}
                >
                  Save Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationHeader;