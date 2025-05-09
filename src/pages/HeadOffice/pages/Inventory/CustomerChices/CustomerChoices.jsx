import React, { useEffect, useState } from 'react';
import { getRequest } from '../../../../../services/apis/requests';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MainLayout from '../../../Layout/Layout';
import TableLayout from '../../../../../components/Table/TableLayout';
import { useNavigate } from 'react-router-dom';

const CustomerChoices = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("focus"); // focus, premium, comparison
  const [sortBy, setSortBy] = useState("focusScore"); // focusScore, l1PrefScore, premiumMix
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Total customers by segment
  const [totalSegmentCustomers, setTotalSegmentCustomers] = useState({
    l1Total: 0,
    l2Total: 0,
    l3Total: 0,
    l4Total: 0
  });
  
  // Colors
  const COLORS = {
    l1: "#4299e1", // blue
    l2: "#68d391", // green
    l3: "#fbd38d", // yellow
    l4: "#fc8181", // red
    premium: "#3182ce", // darker blue
    regular: "#e53e3e", // darker red
  };
  
  const FOCUS_COLORS = {
    "High Focus": "#48bb78", // green
    "Medium Focus": "#ecc94b", // yellow
    "Low Focus": "#f56565", // red
  };

  // Table headers
  const detailHeaders = [
    {key: "code", label: "Primary Code"}, 
    {key: "scannedCode", label: "Sub SKU Code"}, 
    {key: "PTC", label: "PTC"}, 
    {key: "SkuName", label: "Item Name"}, 
    {key: "PostedBy", label: "User"}, 
    {key: "cnt", label: "Count"}, 
    {key: "GroupName", label: "Group"}
  ];

  const navigate = useNavigate()
  
  const productHeaders = [
      {key: "GroupName", label: "Group"},
      {key: "BrandName", label: "Brand"},
    {key: "SkuName", label: "Product Name",onColumnClick:(v,r)=>{navigate(`/inventory/sku-details?sku=${r.code}`)}},

    {key: "L1Choice", label: "Premium Customers"},
    {key: "L1ChoiceQty", label: "Premium Customers Buyed Qty"},


    {key: "L2Choice", label: "Gold Customers"},
    {key: "L2ChoiceQty", label: "Gold Customers Buyed Qty"},
//    {key:"premium",label:"Premium Choices"},
//    {key:"gold",label:"Gold Choices"},

  ];

  const getData = async() => {
    setIsLoading(true);
    try {
      const response = await getRequest(`inventory/cLevel-choises/`);
      if(response.success){

        const newData = response.data.map(d => ({
            ...d,
            premium: (
              <span className="font-semibold text-indigo-600">
                {d.L1Choice} Customers - {d.L1ChoiceQty} Qty Purchased
              </span>
            ),
            L1Choice:<span className="font-semibold text-indigo-800">
            {d.L1Choice}
          </span>,
          L1ChoiceQty:<span className="font-semibold text-indigo-800">
          {d.L1ChoiceQty}
        </span>,

          L2Choice:<span className="font-semibold text-yellow-600">
          {d.L2Choice}
        </span>,
         L2ChoiceQty:<span className="font-semibold text-yellow-600">
         {d.L2ChoiceQty}
       </span>,
            gold: (
              <span className="font-semibold text-yellow-600">
                {d.L2Choice} Customers - {d.L2ChoiceQty} Qty Purchased
              </span>
            )
          }));
          
          
        setData(newData);

        calculateTotalSegmentCustomers(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalSegmentCustomers = (data) => {
    const totals = {
      l1Total: 0,
      l2Total: 0,
      l3Total: 0,
      l4Total: 0
    };
    
    data.forEach(item => {
      totals.l1Total += item.L1Choice || 0;
      totals.l2Total += item.L2Choice || 0;
      totals.l3Total += item.L3Choice || 0;
      totals.l4Total += item.L4Choice || 0;
    });
    
    setTotalSegmentCustomers(totals);
  };

  useEffect(() => {
    getData();
  }, []);

  // Process data to compute total quantities and aggregate by product group
  const processData = () => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => {
      const l1QtyNum = parseFloat(item.L1ChoiceQty || 0);
      const l2QtyNum = parseFloat(item.L2ChoiceQty || 0);
      const l3QtyNum = parseFloat(item.L3ChoiceQty || 0);
      const l4QtyNum = parseFloat(item.L4ChoiceQty || 0);
      
      const totalQty = l1QtyNum + l2QtyNum + l3QtyNum + l4QtyNum;
      const totalCustomers = item.L1Choice + item.L2Choice + item.L3Choice + item.L4Choice;
      
      // Premium customers (L1 + L2)
      const premiumCustomerQty = l1QtyNum + l2QtyNum;
      const premiumCustomerCount = item.L1Choice + item.L2Choice;
      const premiumMix = totalQty > 0 ? (premiumCustomerQty / totalQty) * 100 : 0;
      
      // Regular customers (L3 + L4)
      const regularCustomerQty = l3QtyNum + l4QtyNum;
      const regularCustomerCount = item.L3Choice + item.L4Choice;
      
      // Calculate average quantity per customer for each segment
      const l1AvgQty = item.L1Choice > 0 ? l1QtyNum / item.L1Choice : 0;
      const l2AvgQty = item.L2Choice > 0 ? l2QtyNum / item.L2Choice : 0;
      const l3AvgQty = item.L3Choice > 0 ? l3QtyNum / item.L3Choice : 0;
      const l4AvgQty = item.L4Choice > 0 ? l4QtyNum / item.L4Choice : 0;
      
      // Calculate L1 preference score (higher means more preferred by top customers)
      const l1PrefScore = totalQty > 0 ? (l1QtyNum / totalQty) * 100 : 0;
      
      // Premium preference score (L1 + L2)
      const premiumPrefScore = premiumMix;
      
      // Focus score: weighted score giving more importance to premium customers
      const focusScore = totalQty > 0 ? (l1QtyNum * 4 + l2QtyNum * 3 + l3QtyNum * 2 + l4QtyNum * 1) / totalQty : 0;
      
      // Premium to regular ratio (higher means more skewed to premium customers)
      const premiumToRegularRatio = regularCustomerQty > 0 ? premiumCustomerQty / regularCustomerQty : premiumCustomerQty;
      
      // L1 to L2 ratio (higher means more preferred by top-tier vs second-tier)
      const l1ToL2Ratio = l2QtyNum > 0 ? l1QtyNum / l2QtyNum : l1QtyNum;
      
      // Distribution data for charts
      const distributionData = [
        { name: 'L1', value: l1QtyNum, color: COLORS.l1 },
        { name: 'L2', value: l2QtyNum, color: COLORS.l2 },
        { name: 'L3', value: l3QtyNum, color: COLORS.l3 },
        { name: 'L4', value: l4QtyNum, color: COLORS.l4 },
      ];
      
      const segmentData = [
        { name: 'Premium', value: premiumCustomerQty, color: COLORS.premium },
        { name: 'Regular', value: regularCustomerQty, color: COLORS.regular },
      ];
      
      // Calculate focus category
      const focusCategory = l1PrefScore > 50 ? "High Focus" : l1PrefScore > 30 ? "Medium Focus" : "Low Focus";
      
      // Premium mix category
      const premiumMixCategory = premiumMix > 70 ? "Premium Dominant" : 
                                premiumMix > 50 ? "Premium Preferred" : 
                                premiumMix > 30 ? "Mixed Preference" : "Regular Dominant";
      
      return {
        ...item,
        totalQty,
        totalCustomers,
        premiumCustomerQty,
        premiumCustomerCount,
        regularCustomerQty,
        regularCustomerCount,
        l1AvgQty,
        l2AvgQty,
        l3AvgQty,
        l4AvgQty,
        l1PrefScore,
        premiumPrefScore,
        premiumMix,
        focusScore,
        premiumToRegularRatio,
        l1ToL2Ratio,
        distributionData,
        segmentData,
        focusCategory,
        premiumMixCategory,
        code: item.code || item.SkuCode || '',
        scannedCode: item.scannedCode || '',
        PTC: item.PTC || '',
        PostedBy: item.PostedBy || '',
        cnt: item.cnt || 0
      };
    });
  };
  
  const calculateGroupData = (data) => {
    const groups = {};
    
    data.forEach(item => {
      if (!groups[item.GroupName]) {
        groups[item.GroupName] = {
          GroupName: item.GroupName,
          totalQty: 0,
          totalCustomers: 0,
          l1QtyTotal: 0,
          l1CustomerTotal: 0,
          l2QtyTotal: 0,
          l2CustomerTotal: 0,
          l3QtyTotal: 0,
          l3CustomerTotal: 0,
          l4QtyTotal: 0,
          l4CustomerTotal: 0,
          items: [],
          topItems: [],
          distributionData: [],
          focusCategories: { "High Focus": 0, "Medium Focus": 0, "Low Focus": 0 }
        };
      }
      
      const group = groups[item.GroupName];
      const l1QtyNum = parseFloat(item.L1ChoiceQty || 0);
      const l2QtyNum = parseFloat(item.L2ChoiceQty || 0);
      const l3QtyNum = parseFloat(item.L3ChoiceQty || 0);
      const l4QtyNum = parseFloat(item.L4ChoiceQty || 0);
      
      group.totalQty += l1QtyNum + l2QtyNum + l3QtyNum + l4QtyNum;
      group.totalCustomers += item.L1Choice + item.L2Choice + item.L3Choice + item.L4Choice;
      group.l1QtyTotal += l1QtyNum;
      group.l1CustomerTotal += item.L1Choice;
      group.l2QtyTotal += l2QtyNum;
      group.l2CustomerTotal += item.L2Choice;
      group.l3QtyTotal += l3QtyNum;
      group.l3CustomerTotal += item.L3Choice;
      group.l4QtyTotal += l4QtyNum;
      group.l4CustomerTotal += item.L4Choice;
      group.items.push(item);
      
      // Count items in each focus category
      group.focusCategories[item.focusCategory]++;
    });
    
    // Calculate additional metrics for each group
    Object.values(groups).forEach(group => {
      group.premiumQty = group.l1QtyTotal + group.l2QtyTotal;
      group.regularQty = group.l3QtyTotal + group.l4QtyTotal;
      group.premiumPct = (group.premiumQty / group.totalQty) * 100;
      group.l1Pct = (group.l1QtyTotal / group.totalQty) * 100;
      
      // Distribution data for charts
      group.distributionData = [
        { name: 'L1', value: group.l1QtyTotal, color: COLORS.l1 },
        { name: 'L2', value: group.l2QtyTotal, color: COLORS.l2 },
        { name: 'L3', value: group.l3QtyTotal, color: COLORS.l3 },
        { name: 'L4', value: group.l4QtyTotal, color: COLORS.l4 },
      ];
      
      group.segmentData = [
        { name: 'Premium', value: group.premiumQty, color: COLORS.premium },
        { name: 'Regular', value: group.regularQty, color: COLORS.regular },
      ];
      
      // Find top 5 items by focusScore
      group.topItems = [...group.items]
        .sort((a, b) => b.focusScore - a.focusScore)
        .slice(0, 5);
    });
    
    return Object.values(groups);
  };
  
  const enrichedData = processData();
  const groupData = calculateGroupData(enrichedData);
  
  // Get the currently filtered/selected group data
  const selectedGroup = filter === "All" 
    ? { GroupName: "All Groups", items: enrichedData } 
    : groupData.find(g => g.GroupName === filter);
  
  // Sorting function
  const getSortedData = (data, sortKey, direction) => {
    return [...data].sort((a, b) => {
      if (direction === "asc") {
        return a[sortKey] - b[sortKey];
      } else {
        return b[sortKey] - a[sortKey];
      }
    });
  };
  
  // Filter and sort data based on selection
  const filteredData = filter === "All" 
    ? getSortedData(enrichedData, sortBy, sortDirection)
    : getSortedData(enrichedData.filter(item => item.GroupName === filter), sortBy, sortDirection);
  
  // Get unique group names for filter
  const groupNames = ["All", ...new Set(data.map(item => item.GroupName))];
  
  // Get top products by L1 and Premium
  const getTopProducts = (data, limit = 5) => {
    const byL1 = [...data].sort((a, b) => b.l1PrefScore - a.l1PrefScore).slice(0, limit);
    const byPremium = [...data].sort((a, b) => b.premiumMix - a.premiumMix).slice(0, limit);
    const byFocus = [...data].sort((a, b) => b.focusScore - a.focusScore).slice(0, limit);
    
    return { byL1, byPremium, byFocus };
  };
  
  const topProducts = getTopProducts(selectedGroup ? selectedGroup.items : []);
  
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("desc");
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
       <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-gray-600">Loading data...</div>
        </div>
      </MainLayout>
    );
  }
  
  // Count items in each focus category
  const focusCategoryCounts = {
    "High Focus": filteredData.filter(item => item.focusCategory === "High Focus").length,
    "Medium Focus": filteredData.filter(item => item.focusCategory === "Medium Focus").length,
    "Low Focus": filteredData.filter(item => item.focusCategory === "Low Focus").length
  };
  
  const focusCategoryData = Object.entries(focusCategoryCounts).map(([name, value]) => ({
    name,
    value,
    color: FOCUS_COLORS[name]
  }));
  
  // Prepare data for TableLayout
  const productSummaryData = filteredData.map(item => ({
    ...item,
    l1PrefScore: item.l1PrefScore,
    premiumMix: item.premiumMix,
    focusScore: item.focusScore,
    focusCategory: item.focusCategory
  }));
  
  const sortedProductSummary = getSortedData(productSummaryData, sortBy, sortDirection);
  
  return (
    <MainLayout>
    <div className="p-6 rounded-xl bg-gray-50 min-h-screen">

<TableLayout
title="Product Summary"
headers={productHeaders}
data={data}
loading={isLoading}
/>

</div>
</MainLayout>
);
};

export default CustomerChoices;