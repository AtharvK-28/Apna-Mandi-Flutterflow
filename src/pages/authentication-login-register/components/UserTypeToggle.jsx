import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const UserTypeToggle = ({ selectedType, onTypeChange }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const userTypes = {
    en: {
      vendor: {
        label: "Vendor",
        description: "Street food stall owner",
        icon: "Store"
      },
      karigar: {
        label: "Karigar",
        description: "Skilled kitchen worker",
        icon: "Wrench"
      },
      supplier: {
        label: "Supplier",
        description: "Raw material supplier",
        icon: "Truck"
      }
    },
    hi: {
      vendor: {
        label: "विक्रेता",
        description: "स्ट्रीट फूड स्टॉल मालिक",
        icon: "Store"
      },
      karigar: {
        label: "कारीगर",
        description: "कुशल रसोई कर्मचारी",
        icon: "Wrench"
      },
      supplier: {
        label: "आपूर्तिकर्ता",
        description: "कच्चे माल की आपूर्ति",
        icon: "Truck"
      }
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-ink text-center">
        {currentLanguage === 'en' ? 'I am a' : 'मैं हूँ'}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(userTypes[currentLanguage]).map(([type, config]) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedType === type
                ? 'border-terracotta bg-terracotta/5 text-terracotta' : 'border-paper-dark bg-paper-light text-ink-medium hover:border-terracotta/50 hover:text-ink'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedType === type ? 'bg-terracotta text-white' : 'bg-paper'
              }`}>
                <Icon name={config.icon} size={24} />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{config.label}</p>
                <p className="text-xs opacity-80">{config.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTypeToggle;