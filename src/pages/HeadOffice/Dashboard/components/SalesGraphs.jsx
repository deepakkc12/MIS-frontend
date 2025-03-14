import React, { useEffect, useState } from 'react';
import {
  AreaChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency } from '../../../../utils/helper';
import { getRequest } from '../../../../services/apis/requests';

const EnhancedSalesDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('daily');
  const [dateRange, setDateRange] = useState('lastWeek');
  const [comparisonMode, setComparisonMode] = useState(false);  

  const [selectedYear,setSelectedYear] = useState('2025')

  const [dailyData,setDailyData] = useState([]);

  const getDailySales=async()=>{
    const response =await getRequest(`sales/day-wise/`)
    setDailyData(response.data)

  }

  const getMonthlySales = async ()=>{
    const response = await getRequest(`sales/month-wise/?year=${selectedYear}`)

    if(response.success){
        setMonthlyData(response.data)
    }
  }

  const getYearlySales = async ()=>{
    const response = await getRequest(`sales/year-wise/`)
    if(response.success){
        setYearlyData(response.data)
    }
  }

  useEffect(()=>{
    getDailySales()
  },[dateRange])

  useEffect(()=>{
    getMonthlySales()
  },[selectedYear])
  useEffect(()=>{
    getYearlySales()
  },[])
  
  const [monthlyData,setMonthlyData] =useState([]) ;

  const [yearlyData,setYearlyData] =useState([]) 

  const previousDailyData = [
    { date: '01/03', grossAmount: 2800, nob: 22 },
    { date: '02/03', grossAmount: 3900, nob: 28 },
    { date: '03/03', grossAmount: 2500, nob: 17 },
    { date: '04/03', grossAmount: 4700, nob: 33 },
    { date: '05/03', grossAmount: 3800, nob: 25 },
    { date: '06/03', grossAmount: 5800, nob: 38 },
    { date: '07/03', grossAmount: 5200, nob: 36 },
  ];
  
  const currentDay = new Date().getDate();

  // Calculate additional metrics
  const getDisplayData = () => {
    if (activeTab === 'daily') return dailyData;
    if (activeTab === 'monthly') return monthlyData;
    return yearlyData;
  };
  
  const getPreviousData = () => {
    if (activeTab === 'daily') return previousDailyData;
    // For brevity, we're only implementing previous data for daily view
    return [];
  };
  
  const getXAxisKey = () => {
    if (activeTab === 'daily') return 'date';
    if (activeTab === 'monthly') return 'month';
    return 'year';
  };
  
  // Get statistics for the metrics cards
  const data = getDisplayData();
  const prevData = getPreviousData();
  const totalSales = data?.reduce((sum, item) => sum + item.nob, 0);
  const totalRevenue = data?.reduce((sum, item) => sum + item.grossAmount, 0);
  const averageSaleValue = totalRevenue / totalSales;
  
  // Calculate previous period metrics (for daily view)
  const prevTotalSales = activeTab === 'daily' ? prevData?.reduce((sum, item) => sum + item.nob, 0) : 0;
  const prevTotalRevenue = activeTab === 'daily' ? prevData?.reduce((sum, item) => sum + item.grossAmount, 0) : 0;
  
  // Calculate percent changes
  const salesChange = prevTotalSales ? ((totalSales - prevTotalSales) / prevTotalSales * 100)?.toFixed(1) : null;
  const revenueChange = prevTotalRevenue ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue * 100)?.toFixed(1) : null;
  
  // Distribution data for pie chart
  const distributionData = data?.map(item => ({
    name: activeTab === 'daily' ? item.date : activeTab === 'monthly' ? item.month : item.year,
    value: item.grossAmount
  }));
  
  // COLORS
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6B6B', '#4ECDC4'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>
        <div className="flex space-x-2">
            
          <select
            className="form-select rounded-md border-gray-300 shadow-sm text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >

            <option value={7}>Last Week</option>
            <option value={currentDay}>This Month</option>
            <option value={30}>Last 30 Days</option>
            <option value={120}>Last 120 Days</option>
          </select>
          
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox"
                className="sr-only"
                checked={comparisonMode}
                onChange={() => setComparisonMode(!comparisonMode)}
              />
              <div className={`block w-10 h-6 rounded-full ${comparisonMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${comparisonMode ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-2 text-sm text-gray-700">Compare with Previous Period</div>
          </label>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        {['daily', 'monthly', 'yearly'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 ${activeTab === tab 
              ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-blue-600">Total Sales</div>
              <div className="text-3xl font-bold mt-1">{totalSales?.toLocaleString()}</div>
            </div>
            <div className="bg-blue-500 p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          {comparisonMode && salesChange && (
            <div className={`mt-2 text-sm font-medium ${parseFloat(salesChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(salesChange) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(salesChange))}% vs previous period
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-green-600">Total Revenue</div>
              <div className="text-3xl font-bold mt-1">{formatCurrency(totalRevenue)}</div>
            </div>
            <div className="bg-green-500 p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {comparisonMode && revenueChange && (
            <div className={`mt-2 text-sm font-medium ${parseFloat(revenueChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(revenueChange) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(revenueChange))}% vs previous period
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-purple-600">Average Sale Value</div>
              <div className="text-3xl font-bold mt-1">₹{averageSaleValue.toFixed(2)}</div>
            </div>
            <div className="bg-purple-500 p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm font-medium text-gray-600">
            Based on {totalSales} transactions
          </div>
        </div>
      </div>
      
      {/* Main Sales Graph */}
      <div className="bg-gray-50 p-6 rounded-xl shadow mb-8">
  <h3 className="text-lg font-medium mb-4 text-gray-800">Sales Performance</h3>
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart data={getDisplayData()}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis 
        // Remove the date display in daily view by either hiding the label or using a custom formatter
        dataKey={getXAxisKey()} 
        tick={activeTab === 'daily' ? false : { fill: '#6b7280' }}
        axisLine={{ stroke: '#9ca3af' }}
      />
      <YAxis 
        yAxisId="left" 
        orientation="left" 
        stroke="#2BA697"
        tickFormatter={(value) => value.toLocaleString()}
        tick={{ fill: '#6b7280' }}
      />
      <YAxis 
        yAxisId="right" 
        orientation="right" 
        stroke="#0E60B6"
        tickFormatter={(value) => `₹${value.toLocaleString()}`}
        tick={{ fill: '#6b7280' }}
      />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}
        formatter={(value, name) => {
          if (name === "Revenue (₹)") return [`₹${value.toLocaleString()}`, name];
          return [value.toLocaleString(), name];
        }}
      />
      <Legend />
      <defs>
        <linearGradient id="colorNob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2BA697" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#2BA697" stopOpacity={0.2}/>
        </linearGradient>
        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#0E60B6" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#0E60B6" stopOpacity={0.2}/>
        </linearGradient>
        <linearGradient id="colorPrevAmount" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
        </linearGradient>
      </defs>
      <Area 
        yAxisId="left" 
        type="monotone" 
        dataKey="nob" 
        name="Number of Sales" 
        stroke="#2BA697" 
        fill="url(#colorNob)"
        fillOpacity={0.5}
        activeDot={{ r: 6 }}
      />
      <Area 
        yAxisId="right" 
        type="monotone" 
        dataKey="grossAmount" 
        name="Revenue (₹)" 
        stroke="#0E60B6" 
        fill="url(#colorAmount)"
        fillOpacity={0.5}
        activeDot={{ r: 6 }}
      />
      {comparisonMode && activeTab === 'daily' && (
        <Area 
          yAxisId="right" 
          type="monotone" 
          data={previousDailyData} 
          dataKey="grossAmount" 
          name="Previous Period (₹)" 
          stroke="#F59E0B"
          fill="url(#colorPrevAmount)"
          fillOpacity={0.5}
          strokeDasharray="5 5"
        />
      )}
    </AreaChart>
  </ResponsiveContainer>
</div>
          
          {/* Additional Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Trend Analysis */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={getDisplayData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey={getXAxisKey()} 
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹value/1000}k`}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="grossAmount" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Distribution Analysis */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Revenue Distribution</h3>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="60%" height={240}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {distributionData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="w-2/5">
                  <ul className="space-y-2">
                    {distributionData?.map((entry, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm">{entry.name}: ₹{entry.value.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sales Performance Analysis */}
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Sales Performance</h3>
              <div className="text-sm text-gray-500">
                {activeTab === 'daily' ? 'Last 7 days' : activeTab === 'monthly' ? 'Last 6 months' : 'Last 5 years'}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={getDisplayData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey={getXAxisKey()} 
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <Bar 
                  dataKey="nob" 
                  name="Number of Sales" 
                  fill="url(#colorSales)" 
                  radius={[4, 4, 0, 0]}
                />
                {comparisonMode && activeTab === 'daily' && (
                  <Bar 
                    dataKey="nob" 
                    data={previousDailyData}
                    name="Previous Period" 
                    fill="rgba(251, 191, 36, 0.6)" 
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 text-right text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      );
    };
    
    export default EnhancedSalesDashboard;