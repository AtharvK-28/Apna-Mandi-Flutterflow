// Supplier-side seed data, lifted out of the 2,000-line dashboard component it
// used to live inside. Each view imports only the slice it needs.

export const QUICK_STATS = [
  { title: "Today's orders", value: '24', change: '+12%', changeType: 'positive', icon: 'Package' },
  { title: 'Revenue today', value: '₹12,450', change: '+8%', changeType: 'positive', icon: 'TrendingUp' },
  { title: 'Pending deliveries', value: '8', change: '-3', changeType: 'negative', icon: 'Truck' },
  { title: 'Vendor rating', value: '4.8', change: '+0.2', changeType: 'positive', icon: 'Star' },
];

export const REVENUE_DATA = {
  week: [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1800 },
    { day: 'Wed', revenue: 1500 },
    { day: 'Thu', revenue: 2200 },
    { day: 'Fri', revenue: 1900 },
    { day: 'Sat', revenue: 2400 },
    { day: 'Sun', revenue: 2100 },
  ],
  month: [
    { week: 'Week 1', revenue: 8500 },
    { week: 'Week 2', revenue: 9200 },
    { week: 'Week 3', revenue: 7800 },
    { week: 'Week 4', revenue: 10500 },
  ],
};

export const INVENTORY_ALERTS = [
  {
    id: 1,
    type: 'low_stock',
    productName: 'Fresh Tomatoes',
    message: 'Stock is running low',
    currentStock: 5,
    minimumStock: 10,
    unit: 'kg',
  },
  {
    id: 2,
    type: 'expiring',
    productName: 'Milk',
    message: 'Expires in 2 days',
    currentStock: 8,
    minimumStock: 5,
    unit: 'liters',
    expiryDate: '2026-08-21',
  },
  {
    id: 3,
    type: 'low_stock',
    productName: 'Besan',
    message: 'Below the level the Dadar pool needs',
    currentStock: 12,
    minimumStock: 25,
    unit: 'kg',
  },
];

export const ORDERS = [
  {
    id: 1,
    orderId: '#ORD001',
    customerName: 'Rajesh Corner · Dadar',
    items: 3,
    totalAmount: 450,
    routeName: 'Dadar Morning Run',
    estimatedTime: '30 mins',
    status: 'Pending',
  },
  {
    id: 2,
    orderId: '#ORD002',
    customerName: 'Mumbai Dosa Corner · Dadar',
    items: 4,
    totalAmount: 630,
    routeName: 'Dadar Morning Run',
    estimatedTime: '30 mins',
    status: 'Confirmed',
  },
  {
    id: 3,
    orderId: '#ORD003',
    customerName: 'Spice Garden · Bandra',
    items: 2,
    totalAmount: 320,
    routeName: 'Bandra Loop',
    estimatedTime: '45 mins',
    status: 'Pending',
  },
  {
    id: 4,
    orderId: '#ORD004',
    customerName: 'Delhi Chaat House · Andheri',
    items: 5,
    totalAmount: 780,
    routeName: 'Andheri Express',
    estimatedTime: '55 mins',
    status: 'Confirmed',
  },
];

// Mandi Pools — many stalls buying together so one delivery serves all of them.
export const POOL_ORDERS = [
  {
    id: 'POOL001',
    customerName: 'Dadar Vada Pav Pool',
    vendorCount: 8,
    pickupPoint: 'Dadar Station West',
    items: [
      { name: 'Potatoes', quantity: 100, unit: 'kg' },
      { name: 'Onions', quantity: 50, unit: 'kg' },
      { name: 'Besan', quantity: 25, unit: 'kg' },
    ],
    totalAmount: 8500,
    status: 'Pending',
    deliveryDate: 'Tomorrow, 6–8 AM',
    priority: 'high',
  },
  {
    id: 'POOL002',
    customerName: 'Bandra Breakfast Pool',
    vendorCount: 5,
    pickupPoint: 'Bandra Market',
    items: [
      { name: 'Idli Rice', quantity: 60, unit: 'kg' },
      { name: 'Urad Dal', quantity: 20, unit: 'kg' },
      { name: 'Milk', quantity: 80, unit: 'liters' },
    ],
    totalAmount: 12000,
    status: 'Confirmed',
    deliveryDate: 'Tomorrow, 7–9 AM',
    priority: 'medium',
  },
];

export const DELIVERY_ROUTES = [
  {
    id: 1,
    name: 'Dadar Morning Run',
    totalDistance: '8.5 km',
    estimatedTime: '45 mins',
    stops: [
      { id: 1, name: 'Rajesh Corner' },
      { id: 2, name: 'Raju Chaat Wala' },
      { id: 3, name: 'Mumbai Dosa Corner' },
    ],
    status: 'active',
  },
  {
    id: 2,
    name: 'Bandra Loop',
    totalDistance: '12.2 km',
    estimatedTime: '60 mins',
    stops: [
      { id: 4, name: 'Spice Garden' },
      { id: 5, name: 'Sitara Chaat' },
    ],
    status: 'planned',
  },
  {
    id: 3,
    name: 'Andheri Express',
    totalDistance: '15.4 km',
    estimatedTime: '55 mins',
    stops: [
      { id: 6, name: 'Delhi Chaat House' },
      { id: 7, name: 'Spice King' },
    ],
    status: 'planned',
  },
];

// Staffed collection points — vendors collect rather than each getting a drop.
export const PICKUP_POINTS = [
  {
    id: 1,
    name: 'Dadar Station West',
    location: 'Behind the bus stop at Dadar Station West',
    coordinates: '19.0170, 72.8478',
    status: 'inactive',
    totalOrders: 0,
    completedOrders: 0,
  },
  {
    id: 2,
    name: 'Bandra Market',
    location: 'Near Bandra Station, opposite the bus depot',
    coordinates: '19.0596, 72.8295',
    status: 'inactive',
    totalOrders: 0,
    completedOrders: 0,
  },
  {
    id: 3,
    name: 'Andheri Station',
    location: 'Andheri Station East, near the auto stand',
    coordinates: '19.1197, 72.8464',
    status: 'inactive',
    totalOrders: 0,
    completedOrders: 0,
  },
];

export const TOP_PRODUCTS = [
  { name: 'Fresh Tomatoes', sales: 450, growth: '+15%' },
  { name: 'Onions', sales: 320, growth: '+8%' },
  { name: 'Milk', sales: 280, growth: '+12%' },
  { name: 'Potatoes', sales: 265, growth: '+6%' },
];

export const TOP_VENDORS = [
  { name: 'Rajesh Corner · Dadar', orders: 25, revenue: 45000 },
  { name: 'Mumbai Dosa Corner · Dadar', orders: 18, revenue: 32000 },
  { name: 'Delhi Chaat House · Andheri', orders: 15, revenue: 28000 },
];

export const SUPPLIER_NOTIFICATIONS = [
  {
    id: 1,
    type: 'orders',
    title: 'Mandi Pool filled',
    message: 'Dadar Vada Pav Pool hit 8 vendors — ready to process',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    priority: 'high',
    actionRequired: true,
  },
  {
    id: 2,
    type: 'inventory',
    title: 'Low stock',
    message: 'Fresh Tomatoes below minimum',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: 'medium',
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment received',
    message: '₹630 UPI payment from Mumbai Dosa Corner',
    timestamp: new Date(Date.now() - 40 * 60 * 1000),
    read: true,
    priority: 'normal',
  },
];
