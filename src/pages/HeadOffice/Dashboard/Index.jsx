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
  DollarSign,
  Bell,
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
} from "lucide-react";
import MainLayout from "../Layout/Layout";
import SalesGraph from "./components/SalesGraphs";
import SalesComparisonChart from "../../DshBd";
import { ActionCard, MetricCard } from "./components/Cards";
import { getTotalSalesSummeryDetails } from "../../../services/apis/Reports/reports";
import SkeletonLoader from "./SkeletonLoader";
import SalesOverView from "./components/SalesOverView";

// Color palette
const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#6366F1",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#4F46E5",
};

const PERIOD_OPTIONS = ["Daily", "Weekly", "Monthly", "Yearly"];

const Dashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("Monthly");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    totalRevenue: 0,
    previousRevenue: 0,
    profitMargin: 0,
    previousProfitMargin: 0,
    totalSales: 0,
    previousTotalSales: 0,
    zeroStockCount: 7,
    salesOpportunityLoss: 87500,
    totalCustomers: 0,
    previousTotalCustomers: 0,
    averageOrderValue: 0,
    previousAverageOrderValue: 0,
  });

  const [salesLossData, setSalesLossData] = useState({
    byReason: [],
    byTimespan: [],
    activeItems: [],
    totalLoss: 0,
  });

  const getmatricsData = async () => {
    const result = await getTotalSalesSummeryDetails();
    console.log(result);
    setMetrics({
      ...metrics,
      totalRevenue: result.TotalRevenue,
      totalSales: result.Nob,
      totalCustomers: result.TotalCustomers,
    });
  };

  useEffect(() => {
    getmatricsData();
  }, []);

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
          icon: <Bell className="text-blue-500" />,
          message: "Price revision pending for Designer Handbag (SKU002)",
          time: "4h ago",
          severity: "info",
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
          icon: <Bell className="text-purple-500" />,
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
    }, 800);
  }, []);

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
              {entry.name.toLowerCase().includes("margin") && "%"}
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
              ₹
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
                    ₹{item.potentialLoss.toLocaleString()}
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
              ₹{salesLossData.totalLoss.toLocaleString()}
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
                  name="Loss Amount (₹)"
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
                    <td className="p-3 text-right">₹{item.avgSalesPerDay}</td>
                    <td className="p-3 text-right">{item.avgMargin}%</td>
                    <td className="p-3 text-right text-red-600 font-medium">
                      ₹{item.potentialLoss.toLocaleString()}
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
                  name="Loss Amount (₹)"
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

  // Modal components
  // Reusable components
  return (
    <MainLayout>
      <div className="min-h-screen rounded-xl bg-gray-50 p-6">
        {activeModal === "zeroStock" && <ZeroStockModal />}
        {activeModal === "salesOpportunity" && <SalesOpportunityModal />}

        {/* Dashboard Header */}
        <div className="flex justify-between  items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold  text-gray-800">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader/>
        ) : (
          <>
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <MetricCard
                title="Total Revenue"
                value={`₹${metrics.totalRevenue.toLocaleString()}`}
                // previousValue={`₹${metrics.previousRevenue.toLocaleString()}`}
                change={(
                  ((metrics.totalRevenue - metrics.previousRevenue) /
                    metrics.previousRevenue) *
                  100
                ).toFixed(1)}
                  icon={props => <div {...props}>₹</div>}
                // icon={DollarSign}
                color={COLORS.primary}
                index={0}
              />
              <MetricCard
                title="Profit Margin"
                value={metrics.profitMargin}
                // previousValue={metrics.previousProfitMargin}
                change={marginChange}
                icon={TrendingUp}
                color={COLORS.secondary}
                showPercent={true}
                index={1}
              />
              <MetricCard
                title="Total Sales"
                value={metrics.totalSales.toLocaleString()}
                // previousValue={metrics.previousTotalSales.toLocaleString()}
                change={salesChange}
                icon={Package}
                color={COLORS.info}
                index={2}
              />
              <MetricCard
                title="Customers"
                value={metrics.totalCustomers.toLocaleString()}
                // previousValue={metrics.previousTotalCustomers.toLocaleString()}
                change={customerChange}
                icon={Users}
                color={COLORS.purple}
                index={3}
              />
            </div>

            {/* Action Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <ActionCard
                title="Zero Stock Items"
                value={metrics.zeroStockCount}
                secondaryText={`-₹${zeroStockItems
                  .reduce((sum, item) => sum + item.potentialLoss, 0)
                  .toLocaleString()}`}
                icon={AlertTriangle}
                color={COLORS.danger}
                onClick={() => setActiveModal("zeroStock")}
                index={0}
              />
              <ActionCard
                title="Sales Opportunity Loss"
                value={`₹${metrics.salesOpportunityLoss.toLocaleString()}`}
                icon={TrendingDown}
                color={COLORS.warning}
                onClick={() => setActiveModal("salesOpportunity")}
                index={1}
              />
              <ActionCard
                title="Avg. Order Value"
                value={`₹${metrics.averageOrderValue}`}
                secondaryText={`${aovChange}% vs last period`}
                icon={Zap}
                color={COLORS.info}
                onClick={() => {}}
                index={2}
              />
            </div> */}
            {/* Charts Row */}
            <SalesOverView />
            {/* Third Row */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Alerts</h2>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {recentAlerts.length} new
                  </span>
                </div>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {recentAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex-shrink-0 mt-1">{alert.icon}</div>
                      <div className="ml-3">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-center text-blue-600 hover:text-blue-800">
                  View All Alerts
                </button>
              </div>
            </div> */}

          </>
        )}
      </div>
    </MainLayout>
  );
};

// Add keyframes for animations
const styles = document.createElement("style");
styles.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fadeIn {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-pulse {
    animation-name: pulse;
    animation-duration: 2s;
  }
`;
document.head.appendChild(styles);
export default Dashboard;
