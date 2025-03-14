import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  LineChart,
  ScatterChart,
  Scatter,
} from "recharts";
import { formatCurrency, formatDate } from "../../../../utils/helper";
import { getRequest } from "../../../../services/apis/requests";

const SalesOverView = () => {
  // State management
  const [activeTab, setActiveTab] = useState("daily");
  const [dateRange, setDateRange] = useState("7");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [comparisonYear, setComparisonYear] = useState("2024");
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [previousMonthlyData, setPreviousMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current year for dropdown options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  const getDailySales = async () => {
    setIsLoading(true);
    try {
      const response = await getRequest(`sales/day-wise/?range=${dateRange}`);
      if (response.success) {
        setDailyData(response.data.current);
        setPreviousDailyData(response.data.previous);

        console.log(`start -`);
        console.log(response.data.current[0], response.data.previous[0]);
        console.log(
          `end - - ${
            (response.data.current[response.data.current.length - 1],
            response.data.previous[response.data.previous.length - 1])
          }`
        );
        console.log(
          response.data.current[response.data.current.length - 1],
          response.data.previous[response.data.previous.length - 1]
        );
      }
    } catch (error) {
      console.error("Error fetching daily sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthlySales = async () => {
    setIsLoading(true);
    try {
      const response = await getRequest(
        `sales/month-wise/?year=${selectedYear}`
      );
      if (response.success) {
        setMonthlyData(response.data);
      }
    } catch (error) {
      console.error("Error fetching monthly sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getComparisonMonthlySales = async () => {
    if (!comparisonMode) return;

    try {
      const response = await getRequest(
        `sales/month-wise/?year=${comparisonYear}`
      );
      if (response.success) {
        setPreviousMonthlyData(response.data);
      }
    } catch (error) {
      console.error("Error fetching comparison monthly sales data:", error);
    }
  };

  const getYearlySales = async () => {
    setIsLoading(true);
    try {
      const response = await getRequest(`sales/year-wise/`);
      if (response.success) {
        setYearlyData(response.data);
      }
    } catch (error) {
      console.error("Error fetching yearly sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDailySales();
  }, [dateRange]);

  useEffect(() => {
    getMonthlySales();
  }, [selectedYear]);

  useEffect(() => {
    getComparisonMonthlySales();
  }, [comparisonMode, comparisonYear, selectedYear]);

  useEffect(() => {
    getYearlySales();
  }, []);

  // Sample previous daily data for comparison
  const [previousDailyData, setPreviousDailyData] = useState([]);

  const currentDay = new Date().getDate();

  // Calculate additional metrics
  const getDisplayData = () => {
    if (activeTab === "daily") return dailyData;
    if (activeTab === "monthly") return monthlyData;
    return yearlyData;
  };

  const getPreviousData = () => {
    if (activeTab === "daily") return previousDailyData;
    if (activeTab === "monthly") return previousMonthlyData;
    // For yearly, we could implement a similar approach
    return [];
  };

  const getXAxisKey = () => {
    if (activeTab === "daily") return "date";
    if (activeTab === "monthly") return "month";
    return "year";
  };

  // Get statistics for the metrics cards
  const data = getDisplayData();
  const prevData = getPreviousData();
  const totalSales = data?.reduce((sum, item) => sum + item.nob, 0) || 0;
  const totalRevenue =
    data?.reduce((sum, item) => sum + parseFloat(item.grossAmount), 0) || 0;
  const averageSaleValue = totalSales ? totalRevenue / totalSales : 0;

  // Calculate previous period metrics
  const prevTotalSales =
    prevData?.reduce((sum, item) => sum + item.nob, 0) || 0;
  const prevTotalRevenue =
    prevData?.reduce((sum, item) => sum + parseFloat(item.grossAmount), 0) || 0;

  // Calculate percent changes
  const salesChange = prevTotalSales
    ? (((totalSales - prevTotalSales) / prevTotalSales) * 100)?.toFixed(1)
    : null;
  const revenueChange = prevTotalRevenue
    ? (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100)?.toFixed(1)
    : null;

  // Find highest and lowest performing periods
  const highestGrossAmount = data?.reduce(
    (max, item) => Math.max(max, parseFloat(item.grossAmount)),
    0
  );
  const lowestGrossAmount = data?.reduce(
    (min, item) => Math.min(min, parseFloat(item.grossAmount)),
    highestGrossAmount || 0
  );

  const highestPerforming = data?.find(
    (item) => parseFloat(item.grossAmount) === highestGrossAmount
  );
  const lowestPerforming = data?.find(
    (item) => parseFloat(item.grossAmount) === lowestGrossAmount
  );

  // Sales trend analysis
  const salesTrend = data?.map((item, index, array) => {
    if (index === 0) return { ...item, trend: 0 };
    const prevAmount = parseFloat(array[index - 1].grossAmount);
    const currentAmount = parseFloat(item.grossAmount);
    const trend = prevAmount
      ? ((currentAmount - prevAmount) / prevAmount) * 100
      : 0;
    return { ...item, trend };
  });

  // Calculate average trend
  const avgTrend =
    salesTrend?.reduce((sum, item) => sum + (item.trend || 0), 0) /
      (salesTrend?.length || 1) || 0;

  // COLORS
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28BFF",
    "#FF6B6B",
    "#4ECDC4",
  ];
  const TREND_COLORS = {
    positive: "#10B981",
    negative: "#EF4444",
    neutral: "#6B7280",
  };

  // Format value for axes
  const formatYAxisValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;

    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  // Generate top performing days/months/years
  const topPerformers = [...(data || [])]
    .sort((a, b) => b.grossAmount - a.grossAmount)
    .slice(0, 5);

  // Get the highest revenue value from both current and previous data for proper scaling
  const getMaxRevenue = () => {
    const currentMax =
      data?.reduce(
        (max, item) => Math.max(max, parseFloat(item.grossAmount)),
        0
      ) || 0;
    const previousMax =
      prevData?.reduce(
        (max, item) => Math.max(max, parseFloat(item.grossAmount)),
        0
      ) || 0;
    return Math.max(currentMax, previousMax) * 1.1; // Add 10% buffer
  };

  // Get the highest trend value for proper scaling
  const getMaxTrend = () => {
    return (
      salesTrend?.reduce(
        (max, item) => Math.max(max, Math.abs(item.trend || 0)),
        0
      ) * 1.2 || 100
    ); // Add 20% buffer
  };

  const getCombinedData = () => {
    if (!comparisonMode || !data || !prevData) return data || [];

    const activeViewType = activeTab; // 'daily', 'monthly', or 'yearly'
    const matchKey = getXAxisKey(); // 'date', 'month', or 'year'

    // For daily data, we need to handle by index rather than matching keys
    if (activeViewType === "daily") {
      return data.map((currentItem, index) => {
        // Get the corresponding previous item by index
        const prevItem = prevData[index] || {};

        console.log(currentItem, prevItem);

        return {
          // Preserve the identifier (date)
          [matchKey]: currentItem[matchKey],

          // Current period metrics
          nob: currentItem.nob || 0,
          grossAmount: parseFloat(currentItem.grossAmount) || 0,

          // Previous period metrics - from the same index position
          prevNob: prevItem.nob || 0,
          prevGrossAmount: parseFloat(prevItem.grossAmount) || 0,

          // Growth calculations
          nobGrowth: prevItem.nob
            ? (((currentItem.nob - prevItem.nob) / prevItem.nob) * 100).toFixed(
                1
              )
            : null,
          revenueGrowth: prevItem.grossAmount
            ? (
                ((parseFloat(currentItem.grossAmount) -
                  parseFloat(prevItem.grossAmount)) /
                  parseFloat(prevItem.grossAmount)) *
                100
              ).toFixed(1)
            : null,

          // Preserve other properties
          ...Object.keys(currentItem)
            .filter((key) => !["nob", "grossAmount", matchKey].includes(key))
            .reduce((obj, key) => {
              obj[key] = currentItem[key];
              return obj;
            }, {}),
        };
      });
    }
    // For monthly and yearly data, match by key
    else {
      // Create a map of previous data for easy lookup
      const prevDataMap = {};
      prevData.forEach((item) => {
        prevDataMap[item[matchKey]] = item;
      });

      return data.map((currentItem) => {
        // Find matching previous period item
        const prevItem = prevDataMap[currentItem[matchKey]] || {};

        return {
          // Preserve the identifier (month or year)
          [matchKey]: currentItem[matchKey],

          // Current period metrics
          nob: currentItem.nob || 0,
          grossAmount: parseFloat(currentItem.grossAmount) || 0,

          // Previous period metrics - matched by key
          prevNob: prevItem.nob || 0,
          prevGrossAmount: parseFloat(prevItem.grossAmount) || 0,

          // Growth calculations
          nobGrowth: prevItem.nob
            ? (((currentItem.nob - prevItem.nob) / prevItem.nob) * 100).toFixed(
                1
              )
            : null,
          revenueGrowth: prevItem.grossAmount
            ? (
                ((parseFloat(currentItem.grossAmount) -
                  parseFloat(prevItem.grossAmount)) /
                  parseFloat(prevItem.grossAmount)) *
                100
              ).toFixed(1)
            : null,

          // Preserve other properties
          ...Object.keys(currentItem)
            .filter((key) => !["nob", "grossAmount", matchKey].includes(key))
            .reduce((obj, key) => {
              obj[key] = currentItem[key];
              return obj;
            }, {}),
        };
      });
    }
  };
  // Add this function to your component
  const getEnhancedDisplayData = () => {
    const rawData = getDisplayData() || [];
    const periodKey = getXAxisKey();
    const periodLabel =
      activeTab === "daily"
        ? "Date"
        : activeTab === "monthly"
        ? "Month"
        : "Year";

    return rawData.map((item) => {
      // Create a custom name for the tooltip display
      const displayName = `${periodLabel}: ${item[periodKey]}`;

      return {
        ...item,
        // Add a new property that Recharts will use for the tooltip
        name: displayName,

        // Ensure these are properly formatted as numbers
        nob: Number(item.nob || 0),
        grossAmount: Number(item.grossAmount || 0),
      };
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      const periodKey = getXAxisKey();
      const periodLabel =
        activeTab === "daily"
          ? "Date"
          : activeTab === "monthly"
          ? "Month"
          : "Year";

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p
            className="label"
            style={{ margin: "0 0 5px", fontWeight: "bold" }}
          >
            {`${periodLabel}: ${data[periodKey]}`}
          </p>
          <p style={{ margin: "2px 0" }}>
            Sales Volume: {data.nob.toLocaleString()}
          </p>
          <p style={{ margin: "2px 0" }}>
            Revenue: {formatCurrency(data.grossAmount)}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
    {/* Sticky Header and Controls */}
    <div className="sticky top-0 z-10 bg-white shadow-lg pb-1 rounded-xl border border-gray-100">
  <div className="mx-auto">
    {/* Header Section with Controls */}
    <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        {/* Title with subtle animation */}
        <h2 className="text-2xl font-bold text-gray-800 flex items-center group relative">
          <span className="group-hover:text-blue-600 transition-colors duration-300">Sales Analytics</span>
          {/* <div className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
            Pro
          </div> */}
        </h2>

        {/* Filter Controls with improved layout */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Last Updated Badge */}
          <div className="text-xs text-gray-600 bg-gray-50 px-4 py-2 rounded-full flex items-center self-start md:self-auto border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Last Updated: {formatDate("2025-02-21")}</span>
          </div>

          {/* Controls Group with consistent styling */}
          <div className="flex flex-wrap gap-3">
            {activeTab === "daily" && (
              <select
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value={21}>This Month</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            )}

            {activeTab === "monthly" && (
              <select
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}

            {/* Comparison Toggle with improved visual design */}
            <div className="flex items-center bg-blue-50 rounded-lg px-4 py-2 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={comparisonMode}
                    onChange={() => setComparisonMode(!comparisonMode)}
                  />
                  <div
                    className={`block w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                      comparisonMode ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out shadow-md ${
                      comparisonMode ? "transform translate-x-5" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-sm text-gray-700 font-medium">
                  Compare Period
                </div>
              </label>

              {comparisonMode && activeTab === "monthly" && (
                <select
                  className="ml-3 px-3 py-1.5 rounded-lg border border-blue-200 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-shadow duration-300"
                  value={comparisonYear}
                  onChange={(e) => setComparisonYear(e.target.value)}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Improved Tabs with animations */}
    <div className="px-6 sm:px-8 bg-white">
      <div className="flex mb-0 overflow-x-auto">
        {["daily", "monthly", "yearly"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-2 relative ${
              activeTab === tab
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></span>
            )}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>
  
    {/* Content Area with improved card design */}
    <div className=" mx-auto mt-6">
      {/* Metrics Summary Cards with enhanced visual appeal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Sales Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Total Sales
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalSales?.toLocaleString() || "0"}
                </div>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            {comparisonMode && salesChange && (
              <div
                className={`mt-3 text-sm font-medium flex items-center ${
                  parseFloat(salesChange) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {parseFloat(salesChange) >= 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                )}{" "}
                {Math.abs(parseFloat(salesChange))}% vs previous period
              </div>
            )}
          </div>
        </div>
  
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-green-500"></div>
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Total Revenue
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(totalRevenue || 0)}
                </div>
              </div>
              <div className="bg-green-100 p-2.5 rounded-lg text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            {comparisonMode && revenueChange && (
              <div
                className={`mt-3 text-sm font-medium flex items-center ${
                  parseFloat(revenueChange) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {parseFloat(revenueChange) >= 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                )}{" "}
                {Math.abs(parseFloat(revenueChange))}% vs previous period
              </div>
            )}
          </div>
        </div>
  
        {/* Average Sale Value Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-300 overflow-hidden">
          <div className="h-1 bg-purple-500"></div>
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Average Sale Value
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(averageSaleValue || 0)}
                </div>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 text-sm font-medium text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Based on {totalSales} transactions
          </div>
        </div>
      </div>

      {/* Sales Trend Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all duration-300 overflow-hidden">
        <div className="h-1 bg-amber-500"></div>
        <div className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Sales Trend
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {avgTrend >= 0 ? "+" : ""}
                {avgTrend.toFixed(1)}%
              </div>
            </div>
            <div
              className={`p-2.5 rounded-lg ${
                avgTrend >= 0 ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 text-sm font-medium text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            Average period-over-period growth
          </div>
        </div>
      </div>
    </div>
    </div>

      {/* Main Sales Graph - Fixed to ensure proper scaling */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 border border-gray-100">
        <h3 className="text-lg font-medium mb-4 text-gray-800">
          Sales Performance
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={getCombinedData()}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey={getXAxisKey()}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#9ca3af" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#2BA697"
              tickFormatter={(value) => formatYAxisValue(value)}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, "auto"]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#0E60B6"
              tickFormatter={(value) => formatYAxisValue(value)}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, getMaxRevenue()]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
              formatter={(value, name) => {
                if (name === "Revenue" || name === "Previous Revenue")
                  return [formatCurrency(value), name];
                return [value.toLocaleString(), name];
              }}
              labelFormatter={(label) => {
                return `Period: ${label}`;
              }}
            />
            <Legend />
            <defs>
              <linearGradient id="colorNob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2BA697" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2BA697" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorPrevNob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0E60B6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0E60B6" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorPrevAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            {/* Current period bars */}
            <Bar
              yAxisId="left"
              dataKey="nob"
              name="Number of Sales"
              fill="url(#colorNob)"
              radius={[4, 4, 0, 0]}
              barSize={comparisonMode ? 10 : 20}
            />

            {/* Previous period bars (only shown in comparison mode) */}
            {comparisonMode && (
              <Bar
                yAxisId="left"
                dataKey="prevNob"
                name="Previous Number of Sales"
                fill="url(#colorPrevNob)"
                radius={[4, 4, 0, 0]}
                barSize={10}
                opacity={0.7}
              />
            )}

            {/* Current period line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="grossAmount"
              name="Revenue"
              stroke="#0E60B6"
              strokeWidth={3}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />

            {/* Previous period line (only shown in comparison mode) */}
            {comparisonMode && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="prevGrossAmount"
                name="Previous Revenue"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 1 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend Analysis */}
        <div className="bg-white  p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Revenue Trend Analysis
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey={getXAxisKey()}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) =>
                  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
                }
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                //   formatter={(value) => [`${value >= 0 ? '+' : ''}${value?.toFixed(2)}%`, 'Growth Rate']}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Growth Rate"
                dot={{
                  stroke: (entry) =>
                    entry.trend >= 0
                      ? TREND_COLORS.positive
                      : TREND_COLORS.negative,
                  strokeWidth: 2,
                  r: 4,
                  fill: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="grossAmount"
                stroke="#10B981"
                strokeWidth={2}
                name="Revenue"
                yAxisId={1}
                dot={{ r: 0 }}
                activeDot={{ r: 4 }}
              />
              <YAxis
                yAxisId={1}
                orientation="right"
                tickFormatter={formatYAxisValue}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Performance Metrics */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Performance Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600 mb-1">
                Best Performing{" "}
                {activeTab === "daily"
                  ? "Day"
                  : activeTab === "monthly"
                  ? "Month"
                  : "Year"}
              </div>
              <div className="text-xl font-bold text-gray-800">
                {highestPerforming?.[getXAxisKey()] || "N/A"}
              </div>
              <div className="text-lg font-semibold text-green-600 mt-1">
                {formatCurrency(highestPerforming?.grossAmount || 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {highestPerforming?.nob || 0} sales
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-red-600 mb-1">
                Lowest Performing{" "}
                {activeTab === "daily"
                  ? "Day"
                  : activeTab === "monthly"
                  ? "Month"
                  : "Year"}
              </div>
              <div className="text-xl font-bold text-gray-800">
                {lowestPerforming?.[getXAxisKey()] || "N/A"}
              </div>
              <div className="text-lg font-semibold text-red-600 mt-1">
                {formatCurrency(lowestPerforming?.grossAmount || 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {lowestPerforming?.nob || 0} sales
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg md:col-span-2">
              <div className="text-sm font-medium text-purple-600 mb-2">
                Top Performers
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500">
                        {activeTab === "daily"
                          ? "Date"
                          : activeTab === "monthly"
                          ? "Month"
                          : "Year"}
                      </th>
                      <th className="text-right text-xs font-medium text-gray-500">
                        Sales
                      </th>
                      <th className="text-right text-xs font-medium text-gray-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPerformers.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2 text-sm font-medium">
                          {item[getXAxisKey()]}
                        </td>
                        <td className="py-2 text-sm text-right">{item.nob}</td>
                        <td className="py-2 text-sm text-right">
                          {formatCurrency(item.grossAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Volume Chart */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Sales Volume
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={getDisplayData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey={getXAxisKey()}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value) => [value.toLocaleString(), "Sales"]}
              />
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="nob"
                name="Number of Sales"
                fill="url(#colorSales)"
                radius={[4, 4, 0, 0]}
              />
              {comparisonMode && (
                <Bar
                  dataKey="nob"
                  data={getPreviousData()}
                  name="Previous Period"
                  fill="rgba(251, 191, 36, 0.6)"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales vs. Revenue Comparison */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Sales to Revenue Ratio
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="nob"
                name="Sales Volume"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                label={{
                  value: "Sales Volume",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                type="number"
                dataKey="grossAmount"
                name="Revenue"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                label={{ value: "Revenue", angle: -90, position: "insideLeft" }}
                tickFormatter={formatYAxisValue}
              />
              {/* <Tooltip 
        cursor={{ strokeDasharray: '3 3' }}
        contentStyle={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}
      /> */}
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Sales-Revenue Correlation"
                data={getEnhancedDisplayData()}
                fill="#8884d8"
                shape="circle"
              >
                {getEnhancedDisplayData()?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Growth Tracking */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">
          Revenue Growth Tracking
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={getDisplayData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey={getXAxisKey()}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatYAxisValue}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, getMaxRevenue()]}

              // domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
              // allowDataOverflow={true}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
              formatter={(value, name) => {
                if (name === "Revenue") return [formatCurrency(value), name];
                if (name === "Growth %") return [`${value.toFixed(2)}%`, name];
                return [value.toLocaleString(), name];
              }}
            />
            <Legend />
            <defs>
              <linearGradient
                id="colorAmountGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="grossAmount"
              name="Revenue"
              fill="url(#colorAmountGradient)"
              stroke="#3b82f6"
              fillOpacity={0.6}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trend"
              name="Growth %"
              stroke="#10B981"
              strokeWidth={2}
              dot={{
                r: 4,
                stroke: "#10B981",
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <span>
            {isLoading ? 'Loading data...' : `Data loaded successfully`}
          </span>
          <span>
            Last updated: {new Date().toLocaleString()}
          </span>
        </div> */}
    </div>
  );
};

export default SalesOverView;
