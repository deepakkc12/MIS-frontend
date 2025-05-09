import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getRequest } from '../../../../../services/apis/requests';
import MainLayout from '../../../Layout/Layout';

// Custom Card component to replace shadcn UI
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-700">Loading OPEX data...</span>
  </div>
);

const OpexAnalyticsDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [salesVsOpexComparison, setSalesVsOpexComparison] = useState({
    "opex": {
      "Month1Debit": "198402.3631",
      "Month1Credit": "37260.8152",
      "Month2Debit": "98163.9314",
      "Month2Credit": "1669.5122"
    },
    "sales": {
      "M1TotalSales": "5242544.5790",
      "M2TotalSales": "3553295.8410"
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRequest(`acc/opex-list/`);
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || "Failed to fetch data");
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Data processing functions
  const processData = (rawData) => {
    if (!rawData || !rawData.length) return [];
    
    return rawData.map(item => ({
      name: item.Name,
      netAmount: parseFloat(item.TotalDr || 0) - parseFloat(item.TotalCr || 0),
      month1: parseFloat(item.M1Dr || 0) - parseFloat(item.m1Cr || 0),
      month2: parseFloat(item.M2Dr || 0) - parseFloat(item.M2Cr || 0),
      code: item.code,
      accHead: item.AccHead
    }));
  };

  const groupByCategory = (processedData) => {
    if (!processedData || !processedData.length) return [];
    
    const grouped = processedData.reduce((acc, item) => {
      const category = item.accHead || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.netAmount;
      return acc;
    }, {});
    
    return Object.keys(grouped)
      .map(key => ({
        name: key,
        value: grouped[key]
      }))
      .filter(item => item.value !== 0)
      .sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const getTopExpenses = (processedData, limit = 5) => {
    if (!processedData || !processedData.length) return [];
    
    return [...processedData]
      .sort((a, b) => b.netAmount - a.netAmount)
      .slice(0, limit)
      .map(item => ({
        ...item,
        name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
      }));
  };

  const getSalesVsOpexData = () => {
    const month1Opex = parseFloat(salesVsOpexComparison.opex.Month1Debit || 0) - parseFloat(salesVsOpexComparison.opex.Month1Credit || 0);
    const month2Opex = parseFloat(salesVsOpexComparison.opex.Month2Debit || 0) - parseFloat(salesVsOpexComparison.opex.Month2Credit || 0);
    const month1Sales = parseFloat(salesVsOpexComparison.sales.M1TotalSales || 0);
    const month2Sales = parseFloat(salesVsOpexComparison.sales.M2TotalSales || 0);

    return [
      {
        name: "Month 1",
        sales: month1Sales,
        opex: month1Opex,
        opexRatio: month1Sales !== 0 ? (month1Opex / month1Sales) * 100 : 0
      },
      {
        name: "Month 2",
        sales: month2Sales,
        opex: month2Opex,
        opexRatio: month2Sales !== 0 ? (month2Opex / month2Sales) * 100 : 0
      }
    ];
  };

  const getCategoryComparisonData = (processedData) => {
    if (!processedData || !processedData.length) return [];
    
    const categories = {};
    
    processedData.forEach(item => {
      const category = item.accHead || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = {
          name: category,
          month1: 0,
          month2: 0
        };
      }
      categories[category].month1 += item.month1;
      categories[category].month2 += item.month2;
    });
    
    return Object.values(categories)
      .sort((a, b) => (b.month1 + b.month2) - (a.month1 + a.month2))
      .slice(0, 8) // Top 8 categories
      .map(item => ({
        ...item,
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      }));
  };

  // Calculate total metrics
  const processedData = processData(data);
  const categoryData = groupByCategory(processedData).slice(0, 10); // Top 10 categories
  const topExpenses = getTopExpenses(processedData);
  const categoryComparisonData = getCategoryComparisonData(processedData);
  const salesVsOpexData = getSalesVsOpexData();

  // Calculate trends and totals
  const totalOpex = processedData.reduce((acc, item) => acc + item.netAmount, 0);
  const month1Total = processedData.reduce((acc, item) => acc + item.month1, 0);
  const month2Total = processedData.reduce((acc, item) => acc + item.month2, 0);
  const percentChange = month1Total !== 0 
    ? ((month2Total - month1Total) / Math.abs(month1Total)) * 100 
    : month2Total > 0 ? 100 : 0;
    
  // Calculate OPEX to sales ratio
  const month1Sales = parseFloat(salesVsOpexComparison.sales.M1TotalSales || 0);
  const month2Sales = parseFloat(salesVsOpexComparison.sales.M2TotalSales || 0);
  const month1OpexRatio = month1Sales !== 0 ? (month1Total / month1Sales) * 100 : 0;
  const month2OpexRatio = month2Sales !== 0 ? (month2Total / month2Sales) * 100 : 0;
  
  // Colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6B6B', '#4CAF50', '#F44336', '#2196F3', '#795548'];
  
  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;
  if (error) return <div className="text-red-500 p-4 bg-white rounded-lg shadow-sm">{error}</div>;
  
  return (
    <MainLayout>
      <div className="p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">OPEX Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Last 2 months OpEx data analysis</p>
          </div>
          
          <Card className="px-4 py-2 bg-blue-50 border border-blue-100">
            <div className="flex items-center text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Data shown for last 2 months only</span>
            </div>
          </Card>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border-l-4 border-blue-500">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Total OPEX</div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{totalOpex.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-green-500">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Month 1 Total</div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{month1Total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {month1OpexRatio.toFixed(2)}% of sales
                  </div>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-purple-500">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Month 2 Total</div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{month2Total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm flex items-center mt-1 ${
                    percentChange > 0 ? 'text-red-500' : percentChange < 0 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    <span>{Math.abs(percentChange).toFixed(2)}%</span>
                    <span className="ml-1">{percentChange > 0 ? '↑' : percentChange < 0 ? '↓' : ''}</span>
                    <span className="ml-1 text-gray-500">from M1</span>
                  </div>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-yellow-500">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">OPEX Efficiency</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {month2OpexRatio > 0 ? month2OpexRatio.toFixed(2) + '%' : 'N/A'}
                  </div>
                  <div className={`text-sm mt-1 ${
                    month2OpexRatio > month1OpexRatio ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {month1OpexRatio > 0 && month2OpexRatio > 0 ? 
                      (Math.abs(month2OpexRatio - month1OpexRatio).toFixed(2) + '% ' + 
                      (month2OpexRatio > month1OpexRatio ? '↑' : '↓')) : 
                      'No data'
                    }
                  </div>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Categories by Expense */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                      contentStyle={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #E0E0E0' }}
                    />
                    <Bar dataKey="value" name="Amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Sales vs OPEX Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Sales vs OPEX Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600">Month 2 OPEX to Sales</div>
                    <div className="text-2xl font-bold text-blue-600">{month2OpexRatio.toFixed(2)}%</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600">Month over Month Change</div>
                    <div className={`text-2xl font-bold ${month2OpexRatio > month1OpexRatio ? 'text-red-600' : 'text-green-600'}`}>
                      {(month2OpexRatio - month1OpexRatio).toFixed(2)}%
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sales', value: month2Sales - month2Total },
                        { name: 'OPEX', value: month2Total }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      <Cell fill="#4CAF50" />
                      <Cell fill="#F44336" />
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                      contentStyle={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #E0E0E0' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top 5 Expenses Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Top 5 Highest Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium">{expense.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-lg font-bold text-gray-800">
                          ₹{expense.netAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {expense.accHead}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(expense.netAmount / topExpenses[0].netAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Category Month-over-Month Comparison */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Category Month-over-Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryComparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                      contentStyle={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #E0E0E0' }}
                    />
                    <Legend />
                    <Bar dataKey="month1" name="Month 1" fill="#0088FE" />
                    <Bar dataKey="month2" name="Month 2" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Expense Table */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center">
            <CardTitle>Expense Details</CardTitle>
            <div className="mt-2 md:mt-0 flex">
              <input 
                type="text" 
                placeholder="Search expenses..." 
                className="px-3 py-2 border rounded-md w-full md:w-auto"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-right">Month 1</th>
                    <th className="px-4 py-2 text-right">Month 2</th>
                    <th className="px-4 py-2 text-right">Change %</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const month1 = parseFloat(item.M1Dr || 0) - parseFloat(item.m1Cr || 0);
                    const month2 = parseFloat(item.M2Dr || 0) - parseFloat(item.M2Cr || 0);
                    const change = month1 !== 0 ? ((month2 - month1) / Math.abs(month1)) * 100 : month2 > 0 ? 100 : 0;
                    const total = parseFloat(item.TotalDr || 0) - parseFloat(item.TotalCr || 0);
                    
                    return (
                      <tr key={item.code || index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b">{item.Name}</td>
                        <td className="px-4 py-3 border-b">{item.AccHead}</td>
                        <td className="px-4 py-3 text-right border-b">₹{month1.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-right border-b">₹{month2.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        <td className={`px-4 py-3 text-right border-b ${change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : ''}`}>
                          {change.toFixed(2)}% {change > 0 ? '↑' : change < 0 ? '↓' : ''}
                        </td>
                        <td className="px-4 py-3 text-right font-medium border-b">
                          ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-4 py-3 text-center border-t border-gray-300">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View All Expenses
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OpexAnalyticsDashboard;