import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import { useToast } from '../../contexts/ToastContext';
import { useCart } from '../../contexts/CartContext';
import FranchiseSection from './components/FranchiseSection';
import ProvenanceModal from './components/ProvenanceModal';

// ── Reusable Modal Wrapper ──────────────────────────────────────────────────
const ModalWrap = ({ children, onClose, title, wide }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`bg-card rounded-2xl shadow-2xl w-full ${wide ? 'max-w-4xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
        <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <Icon name="X" size={18} className="text-muted-foreground" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
      <Icon name={icon} size={28} className="text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-5 max-w-xs">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
      >
        <Icon name={action.icon} size={15} />
        <span>{action.label}</span>
      </button>
    )}
  </div>
);

// ── Category badge config ───────────────────────────────────────────────────
const categoryConfig = {
  chutneys:     { label: 'Chutney & Sauce', bg: 'bg-terracotta' },
  masalas:      { label: 'Masala & Spice',  bg: 'bg-chili'    },
  concentrates: { label: 'Concentrate',     bg: 'bg-leaf-dark'   },
  doughs:       { label: 'Dough & Batter',  bg: 'bg-turmeric-dark' },
};

// ══════════════════════════════════════════════════════════════════════════════
const Virasaat = () => {
  const { cartCount } = useCart();
  const toast = useToast();
  const [activeTab, setActiveTab]                     = useState('browse');
  const [showLicensorModal, setShowLicensorModal]     = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [selectedLegacy, setSelectedLegacy]           = useState(null);
  const [filterType, setFilterType]                   = useState('all');
  const [searchQuery, setSearchQuery]                 = useState('');
  const [showDetailsModal, setShowDetailsModal]       = useState(false);
  const [selectedStory, setSelectedStory]             = useState(null);
  const [showStoryModal, setShowStoryModal]           = useState(false);
  const [provenanceLegacy, setProvenanceLegacy]       = useState(null);

  // ── Static data ────────────────────────────────────────────────────────────
  const successStories = [
    {
      id: 1, vendor: "Rekha Bhen", title: "The Chaat Queen of Surat",
      location: "Surat, Gujarat",
      story: "Rekha was famous in her Surat neighborhood for her fiery imli masala used in her tangy chaat. But her street cart had limited reach. After joining Virasaat, her signature imli masala got listed online with beautiful packaging and storytelling. Within 6 months, she started shipping across Gujarat and even got featured in a local food vlog. Her son now manages logistics while she experiments with new spice blends.",
      topSeller: "Rekha's Khatta-Meetha Imli Masala", earnings: "10x increase in revenue",
      subscribers: 156, image: "/assets/images/rekha_chaat.jpeg", icon: "ShoppingBag"
    },
    {
      id: 2, vendor: "Abdul Bhai", title: "The Nihari Whisperer of Lucknow",
      location: "Lucknow, Uttar Pradesh",
      story: "Abdul ran a humble nihari stall in old Lucknow, passed down from his father. But what made it legendary was his garam masala — a deep, earthy blend of 17 slow-roasted spices. He was skeptical of selling it outside. But Virasaat helped him brand it as 'Abdul Bhai ka Raaz', and gave him QR code-based packaging with a short video of his cooking story. Orders came in from expats craving home flavors. Now he's a weekend YouTube chef and a proud business owner.",
      topSeller: "Abdul Bhai ka Raaz – Nihari Masala", earnings: "International orders from expats",
      subscribers: 89, image: "/assets/images/garam_masala_abdul.jpeg", icon: "Package"
    },
    {
      id: 3, vendor: "Sita & Gita", title: "The Spice Sisters of Kolhapur",
      location: "Kolhapur, Maharashtra",
      story: "Twins Sita and Gita inherited their grandmother's fiery Kolhapuri chutney masala recipe. They sold it in plastic packets outside a temple, barely earning ₹300/day. After joining Virasaat, they were guided to make cleaner labels, use eco-friendly jars, and tell their grandma's story on the label. The masala went viral on Instagram, and now they earn 10x more, collaborating with home chefs and even supplying to a Maharashtrian restaurant in Singapore.",
      topSeller: "Aaji's Teekhat Kolhapuri Masala", earnings: "10x increase in daily earnings",
      subscribers: 234, image: "/assets/images/kolhapuri_chutney_sitagita.jpeg", icon: "Flame"
    },
    {
      id: 4, vendor: "Kashi Yadav", title: "The Train Pantry Legend of Varanasi",
      location: "Varanasi, Uttar Pradesh",
      story: "Kashi sold poha and chai on trains. But regulars kept asking about the chaat masala he sprinkled — it had a unique citrusy punch. He joined Virasaat through a vendor drive and started bottling his spice under the name 'TrainWale Chaat Masale'. Travelers recognized the branding, and demand exploded online. He's no longer on platforms but runs a full spice unit with his cousin and dreams of opening a railway-themed café.",
      topSeller: "TrainWale Chaat Masale – Tang with a Twist", earnings: "Full spice unit business",
      subscribers: 67, image: "/assets/images/chaatmasala_kashi.jpeg", icon: "Soup"
    },
    {
      id: 5, vendor: "Meenakshi Amma", title: "The Sambhar Sage of Madurai",
      location: "Madurai, Tamil Nadu",
      story: "Meenakshi Amma's sambhar stall was popular in Madurai's flower market, but her signature sambhar podi had no label, no name — just legacy. After a college student helped her onboard Virasaat, she named it 'Thatha's Sambhar Secret' in honor of her late husband. With support from the platform, she included handwritten recipes in each package. Now, she receives thank-you letters from Tamil families abroad, and her granddaughter manages their growing orders.",
      topSeller: "Thatha's Sambhar Secret – Madurai Blend", earnings: "International recognition",
      subscribers: 123, image: "/assets/images/sambhar_podi_meenakshi.jpeg", icon: "CookingPot"
    }
  ];

  const [legacyIngredients, setLegacyIngredients] = useState([
    {
      id: 1, name: "Aunty's Schezwan Chutney", masterVendor: "Aunty's Chinese Corner",
      masterVendorPhone: "+91 98765 43210", masterVendorRating: 4.9,
      masterVendorStory: "30 years of perfecting the authentic Schezwan taste. Started as a small stall in Dadar, now famous across Mumbai for the most authentic Chinese street food.",
      ingredient: "Schezwan Chutney", packageSize: "500ml Bottle", yield: "Makes 200 Schezwan Dosas",
      originalPrice: 800, licensePrice: 600, subscriptionPrice: 450,
      category: "chutneys", location: "Dadar Station West", distance: "200m away",
      image: "/assets/images/schezwan_chutney.jpeg",
      description: "The secret blend of 15 spices that made Aunty's Chinese Corner legendary. Perfect balance of heat, tang, and umami. Used by 50+ vendors across Mumbai.",
      ingredients: ["Red Chillies", "Garlic", "Ginger", "Soy Sauce", "Vinegar", "Secret Spice Blend"],
      usage: "2-3 tbsp per dosa, mix with regular chutney for authentic taste",
      testimonials: [
        { vendor: "Mumbai Dosa King",   rating: 5, comment: "My dosa sales increased by 300% after using Aunty's chutney!" },
        { vendor: "Street Food Express",rating: 5, comment: "Customers keep coming back asking for 'that special chutney'" },
        { vendor: "Quick Bites",        rating: 4, comment: "Authentic taste that's hard to replicate. Worth every penny." }
      ],
      subscribers: 47, postedAt: "2 years ago", status: "active"
    },
    {
      id: 2, name: "Ram's Kolhapuri Vada Pav Masala", masterVendor: "Ram's Vada Pav Empire",
      masterVendorPhone: "+91 98765 43211", masterVendorRating: 4.8,
      masterVendorStory: "Started with a single stall in 1995. Now has 15 outlets across Mumbai. The secret masala recipe has been passed down for 3 generations.",
      ingredient: "Kolhapuri Masala Powder", packageSize: "1kg Pack", yield: "Makes 500 Vada Pavs",
      originalPrice: 1200, licensePrice: 900, subscriptionPrice: 750,
      category: "masalas", location: "Bandra Market", distance: "500m away",
      image: "/assets/images/vada_pav_masala.jpeg",
      description: "The legendary masala that made Ram's vada pav famous. Perfect blend of 12 spices including rare Kolhapuri chillies. Instant upgrade for any vada pav stall.",
      ingredients: ["Kolhapuri Red Chillies", "Coriander", "Cumin", "Black Pepper", "Garlic Powder", "Secret Spice Mix"],
      usage: "1 tsp per vada, mix with potato filling for authentic Kolhapuri taste",
      testimonials: [
        { vendor: "Vada Pav Junction", rating: 5, comment: "My stall went from 50 to 200 vada pavs per day!" },
        { vendor: "Street Snacks",     rating: 5, comment: "Customers say it tastes exactly like Ram's original" },
        { vendor: "Quick Bites Corner",rating: 4, comment: "Best investment for my business. ROI in 2 weeks." }
      ],
      subscribers: 89, postedAt: "3 years ago", status: "active"
    },
    {
      id: 3, name: "Gupta's Pani Puri Ka Paani", masterVendor: "Gupta's Pani Puri Paradise",
      masterVendorPhone: "+91 98765 43212", masterVendorRating: 4.7,
      masterVendorStory: "The Gupta family has been serving the most refreshing pani puri for 25 years. Their secret paani recipe is the talk of the town.",
      ingredient: "Pani Puri Concentrate", packageSize: "2L Bottle", yield: "Makes 300 Pani Puri Servings",
      originalPrice: 600, licensePrice: 450, subscriptionPrice: 350,
      category: "concentrates", location: "Andheri Station", distance: "300m away",
      image: "/assets/images/pani_puri_paani.jpeg",
      description: "The secret paani that made Gupta's pani puri legendary. Perfect balance of sweet, sour, and spicy. Just dilute with water and serve.",
      ingredients: ["Tamarind", "Mint", "Coriander", "Green Chillies", "Rock Salt", "Secret Herbs"],
      usage: "Dilute 1:3 with water, add chopped mint and coriander before serving",
      testimonials: [
        { vendor: "Pani Puri Express", rating: 5, comment: "My pani puri sales doubled in the first week!" },
        { vendor: "Street Food Hub",   rating: 5, comment: "Customers love the authentic taste. Best paani in the area." },
        { vendor: "Quick Snacks",      rating: 4, comment: "Easy to use and consistent quality. Great value for money." }
      ],
      subscribers: 34, postedAt: "1 year ago", status: "active"
    },
    {
      id: 4, name: "Mama's Pav Bhaji Masala", masterVendor: "Mama's Pav Bhaji Corner",
      masterVendorPhone: "+91 98765 43213", masterVendorRating: 4.6,
      masterVendorStory: "Mama started her stall in 1988. Her pav bhaji became so famous that people would travel from other cities just to taste it.",
      ingredient: "Pav Bhaji Masala", packageSize: "500g Pack", yield: "Makes 100 Pav Bhaji Servings",
      originalPrice: 400, licensePrice: 300, subscriptionPrice: 250,
      category: "masalas", location: "Dadar Station West", distance: "150m away",
      image: "/assets/images/pav_bhaji_masala.jpeg",
      description: "The secret masala that made Mama's pav bhaji legendary. Perfect blend of spices that brings out the best in any vegetable mix.",
      ingredients: ["Cumin", "Coriander", "Red Chilli Powder", "Garam Masala", "Amchur", "Secret Spice Blend"],
      usage: "2 tbsp per kg of vegetables, add while cooking for authentic taste",
      testimonials: [
        { vendor: "Pav Bhaji King",     rating: 5, comment: "My pav bhaji now tastes exactly like Mama's original!" },
        { vendor: "Street Food Delight",rating: 5, comment: "Customers can't believe it's not Mama's stall" },
        { vendor: "Quick Meals",        rating: 4, comment: "Consistent quality and authentic taste. Highly recommended." }
      ],
      subscribers: 56, postedAt: "2 years ago", status: "active"
    }
  ]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLicensorSubmit = (formData) => {
    setLegacyIngredients(prev => [{
      id: Date.now(), ...formData,
      masterVendor: "Your Stall", masterVendorPhone: "+91 98765 43217",
      masterVendorRating: 4.5, subscribers: 0, postedAt: "Just now", status: "pending"
    }, ...prev]);
    setShowLicensorModal(false);
  };

  const handleSubscriberSubmit = (formData) => {
    toast.success(`Request sent to ${formData.masterVendor}. They usually reply within 24 hours.`);
    setShowSubscriberModal(false);
  };

  // ── Computed filter (NOT called as a function) ─────────────────────────────
  const filteredLegacies = legacyIngredients.filter(legacy => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      legacy.name.toLowerCase().includes(q) ||
      legacy.masterVendor.toLowerCase().includes(q) ||
      legacy.ingredient.toLowerCase().includes(q);
    return matchesSearch && (filterType === 'all' || legacy.category === filterType);
  });

  const tabs = [
    { id: 'browse',    label: 'Browse Legacies', icon: 'Crown',    count: legacyIngredients.length },
    { id: 'franchise', label: 'Cart Franchise',  icon: 'Store',    count: 3                        },
    { id: 'stories',   label: 'Success Stories', icon: 'BookOpen', count: successStories.length   },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Virasaat – Flavours Passed Down. Stories Sealed In | Apna Mandi</title>
        <meta name="description" content="License legendary street food secrets and scale your business with authentic ingredients from master vendors." />
      </Helmet>

      <Header />

      {/* ── Sticky page header ── */}
      <div id="main-content" tabIndex={-1} className="outline-none bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/home" className="flex items-center space-x-1.5 text-primary hover:text-primary/80 transition-colors">
                <Icon name="Home" size={18} />
                <span className="font-medium text-sm">Home</span>
              </Link>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <Icon name="Landmark" size={20} className="text-turmeric-dark" />
                <div>
                  <h1 className="text-lg font-bold text-card-foreground leading-tight">Virasaat</h1>
                  <p className="text-xs text-muted-foreground">Flavours Passed Down. Stories Sealed In</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 bg-muted rounded-lg px-2.5 py-1.5">
              <Icon name="ShoppingCart" size={15} className="text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">{cartCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* ── Hero banner ── */}
        <div className="relative bg-gradient-to-br from-terracotta-dark via-terracotta to-chili rounded-2xl p-6 md:p-8 mb-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white" />
            <div className="absolute -bottom-16 left-1/3 w-56 h-56 rounded-full bg-white" />
          </div>
          <div className="relative max-w-2xl">
            <p className="text-terracotta-light text-xs font-semibold uppercase tracking-widest mb-1">Heritage · Taste · Legacy</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Flavours Passed Down.<br />Stories Sealed In.
            </h2>
            <p className="text-sm md:text-base opacity-90 mb-5 leading-relaxed">
              License legendary street food secrets and scale your business with authentic ingredients from master vendors. Turn your signature taste into a living legacy.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowLicensorModal(true)}
                className="flex items-center space-x-2 bg-white text-terracotta-dark hover:bg-terracotta-light font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
              >
                <Icon name="Crown" size={15} /><span>Become a Master Vendor</span>
              </button>
              <button
                onClick={() => setShowSubscriberModal(true)}
                className="flex items-center space-x-2 border-2 border-white/70 text-white hover:bg-white/10 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
              >
                <Icon name="Star" size={15} /><span>Subscribe to a Legacy</span>
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className="flex items-center space-x-2 border-2 border-white/40 text-white/90 hover:bg-white/10 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
              >
                <Icon name="BookOpen" size={15} /><span>Success Stories</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Search + filter (browse tab only) ── */}
        {activeTab === 'browse' && (
          <div className="bg-card rounded-xl border border-border p-3 mb-5 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ingredients, master vendors, categories…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: 'all',          label: 'All Categories'    },
                  { value: 'chutneys',     label: 'Chutneys & Sauces' },
                  { value: 'masalas',      label: 'Masalas & Spices'  },
                  { value: 'concentrates', label: 'Concentrates'       },
                  { value: 'doughs',       label: 'Doughs & Batters'  },
                ]}
              />
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="bg-card rounded-xl border border-border mb-6 overflow-hidden">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            Browse Legacies Tab
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'browse' && (
          <>
            {filteredLegacies.length === 0 ? (
              <EmptyState
                icon="Crown"
                title="No legendary ingredients found"
                description="Try adjusting your search or filters, or be the first to list your legacy."
                action={{ label: 'List Your Legacy', onClick: () => setShowLicensorModal(true), icon: 'Plus' }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLegacies.map(legacy => {
                  const cat = categoryConfig[legacy.category] || { label: legacy.category, bg: 'bg-ink-medium' };
                  const savePct = Math.round(((legacy.originalPrice - legacy.subscriptionPrice) / legacy.originalPrice) * 100);
                  return (
                    <div key={legacy.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">

                      {/* Image */}
                      <div className="relative h-48 bg-muted flex-shrink-0">
                        <img src={legacy.image} alt={legacy.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className={`${cat.bg} text-white px-2.5 py-1 rounded-full text-xs font-semibold`}>
                            {cat.label.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => setProvenanceLegacy(legacy)}
                            className="bg-turmeric/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-turmeric transition-colors"
                            title="View provenance record"
                          >
                            <Icon name="Fingerprint" size={11} />Sealed
                          </button>
                          <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Icon name="Users" size={11} />{legacy.subscribers}
                          </span>
                        </div>
                        {/* Master vendor at bottom of image */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between text-white">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Icon name="Crown" size={12} />
                            </div>
                            <span className="text-sm font-medium truncate max-w-[140px]">{legacy.masterVendor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} className="text-turmeric fill-current" />
                            <span className="text-sm">{legacy.masterVendorRating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-card-foreground mb-0.5 leading-tight">{legacy.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{legacy.ingredient} · {legacy.location}</p>

                        {/* Package info */}
                        <div className="bg-muted/50 rounded-lg p-2.5 mb-3 grid grid-cols-2 gap-y-1 text-xs">
                          <span className="text-muted-foreground">Package</span>
                          <span className="font-medium text-card-foreground text-right">{legacy.packageSize}</span>
                          <span className="text-muted-foreground">Yield</span>
                          <span className="font-medium text-card-foreground text-right">{legacy.yield}</span>
                        </div>

                        {/* Pricing — clear hierarchy */}
                        <div className="flex items-end justify-between mb-4">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-terracotta">₹{legacy.subscriptionPrice}</span>
                              <span className="text-xs text-muted-foreground line-through">₹{legacy.originalPrice}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">per month</span>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="bg-terracotta-light border border-terracotta/30 text-terracotta-dark text-xs font-semibold px-2 py-0.5 rounded-full">
                              Save {savePct}%
                            </div>
                            <div className="text-xs text-muted-foreground">License: ₹{legacy.licensePrice}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 mt-auto">
                          <Button
                            size="sm" variant="outline"
                            onClick={() => { setSelectedLegacy(legacy); setShowDetailsModal(true); }}
                            className="flex-1"
                          >
                            <Icon name="Eye" size={14} className="mr-1" />Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => { setSelectedLegacy(legacy); setShowSubscriberModal(true); }}
                            className="flex-1 bg-terracotta hover:bg-terracotta-dark"
                          >
                            <Icon name="Star" size={14} className="mr-1" />Subscribe
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════
            Cart Franchise Tab
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'franchise' && (
          <FranchiseSection onBecomeLicensor={() => setShowLicensorModal(true)} />
        )}

        {/* ══════════════════════════════════════════════════════════
            Success Stories Tab
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'stories' && (
          <div className="space-y-6">

            {/* Stats strip — replaces the redundant second hero banner */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '500+',  label: 'Vendors Transformed', icon: 'Users'      },
                { value: '₹50M+', label: 'Revenue Generated',   icon: 'TrendingUp' },
                { value: '25+',   label: 'Cities Covered',      icon: 'Globe'      },
              ].map(stat => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-terracotta-light rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name={stat.icon} size={16} className="text-terracotta-dark" />
                  </div>
                  <div className="text-xl font-bold text-card-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Stories grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {successStories.map(story => (
                <div key={story.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">

                  {/* Image */}
                  <div className="relative h-44 bg-muted flex-shrink-0">
                    <img src={story.image} alt={story.vendor} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-leaf text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                        SUCCESS STORY
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Icon name="Users" size={11} />{story.subscribers} vendors
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-11 h-11 rounded-xl bg-turmeric-light text-turmeric-dark flex items-center justify-center flex-shrink-0">
                          <Icon name={story.icon} size={20} />
                        </span>
                        <div>
                          <p className="font-semibold text-sm leading-tight">{story.vendor}</p>
                          <p className="text-xs opacity-80">{story.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-card-foreground text-base mb-1">{story.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">{story.story}</p>

                    <div className="bg-muted/50 rounded-lg p-3 mb-3 grid grid-cols-2 gap-y-1.5 text-xs">
                      <span className="text-muted-foreground">Top Seller</span>
                      <span className="font-medium text-terracotta text-right truncate">{story.topSeller}</span>
                      <span className="text-muted-foreground">Achievement</span>
                      <span className="font-semibold text-leaf-dark text-right">{story.earnings}</span>
                    </div>

                    <button
                      onClick={() => { setSelectedStory(story); setShowStoryModal(true); }}
                      className="mt-auto flex items-center justify-center gap-2 w-full border border-terracotta/40 text-terracotta hover:bg-terracotta-light rounded-xl py-2 text-sm font-medium transition-colors"
                    >
                      <Icon name="BookOpen" size={14} />Read Full Story
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-terracotta-dark via-terracotta to-chili rounded-2xl p-6 md:p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Create Your Own Success Story?</h3>
              <p className="text-sm opacity-90 mb-5 max-w-md mx-auto">
                Join hundreds of vendors who have transformed their street food secrets into thriving businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowLicensorModal(true)}
                  className="flex items-center justify-center gap-2 bg-white text-terracotta-dark hover:bg-terracotta-light font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Icon name="Crown" size={15} /><span>List Your Legacy</span>
                </button>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="flex items-center justify-center gap-2 border-2 border-white/70 text-white hover:bg-white/10 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Icon name="Crown" size={15} /><span>Browse Legacies</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showLicensorModal && (
        <LicensorModal onClose={() => setShowLicensorModal(false)} onSubmit={handleLicensorSubmit} />
      )}
      {showSubscriberModal && (
        <SubscriberModal onClose={() => setShowSubscriberModal(false)} onSubmit={handleSubscriberSubmit} selectedLegacy={selectedLegacy} />
      )}
      {showDetailsModal && selectedLegacy && (
        <DetailsModal
          legacy={selectedLegacy}
          onClose={() => setShowDetailsModal(false)}
          onSubscribe={() => { setShowDetailsModal(false); setShowSubscriberModal(true); }}
        />
      )}
      {provenanceLegacy && (
        <ProvenanceModal
          legacy={provenanceLegacy}
          onClose={() => setProvenanceLegacy(null)}
        />
      )}
      {showStoryModal && selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setShowStoryModal(false)}
          onListLegacy={() => { setShowStoryModal(false); setShowLicensorModal(true); }}
        />
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// List Your Legacy Modal
// ══════════════════════════════════════════════════════════════════════════════
const LicensorModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', ingredient: '', packageSize: '', yield: '',
    originalPrice: '', licensePrice: '', subscriptionPrice: '',
    category: 'masalas', description: '', masterVendorStory: '',
    ingredients: '', usage: ''
  });
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  return (
    <ModalWrap onClose={onClose} title="List Your Legacy" wide>
      <form onSubmit={e => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Legacy Name</label>
            <Input value={formData.name} onChange={e => set('name', e.target.value)} placeholder="e.g., Aunty's Schezwan Chutney" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Ingredient Type</label>
            <Input value={formData.ingredient} onChange={e => set('ingredient', e.target.value)} placeholder="e.g., Schezwan Chutney" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Package Size</label>
            <Input value={formData.packageSize} onChange={e => set('packageSize', e.target.value)} placeholder="e.g., 500ml Bottle" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Yield</label>
            <Input value={formData.yield} onChange={e => set('yield', e.target.value)} placeholder="e.g., Makes 200 Dosas" required />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'originalPrice',     label: 'Original Price (₹)',  ph: '800' },
            { key: 'licensePrice',      label: 'License Price (₹)',   ph: '600' },
            { key: 'subscriptionPrice', label: 'Monthly Price (₹)',   ph: '450' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">{label}</label>
              <Input type="number" value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph} required />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Category</label>
          <Select value={formData.category} onChange={v => set('category', v)}
            options={[
              { value: 'chutneys',     label: 'Chutneys & Sauces' },
              { value: 'masalas',      label: 'Masalas & Spices'  },
              { value: 'concentrates', label: 'Concentrates'       },
              { value: 'doughs',       label: 'Doughs & Batters'  },
            ]}
          />
        </div>
        {[
          { key: 'masterVendorStory', label: 'Your Story',    ph: 'Tell the story of how you perfected this recipe…', rows: 3 },
          { key: 'description',       label: 'Description',   ph: 'Describe what makes your ingredient special…',     rows: 3 },
        ].map(({ key, label, ph, rows }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">{label}</label>
            <textarea value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph}
              className="w-full p-3 border border-border rounded-lg bg-background text-card-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" rows={rows} required />
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'ingredients', label: 'Key Ingredients',    ph: 'List main ingredients (no secrets needed!)', rows: 2 },
            { key: 'usage',       label: 'Usage Instructions', ph: 'How should vendors use your ingredient?',    rows: 2 },
          ].map(({ key, label, ph, rows }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">{label}</label>
              <textarea value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph}
                className="w-full p-3 border border-border rounded-lg bg-background text-card-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" rows={rows} required />
            </div>
          ))}
        </div>
        <div className="flex space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1 bg-terracotta hover:bg-terracotta-dark">
            <Icon name="Crown" size={15} className="mr-2" />List My Legacy
          </Button>
        </div>
      </form>
    </ModalWrap>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Subscribe to Legacy Modal
// ══════════════════════════════════════════════════════════════════════════════
const SubscriberModal = ({ onClose, onSubmit, selectedLegacy }) => {
  const [formData, setFormData] = useState({
    vendorName: '', vendorPhone: '', vendorLocation: '',
    subscriptionType: 'monthly', message: ''
  });
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  return (
    <ModalWrap onClose={onClose} title="Subscribe to Legacy">
      {selectedLegacy && (
        <div className="px-6 py-2.5 bg-terracotta-light border-b border-terracotta/20">
          <p className="text-sm text-terracotta-dark">
            <span className="font-medium">{selectedLegacy.name}</span>
            <span className="text-terracotta"> by {selectedLegacy.masterVendor}</span>
          </p>
        </div>
      )}
      <form onSubmit={e => { e.preventDefault(); onSubmit({ ...formData, masterVendor: selectedLegacy?.masterVendor || 'Selected Vendor' }); }} className="p-6 space-y-4">
        {[
          { key: 'vendorName',     label: 'Your Stall Name', ph: 'e.g., My Dosa Corner'      },
          { key: 'vendorPhone',    label: 'Phone Number',    ph: '+91 98765 43210'            },
          { key: 'vendorLocation', label: 'Location',        ph: 'e.g., Dadar Station West'   },
        ].map(({ key, label, ph }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">{label}</label>
            <Input value={formData[key]} onChange={e => set(key, e.target.value)} placeholder={ph} required />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Subscription Type</label>
          <Select value={formData.subscriptionType} onChange={v => set('subscriptionType', v)}
            options={[
              { value: 'monthly',   label: 'Monthly Subscription'  },
              { value: 'quarterly', label: 'Quarterly Subscription' },
              { value: 'one-time',  label: 'One-time License'       },
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Message (Optional)</label>
          <textarea value={formData.message} onChange={e => set('message', e.target.value)}
            placeholder="Tell the master vendor about your business…"
            className="w-full p-3 border border-border rounded-lg bg-background text-card-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" rows={3} />
        </div>
        <div className="flex space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1 bg-terracotta hover:bg-terracotta-dark">
            <Icon name="Star" size={15} className="mr-2" />Subscribe
          </Button>
        </div>
      </form>
    </ModalWrap>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Legacy Details Modal
// ══════════════════════════════════════════════════════════════════════════════
const DetailsModal = ({ legacy, onClose, onSubscribe }) => (
  <ModalWrap onClose={onClose} title={legacy.name} wide>
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left */}
        <div>
          <div className="relative h-56 bg-muted rounded-xl overflow-hidden mb-4">
            <img src={legacy.image} alt={legacy.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <span className="bg-terracotta text-white px-2.5 py-1 rounded-full text-xs font-semibold">LEGENDARY</span>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-2 text-sm">
            <h3 className="font-semibold text-card-foreground mb-1">Package Details</h3>
            {[
              ['Package Size', legacy.packageSize],
              ['Yield',        legacy.yield],
              ['Subscribers',  `${legacy.subscribers} vendors`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-semibold text-card-foreground mb-1">Pricing</h3>
            {[
              ['Original Price', `₹${legacy.originalPrice}`,     'line-through text-muted-foreground'],
              ['License Price',  `₹${legacy.licensePrice}`,      'font-medium'                       ],
              ['Monthly Sub.',   `₹${legacy.subscriptionPrice}`, 'font-bold text-terracotta'         ],
            ].map(([k, v, cls]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className={cls}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {[
            { label: 'Master Vendor Story', text: legacy.masterVendorStory },
            { label: 'Description',         text: legacy.description       },
            { label: 'Usage Instructions',  text: legacy.usage             },
          ].map(({ label, text }) => (
            <div key={label}>
              <h3 className="font-semibold text-card-foreground mb-1.5">{label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-card-foreground mb-2">Key Ingredients</h3>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(legacy.ingredients) ? legacy.ingredients : (legacy.ingredients || '').split(','))
                .map((ing, i) => (
                  <span key={i} className="bg-muted border border-border text-muted-foreground px-2.5 py-0.5 rounded-full text-xs">
                    {ing.trim()}
                  </span>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-card-foreground mb-2">Vendor Testimonials</h3>
            <div className="space-y-2">
              {legacy.testimonials?.map((t, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-card-foreground">{t.vendor}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Icon key={j} name="Star" size={11} className="text-turmeric-dark fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={onSubscribe} className="w-full bg-terracotta hover:bg-terracotta-dark">
            <Icon name="Star" size={15} className="mr-2" />Subscribe to This Legacy
          </Button>
        </div>
      </div>
    </div>
  </ModalWrap>
);

// ══════════════════════════════════════════════════════════════════════════════
// Full Story Modal (extracted from inline JSX)
// ══════════════════════════════════════════════════════════════════════════════
const StoryModal = ({ story, onClose, onListLegacy }) => (
  <ModalWrap onClose={onClose} title={story.vendor} wide>
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left */}
        <div>
          <div className="relative h-56 bg-muted rounded-xl overflow-hidden mb-4">
            <img src={story.image} alt={story.vendor} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <span className="bg-leaf text-white px-2.5 py-1 rounded-full text-xs font-semibold">SUCCESS STORY</span>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-2 text-sm">
            <h3 className="font-semibold text-card-foreground mb-1">Achievement Highlights</h3>
            {[
              ['Location',    story.location,    ''],
              ['Subscribers', `${story.subscribers} vendors`, ''],
              ['Achievement', story.earnings,    'text-leaf-dark'],
            ].map(([k, v, cls]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className={`font-medium ${cls}`}>{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-terracotta-light rounded-xl p-4 border border-terracotta/30">
            <h3 className="font-semibold text-terracotta-dark text-sm mb-1">Top Selling Product</h3>
            <p className="text-terracotta-dark font-medium text-sm">{story.topSeller}</p>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">The Journey</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{story.story}</p>
          </div>

          <div>
            <h3 className="font-semibold text-card-foreground mb-3">Impact on Virasaat</h3>
            <div className="space-y-3">
              {[
                { icon: 'TrendingUp', bg: 'bg-leaf-light',  text: 'text-leaf-dark',  title: 'Revenue Growth',   desc: 'Significant increase in earnings'               },
                { icon: 'Users',      bg: 'bg-leaf-light',   text: 'text-leaf-dark',   title: 'Vendor Network',   desc: `${story.subscribers} vendors using this legacy` },
                { icon: 'Globe',      bg: 'bg-terracotta-light', text: 'text-terracotta', title: 'Geographic Reach', desc: 'Expanded beyond local market'                   },
              ].map(item => (
                <div key={item.title} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                    <Icon name={item.icon} size={15} className={item.text} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-terracotta-dark to-chili rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-1">Inspired by this story?</h3>
            <p className="text-xs opacity-90 mb-3">Transform your own street food secrets into a thriving business.</p>
            <div className="flex gap-2">
              <button
                onClick={onListLegacy}
                className="flex items-center gap-1.5 bg-white text-terracotta-dark hover:bg-terracotta-light font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                <Icon name="Crown" size={13} />List Your Legacy
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 border border-white/60 text-white hover:bg-white/10 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                <Icon name="Star" size={13} />Browse Legacies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalWrap>
);

export default Virasaat;