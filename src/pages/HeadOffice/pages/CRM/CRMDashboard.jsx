import React, { useEffect, useState } from "react";
import {
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar
} from "recharts";
import {
  Users, TrendingUp, AlertTriangle, Award, Clock, Star, UserX,
  Activity, DollarSign, Store, UserCheck, Loader2, Building2,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChartIcon, RefreshCcw,
  ArrowRight, Calendar, Filter, ChevronDown, Settings, Search
} from "lucide-react";
import MainLayout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../../../../services/apis/requests";
import { useToast } from "../../../../hooks/UseToast";
import CRMDashboardSkeleton from "./MainLoadingSkeleton";
import CustomerLevelPieChart from "./components/RankingPichart";

const CRMDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    customerGrowth: 0,
    avgBillValue: 156.78,
    revenueGrowth: 8.2,
    avgStoreVisits: 3.2,
    visitsGrowth: -2.1,
    priorityCustomers: 9178,
    priorityGrowth: 5.4,
    nonPerformingCustomers: 3245,
    inactiveCustomers: 2178,
    frequentVisitors: 12456,
    platinumCustomers: 2456,
    goldCustomers: 8234,
    silverCustomers: 15678,
    bronzeCustomers: 19524,
    revenue: 7850000,
    revenueChange: 8.2,
    customerLifetime: 24.7,
    lifetimeChange: 2.3
  });

  const toast = useToast();

  const getCRMMetricses = async () => {
    try {
      const response = await getRequest(`crm/metrics/?timeRange=${timeRange}`);
      if (response.success) {
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          totalCustomers: response.data.totalCustomers,
          avgBillValue: response.data.avgABV,
          avgATV: response.data.avgATV,
          customerGrowth: response.data.customerTrend,
        }));
      } else {
        console.error("Failed to fetch CRM metrics");
        toast.error("Failed to load metrics data");
      }
    } catch (error) {
      console.error("Error fetching CRM metrics:", error);
      toast.error("Failed to connect to server");
    }
  };
  
  const getCRMSegmentMetrics = async () => {
    try {
      const response = await getRequest(`crm/segment-metrics/?timeRange=${timeRange}`);
      if (response.success) {
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          priorityCustomers: response.data.priorityCustomers,
          frequentVisitors: response.data.frequentVisitors,
          nonPerformingCustomers: response.data.npcCustomers,
          inactiveCustomers: response.data.inactiveCustomers,
        }));
      } else {
        console.error("Failed to fetch CRM segment metrics");
        toast.error("Failed to load segment data");
      }
    } catch (error) {
      console.error("Error fetching CRM segment metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCvd = async ()=>{
    const response = await getRequest( `crm/cvd/`)

    if(response.success){
      setCustomerValue(response.data)
    }
  }

  const getCUstomerSalesTrend = async ()=>{
    const response = await getRequest(`crm/sales-trend/`)
    if(response.success){
      setCustomerTrendData(response.data)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getCRMMetricses(), 
          getCRMSegmentMetrics(), 
          getCvd(), 
          getCUstomerSalesTrend()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  const TIER_COLORS = {
    platinum: "#94A3B8", // Platinum with slight blue tone
    gold: "#FBBF24",     // Richer gold
    silver: "#9CA3AF",   // Silver
    bronze: "#B87333",   // Bronze
  };

  const [customerTrendData,setCustomerTrendData] = useState([]);

  const segmentTrendData = [
    { month: "Jan", priority: 8754, frequent: 12000, nonPerforming: 2890, inactive: 1980 },
    { month: "Feb", priority: 8900, frequent: 12145, nonPerforming: 3050, inactive: 2020 },
    { month: "Mar", priority: 9025, frequent: 12300, nonPerforming: 3150, inactive: 2100 },
    { month: "Apr", priority: 9178, frequent: 12456, nonPerforming: 3245, inactive: 2178 },
  ];
  
  const [customerValue,setCustomerValue] = useState([  ]);

  // Main metric cards with enhanced visualization
  const MetricCard = ({ title, value, prefix, suffix, icon: Icon, growth, animate = true, delay = 0 }) => (
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden relative transition-all duration-300 hover:shadow-lg"
      style={{
        animation: isLoading || !animate ? 'none' : `fadeInUp 0.5s ease-out ${delay}s forwards`,
        opacity: isLoading && animate ? 0 : 1,
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-50 opacity-20 -mr-8 -mt-8"></div>
      
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-blue-600 rounded-lg shadow-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>
        
        <div className="flex items-baseline space-x-1 mb-3">
          {prefix && <span className="text-xl font-semibold text-gray-700">{prefix}</span>}
          <span className="text-3xl font-bold text-gray-900">
            {typeof value === "number"
              ? value.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              : value}
          </span>
          {suffix && <span className="text-sm text-gray-500 ml-1">{suffix}</span>}
        </div>
        
        {growth !== undefined && (
          <div className="flex items-center">
            {growth >= 0 ? (
              <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium ml-1 text-green-600">
                  +{Math.abs(growth)}%
                </span>
              </div>
            ) : (
              <div className="flex items-center px-2 py-1 bg-red-50 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium ml-1 text-red-600">
                  -{Math.abs(growth)}%
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );

  // Modern segments card with gradient border
  const CustomerSegmentCard = ({ title, value, icon: Icon, color, description, percentage, delay = 0, onDetailClick = () => {} }) => {
    // Get the background color class
    const bgColor = `bg-${color.split('-')[1]}-50`;
    const textColor = `text-${color.split('-')[1]}-600`;
    const borderColor = `border-${color.split('-')[1]}-500`;
    
    return (
      <div 
        className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 ${borderColor}`}
        style={{
          animation: isLoading ? 'none' : `fadeInRight 0.6s ease-out ${delay}s forwards`,
          opacity: isLoading ? 0 : 1,
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-lg ${color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{title}</p>
                <span className="text-2xl font-bold text-gray-900">
                  {value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${color}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{percentage}% of total</span>
            <button
              onClick={onDetailClick}
              className={`inline-flex items-center text-sm ${textColor} hover:opacity-80 transition-opacity duration-200 group`}
            >
              Details
              <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get color class
  const getColorClass = (colorClass) => {
    const colorMap = {
      'bg-yellow-500': '#FBBF24',
      'bg-green-500': '#22C55E',
      'bg-orange-500': '#F97316',
      'bg-red-500': '#EF4444',
      'bg-blue-500': '#3B82F6',
      'bg-indigo-500': '#6366F1',
      'bg-purple-500': '#A855F7'
    };
    return colorMap[colorClass] || '#3B82F6';
  };

  // Elegant tier card with 3D effect
  const TierCard = ({ tier, count, color, totalCustomers, delay = 0 }) => {
    const percentage = ((count / metrics.totalCustomers) * 100).toFixed(1);
    const bgColor = tier.toLowerCase() === 'platinum' ? 'bg-gradient-to-br from-gray-400 to-gray-700' : 
                    tier.toLowerCase() === 'gold' ? 'bg-gradient-to-br from-yellow-300 to-yellow-600' :
                    tier.toLowerCase() === 'silver' ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    'bg-gradient-to-br from-amber-700 to-amber-900';

    return (
      <div
        className={`${bgColor} rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
        style={{
          animation: isLoading ? 'none' : `fadeInUp 0.7s ease-out ${delay}s forwards`,
          opacity: isLoading ? 0 : 1,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white bg-opacity-20">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold capitalize text-white">
              {tier}
            </h3>
          </div>
          <span className="text-3xl font-extrabold text-white">
            {count.toLocaleString()}
          </span>
        </div>

        <div className="w-full bg-black bg-opacity-30 rounded-full h-2.5 mb-4 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-500 bg-white"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-200">{percentage}% of total</span>
          <button className="flex items-center text-sm font-medium text-white hover:text-gray-200 transition group">
            View Details
            <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    );
  };

  const navigate = useNavigate();
  if (isLoading)  return <CRMDashboardSkeleton/>
         
        

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b rounded-xl from-gray-50 to-gray-100 pb-10">
        
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header with title, search, time filter and refresh */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Management Dashboard</h1>
              <p className="text-gray-500 mt-1">Real-time insights into your customer base</p>
            </div>
            
            {/* <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search customers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-44 bg-white"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="relative inline-block">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      getCRMMetricses();
                      getCRMSegmentMetrics();
                      setIsLoading(false);
                    }, 1000);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div> */}
            {/* </div> */}
          </div>

          {/* Top metrics section with KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Total Customers"
              value={metrics.totalCustomers}
              icon={Users}
              growth={metrics.customerGrowth}
              delay={0.1}
            />
            <MetricCard
              title="Monthly Revenue"
              value={metrics.revenue }
              prefix="₹"
              // suffix="L"
              icon={DollarSign}
              growth={metrics.revenueChange}
              delay={0.2}
            />
            <MetricCard
              title="Average Bill Value"
              value={metrics.avgBillValue}
              prefix="₹"
              icon={Store}
              growth={metrics.revenueGrowth}
              delay={0.3}
            />
            {/* <MetricCard
              title="Customer Lifetime"
              value={metrics.customerLifetime}
              suffix="months"
              icon={Clock}
              growth={metrics.lifetimeChange}
              delay={0.4}
            /> */}
          </div>

          {/* Main dashboard content with flexible layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left column - Customer segments and trends */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer segments */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Customer Segments
                  </h2>
                  {/* <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View All Segments
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button> */}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <CustomerSegmentCard
                    onDetailClick={() => navigate("/crm/priority-customers")}
                    title="Priority Customers"
                    value={metrics.priorityCustomers}
                    icon={Star}
                    color="bg-yellow-500"
                    percentage={((metrics.priorityCustomers / metrics.totalCustomers) * 100).toFixed(1)}
                    delay={0.1}
                  />
                  <CustomerSegmentCard
                    title="Frequent Visitors"
                    value={metrics.frequentVisitors}
                    icon={Activity}
                    onDetailClick={()=>{navigate("/crm/frequent-customers")}}
                    color="bg-green-500"
                    percentage={((metrics.frequentVisitors / metrics.totalCustomers) * 100).toFixed(1)}
                    delay={0.2}
                  />
                  <CustomerSegmentCard
                    title="Non-Performing"
                    onDetailClick={() => {navigate('/crm/non-pc')}}
                    value={metrics.nonPerformingCustomers}
                    icon={AlertTriangle}
                    color="bg-orange-500"
                    percentage={((metrics.nonPerformingCustomers / metrics.totalCustomers) * 100).toFixed(1)}
                    delay={0.3}
                  />
                  <CustomerSegmentCard
                    title="Inactive Customers"
                    value={metrics.inactiveCustomers}
                    icon={UserX}
                    color="bg-red-500"
                    percentage={((metrics.inactiveCustomers / metrics.totalCustomers) * 100).toFixed(1)}
                    delay={0.4}
                  />
                </div>
              </div>
              
              {/* Customer & Revenue Trend Chart */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 flex gap-3 items-center  text-blue-600" />
                    Business Performance <span className="text-xs ml-3 font-light">last 12 months</span>
                  </h2>
                  {/* <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full">Customers</button>
                    <button className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full">Revenue</button>
                  </div> */}
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customerTrendData}>
                      <defs>
                        <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#6b7280" />
                      <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="customers"
                        name="Total Customers"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", r: 6 }}
                        activeDot={{ r: 8, strokeWidth: 2 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue (₹)"
                        stroke="#22C55E"
                        strokeWidth={3}
                        dot={{ fill: "#22C55E", r: 6 }}
                        activeDot={{ r: 8, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Right column - Tiers and distribution */}
            <div className="space-y-6">
              {/* Customer distribution by value */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className=" mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Value Distribution

                </h2>
                  <span className="text-xs mx-auto">Based on last 30 days</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerValue} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category" />
                      <YAxis tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value} />
                      <Tooltip
                        formatter={(value) => [Number(value).toLocaleString(), "Customers"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar 
                        dataKey="customers" 
                        name="Customers" 
                        radius={[4, 4, 0, 0]}
                        fill="#3b82f6" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Customer tier distribution */}
              {/* <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Tier Distribution
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Platinum", value: metrics.platinumCustomers },
                          { name: "Gold", value: metrics.goldCustomers },
                          { name: "Silver", value: metrics.silverCustomers },
                          { name: "Bronze", value: metrics.bronzeCustomers },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          TIER_COLORS.platinum,
                          TIER_COLORS.gold,
                          TIER_COLORS.silver,
                          TIER_COLORS.bronze
                        ].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [Number(value).toLocaleString(), "Customers"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div> */}
              <CustomerLevelPieChart/>
            </div>
          </div>
          
          {/* Bottom section - Customer tiers cards */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 mb-8" 
               style={{
                 animation: isLoading ? 'none' : 'fadeIn 0.8s ease-out forwards',
                 opacity: isLoading ? 0 : 1,
               }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-400" />
                Customer Loyalty Tiers
              </h2>
              {/* <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
                View Tier Management
                <ArrowRight className="h-4 w-4 ml-1" />
              </button> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TierCard
                tier="Platinum"
                count={metrics.platinumCustomers}
                color={TIER_COLORS.platinum}
                totalCustomers={metrics.totalCustomers}
                delay={0.1}
              />
              <TierCard
                tier="Gold"
                count={metrics.goldCustomers}
                color={TIER_COLORS.gold}
                totalCustomers={metrics.totalCustomers}
                delay={0.2}
              />
              <TierCard
                tier="Silver"
                count={metrics.silverCustomers}
                color={TIER_COLORS.silver}
                totalCustomers={metrics.totalCustomers}delay={0.3}
                />
                <TierCard
                  tier="Bronze"
                  count={metrics.bronzeCustomers}
                  color={TIER_COLORS.bronze}
                  totalCustomers={metrics.totalCustomers}
                  delay={0.4}
                />
              </div>
            </div>
            
            {/* Segment performance trends section */}
            {/* <div className="bg-white rounded-2xl shadow-md p-6 mb-8" 
                 style={{
                   animation: isLoading ? 'none' : 'fadeIn 0.8s ease-out forwards',
                   opacity: isLoading ? 0 : 1,
                 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Segment Performance Trends
                </h2>
                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full">
                    <Filter className="h-3 w-3 mr-1" />
                    Filter
                  </button>
                  <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </button>
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={segmentTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend iconType="circle" />
                    <Line
                      type="monotone"
                      dataKey="priority"
                      name="Priority Customers"
                      stroke="#FBBF24"
                      strokeWidth={3}
                      dot={{ fill: "#FBBF24", r: 5 }}
                      activeDot={{ r: 7, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="frequent"
                      name="Frequent Visitors"
                      stroke="#22C55E"
                      strokeWidth={3}
                      dot={{ fill: "#22C55E", r: 5 }}
                      activeDot={{ r: 7, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="nonPerforming"
                      name="Non-Performing"
                      stroke="#F97316"
                      strokeWidth={3}
                      dot={{ fill: "#F97316", r: 5 }}
                      activeDot={{ r: 7, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="inactive"
                      name="Inactive"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: "#EF4444", r: 5 }}
                      activeDot={{ r: 7, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div> */}
            
            {/* Footer section with actions */}
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Last updated:</span> {new Date().toLocaleString()}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/crm/export-data')}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Export Report
                </button>
                <button 
                  onClick={() => navigate('/crm/customer-segments')}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Manage Segments
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </MainLayout>
    );
  };
  
  export default CRMDashboard;