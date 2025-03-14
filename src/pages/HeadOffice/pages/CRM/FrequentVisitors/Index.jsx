import React, { useEffect, useState } from 'react';
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import MainLayout from '../../../Layout/Layout';
import { useNavigate } from 'react-router-dom';

const FrequentCustomers = () => {
  // Sample data
  const initialData = [
    { "code": "614612811", "Name": "UNIT OF SREE GOKULAM HOTEL INDIA PVT LTD", "Phone": "7594933361", "ABV": 17074, "ABVMth": 95617, "NOB": 28, "OCT": "268388.0000", "NOV": "98578.9000", "DEC": "52038.2000", "JAN": "9431.0000", "FEB": "49650.0000", "AMOUNT": "478086.1000", "contributionPercentage": "3.439300", "rankOutOf100": "100.00" },
    { "code": "614611971", "Name": "MS GOLD NEW2024", "Phone": "8891858493", "ABV": 3478, "ABVMth": 73306, "NOB": 274, "OCT": "70711.2050", "NOV": "88720.7945", "DEC": "92310.6820", "JAN": "90438.0400", "FEB": "60836.1805", "AMOUNT": "403016.9020", "contributionPercentage": "2.899200", "rankOutOf100": "99.93" },
    { "code": "61432551", "Name": "GVHSS NADAKKAVU", "Phone": "", "ABV": 3003, "ABVMth": 34540, "NOB": 253, "OCT": "35995.9000", "NOV": "54210.4700", "DEC": "22179.0550", "JAN": "54152.8250", "FEB": "24219.5800", "AMOUNT": "190757.8300", "contributionPercentage": "1.372200", "rankOutOf100": "99.87" },
    { "code": "614911888", "Name": "KPM TRIPENTA HOTEL", "Phone": "8943478989", "ABV": 2348, "ABVMth": 46023, "NOB": 294, "OCT": "40407.0000", "NOV": "72524.3000", "DEC": "37565.9200", "JAN": "29271.1250", "FEB": "8580.0000", "AMOUNT": "188348.3450", "contributionPercentage": "1.354900", "rankOutOf100": "99.80" },
    { "code": "614911841", "Name": "RASHA BOWL", "Phone": "9500090648", "ABV": 932, "ABVMth": 13993, "NOB": 225, "OCT": "16319.5000", "NOV": "16736.1750", "DEC": "33346.0000", "JAN": "22207.3900", "FEB": "15272.5000", "AMOUNT": "103881.5650", "contributionPercentage": "0.747300", "rankOutOf100": "99.74" },
    { "code": "61433480", "Name": "VIMAL DAS DM", "Phone": "", "ABV": 428, "ABVMth": 13910, "NOB": 650, "OCT": "65686.8980", "NOV": "13460.1515", "DEC": "4502.3080", "JAN": "148.0000", "FEB": "714.5250", "AMOUNT": "84511.8825", "contributionPercentage": "0.607900", "rankOutOf100": "99.67" }
  ];

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'rankOutOf100', direction: 'desc' });
  const [activeTab, setActiveTab] = useState('overview');
  const [highlightedCustomer, setHighlightedCustomer] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];

  const headers = [
    {key: "Name", label: "Customer Name",onColoumnClick:()=>{}},
    {key: "OCT", label: "October"},
    {key: "NOV", label: "November"},
    {key: "DEC", label: "December"},
    {key: "JAN", label: "January"},
    {key: "FEB", label: "February"},
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getRequest(`crm/frequent-customers-list/`);
      if (response.success) {
        setData(response.data);
      } else {
        // Fallback to sample data if API fails
        setData(initialData);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setData(initialData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Sort function
  const sortBy = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      const aValue = isNaN(parseFloat(a[key])) ? a[key] : parseFloat(a[key]);
      const bValue = isNaN(parseFloat(b[key])) ? b[key] : parseFloat(b[key]);
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setData(sortedData);
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return "₹0";
    const numValue = parseFloat(value);
    return `₹${numValue.toLocaleString('en-IN')}`;
  };

  // Calculate total amount
  const totalAmount = data.reduce((sum, customer) => sum + parseFloat(customer.AMOUNT || 0), 0);
  
  // Calculate month-wise totals
  const monthlyTotals = {
    OCT: data.reduce((sum, customer) => sum + parseFloat(customer.OCT || 0), 0),
    NOV: data.reduce((sum, customer) => sum + parseFloat(customer.NOV || 0), 0),
    DEC: data.reduce((sum, customer) => sum + parseFloat(customer.DEC || 0), 0),
    JAN: data.reduce((sum, customer) => sum + parseFloat(customer.JAN || 0), 0),
    FEB: data.reduce((sum, customer) => sum + parseFloat(customer.FEB || 0), 0)
  };

  // Prepare data for charts
  const monthlyTrendsData = [
    { name: 'OCT', value: monthlyTotals.OCT },
    { name: 'NOV', value: monthlyTotals.NOV },
    { name: 'DEC', value: monthlyTotals.DEC },
    { name: 'JAN', value: monthlyTotals.JAN },
    { name: 'FEB', value: monthlyTotals.FEB }
  ];

  const customersChartData = data.slice(0, 5).map((customer) => ({
    name: customer.Name.length > 15 ? customer.Name.substring(0, 15) + '...' : customer.Name,
    value: parseFloat(customer.AMOUNT)
  }));

  const customerMonthlyData = data.slice(0, 3).map(customer => [
    { name: 'OCT', value: parseFloat(customer.OCT), customer: customer.Name },
    { name: 'NOV', value: parseFloat(customer.NOV), customer: customer.Name },
    { name: 'DEC', value: parseFloat(customer.DEC), customer: customer.Name },
    { name: 'JAN', value: parseFloat(customer.JAN), customer: customer.Name },
    { name: 'FEB', value: parseFloat(customer.FEB), customer: customer.Name }
  ]);
const navigate = useNavigate()
  return (
    <MainLayout>
    <div className="bg-gradient-to-br rounded-xl from-gray-50 to-blue-50 min-h-screen pb-8">
      {/* Header */}
      <div className="my-8 text-center">
      <h1 className="text-3xl font-bold ">Frequent Customer Analysis</h1>
      <p className=" mt-2">Frequent customers over the last 5 months (OCT - FEB)</p>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Total Customers</h2>
                <p className="text-2xl font-semibold text-gray-900">{data.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Avg. Monthly Revenue</h2>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount / 5)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
              <h2 className="text-sm font-medium text-gray-500">Top Customer</h2>
              <p className="text- font-semibold text-gray-900 truncate" title={data[0]?.Name}>
  {data[0]?.Name.length > 15 ? data[0]?.Name.slice(0, 15) + "..." : data[0]?.Name}
</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Revenue Trend */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendsData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Revenue Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers by Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customersChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customersChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-md rounded-xl mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'monthly' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly Analysis
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'insights' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('insights')}
              >
                Customer Insights
              </button>
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Performance Overview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => sortBy('Name')}
                      >
                        Customer Name
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => sortBy('ABV')}
                      >
                        ABV
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => sortBy('NOB')}
                      >
                        No. of Bills
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => sortBy('AMOUNT')}
                      >
                        Total Amount
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => sortBy('contributionPercentage')}
                      >
                        Contribution
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => sortBy('rankOutOf100')}
                      >
                        Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((customer, index) => (
                      <tr 
                        key={customer.code} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer transition-colors`}
                        onClick={() => setHighlightedCustomer(customer)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                              {customer.Name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.Name}</div>
                              <div className="text-sm text-gray-500">{customer.Phone || 'No Phone'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.ABV.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.NOB}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(customer.AMOUNT)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{parseFloat(customer.contributionPercentage).toFixed(2)}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(parseFloat(customer.contributionPercentage) * 5, 100)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {parseFloat(customer.rankOutOf100).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'monthly' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Comparison</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top 3 Customer Monthly Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          type="category" 
                          allowDuplicatedCategory={false} 
                          categories={['OCT', 'NOV', 'DEC', 'JAN', 'FEB']}
                        />
                        <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                        <Legend />
                        {customerMonthlyData.map((customerData, index) => (
                          <Line 
                            key={index}
                            data={customerData}
                            type="monotone"
                            dataKey="value"
                            name={customerData[0].customer.substring(0, 15) + (customerData[0].customer.length > 15 ? '...' : '')}
                            stroke={COLORS[index % COLORS.length]}
                            activeDot={{ r: 8 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Data</h3>
                <TableLayout 
                enableRowClick
                onRowClick={(row)=>{navigate(`/crm/cut-details/${row.code}`)}}
                  headers={headers} 
                  data={data.map(item => ({
                    code:item.code,
                    Name: item.Name,
                    OCT: formatCurrency(item.OCT),
                    NOV: formatCurrency(item.NOV),
                    DEC: formatCurrency(item.DEC),
                    JAN: formatCurrency(item.JAN),
                    FEB: formatCurrency(item.FEB),
                  }))}
                  title='Monthly Revenue Analysis'
                />
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-4">Top 5 Contributors</h4>
                  <ul className="space-y-4">
                    {data.slice(0, 5).map((customer, index) => (
                      <li key={customer.code} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{customer.Name}</span>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(customer.AMOUNT)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-4">Monthly Performance Leaders</h4>
                  <div className="space-y-4">
                    {['OCT', 'NOV', 'DEC', 'JAN', 'FEB'].map(month => {
                      const topCustomer = [...data].sort((a, b) => parseFloat(b[month]) - parseFloat(a[month]))[0];
                      return (
                        <div key={month} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-500">{month}:</span>
                            <span className="text-sm ml-2">{topCustomer?.Name}</span>
                          </div>
                          <span className="text-sm font-semibold">{formatCurrency(topCustomer?.[month])}</span>
                        </div>
                      );})}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-4">Customer Spending Insights</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Average Bill Size</h5>
                        <div className="flex items-end">
                          <span className="text-2xl font-bold text-gray-900 mr-2">
                            {formatCurrency(totalAmount / data.reduce((sum, customer) => sum + customer.NOB, 0))}
                          </span>
                          <span className="text-sm text-gray-500">per bill</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Top Month</h5>
                        <div className="flex items-end">
                          <span className="text-2xl font-bold text-gray-900 mr-2">
                            {Object.keys(monthlyTotals).reduce((a, b) => monthlyTotals[a] > monthlyTotals[b] ? a : b)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatCurrency(Math.max(...Object.values(monthlyTotals)))}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Top Customer Contribution</h5>
                        <div className="flex items-end">
                          <span className="text-2xl font-bold text-gray-900 mr-2">
                            {data[0] ? parseFloat(data[0].contributionPercentage).toFixed(1) + '%' : '0%'}
                          </span>
                          <span className="text-sm text-gray-500">of total revenue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
    
            {/* Highlighted Customer Detail */}
            {highlightedCustomer && (
              <div className="bg-white shadow-md rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Customer Details: {highlightedCustomer.Name}</h3>
                  <button 
                    onClick={() => setHighlightedCustomer(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Customer Code</h5>
                        <p className="text-sm font-medium">{highlightedCustomer.code}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Phone</h5>
                        <p className="text-sm font-medium">{highlightedCustomer.Phone || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Total Revenue</h5>
                        <p className="text-sm font-medium">{formatCurrency(highlightedCustomer.AMOUNT)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Total Bills</h5>
                        <p className="text-sm font-medium">{highlightedCustomer.NOB}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Avg. Bill Value</h5>
                        <p className="text-sm font-medium">{formatCurrency(highlightedCustomer.ABV)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Rank</h5>
                        <p className="text-sm font-medium">{parseFloat(highlightedCustomer.rankOutOf100).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Revenue</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'OCT', value: parseFloat(highlightedCustomer.OCT) },
                            { name: 'NOV', value: parseFloat(highlightedCustomer.NOV) },
                            { name: 'DEC', value: parseFloat(highlightedCustomer.DEC) },
                            { name: 'JAN', value: parseFloat(highlightedCustomer.JAN) },
                            { name: 'FEB', value: parseFloat(highlightedCustomer.FEB) }
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </MainLayout>
      );
    };
    
    export default FrequentCustomers;