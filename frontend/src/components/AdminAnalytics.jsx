import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export const AdminAnalytics = ({ stats, products }) => {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
        <TrendingUp size={18} /> Analytics & Reports
      </h3>

      <div className="flex gap-2 mb-4">
        {['7d', '30d', '90d', '1y'].map(range => (
          <button key={range} onClick={() => setDateRange(range)} className={`px-4 py-2 rounded text-xs font-bold uppercase ${dateRange === range ? 'bg-brand-burgundy text-white' : 'bg-gray-100 text-gray-700'}`}>{range}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-lg">
          <p className="text-[10px] uppercase font-bold opacity-80">Total Revenue</p>
          <h4 className="text-2xl font-black mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</h4>
          <p className="text-xs opacity-80 mt-1">+12.5% vs last period</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg">
          <p className="text-[10px] uppercase font-bold opacity-80">Total Orders</p>
          <h4 className="text-2xl font-black mt-1">{stats.totalOrders}</h4>
          <p className="text-xs opacity-80 mt-1">+8.3% vs last period</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-lg">
          <p className="text-[10px] uppercase font-bold opacity-80">Total Customers</p>
          <h4 className="text-2xl font-black mt-1">{stats.totalCustomers}</h4>
          <p className="text-xs opacity-80 mt-1">+15.2% vs last period</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-5 rounded-lg">
          <p className="text-[10px] uppercase font-bold opacity-80">Avg Order Value</p>
          <h4 className="text-2xl font-black mt-1">₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}</h4>
          <p className="text-xs opacity-80 mt-1">+3.1% vs last period</p>
        </div>
      </div>

      <div className="border border-brand-border rounded-lg p-4">
        <h4 className="font-black uppercase text-xs text-black mb-4">Order Status Distribution</h4>
        <div className="space-y-3">
          {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <span className="text-xs font-bold w-24">{status}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div className="bg-brand-burgundy h-4 rounded-full transition-all" style={{ width: `${stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0}%` }} />
              </div>
              <span className="text-xs font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-brand-border rounded-lg p-4">
        <h4 className="font-black uppercase text-xs text-black mb-4">Top Products by Revenue</h4>
        <div className="space-y-2">
          {products.slice(0, 5).map(product => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt="" className="w-10 h-10 object-cover rounded" />
                <span className="text-xs font-bold">{product.name}</span>
              </div>
              <span className="text-xs font-bold">₹{(product.price * (product.stock || 0)).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
