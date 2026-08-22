import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VendorRegistrationForm = ({ formData, onChange, errors }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const labels = {
    en: {
      stallName: "Stall Name",
      stallNamePlaceholder: "e.g., Sharma's Chaat Corner",
      location: "Stall Location",
      locationPlaceholder: "e.g., Sector 14 Market, Gurgaon",
      keyIngredients: "Key Ingredients You Use",
      keyIngredientsPlaceholder: "e.g., Tomatoes, Onions, Spices",
      foodType: "Type of Food",
      operatingHours: "Operating Hours",
      description: "Brief Description"
    },
    hi: {
      stallName: "स्टॉल का नाम",
      stallNamePlaceholder: "जैसे, शर्मा चाट कॉर्नर",
      location: "स्टॉल का स्थान",
      locationPlaceholder: "जैसे, सेक्टर 14 मार्केट, गुड़गांव",
      keyIngredients: "मुख्य सामग्री जो आप उपयोग करते हैं",
      keyIngredientsPlaceholder: "जैसे, टमाटर, प्याज, मसाले",
      foodType: "भोजन का प्रकार",
      operatingHours: "संचालन समय",
      description: "संक्षिप्त विवरण"
    }
  };

  const foodTypeOptions = [
    { value: 'chaat', label: currentLanguage === 'en' ? 'Chaat & Snacks' : 'चाट और स्नैक्स' },
    { value: 'street_food', label: currentLanguage === 'en' ? 'Street Food' : 'स्ट्रीट फूड' },
    { value: 'beverages', label: currentLanguage === 'en' ? 'Beverages' : 'पेय पदार्थ' },
    { value: 'sweets', label: currentLanguage === 'en' ? 'Sweets & Desserts' : 'मिठाई और डेसर्ट' },
    { value: 'fast_food', label: currentLanguage === 'en' ? 'Fast Food' : 'फास्ट फूड' },
    { value: 'regional', label: currentLanguage === 'en' ? 'Regional Cuisine' : 'क्षेत्रीय व्यंजन' }
  ];

  const operatingHoursOptions = [
    { value: 'morning', label: currentLanguage === 'en' ? 'Morning (6 AM - 12 PM)' : 'सुबह (6 AM - 12 PM)' },
    { value: 'afternoon', label: currentLanguage === 'en' ? 'Afternoon (12 PM - 6 PM)' : 'दोपहर (12 PM - 6 PM)' },
    { value: 'evening', label: currentLanguage === 'en' ? 'Evening (6 PM - 12 AM)' : 'शाम (6 PM - 12 AM)' },
    { value: 'all_day', label: currentLanguage === 'en' ? 'All Day' : 'पूरा दिन' },
    { value: 'custom', label: currentLanguage === 'en' ? 'Custom Hours' : 'कस्टम समय' }
  ];

  const handleInputChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-terracotta rounded-xl flex items-center justify-center mx-auto mb-3">
          <Icon name="Store" size={32} color="white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {currentLanguage === 'en' ? 'Vendor Registration' : 'विक्रेता पंजीकरण'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {currentLanguage === 'en' ?'Tell us about your food stall' :'अपने फूड स्टॉल के बारे में बताएं'
          }
        </p>
      </div>

      <Input
        label={labels[currentLanguage].stallName}
        type="text"
        placeholder={labels[currentLanguage].stallNamePlaceholder}
        value={formData.stallName || ''}
        onChange={(e) => handleInputChange('stallName', e.target.value)}
        error={errors.stallName}
        required
      />

      <Input
        label={labels[currentLanguage].location}
        type="text"
        placeholder={labels[currentLanguage].locationPlaceholder}
        value={formData.location || ''}
        onChange={(e) => handleInputChange('location', e.target.value)}
        error={errors.location}
        required
      />

      <Select
        label={labels[currentLanguage].foodType}
        options={foodTypeOptions}
        value={formData.foodType || ''}
        onChange={(value) => handleInputChange('foodType', value)}
        placeholder={currentLanguage === 'en' ? 'Select food type' : 'भोजन का प्रकार चुनें'}
        error={errors.foodType}
        required
      />

      <Select
        label={labels[currentLanguage].operatingHours}
        options={operatingHoursOptions}
        value={formData.operatingHours || ''}
        onChange={(value) => handleInputChange('operatingHours', value)}
        placeholder={currentLanguage === 'en' ? 'Select operating hours' : 'संचालन समय चुनें'}
        error={errors.operatingHours}
        required
      />

      <Input
        label={labels[currentLanguage].keyIngredients}
        type="text"
        placeholder={labels[currentLanguage].keyIngredientsPlaceholder}
        value={formData.keyIngredients || ''}
        onChange={(e) => handleInputChange('keyIngredients', e.target.value)}
        error={errors.keyIngredients}
        description={currentLanguage === 'en' ?'Separate multiple ingredients with commas' :'कई सामग्री को कॉमा से अलग करें'
        }
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {labels[currentLanguage].description}
        </label>
        <textarea
          placeholder={currentLanguage === 'en' ?'Tell customers about your specialties...' :'ग्राहकों को अपनी विशेषताओं के बारे में बताएं...'
          }
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground resize-none"
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-error flex items-center space-x-1 mt-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.description}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorRegistrationForm;