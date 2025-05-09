import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { ChevronRight, ArrowUpRight, TrendingUp, DollarSign, Package, Users, Percent, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';

// Card component with improved visuals

// Badge component for customer levels
const LevelBadge = ({ level, count }) => {
  const colors = {
    L1: 'bg-blue-100 text-blue-800',
    L2: 'bg-green-100 text-green-800',
    L3: 'bg-yellow-100 text-yellow-800',
    L4: 'bg-purple-100 text-purple-800',
    Low: 'bg-gray-100 text-gray-800',
  };
  
  return count > 0 ? (
    <span className={`${colors[level]} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {level}: {count}
    </span>
  ) : null;
};

// Chart Card wrapper component
const ChartCard = ({ title, subtitle, children, height = 300, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
};

const OverviewDashboard = ({ data, navigateToSkuDetail, navigateToBrandDetail }) => {
  // Helpers for data manipulation
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
  
  const getTotalUnits = () => {
    return data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.CurrentMonthSale) ? 1 : 0);
    }, 0);
  };
  
  const getActiveBrands = () => {
    return data.brands.filter(brand => 
      parseFloat(brand.CurrentMonthSales) > 0 || 
      parseFloat(brand.PrevMonthSales) > 0
    ).length;
  };

  // Prepare chart data
  const brandSalesData = data.brands
    .filter(brand => parseFloat(brand.CurrentMonthSales) > 0 || parseFloat(brand.PrevMonthSales) > 0)
    .map(brand => ({
      name: brand.BrandName,
      currentSales: parseFloat(brand.CurrentMonthSales) || 0,
      prevSales: parseFloat(brand.PrevMonthSales) || 0,
      growth: parseFloat(brand.PrevMonthSales) 
        ? (((parseFloat(brand.CurrentMonthSales) - parseFloat(brand.PrevMonthSales)) / parseFloat(brand.PrevMonthSales)) * 100).toFixed(1) 
        : 0
    }))
    .sort((a, b) => b.currentSales - a.currentSales);
  
  const skuPerformanceData = data.Skus
    .filter(sku => parseFloat(sku.CurrentMonthSale) > 0 || parseFloat(sku.PrevMonthSale) > 0)
    .map(sku => {
      const brandInfo = data.brands.find(brand => brand.BrandCode === sku.brandCode);
      const brandName = brandInfo ? brandInfo.BrandName : 'Unknown';
      
      return {
        name: sku.SkuName,
        code: sku.code,
        brand: brandName,
        currentSales: parseFloat(sku.CurrentMonthSale) || 0,
        prevSales: parseFloat(sku.PrevMonthSale) || 0,
        growth: parseFloat(sku.PrevMonthSale) 
          ? (((parseFloat(sku.CurrentMonthSale || 0) - parseFloat(sku.PrevMonthSale)) / parseFloat(sku.PrevMonthSale)) * 100).toFixed(1) 
          : 0,
        L1Choice: parseInt(sku.L1Choice),
        L2Choice: parseInt(sku.L2Choice),
        L3Choice: parseInt(sku.L3Choice),
        L4Choice: parseInt(sku.L4Choice),
        LowChoice: parseInt(sku.LowChoice),
        uom: sku.uom,
        cQty: parseFloat(sku.cQty),
        currentCogs: parseFloat(sku.CurrentMonthCogs) || 0,
        prevCogs: parseFloat(sku.PrevMonthCogs) || 0
      };
    })
    .sort((a, b) => b.currentSales - a.currentSales);
  
  // Calculate current margin and previous margin for skus
  const skusWithMargins = skuPerformanceData.map(sku => ({
    ...sku,
    currentMargin: sku.currentSales !== 0 
      ? ((sku.currentSales - sku.currentCogs) / sku.currentSales * 100).toFixed(1) 
      : 0,
    prevMargin: sku.prevSales !== 0 
      ? ((sku.prevSales - sku.prevCogs) / sku.prevSales * 100).toFixed(1) 
      : 0,
  }));
  
  // Prepare customer level data for pie chart
  const customerLevelData = [
    { name: 'Top 25% (L1)', value: skuPerformanceData.reduce((sum, sku) => sum + sku.L1Choice, 0) },
    { name: '25-50% (L2)', value: skuPerformanceData.reduce((sum, sku) => sum + sku.L2Choice, 0) },
    { name: '50-75% (L3)', value: skuPerformanceData.reduce((sum, sku) => sum + sku.L3Choice, 0) },
    { name: '75-100% (L4)', value: skuPerformanceData.reduce((sum, sku) => sum + sku.L4Choice, 0) },
    { name: 'Low Frequency', value: skuPerformanceData.reduce((sum, sku) => sum + sku.LowChoice, 0) }
  ].filter(item => item.value > 0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Data for monthly comparison
  const salesComparisonData = [
    { name: 'Previous Month', value: parseFloat(getTotalPrevSales()) },
    { name: 'Current Month', value: parseFloat(getTotalCurrentSales()) }
  ];

  // Calculate month-over-month changes
  const salesChange = parseFloat(getSalesGrowth());
  const profitChange = parseFloat(getProfitGrowth());
  const marginChange = parseFloat(getMarginChange());

  return (
    <div className="space-y-6">
      {/* Header Stats */}
     

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Trend */}
        <ChartCard 
          title="Sales Trend" 
          subtitle="Month-over-month comparison"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Customer Segments */}
        <ChartCard 
          title="Customer Segments" 
          subtitle="Distribution by value segment"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerLevelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} customers`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Brand Performance */}
      <ChartCard 
        title="Brand Performance" 
        subtitle="Current vs Previous Month"
        height={350}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={brandSalesData.slice(0, 7)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="currentSales" name="Current Month" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="prevSales" name="Previous Month" fill="#93C5FD" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top Performing SKUs */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Top Performing SKUs</h2>
          <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skusWithMargins.slice(0, 5).map((sku) => (
                <tr key={sku.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sku.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sku.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{sku.currentSales.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      parseFloat(sku.growth) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {parseFloat(sku.growth) > 0 ? '+' : ''}{sku.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sku.currentMargin}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => navigateToSkuDetail(sku)}
                      className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                    >
                      Details <ChevronRight size={16} className="ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Customer Segment Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {customerLevelData.map((level, index) => (
            <div key={level.name} className={`p-4 rounded-lg border ${
              index === 0 ? 'border-blue-200 bg-blue-50' :
              index === 1 ? 'border-green-200 bg-green-50' :
              index === 2 ? 'border-yellow-200 bg-yellow-50' :
              index === 3 ? 'border-purple-200 bg-purple-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <h4 className="font-medium text-sm">{level.name}</h4>
              <p className="text-xl font-bold mt-2 mb-1">{level.value}</p>
              <p className="text-xs text-gray-600">
                {index === 0 && 'Premium customers'}
                {index === 1 && 'Regular buyers'}
                {index === 2 && 'Occasional buyers'}
                {index === 3 && 'Infrequent buyers'}
                {index === 4 && 'Rare purchasers'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;