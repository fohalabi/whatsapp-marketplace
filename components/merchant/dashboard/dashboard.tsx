'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  Wallet, 
  Clock, 
  CheckCircle, 
  Circle,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  BarChart3,
  PieChart,
  MapPin,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { profileService } from '@/services/profile.service';
import { dashboardService } from '@/services/merchantDashboard.service';
import type { DashboardStats } from '@/Types/merchantDashboard.types';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes('revenue') ? `₦${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Summary Card Component
const SummaryCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendValue, 
  linkText, 
  linkHref 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string; 
  trend?: 'up' | 'down'; 
  trendValue?: string; 
  linkText: string; 
  linkHref: string;
}) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color.replace('500', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <Link href={linkHref}>
      <button className="mt-4 text-sm font-medium hover:underline flex items-center">
        {linkText} →
      </button>
    </Link>
  </motion.div>
);

// Sales Trend Chart
const SalesTrendChart = ({ data, timeFilter }: { data: Array<{ day: string; revenue: number; orders: number }>; timeFilter: 'today' | '7days' | '30days' }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Sales Trend
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{timeFilter === 'today' ? 'Today' : timeFilter === '7days' ? 'Last 7 Days' : 'Last 30 Days'}</span>
        </div>
      </div>
      <div className="h-64">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue (₦)"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                name="Orders"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No sales data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Category Performance Chart
const CategoryPerformanceChart = ({ data }: { data: Array<{ name: string; value: number; color: string }> }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PieChart className="w-4 h-4" />
        Category Performance
      </h3>
      <div className="h-64">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value?: string | number) => value ? [`${value}%`, 'Sales Share'] : ['N/A', 'Sales Share']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No category data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Top Products Chart
const TopProductsChart = ({ data }: { data: Array<{ name: string; orders: number; revenue: number }> }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Top Products
      </h3>
      <div className="h-64">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue (₦)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No product data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Delivery Zone Performance Chart
const DeliveryZoneChart = ({ data }: { data: Array<{ zone: string; orders: number; deliveryTime: number }> }) => {
  const radarData = data?.map((zone: { zone: string; orders: number; deliveryTime: number }) => ({
    subject: zone.zone,
    A: zone.orders,
    B: zone.deliveryTime,
    fullMark: 50,
  })) || [];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Delivery Zone Performance
      </h3>
      <div className="h-64">
        {radarData && radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Orders"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Delivery Time (mins)"
                dataKey="B"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No delivery zone data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Customer Metrics Cards
const CustomerMetrics = ({ data }: { data: { newCustomers: number; repeatRate: number; averageOrderValue: number; averageRating: number } | null | undefined }) => {
  if (!data) return null;

  const metrics = [
    { metric: 'New Customers', value: data.newCustomers || 0, change: '+12%' },
    { metric: 'Repeat Rate', value: `${data.repeatRate || 0}%`, change: '+5%' },
    { metric: 'Avg Order Value', value: `₦${(data.averageOrderValue || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, change: '+8%' },
    { metric: 'Rating', value: (data.averageRating || 0).toFixed(1), change: '+0.2' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      className="grid grid-cols-2 gap-4 mb-6"
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.metric}
          variants={itemVariants}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <p className="text-sm font-medium text-gray-600 mb-1">{metric.metric}</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const MerchantDashboard = () => {
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('today');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ verificationStatus: string; verification?: { rejectionReason: string } } | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const verificationStatus = profile?.verificationStatus || 'PENDING';
  const rejectionReason = profile?.verification?.rejectionReason || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, productsRes, dashboardRes] = await Promise.all([
          profileService.getMerchantProfile(),
          profileService.getMerchantProducts(),
          dashboardService.getMerchantDashboard({ timeFrame: timeFilter })
        ]);
        
        setProfile(profileRes.data);
        
        if (productsRes.data) {
          setProductCount(productsRes.data.length);
        }

        if (dashboardRes.success && dashboardRes.data) {
          setDashboardData(dashboardRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeFilter]);

  const summaryData = {
    ordersToPrepare: dashboardData?.stats?.ordersToPrepare || 0,
    productsListed: productCount,
    lowStockItems: dashboardData?.stats?.lowStockItems?.length || 0,
    walletBalance: 0,
  };

  const recentOrders = dashboardData?.stats?.recentOrders?.map((order) => ({
    id: order.orderNumber,
    items: order.orderItems?.map((item) => item.product?.name).filter(Boolean).join(', ') || 'N/A',
    status: order.status,
    pickupTime: new Date(order.createdAt).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true
    })
  })) || [];

  const alerts = {
    lowStock: dashboardData?.stats?.lowStockItems?.map((product) => ({
      product: product.name,
      quantity: product.stockQuantity,
      unit: product.unit || 'units'
    })) || [],
    newOrders: dashboardData?.stats?.recentOrders?.slice(0, 2).map((order) => ({
      orderId: order.orderNumber,
      time: getTimeAgo(new Date(order.createdAt))
    })) || []
  };

  // Helper function to calculate time ago
  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'New': 'bg-blue-100 text-blue-700',
      'Preparing': 'bg-yellow-100 text-yellow-700',
      'Picked up': 'bg-green-100 text-green-700'
    };
    
    const icons = {
      'New': <Circle className="w-3 h-3" />,
      'Preparing': <Clock className="w-3 h-3" />,
      'Picked up': <CheckCircle className="w-3 h-3" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Your business performance overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {(['today', '7days', '30days'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      timeFilter === filter
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {filter === 'today' ? 'Today' : filter === '7days' ? 'Last 7 days' : 'Last 30 days'}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Verification Status Card */}
        {verificationStatus !== 'VERIFIED' && profile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`bg-white rounded-lg shadow border-l-4 p-6 ${
              verificationStatus === 'REJECTED' ? 'border-red-500' : 
              verificationStatus === 'PENDING' ? 'border-blue-500' : 
              'border-yellow-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {verificationStatus === 'REJECTED' ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : verificationStatus === 'PENDING' ? (
                      <Clock className="w-6 h-6 text-blue-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">
                      {verificationStatus === 'REJECTED' ? 'Verification Rejected' : 'Verification Pending'}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {verificationStatus === 'REJECTED' ? (
                      <>Your verification was rejected. Reason: {rejectionReason}</>
                    ) : (
                      'Your verification documents are being reviewed. We\'ll notify you once complete.'
                    )}
                  </p>
                  {verificationStatus === 'REJECTED' && (
                    <Link href="/merchant/profile">
                      <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                        Resubmit Verification
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {verificationStatus === 'VERIFIED' && productCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Account Verified!</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Your account is verified. You can now add products to start selling.
            </p>
            <Link href="/merchant/products">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                Add Your First Product
              </button>
            </Link>
          </motion.div>
        )}

        {/* Summary Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <SummaryCard
            title="Orders to Prepare"
            value={summaryData.ordersToPrepare}
            icon={Package}
            color="text-orange-500"
            trend="up"
            trendValue="+3 from yesterday"
            linkText="View all orders"
            linkHref="/merchant/orders"
          />
          <SummaryCard
            title="Products Listed"
            value={productCount}
            icon={ShoppingBag}
            color="text-blue-500"
            trend="up"
            trendValue="+8 this month"
            linkText="Manage products"
            linkHref="/merchant/products"
          />
          <SummaryCard
            title="Low Stock Items"
            value={summaryData.lowStockItems as number}
            icon={AlertTriangle}
            color="text-red-500"
            trend="down"
            trendValue="-2 items restocked"
            linkText="Restock now"
            linkHref="/merchant/stock"
          />
          <SummaryCard
            title="Wallet Balance"
            value={`₦${summaryData.walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={Wallet}
            color="text-green-500"
            trend="up"
            trendValue="+₦24,500 today"
            linkText="Withdraw funds"
            linkHref="/merchant/wallet"
          />
        </motion.div>

        {/* Customer Metrics */}
        <CustomerMetrics data={null} />

        {/* Charts Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesTrendChart data={dashboardData?.salesTrend || []} timeFilter={timeFilter} />
          <CategoryPerformanceChart data={dashboardData?.categoryPerformance || []} />
        </div>

        {/* Charts Section - Row 2 */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <TopProductsChart data={dashboardData?.topProducts || []} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Delivery Zone Chart */}
          <div className="lg:col-span-1">
            <DeliveryZoneChart data={dashboardData?.deliveryZonePerformance || []} />
          </div>

          {/* Recent Orders */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 bg-white rounded-lg border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <span className="text-xs text-gray-500">Live updates</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order: { id: string; items: string; status: string; pickupTime: string }) => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-600">{order.items}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.pickupTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link href="/merchant/orders">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  View all orders →
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Alerts Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Low Stock Alerts
                </h2>
                <span className="text-xs text-gray-500">Requires attention</span>
              </div>
              <div className="p-4 space-y-3">
                {alerts.lowStock.map((item: { product: string; quantity: number; unit: string }, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product}</p>
                      <p className="text-xs text-gray-600">Only {item.quantity} {item.unit} left</p>
                    </div>
                    <Link href="/merchant/stock">
                      <button className="text-xs font-medium text-red-600 hover:text-red-700 bg-white px-3 py-1 rounded border border-red-200">
                        Restock
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* New Order Notifications */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  New Orders
                </h2>
                <span className="text-xs text-gray-500">Just arrived</span>
              </div>
              <div className="p-4 space-y-3">
                {alerts.newOrders.map((order: { orderId: string; time: string }, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderId}</p>
                      <p className="text-xs text-gray-600">{order.time}</p>
                    </div>
                    <Link href="/merchant/orders">
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-white px-3 py-1 rounded border border-blue-200">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{(dashboardData?.stats?.recentOrders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0).toLocaleString('en-NG')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.recentOrders?.length || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{dashboardData?.stats?.recentOrders && dashboardData.stats.recentOrders.length > 0 ? (dashboardData.stats.recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / dashboardData.stats.recentOrders.length).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Customer Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.5</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MerchantDashboard;