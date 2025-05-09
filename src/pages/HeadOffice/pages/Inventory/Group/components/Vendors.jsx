import React, { useState } from 'react';
import { SearchIcon, FilterIcon, TrendingUpIcon, TrendingDownIcon, Truck, Package, DollarSign, ShoppingBag } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../../../../utils/helper';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="font-medium">{payload[0].payload.name}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            {`${entry.name}: ${entry.dataKey.includes('Qty') ? entry.value.toFixed(0) : formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VendorsSection = ({ vendorData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'regular'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'amount', 'purchaseQty', 'stockQty'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Apply filters and sorting
  const filteredVendors = vendorData
    .filter(vendor => 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterStatus === 'all' || 
       (filterStatus === 'paid' && vendor.isPaid) || 
       (filterStatus === 'regular' && !vendor.isPaid))
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'amount':
          comparison = a.totalInvoiceAmount - b.totalInvoiceAmount;
          break;
        case 'purchaseQty':
          comparison = a.totalBillQty - b.totalBillQty;
          break;
        case 'stockQty':
          comparison = a.totalStock - b.totalStock;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // Default to descending when changing sort field
    }
  };

  const navigate = useNavigate()

  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
  };

  return (
    <div className="space-y-8">
      {/* Vendors Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Vendors Overview</h2>
        
        {/* Alert for vendors who paid without clearing stock */}
        {vendorData.some(v => v.isPaid) && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {vendorData.filter(v => v.isPaid).length} vendors have been paid but still have pending stock to be delivered.
                  <button className="ml-2 text-yellow-800 underline" onClick={() => handleFilterChange('paid')}>
                    View all
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Vendor Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Vendors by Purchase */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">Top Vendors by Purchase</h3>
            <div className="space-y-4">
              {vendorData
                .sort((a, b) => parseFloat(b.totalInvoiceAmount) - parseFloat(a.totalInvoiceAmount))
                .slice(0, 5)
                .map((vendor, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{vendor.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(vendor.totalInvoiceAmount)}
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{ 
                            width: `${(parseFloat(vendor.totalInvoiceAmount) / parseFloat(vendorData[0].totalInvoiceAmount)) * 100}%`,
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
          
          {/* Vendor Purchase Distribution Chart */}
          <div className="h-72">
            <h3 className="text-md font-medium text-gray-700 mb-4">Purchase Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorData.slice(0, 5)} // Top 5 vendors
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalInvoiceAmount"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {vendorData.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Inventory Status by Vendor */}
          <div className="h-72">
            <h3 className="text-md font-medium text-gray-700 mb-4">Inventory Status by Vendor</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vendorData.slice(0, 5)} // Top 5 vendors
                margin={{ top: 5, right: 30, left: 5, bottom: 25 }}
                barSize={15}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="totalBillQty" name="Purchased Qty" fill="#4F46E5" />
                <Bar dataKey="totalStock" name="Current Stock" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Vendors</p>
                <p className="text-xl font-semibold text-gray-800">{vendorData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Purchase Value</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatCurrency(vendorData.reduce((sum, vendor) => sum + vendor.totalInvoiceAmount, 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Quantity Purchased</p>
                <p className="text-xl font-semibold text-gray-800">
                  {vendorData.reduce((sum, vendor) => sum + vendor.totalBillQty, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="text-xl font-semibold text-gray-800">
                  {vendorData.reduce((sum, vendor) => sum + vendor.totalStock, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search, Filter and View Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className="text-lg font-medium text-gray-900">All Vendors</h2>
        
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Options */}
          <div className="flex border border-gray-300 rounded-md">
            <button 
              className={`px-3 py-2 text-sm ${filterStatus === 'all' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700'}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-2 text-sm border-l border-gray-300 ${filterStatus === 'regular' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700'}`}
              onClick={() => handleFilterChange('regular')}
            >
              Regular
            </button>
            <button 
              className={`px-3 py-2 text-sm border-l border-gray-300 ${filterStatus === 'paid' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700'}`}
              onClick={() => handleFilterChange('paid')}
            >
              Paid (Stock Pending)
            </button>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-md p-1">
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
            {filteredVendors.length} vendors found
          </div>
        </div>
      </div>
      
      {/* Vendors - Grid or List View */}
      <div className="bg-white shadow rounded-lg p-6">
        {viewMode === 'grid' ? (
          // Grid View (Card display)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVendors.map((vendor, index) => {
              const cardColor = COLORS[index % COLORS.length];
              const stockPercentage = Math.min((vendor.totalStock / vendor.totalBillQty) * 100, 100);
              
              return (
                <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 ${vendor.isPaid ? 'ring-2 ring-yellow-300' : ''}`}>
                  <div className="h-2" style={{ backgroundColor: cardColor }}></div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{vendor.name}</h3>
                      <div className="p-2 rounded-full bg-gray-100">
                        <Truck className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    
                    {vendor.isPaid && (
                      <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-400 p-2 text-xs text-yellow-800">
                        Paid (Stock Pending)
                      </div>
                    )}
                    
                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Total Purchases</p>
                          <p className="text-lg font-medium text-gray-900">{formatCurrency(vendor.totalInvoiceAmount)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Last Purchase</p>
                          <p className="text-sm text-gray-900">
                            {vendor.lastPurchaseDate ? new Date(vendor.lastPurchaseDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Current Stock</span>
                          <span className="text-gray-700">{vendor.totalStock.toFixed(0)} / {vendor.totalBillQty.toFixed(0)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${stockPercentage < 50 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${100 - stockPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Invoices</p>
                          <p className="text-sm text-gray-900">{vendor.invoiceCount || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500 mb-1">Contributed Qty</p>
                          <p className="text-sm text-gray-900">{vendor.totalContribQty.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <button 
                      onClick={()=>{navigate(`/inventory/vendor-details/${vendor.code}`)}}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('name')}>
                    <div className="flex items-center">
                      Vendor Name
                      {sortBy === 'name' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Purchase
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('amount')}>
                    <div className="flex items-center justify-end">
                      Invoice Amount
                      {sortBy === 'amount' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('purchaseQty')}>
                    <div className="flex items-center justify-end">
                      Purchase Qty
                      {sortBy === 'purchaseQty' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contributed Qty
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('stockQty')}>
                    <div className="flex items-center justify-end">
                      Current Stock
                      {sortBy === 'stockQty' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoices
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor, index) => (
                  <tr key={index} className={`hover:bg-gray-50 ${vendor.isPaid ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                          style={{ 
                            backgroundColor: COLORS[index % COLORS.length] + '20', 
                            color: COLORS[index % COLORS.length] 
                          }}
                        >
                          <Truck className="w-4 h-4" />
                        </div>
                        <div className="font-medium text-gray-900">{vendor.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {vendor.isPaid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Paid (Stock Pending)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {vendor.lastPurchaseDate ? new Date(vendor.lastPurchaseDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                      {formatCurrency(vendor.totalInvoiceAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {vendor.totalBillQty.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {vendor.totalContribQty.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {vendor.totalStock.toFixed(0)}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${(vendor.totalStock / vendor.totalBillQty) < 0.5 ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${100 - Math.min((vendor.totalStock / vendor.totalBillQty) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {vendor.invoiceCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button onClick={()=>{navigate(`/inventory/vendor-details/${vendor.code}`)}} className="inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredVendors.length === 0 && (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No vendors found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsSection;