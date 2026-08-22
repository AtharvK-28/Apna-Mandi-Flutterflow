import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {
  const { firstName, isGuest } = useAuth();
  const quickActions = [
    { to: '/karigar-connect', icon: 'Plus', label: 'Post a gig', tint: 'bg-terracotta-light text-terracotta-dark' },
    { to: '/vendor-exchange', icon: 'RefreshCw', label: 'Exchange', tint: 'bg-leaf-light text-leaf-dark' },
    { to: '/khau-galli', icon: 'MapPin', label: 'Khau Galli', tint: 'bg-chili-light text-chili' },
    { to: '/deals', icon: 'Tag', label: 'Mandi deals', tint: 'bg-turmeric-light text-turmeric-dark' },
  ];

  const trendingFood = [
    { name: 'Vada Pav', price: 20, orders: '120+ today', image: '/assets/images/vada_pav_masala.jpeg' },
    { name: 'Masala Dosa', price: 60, orders: '86 today', image: '/assets/images/idly_batter.jpeg' },
    { name: 'Pani Puri', price: 40, orders: '210+ today', image: '/assets/images/pani_puri_paani.jpeg' },
    { name: 'Kolhapuri Chaat', price: 50, orders: '64 today', image: '/assets/images/kolhapuri_chutney_sitagita.jpeg' },
  ];

  const recentGigs = [
    { id: 1, title: 'Chinese Wok Master', vendor: 'Spice Garden', location: 'Bandra', distance: '1.2 km', pay: 900, urgency: 'Urgent', icon: 'Flame' },
    { id: 2, title: 'Juice Stall Cover', vendor: 'Rajesh Corner', location: 'Dadar', distance: '0.6 km', pay: 750, urgency: 'Medium', icon: 'CupSoda' },
    { id: 3, title: 'Bulk Veg Chopping', vendor: 'Mumbai Chinese', location: 'Bandra', distance: '1.8 km', pay: 240, urgency: 'Medium', icon: 'UtensilsCrossed' },
  ];

  const modules = [
    {
      to: '/vendor-exchange',
      icon: 'RefreshCw',
      title: 'Vendor Exchange',
      desc: 'Trade surplus ingredients with nearby stalls. Less waste, more margin.',
      badge: 'Phase 2',
      tile: 'bg-leaf-light text-leaf-dark',
      cta: 'Preview',
    },
    {
      to: '/virasaat',
      icon: 'Crown',
      title: 'Virasaat',
      desc: 'License legendary recipes from master vendors. Turn taste into legacy.',
      badge: 'Phase 3',
      tile: 'bg-turmeric-light text-turmeric-dark',
      cta: 'Preview',
    },
    {
      to: '/khau-galli',
      icon: 'MapPin',
      title: 'Khau Galli Live',
      desc: "See what's cooking near you right now. Skip queues, follow food trails.",
      badge: 'Live',
      live: true,
      tile: 'bg-chili-light text-chili',
      cta: 'Open map',
    },
  ];

  return (
    <div className="min-h-screen font-body">
      <Helmet>
        <title>Apna Mandi — Kitchen Help, On Demand</title>
      </Helmet>

      <Header />

      <div id="main-content" tabIndex={-1} className="outline-none max-w-5xl mx-auto px-4 pt-6 pb-14">

        {/* Greeting */}
        <div className="flex items-end justify-between mb-5 px-1">
          <div>
            <p className="text-ink-medium text-sm font-medium mb-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {/* A guest has no name, so they are welcomed rather than greeted by
                a placeholder person — which is what the old fallback did. */}
            <h2 className="font-display font-extrabold text-[26px] md:text-3xl text-ink leading-tight">
              {firstName ? `Namaste, ${firstName}` : 'Namaste'}
            </h2>
            {isGuest && (
              <p className="text-ink-medium text-sm mt-1">
                You're browsing as a guest.{' '}
                <Link to="/login" className="font-bold text-terracotta hover:text-terracotta-dark">
                  Sign in
                </Link>{' '}
                to order, hire and trade.
              </p>
            )}
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ink-light bg-paper-light border border-paper-dark/70 px-3 py-1.5 rounded-full">
            <Icon name="MapPin" size={13} className="text-terracotta" />
            Dadar, Mumbai
          </span>
        </div>

        {/* Hero */}
        <div className="relative rounded-[26px] overflow-hidden shadow-[0_24px_40px_-20px_rgba(40,25,12,.55)] mb-4">
          <img
            src="/assets/images/rekha_chaat.jpeg"
            alt="Street food stall"
            className="w-full h-[250px] md:h-[300px] object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(28,20,13,.1) 0%, rgba(28,20,13,.3) 40%, rgba(94,32,14,.94) 100%)' }}
          />
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-[10px] font-bold tracking-[0.14em] px-3 py-1.5 rounded-full border border-white/25">
              <span className="w-1.5 h-1.5 rounded-full bg-leaf-dark animate-pulse" />
              KARIGAR CONNECT · LIVE
            </span>
          </div>
          <div className="absolute left-5 right-5 bottom-5 text-white">
            <h2 className="font-display font-extrabold text-[28px] md:text-4xl leading-[1.1] mb-1.5 [text-shadow:0_2px_12px_rgba(0,0,0,.35)]">
              Need an extra pair of hands?
            </h2>
            <p className="text-white/85 text-sm md:text-base mb-4 max-w-md">
              18 skilled karigars are online near Dadar right now.
            </p>
            <div className="flex gap-2.5">
              <Link
                to="/karigar-connect"
                className="press flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-paper-light text-terracotta-dark font-bold text-sm px-5 py-3 rounded-2xl hover:brightness-95 transition"
              >
                <Icon name="Plus" size={16} />
                Post a gig
              </Link>
              <Link
                to="/karigar-connect"
                className="press inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-md text-white border border-white/40 font-bold text-sm px-5 py-3 rounded-2xl hover:bg-white/25 transition-colors"
              >
                <Icon name="Search" size={15} />
                Find work
              </Link>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2.5 mb-7">
          {quickActions.map(action => (
            <Link
              key={action.label}
              to={action.to}
              className="press card-warm flex flex-col items-center gap-2 py-3.5 px-1 hover:shadow-md transition-shadow"
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.tint}`}>
                <Icon name={action.icon} size={18} />
              </span>
              <span className="text-[11px] font-bold text-ink-light text-center leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-7">
          {[
            { icon: 'Briefcase', tint: 'bg-terracotta-light text-terracotta-dark', value: '24', label: 'Active gigs', pulse: false },
            { icon: 'Users', tint: 'bg-leaf-light text-leaf-dark', value: '18', label: 'Karigars online', pulse: true },
            { icon: 'IndianRupee', tint: 'bg-turmeric-light text-turmeric-dark', value: '₹640', label: 'Avg gig pay', pulse: false },
          ].map(stat => (
            <div key={stat.label} className="card-warm p-3 md:p-3.5 flex items-center gap-2.5 md:gap-3">
              <div className={`relative w-10 h-10 rounded-xl flex max-[380px]:hidden items-center justify-center flex-shrink-0 ${stat.tint}`}>
                <Icon name={stat.icon} size={18} />
                {stat.pulse && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-leaf ring-2 ring-paper-light animate-pulse" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-display font-extrabold text-lg md:text-xl text-ink leading-none">{stat.value}</div>
                <div className="text-ink-medium text-[10px] md:text-[11px] font-semibold mt-1 leading-tight">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending Food */}
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h3 className="font-display font-bold text-lg text-ink">Trending near you</h3>
          <Link to="/deals" className="press inline-flex items-center gap-1 text-terracotta font-bold text-xs hover:text-terracotta-dark transition-colors">
            See all <Icon name="ArrowRight" size={13} />
          </Link>
        </div>
        <div className="snap-row mb-7 md:grid md:grid-cols-4 md:overflow-visible md:mx-0 md:px-0">
          {trendingFood.map(food => (
            <div key={food.name} className="press card-warm overflow-hidden w-[150px] md:w-auto">
              <div className="h-[104px] bg-paper-dark overflow-hidden">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-bold text-[13px] text-ink truncate">{food.name}</span>
                  <span className="font-display font-extrabold text-[13px] text-leaf-dark flex-shrink-0">₹{food.price}</span>
                </div>
                <div className="flex items-center gap-1 text-ink-medium text-[10px] font-semibold mt-1">
                  <Icon name="Flame" size={11} className="text-chili" />
                  {food.orders}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gigs Near You */}
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h3 className="font-display font-bold text-lg text-ink">Gigs near you</h3>
          <Link to="/karigar-connect" className="press inline-flex items-center gap-1 text-terracotta font-bold text-xs hover:text-terracotta-dark transition-colors">
            See all <Icon name="ArrowRight" size={13} />
          </Link>
        </div>
        <div className="flex flex-col gap-2.5 mb-8">
          {recentGigs.map(gig => (
            <Link
              key={gig.id}
              to="/karigar-connect"
              className="press card-warm p-4 flex gap-3.5 items-center hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                gig.urgency === 'Urgent' ? 'bg-chili-light text-chili' : 'bg-terracotta-light text-terracotta-dark'
              }`}>
                <Icon name={gig.icon} size={21} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-ink truncate">{gig.title}</span>
                  {gig.urgency === 'Urgent' && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-chili-light text-chili flex-shrink-0">
                      <span className="w-[5px] h-[5px] rounded-full bg-chili animate-pulse" />
                      Urgent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-ink-medium text-xs mt-1">
                  <span className="font-semibold">{gig.vendor}</span>
                  <span aria-hidden>·</span>
                  <Icon name="MapPin" size={11} />
                  {gig.location} · {gig.distance}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-display font-extrabold text-xl text-leaf-dark leading-none">₹{gig.pay}</div>
                <div className="text-ink-medium text-[10px] font-semibold mt-1">per shift</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore modules */}
        <div className="mb-3 px-1">
          <h3 className="font-display font-bold text-lg text-ink">Explore Apna Mandi</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modules.map(mod => (
            <Link key={mod.title} to={mod.to} className="press card-warm p-5 relative block hover:shadow-md transition-shadow">
              <span className={`absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${mod.tile}`}>
                {mod.live && <span className="w-1.5 h-1.5 rounded-full bg-chili animate-pulse" />}
                {mod.badge}
              </span>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 ${mod.tile}`}>
                <Icon name={mod.icon} size={22} />
              </div>
              <h4 className="font-display font-bold text-base text-ink">{mod.title}</h4>
              <p className="text-ink-medium text-[13px] mt-1 leading-relaxed">{mod.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold mt-3 text-terracotta">
                {mod.cta} <Icon name="ArrowRight" size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
