import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Tag, PieChart as PieChartIcon, BarChart as BarChartIcon, Info } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../../../../utils/helper';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#0EA5E9', '#4F46E5', '#EF4444'];

const BrandDetails = ({ brandData, comparisonType = 'amount', onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedMetric, setSelectedMetric] = useState('sales'); // 'sales' or 'units'

  const filteredData = brandData?.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (selectedMetric === 'sales') {
      return b.currentMonthSales - a.currentMonthSales;
    } else {
      return b.currentMonthQty - a.currentMonthQty;
    }
  });

  const topPerformers = sortedData.slice(0, 5);

  const renderGrowthIndicator = (growth) => {
    if (growth > 0) {
      return (
        <span className="text-green-500 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          {growth}%
        </span>
      );
    } else if (growth < 0) {
      return (
        <span className="text-red-500 flex items-center">
          <TrendingDown className="w-4 h-4 mr-1" />
          {Math.abs(growth).toFixed(1)}%
        </span>
      );
    } else {
      return <span className="text-gray-500">0%</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Dashboard Title */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-gray-900">Brand Performance Dashboard</h1>
      </div> */}
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Metric Selector */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metric</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 rounded-lg border ${selectedMetric === 'sales' 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => setSelectedMetric('sales')}
              >
                <BarChartIcon className="w-6 h-6 mb-2 mx-auto" />
                <div className="font-medium">Sales Value</div>
              </button>
              <button
                className={`p-4 rounded-lg border ${selectedMetric === 'units' 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => setSelectedMetric('units')}
              >
                <PieChartIcon className="w-6 h-6 mb-2 mx-auto" />
                <div className="font-medium">Units Sold</div>
              </button>
            </div>
          </div>
          
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Performing Brands</h2>
            <div className="space-y-3">
              {topPerformers.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-medium">
                        {selectedMetric === 'sales' 
                          ? formatCurrency(item.currentMonthSales)
                          : item.currentMonthQty.toFixed(0)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-500">Code: {item.code}</span>
                      {renderGrowthIndicator(item.growth)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Chart */}
        <div className="lg:col-span-2 h-full">
          {/* Main Chart */}
          <div className="bg-white h-full rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedMetric === 'sales' ? 'Sales Performance by Brand' : 'Units Sold by Brand'}
            </h2>
            <div className="h-96  my-auto ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topPerformers}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">{`Sales: ${formatCurrency(data.currentMonthSales)}`}</p>
                            <p className="text-sm">{`Units: ${data.currentMonthQty.toFixed(0)}`}</p>
                            <p className="text-sm">{`Growth: ${renderGrowthIndicator(data.growth)}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey={selectedMetric === 'sales' ? 'currentMonthSales' : 'currentMonthQty'}
                    name={selectedMetric === 'sales' ? 'Sales' : 'Units'}
                  >
                    {topPerformers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* All Brands Section - Full Width */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900">All Brands</h2>
          
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-md p-1 max-w-fit">
              <button
                className={`px-3 py-1 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <div className="grid grid-cols-2 gap-1 w-5 h-5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                className={`px-3 py-1 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <div className="flex flex-col gap-1 w-5 h-5 justify-center">
                  <div className="h-0.5 bg-current rounded-full"></div>
                  <div className="h-0.5 bg-current rounded-full"></div>
                  <div className="h-0.5 bg-current rounded-full"></div>
                </div>
              </button>
            </div>
            
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {filteredData.length} brands found
            </div>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredData.map((brand, index) => (
              <div key={index} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 text-white"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{brand.name}</h3>
                    <div className="text-xs text-gray-500">Code: {brand.code}</div>
                  </div>
                  <div className="ml-auto">
                    {renderGrowthIndicator(brand.growth)}
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Current Sales</div>
                    <div className="font-medium">{formatCurrency(brand.currentMonthSales)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Previous Sales</div>
                    <div>{formatCurrency(brand.prevMonthSales)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Units Sold</div>
                    <div>{brand.currentMonthQty.toFixed(0)}</div>
                  </div>
                  <div>
                    <button 
                      onClick={() => onViewDetails(brand)}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors text-sm w-full"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Sales</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((brand, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] + '20', color: COLORS[index % COLORS.length] }}>
                          <Tag className="w-4 h-4" />
                        </div>
                        <div className="font-medium text-gray-900">{brand.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(brand.currentMonthSales)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{renderGrowthIndicator(brand.growth)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{brand.currentMonthQty.toFixed(0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{brand.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => onViewDetails(brand)}
                        className="inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50"
                      >
                        <Info className="w-4 h-4 mr-1" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredData.length === 0 && (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No brands found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDetails;