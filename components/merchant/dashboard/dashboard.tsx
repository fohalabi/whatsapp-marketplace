import React from 'react';
import { Package, ShoppingBag, AlertTriangle, Wallet, Clock, CheckCircle, Circle } from 'lucide-react';

// Mock data
const summaryData = {
  ordersToPrepare: 8,
  productsListed: 142,
  lowStockItems: 5,
  walletBalance: 245680.50
};

const recentOrders = [
  { id: 'ORD-1043', items: 'Jollof Rice, Fried Chicken (x2)', status: 'New', pickupTime: '2:30 PM' },
  { id: 'ORD-1042', items: 'Egusi Soup, Pounded Yam', status: 'Preparing', pickupTime: '2:15 PM' },
  { id: 'ORD-1041', items: 'Suya Platter, Chapman', status: 'Picked up', pickupTime: '1:45 PM' },
  { id: 'ORD-1040', items: 'Pepper Soup, White Rice', status: 'New', pickupTime: '3:00 PM' },
  { id: 'ORD-1039', items: 'Moin Moin (x3), Akara', status: 'Preparing', pickupTime: '2:45 PM' },
];

const alerts = {
  lowStock: [
    { product: 'Fresh Tomatoes', quantity: 3, unit: 'kg' },
    { product: 'Palm Oil', quantity: 2, unit: 'liters' },
    { product: 'Chicken', quantity: 5, unit: 'pieces' },
    { product: 'Plantain', quantity: 8, unit: 'pieces' },
    { product: 'Yam', quantity: 1, unit: 'tuber' },
  ],
  newOrders: [
    { orderId: 'ORD-1043', time: '2 minutes ago' },
    { orderId: 'ORD-1040', time: '8 minutes ago' },
  ]
};

const MerchantDashboard = () => {
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders to Prepare</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summaryData.ordersToPrepare}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <button className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700">
              View all orders →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Listed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summaryData.productsListed}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
              Manage products →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summaryData.lowStockItems}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <button className="mt-4 text-sm font-medium text-red-600 hover:text-red-700">
              Restock now →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₦{summaryData.walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <button className="mt-4 text-sm font-medium text-green-600 hover:text-green-700">
              Withdraw funds →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.pickupTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                View all orders →
              </button>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Low Stock Alerts
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {alerts.lowStock.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product}</p>
                      <p className="text-xs text-gray-600">Only {item.quantity} {item.unit} left</p>
                    </div>
                    <button className="text-xs font-medium text-red-600 hover:text-red-700 bg-white px-3 py-1 rounded border border-red-200">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* New Order Notifications */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  New Orders
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {alerts.newOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderId}</p>
                      <p className="text-xs text-gray-600">{order.time}</p>
                    </div>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-white px-3 py-1 rounded border border-blue-200">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;