import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronRight,
  TrendingUp,
  DollarSign,
  Package,
  Percent,
  ChevronUp,
  ChevronDown,
  Loader,
} from "lucide-react";
import { getRequest } from "../../../../../../services/apis/requests";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../../Layout/Layout";
import OverviewDashboard from "./components/Overvirew";
import SkuDetailModal from "./components/SkuDetailModal";
import SKUAnalytics from "./components/SKuAnaltycs";
import SalesAnalytics from "./components/Sales";
import BrandsAnalytics from "./components/Brands";
import VendorsSection from "./components/Vendors";
import GroupAnalysisHeader from "./components/Header";

// Tab component
const Tab = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
      active
        ? "bg-white text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-700 bg-gray-100"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Card component
const Card = ({ title, value, subValue, icon, trend, color }) => {
  const Icon = icon;
  const isPositive = trend > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2">
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {trend}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {subValue && <p className="text-sm text-gray-500 mt-4">{subValue}</p>}
    </div>
  );
};

const LevelBadge = ({ level, count }) => {
  const colors = {
    L1: "bg-blue-100 text-blue-800",
    L2: "bg-green-100 text-green-800",
    L3: "bg-yellow-100 text-yellow-800",
    L4: "bg-purple-100 text-purple-800",
    Low: "bg-gray-100 text-gray-800",
  };

  return count > 0 ? (
    <span
      className={`${colors[level]} text-xs font-medium px-2.5 py-0.5 rounded-full`}
    >
      {level}: {count}
    </span>
  ) : null;
};

const GroupNBrandDetails = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSku, setSelectedSku] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const openModal = (sku) => {
    setSelectedSku(sku);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleViewFullDetail = () => {
    closeModal();
    navigate(`/inventory/sku-details?sku=${selectedSku.code}`);
  };

  const { gpCode } = useParams();
  const {bdCode} = useParams()
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRequest(
          `inventory/group-details/?productGpCode=${gpCode}&productbrandCode=${bdCode}`
        );

        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [gpCode]);

  const processVendorData = () => {
    const { recentVendorsWhoPaidWithouClearingStock, Recentvendors } = data;

    const allVendors = [
      ...Recentvendors,
      ...recentVendorsWhoPaidWithouClearingStock,
    ];
    const vendorMap = {};

    allVendors.forEach((vendor) => {
      if (!vendorMap[vendor.VENDOR]) {
        vendorMap[vendor.VENDOR] = {
          name: vendor.VENDOR,
          code: vendor.VENDORLEDGERCODE,
          totalBillQty: 0,
          totalContribQty: 0,
          totalBalanceQty: 0,
          totalStock: 0,
          totalInvoiceAmount: 0,
          lastPurchaseDate: null,
          items: [],
          isPaid: false,
          invoices: new Set(),
        };
      }

      const isPaidVendor = recentVendorsWhoPaidWithouClearingStock.some(
        (paid) =>
          paid.VENDORLEDGERCODE === vendor.VENDORLEDGERCODE &&
          paid.INVOICENO === vendor.INVOICENO
      );

      vendorMap[vendor.VENDOR].totalBillQty += parseFloat(vendor.BillQty || 0);
      vendorMap[vendor.VENDOR].totalContribQty += parseFloat(
        vendor.ContribQty || 0
      );
      vendorMap[vendor.VENDOR].totalBalanceQty += parseFloat(
        vendor.BalanceQty || 0
      );
      vendorMap[vendor.VENDOR].totalStock += parseFloat(vendor.STOCK || 0);
      vendorMap[vendor.VENDOR].isPaid =
        vendorMap[vendor.VENDOR].isPaid || isPaidVendor;
      vendorMap[vendor.VENDOR].invoices.add(vendor.INVOICENO);

      if (!isNaN(parseFloat(vendor.INVOICEAMOUNT))) {
        vendorMap[vendor.VENDOR].totalInvoiceAmount += parseFloat(
          vendor.INVOICEAMOUNT
        );
      }

      const vendorDate = new Date(vendor.DOT);
      if (
        !vendorMap[vendor.VENDOR].lastPurchaseDate ||
        vendorDate > vendorMap[vendor.VENDOR].lastPurchaseDate
      ) {
        vendorMap[vendor.VENDOR].lastPurchaseDate = vendorDate;
      }

      const existingItemIndex = vendorMap[vendor.VENDOR].items.findIndex(
        (item) => item.skuName === vendor.skuName
      );
      if (existingItemIndex === -1) {
        vendorMap[vendor.VENDOR].items.push({
          skuName: vendor.skuName,
          qty: parseFloat(vendor.ContribQty || 0),
          stock: parseFloat(vendor.STOCK || 0),
        });
      } else {

        vendorMap[vendor.VENDOR].items[existingItemIndex].qty += parseFloat(
          vendor.ContribQty || 0
        );
        vendorMap[vendor.VENDOR].items[existingItemIndex].stock += parseFloat(
          vendor.STOCK || 0
        );
      }
    });

    // Convert Set to array for invoices
    Object.values(vendorMap).forEach((vendor) => {
      vendor.invoices = Array.from(vendor.invoices);
      vendor.invoiceCount = vendor.invoices.length;
    });

    return Object.values(vendorMap).sort(
      (a, b) => b.lastPurchaseDate - a.lastPurchaseDate
    );
  };
  if (loading) {
    return (
      <MainLayout>
        {" "}
        <div className="flex h-[200px] items-center justify-center">
          <div className="flex flex-col items-center text-blue-600">
            <Loader className="h-8 w-8 animate-spin mb-2" />
            <span className="text-sm text-gray-500">Loading data...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">No data available.</div>
      </div>
    );
  }

  const vendorData = processVendorData();

  // Helpers for data manipulation
  const getTotalCurrentSales = () => {
    return data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.CurrentMonthSale) || 0);
    }, 0).toFixed(2);
  };

  const getTotalPrevSales = () => {
    return data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.PrevMonthSale) || 0);
    }, 0).toFixed(2);
  };

  const getSalesGrowth = () => {
    const current = parseFloat(getTotalCurrentSales());
    const prev = parseFloat(getTotalPrevSales());
    return prev !== 0 ? (((current - prev) / prev) * 100).toFixed(1) : 0;
  };

  const getCurrentProfit = () => {
    const totalSales = parseFloat(getTotalCurrentSales());
    const totalCogs = data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.CurrentMonthCogs) || 0);
    }, 0);
    return (totalSales - totalCogs).toFixed(2);
  };

  const getPrevProfit = () => {
    const totalSales = parseFloat(getTotalPrevSales());
    const totalCogs = data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.PrevMonthCogs) || 0);
    }, 0);
    return (totalSales - totalCogs).toFixed(2);
  };

  const getProfitGrowth = () => {
    const current = parseFloat(getCurrentProfit());
    const prev = parseFloat(getPrevProfit());
    return prev !== 0 ? (((current - prev) / prev) * 100).toFixed(1) : 0;
  };

  const getCurrentMargin = () => {
    const sales = parseFloat(getTotalCurrentSales());
    const profit = parseFloat(getCurrentProfit());
    return sales !== 0 ? ((profit / sales) * 100).toFixed(1) : 0;
  };

  const getPrevMargin = () => {
    const sales = parseFloat(getTotalPrevSales());
    const profit = parseFloat(getPrevProfit());
    return sales !== 0 ? ((profit / sales) * 100).toFixed(1) : 0;
  };

  const getMarginChange = () => {
    const current = parseFloat(getCurrentMargin());
    const prev = parseFloat(getPrevMargin());
    return prev !== 0 ? (current - prev).toFixed(1) : 0;
  };

  const getTotalUnits = () => {
    return data.Skus.reduce((sum, sku) => {
      return sum + (parseFloat(sku.CurrentMonthSale) ? 1 : 0);
    }, 0);
  };

  const getActiveBrands = () => {
    return data.brands.filter(
      (brand) =>
        parseFloat(brand.CurrentMonthSales) > 0 ||
        parseFloat(brand.PrevMonthSales) > 0
    ).length;
  };



  const skuPerformanceData = data.Skus.filter(
    (sku) =>
      parseFloat(sku.CurrentMonthSale) > 0 || parseFloat(sku.PrevMonthSale) > 0
  )
    .map((sku) => {

      const brandName =data.info[0]?.BrandName
      return {
        name: sku.SkuName,
        code: sku.code,
        brand: brandName,
        currentSales: parseFloat(sku.CurrentMonthSale) || 0,
        prevSales: parseFloat(sku.PrevMonthSale) || 0,
        growth: parseFloat(sku.PrevMonthSale)
          ? (
              ((parseFloat(sku.CurrentMonthSale || 0) -
                parseFloat(sku.PrevMonthSale)) /
                parseFloat(sku.PrevMonthSale)) *
              100
            ).toFixed(1)
          : 0,
        L1Choice: parseInt(sku.L1Choice),
        L2Choice: parseInt(sku.L2Choice),
        L3Choice: parseInt(sku.L3Choice),
        L4Choice: parseInt(sku.L4Choice),
        LowChoice: parseInt(sku.LowChoice),
        uom: sku.uom,
        cQty: parseFloat(sku.cQty),
        currentCogs: parseFloat(sku.CurrentMonthCogs) || 0,
        prevCogs: parseFloat(sku.PrevMonthCogs) || 0,
      };
    })
    .sort((a, b) => b.currentSales - a.currentSales);

  const skusWithMargins = skuPerformanceData.map((sku) => ({
    ...sku,
    currentMargin:
      sku.currentSales !== 0
        ? (
            ((sku.currentSales - sku.currentCogs) / sku.currentSales) *
            100
          ).toFixed(1)
        : 0,
    prevMargin:
      sku.prevSales !== 0
        ? (((sku.prevSales - sku.prevCogs) / sku.prevSales) * 100).toFixed(1)
        : 0,
  }));

  // Handle navigation
  const navigateToBrandDetail = (brand) => {
    console.log(
      `Navigating to detail page for brand ${brand.BrandName} with code ${brand.BrandCode}`
    );
    // In a real app, you would use navigation here:
    // history.push(`/brand-detail/${data.info[0].Code}/${brand.BrandCode}`);

    // For this example, we'll just set the selected brand
    setSelectedBrand(brand);
  };

  const navigateToSkuDetail = (sku) => {
    openModal(sku);
  };

  // Prepare customer level data
  const customerLevelData = [
    {
      name: "Top 25% (L1)",
      value: skuPerformanceData.reduce((sum, sku) => sum + sku.L1Choice, 0),
    },
    {
      name: "25-50% (L2)",
      value: skuPerformanceData.reduce((sum, sku) => sum + sku.L2Choice, 0),
    },
    {
      name: "50-75% (L3)",
      value: skuPerformanceData.reduce((sum, sku) => sum + sku.L3Choice, 0),
    },
    {
      name: "75-100% (L4)",
      value: skuPerformanceData.reduce((sum, sku) => sum + sku.L4Choice, 0),
    },
    {
      name: "Low Frequency",
      value: skuPerformanceData.reduce((sum, sku) => sum + sku.LowChoice, 0),
    },
  ].filter((item) => item.value > 0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Return to main view from detail views
  const returnToMainView = () => {
    setSelectedBrand(null);
    setSelectedSku(null);
  };

  // Render brand detail view
  if (selectedBrand) {
    const brand = selectedBrand;

    // Filter SKUs for this brand
    const brandSkus = skusWithMargins.filter(
      (sku) => sku.brand === brand.BrandName
    );

    // Calculate metrics for this brand
    const currentSales = parseFloat(brand.CurrentMonthSales) || 0;
    const prevSales = parseFloat(brand.PrevMonthSales) || 0;
    const salesGrowth =
      prevSales !== 0
        ? (((currentSales - prevSales) / prevSales) * 100).toFixed(1)
        : 0;

    const currentCogs = parseFloat(brand.CurrentMonthTotalCogs) || 0;
    const prevCogs = parseFloat(brand.PrevMonthTotalCogs) || 0;

    const currentProfit = currentSales - currentCogs;
    const prevProfit = prevSales - prevCogs;
    const profitGrowth =
      prevProfit !== 0
        ? (((currentProfit - prevProfit) / prevProfit) * 100).toFixed(1)
        : 0;

    const currentMargin =
      currentSales !== 0
        ? ((currentProfit / currentSales) * 100).toFixed(1)
        : 0;
    const prevMargin =
      prevSales !== 0 ? ((prevProfit / prevSales) * 100).toFixed(1) : 0;
    const marginChange = (currentMargin - prevMargin).toFixed(1);

    // Monthly data for charts
    const monthlyData = [
      {
        name: "Previous Month",
        sales: prevSales,
        profit: prevProfit,
        margin: prevMargin,
      },
      {
        name: "Current Month",
        sales: currentSales,
        profit: currentProfit,
        margin: currentMargin,
      },
    ];

    return (
      <MainLayout>
        <div className="p-6  bg-gray-50 min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={returnToMainView}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              ← Back to Overview
            </button>

            <button
              onClick={() =>
                console.log(
                  `Navigate to combined performance view for ${brand.BrandName} with code ${brand.BrandCode} and group ${data.info[0].Code}`
                )
              }
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Group & Brand Performance{" "}
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h1 className="text-2xl font-bold mb-4">{brand.BrandName}</h1>
            <p className="text-gray-500 mb-6">
              Brand Code: {brand.BrandCode} | Category: {data.info[0].Name}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card
                title="Sales"
                value={`₹${currentSales.toFixed(2)}`}
                icon={DollarSign}
                trend={salesGrowth}
                color="bg-blue-500"
              />
              <Card
                title="Profit"
                value={`₹${currentProfit.toFixed(2)}`}
                icon={TrendingUp}
                trend={profitGrowth}
                color="bg-green-500"
              />
              <Card
                title="Margin"
                value={`${currentMargin}%`}
                icon={Percent}
                trend={marginChange}
                color="bg-purple-500"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">
                Monthly Performance
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#3B82F6" />
                  <Bar dataKey="profit" name="Profit" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">SKUs Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Margin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Levels
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brandSkus.map((sku) => (
                      <tr key={sku.code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sku.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{sku.currentSales.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              parseFloat(sku?.growth) > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {parseFloat(sku?.growth) > 0 ? "+" : ""}
                            {sku?.growth}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sku.currentMargin}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-1">
                            <LevelBadge level="L1" count={sku.L1Choice} />
                            <LevelBadge level="L2" count={sku.L2Choice} />
                            <LevelBadge level="L3" count={sku.L3Choice} />
                            <LevelBadge level="L4" count={sku.L4Choice} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigateToSkuDetail(sku)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            Details <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const salesChange = parseFloat(getSalesGrowth());
  const profitChange = parseFloat(getProfitGrowth());
  const marginChange = parseFloat(getMarginChange());

  const MetricCard = ({
    title,
    value,
    subValue,
    icon,
    trend,
    color,
    onClick,
  }) => {
    const Icon = icon;
    const isPositive = trend > 0;

    return (
      <div
        className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color} hover:shadow-md transition-all duration-200 cursor-pointer`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <div className="flex items-center mt-2">
              <span
                className={`flex items-center text-xs font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
          <div
            className={`p-3 rounded-full bg-opacity-10 ${color.replace(
              "border",
              "bg"
            )}`}
          >
            <Icon
              size={20}
              className={color
                .replace("border", "text")
                .replace("-500", "-600")}
            />
          </div>
        </div>
        {subValue && <p className="text-sm text-gray-500 mt-4">{subValue}</p>}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className=" rounded-xl bg-gray-50 min-h-screen">
        <GroupAnalysisHeader data={data} onCategoryClick={() => {}} />
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Sales"
              value={`₹${getTotalCurrentSales()}`}
              icon={DollarSign}
              trend={salesChange}
              color="border-blue-500"
              subValue={`Previous: ₹${getTotalPrevSales()}`}
            />
            <MetricCard
              title="Total Profit"
              value={`₹${getCurrentProfit()}`}
              icon={TrendingUp}
              trend={profitChange}
              color="border-green-500"
              subValue={`Previous: ₹${getPrevProfit()}`}
            />
            <MetricCard
              title="Profit Margin"
              value={`${getCurrentMargin()}%`}
              icon={Percent}
              trend={marginChange}
              color="border-purple-500"
              subValue={`Previous: ${getPrevMargin()}%`}
            />
            <MetricCard
              title="Active SKUs"
              value={getTotalUnits()}
              icon={Package}
              trend={0}
              color="border-orange-500"
              subValue={`Active Brands: ${getActiveBrands()}`}
            />
          </div>

          <div className="my-3 ">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`${
                    activeTab === "overview"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
                >
                  <svg
                    className={`mr-2 h-4 w-4 ${
                      activeTab === "overview"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Over view
                </button>
                <button
                  onClick={() => setActiveTab("sales")}
                  className={`${
                    activeTab === "sales"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
                >
                  <svg
                    className={`mr-2 h-4 w-4 ${
                      activeTab === "sales" ? "text-blue-600" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Sales
                </button>
                <button
                  onClick={() => setActiveTab("skus")}
                  className={`${
                    activeTab === "skus"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
                >
                  <svg
                    className={`mr-2 h-4 w-4 ${
                      activeTab === "skus" ? "text-blue-600" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 4l-8 4m8-4l-8-4m-8 4l8 4"
                    />
                  </svg>
                  SKUs
                </button>
                <button
                  onClick={() => setActiveTab("vendors")}
                  className={`${
                    activeTab === "vendors"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
                >
                  <svg
                    className={`mr-2 h-4 w-4 ${
                      activeTab === "vendors"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Vendors
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <OverviewDashboard
              data={data}
              navigateToBrandDetail={navigateToBrandDetail}
              navigateToSkuDetail={(sku) => {
                openModal(sku);
              }}
            />
          )}

          {activeTab === "sales" && <SalesAnalytics data={data} />}

          {activeTab === "skus" && (
            <SKUAnalytics
              data={data}
              navigateToSkuDetail={navigateToSkuDetail}
            />
          )}

          {activeTab === "vendors" && (
            <VendorsSection vendorData={vendorData} />
          )}
        </div>
      </div>

      <SkuDetailModal
        sku={selectedSku}
        isOpen={isModalOpen}
        onClose={closeModal}
        onViewFullDetail={handleViewFullDetail}
      />

    </MainLayout>
  );
};

export default GroupNBrandDetails;
