import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';

const PurchaseAnalysis = ({ data }) => {
  const [filterView, setFilterView] = useState('invoices'); // 'invoices', 'products', 'trends'
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Check if data is valid
  const isDataValid = useMemo(() => {
    return data && 
      data.sku_recent_purchase_details && 
      Array.isArray(data.sku_recent_purchase_details) && 
      data.paid_with_pending_sku_stock && 
      Array.isArray(data.paid_with_pending_sku_stock);
  }, [data]);

  // Helper functions for data processing
  const getUniqueInvoices = useMemo(() => {
    if (!isDataValid) return [];
    
    const invoiceMap = new Map();
    
    data.sku_recent_purchase_details.forEach(item => {
      if (!invoiceMap.has(item.INVOICENO)) {
        invoiceMap.set(item.INVOICENO, {
          invoiceNo: item.INVOICENO,
          date: new Date(item.DOT).toLocaleDateString(),
          amount: parseFloat(item.INVOICEAMOUNT) || 0,
          rawDate: new Date(item.DOT),
          formattedDate: new Date(item.DOT).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          itemCount: 1
        });
      } else {
        const invoice = invoiceMap.get(item.INVOICENO);
        invoice.itemCount += 1;
      }
    });
    
    return Array.from(invoiceMap.values());
  }, [isDataValid, data]);

  // Sort and filter invoices
  const sortedAndFilteredInvoices = useMemo(() => {
    if (getUniqueInvoices.length === 0) return [];
    
    return getUniqueInvoices
      .filter(invoice => 
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.formattedDate.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortDirection === 'asc' 
            ? a.rawDate - b.rawDate 
            : b.rawDate - a.rawDate;
        } else if (sortField === 'amount') {
          return sortDirection === 'asc' 
            ? a.amount - b.amount 
            : b.amount - a.amount;
        } else if (sortField === 'invoice') {
          return sortDirection === 'asc' 
            ? a.invoiceNo.localeCompare(b.invoiceNo) 
            : b.invoiceNo.localeCompare(a.invoiceNo);
        } else if (sortField === 'items') {
          return sortDirection === 'asc' 
            ? a.itemCount - b.itemCount 
            : b.itemCount - a.itemCount;
        }
        return 0;
      });
  }, [getUniqueInvoices, searchTerm, sortField, sortDirection]);

  // Set initial selected invoice
  useEffect(() => {
    if (sortedAndFilteredInvoices.length > 0 && !selectedInvoice) {
      setSelectedInvoice(sortedAndFilteredInvoices[0].invoiceNo);
    }
  }, [sortedAndFilteredInvoices, selectedInvoice]);

  const toggleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField, sortDirection]);

  const getInvoiceDetails = useCallback((invoiceNo) => {
    if (!isDataValid) return [];
    
    return data.sku_recent_purchase_details.filter(item => item.INVOICENO === invoiceNo);
  }, [isDataValid, data]);

  const getProductTrends = useMemo(() => {
    if (!isDataValid) return [];
    
    const productMap = new Map();
    
    data.sku_recent_purchase_details.forEach(item => {
      if (!productMap.has(item.SkuCode)) {
        productMap.set(item.SkuCode, {
          name: item.SkuName,
          code: item.SkuCode,
          totalQuantity: parseFloat(item.BillQty) || 0,
          currentStock: parseFloat(item.STOCK) || 0,
          pendingStock: parseFloat(item.BalanceQty) || 0,
          purchases: [{
            date: new Date(item.DOT),
            quantity: parseFloat(item.BillQty) || 0,
            invoiceNo: item.INVOICENO
          }]
        });
      } else {
        const product = productMap.get(item.SkuCode);
        product.totalQuantity += parseFloat(item.BillQty) || 0;
        product.purchases.push({
          date: new Date(item.DOT),
          quantity: parseFloat(item.BillQty) || 0,
          invoiceNo: item.INVOICENO
        });
      }
    });
    
    return Array.from(productMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
  }, [isDataValid, data]);

  const getStockVsPending = useMemo(() => {
    if (!isDataValid) return [];
    
    return data.paid_with_pending_sku_stock.map(item => ({
      name: item.SkuName.length > 15 ? `${item.SkuName.substring(0, 15)}...` : item.SkuName,
      fullName: item.SkuName,
      stock: parseFloat(item.STOCK) || 0,
      pending: parseFloat(item.BalanceQty) || 0,
      code: item.SkuCode
    }));
  }, [isDataValid, data]);

  const getMonthlyTrends = useMemo(() => {
    if (!isDataValid) return [];
    
    const monthlyMap = new Map();
    
    data.sku_recent_purchase_details.forEach(item => {
      const date = new Date(item.DOT);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthYear)) {
        monthlyMap.set(monthYear, {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          totalAmount: parseFloat(item.INVOICEAMOUNT) || 0,
          itemCount: 1,
          invoiceCount: 1,
          invoices: [item.INVOICENO]
        });
      } else {
        const monthData = monthlyMap.get(monthYear);
        monthData.itemCount += 1;
        
        // Don't double count invoices
        if (!monthData.invoices.includes(item.INVOICENO)) {
          monthData.invoiceCount += 1;
          monthData.invoices.push(item.INVOICENO);
          monthData.totalAmount += parseFloat(item.INVOICEAMOUNT) || 0;
        }
      }
    });
    
    return Array.from(monthlyMap.values())
      .sort((a, b) => a.date - b.date);
  }, [isDataValid, data]);

  const getInvoiceEfficiency = useMemo(() => {
    if (getUniqueInvoices.length === 0) return [];
    
    return getUniqueInvoices.map(invoice => {
      const details = getInvoiceDetails(invoice.invoiceNo);
      const totalItems = details.length;
      const pendingItems = details.filter(item => parseFloat(item.BalanceQty) > 0).length;
      const fulfilledPercentage = totalItems > 0 ? ((totalItems - pendingItems) / totalItems) * 100 : 100;
      
      return {
        name: invoice.invoiceNo,
        date: invoice.date,
        efficiency: fulfilledPercentage,
        totalItems,
        pendingItems,
        formattedDate: invoice.formattedDate
      };
    });
  }, [getUniqueInvoices, getInvoiceDetails]);

  const getSummaryStats = useMemo(() => {
    if (!isDataValid) return {
      totalInvoices: 0,
      totalProducts: 0,
      pendingProducts: 0,
      totalAmount: 0,
      fullfilledPercentage: 0
    };
    
    const totalInvoices = getUniqueInvoices.length;
    const totalProducts = getProductTrends.length;
    const pendingProducts = data.paid_with_pending_sku_stock.filter(item => parseFloat(item.BalanceQty) > 0).length;
    const totalAmount = getUniqueInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    
    const totalItems = data.sku_recent_purchase_details.length;
    const pendingItems = data.sku_recent_purchase_details.filter(item => parseFloat(item.BalanceQty) > 0).length;
    const fullfilledPercentage = totalItems > 0 ? ((totalItems - pendingItems) / totalItems) * 100 : 100;
    
    return {
      totalInvoices,
      totalProducts,
      pendingProducts,
      totalAmount,
      fullfilledPercentage
    };
  }, [isDataValid, data, getUniqueInvoices, getProductTrends]);

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
          <p className="font-semibold text-gray-700">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
              {item.name.includes('Amount') ? '₹' : ''}
              {item.name.includes('Rate') || item.name.includes('Percentage') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom formatted to handle currency and percentages
  const formatValue = (value, type) => {
    if (type === 'currency') {
      return `₹${value.toLocaleString('en-IN')}`;
    } else if (type === 'percentage') {
      return `${value.toFixed(2)}%`;
    } else {
      return value.toFixed(2);
    }
  };

  const navigate = useNavigate()

  const renderInvoiceList = () => {
    if (!isDataValid) return <div className="text-center p-8">No data available</div>;
    
    return (
      <div className="space-y-6 ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-semibold">Recent Invoices</h3>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search invoices..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="relative group">
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                <div className="p-2">
                  <button 
                    onClick={() => toggleSort('date')} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Sort by Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    onClick={() => toggleSort('amount')} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Sort by Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    onClick={() => toggleSort('invoice')} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Sort by Invoice {sortField === 'invoice' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    onClick={() => toggleSort('items')} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
Sort by Items {sortField === 'items' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAndFilteredInvoices.map((invoice, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 cursor-pointer border-l-4 ${
                selectedInvoice === invoice.invoiceNo ? 'border-l-blue-500' : 'border-l-transparent'
              }`}
              onClick={() => setSelectedInvoice(invoice.invoiceNo)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{invoice.invoiceNo}</h4>
                  <p className="text-sm text-gray-500 mt-1">{invoice.formattedDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">₹{invoice.amount.toLocaleString('en-IN')}</p>
                  <div className="flex items-center justify-end mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-xs text-gray-500">{invoice.itemCount} items</p>
                  </div>
                </div>
              </div>
              
              {selectedInvoice === invoice.invoiceNo && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Status:</span>
                    <span className="font-medium text-blue-600">View Details ↓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {sortedAndFilteredInvoices.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No invoices found matching your search</p>
          </div>
        )}
        
        {selectedInvoice && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <p className="text-sm text-gray-500">Invoice No: {selectedInvoice}</p>
              </div>
              <button 
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center"
                onClick={() => setSelectedInvoice(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getInvoiceDetails(selectedInvoice).map((item, idx) => {
                    const isPending = parseFloat(item.BalanceQty) > 0;
                    const isLowStock = parseFloat(item.STOCK) < parseFloat(item.BalanceQty);
                    
                    return (
                      <tr key={idx} className={isLowStock ? "bg-red-50" : ""}>
                        <td onClick={()=>{navigate(`/inventory/sku-details?sku=${item.SkuCode}`)}} className="px-4 py-3 text-sm font-medium text-blue-700 hover:cursor-pointer"><span className='hover:border-b border-blue-700 '>{item.SkuName}</span></td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.SkuCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{parseFloat(item.BillQty).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{parseFloat(item.STOCK).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{parseFloat(item.BalanceQty).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          {isPending ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Fulfilled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProductAnalysis = () => {
    if (!isDataValid) return <div className="text-center p-8">No data available</div>;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Stock vs Pending Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={getStockVsPending.slice(0, 10)}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="stock" name="Current Stock" fill="#0088FE" />
                <Bar dataKey="pending" name="Pending Stock" fill="#FF8042" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Top Products by Quantity</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getProductTrends.slice(0, 5)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} textAnchor="end" angle={-45} height={70} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="totalQuantity" name="Total Quantity" fill="#8884d8">
                    {getProductTrends.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Product Fulfillment Status</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Fulfilled', value: getProductTrends.filter(p => p.pendingStock === 0).length },
                      { name: 'Pending', value: getProductTrends.filter(p => p.pendingStock > 0).length }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#00C49F" />
                    <Cell fill="#FF8042" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Product Inventory Status</h3>
          <div className="overflow-x-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getProductTrends
                  .filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.code.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((product, idx) => {
                    const isPending = product.pendingStock > 0;
                    const isLowStock = product.currentStock < product.pendingStock;
                    
                    return (
                      <tr key={idx} className={isLowStock ? "bg-red-50" : ""}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{product.code}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{product.totalQuantity.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{product.currentStock.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{product.pendingStock.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          {isPending ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Fulfilled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTrendsAnalysis = () => {
    if (!isDataValid) return <div className="text-center p-8">No data available</div>;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Monthly Purchase Trends</h3>
          <div className="h-80"></div><div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={getMonthlyTrends}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="totalAmount" name="Purchase Amount (₹)" fill="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="invoiceCount" name="Invoice Count" stroke="#82ca9d" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Invoice Fulfillment Efficiency</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getInvoiceEfficiency.slice(0, 10)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} textAnchor="end" angle={-45} height={70} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="efficiency" name="Fulfillment Rate %" fill="#00C49F">
                    {
                      getInvoiceEfficiency.slice(0, 10).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.efficiency < 100 ? '#FF8042' : '#00C49F'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Pending Stock Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getStockVsPending.filter(item => item.pending > 0).slice(0, 5)}
                    dataKey="pending"
                    nameKey="fullName"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label={({ fullName, value, percent }) => 
                      value > 0 ? `${fullName.substring(0, 15)}...: ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {getStockVsPending.filter(item => item.pending > 0).slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pending Stock Details</h3>
            <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              {data.paid_with_pending_sku_stock.filter(item => parseFloat(item.BalanceQty) > 0).length} products pending
            </div>
          </div>
          <div className="overflow-x-auto">
            <input
              type="text"
              placeholder="Search pending items..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.paid_with_pending_sku_stock
                  .filter(item => parseFloat(item.BalanceQty) > 0)
                  .filter(item => 
                    item.SkuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.SkuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.INVOICENO.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, idx) => {
                    const isLowStock = parseFloat(item.STOCK) < parseFloat(item.BalanceQty);
                    return (
                      <tr key={idx} className={isLowStock ? "bg-red-50" : ""}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.SkuName}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.SkuCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{parseFloat(item.BalanceQty).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{parseFloat(item.STOCK).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setFilterView('invoices');
                              setSelectedInvoice(item.INVOICENO);
                            }}
                          >
                            {item.INVOICENO}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(item.DOT).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">
                          {isLowStock ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // If data is not valid, show loading or error state
  if (!isDataValid) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-500">No data available or invalid data format</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Purchase Analysis</h2>
          <div className="mt-3 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setFilterView('invoices')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  filterView === 'invoices'
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Invoices
                </span>
              </button>
              <button
                onClick={() => setFilterView('products')}
                className={`px-4 py-2 text-sm font-medium ${
                  filterView === 'products'
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Products
                </span>
              </button>
              <button
                onClick={() => setFilterView('trends')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  filterView === 'trends'
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Trends & Insights
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-blue-700 font-medium">Total Invoices</div>
                <div className="text-2xl font-bold">{getSummaryStats.totalInvoices}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-green-700 font-medium">Total Products</div>
                <div className="text-2xl font-bold">{getSummaryStats.totalProducts}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-yellow-700 font-medium">Pending Items</div>
                <div className="text-2xl font-bold">{getSummaryStats.pendingProducts}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-purple-700 font-medium">Total Value</div>
                <div className="text-2xl font-bold">₹{getSummaryStats.totalAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {filterView === 'invoices' && renderInvoiceList()}
      {filterView === 'products' && renderProductAnalysis()}
      {filterView === 'trends' && renderTrendsAnalysis()}
    </div>
  );
};

export default PurchaseAnalysis;