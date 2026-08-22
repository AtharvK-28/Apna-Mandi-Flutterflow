import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const SupplierMapView = ({ suppliers, userLocation, className = '' }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Mock map initialization - in real implementation, use Leaflet.js
    if (mapRef.current) {
      // This would be replaced with actual Leaflet map initialization
    }
  }, [suppliers]);

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
          <Icon name="Map" size={20} className="text-primary" />
          <span>Supplier Locations</span>
        </h3>
      </div>

      {/* Mock Map Container */}
      <div className="relative h-64 bg-muted">
        <div 
          ref={mapRef}
          className="w-full h-full flex items-center justify-center"
        >
          {/* Mock Google Maps iframe */}
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Supplier Locations"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=14&output=embed`}
            className="border-0"
          />
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-sm hover:bg-muted transition-colors duration-200">
            <Icon name="Plus" size={16} />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-sm hover:bg-muted transition-colors duration-200">
            <Icon name="Minus" size={16} />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-sm hover:bg-muted transition-colors duration-200">
            <Icon name="Navigation" size={16} />
          </button>
        </div>
      </div>

      {/* Supplier Legend */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Suppliers in your cart</h4>
        <div className="space-y-2">
          {suppliers.map((supplier, index) => (
            <div key={supplier.id} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{supplier.name}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={10} />
                    <span>{supplier.distance}km away</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={10} />
                    <span>{supplier.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierMapView;