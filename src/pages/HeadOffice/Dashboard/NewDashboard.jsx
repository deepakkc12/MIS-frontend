import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Search,
  Settings,
  Menu,
  Activity,
  Grid,
  DollarSign,
} from "lucide-react";
import MainLayout from "../Layout/Layout";
import { motion } from "framer-motion";

// Color palette - Futuristic theme
const COLORS = {
  primary: "#4F46E5", // Indigo
  secondary: "#10B981", // Emerald
  warning: "#F59E0B", // Amber
  danger: "#EF4444", // Red
  info: "#0EA5E9", // Sky Blue
  purple: "#8B5CF6", // Purple
  pink: "#EC4899", // Pink
  dark: "#1E293B", // Slate
  light: "#F8FAFC", // Slate light
  success: "#22C55E", // Green
  background: "#0F172A", // Dark slate
  cardBg: "#1E293B", // Slate
  accent: "#6366F1", // Indigo
  textPrimary: "#F1F5F9", // Slate 100
  textSecondary: "#94A3B8", // Slate 400
  border: "#334155", // Slate 700
  highlight: "#2563EB", // Blue 600
};

const PERIOD_OPTIONS = ["Daily", "Weekly", "Monthly", "Yearly"];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const NewDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("Monthly");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Data states
  const [salesData, setSalesData] = useState([]);
  const [zeroStockItems, setZeroStockItems] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [salesOpportunityData, setSalesOpportunityData] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesBreakdownByRegion, setSalesBreakdownByRegion] = useState([]);

  // Metrics state
  const [metrics, setMetrics] = useState({
    totalRevenue: 245000,
    previousRevenue: 218000,
    profitMargin: 28,
    previousProfitMargin: 25.7,
    totalSales: 1856,
    previousTotalSales: 1742,
    zeroStockCount: 7,
    salesOpportunityLoss: 87500,
    totalCustomers: 567,
    previousTotalCustomers: 512,
    averageOrderValue: 132,
    previousAverageOrderValue: 125,
  });

  const [salesLossData, setSalesLossData] = useState({
    byReason: [],
    byTimespan: [],
    activeItems: [],
    totalLoss: 0,
  });

  // Calculate percentage changes
  const getPercentageChange = (current, previous) => {
    if (!previous) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const revenueChange = getPercentageChange(
    metrics.totalRevenue,
    metrics.previousRevenue
  );
  const marginChange = getPercentageChange(
    metrics.profitMargin,
    metrics.previousProfitMargin
  );
  const salesChange = getPercentageChange(
    metrics.totalSales,
    metrics.previousTotalSales
  );
  const customerChange = getPercentageChange(
    metrics.totalCustomers,
    metrics.previousTotalCustomers
  );
  const aovChange = getPercentageChange(
    metrics.averageOrderValue,
    metrics.previousAverageOrderValue
  );

  // Mock data fetching
  useEffect(() => {
    setIsLoading(true);
    setDataLoaded(false);

    // Simulate API call
    setTimeout(() => {
      // Sales data
      const mockSalesData = [
        { month: "Jan", sales: 42000, target: 38000, lastYear: 32000 },
        { month: "Feb", sales: 38000, target: 38000, lastYear: 36000 },
        { month: "Mar", sales: 52000, target: 40000, lastYear: 45000 },
        { month: "Apr", sales: 48000, target: 42000, lastYear: 40000 },
        { month: "May", sales: 65000, target: 45000, lastYear: 52000 },
      ];
      setSalesData(mockSalesData);

      // Zero stock items
      const mockZeroStock = [
        {
          sku: "SKU001",
          name: "Premium Smartphone",
          category: "Electronics",
          potentialLoss: 32500,
          lastStocked: "2023-12-25",
          status: "Critical",
        },
        {
          sku: "SKU002",
          name: "Designer Handbag",
          category: "Apparel",
          potentialLoss: 17800,
          lastStocked: "2023-12-28",
          status: "Critical",
        },
        {
          sku: "SKU003",
          name: "Wireless Headphones",
          category: "Electronics",
          potentialLoss: 9200,
          lastStocked: "2024-01-05",
          status: "Warning",
        },
        {
          sku: "SKU004",
          name: "Smart Watch Series 5",
          category: "Electronics",
          potentialLoss: 15600,
          lastStocked: "2024-01-12",
          status: "Warning",
        },
        {
          sku: "SKU005",
          name: "Office Desk Chair",
          category: "Furniture",
          potentialLoss: 7800,
          lastStocked: "2024-01-15",
          status: "Warning",
        },
        {
          sku: "SKU006",
          name: "Outdoor Camping Tent",
          category: "Sports",
          potentialLoss: 4600,
          lastStocked: "2024-01-18",
          status: "Warning",
        },
        {
          sku: "SKU007",
          name: "Smart Home Hub",
          category: "Electronics",
          potentialLoss: 8900,
          lastStocked: "2024-01-22",
          status: "Warning",
        },
      ];
      setZeroStockItems(mockZeroStock);

      // Category data
      const mockCategoryData = [
        { name: "Electronics", value: 42, color: COLORS.primary },
        { name: "Apparel", value: 28, color: COLORS.secondary },
        { name: "Home", value: 15, color: COLORS.info },
        { name: "Sports", value: 10, color: COLORS.warning },
        { name: "Furniture", value: 5, color: COLORS.purple },
      ];
      setCategoryData(mockCategoryData);

      // Sales loss data
      const mockSalesLossData = {
        byReason: [
          { reason: "Stock Stockout", count: 15, loss: 45000, avgMargin: 28 },
          { reason: "Price Mismatch", count: 8, loss: 22000, avgMargin: 32 },
          {
            reason: "Seasonal Demand Miss",
            count: 12,
            loss: 33000,
            avgMargin: 25,
          },
          {
            reason: "Supply Chain Disruption",
            count: 7,
            loss: 19500,
            avgMargin: 24,
          },
          {
            reason: "Competitor Pricing",
            count: 5,
            loss: 12500,
            avgMargin: 30,
          },
        ],
        byTimespan: [
          { month: "Jan", loss: 15000, avgSalesPerDay: 500 },
          { month: "Feb", loss: 22000, avgSalesPerDay: 550 },
          { month: "Mar", loss: 18000, avgSalesPerDay: 600 },
          { month: "Apr", loss: 21000, avgSalesPerDay: 620 },
          { month: "May", loss: 11500, avgSalesPerDay: 580 },
        ],
        activeItems: [
          {
            skuCode: "SKU001",
            reason: "Stock Stockout",
            dateFrom: "2024-01-15",
            dateTo: "2024-01-30",
            avgMargin: 28,
            avgSalesPerDay: 450,
            potentialLoss: 15000,
          },
          {
            skuCode: "SKU002",
            reason: "Price Mismatch",
            dateFrom: "2024-01-20",
            dateTo: "2024-02-05",
            avgMargin: 32,
            avgSalesPerDay: 380,
            potentialLoss: 12000,
          },
          {
            skuCode: "SKU003",
            reason: "Seasonal Demand Miss",
            dateFrom: "2024-02-01",
            dateTo: "2024-02-15",
            avgMargin: 25,
            avgSalesPerDay: 550,
            potentialLoss: 8500,
          },
        ],
        totalLoss: 87500,
      };
      setSalesLossData(mockSalesLossData);

      // Recent alerts
      const mockRecentAlerts = [
        {
          icon: <AlertTriangle className="text-yellow-500" />,
          message: "Low stock alert for Premium Smartphone (SKU001)",
          time: "2h ago",
          severity: "warning",
        },
        {
          icon: <CheckCircle className="text-green-500" />,
          message: "Stock updated for Wireless Headphones (SKU003)",
          time: "1d ago",
          severity: "success",
        },
        {
          icon: <AlertTriangle className="text-red-500" />,
          message: "Critical inventory shortage for Smart Watch (SKU004)",
          time: "1d ago",
          severity: "critical",
        },
        {
          icon: <Activity className="text-blue-500" />,
          message: "Price revision pending for Designer Handbag (SKU002)",
          time: "4h ago",
          severity: "info",
        },
        {
          icon: <Grid className="text-purple-500" />,
          message: "New product approval requested: Gaming Console",
          time: "2d ago",
          severity: "info",
        },
      ];
      setRecentAlerts(mockRecentAlerts);

      // Top selling products
      const mockTopProducts = [
        {
          id: 1,
          name: "Premium Smartphone",
          category: "Electronics",
          sales: 78500,
          growth: 15.2,
        },
        {
          id: 2,
          name: "Wireless Headphones",
          category: "Electronics",
          sales: 45200,
          growth: 22.8,
        },
        {
          id: 3,
          name: "Designer Handbag",
          category: "Apparel",
          sales: 38700,
          growth: -2.5,
        },
        {
          id: 4,
          name: "Smart Watch Series 5",
          category: "Electronics",
          sales: 32100,
          growth: 18.7,
        },
        {
          id: 5,
          name: "Office Desk Chair",
          category: "Furniture",
          sales: 28400,
          growth: 5.3,
        },
      ];
      setTopProducts(mockTopProducts);

      // Sales breakdown by region
      const mockSalesBreakdown = [
        { region: "North", sales: 85000, previousSales: 75000, target: 90000 },
        { region: "South", sales: 65000, previousSales: 58000, target: 60000 },
        { region: "East", sales: 52000, previousSales: 48000, target: 55000 },
        { region: "West", sales: 43000, previousSales: 37000, target: 40000 },
      ];
      setSalesBreakdownByRegion(mockSalesBreakdown);

      setIsLoading(false);
      
      // Delay to simulate progressive loading
      setTimeout(() => {
        setDataLoaded(true);
      }, 300);
    }, 800);
  }, []);

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded shadow-lg backdrop-blur-sm bg-slate-800/90 border border-slate-700 text-white">
          <p className="font-bold text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.name}:{" "}
              {typeof entry.value === "number" ? (
                <>
                  ₹{entry.value.toLocaleString()}
                  {entry.name.toLowerCase().includes("margin") && "%"}
                </>
              ) : (
                entry.value
              )}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  
const ZeroStockModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Zero Stock Items</h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex justify-between mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              POTENTIAL REVENUE LOSS
            </h3>
            <p className="text-2xl font-bold text-red-600">
              $
              {zeroStockItems
                .reduce((sum, item) => sum + item.potentialLoss, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              CRITICAL ITEMS
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {
                zeroStockItems.filter((item) => item.status === "Critical")
                  .length
              }
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">TOTAL ITEMS</h3>
            <p className="text-2xl font-bold text-blue-600">
              {zeroStockItems.length}
            </p>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700 mr-2">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Last Stocked</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Potential Loss</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zeroStockItems.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.sku}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">
                    {new Date(item.lastStocked).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.status === "Critical"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-red-600 font-medium">
                    ${item.potentialLoss.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SalesOpportunityModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Sales Opportunity Loss Analysis
          </h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              TOTAL LOSS PROJECTION
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              ${salesLossData.totalLoss.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              ACTIVE ISSUES
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {salesLossData.activeItems.length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              AVG MARGIN IMPACT
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {Math.round(
                salesLossData.byReason.reduce(
                  (acc, item) => acc + item.avgMargin,
                  0
                ) / salesLossData.byReason.length
              )}
              %
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Loss Distribution by Reason
            </h3>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
              <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesLossData.byReason}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reason" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke={COLORS.primary}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={COLORS.secondary}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="loss"
                  fill={COLORS.primary}
                  name="Loss Amount ($)"
                />
                <Bar
                  yAxisId="right"
                  dataKey="avgMargin"
                  fill={COLORS.secondary}
                  name="Avg Margin (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Active Issues</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
              <Zap size={16} className="mr-2" />
              Generate Action Plan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Date Range</th>
                  <th className="p-3 text-right">Avg Sales/Day</th>
                  <th className="p-3 text-right">Margin</th>
                  <th className="p-3 text-right">Potential Loss</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesLossData.activeItems.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.skuCode}</td>
                    <td className="p-3">{item.reason}</td>
                    <td className="p-3">
                      {new Date(item.dateFrom).toLocaleDateString()} -{" "}
                      {new Date(item.dateTo).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">${item.avgSalesPerDay}</td>
                    <td className="p-3 text-right">{item.avgMargin}%</td>
                    <td className="p-3 text-right text-red-600 font-medium">
                      ${item.potentialLoss.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Loss Trend Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesLossData.byTimespan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke={COLORS.danger}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={COLORS.info}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="loss"
                  stroke={COLORS.danger}
                  strokeWidth={2}
                  name="Loss Amount ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgSalesPerDay"
                  stroke={COLORS.info}
                  strokeWidth={2}
                  name="Avg Sales/Day"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );


  // Reusable components
  const MetricCard = ({
    title,
    value,
    previousValue,
    change,
    icon: Icon,
    color,
    showPercent = false,
    delay = 0,
  }) => (
    <motion.div
      initial="hidden"
        animate={dataLoaded ? "visible" : "hidden"}
        variants={slideUp}
        transition={{ delay: delay * 0.1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl hover:border-indigo-900/50 transition-all duration-300"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-400 uppercase font-medium">{title}</p>
            <div className="flex items-baseline mt-2">
              <span className="text-2xl font-bold text-white">
                {showPercent ? `${value}%` : value.replace(/\$/g, "₹")}
              </span>
              {change && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay * 0.1 + 0.3 }}
                  className={`ml-2 text-sm flex items-center ${
                    Number(change) >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {Number(change) >= 0 ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {Math.abs(change)}%
                </motion.span>
              )}
            </div>
            {previousValue && (
              <p className="text-xs text-slate-500 mt-1">
                Previous: {showPercent ? `${previousValue}%` : previousValue.replace(/\$/g, "₹")}
              </p>
            )}
          </div>
          <div
            className="p-3 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} style={{ color }} className="animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  
    const ActionCard = ({
      title,
      value,
      secondaryText,
      icon: Icon,
      color,
      onClick,
      delay = 0,
    }) => (
      <motion.div
        initial="hidden"
        animate={dataLoaded ? "visible" : "hidden"}
        variants={slideUp}
        transition={{ delay: delay * 0.1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl hover:border-indigo-900/50 transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-400 uppercase font-medium">{title}</p>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-white">
                {typeof value === "string" ? value.replace(/\$/g, "₹") : value}
              </span>
              {secondaryText && (
                <span className="ml-2 text-sm text-red-400">
                  {secondaryText.replace(/\$/g, "₹")}
                </span>
              )}
            </div>
          </div>
          <div
            className="p-3 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} style={{ color }} className="animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 p-2 rounded-lg bg-slate-700/30 backdrop-blur-sm">
          <span className="text-sm font-medium text-slate-300">View Details</span>
          <ChevronRight size={16} className="text-indigo-400" />
        </div>
      </motion.div>
    );
  
    const ChartContainer = ({ title, children, className, delay = 0 }) => (
      <motion.div
        initial="hidden"
        animate={dataLoaded ? "visible" : "hidden"}
        variants={fadeIn}
        transition={{ delay: delay * 0.1 }}
        className={`bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 ${className}`}
      >
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-indigo-500 rounded-full"></span>
          {title}
        </h2>
        <div className="h-80">
          {children}
        </div>
      </motion.div>
    );
  
    const SalesGraph = () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Sales Performance (₹)" delay={0.3}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: COLORS.textSecondary }} 
                axisLine={{ stroke: COLORS.border }}
              />
              <YAxis 
                tick={{ fill: COLORS.textSecondary }} 
                axisLine={{ stroke: COLORS.border }} 
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: COLORS.textPrimary }}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorSales)"
                strokeWidth={2}
                activeDot={{ r: 8, strokeWidth: 0, fill: COLORS.primary }}
                name="Sales"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke={COLORS.secondary}
                fillOpacity={0.2}
                fill="url(#colorTarget)"
                strokeWidth={2}
                activeDot={{ r: 8, strokeWidth: 0, fill: COLORS.secondary }}
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
  
        <ChartContainer title="Sales by Category" delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(value) => [`${value}%`, "Percentage"]}
                />
              </PieChart>
            </ResponsiveContainer>
  
            <div className="flex flex-col justify-center">
              <h3 className="text-md font-semibold mb-3 text-white">Top Categories</h3>
              <div className="space-y-4">
                {categoryData.slice(0, 3).map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={dataLoaded ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-slate-300">{category.name}</span>
                    </div>
                    <span className="font-semibold text-white">{category.value}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
    );
  
    return (
      <MainLayout>
        <div className="min-h-screen bg-white text-white p-6">
          {/* Dashboard Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400">Neo</span>ERP
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              </h1>
              <p className="text-slate-400">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
  
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hover:border-indigo-700 transition-colors"
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                >
                  <Calendar size={16} className="text-indigo-400" />
                  <span className="text-slate-300">{dateRange}</span>
                  <ChevronDown size={16} className="text-indigo-400" />
                </button>
  
                {showPeriodDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-10"
                  >
                    {[
                      "Today",
                      "Last 7 Days",
                      "Last 30 Days",
                      "This Month",
                      "Last Quarter",
                      "Year to Date",
                    ].map((option) => (
                      <button
                        key={option}
                        className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-300"
                        onClick={() => {
                          setDateRange(option);
                          setShowPeriodDropdown(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
  
              <button className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-700 transition-colors">
                <RefreshCw size={18} className="text-indigo-400" />
              </button>
  
              <button className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-700 transition-colors">
                <Settings size={18} className="text-indigo-400" />
              </button>
  
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 transition-colors">
                <Download size={16} className="mr-2" />
                Export Report
              </button>
            </div>
          </motion.div>
  
          {/* Time Period Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center mb-6"
          >
            <div className="flex space-x-2">
              {PERIOD_OPTIONS.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
                    period === option
                      ? "bg-indigo-600 text-white border border-indigo-500"
                      : "bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-indigo-700"
                  } transition-all`}
                  onClick={() => setPeriod(option)}
                >
                  {option}
                </motion.button>
              ))}
            </div>
  
            <div className="text-gray-400 flex items-center">
              <Clock size={16} className="mr-2 text-indigo-400" />
              <span className="text-slate-400">Last updated: Today at 10:45 AM</span>
            </div>
          </motion.div>
  
          {/* Loading State */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center h-96"
            >
              <svg className="w-16 h-16 text-indigo-500 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
                </svg>
                <p className="mt-4 text-indigo-300 font-medium text-xl tracking-wider">
                  Loading dashboard data<span className="animate-pulse">...</span>
                </p>
                <div className="w-64 h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <MetricCard
                    title="Total Revenue"
                    value={`₹${metrics.totalRevenue.toLocaleString()}`}
                    previousValue={`₹${metrics.previousRevenue.toLocaleString()}`}
                    change={revenueChange}
                    icon={DollarSign}
                    color={COLORS.primary}
                    delay={0}
                  />
                  <MetricCard
                    title="Profit Margin"
                    value={metrics.profitMargin}
                    previousValue={metrics.previousProfitMargin}
                    change={marginChange}
                    icon={TrendingUp}
                    color={COLORS.secondary}
                    showPercent={true}
                    delay={1}
                  />
                  <MetricCard
                    title="Total Sales"
                    value={metrics.totalSales.toLocaleString()}
                    previousValue={metrics.previousTotalSales.toLocaleString()}
                    change={salesChange}
                    icon={Package}
                    color={COLORS.info}
                    delay={2}
                  />
                  <MetricCard
                    title="Customers"
                    value={metrics.totalCustomers.toLocaleString()}
                    previousValue={metrics.previousTotalCustomers.toLocaleString()}
                    change={customerChange}
                    icon={Users}
                    color={COLORS.purple}
                    delay={3}
                  />
                </div>
    
                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <ActionCard
                    title="Zero Stock Items"
                    value={metrics.zeroStockCount}
                    secondaryText={`-₹${zeroStockItems
                      .reduce((sum, item) => sum + item.potentialLoss, 0)
                      .toLocaleString()}`}
                    icon={AlertTriangle}
                    color={COLORS.danger}
                    onClick={() => setActiveModal("zeroStock")}
                    delay={4}
                  />
                  <ActionCard
                    title="Sales Opportunity Loss"
                    value={`₹${metrics.salesOpportunityLoss.toLocaleString()}`}
                    icon={TrendingDown}
                    color={COLORS.warning}
                    onClick={() => setActiveModal("salesOpportunity")}
                    delay={5}
                  />
                  <ActionCard
                    title="Avg. Order Value"
                    value={`₹${metrics.averageOrderValue}`}
                    secondaryText={`${aovChange}% vs last period`}
                    icon={Zap}
                    color={COLORS.info}
                    onClick={() => {}}
                    delay={6}
                  />
                </div>
    
                {/* Charts Row */}
                <SalesGraph />
    
                {/* Third Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <ChartContainer title="Regional Performance" className="col-span-2" delay={0.7}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesBreakdownByRegion}>
                        <defs>
                          <linearGradient id="barCurrent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLORS.primary} stopOpacity={1} />
                            <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="barPrevious" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLORS.info} stopOpacity={1} />
                            <stop offset="100%" stopColor={COLORS.info} stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="barTarget" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLORS.secondary} stopOpacity={1} />
                            <stop offset="100%" stopColor={COLORS.secondary} stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                          dataKey="region" 
                          tick={{ fill: COLORS.textSecondary }} 
                          axisLine={{ stroke: COLORS.border }} 
                        />
                        <YAxis 
                          tick={{ fill: COLORS.textSecondary }} 
                          axisLine={{ stroke: COLORS.border }} 
                          tickFormatter={(value) => `₹${value/1000}k`} 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          wrapperStyle={{ color: COLORS.textPrimary }}
                          formatter={(value) => <span className="text-slate-300">{value}</span>}
                        />
                        <Bar
                          dataKey="sales"
                          fill="url(#barCurrent)"
                          name="Current Sales"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                        <Bar
                          dataKey="previousSales"
                          fill="url(#barPrevious)"
                          name="Previous Period"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                        <Bar
                          dataKey="target"
                          fill="url(#barTarget)"
                          name="Target"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
    
                  {/* Recent Alerts */}
                  <motion.div
                    initial="hidden"
                    animate={dataLoaded ? "visible" : "hidden"}
                    variants={fadeIn}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="inline-block w-2 h-6 bg-red-500 rounded-full"></span>
                        Recent Alerts
                      </h2>
                      <span className="text-xs px-2 py-1 bg-indigo-900/60 text-indigo-300 rounded-full backdrop-blur-sm">
                        {recentAlerts.length} new
                      </span>
                    </div>
                    <motion.div
                      initial="hidden"
                      animate={dataLoaded ? "visible" : "hidden"}
                      variants={staggerChildren}
                      className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar"
                    >
                      {recentAlerts.map((alert, index) => (
                        <motion.div
                          key={index}
                          variants={slideUp}
                          className="flex items-start p-3 hover:bg-slate-800/50 rounded-md transition-colors backdrop-blur-sm border border-transparent hover:border-slate-700"
                        >
                          <div className="flex-shrink-0 mt-1">{alert.icon}</div>
                          <div className="ml-3">
                            <p className="text-sm text-slate-300">{alert.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    <button className="w-full mt-4 py-2 text-sm text-center text-indigo-400 hover:text-indigo-300 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                      View All Alerts
                    </button>
                  </motion.div>
                </div>
    
                {/* Fourth Row */}
                <motion.div
                  initial="hidden"
                  animate={dataLoaded ? "visible" : "hidden"}
                  variants={fadeIn}
                  transition={{ delay: 0.9 }}
                  className="grid grid-cols-1 gap-6"
                >
                  {/* Top Selling Products */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="inline-block w-2 h-6 bg-green-500 rounded-full"></span>
                        Top Selling Products
                      </h2>
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        View All
                      </button>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-800/50 text-slate-300">
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-right">Sales Amount</th>
                            <th className="p-3 text-right">Growth</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topProducts.map((product, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={dataLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                              transition={{ delay: 1 + index * 0.1 }}
                              className="border-t border-slate-700 hover:bg-slate-800/30 text-slate-300"
                            >
                              <td className="p-3">{index + 1}</td>
                              <td className="p-3 font-medium text-white">{product.name}</td>
                              <td className="p-3">{product.category}</td>
                              <td className="p-3 text-right">
                                ₹{product.sales.toLocaleString()}
                              </td>
                              <td className="p-3 text-right">
                                <span
                                  className={`flex items-center justify-end ${
                                    product.growth >= 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {product.growth >= 0 ? (
                                    <ArrowUpRight size={14} />
                                  ) : (
                                    <ArrowDownRight size={14} />
                                  )}
                                  {Math.abs(product.growth)}%
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-md text-sm transition-colors backdrop-blur-sm">
                                  Details
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
    
          {/* Add this to your CSS */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(30, 41, 59, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(99, 102, 241, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(99, 102, 241, 0.8);
            }
            @keyframes loading {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </MainLayout>
      );
    }
    
    export default NewDashboard;