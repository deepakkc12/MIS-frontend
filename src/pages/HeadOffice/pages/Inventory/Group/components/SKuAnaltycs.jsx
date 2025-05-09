import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Treemap, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  ChevronRight, ArrowUpRight, TrendingUp, DollarSign, Package, Users, Percent, 
  Search, ChevronDown, Filter, SortAsc, SortDesc, ArrowUp, ArrowDown, Eye, 
  List, Grid, LayoutGrid, ArrowRight, Star, Award, AlertCircle
} from 'lucide-react';

// Badge component for customer levels with improved styling
const LevelBadge = ({ level, count }) => {
  const colors = {
    L1: 'bg-blue-100 text-blue-800 border-blue-200',
    L2: 'bg-green-100 text-green-800 border-green-200',
    L3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    L4: 'bg-purple-100 text-purple-800 border-purple-200',
    Low: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return count > 0 ? (
    <span className={`${colors[level]} text-xs font-medium px-2.5 py-1 rounded-full border`}>
      {level}: {count}
    </span>
  ) : null;
};

// SKU Card component
const SkuCard = ({ sku, metrics, navigateToSkuDetail }) => {
  const growthColor = parseFloat(sku.growth) > 15 ? 'text-green-600' : 
                      parseFloat(sku.growth) > 0 ? 'text-blue-600' : 
                      parseFloat(sku.growth) === 0 ? 'text-gray-600' :
                      parseFloat(sku.growth) > -15 ? 'text-yellow-600' : 'text-red-600';
  
  const marginColor = parseFloat(sku.currentMargin) > 30 ? 'text-green-600' : 
                      parseFloat(sku.currentMargin) > 20 ? 'text-blue-600' : 
                      parseFloat(sku.currentMargin) > 10 ? 'text-yellow-600' : 'text-red-600';
  
  const growthBgColor = parseFloat(sku.growth) > 15 ? 'bg-green-100' : 
                        parseFloat(sku.growth) > 0 ? 'bg-blue-100' : 
                        parseFloat(sku.growth) === 0 ? 'bg-gray-100' :
                        parseFloat(sku.growth) > -15 ? 'bg-yellow-100' : 'bg-red-100';
                        
  const salesPercentage = ((sku.currentSales / metrics.totalCurrentSales) * 100).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-md font-bold text-gray-800 truncate">{sku.name}</h3>
            <p className="text-xs text-gray-500">{sku.code} • {sku.brand}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${growthBgColor} ${growthColor}`}>
            {parseFloat(sku.growth) > 0 ? '+' : ''}{sku.growth}%
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Sales</p>
            <p className="text-sm font-bold">₹{sku.currentSales.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
            <p className="text-xs text-gray-500">{salesPercentage}% of total</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Margin</p>
            <p className={`text-sm font-bold ${marginColor}`}>{sku.currentMargin}%</p>
            <p className="text-xs text-gray-500">
              <span className={parseFloat(sku.marginChange) > 0 ? 'text-green-600' : parseFloat(sku.marginChange) < 0 ? 'text-red-600' : 'text-gray-500'}>
                {parseFloat(sku.marginChange) > 0 ? '+' : ''}{sku.marginChange}%
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Customers</p>
            <p className="text-sm font-bold">{sku.totalCustomers}</p>
            <div className="flex space-x-1 mt-1">
              {sku.L1Choice > 0 && <div className="h-2 rounded-sm bg-blue-500" style={{ width: `${(sku.L1Choice / sku.totalCustomers) * 100}%` }}></div>}
              {sku.L2Choice > 0 && <div className="h-2 rounded-sm bg-green-500" style={{ width: `${(sku.L2Choice / sku.totalCustomers) * 100}%` }}></div>}
              {sku.L3Choice > 0 && <div className="h-2 rounded-sm bg-yellow-500" style={{ width: `${(sku.L3Choice / sku.totalCustomers) * 100}%` }}></div>}
              {sku.L4Choice > 0 && <div className="h-2 rounded-sm bg-purple-500" style={{ width: `${(sku.L4Choice / sku.totalCustomers) * 100}%` }}></div>}
              {sku.LowChoice > 0 && <div className="h-2 rounded-sm bg-gray-500" style={{ width: `${(sku.LowChoice / sku.totalCustomers) * 100}%` }}></div>}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Vs. Previous</p>
            <p className="text-sm font-bold">₹{sku.prevSales.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${parseFloat(sku.growth) > 0 ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${Math.min(Math.abs(parseFloat(sku.growth)), 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            <LevelBadge level="L1" count={sku.L1Choice} />
            <LevelBadge level="L2" count={sku.L2Choice} />
          </div>
          <button 
            onClick={() => navigateToSkuDetail(sku)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View Details <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Combined Top Performers component
const TopPerformers = ({ topSkus, navigateToSkuDetail }) => {
  const [activeTab, setActiveTab] = useState('sales');
  
  const getTabData = () => {
    switch(activeTab) {
      case 'sales':
        return {
          title: "Top SKUs by Sales",
          data: topSkus.topBySales,
          color: "bg-blue-600",
          valueKey: "currentSales",
          valuePrefix: "₹",
          valueFormat: (val) => val.toLocaleString(undefined, {maximumFractionDigits: 2}),
          noExtra: true
        };
      case 'growth':
        return {
          title: "Fastest Growing SKUs",
          data: topSkus.topByGrowth,
          color: "bg-green-600",
          valueKey: "growth",
          valuePrefix: "",
          valueFormat: (val) => `${val}%`,
          icon: <ArrowUp size={14} className="mr-1" />,
          extraClass: "text-green-600"
        };
      case 'margin':
        return {
          title: "Highest Margin SKUs",
          data: topSkus.topByMargin,
          color: "bg-purple-600",
          valueKey: "currentMargin",
          valuePrefix: "",
          valueFormat: (val) => `${val}%`,
          noExtra: true,
          extraClass: "text-purple-600"
        };
      default:
        return {
          title: "Top SKUs by Sales",
          data: topSkus.topBySales,
          color: "bg-blue-600",
          valueKey: "currentSales",
          valuePrefix: "₹",
          valueFormat: (val) => val.toLocaleString(undefined, {maximumFractionDigits: 2})
        };
    }
  };
  
  const tabData = getTabData();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{tabData.title}</h3>
        <div className="flex rounded-md bg-gray-100 p-1">
          <button 
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1 text-sm font-medium rounded ${activeTab === 'sales' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-700'}`}
          >
            Sales
          </button>
          <button 
            onClick={() => setActiveTab('growth')}
            className={`px-3 py-1 text-sm font-medium rounded ${activeTab === 'growth' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-700'}`}
          >
            Growth
          </button>
          <button 
            onClick={() => setActiveTab('margin')}
            className={`px-3 py-1 text-sm font-medium rounded ${activeTab === 'margin' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-700'}`}
          >
            Margin
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {tabData.data.map((sku, index) => (
          <div 
            onClick={() => navigateToSkuDetail(sku)} 
            key={sku.code} 
            className={`flex cursor-pointer items-center p-3 hover:bg-${activeTab === 'sales' ? 'blue' : activeTab === 'growth' ? 'green' : 'purple'}-50 rounded-lg transition-colors`}
          >
            <div className={`w-6 h-6 rounded-full ${tabData.color} text-white flex items-center justify-center text-xs font-bold mr-3`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{sku.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">{sku.brand}</span>
                <span className={`${tabData.extraClass || 'text-gray-900'} font-semibold flex items-center`}>
                  {tabData.icon && tabData.icon}
                  {tabData.valuePrefix}{tabData.valueFormat(sku[tabData.valueKey])}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerSegmentAnalysis = ({ customerLevelData, COLORS }) => {
    // Calculate total customers for percentages
    const totalCustomers = customerLevelData.reduce((sum, item) => sum + item.value, 0);
    
    // Custom render for pie chart labels
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };
  
    // Icons for each segment
    const getIcon = (index) => {
      switch(index) {
        case 0: return <Award className="w-5 h-5" />;
        case 1: return <TrendingUp className="w-5 h-5" />;
        case 2: return <Users className="w-5 h-5" />;
        default: return <AlertCircle className="w-5 h-5" />;
      }
    };
  
    // Get appropriate text color based on background
    const getTextColor = (index) => {
      switch(index) {
        case 0: return 'text-blue-700';
        case 1: return 'text-green-700';
        case 2: return 'text-yellow-700';
        case 3: return 'text-purple-700';
        default: return 'text-gray-700';
      }
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <Users className="mr-2 w-6 h-6 text-blue-600" />
          Customer Segment Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Charts */}
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium mb-2 text-gray-700">Distribution by Segment</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} customers`, 'Count']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium mb-2 text-gray-700">Segment Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={customerLevelData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value) => [`${value} customers`, 'Count']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {customerLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Right column - Insights */}
          <div>
            <h4 className="text-md font-semibold mb-4 text-gray-800">Customer Segment Insights</h4>
            <div className="space-y-4">
              {customerLevelData.length > 0 ? (
                customerLevelData.map((level, index) => {
                  const percentage = Math.round((level.value / totalCustomers) * 100);
                  return (
                    <div 
                      key={level.name} 
                      className={`p-4 rounded-lg shadow-sm border-l-4 ${
                        index === 0 ? 'border-blue-500 bg-blue-50' :
                        index === 1 ? 'border-green-500 bg-green-50' :
                        index === 2 ? 'border-yellow-500 bg-yellow-50' :
                        index === 3 ? 'border-purple-500 bg-purple-50' :
                        'border-gray-500 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`mr-3 mt-1 ${
                          index === 0 ? 'text-blue-600' :
                          index === 1 ? 'text-green-600' :
                          index === 2 ? 'text-yellow-600' :
                          index === 3 ? 'text-purple-600' :
                          'text-gray-600'
                        }`}>
                          {getIcon(index)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className={`font-medium ${getTextColor(index)}`}>{level.name}</h4>
                            <span className="text-sm font-bold bg-white py-1 px-2 rounded-full shadow-sm">
                              {percentage}% of total
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Customers</span>
                              <span className="font-medium">{level.value.toLocaleString()}</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  index === 0 ? 'bg-blue-500' :
                                  index === 1 ? 'bg-green-500' :
                                  index === 2 ? 'bg-yellow-500' :
                                  index === 3 ? 'bg-purple-500' :
                                  'bg-gray-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-sm mt-2 text-gray-600">
                            {index === 0 ? 'Top-tier customers who provide the highest value.' :
                             index === 1 ? 'Growing segment with significant potential.' :
                             index === 2 ? 'Stable customer base with moderate engagement.' :
                             index === 3 ? 'Emerging customer segment requiring attention.' :
                             'Additional customer segment.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500">No customer data available.</p>
                  <p className="text-sm text-gray-400 mt-1">Please connect your customer data source</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
// Summary cards component
const SummaryCards = ({ metrics, processedData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total SKUs</p>
            <h3 className="text-2xl font-bold mt-1">{metrics.activeSkus}</h3>
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${parseFloat(metrics.growthPercentage) > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {parseFloat(metrics.growthPercentage) > 0 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                {parseFloat(metrics.growthPercentage) > 0 ? '+' : ''}{metrics.growthPercentage}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
          <div className="p-4 rounded-full bg-indigo-600 shadow-sm">
            <Package size={24} className="text-white" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Growing SKUs</span>
            <span className="text-sm font-semibold">{metrics.growingSkus}/{metrics.activeSkus} ({metrics.growthPercentage}%)</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Sales</p>
            <h3 className="text-2xl font-bold mt-1">₹{metrics.totalCurrentSales.toLocaleString(undefined, {maximumFractionDigits: 2})}</h3>
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${parseFloat(metrics.salesGrowth) > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              {parseFloat(metrics.salesGrowth) > 0 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                {parseFloat(metrics.salesGrowth) > 0 ? '+' : ''}{metrics.salesGrowth}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
          <div className="p-4 rounded-full bg-blue-600 shadow-sm">
            <DollarSign size={24} className="text-white" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avg. per SKU</span>
            <span className="text-sm font-semibold">₹{(metrics.totalCurrentSales / (metrics.activeSkus || 1)).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Profit</p>
            <h3 className="text-2xl font-bold mt-1">₹{metrics.totalCurrentProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</h3>
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${parseFloat(metrics.profitGrowth) > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {parseFloat(metrics.profitGrowth) > 0 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                {parseFloat(metrics.profitGrowth) > 0 ? '+' : ''}{metrics.profitGrowth}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
          <div className="p-4 rounded-full bg-green-600 shadow-sm">
            <TrendingUp size={24} className="text-white" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Margin</span>
            <span className="text-sm font-semibold">{metrics.currentMargin}%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Customer Reach</p>
            <h3 className="text-2xl font-bold mt-1">{processedData.reduce((sum, sku) => sum + sku.totalCustomers, 0)}</h3>
            <div className="flex items-center mt-2">
              <span className="text-xs font-medium text-green-500 flex items-center">
                <ArrowUp size={12} className="mr-1" />
                +5.2%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
          <div className="p-4 rounded-full bg-purple-600 shadow-sm">
            <Users size={24} className="text-white" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Premium Customers (L1)</span>
            <span className="text-sm font-semibold">{processedData.reduce((sum, sku) => sum + sku.L1Choice, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SKUAnalytics = ({ data, navigateToSkuDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('currentSales');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'cards' ? 12 : 10;
  
  // Process SKU data
  const processedData = useMemo(() => {
    return data.Skus
      .map(sku => {
        const brandInfo = data.brands.find(brand => brand.BrandCode === sku.brandCode);
        const brandName = brandInfo ? brandInfo.BrandName : 'Unknown';
        const currentSales = parseFloat(sku.CurrentMonthSale) || 0;
        const prevSales = parseFloat(sku.PrevMonthSale) || 0;
        const currentCogs = parseFloat(sku.CurrentMonthCogs) || 0;
        const prevCogs = parseFloat(sku.PrevMonthCogs) || 0;
        
        const currentMargin = currentSales !== 0 
          ? ((currentSales - currentCogs) / currentSales * 100).toFixed(1) 
          : 0;
          
        const prevMargin = prevSales !== 0 
          ? ((prevSales - prevCogs) / prevSales * 100).toFixed(1) 
          : 0;
          
        const growth = prevSales !== 0 
          ? (((currentSales - prevSales) / prevSales) * 100).toFixed(1) 
          : currentSales > 0 ? '100' : '0';
        
        // Calculate performance category
        let performanceCategory = 'neutral';
        if (parseFloat(growth) > 15) performanceCategory = 'high-growth';
        else if (parseFloat(growth) > 0) performanceCategory = 'growing';
        else if (parseFloat(growth) < -15) performanceCategory = 'declining';
        else if (parseFloat(growth) < 0) performanceCategory = 'shrinking';
        
        return {
          name: sku.SkuName,
          code: sku.code,
          brand: brandName,
          brandCode: sku.brandCode,
          currentSales,
          prevSales,
          growth,
          performanceCategory,
          L1Choice: parseInt(sku.L1Choice || 0),
          L2Choice: parseInt(sku.L2Choice || 0),
          L3Choice: parseInt(sku.L3Choice || 0),
          L4Choice: parseInt(sku.L4Choice || 0),
          LowChoice: parseInt(sku.LowChoice || 0),
          totalCustomers: parseInt(sku.L1Choice || 0) + parseInt(sku.L2Choice || 0) + parseInt(sku.L3Choice || 0) + parseInt(sku.L4Choice || 0) + parseInt(sku.LowChoice || 0),
          uom: sku.uom,
          cQty: parseFloat(sku.cQty || 0),
          currentCogs,
          prevCogs,
          currentMargin,
          prevMargin,
          marginChange: (parseFloat(currentMargin) - parseFloat(prevMargin)).toFixed(1)
        };
      });
  }, [data]);
  
  // Calculate metrics
  const metrics = useMemo(() => {
    const totalCurrentSales = processedData.reduce((sum, sku) => sum + sku.currentSales, 0);
    const totalPrevSales = processedData.reduce((sum, sku) => sum + sku.prevSales, 0);
    const salesGrowth = totalPrevSales !== 0 ? ((totalCurrentSales - totalPrevSales) / totalPrevSales * 100).toFixed(1) : 0;
    
    const totalCurrentCogs = processedData.reduce((sum, sku) => sum + sku.currentCogs, 0);
    const totalPrevCogs = processedData.reduce((sum, sku) => sum + sku.prevCogs, 0);
    
    const totalCurrentProfit = totalCurrentSales - totalCurrentCogs;
    const totalPrevProfit = totalPrevSales - totalPrevCogs;
    const profitGrowth = totalPrevProfit !== 0 ? ((totalCurrentProfit - totalPrevProfit) / totalPrevProfit * 100).toFixed(1) : 0;
    
    const currentMargin = totalCurrentSales !== 0 ? ((totalCurrentProfit / totalCurrentSales) * 100).toFixed(1) : 0;
    const prevMargin = totalPrevSales !== 0 ? ((totalPrevProfit / totalPrevSales) * 100).toFixed(1) : 0;
    const marginChange = (parseFloat(currentMargin) - parseFloat(prevMargin)).toFixed(1);
    
    const activeSkus = processedData.filter(sku => sku.currentSales > 0).length;
    const growingSkus = processedData.filter(sku => parseFloat(sku.growth) > 0 && sku.currentSales > 0).length;
    const growthPercentage = activeSkus !== 0 ? ((growingSkus / activeSkus) * 100).toFixed(1) : 0;
    
    const highMarginSkus = processedData.filter(sku => parseFloat(sku.currentMargin) > parseFloat(currentMargin) && sku.currentSales > 0).length;
    
    return {
      totalCurrentSales,
      totalPrevSales,
      salesGrowth,
      totalCurrentProfit,
      profitGrowth,
      currentMargin,
      marginChange,
      activeSkus,
      growingSkus,
      growthPercentage,
      highMarginSkus
    };
  }, [processedData]);
  
  // Top SKUs for different metrics
  const topSkus = useMemo(() => {
    const topBySales = [...processedData]
      .filter(sku => sku.currentSales > 0)
      .sort((a, b) => b.currentSales - a.currentSales)
      .slice(0, 5);
      
    const topByGrowth = [...processedData]
      .filter(sku => sku.prevSales > 0 && sku.currentSales > 0) // Ensure we have valid growth calculations
      .sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth))
      .slice(0, 5);
      
    const topByMargin = [...processedData]
      .filter(sku => sku.currentSales > 0) // Ensure we have valid margin calculations
      .sort((a, b) => parseFloat(b.currentMargin) - parseFloat(a.currentMargin))
      .slice(0, 5);
    
    return { topBySales, topByGrowth, topByMargin };
  }, [processedData]);
  
  // Customer level data
  const customerLevelData = useMemo(() => {
    return [
      { name: 'Top 25% (L1)', value: processedData.reduce((sum, sku) => sum + sku.L1Choice, 0) },
      { name: '25-50% (L2)', value: processedData.reduce((sum, sku) => sum + sku.L2Choice, 0) },
      { name: '50-75% (L3)', value: processedData.reduce((sum, sku) => sum + sku.L3Choice, 0) },
      { name: '75-100% (L4)', value: processedData.reduce((sum, sku) => sum + sku.L4Choice, 0) },
      { name: 'Low Frequency', value: processedData.reduce((sum, sku) => sum + sku.LowChoice, 0) }
    ].filter(item => item.value > 0);
  }, [processedData]);
  
  const filteredSkus = useMemo(() => {
    return processedData
      .filter(sku => {
        // Apply search filter
        const matchesSearch = sku.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            sku.code.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Apply brand filter
        const matchesBrand = selectedBrand === 'all' || sku.brandCode === selectedBrand;
        
        // Apply performance filter
        const matchesPerformance = performanceFilter === 'all' || sku.performanceCategory === performanceFilter;
        
        return matchesSearch && matchesBrand && matchesPerformance;
      })
      .sort((a, b) => {
        // Special case for growth, which is string percent
        if (sortField === 'growth') {
          return sortDirection === 'asc' 
            ? parseFloat(a.growth) - parseFloat(b.growth)
            : parseFloat(b.growth) - parseFloat(a.growth);
        }
        
        // Special case for margin, which is string percent
        if (sortField === 'currentMargin') {
          return sortDirection === 'asc' 
            ? parseFloat(a.currentMargin) - parseFloat(b.currentMargin)
            : parseFloat(b.currentMargin) - parseFloat(a.currentMargin);
        }
        
        if (sortDirection === 'asc') {
          return a[sortField] - b[sortField];
        } else {
          return b[sortField] - a[sortField];
        }
      });
  }, [processedData, searchTerm, selectedBrand, performanceFilter, sortField, sortDirection]);
  
  // Pagination
  const pageCount = Math.ceil(filteredSkus.length / itemsPerPage);
  const paginatedSkus = filteredSkus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Brand options for filter
  const brandOptions = useMemo(() => {
    const brands = data.brands;
    return brands;
  }, [data]);
  
  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, performanceFilter, sortField, sortDirection]);
  
  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {/* <SummaryCards metrics={metrics} processedData={processedData} /> */}
      
      {/* Combined Top Performers and Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <TopPerformers topSkus={topSkus} navigateToSkuDetail={navigateToSkuDetail} />
        
        {/* Customer Segment Analysis */}
        <div className="lg:col-span-2">
          <CustomerSegmentAnalysis customerLevelData={customerLevelData} COLORS={COLORS} />
        </div>
      </div>
      
      {/* SKU Performance Table with Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">SKU Performance Details</h3>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search SKUs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            {/* Brand Filter */}
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none w-full md:w-48"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="all">All Brands</option>
                {brandOptions.map(brand => (
                  <option key={brand.BrandCode} value={brand.BrandCode}>{brand.BrandName}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Performance Filter */}
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none w-full md:w-48"
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
              >
                <option value="all">All Performance</option>
                <option value="high-growth">High Growth (15%+)</option>
                <option value="growing">Growing (0-15%)</option>
                <option value="neutral">Neutral (0%)</option>
                <option value="shrinking">Shrinking (0 to -15%)</option>
                <option value="declining">Declining (-15%+)</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Results count and view toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
          <p className="text-sm text-gray-500">Showing {filteredSkus.length} of {processedData.length} SKUs</p>
          
          <div className="flex items-center space-x-2">
            {/* View toggle buttons */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
                title="Table View"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 ${viewMode === 'cards' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
                title="Card View"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
            
            {/* Sort controls */}
            <div className="flex items-center space-x-2 ml-4">
              <Filter size={14} className="text-gray-500" />
              <span className="text-sm text-gray-500">Sort by:</span>
              <button 
                onClick={() => handleSort('currentSales')}
                className={`text-sm px-2 py-1 rounded ${sortField === 'currentSales' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Sales {sortField === 'currentSales' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSort('growth')}
                className={`text-sm px-2 py-1 rounded ${sortField === 'growth' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Growth {sortField === 'growth' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSort('currentMargin')}
                className={`text-sm px-2 py-1 rounded ${sortField === 'currentMargin' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Margin {sortField === 'currentMargin' && (sortDirection === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>
        
        {/* SKUs Display */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {paginatedSkus.length > 0 ? (
              paginatedSkus.map(sku => (
                <SkuCard 
                  key={sku.code} 
                  sku={sku} 
                  metrics={metrics} 
                  navigateToSkuDetail={navigateToSkuDetail} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No SKUs match your filters. Try adjusting your search criteria.
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200 border-b border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Segments</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedSkus.length > 0 ? (
                  paginatedSkus.map((sku) => (
                    <tr key={sku.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{sku.name}</div>
                            <div className="text-sm text-gray-500">{sku.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sku.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{sku.currentSales.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                        <div className="text-sm text-gray-500">
                          {((sku.currentSales / metrics.totalCurrentSales) * 100).toFixed(1)}% of total
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          parseFloat(sku.growth) > 15 ? 'bg-green-100 text-green-800' : 
                          parseFloat(sku.growth) > 0 ? 'bg-blue-100 text-blue-800' : 
                          parseFloat(sku.growth) === 0 ? 'bg-gray-100 text-gray-800' :
                          parseFloat(sku.growth) > -15 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {parseFloat(sku.growth) > 0 ? '+' : ''}{sku.growth}%
                        </span>
                        {sku.prevSales > 0 && (
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${parseFloat(sku.growth) > 0 ? 'bg-green-600' : 'bg-red-600'}`}
                              style={{ width: `${Math.min(Math.abs(parseFloat(sku.growth)), 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sku.currentMargin}%</div>
                        <div className="text-sm">
                          <span className={parseFloat(sku.marginChange) > 0 ? 'text-green-600' : parseFloat(sku.marginChange) < 0 ? 'text-red-600' : 'text-gray-500'}>
                            {parseFloat(sku.marginChange) > 0 ? '+' : ''}{sku.marginChange}% vs prev
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          <LevelBadge level="L1" count={sku.L1Choice} />
                          <LevelBadge level="L2" count={sku.L2Choice} />
                          <LevelBadge level="L3" count={sku.L3Choice} />
                          <LevelBadge level="L4" count={sku.L4Choice} />
                          <LevelBadge level="Low" count={sku.LowChoice} />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Total: {sku.totalCustomers} customers
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => navigateToSkuDetail(sku)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No SKUs match your filters. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredSkus.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              <div className="hidden md:flex">
                {[...Array(Math.min(5, pageCount))].map((_, i) => {
                  // Calculate the actual page number
                  let pageNum;
                  if (pageCount <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pageCount - 2) {
                    pageNum = pageCount - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                 // Only render if the page number is valid
                 if (pageNum > 0 && pageNum <= pageCount) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium mx-1 ${
                          currentPage === pageNum 
                            ? 'bg-blue-50 border-blue-500 text-blue-600 z-10' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        } rounded-md`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === pageCount ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SKUAnalytics;