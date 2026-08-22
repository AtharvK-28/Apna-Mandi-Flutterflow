import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const franchises = [
  {
    id: 1,
    brand: "Abdul Bhai ka Raaz — Nihari Cart",
    legend: "Abdul Bhai",
    origin: "Lucknow, Uttar Pradesh",
    image: "/assets/images/garam_masala_abdul.jpeg",
    story: "The 17-spice nihari that made old Lucknow queue up — now licensed as a complete cart business.",
    setupCost: 45000,
    royalty: 8,
    avgDailySales: 3200,
    rating: 4.9,
    activeFranchises: 6,
    territories: ['Pune (2 slots)', 'Mumbai (1 slot)'],
    includes: [
      { icon: 'GraduationCap', label: '5-day training by a Hunar-certified Karigar' },
      { icon: 'Package', label: 'Signature masala supplied only via Apna Mandi procurement' },
      { icon: 'QrCode', label: 'Brand kit: cart wrap + QR provenance story' }
    ]
  },
  {
    id: 2,
    brand: "Aunty's Schezwan Dosa Cart",
    legend: "Aunty's Chinese Corner",
    origin: "Dadar, Mumbai",
    image: "/assets/images/schezwan_chutney.jpeg",
    story: "The chutney 50+ Mumbai vendors already license — now a full dosa cart format for new cities.",
    setupCost: 35000,
    royalty: 10,
    avgDailySales: 2800,
    rating: 4.8,
    activeFranchises: 11,
    territories: ['Bengaluru (3 slots)', 'Hyderabad (2 slots)'],
    includes: [
      { icon: 'GraduationCap', label: '3-day dosa + wok training by certified Karigar' },
      { icon: 'Package', label: 'Weekly chutney supply line, quality-sealed' },
      { icon: 'QrCode', label: 'Brand kit + Swachh Badge fast-track audit' }
    ]
  },
  {
    id: 3,
    brand: "Thatha's Sambhar Secret — Tiffin Cart",
    legend: "Meenakshi Amma",
    origin: "Madurai, Tamil Nadu",
    image: "/assets/images/sambhar_podi_meenakshi.jpeg",
    story: "Madurai's flower-market sambhar, packaged as a morning tiffin cart for South Indian breakfast corridors.",
    setupCost: 30000,
    royalty: 7,
    avgDailySales: 2400,
    rating: 4.9,
    activeFranchises: 4,
    territories: ['Chennai (2 slots)', 'Coimbatore (1 slot)'],
    includes: [
      { icon: 'GraduationCap', label: '4-day tiffin training by certified Karigar' },
      { icon: 'Package', label: 'Sambhar podi supply direct from Meenakshi Amma' },
      { icon: 'QrCode', label: 'Brand kit + handwritten-recipe story cards' }
    ]
  }
];

const FranchiseSection = ({ onBecomeLicensor }) => {
  const [selected, setSelected] = useState(null);
  const [chosenTerritory, setChosenTerritory] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);

  const openApply = (franchise) => {
    setSelected(franchise);
    setChosenTerritory(null);
  };

  const handleApply = () => {
    setAppliedIds(prev => [...prev, selected.id]);
    setSelected(null);
  };

  return (
    <div>
      {/* Intro strip */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="w-10 h-10 bg-chili rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon name="Store" size={20} color="white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-card-foreground">Run a legend's cart in your city</h3>
          <p className="text-sm text-muted-foreground">
            License recipe + brand + methods. Training comes as a Karigar Connect gig, signature ingredients flow
            through procurement, and royalties reach the original vendor automatically.
          </p>
        </div>
        <button
          onClick={onBecomeLicensor}
          className="flex items-center space-x-2 border border-primary text-primary hover:bg-primary/5 font-medium px-4 py-2 rounded-xl transition-colors text-sm flex-shrink-0"
        >
          <Icon name="Crown" size={15} />
          <span>Franchise Your Cart</span>
        </button>
      </div>

      {/* Franchise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {franchises.map((franchise) => {
          const isApplied = appliedIds.includes(franchise.id);
          return (
            <div key={franchise.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="relative h-40 bg-muted flex-shrink-0">
                <img src={franchise.image} alt={franchise.brand} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-chili text-white px-2 py-1 rounded-full text-xs font-medium">
                  {franchise.activeFranchises} carts live
                </span>
                <span className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Icon name="Star" size={11} className="mr-1 fill-current text-turmeric" />
                  {franchise.rating}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-card-foreground leading-snug">{franchise.brand}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  by {franchise.legend} · {franchise.origin}
                </p>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{franchise.story}</p>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-muted rounded-lg py-2">
                    <p className="text-sm font-bold text-card-foreground">₹{(franchise.setupCost / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-muted-foreground">setup</p>
                  </div>
                  <div className="bg-muted rounded-lg py-2">
                    <p className="text-sm font-bold text-card-foreground">{franchise.royalty}%</p>
                    <p className="text-[10px] text-muted-foreground">royalty</p>
                  </div>
                  <div className="bg-muted rounded-lg py-2">
                    <p className="text-sm font-bold text-card-foreground">₹{franchise.avgDailySales}</p>
                    <p className="text-[10px] text-muted-foreground">avg daily sales</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {franchise.includes.map((inc) => (
                    <div key={inc.label} className="flex items-start space-x-2">
                      <Icon name={inc.icon} size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{inc.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {isApplied ? (
                    <div className="flex items-center justify-center py-2.5 text-success text-sm font-medium bg-success/10 rounded-xl">
                      <Icon name="CheckCircle" size={16} className="mr-1.5" />
                      Application sent — {franchise.legend} will call you
                    </div>
                  ) : (
                    <button
                      onClick={() => openApply(franchise)}
                      className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <Icon name="Store" size={15} />
                      <span>Apply for Franchise</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-card-foreground">Apply — {selected.brand}</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Territory */}
              <div>
                <p className="text-sm font-medium text-card-foreground mb-2">Choose your territory</p>
                <div className="space-y-2">
                  {selected.territories.map((territory) => (
                    <button
                      key={territory}
                      onClick={() => setChosenTerritory(territory)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${
                        chosenTerritory === territory
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-border text-card-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="flex items-center">
                        <Icon name="MapPin" size={15} className="mr-2" />
                        {territory}
                      </span>
                      {chosenTerritory === territory && <Icon name="CheckCircle" size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div>
                <p className="text-sm font-medium text-card-foreground mb-2">What happens next</p>
                <div className="space-y-2.5">
                  {[
                    { icon: 'Phone', text: `${selected.legend} reviews your Apna Mandi profile — Vyapaar Score and Swachh Badge count here` },
                    { icon: 'GraduationCap', text: 'Training is booked as a paid Karigar Connect gig with a certified trainer' },
                    { icon: 'Package', text: 'Signature ingredient supply locks into your procurement orders' },
                    { icon: 'IndianRupee', text: `${selected.royalty}% royalty flows back automatically from your daily sales` }
                  ].map((step, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name={step.icon} size={13} className="text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground pt-1.5">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleApply}
                disabled={!chosenTerritory}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-3 rounded-xl transition-colors text-sm"
              >
                <Icon name="Send" size={15} />
                <span>Send Application</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseSection;
