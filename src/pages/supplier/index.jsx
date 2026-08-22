import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import PageShell from '../../components/ui/PageShell';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

import QuickStatsCard from './components/QuickStatsCard';
import RevenueChart from './components/RevenueChart';
import InventoryAlerts from './components/InventoryAlerts';
import OrderAggregationTable from './components/OrderAggregationTable';
import DeliveryRouteMap from './components/DeliveryRouteMap';

import {
  DELIVERY_ROUTES,
  INVENTORY_ALERTS,
  ORDERS,
  PICKUP_POINTS,
  POOL_ORDERS,
  QUICK_STATS,
  REVENUE_DATA,
  TOP_PRODUCTS,
  TOP_VENDORS,
} from '../../data/supplier';

/**
 * The supplier's workspace, split across four routes.
 *
 * This replaces a single 2,000-line page that stacked every table, chart and
 * modal on top of each other — the supplier's nav had nothing to point at
 * because there was only ever one screen.
 */

const VIEW_META = {
  overview: {
    title: 'Overview',
    subtitle: 'How the business is doing today, and what needs you first.',
  },
  orders: {
    title: 'Orders',
    subtitle: 'Individual vendor orders and the Mandi Pools they group into.',
  },
  inventory: {
    title: 'Inventory',
    subtitle: 'Stock levels, expiry warnings and what to restock before the morning run.',
  },
  deliveries: {
    title: 'Deliveries',
    subtitle: 'Routes for the day and the pickup points vendors collect from.',
  },
};

const SectionHeading = ({ title, hint, action }) => (
  <div className="flex items-baseline justify-between gap-3 mb-3 px-1">
    <div>
      <h2 className="font-display font-bold text-lg text-ink">{title}</h2>
      {hint && <p className="text-ink-medium text-xs mt-0.5">{hint}</p>}
    </div>
    {action}
  </div>
);

const SupplierWorkspace = ({ view = 'overview' }) => {
  const { firstName } = useAuth();
  const toast = useToast();
  const [revenuePeriod, setRevenuePeriod] = useState('week');
  const [selectedRoute, setSelectedRoute] = useState(DELIVERY_ROUTES[0]);
  const [orders, setOrders] = useState(ORDERS);
  const [pools, setPools] = useState(POOL_ORDERS);
  const [alerts, setAlerts] = useState(INVENTORY_ALERTS);

  const notify = (message) => toast.success(message);

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'Pending'), [orders]);
  const pendingValue = useMemo(
    () => pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    [pendingOrders],
  );

  const confirmOrder = (order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'Confirmed' } : o)),
    );
    notify(`${order.orderId} confirmed for ${order.customerName.split(' · ')[0]}.`);
  };

  const confirmPool = (pool) => {
    setPools((prev) => prev.map((p) => (p.id === pool.id ? { ...p, status: 'Confirmed' } : p)));
    notify(`${pool.customerName} confirmed — ${pool.vendorCount} vendors notified.`);
  };

  const restock = (alert, quantity) => {
    const added = Number(quantity) || 0;
    setAlerts((prev) =>
      // A restock that clears the minimum resolves the alert entirely.
      prev
        .map((a) =>
          a.id === alert.id ? { ...a, currentStock: a.currentStock + added } : a,
        )
        .filter((a) => a.type !== 'low_stock' || a.currentStock < a.minimumStock),
    );
    notify(`${alert.productName} restocked by ${added} ${alert.unit}.`);
  };

  const meta = VIEW_META[view] ?? VIEW_META.overview;
  const greeting = view === 'overview' && firstName ? `Good morning, ${firstName}` : meta.title;

  return (
    <PageShell
      title={greeting}
      documentTitle={`${meta.title} — Apna Mandi Supplier`}
      subtitle={meta.subtitle}
      width="wide"
    >
      {view === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
            {QUICK_STATS.map((stat) => (
              <QuickStatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={{
                  type: stat.changeType === 'positive' ? 'up' : 'down',
                  value: stat.change,
                }}
              />
            ))}
          </div>

          {/* What needs attention, before the charts */}
          {(pendingOrders.length > 0 || alerts.length > 0) && (
            <section className="mb-6">
              <SectionHeading title="Needs you now" />
              <div className="grid sm:grid-cols-2 gap-2.5">
                {pendingOrders.length > 0 && (
                  <Link
                    to="/supplier/orders"
                    className="press card-warm p-4 flex items-center gap-3.5 border-l-4 border-l-turmeric hover:shadow-md transition-shadow"
                  >
                    <span className="w-11 h-11 rounded-2xl bg-turmeric-light text-turmeric-dark flex items-center justify-center flex-shrink-0">
                      <Icon name="ClipboardCheck" size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[15px] text-ink">
                        {pendingOrders.length} orders awaiting confirmation
                      </p>
                      <p className="text-xs text-ink-medium mt-0.5">
                        ₹{pendingValue.toLocaleString('en-IN')} held up
                      </p>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-ink-medium flex-shrink-0" />
                  </Link>
                )}

                {alerts.length > 0 && (
                  <Link
                    to="/supplier/inventory"
                    className="press card-warm p-4 flex items-center gap-3.5 border-l-4 border-l-chili hover:shadow-md transition-shadow"
                  >
                    <span className="w-11 h-11 rounded-2xl bg-chili-light text-chili flex items-center justify-center flex-shrink-0">
                      <Icon name="AlertTriangle" size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[15px] text-ink">
                        {alerts.length} stock {alerts.length === 1 ? 'alert' : 'alerts'}
                      </p>
                      <p className="text-xs text-ink-medium mt-0.5 truncate">
                        {alerts.map((a) => a.productName).join(', ')}
                      </p>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-ink-medium flex-shrink-0" />
                  </Link>
                )}
              </div>
            </section>
          )}

          <section className="mb-6">
            <SectionHeading title="Revenue" hint="Gross sales before delivery and storage costs" />
            <RevenueChart
              data={REVENUE_DATA[revenuePeriod] ?? REVENUE_DATA.week}
              period={revenuePeriod}
              onPeriodChange={setRevenuePeriod}
            />
          </section>

          <div className="grid lg:grid-cols-2 gap-4">
            <section>
              <SectionHeading title="Top products" hint="By units sold this month" />
              <div className="card-warm divide-y divide-paper-dark/50">
                {TOP_PRODUCTS.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-7 h-7 rounded-lg bg-paper-dark/60 text-ink-light font-display font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-sm text-ink flex-1 min-w-0 truncate">
                      {product.name}
                    </span>
                    <span className="text-sm font-bold text-ink-light">{product.sales} kg</span>
                    <span className="text-xs font-bold text-leaf-dark w-12 text-right">
                      {product.growth}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading title="Top vendors" hint="By revenue this month" />
              <div className="card-warm divide-y divide-paper-dark/50">
                {TOP_VENDORS.map((vendor, index) => (
                  <div key={vendor.name} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-7 h-7 rounded-lg bg-paper-dark/60 text-ink-light font-display font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink truncate">{vendor.name}</p>
                      <p className="text-xs text-ink-medium">{vendor.orders} orders</p>
                    </div>
                    <span className="font-display font-bold text-sm text-ink">
                      ₹{vendor.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {view === 'orders' && (
        <>
          <section className="mb-8">
            <SectionHeading
              title="Vendor orders"
              hint={`${pendingOrders.length} of ${orders.length} still need confirming`}
            />
            <OrderAggregationTable
              orders={orders}
              onConfirmOrder={confirmOrder}
              onViewRoute={(order) =>
                setSelectedRoute(
                  DELIVERY_ROUTES.find((r) => r.name === order.routeName) ?? DELIVERY_ROUTES[0],
                )
              }
            />
          </section>

          <section>
            <SectionHeading
              title="Mandi Pools"
              hint="Several stalls buying together — one delivery covers all of them"
            />
            {pools.length ? (
              <div className="grid md:grid-cols-2 gap-3">
                {pools.map((pool) => (
                  <article key={pool.id} className="card-warm p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[15px] text-ink">{pool.customerName}</h3>
                        <p className="text-xs text-ink-medium mt-0.5 flex items-center gap-1">
                          <Icon name="Users" size={11} />
                          {pool.vendorCount} vendors
                          <span aria-hidden>·</span>
                          <Icon name="MapPin" size={11} />
                          {pool.pickupPoint}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                          pool.status === 'Confirmed'
                            ? 'bg-leaf-light text-leaf-dark'
                            : 'bg-turmeric-light text-turmeric-dark'
                        }`}
                      >
                        {pool.status}
                      </span>
                    </div>

                    <ul className="space-y-1 mb-3">
                      {pool.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-center justify-between text-sm text-ink-light"
                        >
                          <span>{item.name}</span>
                          <span className="font-semibold text-ink">
                            {item.quantity} {item.unit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-paper-dark/60">
                      <div>
                        <p className="font-display font-extrabold text-xl text-ink leading-none">
                          ₹{pool.totalAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] font-semibold text-ink-medium mt-1">
                          {pool.deliveryDate}
                        </p>
                      </div>
                      {pool.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => confirmPool(pool)}
                          className="press text-xs font-bold text-white bg-terracotta px-4 py-2 rounded-xl hover:bg-terracotta-dark transition-colors"
                        >
                          Confirm pool
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-dark">
                          <Icon name="Check" size={14} />
                          Confirmed
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="Users"
                title="No pools forming"
                description="When several vendors in one area order the same goods, Apna Mandi groups them into a pool and it shows up here."
              />
            )}
          </section>
        </>
      )}

      {view === 'inventory' && (
        <>
          <SectionHeading
            title="Stock alerts"
            hint={
              alerts.length
                ? 'Restock these before tomorrow’s morning run'
                : 'Everything is above its minimum level'
            }
          />
          {alerts.length ? (
            <InventoryAlerts
              alerts={alerts}
              onRestockItem={restock}
              onUpdateStock={restock}
            />
          ) : (
            <EmptyState
              icon="PackageCheck"
              title="Stock is healthy"
              description="No product is below its minimum level and nothing is close to expiry."
            />
          )}
        </>
      )}

      {view === 'deliveries' && (
        <>
          <section className="mb-8">
            <SectionHeading
              title="Routes"
              hint={`${DELIVERY_ROUTES.length} routes covering ${DELIVERY_ROUTES.reduce(
                (sum, r) => sum + r.stops.length,
                0,
              )} stops`}
            />
            <DeliveryRouteMap
              routes={DELIVERY_ROUTES}
              selectedRoute={selectedRoute}
              onRouteSelect={setSelectedRoute}
              onOptimizeRoute={(route) => notify(`${route.name} re-ordered for the shortest run.`)}
            />
          </section>

          <section>
            <SectionHeading
              title="Pickup points"
              hint="Vendors collect from these instead of each getting a separate drop"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PICKUP_POINTS.map((point) => (
                <article key={point.id} className="card-warm p-4">
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-xl bg-terracotta-light text-terracotta-dark flex items-center justify-center flex-shrink-0">
                      <Icon name="MapPin" size={18} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[15px] text-ink">{point.name}</h3>
                      <p className="text-xs text-ink-medium mt-0.5 leading-relaxed">
                        {point.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-paper-dark/60">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-medium">
                      <span className="w-2 h-2 rounded-full bg-ink-medium/50" />
                      Collection window closed
                    </span>
                    <button
                      type="button"
                      onClick={() => notify(`Collection window opened at ${point.name}.`)}
                      className="press text-xs font-bold text-terracotta-dark hover:text-terracotta transition-colors"
                    >
                      Open window
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

    </PageShell>
  );
};

export default SupplierWorkspace;
