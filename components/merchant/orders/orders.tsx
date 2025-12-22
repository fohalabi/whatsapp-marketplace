'use client';

import React, { useState } from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';

type OrderStatus = 'New' | 'Preparing' | 'Ready';

interface Order {
  id: string;
  items: string;
  quantity: number;
  status: OrderStatus;
  pickupTime: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-1001', items: 'Wireless Earbuds Pro', quantity: 2, status: 'New', pickupTime: '2:30 PM' },
  { id: 'ORD-1002', items: 'Smart Watch Series 5', quantity: 1, status: 'Preparing', pickupTime: '3:00 PM' },
  { id: 'ORD-1003', items: 'USB-C Cable 2m, Phone Case', quantity: 3, status: 'New', pickupTime: '3:15 PM' },
  { id: 'ORD-1004', items: 'Laptop Stand Aluminum', quantity: 1, status: 'Ready', pickupTime: '2:00 PM' },
  { id: 'ORD-1005', items: 'Screen Protector Pack', quantity: 5, status: 'Preparing', pickupTime: '4:00 PM' },
  { id: 'ORD-1006', items: 'Wireless Mouse, Keyboard', quantity: 2, status: 'New', pickupTime: '4:30 PM' },
  { id: 'ORD-1007', items: 'Phone Case - Blue', quantity: 1, status: 'Ready', pickupTime: '1:45 PM' },
];

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return { 
          label: 'New', 
          color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
          icon: Package 
        };
      case 'Preparing':
        return { 
          label: 'Preparing', 
          color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
          icon: Clock 
        };
      case 'Ready':
        return { 
          label: 'Ready for Pickup', 
          color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
          icon: CheckCircle 
        };
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const newOrdersCount = orders.filter(o => o.status === 'New').length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage incoming orders and prepare for pickup
            </p>
          </div>
          {newOrdersCount > 0 && (
            <span className="hidden sm:inline-flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">
              {newOrdersCount} New {newOrdersCount === 1 ? 'Order' : 'Orders'}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Pickup Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {order.items}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {order.pickupTime}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {order.status === 'New' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Preparing')}
                          className="px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Ready')}
                          className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <span className="px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          Awaiting Pickup
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                    {order.id}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {order.items}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                  <StatusIcon size={12} />
                  {statusConfig.label}
                </span>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 dark:border-gray-700 mb-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Quantity</span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                    {order.quantity} {order.quantity === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Pickup Time</span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                    {order.pickupTime}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {order.status === 'New' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Preparing')}
                    className="flex-1 px-4 py-2.5 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                    className="flex-1 px-4 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'Ready' && (
                  <div className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    Awaiting Pickup
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}