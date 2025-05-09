import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getRequest } from "../../../../../../services/apis/requests";
import MainLayout from "../../../../Layout/Layout";
import DamageCartPayments from "../../../../Dashboard/Dashboard";
import PurchaseAnalysis from "./Components/PurchaseANalysisi";
import { useNavigate, useParams } from "react-router-dom";
import GroupsBrandsAnalysis from "./Components/GroupNBrandAnalysys";
import LoaderSpinner from "../../../../../../components/Elements/LoaderSpinner";

const VendorDashboard = () => {
  // State for data and UI
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("groupsbrands");
  const [error, setError] = useState(null);

  const { code } = useParams();

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRequest(
          `inventory/vendor-details/?vendor=${code}`
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load vendor data");
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  // Helper functions for data analysis
  const getVendorName = () => {
    if (
      !data ||
      !data.sku_recent_purchase_details ||
      data.sku_recent_purchase_details.length === 0
    ) {
      return "Unknown Vendor";
    }
    return data.sku_recent_purchase_details[0].VENDOR;
  };

  const getVendorCode = () => {
    if (
      !data ||
      !data.sku_recent_purchase_details ||
      data.sku_recent_purchase_details.length === 0
    ) {
      return "Unknown";
    }
    return data.sku_recent_purchase_details[0].VENDORLEDGERCODE;
  };

  const getTotalInvoiceAmount = () => {
    if (!data || !data.sku_recent_purchase_details) return 0;

    const invoices = new Set();
    let totalAmount = 0;

    data.sku_recent_purchase_details.forEach((item) => {
      if (!invoices.has(item.INVOICENO)) {
        invoices.add(item.INVOICENO);
        totalAmount += parseFloat(item.INVOICEAMOUNT);
      }
    });

    return totalAmount.toFixed(2);
  };

  const getUniqueInvoices = () => {
    if (!data || !data.sku_recent_purchase_details) return [];

    const invoiceMap = new Map();

    data.sku_recent_purchase_details.forEach((item) => {
      if (!invoiceMap.has(item.INVOICENO)) {
        invoiceMap.set(item.INVOICENO, {
          invoiceNo: item.INVOICENO,
          date: new Date(item.DOT).toLocaleDateString(),
          amount: parseFloat(item.INVOICEAMOUNT),
          rawDate: new Date(item.DOT),
        });
      }
    });

    return Array.from(invoiceMap.values()).sort(
      (a, b) => b.rawDate - a.rawDate
    );
  };

  const getCategoryBreakdown = () => {
    if (!data || !data.groups) return [];

    const categories = {};
    data.groups.forEach((group) => {
      if (!categories[group.Category]) {
        categories[group.Category] = {
          name: group.Category,
          count: 1,
        };
      } else {
        categories[group.Category].count += 1;
      }
    });

    return Object.values(categories);
  };

  const getBrandAnalysis = () => {
    if (!data || !data.brands || !data.groups) return [];

    const brands = data.brands.map((brand) => {
      const group = data.groups.find((g) => g.Code === brand.ProductGroupCode);
      const productCount = data.sku_recent_purchase_details.filter((item) =>
        item.SkuName.includes(brand.BrandName)
      ).length;

      return {
        brandName: brand.BrandName,
        brandCode: brand.BrandCode,
        groupName: group ? group.Name : "Unknown",
        category: group ? group.Category : "Unknown",
        productCount,
      };
    });

    return brands.filter((b) => b.productCount > 0);
  };

  const getStockAnalysis = () => {
    if (!data || !data.paid_with_pending_sku_stock) return [];

    return data.paid_with_pending_sku_stock.map((item) => ({
      name: item.SkuName,
      balanceQty: parseFloat(item.BalanceQty),
      stock: parseFloat(item.STOCK),
      billQty: parseFloat(item.BillQty),
    }));
  };

  const getDamageAnalysis = () => {
    if (!data || !data.purchase_details_with_pending_damege_cart_entrys)
      return [];

    return data.purchase_details_with_pending_damege_cart_entrys.map(
      (item) => ({
        qty: parseFloat(item.Qty),
        mrpValue: parseFloat(item.MrpValue),
        age: item.Age,
        purchaseAfter: parseFloat(item.purchaseAfter),
      })
    );
  };

  const getTotalStock = () => {
    if (!data || !data.paid_with_pending_sku_stock) return 0;

    return data.paid_with_pending_sku_stock.reduce(
      (total, item) => total + parseFloat(item.STOCK),
      0
    );
  };

  const getTotalPendingStock = () => {
    if (!data || !data.paid_with_pending_sku_stock) return 0;

    return data.paid_with_pending_sku_stock.reduce(
      (total, item) => total + parseFloat(item.BalanceQty),
      0
    );
  };

  const navigate = useNavigate()

  // If still loading, show loading indicator
  if (loading) {
    return (
    <LoaderSpinner/>
    );
  }

  // If there was an error loading the data
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  // If no data was found
  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">No vendor data available</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 rounded-xl min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button 
        onClick={() => navigate('/inventory/vendors')} 
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium mt-2 md:mt-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        View All Vendors
      </button>
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {getVendorName()}
        </h1>
        <p className="text-gray-500 text-sm">Vendor Code: {getVendorCode()}</p>
      </div>
      
      
    </div>
    
    <div className="flex gap-3 mt-4 md:mt-0">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 transition-all hover:shadow-sm">
        <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          Total Invoices
        </div>
        <div className="text-xl font-bold text-gray-800">
          {getUniqueInvoices().length}
        </div>
      </div>
      <div className="bg-green-50 p-3 rounded-lg border border-green-100 transition-all hover:shadow-sm">
        <div className="text-xs text-green-600 font-medium uppercase tracking-wide">
          Total Amount
        </div>
        <div className="text-xl font-bold text-gray-800">
          ₹{getTotalInvoiceAmount()}
        </div>
      </div>
    </div>
  </div>

  {/* Tabs - Refined */}
  <div className="mt-6">
    <nav className="flex flex-wrap gap-2 md:gap-1 border-b border-gray-200">
      <button
        onClick={() => setActiveTab("groupsbrands")}
        className={`px-4 py-3 font-medium text-sm transition-all relative ${
          activeTab === "groupsbrands"
            ? "text-blue-600" 
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Groups & Brands
        {activeTab === "groupsbrands" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
        )}
      </button>
      <button
        onClick={() => setActiveTab("purchase")}
        className={`px-4 py-3 font-medium text-sm transition-all relative ${
          activeTab === "purchase"
            ? "text-blue-600" 
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Purchase Analysis
        {activeTab === "purchase" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
        )}
      </button>
      <button
        onClick={() => setActiveTab("damage")}
        className={`px-4 py-3 font-medium text-sm transition-all relative ${
          activeTab === "damage"
            ? "text-blue-600" 
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Damage Analysis
        {activeTab === "damage" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
        )}
      </button>
    </nav>
  </div>
</div>
        {/* Tab Content */}
        <div className="p-1">
          {/* Purchase Analysis Tab */}
          {activeTab === "purchase" && <PurchaseAnalysis data={data} />}

          {activeTab === "groupsbrands" && <GroupsBrandsAnalysis data={data} />}

          {/* Damage Analysis Tab */}
          {activeTab == "damage" && (
            <DamageCartPayments
              data={data?.purchase_details_with_pending_damege_cart_entrys}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default VendorDashboard;
