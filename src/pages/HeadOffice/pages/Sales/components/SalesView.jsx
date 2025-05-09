import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, ChevronDown, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Sample data
const dailyData = [
  { name: 'Mon', current: 5000, previous: 4800 },
  { name: 'Tue', current: 2000, previous: 5500 },
  { name: 'Wed', current: 7500, previous: 6800 },
  { name: 'Thu', current: 6800, previous: 6200 },
  { name: 'Fri', current: 8200, previous: 7900 },
  { name: 'Sat', current: 7000, previous: 6500 },
  { name: 'Sun', current: 5500, previous: 5000 },
];

const monthlyData = [
  { name: 'Jan', current: 45000, previous: 42000 },
  { name: 'Feb', current: 52000, previous: 48000 },
  { name: 'Mar', current: 49000, previous: 51000 },
  { name: 'Apr', current: 63000, previous: 57000 },
  { name: 'May', current: 59000, previous: 56000 },
  { name: 'Jun', current: 68000, previous: 64000 },
  { name: 'Jul', current: 71000, previous: 67000 },
  { name: 'Aug', current: 74000, previous: 69000 },
  { name: 'Sep', current: 78000, previous: 72000 },
  { name: 'Oct', current: 82000, previous: 75000 },
  { name: 'Nov', current: 76000, previous: 73000 },
  { name: 'Dec', current: 85000, previous: 79000 },
];

const yearlyData = [
  { name: '2020', current: 580000, previous: 520000 },
  { name: '2021', current: 650000, previous: 580000 },
  { name: '2022', current: 720000, previous: 650000 },
  { name: '2023', current: 810000, previous: 720000 },
  { name: '2024', current: 920000, previous: 810000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-sm">
          <span className="inline-block w-3 h-3 bg-blue-600 mr-2 rounded-sm"></span>
          Current: {payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="inline-block w-3 h-3 bg-teal-500 mr-2 rounded-sm"></span>
          Previous: {payload[1].value.toLocaleString()}
        </p>
        <p className="text-sm font-medium mt-1">
          {payload[0].value > payload[1].value ? (
            <span className="text-green-500 flex items-center">
              +{((payload[0].value - payload[1].value) / payload[1].value * 100).toFixed(1)}%
              <ArrowUpRight className="ml-1" size={14} />
            </span>
          ) : (
            <span className="text-red-500 flex items-center">
              {((payload[0].value - payload[1].value) / payload[1].value * 100).toFixed(1)}%
              <ArrowDownRight className="ml-1" size={14} />
            </span>
          )}
        </p>
      </div>
    );
  }
  return null;
};

const SalesDashboard = () => {
  const [timeframe, setTimeframe] = useState('daily');
  
  const chartData = {
    'daily': dailyData,
    'monthly': monthlyData,
    'yearly': yearlyData
  }[timeframe];
  
  // Calculate summary metrics
  const currentTotal = chartData.reduce((sum, item) => sum + item.current, 0);
  const previousTotal = chartData.reduce((sum, item) => sum + item.previous, 0);
  const percentChange = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);
  const isPositive = currentTotal > previousTotal;
  
  // Get highest day/month/year
  const highestItem = [...chartData].sort((a, b) => b.current - a.current)[0];
  
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Performance</h2>
        
        <div className="relative">
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="mr-2 text-gray-700">
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} View
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
          
          <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setTimeframe('daily')}>Daily</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setTimeframe('monthly')}>Monthly</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setTimeframe('yearly')}>Yearly</button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Sales</span>
          </div>
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-gray-800">{currentTotal.toLocaleString()}</h3>
            <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              {isPositive ? '+' : ''}{percentChange}%
              {isPositive ? <ArrowUpRight size={14} className="ml-1" /> : <ArrowDownRight size={14} className="ml-1" />}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="bg-teal-100 p-2 rounded-lg mr-3">
              <TrendingUp className="text-teal-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-500">Previous Period</span>
          </div>
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-gray-800">{previousTotal.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-500">Best Performance</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800">{highestItem.name}</h3>
            <span className="text-sm text-gray-500">{highestItem.current.toLocaleString()} sales</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="current" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorCurrent)" 
                name="Current Period" 
              />
              <Area 
                type="monotone" 
                dataKey="previous" 
                stroke="#14B8A6" 
                fillOpacity={1} 
                fill="url(#colorPrevious)" 
                name="Previous Period" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Period Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="current" fill="#3B82F6" name="Current Period" />
                <Bar dataKey="previous" fill="#14B8A6" name="Previous Period" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Metrics</h3>
          <div className="grid grid-cols-1 gap-4">
            {chartData.map((item, index) => {
              const growth = ((item.current - item.previous) / item.previous * 100).toFixed(1);
              const isGrowthPositive = item.current > item.previous;
              
              return (
                <div key={index} className="flex justify-between items-center p-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${isGrowthPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                        {isGrowthPositive ? '+' : ''}{growth}%
                        {isGrowthPositive ? <ArrowUpRight size={12} className="ml-1" /> : <ArrowDownRight size={12} className="ml-1" />}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Current</p>
                      <p className="font-medium">{item.current.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Previous</p>
                      <p className="font-medium">{item.previous.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;