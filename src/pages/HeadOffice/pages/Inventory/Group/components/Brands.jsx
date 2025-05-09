import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { ChevronRight, ArrowUpRight, TrendingUp, Search, ChevronUp, ChevronDown, Filter } from 'lucide-react';

const BrandsAnalytics = ({ data, navigateToBrandDetail }) => {
  const [sortField, setSortField] = useState('CurrentMonthSales');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

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
    }));

  // All brands with computed metrics
  const allBrands = data.brands.map(brand => {
    const currentSales = parseFloat(brand.CurrentMonthSales) || 0;
    const prevSales = parseFloat(brand.PrevMonthSales) || 0;
    const growth = prevSales !== 0 
      ? (((currentSales - prevSales) / prevSales) * 100).toFixed(1) 
      : currentSales > 0 ? '100' : '0';
    
    const currentCogs = parseFloat(brand.CurrentMonthTotalCogs) || 0;
    const currentProfit = currentSales - currentCogs;
    const currentMargin = currentSales !== 0 ? ((currentProfit / currentSales) * 100).toFixed(1) : 0;
    
    // Count SKUs associated with this brand
    const skuCount = data.Skus.filter(sku => sku.brandCode === brand.BrandCode).length;
    
    return {
      ...brand,
      currentSalesValue: currentSales,
      prevSalesValue: prevSales,
      growthValue: parseFloat(growth),
      profitValue: currentProfit,
      marginValue: parseFloat(currentMargin),
      skuCount: skuCount,
      totalQtySold: parseFloat(brand.CurrentMonthTotalQtySold) || 0
    };
  });
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Sort and filter brands
  const sortedAndFilteredBrands = [...allBrands]
    .filter(brand => 
      brand.BrandName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'BrandName':
          comparison = a.BrandName.localeCompare(b.BrandName);
          break;
        case 'CurrentMonthSales':
          comparison = a.currentSalesValue - b.currentSalesValue;
          break;
        case 'growth':
          comparison = a.growthValue - b.growthValue;
          break;
        case 'margin':
          comparison = a.marginValue - b.marginValue;
          break;
        case 'skuCount':
          comparison = a.skuCount - b.skuCount;
          break;
        case 'totalQtySold':
          comparison = a.totalQtySold - b.totalQtySold;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  // Get top 5 brands for performance summary
  const topBrands = [...allBrands]
    .sort((a, b) => b.currentSalesValue - a.currentSalesValue)
    .slice(0, 5);
  
  const totalBrands = allBrands.length;
  const activeBrands = allBrands.filter(brand => brand.currentSalesValue > 0).length;
  const inactiveBrands = totalBrands - activeBrands;
  
  const totalSales = allBrands.reduce((sum, brand) => sum + brand.currentSalesValue, 0);
  const totalProfit = allBrands.reduce((sum, brand) => sum + brand.profitValue, 0);
  
  // Brand status summary for pie chart
  const brandStatusData = [
    { name: 'Active Brands', value: activeBrands },
    { name: 'Inactive Brands', value: inactiveBrands }
  ];
  
  const COLORS = ['#4ade80', '#f87171'];

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={16} className="opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  // Brand card component
  const BrandCard = ({ brand }) => {
    const growthColor = brand.growthValue > 0 
      ? 'text-green-500' 
      : brand.growthValue < 0 
        ? 'text-red-500' 
        : 'text-gray-500';
    
    const marginColor = brand.marginValue > 20 
      ? 'text-green-600' 
      : brand.marginValue > 10 
        ? 'text-yellow-600' 
        : 'text-red-600';
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800 truncate">{brand.BrandName}</h3>
            {brand.currentSalesValue > 0 ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">Current Sales</p>
              <p className="text-base font-bold">₹{brand.currentSalesValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Growth</p>
              <p className={`text-base font-bold ${growthColor}`}>
                {brand.growthValue > 0 ? '+' : ''}{brand.growthValue}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Margin</p>
              <p className={`text-base font-bold ${marginColor}`}>{brand.marginValue}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">SKUs</p>
              <p className="text-base font-bold">{brand.skuCount}</p>
            </div>
          </div>
          
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <button 
              onClick={() => navigateToBrandDetail(brand)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              View Details <ChevronRight size={16} className="ml-1" />
            </button>
            
            <button 
              onClick={() => console.log(`Navigate to combined performance view for ${brand.BrandName}`)}
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              Performance <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
   
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Brand Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Brand Performance Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="currentSales" name="Current Month" fill="#3B82F6" />
              <Bar dataKey="prevSales" name="Previous Month" fill="#93C5FD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Brand Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Brand Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={brandStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {brandStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} brands`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search brands..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'cards' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'}`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'table' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'}`}
            >
              Table View
            </button>
            
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortField}
                onChange={(e) => {
                  setSortField(e.target.value);
                  setSortDirection('desc');
                }}
              >
                <option value="BrandName">Sort by Name</option>
                <option value="CurrentMonthSales">Sort by Sales</option>
                <option value="growth">Sort by Growth</option>
                <option value="margin">Sort by Margin</option>
                <option value="skuCount">Sort by SKU Count</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Brands Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredBrands.map((brand) => (
            <BrandCard key={brand.BrandCode} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('BrandName')}
                  >
                    <div className="flex items-center">
                      Brand <SortIcon field="BrandName" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('CurrentMonthSales')}
                  >
                    <div className="flex items-center">
                      Current Sales <SortIcon field="CurrentMonthSales" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('growth')}
                  >
                    <div className="flex items-center">
                      Growth <SortIcon field="growth" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('margin')}
                  >
                    <div className="flex items-center">
                      Margin <SortIcon field="margin" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('skuCount')}
                  >
                    <div className="flex items-center">
                      SKUs <SortIcon field="skuCount" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('totalQtySold')}
                  >
                    <div className="flex items-center">
                      Units Sold <SortIcon field="totalQtySold" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredBrands.map((brand) => (
                  <tr key={brand.BrandCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{brand.BrandName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{brand.currentSalesValue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        brand.growthValue > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {brand.growthValue > 0 ? '+' : ''}{brand.growthValue}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.marginValue}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.skuCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.totalQtySold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {brand.currentSalesValue > 0 ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => navigateToBrandDetail(brand)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          Details <ChevronRight size={16} />
                        </button>
                        <button 
                          onClick={() => console.log(`Navigate to performance view for ${brand.BrandName}`)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          Performance <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandsAnalytics;