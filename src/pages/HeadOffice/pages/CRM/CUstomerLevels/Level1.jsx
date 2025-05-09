import React, { useEffect, useState } from 'react';
import MainLayout from '../../../Layout/Layout';
import { getRequest } from '../../../../../services/apis/requests';
import { PieChart, BarChart, LineChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Bar, Pie, Cell, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, PieChart as PieChartIcon, BarChart as BarChartIcon, RefreshCw, ChevronDown, Filter, Download } from 'lucide-react';
import { label } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';
import TableLayout from '../../../../../components/Table/TableLayout';

const Level1Customer = () => {
  const [customerData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'table', 'charts'
  const [hoverCard, setHoverCard] = useState(null);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await getRequest(`crm/live-customer-list/?level=1`);
      if (response.data) {
        const sortedData = response.data.sort((a, b) => parseFloat(b.Last2MthSales) - parseFloat(a.Last2MthSales));

        const updatedData = response.data.map(data=>({
            ...data,rank: <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            {data.rank}
          </div>,
          }))
          setData(updatedData);      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Analytics calculations
  const totalSales = customerData?.reduce((sum, customer) => sum + parseFloat(customer?.Last2MthSales || 0), 0) || 0;
  const customerCount = customerData?.length || 0;
  const averageSales = customerCount ? totalSales / customerCount : 0;
  const maxContribution = customerData?.length ? Math.max(...customerData.map(customer => parseFloat(customer?.contribution || 0) * 100)) : 0;
  const topContributor = customerData?.length ? customerData.reduce((max, customer) => 
    parseFloat(customer.contribution) > parseFloat(max.contribution) ? customer : max, customerData[0]) : null;
  
  // Advanced analytics
  const salesDistribution = customerData?.length ? [
    { name: 'Top 20%', value: customerData.slice(0, Math.ceil(customerCount * 0.2)).reduce((sum, c) => sum + parseFloat(c.Last2MthSales || 0), 0) },
    { name: 'Middle 30%', value: customerData.slice(Math.ceil(customerCount * 0.2), Math.ceil(customerCount * 0.5)).reduce((sum, c) => sum + parseFloat(c.Last2MthSales || 0), 0) },
    { name: 'Bottom 50%', value: customerData.slice(Math.ceil(customerCount * 0.5)).reduce((sum, c) => sum + parseFloat(c.Last2MthSales || 0), 0) }
  ] : [];
  
  // Prepare contribution data for charts
  const contributionData = customerData?.slice(0, 10).map(customer => ({
    name: customer.Name.length > 15 ? customer.Name.substring(0, 15) + '...' : customer.Name,
    contribution: parseFloat(customer.contribution) * 100,
    sales: parseFloat(customer.Last2MthSales)
  }));
  
  // Prepare cumulative data
  const cumulativeData = customerData?.map((customer, index) => ({
    rank: customer.rank,
    cumulativeContribution: parseFloat(customer.cumulativeContribution)
  }));

  // Colors for charts
  const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444', '#06B6D4', '#F97316', '#8884d8'];
  
  // Gradient colors for cards
  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-green-400 to-cyan-500',
    'from-pink-500 to-rose-500',
    'from-amber-400 to-orange-500'
  ];

  

  const Navbar = () => (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Premium Customer Analytics</h1>
        <p className="text-gray-500">Top customers contributing to first 25% of total sales</p>
      </div>
      

    </div>
  );

  const ViewToggle = () => (
    <div className="flex bg-gray-100 p-1 rounded-lg mb-6 w-max">
      <button 
        onClick={() => setViewMode('dashboard')} 
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'dashboard' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
      >
        Dashboard
      </button>
      <button 
        onClick={() => setViewMode('table')} 
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
      >
        Table View
      </button>
     
    </div>
  );


  const MetricCard = ({ title, value, subtitle, icon, index, trend }) => (
    <div 
      className={`relative bg-white overflow-hidden rounded-xl shadow-sm transition-all duration-300 ${hoverCard === index ? 'scale-105' : ''}`}
      onMouseEnter={() => setHoverCard(index)}
      onMouseLeave={() => setHoverCard(null)}
    >
      <div className={`absolute inset-0  opacity-80`}></div>
      <div className="relative p-6 flex items-start">
        <div className="bg-white rounded-lg p-3 mr-4 shadow">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium  opacity-90">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold ">{value}</span>
          </div>
          <span className="text-xs  opacity-80">{subtitle}</span>
          
          {/* {trend && (
            <div className="mt-1 flex items-center text-xs">
              <span className={`font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="ml-1 ">vs prev period</span>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );

    const navigate = useNavigate()
    const headers = [
      {key:"rank",label:"Rank"},
  
      {key:"Name",label:"Customer",onColumnClick:(v,r)=>{navigate(`/crm/cut-details/${r.Code}`)}},
      {key:"Last2MthSales",label:"last 2 Month Sales"},
    
  
    ]

  const Dashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Customer Count" 
          value={customerCount} 
          subtitle="Level 1 customers" 
          icon={<Users size={24} className="text-indigo-600" />} 
          index={0}
          trend={{ positive: true, value: 2.4 }}
        />
        
        <MetricCard 
          title="Total Sales" 
          value={`₹${totalSales.toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
          subtitle="Last 2 months" 
          icon={<DollarSign size={24} className="text-green-600" />} 
          index={1}
          trend={{ positive: true, value: 8.1 }}
        />
        
        <MetricCard 
          title="Average Sales" 
          value={`₹${averageSales.toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
          subtitle="Per customer" 
          icon={<TrendingUp size={24} className="text-pink-600" />} 
          index={2}
          trend={{ positive: false, value: 1.3 }}
        />
        
        <MetricCard 
          title="Total Contribution" 
          value={`${customerData.length ? parseFloat(customerData[customerData.length - 1]?.cumulativeContribution || 0).toFixed(2) : 0}%`} 
          subtitle="Of overall revenue" 
          icon={<PieChartIcon size={24} className="text-amber-600" />} 
          index={3}
          trend={{ positive: true, value: 3.7 }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Contributor Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-gray-800">Top Contributor</h3>
            <span className="text-xs font-medium bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">LEADER</span>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <span className="text-2xl font-bold text-indigo-600">
                {topContributor?.Name?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">{topContributor?.Name || 'N/A'}</h4>
              <p className="text-sm text-gray-500">Customer Code: {topContributor?.Code || 'N/A'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs text-gray-500">Sales</span>
              <p className="text-lg font-bold text-gray-800">
                ₹{parseFloat(topContributor?.Last2MthSales || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs text-gray-500">Contribution</span>
              <p className="text-lg font-bold text-gray-800">
                {(parseFloat(topContributor?.contribution || 0) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* 80/20 Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">80/20 Analysis</h3>
          
          <div className="flex items-center justify-center h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[0] }}></div>
                <span className="text-sm text-gray-600">Top 20% Customers</span>
              </div>
              <span className="font-semibold">
                {customerData.length ? (100 * salesDistribution[0].value / totalSales).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[1] }}></div>
                <span className="text-sm text-gray-600">Middle 30% Customers</span>
              </div>
              <span className="font-semibold">
                {customerData.length ? (100 * salesDistribution[1].value / totalSales).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[2] }}></div>
                <span className="text-sm text-gray-600">Bottom 50% Customers</span>
              </div>
              <span className="font-semibold">
                {customerData.length ? (100 * salesDistribution[2].value / totalSales).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Contribution Range */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Contribution Analysis</h3>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData.filter((d, i) => i % 5 === 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="rank" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Cumulative']} />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeContribution" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs text-gray-500">Highest Contribution</span>
              <p className="text-lg font-bold text-gray-800">
                {customerData.length ? (parseFloat(customerData[0]?.contribution || 0) * 100).toFixed(2) : 0}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs text-gray-500">Lowest Contribution</span>
              <p className="text-lg font-bold text-gray-800">
                {customerData.length ? (parseFloat(customerData[customerData.length-1]?.contribution || 0) * 100).toFixed(2) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Contributors Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Top 10 Contributors</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Contribution']} />
              <Bar dataKey="contribution" radius={[4, 4, 0, 0]}>
                {contributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );


  
  const CustomerTable = () => (
    <TableLayout headers={headers} data={customerData}/>
  );

  const AnalyticsCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Contributors Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Top 10 Contributors</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Contribution']} />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                {contributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Sales Distribution Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Sales Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesDistribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {salesDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Sales']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Pareto/Cumulative Contribution Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 lg:col-span-2">
        <h3 className="font-semibold text-gray-800 mb-4">Cumulative Contribution Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="rank" label={{ value: 'Customer Rank', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Cumulative Contribution (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Cumulative Contribution']} />
              <Line 
                type="monotone" 
                dataKey="cumulativeContribution" 
                stroke="#6366F1" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute top-0 right-0 bottom-0 left-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute top-0 right-0 bottom-0 left-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-gray-700">Loading customer data...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest information</p>
            </div>
          </div>
        ) : (
          <>
            <Navbar />
            <ViewToggle />
            
            {viewMode === 'dashboard' && <Dashboard />}
            {viewMode === 'table' && <CustomerTable />}
            {viewMode === 'charts' && <AnalyticsCharts />}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Level1Customer;