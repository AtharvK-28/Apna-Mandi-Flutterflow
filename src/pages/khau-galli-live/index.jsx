import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

const carts = [
  {
    id: 1, name: 'Mumbai Dosa Corner', icon: 'UtensilsCrossed', tint: 'bg-turmeric-light text-turmeric-dark', category: 'south',
    dishNow: 'Mysore Masala Dosa', freshIn: 'Fresh batch on the tawa now',
    wait: '8 min', distance: '200m', rating: 4.8, swachh: 'A', queue: 3,
    pos: { x: 22, y: 30 }
  },
  {
    id: 2, name: 'Chaat Corner', icon: 'Salad', tint: 'bg-leaf-light text-leaf-dark', category: 'chaat',
    dishNow: 'Sev Puri + Dahi Puri', freshIn: 'Puris fried 10 min ago',
    wait: '5 min', distance: '150m', rating: 4.6, swachh: 'A', queue: 6,
    pos: { x: 48, y: 18 }
  },
  {
    id: 3, name: 'Spice King', icon: 'Soup', tint: 'bg-chili-light text-chili', category: 'chinese',
    dishNow: 'Schezwan Noodles', freshIn: 'Wok firing — 2 min to next plate',
    wait: '4 min', distance: '400m', rating: 4.4, swachh: 'B+', queue: 2,
    pos: { x: 70, y: 38 }
  },
  {
    id: 4, name: 'Rajesh Juice Corner', icon: 'CupSoda', tint: 'bg-turmeric-light text-turmeric-dark', category: 'juice',
    dishNow: 'Fresh Mosambi Juice', freshIn: 'Crushing to order',
    wait: '2 min', distance: '180m', rating: 4.8, swachh: 'A', queue: 1,
    pos: { x: 35, y: 55 }
  },
  {
    id: 5, name: 'Dairy Delights', icon: 'IceCream', tint: 'bg-terracotta-light text-terracotta-dark', category: 'juice',
    dishNow: 'Malai Kulfi + Falooda', freshIn: "Today's batch, set at noon",
    wait: '3 min', distance: '500m', rating: 4.7, swachh: 'A', queue: 4,
    pos: { x: 82, y: 20 }
  },
  {
    id: 6, name: 'Pav Bhaji King', icon: 'ChefHat', tint: 'bg-chili-light text-chili', category: 'chaat',
    dishNow: 'Butter Pav Bhaji', freshIn: 'Bhaji simmering since 5 PM',
    wait: '6 min', distance: '350m', rating: 4.9, swachh: 'A', queue: 8,
    pos: { x: 58, y: 62 }
  }
];

const filters = [
  { id: 'all', label: 'All', icon: 'Sparkles' },
  { id: 'chaat', label: 'Chaat & Pav', icon: 'Salad' },
  { id: 'south', label: 'South Indian', icon: 'UtensilsCrossed' },
  { id: 'chinese', label: 'Chinese', icon: 'Soup' },
  { id: 'juice', label: 'Juice & Kulfi', icon: 'CupSoda' }
];

const trail = {
  name: 'Dadar Legends Trail',
  stops: 5,
  distance: '2.1 km',
  curator: '@MumbaiKhauGalli',
  time: '~90 min',
  stopIcons: ['UtensilsCrossed', 'Salad', 'ChefHat', 'CupSoda', 'IceCream']
};

const KhauGalliLive = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [queuedIds, setQueuedIds] = useState([]);
  const [trailStarted, setTrailStarted] = useState(false);

  const visibleCarts = carts.filter(c => activeFilter === 'all' || c.category === activeFilter);

  const handleQueue = (id) => setQueuedIds(prev => [...prev, id]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Khau Galli Live - Apna Mandi</title>
        <meta name="description" content="See what's cooking near you right now — live street food map" />
      </Helmet>

      <Header />

      {/* Page header */}
      <div id="main-content" tabIndex={-1} className="outline-none bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/home" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                <Icon name="Home" size={20} />
                <span className="font-semibold">Home</span>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Khau Galli Live</h1>
                <p className="text-sm text-muted-foreground">What's cooking near you, right now</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-success/10 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-success">{carts.length} carts live · Dadar West</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`}
            >
              <Icon name={filter.icon} size={14} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
          {/* Live map */}
          <div className="lg:col-span-3">
            <div className="relative bg-card rounded-xl border border-border overflow-hidden h-[340px] sm:h-[420px]">
              {/* Street grid */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 70" preserveAspectRatio="none">
                <rect width="100" height="70" className="fill-muted" />
                {/* park */}
                <rect x="6" y="42" width="18" height="20" rx="2" className="fill-success/20" />
                {/* rail corridor */}
                <rect x="90" y="0" width="6" height="70" className="fill-muted-foreground/15" />
                <line x1="93" y1="0" x2="93" y2="70" strokeDasharray="2 2" strokeWidth="0.6" className="stroke-muted-foreground/40" />
                {/* roads */}
                <line x1="0" y1="25" x2="100" y2="25" strokeWidth="4" className="stroke-background" />
                <line x1="0" y1="48" x2="100" y2="48" strokeWidth="3" className="stroke-background" />
                <line x1="30" y1="0" x2="30" y2="70" strokeWidth="3" className="stroke-background" />
                <line x1="62" y1="0" x2="62" y2="70" strokeWidth="4" className="stroke-background" />
                <line x1="0" y1="25" x2="100" y2="25" strokeWidth="0.5" strokeDasharray="3 3" className="stroke-muted-foreground/30" />
                <line x1="62" y1="0" x2="62" y2="70" strokeWidth="0.5" strokeDasharray="3 3" className="stroke-muted-foreground/30" />
              </svg>

              {/* Labels */}
              <span className="absolute left-[8%] top-[66%] text-[10px] font-medium text-success/80">Shivaji Park</span>
              <span className="absolute right-1 top-[4%] text-[10px] font-medium text-muted-foreground rotate-90 origin-top-right">Dadar Stn.</span>

              {/* Cart pins */}
              {visibleCarts.map((cart) => {
                const isSelected = selectedId === cart.id;
                return (
                  <button
                    key={cart.id}
                    onClick={() => setSelectedId(cart.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${cart.pos.x}%`, top: `${cart.pos.y}%` }}
                    aria-label={cart.name}
                  >
                    <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '2.5s' }} />
                    <span className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-md transition-transform ${
                      isSelected
                        ? 'bg-terracotta border-terracotta text-white scale-125 z-10'
                        : `${cart.tint} border-paper-light group-hover:scale-110`
                    }`}>
                      <Icon name={cart.icon} size={18} />
                    </span>
                    {isSelected && (
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
                        {cart.name}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* You are here */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '45%', top: '40%' }}>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary border-2 border-white shadow-md" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 whitespace-nowrap text-[10px] font-medium text-secondary">You</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Icon name="Activity" size={12} className="mr-1.5 text-primary" />
              Live counts from every scan and order feed straight back into vendors' Mausam Engine forecasts.
            </p>
          </div>

          {/* Live cart list */}
          <div className="lg:col-span-2 space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {visibleCarts.map((cart) => {
              const isQueued = queuedIds.includes(cart.id);
              const isSelected = selectedId === cart.id;
              return (
                <div
                  key={cart.id}
                  onClick={() => setSelectedId(cart.id)}
                  className={`bg-card rounded-xl border p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'border-primary shadow-sm' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cart.tint}`}>
                        <Icon name={cart.icon} size={19} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <p className="font-semibold text-card-foreground text-sm truncate">{cart.name}</p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success flex-shrink-0">
                            <Icon name="ShieldCheck" size={9} className="mr-0.5" />
                            {cart.swachh}
                          </span>
                        </div>
                        <p className="text-xs text-primary font-medium">{cart.dishNow}</p>
                        <p className="text-[11px] text-muted-foreground">{cart.freshIn}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs font-semibold text-card-foreground flex items-center justify-end">
                        <Icon name="Star" size={11} className="text-turmeric-dark fill-current mr-0.5" />
                        {cart.rating}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{cart.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      <Icon name="Clock" size={11} className="inline mr-1" />
                      ~{cart.wait} wait · {cart.queue} in queue
                    </span>
                    {isQueued ? (
                      <span className="text-xs font-medium text-success flex items-center">
                        <Icon name="TicketCheck" size={13} className="mr-1" />
                        You're #{cart.queue + 1} · code KG-{40 + cart.id}
                      </span>
                    ) : (
                      <Button
                        size="xs"
                        iconName="Zap"
                        onClick={(e) => { e.stopPropagation(); handleQueue(cart.id); }}
                      >
                        Queue Ahead · ₹2
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Food trail */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center -space-x-2 flex-shrink-0">
              {trail.stopIcons.map((iconName, i) => (
                <span
                  key={iconName}
                  className="w-9 h-9 rounded-full bg-paper-dark/70 text-ink-light border-2 border-paper-light flex items-center justify-center"
                  style={{ zIndex: trail.stopIcons.length - i }}
                >
                  <Icon name={iconName} size={16} />
                </span>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-card-foreground">{trail.name}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Icon name="Route" size={11} className="mr-1" />
                  Food trail
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {trail.stops} legendary stops · {trail.distance} · {trail.time} · curated by <span className="font-medium text-card-foreground">{trail.curator}</span>
              </p>
            </div>
            {trailStarted ? (
              <span className="flex items-center text-success text-sm font-medium flex-shrink-0">
                <Icon name="Navigation" size={15} className="mr-1.5" />
                Trail started — head to stop 1
              </span>
            ) : (
              <Button size="sm" iconName="Navigation" onClick={() => setTrailStarted(true)}>
                Start Trail
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhauGalliLive;
