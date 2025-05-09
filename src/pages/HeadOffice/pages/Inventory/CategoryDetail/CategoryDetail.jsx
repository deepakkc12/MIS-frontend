import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { getRequest } from '../../../../../services/apis/requests';
import MainLayout from '../../../Layout/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductGroups from './components/Group';
import BrandDetails from './components/Brands';
import VendorsSection from './components/Vendors';
import LoaderSpinner from '../../../../../components/Elements/LoaderSpinner';

const CategoryDetailedView = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  const [searchParams] = useSearchParams();

  const category_code = searchParams.get("code");

  const navigate = useNavigate()

  const [comparisonType, setComparisonType] = useState('amount');

  const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await getRequest(`inventory/category-details/?category=${category_code}`);
        setCategoryData(response.data);
      } catch (err) {
        setError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category_code]);

  if (loading) {
    return (
    <LoaderSpinner/>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-xl font-bold text-red-500 mb-2">Error Loading Data</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return null;
  }

  const { 
    Name, 
    refCode, 
    groups, 
    brands, 
    recentVendors, 
    recentVendorsWhoPaidWithouClearingStock,
    GroupNbrandWiseSalesThisMonth,
    GroupNbrandWiseSalesPrevMonth
  } = categoryData;

  // Format sales data for charts
  const formatSalesData = (currentData, prevData) => {
    const groupNames = [...new Set([
      ...currentData.map(item => item.groupName),
      ...prevData.map(item => item.groupName)
    ])];
  
    return groupNames.map(groupName => {
      const currentGroupData = currentData.filter(item => item.groupName === groupName);
      const prevGroupData = prevData.filter(item => item.groupName === groupName);
  
      // Sum total values for current and previous data
      const totalCurrentAmount = currentGroupData.reduce((sum, item) => sum + parseFloat(item.totalGrossAmt || 0), 0);
      const totalCurrentQty = currentGroupData.reduce((sum, item) => sum + parseFloat(item.TotalQtySold || 0), 0);
      const totalCurrentCogs = currentGroupData.reduce((sum, item) => sum + parseFloat(item.totalCogs || 0), 0);
  
      const totalPrevAmount = prevGroupData.reduce((sum, item) => sum + parseFloat(item.totalGrossAmt || 0), 0);
      const totalPrevQty = prevGroupData.reduce((sum, item) => sum + parseFloat(item.TotalQtySold || 0), 0);
      const totalPrevCogs = prevGroupData.reduce((sum, item) => sum + parseFloat(item.totalCogs || 0), 0);
  
      // Calculate growth percentages
      const amountGrowth = totalPrevAmount > 0
        ? (((totalCurrentAmount - totalPrevAmount) / totalPrevAmount) * 100).toFixed(2)
        : 0;
  
      const qtyGrowth = totalPrevQty > 0
        ? (((totalCurrentQty - totalPrevQty) / totalPrevQty) * 100).toFixed(2)
        : 0;
  
      return {
        groupName,
        ProductGroupCode:currentGroupData[0].ProductGroupCode,
        currentMonthAmount: totalCurrentAmount.toFixed(2),
        currentMonthQty: totalCurrentQty,
        prevMonthAmount: totalPrevAmount.toFixed(2),
        prevMonthQty: totalPrevQty,
        amountGrowth: parseFloat(amountGrowth),
        qtyGrowth: parseFloat(qtyGrowth),
        currentMonthCogs: totalCurrentCogs.toFixed(2),
        prevMonthCogs: totalPrevCogs.toFixed(2),
      };
    });
  };
  
  // Process vendor data to group by vendor name
  const processVendorData = () => {
    const allVendors = [...recentVendors, ...recentVendorsWhoPaidWithouClearingStock];
    const vendorMap = {};

    allVendors.forEach(vendor => {
      if (!vendorMap[vendor.VENDOR]) {
        vendorMap[vendor.VENDOR] = {
          name: vendor.VENDOR,
          code:vendor.VENDORLEDGERCODE,
          totalBillQty: 0,
          totalContribQty: 0,
          totalBalanceQty: 0,
          totalStock: 0,
          totalInvoiceAmount: 0,
          lastPurchaseDate: null,
          items: [],
          isPaid: false,
          invoices: new Set()
        };
      }

      // Check if this vendor is in the paid list
      const isPaidVendor = recentVendorsWhoPaidWithouClearingStock.some(
        paid => paid.VENDORLEDGERCODE === vendor.VENDORLEDGERCODE && paid.INVOICENO === vendor.INVOICENO
      );

      vendorMap[vendor.VENDOR].totalBillQty += parseFloat(vendor.BillQty || 0);
      vendorMap[vendor.VENDOR].totalContribQty += parseFloat(vendor.ContribQty || 0);
      vendorMap[vendor.VENDOR].totalBalanceQty += parseFloat(vendor.BalanceQty || 0);
      vendorMap[vendor.VENDOR].totalStock += parseFloat(vendor.STOCK || 0);
      vendorMap[vendor.VENDOR].isPaid = vendorMap[vendor.VENDOR].isPaid || isPaidVendor;
      vendorMap[vendor.VENDOR].invoices.add(vendor.INVOICENO);
      
      // Track invoice amount
      if (!isNaN(parseFloat(vendor.INVOICEAMOUNT))) {
        vendorMap[vendor.VENDOR].totalInvoiceAmount += parseFloat(vendor.INVOICEAMOUNT);
      }
      
      // Track last purchase date
      const vendorDate = new Date(vendor.DOT);
      if (!vendorMap[vendor.VENDOR].lastPurchaseDate || vendorDate > vendorMap[vendor.VENDOR].lastPurchaseDate) {
        vendorMap[vendor.VENDOR].lastPurchaseDate = vendorDate;
      }

      // Add item if not already in the list
      const existingItemIndex = vendorMap[vendor.VENDOR].items.findIndex(item => item.skuName === vendor.skuName);
      if (existingItemIndex === -1) {
        vendorMap[vendor.VENDOR].items.push({
          skuName: vendor.skuName,
          qty: parseFloat(vendor.ContribQty || 0),
          stock: parseFloat(vendor.STOCK || 0)
        });
      } else {
        // Update quantities if item exists
        vendorMap[vendor.VENDOR].items[existingItemIndex].qty += parseFloat(vendor.ContribQty || 0);
        vendorMap[vendor.VENDOR].items[existingItemIndex].stock += parseFloat(vendor.STOCK || 0);
      }
    });

    // Convert Set to array for invoices
    Object.values(vendorMap).forEach(vendor => {
      vendor.invoices = Array.from(vendor.invoices);
      vendor.invoiceCount = vendor.invoices.length;
    });

    return Object.values(vendorMap).sort((a, b) => b.lastPurchaseDate - a.lastPurchaseDate);
  };

  // Formatting and summarizing data for brands
  const formatBrandData = () => {
    const brandMap = {};
    
    // Initialize with brand names from brands array
    brands?.forEach(brand => {
      brandMap[brand.BrandName] = {
        name: brand.BrandName,
        code: brand.brandCode,
        currentMonthSales: 0,
        prevMonthSales: 0,
        currentMonthQty: 0,
        prevMonthQty: 0,
        growth: 0
      };
    });
    
    // Add current month sales
    GroupNbrandWiseSalesThisMonth.forEach(item => {
      if (brandMap[item.brandName]) {
        brandMap[item.brandName].currentMonthSales += parseFloat(item.totalGrossAmt || 0);
        brandMap[item.brandName].currentMonthQty += parseFloat(item.TotalQtySold || 0);
      }
    });
    
    // Add previous month sales
    GroupNbrandWiseSalesPrevMonth.forEach(item => {
      if (brandMap[item.brandName]) {
        brandMap[item.brandName].prevMonthSales += parseFloat(item.totalGrossAmt || 0);
        brandMap[item.brandName].prevMonthQty += parseFloat(item.TotalQtySold || 0);
      }
    });
    
    // Calculate growth percentages
    Object.values(brandMap).forEach(brand => {
      brand.growth = brand.prevMonthSales > 0 
        ? ((brand.currentMonthSales - brand.prevMonthSales) / brand.prevMonthSales * 100).toFixed(2)
        : 0;
    });
    
    return Object.values(brandMap).sort((a, b) => b.currentMonthSales - a.currentMonthSales);
  };

  const generateSalesTrendData = () => {
    const thisMonthTotal = GroupNbrandWiseSalesThisMonth.reduce(
      (sum, item) => sum + parseFloat(item.totalGrossAmt || 0), 0
    );
    
    const prevMonthTotal = GroupNbrandWiseSalesPrevMonth.reduce(
      (sum, item) => sum + parseFloat(item.totalGrossAmt || 0), 0
    );
    
    return [
      { period: 'Previous Month', amount: prevMonthTotal },
      { period: 'Current Month', amount: thisMonthTotal }
    ];
  };

  // Summary metrics calculations
  const calculateSummaryMetrics = () => {
    const thisMonthTotalSales = GroupNbrandWiseSalesThisMonth.reduce(
      (sum, item) => sum + parseFloat(item.totalGrossAmt || 0), 0
    );
    
    const prevMonthTotalSales = GroupNbrandWiseSalesPrevMonth.reduce(
      (sum, item) => sum + parseFloat(item.totalGrossAmt || 0), 0
    );
    
    const thisMonthTotalQty = GroupNbrandWiseSalesThisMonth.reduce(
      (sum, item) => sum + parseFloat(item.TotalQtySold || 0), 0
    );
    
    const prevMonthTotalQty = GroupNbrandWiseSalesPrevMonth.reduce(
      (sum, item) => sum + parseFloat(item.TotalQtySold || 0), 0
    );
    
    const salesGrowth = prevMonthTotalSales > 0 
      ? ((thisMonthTotalSales - prevMonthTotalSales) / prevMonthTotalSales * 100).toFixed(2)
      : 0;
    
    const qtyGrowth = prevMonthTotalQty > 0
      ? ((thisMonthTotalQty - prevMonthTotalQty) / prevMonthTotalQty * 100).toFixed(2)
      : 0;
      
    return {
      thisMonthTotalSales,
      prevMonthTotalSales,
      thisMonthTotalQty,
      prevMonthTotalQty,
      salesGrowth,
      qtyGrowth
    };
  };

  const salesData = formatSalesData(GroupNbrandWiseSalesThisMonth, GroupNbrandWiseSalesPrevMonth);
  const vendorData = processVendorData();
  const brandData = formatBrandData();
  const trendData = generateSalesTrendData();
  const summaryMetrics = calculateSummaryMetrics();

  // Format currency

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  // Helper function for growth indicators
  const renderGrowthIndicator = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) {
      return <span className="text-green-500 flex items-center"><span className="mr-1">▲</span>{numValue}%</span>;
    } else if (numValue < 0) {
      return <span className="text-red-500 flex items-center"><span className="mr-1">▼</span>{Math.abs(numValue)}%</span>;
    } else {
      return <span className="text-gray-500">0%</span>;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout>
    <div className="bg-gray-50 rounded-xl min-h-screen pb-12">
      {/* Header */}
    {/* Enhanced Header with Gradient */}
<div className="bg-white rounded-xl shadow-sm">
  <div className="max-w-7xl mx-auto px-4  py-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">{Name} <span className="text-gray-500">({refCode})</span></h1>
          <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Category Analytics</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Detailed analysis of sales, inventory, and vendor data
        </p>
      </div>
    </div>
  </div>
</div>

{/* Improved Summary Cards */}
<div className='space-y-3 mt-3'>
<div className=" px-4 ">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-3 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Current Month Sales
              </dt>
              <dd className="flex items-baseline mt-1">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summaryMetrics.thisMonthTotalSales)}
                </div>
                <div className="ml-2">
                  {renderGrowthIndicator(summaryMetrics.salesGrowth)}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Units Sold This Month
              </dt>
              <dd className="flex items-baseline mt-1">
                <div className="text-2xl font-bold text-gray-900">
                  {summaryMetrics.thisMonthTotalQty.toFixed(0)}
                </div>
                <div className="ml-2">
                  {renderGrowthIndicator(summaryMetrics.qtyGrowth)}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Active Brands
              </dt>
              <dd className="flex items-baseline mt-1">
                <div className="text-2xl font-bold text-gray-900">
                  {brands.length}
                </div>
                <div className="ml-2 text-sm text-gray-500">
                  brands in {groups.length} groups
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl p-3 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Recent Vendors
              </dt>
              <dd className="flex items-baseline mt-1">
                <div className="text-2xl font-bold text-gray-900">
                  {vendorData.length}
                </div>
                <div className="ml-2 text-sm text-gray-500">
                  {vendorData.filter(v => v.isPaid).length} with pending inventory
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Modern Tabs */}
<div className="max-w-7xl mx-auto px-4 ">
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
    <nav className="flex space-x-2">
      <button
        onClick={() => setActiveTab('sales')}
        className={`${
          activeTab === 'sales'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
      >
        <svg className={`mr-2 h-4 w-4 ${activeTab === 'sales' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Sales Analysis
      </button>
      <button
        onClick={() => setActiveTab('groups')}
        className={`${
          activeTab === 'groups'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
      >
        <svg className={`mr-2 h-4 w-4 ${activeTab === 'groups' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Product Groups
      </button>
      <button
        onClick={() => setActiveTab('brands')}
        className={`${
          activeTab === 'brands'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
      >
        <svg className={`mr-2 h-4 w-4 ${activeTab === 'brands' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Brands Performance
      </button>
      <button
        onClick={() => setActiveTab('vendors')}
        className={`${
          activeTab === 'vendors'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        } rounded-lg py-2.5 px-4 font-medium text-sm transition-all duration-200 flex items-center`}
      >
        <svg className={`mr-2 h-4 w-4 ${activeTab === 'vendors' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Vendors
      </button>
    </nav>
  </div>
</div>
</div>
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4  mt-3">
        {/* Sales Analysis Tab */}
        {/* Sales Analysis Tab */}
{activeTab === 'sales' && (
  <div className="space-y-8">
    {/* Sales Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Sales Comparison */}
     {/* Monthly Sales Overview */}
<div className="bg-white shadow rounded-lg p-6">
  <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Sales Overview</h2>
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-sm text-gray-500">Current vs Previous Month</p>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {formatCurrency(summaryMetrics.thisMonthTotalSales)}
        </p>
        <p className="ml-2 text-sm text-gray-500">
          vs {formatCurrency(summaryMetrics.prevMonthTotalSales)}
        </p>
      </div>
    </div>
    <div className="bg-gray-50 rounded-full p-3">
      {renderGrowthIndicator(summaryMetrics.salesGrowth)}
    </div>
  </div>
  <div className="h-44">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis dataKey="period" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} hide />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      {/* Units Sold Comparison */}
      {/* Units Sold Overview */}
<div className="bg-white shadow rounded-lg p-6">
  <h2 className="text-lg font-medium text-gray-900 mb-4">Units Sold Overview</h2>
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-sm text-gray-500">Current vs Previous Month</p>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {summaryMetrics.thisMonthTotalQty.toFixed(0)}
        </p>
        <p className="ml-2 text-sm text-gray-500">
          vs {summaryMetrics.prevMonthTotalQty.toFixed(0)}
        </p>
      </div>
    </div>
    <div className="bg-gray-50 rounded-full p-3">
      {renderGrowthIndicator(summaryMetrics.qtyGrowth)}
    </div>
  </div>
  <div className="h-44">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[
        { period: 'Previous Month', amount: summaryMetrics.prevMonthTotalQty },
        { period: 'Current Month', amount: summaryMetrics.thisMonthTotalQty }
      ]}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis dataKey="period" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} hide />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>

   
    {/* <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Group Performance</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setComparisonType('amount')}
            className={`px-3 py-1 text-sm rounded-md ${
              comparisonType === 'amount' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Revenue
          </button>
          <button 
            onClick={() => setComparisonType('quantity')}
            className={`px-3 py-1 text-sm rounded-md ${
              comparisonType === 'quantity' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Quantity
          </button>
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={salesData.sort((a, b) => 
              comparisonType === 'amount' 
                ? b.currentMonthAmount - a.currentMonthAmount
                : b.currentMonthQty - a.currentMonthQty
            )}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="groupName" 
              angle={-45} 
              textAnchor="end" 
              tick={{ fontSize: 12 }}
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => comparisonType === 'amount' 
                ? `₹${(value / 1000).toFixed(0)}K` 
                : value.toFixed(0)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 20 }} />
            <Bar 
              dataKey={comparisonType === 'amount' ? "currentMonthAmount" : "currentMonthQty"} 
              name="Current Month" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey={comparisonType === 'amount' ? "prevMonthAmount" : "prevMonthQty"} 
              name="Previous Month" 
              fill="#94A3B8" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
     */}
    {/* Growth Analysis */}
  

    {/* Sales Distribution */}
  
  </div>
)}
                      
        {activeTab === 'groups' && (
            <ProductGroups salesData={salesData} comparisonType={comparisonType} onViewDetails={(gp)=>{navigate(`/inventory/group-details/${gp.ProductGroupCode}`)}}/>
          )}
          
          {/* Brands Tab */}
          {activeTab === 'brands' && (
       <BrandDetails brandData={brandData} comparisonType={comparisonType} onViewDetails={()=>{}}/>
          )}
          
          {/* Vendors Tab */}
          {activeTab === 'vendors' && (
            <VendorsSection vendorData={vendorData} />
          )}
        </div>
      </div>
      </MainLayout>
    );
  };
  
  export default CategoryDetailedView;