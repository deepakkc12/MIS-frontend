import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DamageCartPayments = ({ data }) => {
  // Colors for charts
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const STATUS_COLORS = {
    'EXPIRY': '#EF4444',
    '': '#3B82F6'
  };

  // Process data for charts
  const getTotalDamageQty = () => {
    return data.reduce((sum, item) => sum + parseFloat(item.Qty || 0), 0).toFixed(2);
  };

  const getTotalMRPValue = () => {
    return data.reduce((sum, item) => sum + (parseFloat(item.Qty || 0) * parseFloat(item.MRP || 0)), 0).toFixed(2);
  };

  const getDamageByReason = () => {
    const reasons = {};
    data.forEach(item => {
      const reason = item.remark || 'Unspecified';
      if (!reasons[reason]) {
        reasons[reason] = {
          name: reason,
          value: 1,
          qty: parseFloat(item.Qty || 0),
          mrpValue: parseFloat(item.Qty || 0) * parseFloat(item.MRP || 0)
        };
      } else {
        reasons[reason].value += 1;
        reasons[reason].qty += parseFloat(item.Qty || 0);
        reasons[reason].mrpValue += parseFloat(item.Qty || 0) * parseFloat(item.MRP || 0);
      }
    });
    return Object.values(reasons);
  };

  const getDateGroupedData = () => {
    const grouped = {};
    data.forEach(item => {
      const date = new Date(item.dot).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = {
          date,
          count: 1,
          qty: parseFloat(item.Qty || 0),
          mrpValue: parseFloat(item.Qty || 0) * parseFloat(item.MRP || 0)
        };
      } else {
        grouped[date].count += 1;
        grouped[date].qty += parseFloat(item.Qty || 0);
        grouped[date].mrpValue += parseFloat(item.Qty || 0) * parseFloat(item.MRP || 0);
      }
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Damage Cart Payments</h2>
        <p className="text-sm text-gray-500 mt-1">Analysis of damage cart entries and payments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <div className="bg-red-50 rounded-lg p-4 flex flex-col">
          <span className="text-red-500 text-sm font-medium">Total Entries</span>
          <span className="text-2xl font-bold text-red-700">{data.length}</span>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 flex flex-col">
          <span className="text-orange-500 text-sm font-medium">Total Quantity</span>
          <span className="text-2xl font-bold text-orange-700">{getTotalDamageQty()}</span>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 flex flex-col">
          <span className="text-blue-500 text-sm font-medium">Total MRP Value</span>
          <span className="text-2xl font-bold text-blue-700">₹{getTotalMRPValue()}</span>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 flex flex-col">
          <span className="text-green-500 text-sm font-medium">Purchase After</span>
          <span className="text-2xl font-bold text-green-700">
            {data.reduce((sum, item) => sum + parseFloat(item.purchaseAfter || 0), 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-gray-700 font-medium mb-4">Damage by Reason</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getDamageByReason()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getDamageByReason().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} items`, props.payload.name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-gray-700 font-medium mb-4">Damage by Date</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDateGroupedData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [name === 'qty' ? `${value} units` : `₹${value}`, name === 'qty' ? 'Quantity' : 'MRP Value']} />
                <Legend />
                <Bar dataKey="qty" name="Quantity" fill="#FF6384" />
                <Bar dataKey="mrpValue" name="MRP Value" fill="#36A2EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="p-6">
        <h3 className="text-gray-700 font-medium mb-4">Detailed Damage Entries</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carton No</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.SkuName}</span>
                      <span className="text-xs text-gray-500">Code: {item.code}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{item.cartonNo}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{new Date(item.dot).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{parseFloat(item.Qty).toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">₹{parseFloat(item.MRP).toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.remark === 'EXPIRY' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.remark || 'Unspecified'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DamageCartPayments;