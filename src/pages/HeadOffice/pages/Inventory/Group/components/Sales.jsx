import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  TrendingUp, DollarSign, Percent, Calendar, ArrowUpRight, ChevronDown, 
  BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Filter
} from 'lucide-react';

// MetricCard component with improved UI
const MetricCard = ({ title, value, subValue, icon, trend, color, period = "vs last month" }) => {
  const Icon = icon;
  const isPositive = parseFloat(trend) >= 0;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          <div className="flex items-center mt-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-gray-500 ml-2">{period}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color} shadow-md`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {subValue && <p className="text-sm text-gray-500 mt-4">{subValue}</p>}
    </div>
  );
};

// Chart Type Toggle Component
const ChartTypeToggle = ({ activeType, setActiveType }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setActiveType('area')}
        className={`flex items-center px-3 py-2 rounded text-sm ${activeType === 'area' 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <AreaChart size={16} className="mr-1" /> Area
      </button>
      <button
        onClick={() => setActiveType('bar')}
        className={`flex items-center px-3 py-2 rounded text-sm ${activeType === 'bar' 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <BarChart2 size={16} className="mr-1" /> Bar
      </button>
      <button
        onClick={() => setActiveType('line')}
        className={`flex items-center px-3 py-2 rounded text-sm ${activeType === 'line' 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <LineChartIcon size={16} className="mr-1" /> Line
      </button>
    </div>
  );
};

// Card Header Component
const CardHeader = ({ title, subtitle, children }) => (
  <div className="flex justify-between items-center mb-4">
    <div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    <div className="flex items-center">
      {children}
    </div>
  </div>
);

// Brand Growth Indicator
const GrowthIndicator = ({ value }) => {
  const growthValue = parseFloat(value);
  const isPositive = growthValue >= 0;
  
  return (
    <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? (
        <ArrowUpRight size={16} className="mr-1" />
      ) : (
        <ChevronDown size={16} className="mr-1" />
      )}
      <span className="font-medium">{isPositive ? '+' : ''}{value}%</span>
    </div>
  );
};

// Main Sales Analytics Component
const SalesAnalytics = ({ data }) => {
  const [salesChartType, setSalesChartType] = useState('area');
  const [brandSortBy, setBrandSortBy] = useState('sales');
  const [showTop, setShowTop] = useState(5);
  
  // Helper functions for data calculation
  const getTotalCurrentSales = () => {
    return data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.CurrentMonthSale) || 0);
    }, 0).toFixed(2);
  };
  
  const getTotalPrevSales = () => {
    return data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.PrevMonthSale) || 0);
    }, 0).toFixed(2);
  };
  
  const getSalesGrowth = () => {
    const current = parseFloat(getTotalCurrentSales());
    const prev = parseFloat(getTotalPrevSales());
    return prev !== 0 ? (((current - prev) / prev) * 100).toFixed(1) : 0;
  };
  
  const getCurrentProfit = () => {
    const totalSales = parseFloat(getTotalCurrentSales());
    const totalCogs = data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.CurrentMonthCogs) || 0);
    }, 0);
    return (totalSales - totalCogs).toFixed(2);
  };
  
  const getPrevProfit = () => {
    const totalSales = parseFloat(getTotalPrevSales());
    const totalCogs = data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.PrevMonthCogs) || 0);
    }, 0);
    return (totalSales - totalCogs).toFixed(2);
  };
  
  const getProfitGrowth = () => {
    const current = parseFloat(getCurrentProfit());
    const prev = parseFloat(getPrevProfit());
    return prev !== 0 ? (((current - prev) / prev) * 100).toFixed(1) : 0;
  };
  
  const getCurrentMargin = () => {
    const sales = parseFloat(getTotalCurrentSales());
    const profit = parseFloat(getCurrentProfit());
    return sales !== 0 ? ((profit / sales) * 100).toFixed(1) : 0;
  };
  
  const getPrevMargin = () => {
    const sales = parseFloat(getTotalPrevSales());
    const profit = parseFloat(getPrevProfit());
    return sales !== 0 ? ((profit / sales) * 100).toFixed(1) : 0;
  };
  
  const getMarginChange = () => {
    const current = parseFloat(getCurrentMargin());
    const prev = parseFloat(getPrevMargin());
    return prev !== 0 ? (current - prev).toFixed(1) : 0;
  };
  
  // Prepare brand data
  const brandSalesData = data.brands
    .filter(brand => {
      // Check if we have valid data
      const currentSales = parseFloat(brand.CurrentMonthSales);
      const prevSales = parseFloat(brand.PrevMonthSales);
      return !isNaN(currentSales) || !isNaN(prevSales);
    })
    .map(brand => {
      const currentSales = parseFloat(brand.CurrentMonthSales) || 0;
      const prevSales = parseFloat(brand.PrevMonthSales) || 0;
      const growth = prevSales !== 0 
        ? (((currentSales - prevSales) / prevSales) * 100).toFixed(1) 
        : 0;
        
      // Calculate profit numbers
      const currentCogs = parseFloat(brand.CurrentMonthTotalCogs) || 0;
      const prevCogs = parseFloat(brand.PrevMonthTotalCogs) || 0;
      const currentProfit = currentSales - currentCogs;
      const prevProfit = prevSales - prevCogs;
      
      // Calculate margins
      const currentMargin = currentSales !== 0 ? ((currentProfit / currentSales) * 100).toFixed(1) : 0;
      const prevMargin = prevSales !== 0 ? ((prevProfit / prevSales) * 100).toFixed(1) : 0;
      
      // Make sure shortName is not empty
      const brandName = brand.BrandName || `Brand ${brand.BrandCode}`;
      const shortName = brandName.length > 10 ? brandName.substring(0, 10) + '...' : brandName;
      
      return {
        name: brandName,
        shortName: shortName,
        currentSales,
        prevSales,
        growth,
        currentProfit,
        prevProfit,
        currentMargin,
        prevMargin,
        totalQty: parseFloat(brand.CurrentMonthTotalQtySold) || 0
      };
    });
  
  // Sort brands based on selected criteria
  const sortedBrands = [...brandSalesData].sort((a, b) => {
    if (brandSortBy === 'sales') return b.currentSales - a.currentSales;
    if (brandSortBy === 'growth') return parseFloat(b.growth) - parseFloat(a.growth);
    if (brandSortBy === 'profit') return b.currentProfit - a.currentProfit;
    if (brandSortBy === 'margin') return parseFloat(b.currentMargin) - parseFloat(a.currentMargin);
    return 0;
  }).slice(0, showTop);
  
  // Monthly trend data
  const monthlyTrendData = [
    { 
      name: 'Previous Month', 
      sales: parseFloat(getTotalPrevSales()), 
      profit: parseFloat(getPrevProfit()),
      margin: parseFloat(getPrevMargin())
    },
    { 
      name: 'Current Month', 
      sales: parseFloat(getTotalCurrentSales()), 
      profit: parseFloat(getCurrentProfit()),
      margin: parseFloat(getCurrentMargin())
    }
  ];

  // Calculate total contribution percentages for pie chart
  const totalSales = parseFloat(getTotalCurrentSales());
  const pieData = sortedBrands
    .filter(brand => brand.currentSales > 0) // Only include brands with sales > 0
    .map(brand => {
      // Ensure we're working with numbers
      const currentSales = parseFloat(brand.currentSales);
      const percentage = totalSales > 0 ? ((currentSales / totalSales) * 100) : 0;
      
      return {
        name: brand.name,
        value: parseFloat(percentage.toFixed(1)),  // Convert to number after formatting
        absoluteValue: currentSales
      };
    });
  
  // Colors for charts
  const COLORS = ['#4F46E5', '#3B82F6', '#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#34D399', '#84CC16', '#EAB308', '#F59E0B'];
  const CHART_LINE_COLORS = {
    sales: '#3B82F6',
    profit: '#10B981',
    margin: '#8B5CF6'
  };
  
  return (
    <div className="space-y-8">
      {/* Metrics Cards Section */}
     
      {/* Trend Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 col-span-1">
          <CardHeader 
            title="Monthly Performance"
            subtitle="Sales and profit trend"
          >
            <ChartTypeToggle activeType={salesChartType} setActiveType={setSalesChartType} />
          </CardHeader>
          
          <ResponsiveContainer width="100%" height={320}>
            {salesChartType === 'area' ? (
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="sales" name="Sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" />
                <Area yAxisId="right" type="monotone" dataKey="profit" name="Profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            ) : salesChartType === 'bar' ? (
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <ComposedChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip formatter={(value, name) => name === "margin" ? `${value}%` : `₹${value.toFixed(2)}`} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" name="Sales" stroke={CHART_LINE_COLORS.sales} strokeWidth={2} dot={{ r: 5 }} />
                <Line yAxisId="left" type="monotone" dataKey="profit" name="Profit" stroke={CHART_LINE_COLORS.profit} strokeWidth={2} dot={{ r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="margin" name="Margin %" stroke={CHART_LINE_COLORS.margin} strokeWidth={2} dot={{ r: 5 }} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Brand Contribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 col-span-1">
          <CardHeader 
            title="Brand Contribution"
            subtitle="% of total sales by brand"
          >
            <div className="inline-flex items-center">
              <PieChartIcon size={18} className="mr-2 text-blue-500" />
              <span className="text-sm text-gray-600">Top {showTop}</span>
            </div>
          </CardHeader>
          
          <div className="flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => value > 3 ? `${value}%` : ''}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`₹${props.payload.absoluteValue.toFixed(2)} (${value}%)`, props.payload.name]} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                  />
                  <Legend 
                    layout="vertical" 
                    align="right"
                    verticalAlign="middle" 
                    formatter={(value, entry) => {
                      return <span style={{ color: '#333', fontWeight: 500 }}>{value}</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <PieChartIcon size={48} className="mb-4 opacity-30" />
                <p>No sales data available to display</p>
                <p className="text-sm mt-2">Only brands with sales values above 0 are displayed</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Brand Performance Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <CardHeader 
          title="Brand Performance"
          subtitle="Comparison by sales, growth, and margin"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by</span>
              <select 
                value={brandSortBy}
                onChange={e => setBrandSortBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="sales">Sales</option>
                <option value="growth">Growth</option>
                <option value="profit">Profit</option>
                <option value="margin">Margin</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Show</span>
              <select 
                value={showTop}
                onChange={e => setShowTop(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="5">Top 5</option>
                <option value="10">Top 10</option>
                <option value="15">Top 15</option>
                <option value="100">All</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        {sortedBrands.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedBrands} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="shortName" 
                tick={{ fontSize: 12 }} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                labelFormatter={(label) => {
                  const brand = sortedBrands.find(b => b.shortName === label);
                  return brand ? brand.name : label;
                }}
              />
              <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 10 }} />
              <Bar dataKey="currentSales" name="Current Sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prevSales" name="Previous Sales" fill="#93C5FD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BarChart2 size={48} className="mb-4 opacity-30" />
            <p>No brand data available to display</p>
            <p className="text-sm mt-2">Try adjusting filters or check data source</p>
          </div>
        )}
      </div>
      
      {/* Sales Growth Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <CardHeader 
          title="Sales Growth by Brand"
          subtitle="Detailed performance metrics"
        >
          <div className="flex items-center">
            <Filter size={16} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">Showing {sortedBrands.length} brands</span>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBrands.map((brand, index) => (
                <tr key={brand.name} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{brand.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{brand.currentSales.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{brand.prevSales.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <GrowthIndicator value={brand.growth} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{brand.currentMargin}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{brand.totalQty.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;