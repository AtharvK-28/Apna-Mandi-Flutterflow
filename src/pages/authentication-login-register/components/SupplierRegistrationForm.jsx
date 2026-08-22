import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SupplierRegistrationForm = ({ formData, onChange, errors }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const labels = {
    en: {
      businessName: "Business Name",
      businessNamePlaceholder: "e.g., Fresh Produce Co.",
      ownerName: "Owner Name",
      ownerNamePlaceholder: "Enter owner\'s full name",
      businessAddress: "Business Address",
      businessAddressPlaceholder: "Complete business address",
      fssaiLicense: "FSSAI License Number",
      fssaiPlaceholder: "Enter 14-digit FSSAI license",
      businessType: "Business Type",
      deliveryRadius: "Delivery Radius",
      specialization: "Product Specialization"
    },
    hi: {
      businessName: "व्यापार का नाम",
      businessNamePlaceholder: "जैसे, फ्रेश प्रोड्यूस कंपनी",
      ownerName: "मालिक का नाम",
      ownerNamePlaceholder: "मालिक का पूरा नाम दर्ज करें",
      businessAddress: "व्यापार का पता",
      businessAddressPlaceholder: "पूरा व्यापारिक पता",
      fssaiLicense: "FSSAI लाइसेंस नंबर",
      fssaiPlaceholder: "14 अंकों का FSSAI लाइसेंस दर्ज करें",
      businessType: "व्यापार का प्रकार",
      deliveryRadius: "डिलीवरी रेंज",
      specialization: "उत्पाद विशेषज्ञता"
    }
  };

  const businessTypeOptions = [
    { value: 'wholesaler', label: currentLanguage === 'en' ? 'Wholesaler' : 'थोक विक्रेता' },
    { value: 'distributor', label: currentLanguage === 'en' ? 'Distributor' : 'वितरक' },
    { value: 'farmer', label: currentLanguage === 'en' ? 'Farmer/Producer' : 'किसान/उत्पादक' },
    { value: 'retailer', label: currentLanguage === 'en' ? 'Retailer' : 'खुदरा विक्रेता' }
  ];

  const deliveryRadiusOptions = [
    { value: '2km', label: currentLanguage === 'en' ? 'Within 2 km' : '2 किमी के भीतर' },
    { value: '5km', label: currentLanguage === 'en' ? 'Within 5 km' : '5 किमी के भीतर' },
    { value: '10km', label: currentLanguage === 'en' ? 'Within 10 km' : '10 किमी के भीतर' },
    { value: 'city', label: currentLanguage === 'en' ? 'Entire City' : 'पूरा शहर' }
  ];

  const specializationOptions = [
    { value: 'vegetables', label: currentLanguage === 'en' ? 'Fresh Vegetables' : 'ताजी सब्जियां' },
    { value: 'fruits', label: currentLanguage === 'en' ? 'Fresh Fruits' : 'ताजे फल' },
    { value: 'dairy', label: currentLanguage === 'en' ? 'Dairy Products' : 'डेयरी उत्पाद' },
    { value: 'spices', label: currentLanguage === 'en' ? 'Spices & Condiments' : 'मसाले और चटनी' },
    { value: 'grains', label: currentLanguage === 'en' ? 'Grains & Pulses' : 'अनाज और दालें' },
    { value: 'oils', label: currentLanguage === 'en' ? 'Cooking Oils' : 'खाना पकाने का तेल' },
    { value: 'packaged', label: currentLanguage === 'en' ? 'Packaged Foods' : 'पैकेज्ड फूड' }
  ];

  const handleInputChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const handleFSSAIChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 14);
    handleInputChange('fssaiLicense', value);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Truck" size={32} color="white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {currentLanguage === 'en' ? 'Supplier Registration' : 'आपूर्तिकर्ता पंजीकरण'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {currentLanguage === 'en' ?'Tell us about your business' :'अपने व्यापार के बारे में बताएं'
          }
        </p>
      </div>

      <Input
        label={labels[currentLanguage].businessName}
        type="text"
        placeholder={labels[currentLanguage].businessNamePlaceholder}
        value={formData.businessName || ''}
        onChange={(e) => handleInputChange('businessName', e.target.value)}
        error={errors.businessName}
        required
      />

      <Input
        label={labels[currentLanguage].ownerName}
        type="text"
        placeholder={labels[currentLanguage].ownerNamePlaceholder}
        value={formData.ownerName || ''}
        onChange={(e) => handleInputChange('ownerName', e.target.value)}
        error={errors.ownerName}
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {labels[currentLanguage].businessAddress} *
        </label>
        <textarea
          placeholder={labels[currentLanguage].businessAddressPlaceholder}
          value={formData.businessAddress || ''}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground resize-none ${
            errors.businessAddress ? 'border-error' : 'border-border'
          }`}
          rows={3}
        />
        {errors.businessAddress && (
          <p className="text-xs text-error flex items-center space-x-1 mt-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.businessAddress}</span>
          </p>
        )}
      </div>

      <Select
        label={labels[currentLanguage].businessType}
        options={businessTypeOptions}
        value={formData.businessType || ''}
        onChange={(value) => handleInputChange('businessType', value)}
        placeholder={currentLanguage === 'en' ? 'Select business type' : 'व्यापार का प्रकार चुनें'}
        error={errors.businessType}
        required
      />

      <Select
        label={labels[currentLanguage].deliveryRadius}
        options={deliveryRadiusOptions}
        value={formData.deliveryRadius || ''}
        onChange={(value) => handleInputChange('deliveryRadius', value)}
        placeholder={currentLanguage === 'en' ? 'Select delivery radius' : 'डिलीवरी रेंज चुनें'}
        error={errors.deliveryRadius}
        required
      />

      <Select
        label={labels[currentLanguage].specialization}
        options={specializationOptions}
        // A multi-select holds a list. Seeding it with '' made React reject the
        // value and left the field in an inconsistent state.
        value={formData.specialization || []}
        onChange={(value) => handleInputChange('specialization', value)}
        placeholder={currentLanguage === 'en' ? 'Select specialization' : 'विशेषज्ञता चुनें'}
        error={errors.specialization}
        multiple
        searchable
        description={currentLanguage === 'en' ?'You can select multiple categories' :'आप कई श्रेणियां चुन सकते हैं'
        }
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {labels[currentLanguage].fssaiLicense} *
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={labels[currentLanguage].fssaiPlaceholder}
            value={formData.fssaiLicense || ''}
            onChange={handleFSSAIChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground ${
              errors.fssaiLicense ? 'border-error' : 'border-border'
            }`}
            maxLength={14}
          />
          {formData.fssaiLicense && formData.fssaiLicense.length === 14 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {currentLanguage === 'en' ?'Required for food safety compliance' :'खाद्य सुरक्षा अनुपालन के लिए आवश्यक'
          }
        </p>
        {errors.fssaiLicense && (
          <p className="text-xs text-error flex items-center space-x-1 mt-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.fssaiLicense}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SupplierRegistrationForm;