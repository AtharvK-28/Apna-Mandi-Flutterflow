import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import LocationHeader from '../../components/ui/LocationHeader';
import SearchHeader from './components/SearchHeader';
import FilterChips from './components/FilterChips';
import FilterPanel from './components/FilterPanel';
import DealsGrid from './components/DealsGrid';
import MapView from './components/MapView';
import { useCart } from '../../contexts/CartContext';

// ─── Static data lifted outside component ────────────────────────────────────
// Prevents recreation of 52-item array on every render
const CATEGORIES = [
  { id: 'vegetables', name: 'Vegetables', icon: 'Carrot',   count: 12 },
  { id: 'fruits',     name: 'Fruits',     icon: 'Apple',    count: 3  },
  { id: 'dairy',      name: 'Dairy',      icon: 'Milk',     count: 4  },
  { id: 'spices',     name: 'Spices',     icon: 'Pepper',   count: 8  },
  { id: 'grains',     name: 'Grains',     icon: 'Wheat',    count: 4  },
  { id: 'oil',        name: 'Oil & Ghee', icon: 'Droplets', count: 2  },
  { id: 'pulses',     name: 'Pulses',     icon: 'Circle',   count: 3  },
  { id: 'herbs',      name: 'Herbs',      icon: 'Leaf',     count: 3  },
  { id: 'dry-fruits', name: 'Dry Fruits', icon: 'Nut',      count: 3  },
  { id: 'beverages',  name: 'Beverages',  icon: 'Coffee',   count: 2  },
];

const MOCK_DEALS = [
  // ── Fresh Morning ──────────────────────────────────────────────────────────
  { id:1,  name:'Fresh Tomatoes',     category:'vegetables', price:25,  originalPrice:35,  unit:'kg',      availableQuantity:50,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.8, distance:1.2, image:'/assets/images/tomato.jpeg',              dealType:'fresh-morning', expiresAt:new Date(Date.now()+4*3600000), description:'Farm fresh tomatoes, picked this morning' },
  { id:2,  name:'Green Bell Peppers', category:'vegetables', price:40,  originalPrice:60,  unit:'kg',      availableQuantity:30,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.7, distance:1.2, image:'/assets/images/green_bell_pepper.jpeg',   dealType:'fresh-morning', expiresAt:new Date(Date.now()+4*3600000), description:'Crisp and fresh bell peppers' },
  { id:3,  name:'Fresh Milk',         category:'dairy',      price:60,  originalPrice:80,  unit:'liter',   availableQuantity:100, supplierName:'Dairy Fresh',       isVerified:true,  rating:4.9, distance:0.8, image:'/assets/images/milk.jpeg',                dealType:'fresh-morning', expiresAt:new Date(Date.now()+3*3600000), description:'Pure cow milk, delivered fresh' },
  { id:4,  name:'Fresh Curd',         category:'dairy',      price:45,  originalPrice:65,  unit:'kg',      availableQuantity:40,  supplierName:'Dairy Fresh',       isVerified:true,  rating:4.8, distance:0.8, image:'/assets/images/curd.jpeg',                dealType:'fresh-morning', expiresAt:new Date(Date.now()+3*3600000), description:'Homemade fresh curd' },
  { id:5,  name:'Fresh Coriander',    category:'herbs',      price:20,  originalPrice:30,  unit:'bunches', availableQuantity:100, supplierName:'Green Garden',      isVerified:false, rating:4.4, distance:1.5, image:'/assets/images/coriander.jpeg',           dealType:'fresh-morning', expiresAt:new Date(Date.now()+2*3600000), description:'Freshly harvested coriander' },
  // ── End of Day ─────────────────────────────────────────────────────────────
  { id:6,  name:'Ripe Bananas',       category:'fruits',     price:30,  originalPrice:50,  unit:'dozen',   availableQuantity:25,  supplierName:'Fruit Paradise',    isVerified:true,  rating:4.6, distance:2.1, image:'/assets/images/ripe_bananas.jpeg',         dealType:'end-of-day',    expiresAt:new Date(Date.now()+2*3600000), description:'Ripe bananas, perfect for immediate use' },
  { id:7,  name:'Fresh Spinach',      category:'vegetables', price:15,  originalPrice:25,  unit:'kg',      availableQuantity:20,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.5, distance:1.2, image:'/assets/images/spinach.jpeg',             dealType:'end-of-day',    expiresAt:new Date(Date.now()+1*3600000), description:'Fresh spinach, use today' },
  { id:8,  name:'Paneer',             category:'dairy',      price:120, originalPrice:180, unit:'kg',      availableQuantity:15,  supplierName:'Dairy Fresh',       isVerified:true,  rating:4.7, distance:0.8, image:'/assets/images/paneer.jpeg',              dealType:'end-of-day',    expiresAt:new Date(Date.now()+1*3600000), description:'Fresh paneer, best used today' },
  // ── Bulk Discount ──────────────────────────────────────────────────────────
  { id:9,  name:'Basmati Rice',       category:'grains',     price:80,  originalPrice:120, unit:'kg',      availableQuantity:200, supplierName:'Grain Masters',     isVerified:true,  rating:4.8, distance:3.2, image:'/assets/images/basmati_rice.jpeg',         dealType:'bulk-discount', minQuantity:10, description:'Premium basmati rice, bulk order discount' },
  { id:10, name:'Red Onions',         category:'vegetables', price:20,  originalPrice:35,  unit:'kg',      availableQuantity:500, supplierName:'Veggie World',      isVerified:true,  rating:4.6, distance:2.1, image:'/assets/images/red_onions.jpeg',           dealType:'bulk-discount', minQuantity:5,  description:'Red onions, bulk purchase discount' },
  { id:11, name:'Potatoes',           category:'vegetables', price:25,  originalPrice:40,  unit:'kg',      availableQuantity:300, supplierName:'Veggie World',      isVerified:true,  rating:4.5, distance:2.1, image:'/assets/images/potatoes.jpeg',             dealType:'bulk-discount', minQuantity:5,  description:'Fresh potatoes, bulk order available' },
  { id:12, name:'Toor Dal',           category:'pulses',     price:90,  originalPrice:140, unit:'kg',      availableQuantity:150, supplierName:'Pulse Traders',     isVerified:true,  rating:4.7, distance:2.8, image:'/assets/images/toor_dal.jpeg',             dealType:'bulk-discount', minQuantity:5,  description:'Premium toor dal, bulk discount' },
  // ── Regular ────────────────────────────────────────────────────────────────
  { id:13, name:'Green Chilies',      category:'vegetables', price:80,  originalPrice:90,  unit:'kg',      availableQuantity:30,  supplierName:'Spice Garden',      isVerified:false, rating:4.4, distance:1.8, image:'/assets/images/green_chilly.jpeg',         dealType:'regular', description:'Fresh green chilies' },
  { id:14, name:'Ginger',             category:'vegetables', price:120, originalPrice:null,unit:'kg',      availableQuantity:25,  supplierName:'Spice Garden',      isVerified:false, rating:4.3, distance:1.8, image:'/assets/images/ginger.jpeg',              dealType:'regular', description:'Fresh ginger root' },
  { id:15, name:'Turmeric Powder',    category:'spices',     price:200, originalPrice:null,unit:'kg',      availableQuantity:50,  supplierName:'Spice Junction',    isVerified:true,  rating:4.4, distance:1.8, image:'/assets/images/turmeric_powder.jpeg',     dealType:'regular', description:'Pure turmeric powder' },
  { id:16, name:'Mustard Oil',        category:'oil',        price:180, originalPrice:null,unit:'liter',   availableQuantity:100, supplierName:'Oil Traders',       isVerified:true,  rating:4.6, distance:2.5, image:'/assets/images/mustard_oil.jpeg',          dealType:'regular', description:'Pure mustard oil' },
  { id:17, name:'Ghee',               category:'oil',        price:600, originalPrice:null,unit:'kg',      availableQuantity:40,  supplierName:'Dairy Fresh',       isVerified:true,  rating:4.8, distance:0.8, image:'/assets/images/Ghee_1.jpg',               dealType:'regular', description:'Pure cow ghee' },
  { id:18, name:'Moong Dal',          category:'pulses',     price:120, originalPrice:null,unit:'kg',      availableQuantity:80,  supplierName:'Pulse Traders',     isVerified:true,  rating:4.5, distance:2.8, image:'/assets/images/Moong dal_1.jpg',           dealType:'regular', description:'Yellow moong dal' },
  { id:19, name:'Chana Dal',          category:'pulses',     price:100, originalPrice:null,unit:'kg',      availableQuantity:90,  supplierName:'Pulse Traders',     isVerified:true,  rating:4.6, distance:2.8, image:'/assets/images/Chana dal_1.jpg',           dealType:'regular', description:'Split chickpea dal' },
  { id:20, name:'Wheat Flour',        category:'grains',     price:45,  originalPrice:null,unit:'kg',      availableQuantity:200, supplierName:'Grain Masters',     isVerified:true,  rating:4.7, distance:3.2, image:'/assets/images/Wheat flour_1.jpg',         dealType:'regular', description:'Fine wheat flour' },
  { id:21, name:'Sugar',              category:'grains',     price:50,  originalPrice:null,unit:'kg',      availableQuantity:150, supplierName:'Grain Masters',     isVerified:true,  rating:4.5, distance:3.2, image:'/assets/images/Sugar_1.jpg',              dealType:'regular', description:'Refined white sugar' },
  { id:22, name:'Salt',               category:'spices',     price:20,  originalPrice:null,unit:'kg',      availableQuantity:300, supplierName:'Spice Junction',    isVerified:true,  rating:4.3, distance:1.8, image:'/assets/images/Salt_1.jpg',               dealType:'regular', description:'Iodized table salt' },
  { id:23, name:'Black Pepper',       category:'spices',     price:400, originalPrice:null,unit:'kg',      availableQuantity:30,  supplierName:'Spice Junction',    isVerified:true,  rating:4.8, distance:1.8, image:'/assets/images/Black pepper_1.jpg',        dealType:'regular', description:'Whole black peppercorns' },
  { id:24, name:'Cumin Seeds',        category:'spices',     price:300, originalPrice:null,unit:'kg',      availableQuantity:40,  supplierName:'Spice Junction',    isVerified:true,  rating:4.6, distance:1.8, image:'/assets/images/Cumin seeds_1.jpg',         dealType:'regular', description:'Jeera seeds' },
  { id:25, name:'Cardamom',           category:'spices',     price:800, originalPrice:null,unit:'kg',      availableQuantity:20,  supplierName:'Spice Junction',    isVerified:true,  rating:4.9, distance:1.8, image:'/assets/images/Cardamom.jpeg',            dealType:'regular', description:'Green cardamom pods' },
  { id:26, name:'Cinnamon',           category:'spices',     price:500, originalPrice:null,unit:'kg',      availableQuantity:25,  supplierName:'Spice Junction',    isVerified:true,  rating:4.7, distance:1.8, image:'/assets/images/cinnamon.jpeg',            dealType:'regular', description:'Cinnamon sticks' },
  { id:27, name:'Mint Leaves',        category:'herbs',      price:60,  originalPrice:null,unit:'kg',      availableQuantity:35,  supplierName:'Green Garden',      isVerified:false, rating:4.4, distance:1.5, image:'/assets/images/mint_leaves.jpeg',         dealType:'regular', description:'Fresh mint leaves' },
  { id:28, name:'Curry Leaves',       category:'herbs',      price:80,  originalPrice:null,unit:'kg',      availableQuantity:25,  supplierName:'Green Garden',      isVerified:false, rating:4.3, distance:1.5, image:'/assets/images/curry_leaves.jpeg',        dealType:'regular', description:'Fresh curry leaves' },
  { id:29, name:'Almonds',            category:'dry-fruits', price:800, originalPrice:null,unit:'kg',      availableQuantity:50,  supplierName:'Nut House',         isVerified:true,  rating:4.8, distance:3.5, image:'/assets/images/almonds.jpeg',             dealType:'regular', description:'Premium almonds' },
  { id:30, name:'Cashews',            category:'dry-fruits', price:900, originalPrice:null,unit:'kg',      availableQuantity:40,  supplierName:'Nut House',         isVerified:true,  rating:4.7, distance:3.5, image:'/assets/images/cashew.jpeg',              dealType:'regular', description:'Whole cashews' },
  { id:31, name:'Raisins',            category:'dry-fruits', price:300, originalPrice:null,unit:'kg',      availableQuantity:60,  supplierName:'Nut House',         isVerified:true,  rating:4.6, distance:3.5, image:'/assets/images/raisins.jpeg',             dealType:'regular', description:'Black raisins' },
  { id:32, name:'Tea Leaves',         category:'beverages',  price:400, originalPrice:null,unit:'kg',      availableQuantity:80,  supplierName:'Beverage Co.',      isVerified:true,  rating:4.5, distance:2.8, image:'/assets/images/tea_leaves.jpeg',          dealType:'regular', description:'Assam tea leaves' },
  { id:33, name:'Coffee Beans',       category:'beverages',  price:600, originalPrice:null,unit:'kg',      availableQuantity:45,  supplierName:'Beverage Co.',      isVerified:true,  rating:4.7, distance:2.8, image:'/assets/images/coffee_beans.jpeg',        dealType:'regular', description:'Arabica coffee beans' },
  { id:34, name:'Carrots',            category:'vegetables', price:35,  originalPrice:null,unit:'kg',      availableQuantity:80,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.6, distance:1.2, image:'/assets/images/carrot.jpeg',              dealType:'regular', description:'Fresh orange carrots' },
  { id:35, name:'Cucumber',           category:'vegetables', price:30,  originalPrice:null,unit:'kg',      availableQuantity:60,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.5, distance:1.2, image:'/assets/images/cucumber.jpeg',            dealType:'regular', description:'Fresh green cucumbers' },
  { id:36, name:'Cauliflower',        category:'vegetables', price:40,  originalPrice:null,unit:'kg',      availableQuantity:40,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.4, distance:1.2, image:'/assets/images/cauliflower.jpeg',         dealType:'regular', description:'Fresh white cauliflower' },
  { id:37, name:'Cabbage',            category:'vegetables', price:25,  originalPrice:null,unit:'kg',      availableQuantity:70,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.3, distance:1.2, image:'/assets/images/cabbage.jpeg',             dealType:'regular', description:'Fresh green cabbage' },
  { id:38, name:'Brinjal',            category:'vegetables', price:45,  originalPrice:null,unit:'kg',      availableQuantity:50,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.4, distance:1.2, image:'/assets/images/brinjal.jpeg',             dealType:'regular', description:'Fresh purple brinjal' },
  { id:39, name:'Lady Finger',        category:'vegetables', price:50,  originalPrice:null,unit:'kg',      availableQuantity:45,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.5, distance:1.2, image:'/assets/images/lady_finger.jpeg',         dealType:'regular', description:'Fresh lady finger' },
  { id:40, name:'Bottle Gourd',       category:'vegetables', price:30,  originalPrice:null,unit:'kg',      availableQuantity:55,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.3, distance:1.2, image:'/assets/images/bottle_gourd.jpeg',        dealType:'regular', description:'Fresh bottle gourd' },
  { id:41, name:'Ridge Gourd',        category:'vegetables', price:35,  originalPrice:null,unit:'kg',      availableQuantity:40,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.4, distance:1.2, image:'/assets/images/ridge_gourd.jpeg',         dealType:'regular', description:'Fresh ridge gourd' },
  { id:42, name:'Pumpkin',            category:'vegetables', price:20,  originalPrice:null,unit:'kg',      availableQuantity:100, supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.2, distance:1.2, image:'/assets/images/pumpkin.jpeg',             dealType:'regular', description:'Fresh orange pumpkin' },
  { id:43, name:'Sweet Potato',       category:'vegetables', price:40,  originalPrice:null,unit:'kg',      availableQuantity:60,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.6, distance:1.2, image:'/assets/images/sweet_potato.jpeg',        dealType:'regular', description:'Fresh sweet potatoes' },
  { id:44, name:'Yam',                category:'vegetables', price:35,  originalPrice:null,unit:'kg',      availableQuantity:50,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.3, distance:1.2, image:'/assets/images/yam.jpeg',                 dealType:'regular', description:'Fresh yam' },
  { id:45, name:'Taro Root',          category:'vegetables', price:45,  originalPrice:null,unit:'kg',      availableQuantity:35,  supplierName:'Fresh Harvest Co.', isVerified:true,  rating:4.4, distance:1.2, image:'/assets/images/taro_root.jpeg',           dealType:'regular', description:'Fresh taro root' },
  { id:46, name:'Apples',             category:'fruits',     price:120, originalPrice:null,unit:'kg',      availableQuantity:40,  supplierName:'Fruit Paradise',    isVerified:true,  rating:4.7, distance:2.1, image:'/assets/images/apple.jpeg',               dealType:'regular', description:'Fresh red apples' },
  { id:47, name:'Oranges',            category:'fruits',     price:80,  originalPrice:null,unit:'kg',      availableQuantity:60,  supplierName:'Fruit Paradise',    isVerified:true,  rating:4.5, distance:2.1, image:'/assets/images/orange.jpeg',              dealType:'regular', description:'Fresh sweet oranges' },
  { id:48, name:'Butter',             category:'dairy',      price:400, originalPrice:null,unit:'kg',      availableQuantity:30,  supplierName:'Dairy Fresh',       isVerified:true,  rating:4.8, distance:0.8, image:'/assets/images/butter.jpeg',              dealType:'regular', description:'Fresh butter' },
  { id:49, name:'Red Chili Powder',   category:'spices',     price:250, originalPrice:null,unit:'kg',      availableQuantity:35,  supplierName:'Spice Junction',    isVerified:true,  rating:4.6, distance:1.8, image:'/assets/images/red_chilly.jpeg',          dealType:'regular', description:'Pure red chili powder' },
  { id:50, name:'Garam Masala',       category:'spices',     price:350, originalPrice:null,unit:'kg',      availableQuantity:25,  supplierName:'Spice Junction',    isVerified:true,  rating:4.7, distance:1.8, image:'/assets/images/garam_masala.jpeg',        dealType:'regular', description:'Aromatic garam masala' },
  { id:51, name:'Brown Rice',         category:'grains',     price:70,  originalPrice:null,unit:'kg',      availableQuantity:100, supplierName:'Grain Masters',     isVerified:true,  rating:4.6, distance:3.2, image:'/assets/images/brown rice.jpeg',           dealType:'regular', description:'Healthy brown rice' },
  { id:52, name:'Jaggery',            category:'grains',     price:60,  originalPrice:null,unit:'kg',      availableQuantity:80,  supplierName:'Grain Masters',     isVerified:true,  rating:4.5, distance:3.2, image:'/assets/images/jaggery.jpeg',             dealType:'regular', description:'Natural jaggery' },
];

// ─── Skeleton card matching real DealCard proportions ────────────────────────
const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
    <div className="h-48 bg-muted" />
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-5 bg-muted rounded-full w-16 flex-shrink-0" />
      </div>
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="flex items-center gap-2">
        <div className="h-3 bg-muted rounded w-10" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
      <div className="flex items-end justify-between pt-1">
        <div className="space-y-1">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-12" />
        </div>
        <div className="h-3 bg-muted rounded w-20" />
      </div>
      <div className="h-9 bg-muted rounded-lg" />
    </div>
  </div>
);

// ─── Results bar ─────────────────────────────────────────────────────────────
const ResultsBar = ({ count, searchQuery, activeFilterCount, onFilterClick, onClearSearch }) => (
  <div className="flex items-center justify-between gap-3 mb-5">
    <div className="min-w-0">
      {count > 0 ? (
        <div className="flex items-baseline gap-2 flex-wrap">
          <h2 className="text-xl font-bold text-card-foreground whitespace-nowrap">
            {count} <span className="font-medium text-muted-foreground">deals</span>
          </h2>
          {searchQuery && (
            <span className="text-sm text-muted-foreground">
              for &ldquo;<span className="font-medium text-foreground">{searchQuery}</span>&rdquo;
              <button
                onClick={onClearSearch}
                className="ml-1.5 text-primary hover:text-primary/80 font-bold transition-colors"
              >×</button>
            </span>
          )}
        </div>
      ) : (
        <h2 className="text-xl font-bold text-card-foreground">No deals found</h2>
      )}
    </div>

    <button
      onClick={onFilterClick}
      className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all flex-shrink-0 ${
        activeFilterCount > 0
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30'
      }`}
    >
      <Icon name="SlidersHorizontal" size={15} />
      Filters
      {activeFilterCount > 0 && (
        <span className="bg-white/25 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
          {activeFilterCount}
        </span>
      )}
    </button>
  </div>
);

// ─── Deal-type summary pills ──────────────────────────────────────────────────
const DealTypePills = ({ deals }) => {
  const types = [
    { key: 'fresh-morning', icon: 'Sunrise',  label: 'Fresh Morning', cls: 'bg-leaf-light text-leaf-dark border-leaf/30' },
    { key: 'end-of-day',    icon: 'Moon',     label: 'End of Day',    cls: 'bg-turmeric-light text-turmeric-dark border-turmeric/30'  },
    { key: 'bulk-discount', icon: 'Package',  label: 'Bulk Deals',    cls: 'bg-terracotta-light text-terracotta-dark border-terracotta/30'   },
  ];
  const counts = Object.fromEntries(types.map(t => [t.key, deals.filter(d => d.dealType === t.key).length]));
  const visible = types.filter(t => counts[t.key] > 0);
  if (!visible.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {visible.map(t => (
        <span key={t.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${t.cls}`}>
          <Icon name={t.icon} size={13} />
          {t.label}
          <span className="font-bold opacity-75">{counts[t.key]}</span>
        </span>
      ))}
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
      <Icon name="SearchX" size={28} className="text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-card-foreground mb-2">No deals match your filters</h3>
    <p className="text-sm text-muted-foreground mb-5 max-w-xs">
      Try broadening your search, adjusting your distance, or clearing some filters.
    </p>
    <button
      onClick={onClear}
      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
    >
      <Icon name="RotateCcw" size={14} />
      Clear All Filters
    </button>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
const DealDiscoveryShopping = () => {
  const [deals, setDeals]                         = useState([]);
  const [filteredDeals, setFilteredDeals]         = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [searchQuery, setSearchQuery]             = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isMapVisible, setIsMapVisible]           = useState(false);

  const { addToCart, updateQuantity } = useCart();

  const [filters, setFilters] = useState({
    categories:   [],
    priceRange:   [0, 1000],
    distance:     5,
    dealType:     'all',
    verifiedOnly: false,
  });

  // ── Seed data once ─────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDeals(MOCK_DEALS);
      setFilteredDeals(MOCK_DEALS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  // ── Filtering ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!deals.length) return;
    const q = searchQuery.toLowerCase();
    const result = deals.filter(d => {
      if (q && !d.name.toLowerCase().includes(q) && !d.supplierName.toLowerCase().includes(q) && !d.category.toLowerCase().includes(q)) return false;
      if (filters.categories.length && !filters.categories.includes(d.category)) return false;
      if (d.price < filters.priceRange[0] || d.price > filters.priceRange[1]) return false;
      if (d.distance > filters.distance) return false;
      if (filters.dealType !== 'all' && d.dealType !== filters.dealType) return false;
      if (filters.verifiedOnly && !d.isVerified) return false;
      return true;
    });
    setFilteredDeals(result);
  }, [deals, searchQuery, filters]);

  // ── Active filter count (for badge) ───────────────────────────────────────
  const activeFilterCount =
    filters.categories.length +
    (filters.dealType !== 'all'                                          ? 1 : 0) +
    (filters.verifiedOnly                                                ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000          ? 1 : 0) +
    (filters.distance < 5                                                ? 1 : 0);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSearch         = (q) => setSearchQuery(q);
  const handleFilterChange   = (f) => setFilters(f);
  const handleAddToCart      = (deal, qty) => { if (deal?.id) addToCart(deal, qty); };
  const handleQuantityChange = (id, qty) => updateQuantity(id, qty);

  const handleCategoryToggle = (id) =>
    setFilters(p => ({
      ...p,
      categories: p.categories.includes(id)
        ? p.categories.filter(c => c !== id)
        : [...p.categories, id],
    }));

  const handleDealTypeChange = (type) => setFilters(p => ({ ...p, dealType: type }));

  const clearAllFilters = () => {
    setFilters({ categories: [], priceRange: [0, 1000], distance: 5, dealType: 'all', verifiedOnly: false });
    setSearchQuery('');
  };

  // ── Unique suppliers for the map ───────────────────────────────────────────
  const suppliers = deals.reduce((acc, deal) => {
    if (!acc.find(s => s.name === deal.supplierName)) {
      acc.push({
        id:         deal.supplierName.replace(/\s+/g, '-').toLowerCase(),
        name:       deal.supplierName,
        rating:     deal.rating,
        distance:   deal.distance,
        isVerified: deal.isVerified,
        specialties: [...new Set(deals.filter(d => d.supplierName === deal.supplierName).map(d => d.category))],
      });
    }
    return acc;
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Deals & Shopping – Apna Mandi</title>
        <meta name="description" content="Discover amazing grocery deals from local suppliers" />
      </Helmet>

      <Header />
      <LocationHeader />

      {/* ── Two-column layout: deals | map ── */}
      <div id="main-content" tabIndex={-1} className="outline-none flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">

        {/* ── Left: deals column ── */}
        <div className={`flex-1 min-w-0 ${isMapVisible ? 'lg:max-w-[calc(100%-400px)]' : ''}`}>

          {/* Sticky search + filter chips */}
          <div className="bg-background border-b border-border">
            <SearchHeader
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onMapToggle={() => setIsMapVisible(v => !v)}
              isMapVisible={isMapVisible}
              onFilterClick={() => setIsFilterPanelOpen(true)}
            />
            <div className="px-4 py-3">
              <FilterChips
                categories={CATEGORIES}
                selectedCategories={filters.categories}
                onCategoryToggle={handleCategoryToggle}
                onDealTypeChange={handleDealTypeChange}
                onClearAll={clearAllFilters}
                dealType={filters.dealType}
              />
            </div>
          </div>

          {/* Content area */}
          <div className="p-4 md:p-6">
            {loading ? (
              <>
                {/* Skeleton results bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-7 bg-muted rounded-lg w-36 animate-pulse" />
                  <div className="h-9 bg-muted rounded-xl w-28 animate-pulse hidden sm:block" />
                </div>
                {/* Skeleton type pills */}
                <div className="flex gap-2 mb-5">
                  {[100, 90, 80].map(w => (
                    <div key={w} className="h-7 bg-muted rounded-full animate-pulse" style={{ width: w }} />
                  ))}
                </div>
                {/* Skeleton grid — same proportions as DealCard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              </>
            ) : (
              <>
                <ResultsBar
                  count={filteredDeals.length}
                  searchQuery={searchQuery}
                  activeFilterCount={activeFilterCount}
                  onFilterClick={() => setIsFilterPanelOpen(true)}
                  onClearSearch={() => setSearchQuery('')}
                />

                {/* Deal type pills — hidden when filtered to a specific type */}
                {filters.dealType === 'all' && filteredDeals.length > 0 && (
                  <DealTypePills deals={filteredDeals} />
                )}

                {filteredDeals.length === 0 ? (
                  <EmptyState onClear={clearAllFilters} />
                ) : (
                  <DealsGrid
                    deals={filteredDeals}
                    onAddToCart={handleAddToCart}
                    onQuantityChange={handleQuantityChange}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right: map panel ── */}
        {isMapVisible && (
          <div className="lg:w-[400px] lg:border-l border-border flex-shrink-0">
            <MapView
              suppliers={suppliers}
              isVisible={true}
              onToggle={() => setIsMapVisible(false)}
              userLocation={{ lat: 19.228825, lng: 72.854118 }}
            />
          </div>
        )}
      </div>

      {/* Filter side-panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onApplyFilters={handleFilterChange}
      />
    </div>
  );
};

export default DealDiscoveryShopping;