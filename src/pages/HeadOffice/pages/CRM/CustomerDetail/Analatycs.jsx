import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Phone, ShoppingCart, User, TrendingUp, AlertCircle, Activity, ArrowUp, ArrowDown, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, formatDate } from '../../../../../utils/helper';

const CustomerAnalytics = ({ salesData, customerData }) => {
  // Use sample data if props are empty
  const actualSalesData = salesData && salesData.length > 0 ? salesData : salesData;
  
  // Prepare data for monthly trend chart - organize by month name AND year
  const getMonthlyTrendData = () => {
    const monthlyData = {};
    
    actualSalesData.forEach(sale => {
      const date = new Date(sale.DOT);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = months[monthIndex];
      const monthYear = `${monthName} ${year}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, amount: 0, count: 0 };
      }
      
      monthlyData[monthYear].amount += Number(sale.GrossAmt);
      monthlyData[monthYear].count += 1;
    });
    
    // Convert to array and sort chronologically
    const result = Object.values(monthlyData);
    result.sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      if (aYear !== bYear) return Number(aYear) - Number(bYear);
      
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });
    
    return result.filter(item => item.amount > 0);
  };
  
  // Generate purchase breakdown by amount range
  const getPurchaseBreakdownData = () => {
    const categories = [
        { name: 'Low Value (<₹500)', min: 0, max: 500, count: 0, total: 0 },
        { name: 'Moderate Value (₹500 - ₹1000)', min: 500, max: 1000, count: 0, total: 0 },
        { name: 'High Value (₹1000 - ₹2000)', min: 1000, max: 2000, count: 0, total: 0 },
        { name: 'Premium (>₹2000)', min: 2000, max: Infinity, count: 0, total: 0 }
      ];
      
    
    actualSalesData.forEach(sale => {
      const amount = Number(sale.GrossAmt);
      const category = categories.find(cat => amount >= cat.min && amount < cat.max);
      if (category) {
        category.count += 1;
        category.total += amount;
      }
    });
    
    return categories;
  };
  
  // Calculate recent purchase trend
  const getRecentPurchaseTrend = () => {
    // Sort sales by date (newest first)
    const sortedSales = [...actualSalesData].sort((a, b) => new Date(b.DOT) - new Date(a.DOT));
    
    // Calculate trend percentage between last two purchases
    if (sortedSales.length >= 2) {
      const latest = Number(sortedSales[0].GrossAmt);
      const previous = Number(sortedSales[1].GrossAmt);
      const percentChange = ((latest - previous) / previous) * 100;
      return {
        latest,
        previous,
        percentChange,
        isUp: percentChange >= 0
      };
    }
    
    return { latest: 0, previous: 0, percentChange: 0, isUp: false };
  };
  
  // Process data
  const monthlyTrendData = getMonthlyTrendData();
  const purchaseBreakdownData = getPurchaseBreakdownData();
  const purchaseTrend = getRecentPurchaseTrend();
  
  // Calculate key metrics
  const totalSales = actualSalesData.reduce((sum, sale) => sum + Number(sale.GrossAmt), 0);
  const averageSale = totalSales / actualSalesData.length;
  const highestSale = Math.max(...actualSalesData.map(sale => Number(sale.GrossAmt)));
  const highestSaleData = actualSalesData.find(sale => Number(sale.GrossAmt) === highestSale);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // VisitFrequency - Time between purchases
  const getVisitFrequency = () => {
    if (actualSalesData.length < 2) return "N/A";
    
    // Sort by date (oldest first)
    const sortedDates = actualSalesData
      .map(sale => new Date(sale.DOT))
      .sort((a, b) => a - b);
    
    // Calculate differences in days
    let totalDays = 0;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
      totalDays += diff;
    }
    
    const avgDays = Math.round(totalDays / (sortedDates.length - 1));
    return `${avgDays} days`;
  };

  // Generate data for purchase timeline
  const getTimelineData = () => {
    return actualSalesData.map(sale => ({
      date: formatDate(sale.DOT),
      amount: Number(sale.GrossAmt),
      invoice: sale.InvoiceNo
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  const visitFrequency = getVisitFrequency();
  const timelineData = getTimelineData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Sales Trend Chart - Spans full width */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden col-span-1 md:col-span-3">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Sales Trend</h2>
        </div>
        <div className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="amount" 
                  name="Sales Amount" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden col-span-1">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-indigo-700">Total Sales</p>
                <DollarSign className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-indigo-900">{formatCurrency(totalSales)}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-green-700">Average Sale</p>
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-green-900">{formatCurrency(averageSale)}</p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-amber-700">Highest Sale</p>
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-900">{formatCurrency(highestSale)}</p>
              <p className="mt-1 text-xs text-amber-700">{highestSaleData ? formatDate(highestSaleData.DOT) : 'N/A'}</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-700">Visit Frequency</p>
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-blue-900">{visitFrequency}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Purchase Breakdown */}
      <div className="bg-white  rounded-xl shadow-sm overflow-hidden col-span-2">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Purchase Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purchaseBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {purchaseBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `Count: ${value}`, 
                    `${props.payload.name}`
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Distribution</h3>
            <div className="space-y-3">
              {purchaseBreakdownData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="h-3 w-3 rounded-full mr-2" 
                      style={{backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text- text-gray-600">{item.name}</span>
                  </div>
                  <span className="text- font-medium text-gray-900">{item.count} purchases</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchase Trend */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden col-span-1">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Purchase Trend</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className={`rounded-full p-4 ${purchaseTrend.isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {purchaseTrend.isUp ? (
                <ArrowUp className="h-12 w-12" />
              ) : (
                <ArrowDown className="h-12 w-12" />
              )}
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-800">
              {purchaseTrend.percentChange.toFixed(1)}%
            </h3>
            <p className="text- text-gray-500">from previous purchase</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500">Latest</span>
              <span className="text-xs font-medium text-gray-500">Previous</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-800">{formatCurrency(purchaseTrend.latest)}</span>
              <span className="text-xs text-gray-400">vs</span>
              <span className="text-base font-bold text-gray-800">{formatCurrency(purchaseTrend.previous)}</span>
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-gray-700 mt-6 mb-3">Purchase Timeline</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
          {timelineData.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-4 w-4 rounded-full bg-indigo-500"></div>
                </div>
                <div className="ml-3 bg-gray-50 rounded p-2 w-full">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-800">{item.date}</p>
                    <p className="text-xs font-bold text-gray-700">{formatCurrency(item.amount)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Invoice #{item.invoice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;