import React, { useState } from 'react';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon, CreditCardIcon, Info } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../../../../utils/helper';

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="font-medium">{payload[0].payload.groupName}</p>
        <p className="text-sm">{`Growth: ${payload[0].value.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const renderGrowthIndicator = (growth) => {
  if (growth > 0) {
    return (
      <span className="text-green-500 flex items-center justify-end">
        <TrendingUpIcon className="w-4 h-4 mr-1" />
        {growth.toFixed(1)}%
      </span>
    );
  } else if (growth < 0) {
    return (
      <span className="text-red-500 flex items-center justify-end">
        <TrendingDownIcon className="w-4 h-4 mr-1" />
        {Math.abs(growth).toFixed(1)}%
      </span>
    );
  } else {
    return <span className="text-gray-500">0%</span>;
  }
};

const ProductGroups = ({ salesData, comparisonType = 'amount', onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredData = salesData?.filter(group => 
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Overview Charts */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Product Groups Overview</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Group Distribution Pie Chart */}
          <div className=''>
            <h3 className="text-md col-span-1 font-medium text-gray-700 mb-4">Top Performing Groups</h3>
            <div className="space-y-4">
              {salesData
                .sort((a, b) => comparisonType === 'amount' 
                  ? parseFloat(b.currentMonthAmount) - parseFloat(a.currentMonthAmount)
                  : parseFloat(b.currentMonthQty) - parseFloat(a.currentMonthQty)
                )
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.groupName}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {comparisonType === 'amount' 
                            ? formatCurrency(item.currentMonthAmount)
                            : item.currentMonthQty.toFixed(0)
                          }
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{ 
                            width: `${(comparisonType === 'amount' 
                              ? parseFloat(item.currentMonthAmount) / parseFloat(salesData[0].currentMonthAmount)
                              : parseFloat(item.currentMonthQty) / parseFloat(salesData[0].currentMonthQty)
                            ) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          
          {/* Group Growth Chart */}
          <div className="h-96 lg:col-span-2">
            <h3 className="text-md font-medium text-gray-700 mb-4">Month-over-Month Growth by Group</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={['dataMin', 'dataMax']} />
                <YAxis type="category" dataKey="groupName" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey={comparisonType === 'amount' ? 'amountGrowth' : 'qtyGrowth'} 
                  name="Growth %" 
                  fill="#4F46E5"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Search Bar and View Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className="text-lg font-medium text-gray-900">All Product Groups</h2>
        
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search product groups..."
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
            {filteredData.length} groups found
          </div>
        </div>
      </div>
      
      {/* Product Groups - Grid or List View */}
      <div className="bg-white shadow rounded-lg p-6">
        {viewMode === 'grid' ? (
          // Grid View (Card display)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredData.map((group, index) => {
              const margin = parseFloat(group.currentMonthAmount) - parseFloat(group.currentMonthCogs);
              const marginPercent = parseFloat(group.currentMonthCogs) > 0 
                ? (margin / parseFloat(group.currentMonthAmount) * 100).toFixed(1) 
                : "N/A";
              
              const cardColor = COLORS[index % COLORS.length];
              
              return (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="h-2" style={{ backgroundColor: cardColor }}></div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{group.groupName}</h3>
                      <div className="p-2 rounded-full bg-gray-100">
                        <CreditCardIcon className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Current Sales</p>
                          <p className="text-lg font-medium text-gray-900">{formatCurrency(group.currentMonthAmount)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Previous Sales</p>
                          <p className="text-sm text-gray-900">{formatCurrency(group.prevMonthAmount)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Growth</p>
                          <div className="text-sm">{renderGrowthIndicator(group.amountGrowth)}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Units</p>
                          <p className="text-sm text-gray-900">{group.currentMonthQty.toFixed(0)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Margin</p>
                          <p className={`text-sm ${marginPercent !== "N/A" && parseFloat(marginPercent) < 20 ? "text-red-500" : "text-green-500"}`}>
                            {marginPercent !== "N/A" ? `${marginPercent}%` : marginPercent}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <button 
                        onClick={() => onViewDetails(group)}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center justify-center"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View (Table display)
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Sales</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Sales</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin %</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((group, index) => {
                  const margin = parseFloat(group.currentMonthAmount) - parseFloat(group.currentMonthCogs);
                  const marginPercent = parseFloat(group.currentMonthCogs) > 0 
                    ? (margin / parseFloat(group.currentMonthAmount) * 100).toFixed(1) 
                    : "N/A";
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                            style={{ 
                              backgroundColor: COLORS[index % COLORS.length] + '20', 
                              color: COLORS[index % COLORS.length] 
                            }}
                          >
                            <CreditCardIcon className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-gray-900">{group.groupName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(group.currentMonthAmount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(group.prevMonthAmount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{renderGrowthIndicator(group.amountGrowth)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{group.currentMonthQty.toFixed(0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${marginPercent !== "N/A" && parseFloat(marginPercent) < 20 ? "text-red-500" : "text-green-500"}`}>
                          {marginPercent !== "N/A" ? `${marginPercent}%` : marginPercent}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => onViewDetails(group)}
                          className="inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50"
                        >
                          <Info className="w-4 h-4 mr-1" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredData.length === 0 && (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No product groups found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGroups;