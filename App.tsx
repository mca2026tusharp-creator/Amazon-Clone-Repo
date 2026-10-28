import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  Star,
  Check,
  TrendingUp,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  X,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  Menu,
  Clock,
  Sparkles,
  ArrowRight,
  Box,
  Layers,
  Heart,
  Eye
} from 'lucide-react';

// --- Types ---
interface Product {
  id: string;
  title: string;
  category: 'Audio' | 'Wearables' | 'Smart Home' | 'Computing';
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isPrime: boolean;
  deliveryDate: string;
  badge?: string;
  description: string;
  specs: string[];
  color: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderRecord {
  id: string;
  customer: string;
  item: string;
  amount: number;
  status: 'Delivered' | 'In Transit' | 'Fulfilling';
  carrier: string;
  tracking: string;
  time: string;
}

type DashboardRange = '7D' | '30D' | '1Y';

export default function App() {
  // Navigation & Drawer states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Seller Dashboard state (Requirement: Clean modern UI card/mockup illustrating an analytics or transaction dashboard preview)
  const [dashboardRange, setDashboardRange] = useState<DashboardRange>('30D');
  const [dashboardTab, setDashboardTab] = useState<'orders' | 'inventory' | 'performance'>('orders');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number } | null>(null);

  // Static Products Catalog
  const products: Product[] = [
    {
      id: 'prod-001',
      title: 'Echo Studio Pro - High-Fidelity Smart Audio Hub with Dolby Atmos',
      category: 'Smart Home',
      price: 199.99,
      originalPrice: 239.99,
      rating: 4.8,
      reviewCount: 18450,
      inStock: true,
      isPrime: true,
      deliveryDate: 'Tomorrow by 10 PM',
      badge: "Amazon's Choice",
      description: 'Immersive 3D audio experience with automated room acoustic calibration and integrated Zigbee smart home hub.',
      specs: ['Dolby Atmos & Spatial Audio', '5 Directional Speakers', 'Built-in Smart Home Hub', 'Lossless HD Streaming'],
      color: '#1e293b',
    },
    {
      id: 'prod-002',
      title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
      category: 'Audio',
      price: 348.00,
      originalPrice: 399.99,
      rating: 4.9,
      reviewCount: 32900,
      inStock: true,
      isPrime: true,
      deliveryDate: 'Tomorrow by 2 PM',
      badge: 'Best Seller',
      description: 'Industry-leading noise cancellation with two processors and 8 microphones for unmatched silence and crystal-clear calls.',
      specs: ['30-Hour Battery Life', 'Auto NC Optimizer', 'Multipoint Connection', 'Speak-to-Chat Technology'],
      color: '#0f172a',
    },
    {
      id: 'prod-003',
      title: 'Apple Watch Ultra 2 [GPS + Cellular 49mm] Rugged Titanium Case',
      category: 'Wearables',
      price: 749.00,
      originalPrice: 799.00,
      rating: 4.8,
      reviewCount: 9420,
      inStock: true,
      isPrime: true,
      deliveryDate: 'Thursday, Oct 29',
      badge: 'Top Rated',
      description: 'The ultimate sports and adventure watch. 49mm aerospace-grade titanium case with up to 36 hours of battery.',
      specs: ['Precision Dual-Frequency GPS', '3000 Nits Brightness', '100m Water Resistant', 'Action Button Configurable'],
      color: '#334155',
    },
    {
      id: 'prod-004',
      title: 'Kindle Paperwhite Signature Edition (32 GB) - Wireless Charging',
      category: 'Smart Home',
      price: 159.99,
      originalPrice: 189.99,
      rating: 4.7,
      reviewCount: 42100,
      inStock: true,
      isPrime: true,
      deliveryDate: 'Tomorrow by 10 PM',
      badge: 'Holiday Deal',
      description: '6.8-inch glare-free display with auto-adjusting warm front light and weeks of battery life on a single charge.',
      specs: ['32 GB Internal Storage', 'Qi Wireless Charging', 'IPX8 Waterproof', 'Warm Light Temperature Control'],
      color: '#0284c7',
    },
    {
      id: 'prod-005',
      title: 'MacBook Air 15-inch M3 Chip - 16GB Unified Memory, 512GB SSD',
      category: 'Computing',
      price: 1349.00,
      originalPrice: 1499.00,
      rating: 4.9,
      reviewCount: 8120,
      inStock: true,
      isPrime: true,
      deliveryDate: 'Friday, Oct 30',
      badge: 'Lowest Price in 30 Days',
      description: 'Strikingly thin design with the lightning-fast Apple M3 processor and up to 18 hours of battery longevity.',
      specs: ['15.3" Liquid Retina Display', 'M3 8-Core CPU / 10-Core GPU', 'MagSafe 3 Charging', '1080p FaceTime HD Camera'],
      color: '#1e1b4b',
    },
    {
      id: 'prod-006',
      title: 'Anker Prime 20,000mAh Power Bank (200W Output with Smart Display)',
      category: 'Computing',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.7,
      reviewCount: 15200,
      inStock: true,
      isPrime: true,
      deliveryDate: 'Tomorrow by 6 PM',
      badge: 'Deal of the Day',
      description: 'Ultra-fast multi-device charging featuring dual USB-C ports delivering up to 100W each simultaneously.',
      specs: ['200W Total Output', 'Real-Time Smart Display', 'Rapid 100W Recharge', 'ActiveShield 2.0 Safety'],
      color: '#0f766e',
    },
  ];

  // Initial cart with sample products
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 1 },
  ]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // Filter products by category and search
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic Dashboard Metrics based on range
  const dashboardData = useMemo(() => {
    switch (dashboardRange) {
      case '7D':
        return {
          totalSales: '$28,420.00',
          salesGrowth: '+12.4%',
          unitsSold: '482 units',
          buyBoxWin: '98.2%',
          primeOnTime: '99.9%',
          chartPoints: [
            { label: 'Mon', value: 3400 },
            { label: 'Tue', value: 4100 },
            { label: 'Wed', value: 3800 },
            { label: 'Thu', value: 4600 },
            { label: 'Fri', value: 5200 },
            { label: 'Sat', value: 4300 },
            { label: 'Sun', value: 3020 },
          ],
        };
      case '1Y':
        return {
          totalSales: '$1,248,500.00',
          salesGrowth: '+26.8%',
          unitsSold: '19,450 units',
          buyBoxWin: '97.5%',
          primeOnTime: '99.7%',
          chartPoints: [
            { label: 'Q1', value: 270000 },
            { label: 'Q2', value: 310000 },
            { label: 'Q3', value: 328000 },
            { label: 'Q4', value: 340500 },
          ],
        };
      case '30D':
      default:
        return {
          totalSales: '$94,820.50',
          salesGrowth: '+15.6%',
          unitsSold: '1,642 units',
          buyBoxWin: '98.5%',
          primeOnTime: '99.8%',
          chartPoints: [
            { label: 'Week 1', value: 18500 },
            { label: 'Week 2', value: 22400 },
            { label: 'Week 3', value: 24800 },
            { label: 'Week 4', value: 29120 },
          ],
        };
    }
  }, [dashboardRange]);

  // Static order records for Seller operations table
  const orders: OrderRecord[] = [
    {
      id: '114-98420-99120',
      customer: 'Sarah Jenkins',
      item: 'Sony WH-1000XM5 Headphones (Black)',
      amount: 348.00,
      status: 'Delivered',
      carrier: 'Amazon Logistics',
      tracking: 'TBA9842109402',
      time: 'Delivered Today 11:24 AM',
    },
    {
      id: '114-98419-77281',
      customer: 'Michael Roberts',
      item: 'Echo Studio Pro Hub with Atmos',
      amount: 199.99,
      status: 'In Transit',
      carrier: 'Amazon Logistics',
      tracking: 'TBA7728192041',
      time: 'Out for delivery by 8 PM',
    },
    {
      id: '114-98418-55210',
      customer: 'Emily Chen',
      item: 'Kindle Paperwhite Signature 32GB',
      amount: 159.99,
      status: 'Fulfilling',
      carrier: 'FBA Fulfillment Center - JFK8',
      tracking: 'TBA5521049281',
      time: 'Package dispatched from dock',
    },
    {
      id: '114-98417-33190',
      customer: 'David Miller',
      item: 'Apple Watch Ultra 2 (Titanium)',
      amount: 749.00,
      status: 'Delivered',
      carrier: 'UPS Express Prime',
      tracking: '1Z99482019482',
      time: 'Delivered Yesterday 3:15 PM',
    },
    {
      id: '114-98416-11840',
      customer: 'Amanda Patel',
      item: 'Anker Prime 200W Power Bank',
      amount: 89.99,
      status: 'Delivered',
      carrier: 'Amazon Logistics',
      tracking: 'TBA1184029481',
      time: 'Delivered Yesterday 1:40 PM',
    },
  ];

  // SVG Chart Math
  const maxVal = Math.max(...dashboardData.chartPoints.map((p) => p.value));
  const minVal = Math.min(...dashboardData.chartPoints.map((p) => p.value)) * 0.85;
  const chartW = 580;
  const chartH = 150;

  const chartCoords = dashboardData.chartPoints.map((pt, idx) => {
    const x = (idx / (dashboardData.chartPoints.length - 1)) * (chartW - 40) + 20;
    const y = chartH - ((pt.value - minVal) / (maxVal - minVal)) * (chartH - 40) - 20;
    return { x, y, label: pt.label, value: pt.value };
  });

  const chartPath = chartCoords.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    const prev = chartCoords[index - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const chartArea = `${chartPath} L ${chartCoords[chartCoords.length - 1].x} ${chartH} L ${chartCoords[0].x} ${chartH} Z`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col antialiased">
      {/* =========================================================================
          HEADER 1: AMAZON DARK NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white shadow-md">
        {/* Main Header Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo with Amazon Smile Mark */}
          <a
            href="/"
            className="flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff9900] rounded p-1 group shrink-0"
            aria-label="Amazon Commerce Home"
          >
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-2xl font-black tracking-tight text-white">amazon</span>
                <span className="text-xs font-bold text-[#ff9900] ml-1">commerce</span>
              </div>
              {/* Iconic Smile Arrow */}
              <svg viewBox="0 0 100 24" className="w-18 h-3.5 fill-none overflow-visible -mt-1" aria-hidden="true">
                <path
                  d="M10 8 Q50 24 90 6"
                  stroke="#ff9900"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M84 4 L92 6 L88 14 Z"
                  fill="#ff9900"
                />
              </svg>
            </div>
          </a>

          {/* Delivery Location Pin */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white cursor-pointer p-1.5 rounded hover:border hover:border-slate-600">
            <MapPin className="w-4 h-4 text-[#ff9900] shrink-0" />
            <div className="leading-tight">
              <div className="text-[10px] text-slate-400">Deliver to John</div>
              <div className="font-bold text-white">New York 10001</div>
            </div>
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-2xl mx-2">
            <div className="flex items-center rounded-lg bg-white overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-[#ff9900]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 text-slate-700 text-xs px-2.5 py-2.5 border-r border-slate-300 focus:outline-none cursor-pointer hidden sm:block shrink-0"
              >
                <option value="All">All Departments</option>
                <option value="Smart Home">Smart Home</option>
                <option value="Audio">Audio &amp; Sound</option>
                <option value="Wearables">Wearables</option>
                <option value="Computing">Computing</option>
              </select>

              <input
                type="text"
                placeholder="Search Amazon Commerce products, brands, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />

              <button
                className="bg-[#febd69] hover:bg-[#f3a847] px-4 py-2.5 flex items-center justify-center text-slate-900 transition-colors cursor-pointer shrink-0"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Returns & Orders */}
            <a
              href="#dashboard-preview"
              className="hidden md:flex flex-col text-xs leading-tight text-slate-300 hover:text-white p-1 rounded hover:border hover:border-slate-600"
            >
              <span className="text-[10px] text-slate-400">Merchant Hub</span>
              <span className="font-bold text-white">Seller Analytics</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 p-1.5 rounded hover:border hover:border-slate-600 text-white relative cursor-pointer"
              aria-label={`Shopping cart with ${totalCartCount} items`}
            >
              <div className="relative">
                <ShoppingCart className="w-7 h-7 text-white" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff9900] text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-mono">
                  {totalCartCount}
                </span>
              </div>
              <span className="hidden sm:inline font-bold text-xs mt-1">Cart</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Sub-Navbar Strip */}
        <div className="bg-[#232f3e] px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-200 border-t border-slate-700/60 hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-6 font-medium">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`hover:text-white transition-colors flex items-center gap-1 cursor-pointer ${
                selectedCategory === 'All' ? 'text-[#ff9900] font-bold' : ''
              }`}
            >
              <Menu className="w-3.5 h-3.5" />
              <span>All Products</span>
            </button>
            <a href="#products-grid" className="hover:text-[#ff9900] transition-colors">
              Today's Featured Deals
            </a>
            <a href="#products-grid" className="hover:text-[#ff9900] transition-colors">
              Best Sellers
            </a>
            <a href="#dashboard-preview" className="hover:text-[#ff9900] transition-colors flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#00a8e1]" />
              <span>Seller Central Dashboard</span>
            </a>
            <a href="#customer-service" className="hover:text-[#ff9900] transition-colors">
              Customer Support &amp; Guarantees
            </a>
          </div>

          <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="text-[#00a8e1] font-bold">prime</span>
            <span>Fast, Free Delivery on Millions of Items</span>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#232f3e] border-t border-slate-700 px-4 py-3 space-y-2 text-xs">
            <a
              href="#products-grid"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-200 hover:text-[#ff9900]"
            >
              Featured Deals
            </a>
            <a
              href="#dashboard-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-200 hover:text-[#ff9900]"
            >
              Seller Analytics Dashboard
            </a>
            <a
              href="#customer-service"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-200 hover:text-[#ff9900]"
            >
              Customer Guarantees
            </a>
          </div>
        )}
      </header>

      {/* =========================================================================
          HERO SECTION (Compliant with Course Assignment Structure)
          ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#232f3e] via-[#1a232f] to-[#f8fafc] text-white pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Required Subtitle */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold text-[#ff9900]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One platform for your business &amp; shopping needs</span>
            </div>

            {/* Required Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Amazon <span className="text-[#ff9900]">Commerce</span>
            </h1>

            {/* Descriptive Subtitle Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
              Discover millions of authenticated products, guaranteed 1-day Prime delivery, verified buyer reviews, and real-time merchant operations infrastructure.
            </p>

            {/* Required Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="#products-grid"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-950 btn-amz-buy cursor-pointer shadow-lg"
              >
                <span>Shop Featured Deals</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#dashboard-preview"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-600 rounded-full transition-colors cursor-pointer"
              >
                <span>Seller Operations Dashboard</span>
              </a>
            </div>

            {/* Adjacency Proof Trust Strip */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left sm:text-center border-t border-white/10">
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">300M+</div>
                <div className="text-xs text-slate-300 font-medium">Global Prime Members</div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-black text-[#ff9900] tabular-nums">1-Day</div>
                <div className="text-xs text-slate-300 font-medium">Guaranteed Prime Delivery</div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">100%</div>
                <div className="text-xs text-slate-300 font-medium">A-to-Z Buyer Protection</div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-black text-[#00a8e1] tabular-nums">2M+</div>
                <div className="text-xs text-slate-300 font-medium">Verified Merchant Partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRODUCT CATALOG SHOWCASE SECTION
          ========================================================================= */}
      <section id="products-grid" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        {/* Category Filter Pills & Search Results header */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Curated Product Catalog</span>
              <span className="text-xs bg-slate-100 text-slate-600 font-normal px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} items found
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified authentic electronics &amp; smart tech with manufacturer warranties
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Smart Home', 'Audio', 'Wearables', 'Computing'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#131921] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const discountPct = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden product-card flex flex-col justify-between"
              >
                {/* Product Card Visual Area */}
                <div className="relative p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col items-center justify-center min-h-[220px]">
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#232f3e] text-[#ff9900] text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  {/* Prime Tag */}
                  {product.isPrime && (
                    <span className="absolute top-3 right-3 text-[#00a8e1] font-black text-xs tracking-tight">
                      prime
                    </span>
                  )}

                  {/* Stylized SVG Product Graphic */}
                  <div className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-inner relative group-hover:scale-105 transition-transform" style={{ backgroundColor: `${product.color}15` }}>
                    {product.category === 'Audio' ? (
                      <div className="w-20 h-20 rounded-full border-4 border-[#0f172a] flex items-center justify-center bg-slate-900 text-white shadow-md">
                        <Box className="w-8 h-8 text-[#ff9900]" />
                      </div>
                    ) : product.category === 'Wearables' ? (
                      <div className="w-16 h-24 rounded-2xl border-4 border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-white shadow-md">
                        <div className="w-10 h-10 rounded bg-[#ff9900]/20 flex items-center justify-center text-[10px] font-bold font-mono text-[#ff9900]">
                          10:42
                        </div>
                      </div>
                    ) : product.category === 'Computing' ? (
                      <div className="w-24 h-16 rounded-lg border-2 border-slate-800 bg-slate-900 flex items-center justify-center shadow-md">
                        <Layers className="w-7 h-7 text-[#00a8e1]" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-md">
                        <Sparkles className="w-8 h-8 text-[#ff9900]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Metadata & Action Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {product.category}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug hover:text-[#007185] transition-colors cursor-pointer line-clamp-2">
                      {product.title}
                    </h3>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <div className="flex text-[#de7921]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-[#de7921]'
                                : 'text-slate-300 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-800">{product.rating}</span>
                      <span className="text-slate-400">({product.reviewCount.toLocaleString()})</span>
                    </div>

                    {/* Pricing Display */}
                    <div className="pt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Save {discountPct}%
                      </span>
                    </div>

                    {/* Delivery Promise */}
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>
                        FREE Delivery <strong className="text-slate-900">{product.deliveryDate}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      aria-label="Quick view specs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-950 btn-amz-buy flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          DASHBOARD PREVIEW SECTION (Course Requirement: Clean, Modern UI Card Mockup)
          ========================================================================= */}
      <section id="dashboard-preview" className="py-16 bg-slate-100/70 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff9900]">Merchant Operations</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Amazon Seller Central &amp; Logistics Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Real-time merchant operations: monitor FBA fulfillment pipelines, Buy Box ownership, sales velocity, and delivery carrier dispatch.
            </p>
          </div>

          {/* Dashboard Window Frame */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden">
            {/* Top Window Bar */}
            <div className="px-6 py-4 bg-[#131921] text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#ff9900]" />
                  <span className="text-xs font-bold tracking-wide text-slate-100">
                    Apex Retailers Direct
                  </span>
                  <span className="text-xs text-slate-400 font-mono">FBA-US · Store #AMZ-88210</span>
                </div>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
                {(['7D', '30D', '1Y'] as DashboardRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDashboardRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      dashboardRange === range
                        ? 'bg-[#ff9900] text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="p-6 sm:p-8 space-y-6 bg-slate-50/60">
              {/* 4 KPI Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Total Gross Revenue</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      {dashboardData.salesGrowth}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
                    {dashboardData.totalSales}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Verified Prime &amp; Merchant Sales</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Units Fulfill-Dispatched</span>
                    <span className="text-[#00a8e1] font-bold text-[11px]">FBA 94%</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
                    {dashboardData.unitsSold}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Average Order Value: $57.80</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Buy Box Ownership</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      Optimal
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
                    {dashboardData.buyBoxWin}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Top placement across 48 ASINs</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Prime On-Time Rate</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      Target Met
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
                    {dashboardData.primeOnTime}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Next-day customer promise kept</div>
                </div>
              </div>

              {/* Revenue & Units SVG Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#ff9900]" />
                      <span>Sales Trajectory &amp; Order Demand Curve</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Aggregated merchant revenue during selected range ({dashboardRange})
                    </p>
                  </div>
                  {hoveredPoint && (
                    <div className="text-xs bg-[#131921] text-white px-3 py-1 rounded font-mono animate-in fade-in">
                      {hoveredPoint.label}: ${hoveredPoint.value.toLocaleString()} USD
                    </div>
                  )}
                </div>

                {/* SVG Area Chart */}
                <div className="relative w-full overflow-hidden">
                  <svg
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    className="w-full h-40 sm:h-48 overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="amzChartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff9900" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff9900" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="20" y1="30" x2="560" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="20" y1="75" x2="560" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="20" y1="120" x2="560" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                    <path d={chartArea} fill="url(#amzChartGradient)" />

                    <path
                      d={chartPath}
                      fill="none"
                      stroke="#f08804"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {chartCoords.map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#ffffff"
                        stroke="#131921"
                        strokeWidth="2.5"
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onMouseEnter={() => setHoveredPoint({ label: pt.label, value: pt.value })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    ))}
                  </svg>

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono px-2 pt-2 border-t border-slate-100">
                    {dashboardData.chartPoints.map((p) => (
                      <span key={p.label}>{p.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: Live Orders vs Inventory vs Performance */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDashboardTab('orders')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        dashboardTab === 'orders'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Recent Customer Orders ({orders.length})
                    </button>
                    <button
                      onClick={() => setDashboardTab('inventory')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        dashboardTab === 'inventory'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      FBA Inventory Health
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    Auto-Refreshed: 10:30 AM
                  </span>
                </div>

                {dashboardTab === 'orders' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/40">
                          <th className="py-3 px-6">Order ID</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Purchased Product</th>
                          <th className="py-3 px-4">Tracking &amp; Carrier</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-6 text-right">Order Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-6 font-mono text-slate-800 font-semibold">
                              {ord.id}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">{ord.customer}</td>
                            <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{ord.item}</td>
                            <td className="py-3 px-4">
                              <div className="font-mono text-[11px] text-[#007185] font-semibold">{ord.tracking}</div>
                              <div className="text-[10px] text-slate-400">{ord.carrier}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : ord.status === 'In Transit'
                                    ? 'bg-sky-50 text-sky-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right font-mono font-bold text-slate-900 tabular-nums">
                              ${ord.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="text-xs font-bold text-slate-900">JFK8 Center (New York)</div>
                      <div className="text-xs text-slate-600">Stock Availability: 4,890 units</div>
                      <div className="text-emerald-700 text-xs font-bold">Healthy · 42 Days Coverage</div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="text-xs font-bold text-slate-900">ONT8 Center (California)</div>
                      <div className="text-xs text-slate-600">Stock Availability: 3,120 units</div>
                      <div className="text-emerald-700 text-xs font-bold">Healthy · 36 Days Coverage</div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="text-xs font-bold text-slate-900">MDW2 Center (Illinois)</div>
                      <div className="text-xs text-slate-600">Stock Availability: 840 units</div>
                      <div className="text-amber-700 text-xs font-bold">Restock Recommended (12 Days)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CUSTOMER SERVICE & TRUST PILLARS
          ========================================================================= */}
      <section id="customer-service" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <Truck className="w-6 h-6 text-[#ff9900] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">Free Next-Day Prime</h4>
                <p className="text-xs text-slate-500 mt-1">Guaranteed doorstep arrival on eligible orders nationwide.</p>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#00a8e1] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">A-to-Z Guarantee</h4>
                <p className="text-xs text-slate-500 mt-1">Full refund protection on timely delivery and item condition.</p>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <RotateCcw className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">Hassle-Free 30-Day Returns</h4>
                <p className="text-xs text-slate-500 mt-1">Drop off returns at thousands of convenient neighborhood lockers.</p>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <Package className="w-6 h-6 text-slate-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">Amazon Day Delivery</h4>
                <p className="text-xs text-slate-500 mt-1">Bundle all weekly purchases into one consolidated delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="bg-[#131921] text-slate-300 text-xs">
        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full py-3.5 bg-[#232f3e] hover:bg-[#2f3e50] text-center text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          Back to top
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            <div>
              <h5 className="font-bold text-white text-xs mb-3">Get to Know Us</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#products-grid" className="hover:text-white">Careers</a></li>
                <li><a href="#products-grid" className="hover:text-white">Amazon Newsletter</a></li>
                <li><a href="#products-grid" className="hover:text-white">About Amazon</a></li>
                <li><a href="#products-grid" className="hover:text-white">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white text-xs mb-3">Make Money with Us</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#dashboard-preview" className="hover:text-white">Sell on Amazon</a></li>
                <li><a href="#dashboard-preview" className="hover:text-white">Fulfillment by Amazon</a></li>
                <li><a href="#dashboard-preview" className="hover:text-white">Supply to Amazon</a></li>
                <li><a href="#dashboard-preview" className="hover:text-white">Become an Affiliate</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white text-xs mb-3">Amazon Payment Products</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#products-grid" className="hover:text-white">Amazon Prime Rewards</a></li>
                <li><a href="#products-grid" className="hover:text-white">Shop with Points</a></li>
                <li><a href="#products-grid" className="hover:text-white">Reload Your Balance</a></li>
                <li><a href="#products-grid" className="hover:text-white">Amazon Currency Converter</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white text-xs mb-3">Let Us Help You</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#customer-service" className="hover:text-white">Your Account</a></li>
                <li><a href="#dashboard-preview" className="hover:text-white">Your Orders</a></li>
                <li><a href="#customer-service" className="hover:text-white">Shipping Rates &amp; Policies</a></li>
                <li><a href="#customer-service" className="hover:text-white">Returns &amp; Replacements</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-white font-black tracking-tight text-sm">amazon</span>
              <span className="text-[#ff9900] font-bold">commerce</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          SLIDE-OVER CART & CHECKOUT DRAWER
          ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 modal-backdrop">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Cart Header */}
            <div className="px-6 py-4 bg-[#131921] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#ff9900]" />
                <h3 className="font-bold text-sm">Shopping Cart ({totalCartCount})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Your Amazon Cart is empty</p>
                  <p className="text-xs text-slate-500">Explore featured deals and add items to your cart.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-4 py-2 text-xs font-bold text-slate-950 btn-amz-buy"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Prime Free Shipping Indicator */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your order qualifies for <strong>FREE Prime Next-Day Delivery</strong></span>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex gap-4"
                    >
                      <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Box className="w-8 h-8 text-slate-700" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-2">
                          {item.product.title}
                        </h4>
                        <div className="text-xs font-black text-slate-900 font-mono">
                          ${item.product.price.toFixed(2)}
                        </div>

                        {/* Quantity controls */}
                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center border border-slate-300 rounded bg-white">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 hover:bg-slate-100 text-slate-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Cart Footer / Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Items ({totalCartCount}):</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Estimated Shipping:</span>
                  <span className="text-emerald-700 font-bold">FREE (Prime)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Order Total:</span>
                  <span className="font-mono text-base text-[#b12704]">${cartSubtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full py-3 px-4 text-xs font-bold text-slate-950 btn-amz-buy shadow cursor-pointer"
                >
                  Proceed to 1-Click Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          CHECKOUT CONFIRMATION MODAL
          ========================================================================= */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 modal-backdrop">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#131921]">amazon</span>
                <span className="text-xs font-bold text-[#ff9900]">checkout</span>
              </div>
              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setCheckoutComplete(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutComplete ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Order Placed Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Order <strong>#114-84920-00192</strong> confirmed. Delivery scheduled for <strong>Tomorrow by 8 PM</strong> with tracking sent to your account.
                </p>
                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setCheckoutComplete(false);
                    setCart([]);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl btn-amz-buy text-xs font-bold text-slate-950"
                >
                  Done &amp; Clear Cart
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping Address:</span>
                    <span className="font-bold text-slate-800">John Doe, New York 10001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Instrument:</span>
                    <span className="font-bold text-slate-800">Amazon Prime Rewards Visa (ending 4820)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Speed:</span>
                    <span className="text-[#00a8e1] font-bold">FREE Prime Next-Day</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Charge Total:</span>
                    <span className="font-mono text-[#b12704]">${cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutComplete(true)}
                  className="w-full py-3 px-4 rounded-xl btn-amz-orange text-xs font-bold text-slate-950 shadow cursor-pointer"
                >
                  Place Your Order in USD
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          QUICK VIEW PRODUCT MODAL
          ========================================================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {quickViewProduct.category}
              </span>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {quickViewProduct.title}
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-[#de7921]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(quickViewProduct.rating)
                          ? 'fill-[#de7921]'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold">{quickViewProduct.rating} / 5</span>
                <span className="text-slate-400">({quickViewProduct.reviewCount.toLocaleString()} reviews)</span>
              </div>

              <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                ${quickViewProduct.price.toFixed(2)}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-900 mb-1.5">Key Product Specifications:</div>
                <ul className="text-xs text-slate-600 space-y-1">
                  {quickViewProduct.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl btn-amz-buy text-xs font-bold text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
