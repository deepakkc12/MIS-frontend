import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  AlertCircle,
  Activity,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import MainLayout from "../../../Layout/Layout";
import { useLocation } from "react-router-dom";
import { getRequest } from "../../../../../services/apis/requests";
import SKUAnalyticsSkeletonLoader from "./LoadingSkeleton";

const SKUAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sku = queryParams.get("sku");

  const [loading,setLoading] = useState(false)

  const getDetails = async (sku) => {
    setLoading(true)
    const response = await getRequest(`inventory/sku-details/?sku=${sku}`);
    if (response.success) {
      setSkuData(response.data);
      setSubSkuList(response.data.subSkuList);
    }
    setLoading(false)
  };

  useEffect(() => {
    if(sku){

        getDetails(sku);
    }else{

    }
  }, []);

  // Sample data from the provided JSON
  const [subSkuList, setSubSkuList] = useState([]);

  const [skuData, setSkuData] = useState({});
  // Example data for price validations (would be used if provided in the actual data)
  const samplePurchasePriceValidation = {
    code: "6043136106",
    PTC: "41130334",
    PurchaseDate: "30-Jan-25",
    SkuName: "Milky Mist Probiotic Curd 1kg",
    GroupName: "Curd",
    Vendor: "Npn Marketing",
    QTY: "3.0000",
    Rate: "104.9700",
    InwardRate: "110.2185",
    previous_rate: "103.1700",
    Per: "19.86000000000000000",
    previous_dot: "23-Jan-25",
    inwardAge: 7,
    previous_Vendor: "Npn Marketing",
    dot: "2025-01-30T00:00:00",
  };

  // Example data for sales price validations (would be used if provided in the actual data)
  const sampleSalesPriceValidation = {
    code: "6049170982",
    PTC: "160171382",
    SkuName: "Tnpl A4 80gsm",
    ismop: 0,
    dot: "2025-02-18T00:00:00",
    MRP: "306.0000",
    SP1: "280.0000",
    previous_mrp: "306.0000",
    previous_SP1: "306.0000",
    previous_dot: "2025-02-17T00:00:00",
    per: "9.29000000000000000",
    GapDays: 1,
    GroupName: "A4 Paper",
  };

  // Prepare data for charts
  const stockTrendData = [
    { name: "D7", value: parseFloat(skuData.weakStockDetails?.D7) },
    { name: "D6", value: parseFloat(skuData.weakStockDetails?.D6) },
    { name: "D5", value: parseFloat(skuData.weakStockDetails?.D5) },
    { name: "D4", value: parseFloat(skuData.weakStockDetails?.D4) },
    { name: "D3", value: parseFloat(skuData.weakStockDetails?.D3) },
    { name: "D2", value: parseFloat(skuData.weakStockDetails?.D2) },
    { name: "D1", value: parseFloat(skuData.weakStockDetails?.D1) },
  ];

  const customerSegmentData = [
    {
      name: "L1 Customers",
      value: parseInt(skuData.info?.L1Choice),
      qty: parseFloat(skuData.info?.L1ChoiceQty),
    },
    {
      name: "L2 Customers",
      value: parseInt(skuData.info?.L2Choice),
      qty: parseFloat(skuData.info?.L2ChoiceQty),
    },
    {
      name: "L3 Customers",
      value: parseInt(skuData.info?.L3Choice),
      qty: parseFloat(skuData.info?.L3ChoiceQty),
    },
    {
      name: "L4 Customers",
      value: parseInt(skuData.info?.L4Choice),
      qty: parseFloat(skuData.info?.L4ChoiceQty),
    },
  ];

  const totalCustomers = customerSegmentData?.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalQuantity = customerSegmentData?.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const salesComparisonData = [
    {
      name: "Previous Month",
      sales: parseFloat(skuData.prevMonthSales?.GrossAmt),
      cogs: parseFloat(skuData.prevMonthSales?.COGS),
      qty: parseFloat(skuData.prevMonthSales?.Qty),
    },
    {
      name: "Current Month",
      sales: parseFloat(skuData.curMonthSale?.GrossAmt),
      cogs: parseFloat(skuData.curMonthSale?.COGS),
      qty: parseFloat(skuData.curMonthSale?.Qty),
    },
  ];

  // Calculate growth/decline percentages
  const salesGrowth =
    ((parseFloat(skuData.curMonthSale?.GrossAmt) -
      parseFloat(skuData.prevMonthSales?.GrossAmt)) /
      parseFloat(skuData.prevMonthSales?.GrossAmt)) *
    100;
  const qtyGrowth =
    ((parseFloat(skuData.curMonthSale1?.Qty) -
      parseFloat(skuData.prevMonthSales?.Qty)) /
      parseFloat(skuData.prevMonthSales?.Qty)) *
    100;

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const TabButton = ({ id, label, active, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 flex items-center gap-2 font-medium rounded-lg ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );

  const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
      {children}
    </div>
  );

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend = null,
    trendValue = null,
    suffix = "",
    className = "",
  }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value}
            {suffix}
          </p>
          {trend !== null && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="ml-1">{Math.abs(trendValue).toFixed(2)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon size={24} className="text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <SKUAnalyticsSkeletonLoader/>

  return (
    <MainLayout>
      <div className="bg-gray-50 rounded-xl p-6 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {skuData.info?.SkuName}
          </h1>
          <div className="flex gap-2 mt-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              SKU: {skuData.info?.code}
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {skuData.info?.BrandName}
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {skuData.info?.GroupName}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton
            id="overview"
            label="Overview"
            active={activeTab === "overview"}
            icon={Activity}
          />
          <TabButton
            id="sales"
            label="Sales Analysis"
            active={activeTab === "sales"}
            icon={DollarSign}
          />
          <TabButton
            id="customers"
            label="Customer Segmentation"
            active={activeTab === "customers"}
            icon={Users}
          />
          <TabButton
            id="inventory"
            label="Inventory"
            active={activeTab === "inventory"}
            icon={Package}
          />
          <TabButton
            id="subsku"
            label="Sub SKUs"
            active={activeTab === "subsku"}
            icon={Package}
          />
          <TabButton
            id="validations"
            label="Price Validations"
            active={activeTab === "validations"}
            icon={AlertCircle}
          />
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Current Month Sales"
              value={`₹${parseFloat(skuData?.curMonthSale?.GrossAmt || 0).toFixed(2)}`}
              icon={DollarSign}
              trend={salesGrowth >= 0 ? "up" : "down"}
              trendValue={salesGrowth}
            />
            <StatCard
              title="Units Sold This Month"
              value={parseFloat(skuData.curMonthSale?.Qty || 0).toFixed(0)}
              icon={ShoppingCart}
              trend={qtyGrowth >= 0 ? "up" : "down"}
              trendValue={qtyGrowth}
            />
            <StatCard
              title="Current Stock"
              value={parseFloat(skuData.weakStockDetails?.D1).toFixed(0)}
              icon={Package}
            />
            <StatCard
              title="Customer Reach"
              value={totalCustomers}
              icon={Users}
              suffix=" customers"
            />
          </div>
        )}

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Weekly Stock Levels">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card title="Sales Comparison">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#10b981"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="sales"
                      name="Sales Amount (₹)"
                      fill="#3b82f6"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="qty"
                      name="Quantity Sold"
                      fill="#10b981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "customers" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="High-Value Customers (L1)"
                value={skuData.info.L1Choice}
                icon={Users}
                className="border-l-4 border-blue-600"
              />
              <StatCard
                title="Mid-High Customers (L2)"
                value={skuData.info.L2Choice}
                icon={Users}
                className="border-l-4 border-green-500"
              />
              <StatCard
                title="Mid-Low Customers (L3)"
                value={skuData.info.L3Choice}
                icon={Users}
                className="border-l-4 border-yellow-500"
              />
              <StatCard
                title="Low-Value Customers (L4)"
                value={skuData.info.L4Choice}
                icon={Users}
                className="border-l-4 border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Customer Segmentation by Count">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} customers`, "Count"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card title="Customer Segmentation by Quantity">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="qty"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} units`, "Quantity"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="mt-6">
              <Card title="Customer Segment Details">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Segment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Customers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerSegmentData.map((segment, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="h-3 w-3 rounded-full mr-2"
                                style={{
                                  backgroundColor: COLORS[idx % COLORS.length],
                                }}
                              ></div>
                              <div className="text-sm font-medium text-gray-900">
                                {segment.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {segment.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {((segment.value / totalCustomers) * 100).toFixed(
                              1
                            )}
                            %
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {segment.qty.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {((segment.qty / totalQuantity) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Current Month Sales"
                value={`₹${parseFloat(skuData.curMonthSale.GrossAmt).toFixed(
                  2
                )}`}
                icon={DollarSign}
                trend={salesGrowth >= 0 ? "up" : "down"}
                trendValue={salesGrowth}
              />
              <StatCard
                title="Previous Month Sales"
                value={`₹${parseFloat(
                  skuData.prevMonthSales[0].GrossAmt
                ).toFixed(2)}`}
                icon={DollarSign}
              />
              <StatCard
                title="Current Month COGS"
                value={`₹${parseFloat(skuData.curMonthSale.COGS).toFixed(2)}`}
                icon={Package}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card title="Sales Performance">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="sales"
                        name="Gross Sales (₹)"
                        fill="#3b82f6"
                      />
                      <Bar dataKey="cogs" name="COGS (₹)" fill="#ef4444" />
                      <Bar dataKey="qty" name="Quantity" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card title="Profitability Analysis">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Current Month Margin
                    </p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(
                              ((parseFloat(skuData.curMonthSale.GrossAmt) -
                                parseFloat(skuData.curMonthSale.COGS)) /
                                parseFloat(skuData.curMonthSale.GrossAmt)) *
                              100
                            ).toFixed(0)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {(
                          ((parseFloat(skuData.curMonthSale.GrossAmt) -
                            parseFloat(skuData.curMonthSale.COGS)) /
                            parseFloat(skuData.curMonthSale.GrossAmt)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Previous Month Margin
                    </p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{
                            width: `${(
                              ((parseFloat(skuData.prevMonthSales[0].GrossAmt) -
                                parseFloat(skuData.prevMonthSales[0].COGS)) /
                                parseFloat(
                                  skuData.prevMonthSales[0].GrossAmt
                                )) *
                              100
                            ).toFixed(0)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {(
                          ((parseFloat(skuData.prevMonthSales[0].GrossAmt) -
                            parseFloat(skuData.prevMonthSales[0].COGS)) /
                            parseFloat(skuData.prevMonthSales[0].GrossAmt)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Sales Metrics">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Avg. Price (Current)
                      </p>
                      <p className="text-xl font-semibold">
                        ₹
                        {(
                          parseFloat(skuData.curMonthSale.GrossAmt) /
                          parseFloat(skuData.curMonthSale.Qty)
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Avg. Price (Previous)
                      </p>
                      <p className="text-xl font-semibold">
                        ₹
                        {(
                          parseFloat(skuData.prevMonthSales[0].GrossAmt) /
                          parseFloat(skuData.prevMonthSales[0].Qty)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">MRP Realization</p>
                      <p className="text-xl font-semibold">
                        {(
                          (parseFloat(skuData.curMonthSale.GrossAmt) /
                            parseFloat(skuData.curMonthSale.MRPTotal)) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Discounts</p>
                      <p className="text-xl font-semibold">
                        ₹{parseFloat(skuData.curMonthSale.Discount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Current Stock"
                value={parseFloat(skuData.weakStockDetails.D1).toFixed(0)}
                icon={Package}
              />
              <StatCard
                title="Weekly Sales Quantity"
                value={parseFloat(skuData.weakStockDetails.cwSQty).toFixed(0)}
                icon={ShoppingCart}
              />
              <StatCard
                title="Stock Change (Week)"
                value={
                  parseFloat(skuData.weakStockDetails.D7) -
                  parseFloat(skuData.weakStockDetails.D1)
                }
                icon={Activity}
                trend={
                  parseFloat(skuData.weakStockDetails.D7) >=
                  parseFloat(skuData.weakStockDetails.D1)
                    ? "down"
                    : "up"
                }
                trendValue={
                  ((parseFloat(skuData.weakStockDetails.D1) -
                    parseFloat(skuData.weakStockDetails.D7)) /
                    parseFloat(skuData.weakStockDetails.D7)) *
                  100
                }
              />
              <StatCard
                title="Days of Supply"
                value={(
                  parseFloat(skuData.weakStockDetails.D1) /
                  (parseFloat(skuData.weakStockDetails.cwSQty) / 7)
                ).toFixed(1)}
                icon={Activity}
                suffix=" days"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card title="Stock Trend (Last 7 Days)">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stockTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Stock Level"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="mt-6">
              <Card title="Inventory Details">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stockTrendData.map((day, idx) => {
                        const prevDay =
                          idx < stockTrendData.length - 1
                            ? stockTrendData[idx + 1].value
                            : day.value;
                        const change = day.value - prevDay;
                        return (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {day.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {day.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {idx < stockTrendData.length - 1 && (
                                <div
                                  className={`flex items-center text-sm ${
                                    change > 0
                                      ? "text-green-500"
                                      : change < 0
                                      ? "text-red-500"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {change > 0 ? (
                                    <ChevronUp size={16} />
                                  ) : change < 0 ? (
                                    <ChevronDown size={16} />
                                  ) : null}
                                  <span>{Math.abs(change)}</span>
                                </div>
                              )}
                              {idx === stockTrendData.length - 1 && (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "validations" && (
          <div>
            {/* Empty State for Price Validations */}
            {(!skuData.purchasePriceValidations ||
              Object.keys(skuData.purchasePriceValidations).length === 0) &&
              (!skuData.salesPriceValidations ||
                Object.keys(skuData.salesPriceValidations).length === 0) && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <AlertCircle
                    size={48}
                    className="mx-auto mb-4 text-gray-400"
                  />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No Price Validations Available
                  </h3>
                  <p className="text-gray-500">
                    There are currently no price validation issues for this SKU.
                  </p>
                </div>
              )}

            {/* Purchase Price Validations */}
            {skuData.purchasePriceValidations &&
              Object.keys(skuData.purchasePriceValidations).length > 0 && (
                <Card title="Purchase Price Validations" className="mb-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Purchase Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vendor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Previous Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.keys(skuData.purchasePriceValidations).length >
                        0 ? (
                          Object.values(skuData.purchasePriceValidations).map(
                            (validation, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {validation.PurchaseDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {validation.Vendor}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {parseFloat(validation.QTY).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹{parseFloat(validation.Rate).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹
                                  {parseFloat(validation.previous_rate).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      parseFloat(validation.Per) > 0
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {parseFloat(validation.Per) > 0 ? "+" : ""}
                                    {parseFloat(validation.Per).toFixed(2)}%
                                  </div>
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No purchase price validations available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

            {/* Sales Price Validations */}
            {skuData.salesPriceValidations &&
              Object.keys(skuData.salesPriceValidations).length > 0 && (
                <Card title="Sales Price Validations">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Group
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current MRP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Previous MRP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current SP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Previous SP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.keys(skuData.salesPriceValidations).length >
                        0 ? (
                          Object.values(skuData.salesPriceValidations).map(
                            (validation, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {validation.dot.split("T")[0]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {validation.GroupName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹{parseFloat(validation.MRP).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹
                                  {parseFloat(validation.previous_mrp).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹{parseFloat(validation.SP1).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹
                                  {parseFloat(validation.previous_SP1).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      parseFloat(validation.per) > 0
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {parseFloat(validation.per) > 0 ? "+" : ""}
                                    {parseFloat(validation.per).toFixed(2)}%
                                  </div>
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No sales price validations available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
          </div>
        )}
        {activeTab === "subsku" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Sub SKUs for {skuData.info.SkuName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Related product variants and packaging options
              </p>
            </div>

            {subSkuList.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Sub SKUs"
                    value={subSkuList.length}
                    icon={Package}
                  />
                  <StatCard
                    title="Average MRP"
                    value={`₹${(
                      subSkuList.reduce(
                        (sum, item) => sum + parseFloat(item.MRP),
                        0
                      ) / subSkuList.length
                    ).toFixed(2)}`}
                    icon={DollarSign}
                  />
                  <StatCard
                    title="Verified Sub SKUs"
                    value={
                      subSkuList.filter((item) => item.verified === 1).length
                    }
                    icon={Activity}
                  />
                  <StatCard
                    title="PLU Items"
                    value={subSkuList.filter((item) => item.PLU === 1).length}
                    icon={ShoppingCart}
                  />
                </div>

                <Card title="Sub SKU Details">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            HSN
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            MRP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SP1
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conversion Qty
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subSkuList.map((subSku, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {subSku.code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subSku.SubSkuName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subSku.HSN}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{parseFloat(subSku.MRP).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{parseFloat(subSku.SP1).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {parseFloat(subSku.ConversionQty).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  subSku.verified === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {subSku.verified === 1 ? "Verified" : "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card title="Pricing Comparison">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subSkuList.map((item) => ({
                          name:
                            item.SubSkuName.length > 20
                              ? item.SubSkuName.substring(0, 20) + "..."
                              : item.SubSkuName,
                          MRP: parseFloat(item.MRP),
                          SP1: parseFloat(item.SP1),
                          SP2: parseFloat(item.SalesPrice2),
                          convQty: parseFloat(item.ConversionQty),
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`₹${value}`, `Price`]}
                        />
                        <Legend />
                        <Bar dataKey="MRP" name="MRP" fill="#3b82f6" />
                        <Bar dataKey="SP1" name="SP1" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="Unit Size Comparison">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subSkuList.map((item) => ({
                          name:
                            item.SubSkuName.length > 20
                              ? item.SubSkuName.substring(0, 20) + "..."
                              : item.SubSkuName,
                          conversionQty: parseFloat(item.ConversionQty),
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="conversionQty"
                          name="Unit Size"
                          fill="#8884d8"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Sub SKUs Available
                </h3>
                <p className="text-gray-500">
                  This product doesn't have any associated sub SKUs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SKUAnalyticsDashboard;
