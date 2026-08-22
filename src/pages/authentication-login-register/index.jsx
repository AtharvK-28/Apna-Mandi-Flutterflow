import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LanguageToggle from './components/LanguageToggle';
import PhoneNumberInput from './components/PhoneNumberInput';
import OTPInput from './components/OTPInput';
import UserTypeToggle from './components/UserTypeToggle';
import VendorRegistrationForm from './components/VendorRegistrationForm';
import SupplierRegistrationForm from './components/SupplierRegistrationForm';
import KarigarRegistrationForm from './components/KarigarRegistrationForm';
import SecurityBadges from './components/SecurityBadges';
import PrivacyMessage from './components/PrivacyMessage';
import { GUEST_HOME } from '../../config/roles';
import { useAuth } from '../../contexts/AuthContext';

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const { knownProfile, signIn, continueAsGuest } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [step, setStep] = useState('phone'); // phone, otp, registration
  const [userType, setUserType] = useState('vendor');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const [registrationData, setRegistrationData] = useState({});

  // Mock credentials for demonstration
  const mockCredentials = {
    vendor: {
      phone: '9876543210',
      otp: '123456'
    },
    karigar: {
      phone: '9876543212',
      otp: '111111'
    },
    supplier: {
      phone: '9876543211',
      otp: '654321'
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const labels = {
    en: {
      title: "Welcome to Apna Mandi",
      subtitle: "India's street food OS — help, supplies & legacy in one place",
      sendOTP: "Send OTP",
      verifyLogin: "Verify & Login",
      completeRegistration: "Complete Registration",
      resendOTP: "Resend OTP",
      backToPhone: "Back to Phone",
      backToOTP: "Back to OTP",
      stepPhone: "Phone",
      stepOtp: "OTP",
      stepDetails: "Details",
      demoTitle: "Trying the demo?",
      demoHint: "One tap fills the demo number for you.",
      demoOtpHint: "Demo OTP",
      autofill: "Autofill",
      guest: "Continue as Guest",
      guestHint: "Explore the app without creating an account",
      or: "or"
    },
    hi: {
      title: "अपना मंडी में आपका स्वागत है",
      subtitle: "भारत का स्ट्रीट फूड OS — मदद, सामान और विरासत एक जगह",
      sendOTP: "OTP भेजें",
      verifyLogin: "सत्यापित करें और लॉगिन करें",
      completeRegistration: "पंजीकरण पूरा करें",
      resendOTP: "OTP दोबारा भेजें",
      backToPhone: "फोन पर वापस जाएं",
      backToOTP: "OTP पर वापस जाएं",
      stepPhone: "फोन",
      stepOtp: "OTP",
      stepDetails: "विवरण",
      demoTitle: "डेमो आज़मा रहे हैं?",
      demoHint: "एक टैप में डेमो नंबर भर जाएगा।",
      demoOtpHint: "डेमो OTP",
      autofill: "भरें",
      guest: "अतिथि के रूप में जारी रखें",
      guestHint: "बिना खाता बनाए ऐप का अन्वेषण करें",
      or: "या"
    }
  };

  const demoTypes = {
    en: [
      { type: 'vendor', label: 'Vendor', icon: 'Store' },
      { type: 'karigar', label: 'Karigar', icon: 'Wrench' },
      { type: 'supplier', label: 'Supplier', icon: 'Truck' },
    ],
    hi: [
      { type: 'vendor', label: 'विक्रेता', icon: 'Store' },
      { type: 'karigar', label: 'कारीगर', icon: 'Wrench' },
      { type: 'supplier', label: 'आपूर्तिकर्ता', icon: 'Truck' },
    ]
  };

  const validatePhone = () => {
    const newErrors = {};

    if (!phoneNumber) {
      newErrors.phone = currentLanguage === 'en' ?'Phone number is required' :'फोन नंबर आवश्यक है';
    } else if (phoneNumber.length !== 10) {
      newErrors.phone = currentLanguage === 'en' ?'Phone number must be 10 digits' :'फोन नंबर 10 अंकों का होना चाहिए';
    } else if (phoneNumber !== mockCredentials[userType].phone) {
      newErrors.phone = currentLanguage === 'en'
        ? `For demo, use ${mockCredentials[userType].phone}`
        : `डेमो के लिए ${mockCredentials[userType].phone} का उपयोग करें`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = currentLanguage === 'en' ?'OTP is required' :'OTP आवश्यक है';
    } else if (otp.length !== 6) {
      newErrors.otp = currentLanguage === 'en' ?'OTP must be 6 digits' :'OTP 6 अंकों का होना चाहिए';
    } else if (otp !== mockCredentials[userType].otp) {
      newErrors.otp = currentLanguage === 'en'
        ? `For demo, use ${mockCredentials[userType].otp}`
        : `डेमो के लिए ${mockCredentials[userType].otp} का उपयोग करें`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegistration = () => {
    const newErrors = {};

    if (userType === 'vendor') {
      if (!registrationData.stallName) {
        newErrors.stallName = currentLanguage === 'en' ?'Stall name is required' :'स्टॉल का नाम आवश्यक है';
      }
      if (!registrationData.location) {
        newErrors.location = currentLanguage === 'en' ?'Location is required' :'स्थान आवश्यक है';
      }
      if (!registrationData.foodType) {
        newErrors.foodType = currentLanguage === 'en' ?'Food type is required' :'भोजन का प्रकार आवश्यक है';
      }
      if (!registrationData.keyIngredients) {
        newErrors.keyIngredients = currentLanguage === 'en' ?'Key ingredients are required' :'मुख्य सामग्री आवश्यक है';
      }
      if (!registrationData.operatingHours) {
        newErrors.operatingHours = currentLanguage === 'en' ?'Operating hours are required' :'संचालन समय आवश्यक है';
      }
    } else if (userType === 'karigar') {
      if (!registrationData.fullName) {
        newErrors.fullName = currentLanguage === 'en' ? 'Full name is required' : 'पूरा नाम आवश्यक है';
      }
      if (!registrationData.location) {
        newErrors.location = currentLanguage === 'en' ? 'Location is required' : 'स्थान आवश्यक है';
      }
      if (!registrationData.skills) {
        newErrors.skills = currentLanguage === 'en' ? 'Skills are required' : 'कौशल आवश्यक हैं';
      }
      if (!registrationData.experience) {
        newErrors.experience = currentLanguage === 'en' ? 'Experience is required' : 'अनुभव आवश्यक है';
      }
      if (!registrationData.availability) {
        newErrors.availability = currentLanguage === 'en' ? 'Availability is required' : 'उपलब्धता आवश्यक है';
      }
      if (!registrationData.hourlyRate) {
        newErrors.hourlyRate = currentLanguage === 'en' ? 'Hourly rate is required' : 'प्रति घंटा दर आवश्यक है';
      }
    } else {
      if (!registrationData.businessName) {
        newErrors.businessName = currentLanguage === 'en' ?'Business name is required' :'व्यापार का नाम आवश्यक है';
      }
      if (!registrationData.ownerName) {
        newErrors.ownerName = currentLanguage === 'en' ?'Owner name is required' :'मालिक का नाम आवश्यक है';
      }
      if (!registrationData.businessAddress) {
        newErrors.businessAddress = currentLanguage === 'en' ?'Business address is required' :'व्यापार का पता आवश्यक है';
      }
      if (!registrationData.businessType) {
        newErrors.businessType = currentLanguage === 'en' ?'Business type is required' :'व्यापार का प्रकार आवश्यक है';
      }
      if (!registrationData.fssaiLicense) {
        newErrors.fssaiLicense = currentLanguage === 'en' ?'FSSAI license is required' :'FSSAI लाइसेंस आवश्यक है';
      } else if (registrationData.fssaiLicense.length !== 14) {
        newErrors.fssaiLicense = currentLanguage === 'en' ?'FSSAI license must be 14 digits' :'FSSAI लाइसेंस 14 अंकों का होना चाहिए';
      }
      // Specialization is a multi-select, so an empty array must fail here —
      // `!registrationData.specialization` passed for `[]`, letting a supplier
      // register with no categories at all.
      if (!registrationData.specialization?.length) {
        newErrors.specialization = currentLanguage === 'en' ?'Select at least one specialization' :'कम से कम एक विशेषज्ञता चुनें';
      }
      if (!registrationData.deliveryRadius) {
        newErrors.deliveryRadius = currentLanguage === 'en' ?'Delivery radius is required' :'डिलीवरी रेंज आवश्यक है';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validatePhone()) return;

    setIsLoading(true);
    setErrors({});

    // Mock API call
    setTimeout(() => {
      setStep('otp');
      setResendTimer(60);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;

    setIsLoading(true);
    setErrors({});

    // Mock API call
    setTimeout(() => {
      // Returning user with a completed registration — log straight in rather
      // than making them fill the form again.
      if (
        knownProfile &&
        knownProfile.phone === phoneNumber &&
        knownProfile.role === userType
      ) {
        navigate(signIn(userType, knownProfile), { replace: true });
        return;
      }
      setStep('registration');
      setIsLoading(false);
    }, 1500);
  };

  const handleCompleteRegistration = async () => {
    if (!validateRegistration()) return;

    setIsLoading(true);
    setErrors({});

    // Mock API call
    setTimeout(() => {
      // signIn persists the session and returns the landing route for the role,
      // so there is one place that decides where each user type starts.
      const destination = signIn(userType, { phone: phoneNumber, ...registrationData });
      navigate(destination, { replace: true });
      setIsLoading(false);
    }, 2000);
  };

  const handleResendOTP = () => {
    setResendTimer(60);
    // Mock resend API call
    setTimeout(() => {
      // Show success message
    }, 1000);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setPhoneNumber('');
    setOTP('');
    setErrors({});
    setRegistrationData({});
  };

  // One-tap demo: select the user type and fill its demo phone number
  const handleDemoFill = (type) => {
    setUserType(type);
    setPhoneNumber(mockCredentials[type].phone);
    setOTP('');
    setErrors({});
    setRegistrationData({});
  };

  const getButtonText = () => {
    if (step === 'phone') return labels[currentLanguage].sendOTP;
    if (step === 'otp') return labels[currentLanguage].verifyLogin;
    return labels[currentLanguage].completeRegistration;
  };

  const getButtonAction = () => {
    if (step === 'phone') return handleSendOTP;
    if (step === 'otp') return handleVerifyOTP;
    return handleCompleteRegistration;
  };

  const canProceed = () => {
    if (step === 'phone') return phoneNumber.length === 10;
    if (step === 'otp') return otp.length === 6;
    return true; // Registration validation happens on submit
  };

  const steps = [
    { id: 'phone', label: labels[currentLanguage].stepPhone },
    { id: 'otp', label: labels[currentLanguage].stepOtp },
    { id: 'registration', label: labels[currentLanguage].stepDetails },
  ];
  const stepIndex = steps.findIndex(s => s.id === step);

  const brandHighlights = currentLanguage === 'en'
    ? [
        { icon: 'Wrench', title: 'Karigar Connect', desc: 'Skilled kitchen help, on demand' },
        { icon: 'RefreshCw', title: 'Vendor Exchange', desc: 'Trade surplus with nearby stalls' },
        { icon: 'Crown', title: 'Virasaat', desc: 'License legendary recipes' },
      ]
    : [
        { icon: 'Wrench', title: 'कारीगर कनेक्ट', desc: 'कुशल रसोई मदद, तुरंत' },
        { icon: 'RefreshCw', title: 'विक्रेता एक्सचेंज', desc: 'आस-पास के स्टॉल से लेन-देन' },
        { icon: 'Crown', title: 'विरासत', desc: 'मशहूर रेसिपी लाइसेंस करें' },
      ];

  return (
    <div className="min-h-screen font-body lg:grid lg:grid-cols-[1.05fr_1fr]">

      {/* Brand panel (desktop) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        <img
          src="/assets/images/rekha_chaat.jpeg"
          alt="Street food vendor at work"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(200deg, rgba(28,20,13,.25) 0%, rgba(28,20,13,.55) 45%, rgba(84,28,12,.95) 100%)' }}
        />

        <div className="relative p-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white">
              <Icon name="Store" size={22} />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl text-white leading-none">Apna Mandi</span>
              <p className="text-white/70 text-xs mt-1 tracking-wide">अपना मंडी · Street Food OS</p>
            </div>
          </div>
        </div>

        <div className="relative p-10 text-white">
          <h2 className="font-display font-extrabold text-4xl xl:text-[44px] leading-[1.08] mb-3 [text-shadow:0_2px_16px_rgba(0,0,0,.4)]">
            {currentLanguage === 'en' ? (
              <>The street feeds the city.<br />We feed the street.</>
            ) : (
              <>गली शहर को खिलाती है।<br />हम गली को।</>
            )}
          </h2>
          <p className="text-white/80 text-base max-w-md mb-8">
            {labels[currentLanguage].subtitle}
          </p>
          <div className="space-y-3.5">
            {brandHighlights.map(item => (
              <div key={item.title} className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/12 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={18} />
                </div>
                <div>
                  <p className="font-display font-bold text-[15px] leading-tight">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Form column */}
      <main className="flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="h-[3px] bg-gradient-to-r from-terracotta via-turmeric to-leaf lg:hidden" />
        <header className="flex items-center justify-between px-5 sm:px-8 py-4">
          <div className="flex items-center gap-2.5 lg:invisible">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta to-chili flex items-center justify-center text-white shadow-[0_6px_14px_-6px_rgba(192,83,46,.8)]">
              <Icon name="Store" size={18} />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-ink leading-none">Apna Mandi</span>
              <p className="text-[10px] text-ink-medium leading-none mt-1 tracking-wide">अपना मंडी</p>
            </div>
          </div>
          <LanguageToggle
            value={currentLanguage}
            onChange={(language) => {
              setCurrentLanguage(language);
              localStorage.setItem('language', language);
            }}
          />
        </header>

        <div className="flex-1 w-full max-w-md mx-auto px-5 sm:px-4 pb-10">
          {/* Title */}
          <div className="mt-2 mb-6">
            <h1 className="font-display font-extrabold text-[26px] text-ink leading-tight mb-1.5">
              {labels[currentLanguage].title}
            </h1>
            <p className="text-ink-medium text-sm">
              {labels[currentLanguage].subtitle}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-5" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  i < stepIndex
                    ? 'bg-leaf-light text-leaf-dark'
                    : i === stepIndex
                      ? 'bg-terracotta text-white shadow-[0_6px_14px_-6px_rgba(192,83,46,.8)]'
                      : 'bg-paper-light border border-paper-dark text-ink-medium'
                }`}>
                  {i < stepIndex ? <Icon name="Check" size={12} /> : <span>{i + 1}</span>}
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px ${i < stepIndex ? 'bg-leaf' : 'bg-paper-dark'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form card */}
          <div className="card-warm p-6">
            {step === 'phone' && (
              <div className="space-y-6">
                <UserTypeToggle
                  selectedType={userType}
                  onTypeChange={handleUserTypeChange}
                />
                <PhoneNumberInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  error={errors.phone}
                  disabled={isLoading}
                />
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-ink-medium">
                    {currentLanguage === 'en'
                      ? `OTP sent to +91 ${phoneNumber}`
                      : `+91 ${phoneNumber} पर OTP भेजा गया`
                    }
                  </p>
                </div>
                <OTPInput
                  value={otp}
                  onChange={setOTP}
                  error={errors.otp}
                  disabled={isLoading}
                  onResend={handleResendOTP}
                  resendTimer={resendTimer}
                />
                {/* Demo OTP helper */}
                <div className="flex items-center justify-between gap-3 bg-turmeric-light/60 border border-turmeric/30 rounded-xl px-3.5 py-2.5">
                  <span className="text-xs font-semibold text-ink-light flex items-center gap-1.5">
                    <Icon name="Sparkles" size={13} className="text-turmeric-dark" />
                    {labels[currentLanguage].demoOtpHint}: <span className="font-mono font-bold text-ink tracking-widest">{mockCredentials[userType].otp}</span>
                  </span>
                  <button
                    onClick={() => { setOTP(mockCredentials[userType].otp); setErrors({}); }}
                    disabled={isLoading}
                    className="press text-xs font-bold text-terracotta-dark bg-paper-light border border-paper-dark px-3 py-1.5 rounded-lg hover:bg-paper transition-colors"
                  >
                    {labels[currentLanguage].autofill}
                  </button>
                </div>
              </div>
            )}

            {step === 'registration' && (
              <div className="space-y-6">
                {userType === 'vendor' ? (
                  <VendorRegistrationForm
                    formData={registrationData}
                    onChange={setRegistrationData}
                    errors={errors}
                  />
                ) : userType === 'karigar' ? (
                  <KarigarRegistrationForm
                    formData={registrationData}
                    onChange={setRegistrationData}
                    errors={errors}
                  />
                ) : (
                  <SupplierRegistrationForm
                    formData={registrationData}
                    onChange={setRegistrationData}
                    errors={errors}
                  />
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3 mt-6">
              <Button
                onClick={getButtonAction()}
                disabled={!canProceed() || isLoading}
                loading={isLoading}
                className="w-full"
                size="lg"
              >
                {getButtonText()}
              </Button>

              {step !== 'phone' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === 'otp') {
                      setStep('phone');
                      setOTP('');
                      setErrors({});
                    } else if (step === 'registration') {
                      setStep('otp');
                      setRegistrationData({});
                      setErrors({});
                    }
                  }}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  {step === 'otp' ? labels[currentLanguage].backToPhone : labels[currentLanguage].backToOTP}
                </Button>
              )}
            </div>
          </div>

          {/* One-tap demo accounts */}
          {step === 'phone' && (
            <div className="card-warm p-4 mt-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Sparkles" size={15} className="text-turmeric-dark" />
                <p className="text-sm font-bold text-ink">{labels[currentLanguage].demoTitle}</p>
              </div>
              <p className="text-xs text-ink-medium mb-3">{labels[currentLanguage].demoHint}</p>
              <div className="grid grid-cols-3 gap-2">
                {demoTypes[currentLanguage].map(demo => (
                  <button
                    key={demo.type}
                    onClick={() => handleDemoFill(demo.type)}
                    disabled={isLoading}
                    className={`press flex items-center justify-center gap-1.5 text-xs font-bold px-2 py-2.5 rounded-xl border transition-colors ${
                      userType === demo.type && phoneNumber === mockCredentials[demo.type].phone
                        ? 'bg-terracotta-light border-terracotta/40 text-terracotta-dark'
                        : 'bg-paper border-paper-dark text-ink-light hover:text-ink hover:bg-paper-dark/50'
                    }`}
                  >
                    <Icon name={demo.icon} size={14} />
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Continue as Guest */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-paper-dark"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-ink-medium">
                  {labels[currentLanguage].or}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // A guest is a real, limited state — not a signed-in vendor with
                // a placeholder name, which is what this button used to create.
                continueAsGuest();
                navigate(GUEST_HOME, { replace: true });
              }}
              className="mt-4 w-full"
              size="lg"
            >
              <Icon name="Eye" size={16} className="mr-2" />
              {labels[currentLanguage].guest}
            </Button>
            <p className="text-xs text-ink-medium mt-2 text-center">
              {labels[currentLanguage].guestHint}
            </p>
          </div>

          <SecurityBadges />
          <PrivacyMessage />
        </div>
      </main>
    </div>
  );
};

export default AuthenticationPage;
