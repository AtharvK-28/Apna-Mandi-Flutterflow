import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../contexts/ToastContext';

const DeliveryRouteMap = ({ routes, selectedRoute, onRouteSelect, onOptimizeRoute }) => {
  const toast = useToast();
  const [mapCenter, setMapCenter] = useState({ lat: 19.0170, lng: 72.8478 }); // Dadar, Mumbai
  const [isOptimizing, setIsOptimizing] = useState(false);

  const routeColors = {
    'Dadar Morning Run': '#6E9150',
    'Bandra Loop': '#C0532E', 
    'Route C': '#F4A261',
    'Route D': '#059669'
  };

  const handleOptimizeRoute = async (route) => {
    setIsOptimizing(true);
    // Mock optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      onOptimizeRoute(route);
    }, 2000);
  };

  const handleLiveTracking = () => {
    toast.info('Live tracking opens once a driver starts the route.');
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Delivery Routes</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleLiveTracking}>
              <Icon name="Navigation" size={16} className="mr-2" />
              Live Tracking
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => selectedRoute && handleOptimizeRoute(selectedRoute)}
              disabled={!selectedRoute || isOptimizing}
            >
              {isOptimizing ? (
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              ) : (
                <Icon name="Zap" size={16} className="mr-2" />
              )}
              Optimize
            </Button>
          </div>
        </div>
      </div>

      {/* Route Selection */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => onRouteSelect(route)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRoute?.id === route.id
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-64 bg-muted">
        {/* Mock Map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Map" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Interactive Map View</p>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedRoute ? `Showing ${selectedRoute.name}` : 'Select a route to view'}
            </p>
          </div>
        </div>

        {/* Route Markers */}
        {selectedRoute && (
          <div className="absolute inset-0 pointer-events-none">
            {selectedRoute.stops.map((stop, index) => (
              <div
                key={stop.id}
                className="absolute"
                style={{
                  left: `${20 + (index % 3) * 25}%`,
                  top: `${30 + (index % 2) * 40}%`
                }}
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-elevation-1 flex items-center justify-center bg-primary">
                    <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap shadow-elevation-1">
                    {stop.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Route Control Buttons */}
        {selectedRoute && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button variant="outline" size="sm" className="bg-card shadow-md">
              <Icon name="Play" size={14} />
            </Button>
            <Button variant="outline" size="sm" className="bg-card shadow-md">
              <Icon name="Pause" size={14} />
            </Button>
            <Button variant="outline" size="sm" className="bg-card shadow-md">
              <Icon name="RotateCcw" size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Route Details */}
      {selectedRoute && (
        <div className="p-4 bg-muted/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Distance</p>
              <p className="font-medium">{selectedRoute.totalDistance}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimated Time</p>
              <p className="font-medium">{selectedRoute.estimatedTime}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stops</p>
              <p className="font-medium">{selectedRoute.stops.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                selectedRoute.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              }`}>
                {selectedRoute.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryRouteMap;