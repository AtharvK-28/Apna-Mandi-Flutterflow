import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/AppIcon';
import { HomeRedirect, Protected, PublicOnly } from 'components/RouteGuard';
import FloatingCartButton from 'components/ui/FloatingCartButton';
import { ROLES } from 'config/roles';

const { VENDOR, KARIGAR, SUPPLIER } = ROLES;

// Pages are lazy-loaded so each route ships as its own chunk.
const Authentication = lazy(() => import('pages/authentication-login-register'));
const Home = lazy(() => import('pages/home'));
const VendorDashboard = lazy(() => import('pages/vendor-dashboard'));
const DealDiscovery = lazy(() => import('pages/deal-discovery-shopping'));
const ShoppingCart = lazy(() => import('pages/shopping-cart-checkout'));
const OrderHistory = lazy(() => import('pages/order-tracking-history'));
const KarigarConnect = lazy(() => import('pages/karigar-connect'));
const VendorExchange = lazy(() => import('pages/vendor-exchange'));
const Virasaat = lazy(() => import('pages/virasaat'));
const KhauGalliLive = lazy(() => import('pages/khau-galli-live'));
const Profile = lazy(() => import('pages/profile'));
const NotFound = lazy(() => import('pages/NotFound'));

const FindWork = lazy(() => import('pages/karigar/find-work'));
const MyWork = lazy(() => import('pages/karigar/my-work'));
const Earnings = lazy(() => import('pages/karigar/earnings'));
const Messages = lazy(() => import('pages/karigar/messages'));

const SupplierWorkspace = lazy(() => import('pages/supplier'));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terracotta to-chili flex items-center justify-center text-white shadow-[0_10px_24px_-10px_rgba(192,83,46,.8)] animate-bounce-gentle">
      <Icon name="Store" size={26} />
    </div>
    <p className="font-display font-bold text-ink-medium text-sm tracking-wide">Apna Mandi</p>
  </div>
);

const Routes = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <RouterRoutes>
          {/* Entry — sends each visitor to their own front door */}
          <Route path="/" element={<HomeRedirect />} />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Authentication />
              </PublicOnly>
            }
          />

          {/* ── Vendor ─────────────────────────────────────────────────────── */}
          <Route
            path="/home"
            element={
              <Protected allow={[VENDOR]} allowGuest>
                <Home />
              </Protected>
            }
          />
          <Route
            path="/deals"
            element={
              <Protected allow={[VENDOR]} allowGuest>
                <DealDiscovery />
              </Protected>
            }
          />
          <Route
            path="/khau-galli"
            element={
              <Protected allow={[VENDOR]} allowGuest>
                <KhauGalliLive />
              </Protected>
            }
          />
          <Route
            path="/cart"
            element={
              <Protected allow={[VENDOR]}>
                <ShoppingCart />
              </Protected>
            }
          />
          <Route
            path="/orders"
            element={
              <Protected allow={[VENDOR]}>
                <OrderHistory />
              </Protected>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Protected allow={[VENDOR]}>
                <VendorDashboard />
              </Protected>
            }
          />
          <Route
            path="/karigar-connect"
            element={
              <Protected allow={[VENDOR]}>
                <KarigarConnect />
              </Protected>
            }
          />
          <Route
            path="/vendor-exchange"
            element={
              <Protected allow={[VENDOR]}>
                <VendorExchange />
              </Protected>
            }
          />
          <Route
            path="/virasaat"
            element={
              <Protected allow={[VENDOR]}>
                <Virasaat />
              </Protected>
            }
          />

          {/* ── Karigar ────────────────────────────────────────────────────── */}
          <Route path="/karigar" element={<Navigate to="/karigar/find-work" replace />} />
          <Route
            path="/karigar/find-work"
            element={
              <Protected allow={[KARIGAR]}>
                <FindWork />
              </Protected>
            }
          />
          <Route
            path="/karigar/my-work"
            element={
              <Protected allow={[KARIGAR]}>
                <MyWork />
              </Protected>
            }
          />
          <Route
            path="/karigar/earnings"
            element={
              <Protected allow={[KARIGAR]}>
                <Earnings />
              </Protected>
            }
          />
          <Route
            path="/karigar/messages"
            element={
              <Protected allow={[KARIGAR]}>
                <Messages />
              </Protected>
            }
          />

          {/* ── Supplier ───────────────────────────────────────────────────── */}
          <Route
            path="/supplier"
            element={
              <Protected allow={[SUPPLIER]}>
                <SupplierWorkspace view="overview" />
              </Protected>
            }
          />
          <Route
            path="/supplier/orders"
            element={
              <Protected allow={[SUPPLIER]}>
                <SupplierWorkspace view="orders" />
              </Protected>
            }
          />
          <Route
            path="/supplier/inventory"
            element={
              <Protected allow={[SUPPLIER]}>
                <SupplierWorkspace view="inventory" />
              </Protected>
            }
          />
          <Route
            path="/supplier/deliveries"
            element={
              <Protected allow={[SUPPLIER]}>
                <SupplierWorkspace view="deliveries" />
              </Protected>
            }
          />

          {/* ── Shared ─────────────────────────────────────────────────────── */}
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />

          {/* Legacy aliases — one canonical URL per page, these only redirect.
              Every page used to answer on two paths, which split analytics and
              meant any route change had to be made in two places. */}
          <Route path="/authentication-login-register" element={<Navigate to="/login" replace />} />
          <Route path="/vendor-dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/deal-discovery-shopping" element={<Navigate to="/deals" replace />} />
          <Route path="/shopping-cart-checkout" element={<Navigate to="/cart" replace />} />
          <Route path="/order-tracking-history" element={<Navigate to="/orders" replace />} />
          <Route path="/supplier-dashboard" element={<Navigate to="/supplier" replace />} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </Suspense>

      {/* Inside the router so it can read the current route and navigate
          without a full page reload; it hides itself for non-buyers. */}
      <FloatingCartButton />
    </ErrorBoundary>
  </BrowserRouter>
);

export default Routes;
