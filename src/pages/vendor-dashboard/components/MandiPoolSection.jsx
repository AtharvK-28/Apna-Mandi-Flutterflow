import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const initialPools = [
  {
    id: 1,
    item: 'Red Onions',
    unit: 'kg',
    soloPrice: 32,
    tiers: [
      { qty: 0, price: 28 },
      { qty: 30, price: 24 },
      { qty: 50, price: 19 }
    ],
    target: 50,
    pooled: 38,
    vendors: 7,
    closesIn: '3h 20m',
    supplier: 'Mumbai Wholesale Hub'
  },
  {
    id: 2,
    item: 'Cooking Oil (15L tins)',
    unit: 'tin',
    soloPrice: 1850,
    tiers: [
      { qty: 0, price: 1720 },
      { qty: 8, price: 1640 },
      { qty: 12, price: 1560 }
    ],
    target: 12,
    pooled: 9,
    vendors: 5,
    closesIn: '6h 45m',
    supplier: 'Pure Oils Co.'
  }
];

const currentTier = (pool) => {
  let tier = pool.tiers[0];
  for (const t of pool.tiers) {
    if (pool.pooled >= t.qty) tier = t;
  }
  return tier;
};

const nextTier = (pool) => pool.tiers.find(t => pool.pooled < t.qty) || null;

const MandiPoolSection = ({ onStartPool }) => {
  const [pools, setPools] = useState(initialPools);
  const [joined, setJoined] = useState({});
  const [joinQty, setJoinQty] = useState({});

  const getQty = (pool) => joinQty[pool.id] ?? Math.max(1, Math.round(pool.target / 10));

  const adjustQty = (pool, delta) => {
    setJoinQty(prev => ({ ...prev, [pool.id]: Math.max(1, getQty(pool) + delta) }));
  };

  const handleJoin = (pool) => {
    const qty = getQty(pool);
    setPools(prev => prev.map(p =>
      p.id === pool.id
        ? { ...p, pooled: Math.min(p.target, p.pooled + qty), vendors: p.vendors + 1 }
        : p
    ));
    setJoined(prev => ({ ...prev, [pool.id]: qty }));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-foreground">Mandi Pool</h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Icon name="Users" size={12} className="mr-1" />
            Corridor group buying
          </span>
        </div>
        <Button variant="ghost" size="sm" iconName="Plus" onClick={onStartPool}>
          Start a Pool
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pools.map((pool) => {
          const tier = currentTier(pool);
          const next = nextTier(pool);
          const isLocked = pool.pooled >= pool.target;
          const hasJoined = joined[pool.id] != null;
          const progress = Math.min(100, (pool.pooled / pool.target) * 100);
          const bestPrice = pool.tiers[pool.tiers.length - 1].price;

          return (
            <div key={pool.id} className="bg-card rounded-lg border border-border p-4 shadow-sm">
              {/* Item + price */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-card-foreground">{pool.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {pool.supplier} · closes in {pool.closesIn}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">₹{isLocked ? bestPrice : tier.price}<span className="text-xs font-normal text-muted-foreground">/{pool.unit}</span></p>
                  <p className="text-xs text-muted-foreground">
                    <span className="line-through">₹{pool.soloPrice}</span> buying alone
                  </p>
                </div>
              </div>

              {/* Progress toward best price */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    {pool.pooled} / {pool.target} {pool.unit} pooled · {pool.vendors} stalls in
                  </span>
                  {!isLocked && next && (
                    <span className="text-xs font-medium text-secondary">
                      +{next.qty - pool.pooled} {pool.unit} → ₹{next.price}/{pool.unit}
                    </span>
                  )}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isLocked ? 'bg-success' : 'bg-primary'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Join controls / states */}
              {isLocked ? (
                <div className="flex items-center justify-center py-2 text-success text-sm font-medium bg-success/10 rounded-md">
                  <Icon name="CheckCircle" size={16} className="mr-1.5" />
                  Pool locked — everyone pays ₹{bestPrice}/{pool.unit}
                </div>
              ) : hasJoined ? (
                <div className="flex items-center justify-center py-2 text-success text-sm font-medium bg-success/10 rounded-md">
                  <Icon name="CheckCircle" size={16} className="mr-1.5" />
                  You're in with {joined[pool.id]} {pool.unit} — price drops as more join
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => adjustQty(pool, -1)}
                      className="px-2.5 py-1.5 text-muted-foreground hover:text-card-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Icon name="Minus" size={14} />
                    </button>
                    <span className="px-2 text-sm font-medium text-card-foreground min-w-[3.5rem] text-center">
                      {getQty(pool)} {pool.unit}
                    </span>
                    <button
                      onClick={() => adjustQty(pool, 1)}
                      className="px-2.5 py-1.5 text-muted-foreground hover:text-card-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Icon name="Plus" size={14} />
                    </button>
                  </div>
                  <Button size="sm" iconName="Users" className="flex-1" onClick={() => handleJoin(pool)}>
                    Join Pool
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MandiPoolSection;
