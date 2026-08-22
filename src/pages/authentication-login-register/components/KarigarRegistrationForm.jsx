import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const KarigarRegistrationForm = ({ formData, onChange, errors }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const labels = {
    en: {
      fullName: "Full Name",
      fullNamePlaceholder: "e.g., Amit Kumar",
      location: "Your Area",
      locationPlaceholder: "e.g., Dadar Station West",
      skills: "Your Skills",
      skillsPlaceholder: "e.g., Dosa Making, Vegetable Chopping, Wok Cooking",
      experience: "Years of Experience",
      availability: "Availability",
      hourlyRate: "Expected Rate (₹/hr)",
      hourlyRatePlaceholder: "e.g., 200",
      bio: "About You"
    },
    hi: {
      fullName: "पूरा नाम",
      fullNamePlaceholder: "जैसे, अमित कुमार",
      location: "आपका क्षेत्र",
      locationPlaceholder: "जैसे, दादर स्टेशन वेस्ट",
      skills: "आपके कौशल",
      skillsPlaceholder: "जैसे, डोसा बनाना, सब्जी काटना, वोक कुकिंग",
      experience: "अनुभव के वर्ष",
      availability: "उपलब्धता",
      hourlyRate: "अपेक्षित दर (₹/घंटा)",
      hourlyRatePlaceholder: "जैसे, 200",
      bio: "अपने बारे में बताएं"
    }
  };

  const availabilityOptions = [
    { value: 'flexible', label: currentLanguage === 'en' ? 'Flexible' : 'लचीला' },
    { value: 'morning', label: currentLanguage === 'en' ? 'Morning Only' : 'केवल सुबह' },
    { value: 'evening', label: currentLanguage === 'en' ? 'Evening Only' : 'केवल शाम' },
    { value: 'all_day', label: currentLanguage === 'en' ? 'All Day' : 'पूरा दिन' },
  ];

  const experienceOptions = [
    { value: '0-1', label: currentLanguage === 'en' ? 'Less than 1 year' : '1 साल से कम' },
    { value: '1-3', label: currentLanguage === 'en' ? '1-3 years' : '1-3 साल' },
    { value: '3-5', label: currentLanguage === 'en' ? '3-5 years' : '3-5 साल' },
    { value: '5-10', label: currentLanguage === 'en' ? '5-10 years' : '5-10 साल' },
    { value: '10+', label: currentLanguage === 'en' ? '10+ years' : '10+ साल' },
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-terracotta rounded-xl flex items-center justify-center mx-auto mb-3">
          <Icon name="Wrench" size={32} color="white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {currentLanguage === 'en' ? 'Karigar Registration' : 'कारीगर पंजीकरण'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {currentLanguage === 'en' ? 'Tell us about your kitchen skills' : 'अपने रसोई कौशल के बारे में बताएं'}
        </p>
      </div>

      <Input
        label={labels[currentLanguage].fullName}
        type="text"
        placeholder={labels[currentLanguage].fullNamePlaceholder}
        value={formData.fullName || ''}
        onChange={(e) => handleInputChange('fullName', e.target.value)}
        error={errors.fullName}
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

      <Input
        label={labels[currentLanguage].skills}
        type="text"
        placeholder={labels[currentLanguage].skillsPlaceholder}
        value={formData.skills || ''}
        onChange={(e) => handleInputChange('skills', e.target.value)}
        error={errors.skills}
        description={currentLanguage === 'en' ? 'Separate multiple skills with commas' : 'कई कौशल को कॉमा से अलग करें'}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label={labels[currentLanguage].experience}
          options={experienceOptions}
          value={formData.experience || ''}
          onChange={(value) => handleInputChange('experience', value)}
          placeholder={currentLanguage === 'en' ? 'Select' : 'चुनें'}
          error={errors.experience}
          required
        />

        <Select
          label={labels[currentLanguage].availability}
          options={availabilityOptions}
          value={formData.availability || ''}
          onChange={(value) => handleInputChange('availability', value)}
          placeholder={currentLanguage === 'en' ? 'Select' : 'चुनें'}
          error={errors.availability}
          required
        />
      </div>

      <Input
        label={labels[currentLanguage].hourlyRate}
        type="number"
        placeholder={labels[currentLanguage].hourlyRatePlaceholder}
        value={formData.hourlyRate || ''}
        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
        error={errors.hourlyRate}
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {labels[currentLanguage].bio}
        </label>
        <textarea
          placeholder={currentLanguage === 'en' ? 'Tell vendors about your experience and specialties...' : 'विक्रेताओं को अपने अनुभव और विशेषताओं के बारे में बताएं...'}
          value={formData.bio || ''}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground resize-none"
          rows={3}
        />
        {errors.bio && (
          <p className="text-xs text-error flex items-center space-x-1 mt-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.bio}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default KarigarRegistrationForm;
