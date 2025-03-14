import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Award, Search, Filter, ShoppingCart } from 'lucide-react';

const RetailSKUAnalysisMatrix = () => {
  // Sample data for retail supermarket SKUs
  const [skuData, setSkuData] = useState([
    { id: 'SKU001', name: 'Premium Rice (5kg)', category: 'Staples', sales: 12500, profit: 4800, stock: 145 },
    { id: 'SKU002', name: 'Organic Vegetables Pack', category: 'Fresh Produce', sales: 9800, profit: 5200, stock: 72 },
    { id: 'SKU003', name: 'Standard Cooking Oil (1L)', category: 'Cooking', sales: 8700, profit: 3100, stock: 210 },
    { id: 'SKU004', name: 'Economy Wheat Flour', category: 'Staples', sales: 7600, profit: 1900, stock: 168 },
    { id: 'SKU005', name: 'Luxury Spice Gift Box', category: 'Specialty', sales: 6200, profit: 4100, stock: 42 },
    { id: 'SKU006', name: 'Basic Pulses Pack', category: 'Staples', sales: 5400, profit: 1500, stock: 230 },
    { id: 'SKU007', name: 'Premium Tea Selection', category: 'Beverages', sales: 10200, profit: 3800, stock: 85 },
    { id: 'SKU008', name: 'Deluxe Chocolates', category: 'Confectionery', sales: 4200, profit: 2300, stock: 110 },
    { id: 'SKU009', name: 'Standard Snack Pack', category: 'Snacks', sales: 3800, profit: 900, stock: 95 },
    { id: 'SKU010', name: 'Economy Biscuits', category: 'Bakery', sales: 2500, profit: 600, stock: 320 },
    { id: 'SKU011', name: 'Ultra Premium Coffee', category: 'Beverages', sales: 11800, profit: 5500, stock: 65 },
    { id: 'SKU012', name: 'Super Deluxe Dry Fruits', category: 'Specialty', sales: 8900, profit: 4600, stock: 58 },
  ]);

  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('sales');
  const [filteredData, setFilteredData] = useState(skuData);
  const [showLowStock, setShowLowStock] = useState(false);
  const [activeSku, setActiveSku] = useState(null);

  // Get unique categories
  const categories = ['All', ...new Set(skuData.map(sku => sku.category))];

  // Apply filters and search
  useEffect(() => {
    let result = [...skuData];
    
    // Apply category filter
    if (filterCategory !== 'All') {
      result = result.filter(sku => sku.category === filterCategory);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sku => 
        sku.id.toLowerCase().includes(term) || 
        sku.name.toLowerCase().includes(term)
      );
    }
    
    // Apply low stock filter
    if (showLowStock) {
      result = result.filter(sku => sku.stock < 100);
    }
    
    // Apply sorting
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    
    setFilteredData(result);
  }, [filterCategory, searchTerm, skuData, sortBy, showLowStock]);

  // Sort SKUs by sales and profit
  const sortedBySales = [...filteredData].sort((a, b) => b.sales - a.sales);
  const sortedByProfit = [...filteredData].sort((a, b) => b.profit - a.profit);
  
  // Get unique profit and sales values in descending order
  const uniqueProfits = [...new Set(filteredData.map(sku => sku.profit))].sort((a, b) => b - a);
  const uniqueSales = [...new Set(filteredData.map(sku => sku.sales))].sort((a, b) => b - a);
  
  // Create a matrix of SKUs
  const matrix = [];
  for (let i = 0; i < uniqueSales.length; i++) {
    const row = [];
    for (let j = 0; j < uniqueProfits.length; j++) {
      const salesValue = uniqueSales[i];
      const profitValue = uniqueProfits[j];
      
      const matchingSKUs = filteredData.filter(sku => 
        sku.sales === salesValue && sku.profit === profitValue
      );
      
      row.push(matchingSKUs);
    }
    matrix.push(row);
  }

  // Function to get cell background color
  const getCellColor = (salesIndex, profitIndex) => {
    const salesFactor = salesIndex / (uniqueSales.length - 1 || 1);
    const profitFactor = profitIndex / (uniqueProfits.length - 1 || 1);
    const combined = (salesFactor + profitFactor) / 2;
    
    if (combined < 0.33) {
      return `bg-gradient-to-br from-green-500 to-green-700`;
    } else if (combined < 0.66) {
      return `bg-gradient-to-br from-yellow-400 to-yellow-600`;
    } else {
      return `bg-gradient-to-br from-red-400 to-red-600`;
    }
  };

  // Get quadrant label
  const getQuadrantLabel = (salesIndex, profitIndex) => {
    const salesMiddle = uniqueSales.length / 2;
    const profitMiddle = uniqueProfits.length / 2;
    
    if (salesIndex < salesMiddle && profitIndex < profitMiddle) {
      return { label: "Star Products", icon: <Award size={12} className="mr-1" /> };
    } else if (salesIndex < salesMiddle && profitIndex >= profitMiddle) {
      return { label: "High Volume", icon: <ShoppingCart size={12} className="mr-1" /> };
    } else if (salesIndex >= salesMiddle && profitIndex < profitMiddle) {
      return { label: "High Margin", icon: <TrendingUp size={12} className="mr-1" /> };
    } else {
      return { label: "Review Products", icon: <AlertTriangle size={12} className="mr-1" /> };
    }
  };

  // Prepare chart data
  const topProductsChartData = sortedBySales.slice(0, 5).map(sku => ({
    name: sku.name.length > 15 ? sku.name.substring(0, 15) + '...' : sku.name,
    sales: sku.sales,
    profit: sku.profit
  }));

  // Get stock status color
  const getStockStatusColor = (stock) => {
    if (stock < 70) return "text-red-600 bg-red-100";
    if (stock < 100) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Supermarket SKU Analysis</h2>
          <p className="text-gray-600">Performance matrix based on sales and profit</p>
        </div>
        {/* <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search SKUs..."
              className="pl-8 pr-4 py-2 border rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border rounded-lg px-3 py-2 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select 
            className="border rounded-lg px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="sales">Sort by Sales</option>
            <option value="profit">Sort by Profit</option>
            <option value="stock">Sort by Stock</option>
          </select>
          <button 
            className={`flex items-center rounded-lg px-3 py-2 text-sm ${showLowStock ? 'bg-blue-600 text-white' : 'bg-white border'}`}
            onClick={() => setShowLowStock(!showLowStock)}
          >
            <AlertTriangle size={16} className="mr-1" /> 
            Low Stock
          </button>
        </div> */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <Award className="mr-2 text-yellow-500" size={20} />
            Top Products
          </h3>
          <ul className="space-y-2 flex">
            {sortedBySales.slice(0, 5).map(sku => (
              <li key={sku.id} 
                className={`flex justify-between p-2 rounded border-l-4 hover:bg-blue-50 cursor-pointer ${activeSku === sku.id ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
                onClick={() => setActiveSku(activeSku === sku.id ? null : sku.id)}
              >
                <div>
                  <div className="font-medium">{sku.name}</div>
                  <div className="text-xs text-gray-500">{sku.category} • {sku.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{sku.sales.toLocaleString()}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getStockStatusColor(sku.stock)}`}>
                    Stock: {sku.stock}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* <div className="bg-white p-4 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h3 className="font-bold text-lg mb-2">Performance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, null]}
                  labelFormatter={(value) => `Product: ${value}`}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales (₹)" fill="#3b82f6" />
                <Bar dataKey="profit" name="Profit (₹)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>
      
      <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">SKU Matrix Analysis</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-700 mr-1 rounded"></div>
              <span>Stars</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 mr-1 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 mr-1 rounded"></div>
              <span>Review</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-1 text-green-600" />
            <span className="text-sm font-medium">High Sales</span>
            <span className="mx-2 text-gray-400">→</span>
            <TrendingDown size={16} className="mr-1 text-red-600" />
            <span className="text-sm font-medium">Low Sales</span>
          </div>
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-1 text-green-600" />
            <span className="text-sm font-medium">High Profit</span>
            <span className="mx-2 text-gray-400">→</span>
            <TrendingDown size={16} className="mr-1 text-red-600" />
            <span className="text-sm font-medium">Low Profit</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <tbody>
              {matrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const colorClass = getCellColor(rowIndex, colIndex);
                    const { label, icon } = getQuadrantLabel(rowIndex, colIndex);
                    
                    return (
                      <td 
                        key={colIndex} 
                        className={`border border-gray-200 ${colorClass}`}
                        style={{ width: '160px', height: '160px' }}
                      >
                        {cell.length > 0 ? (
                          <div className="p-2 h-full flex flex-col">
                            <div className="text-xs font-bold text-white mb-1 bg-black bg-opacity-30 p-1 rounded flex items-center">
                              {icon}
                              {label}
                            </div>
                            <div className="overflow-y-auto flex-1">
                              {cell.map(sku => (
                                <div 
                                  key={sku.id} 
                                  className={`mb-1 p-2 bg-white bg-opacity-90 rounded shadow-sm hover:shadow-md transition-all cursor-pointer ${activeSku === sku.id ? 'ring-2 ring-blue-500' : ''}`}
                                  onClick={() => setActiveSku(activeSku === sku.id ? null : sku.id)}
                                >
                                  <div className="font-bold text-sm">{sku.name}</div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500">{sku.id}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full inline-block bg-blue-100 text-blue-800">
                                      {sku.category}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 mt-1">
                                    <div className="text-xs bg-gray-100 p-1 rounded">
                                      <span>Sales:</span>
                                      <span className="font-medium float-right">₹{sku.sales.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs bg-gray-100 p-1 rounded">
                                      <span>Profit:</span>
                                      <span className="font-medium float-right">₹{sku.profit.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs bg-gray-100 p-1 rounded col-span-2">
                                      <span>Stock:</span>
                                      <span className={`font-medium float-right ${sku.stock < 100 ? 'text-red-600' : 'text-green-600'}`}>
                                        {sku.stock} units
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center p-2">
                            <div className="text-xs font-bold text-white mb-1 bg-black bg-opacity-30 p-1 rounded flex items-center w-full justify-center">
                              {icon}
                              {label}
                            </div>
                            <span className="text-xs text-white bg-black bg-opacity-30 p-1 rounded">No Products</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-sm mb-3">Recommended Actions</h3>
          <div className="space-y-2  flex">
            <div className="p-2 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="font-bold mb-1 flex items-center">
                <Award size={14} className="mr-1 text-green-600" />
                Star Products
              </div>
              <div className="text-xs text-gray-700">Maintain prime shelf positions. Consider bundle promotions with lower-performing items.</div>
            </div>
            <div className="p-2 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="font-bold mb-1 flex items-center">
                <ShoppingCart size={14} className="mr-1 text-blue-600" />
                High Volume
              </div>
              <div className="text-xs text-gray-700">Analyze price elasticity. Test small price increases to improve margins without affecting demand.</div>
            </div>
            <div className="p-2 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="font-bold mb-1 flex items-center">
                <TrendingUp size={14} className="mr-1 text-yellow-600" />
                High Margin
              </div>
              <div className="text-xs text-gray-700">Improve visibility with end cap displays. Consider quantity discounts to boost volume.</div>
            </div>
            <div className="p-2 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="font-bold mb-1 flex items-center">
                <AlertTriangle size={14} className="mr-1 text-red-600" />
                Review Products
              </div>
              <div className="text-xs text-gray-700">Consider repackaging, price adjustments, or replacement with better-performing alternatives.</div>
            </div>
          </div>
        </div>
        
        {/* <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-sm mb-3">Inventory Alerts</h3>
          <div className="space-y-2">
            {sortedBySales.filter(sku => sku.stock < 100).slice(0, 4).map(sku => (
              <div key={sku.id} className="p-2 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="font-bold text-sm">{sku.name}</div>
                <div className="flex justify-between text-xs">
                  <span>{sku.id}</span>
                  <span className="font-medium text-red-600">Stock: {sku.stock} units</span>
                </div>
              </div>
            ))}
            {sortedBySales.filter(sku => sku.stock < 100).length === 0 && (
              <div className="p-2 bg-green-50 border-l-4 border-green-500 rounded">
                <div className="text-sm">All products have adequate stock levels</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-sm mb-3">Category Performance</h3>
          <div className="space-y-2">
            {categories.filter(cat => cat !== 'All').map(category => {
              const catItems = skuData.filter(sku => sku.category === category);
              const totalSales = catItems.reduce((sum, item) => sum + item.sales, 0);
              const totalProfit = catItems.reduce((sum, item) => sum + item.profit, 0);
              const avgMargin = (totalProfit / totalSales * 100).toFixed(1);
              
              return (
                <div key={category} className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="font-bold">{category}</div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <div className="text-xs">
                      <span>Total Sales:</span>
                      <span className="font-medium float-right">₹{totalSales.toLocaleString()}</span>
                    </div>
                    <div className="text-xs">
                      <span>Avg. Margin:</span>
                      <span className="font-medium float-right">{avgMargin}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default RetailSKUAnalysisMatrix;