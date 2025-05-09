import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';

const SkuSummeryAnalatycals = ({selectedGroup,groupName,skuPassedData}) => {

    const [skuData,setSkuData] = useState([])

    useEffect(()=>{
      const items = transformSkuData(skuPassedData)
      setSkuData(items)
      console.log(skuPassedData)
    },[skuPassedData])
  
  function transformSkuData(data) {
    return data.map(item => {
        const info = item.info;
        const prevSales = item.prevMonthSales[0] || {};
        const curSales = item.curMonthSale || {};
        const stockDetails = item.weakStockDetails || {};
        
        return {
            code: info.code,
            name: info.SkuName,
            brand: info.BrandName,
            currentQty: parseFloat(info.cQty),
            uom: info.uom,
            prevMonthSales: {
                qty: parseFloat(prevSales.Qty || 0),
                amount: parseFloat(prevSales.GrossAmt || 0),
                cogs: parseFloat(prevSales.COGS || 0)
            },
            curMonthSale: {
                qty: parseFloat(curSales.Qty || 0),
                amount: parseFloat(curSales.GrossAmt || 0),
                cogs: parseFloat(curSales.COGS || 0)
            },
            weeklyTrend: [
                parseFloat(stockDetails.D7 || 0),
                parseFloat(stockDetails.D6 || 0),
                parseFloat(stockDetails.D5 || 0),
                parseFloat(stockDetails.D4 || 0),
                parseFloat(stockDetails.D3 || 0),
                parseFloat(stockDetails.D2 || 0),
                parseFloat(stockDetails.D1 || 0)
            ],
            customerTiers: {
                L1: { choice: info.L1Choice, qty: parseFloat(info.L1ChoiceQty) },
                L2: { choice: info.L2Choice, qty: parseFloat(info.L2ChoiceQty) },
                L3: { choice: info.L3Choice, qty: parseFloat(info.L3ChoiceQty) },
                L4: { choice: info.L4Choice, qty: parseFloat(info.L4ChoiceQty) }
            }
        };
    });
}

  // Calculate aggregated data by brand
  const brandData = skuData.reduce((acc, item) => {
    if (!acc[item.brand]) {
      acc[item.brand] = {
        brand: item.brand,
        skuCount: 0,
        totalSales: 0,
        totalQty: 0,
        customerDistribution: { L1: 0, L2: 0, L3: 0, L4: 0 }
      };
    }
    
    acc[item.brand].skuCount += 1;
    acc[item.brand].totalSales += (item.prevMonthSales.amount + item.curMonthSale.amount);
    acc[item.brand].totalQty += (item.prevMonthSales.qty + item.curMonthSale.qty);
    
    // Add customer tier quantities
    acc[item.brand].customerDistribution.L1 += item.customerTiers.L1.qty;
    acc[item.brand].customerDistribution.L2 += item.customerTiers.L2.qty;
    acc[item.brand].customerDistribution.L3 += item.customerTiers.L3.qty;
    acc[item.brand].customerDistribution.L4 += item.customerTiers.L4.qty;
    
    return acc;
  }, {});
  
  const brandChartData = Object.values(brandData);
  
  // Format data for the sales trend chart
  const weeklySalesTrend = [
    { day: 'D1', sales: skuData.reduce((sum, item) => sum + item.weeklyTrend[6], 0) },
    { day: 'D2', sales: skuData.reduce((sum, item) => sum + item.weeklyTrend[5], 0) },
    { day: 'D3', sales: skuData.reduce((sum, item) => sum + item.weeklyTrend[4], 0) },
    { day: 'D4', sales: skuData.reduce((sum, item) => sum + item.weeklyTrend[3], 0) },
    { day: 'D5', sales: skuData.reduce((sum, item) => sum + item.weeklyTrend[2], 0) },
    { day: 'D6', sales: skuData.reduce((sum, item) => sum + item.weeklyTrend[1], 0) },
    { day: 'D7', sales: skuData.reduce((sum, item) => sum + item.weeklyTrend[0], 0) }
  ];
  
  // Customer tier distribution data for pie chart
  const customerDistribution = [
    { name: 'Tier 1 (Top)', value: skuData.reduce((sum, item) => sum + item.customerTiers.L1.qty, 0) },
    { name: 'Tier 2', value: skuData.reduce((sum, item) => sum + item.customerTiers.L2.qty, 0) },
    { name: 'Tier 3', value: skuData.reduce((sum, item) => sum + item.customerTiers.L3.qty, 0) },
    { name: 'Tier 4', value: skuData.reduce((sum, item) => sum + item.customerTiers.L4.qty, 0) }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Top selling products
  const topProducts = [...skuData].sort((a, b) => 
    (b.prevMonthSales.qty + b.curMonthSale.qty) - 
    (a.prevMonthSales.qty + a.curMonthSale.qty)
  ).slice(0, 3);

  const navigate = useNavigate()


  const headers =[
    {key:"name",label:"name",onColoumnClick:(v,r)=>{navigate(`/inventory/sku-details?sku=${r.code}`)}},
    {key:"brand",label:"brand"},
    {key:"currentQty",label:"currentQty"},
  ]
  if (!skuData || skuData.length === 0) {
    return (
      <div className="bg-white p-8 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <svg 
            className="mx-auto h-24 w-24 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No SKUs Found</h3>
          <p className="mt-2 text-base text-gray-500">
            There are no SKUs available for {groupName || 'this group'} at the moment.
          </p>
          <div className="mt-6">
            {/* <button
              onClick={() => navigate('/inventory')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Inventory
            </button> */}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-2">
      <h1 className="text-2xl font-bold mb-6">{groupName} Group Analysis</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500">Total SKUs</h3>
          <p className="text-2xl font-bold">{skuData.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500">Total Sales (Current Month)</h3>
          <p className="text-2xl font-bold">₹{skuData.reduce((sum, item) => sum + item.curMonthSale.amount, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500">Total Sales (Previous Month)</h3>
          <p className="text-2xl font-bold">₹{skuData.reduce((sum, item) => sum + item.prevMonthSales.amount, 0).toFixed(2)}</p>
        </div><div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-500">Total Quantity Sold</h3>
          <p className="text-2xl font-bold">{skuData.reduce((sum, item) => sum + item.prevMonthSales.qty + item.curMonthSale.qty, 0)}</p>
        </div>
      </div>
      
      {/* Brand Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Brand Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" name="Total Sales (₹)" fill="#8884d8" />
                <Bar dataKey="totalQty" name="Quantity Sold" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Customer Tier Distribution</h3>
          <div className="flex items-center">
            <div className="w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2">
              <h4 className="font-semibold mb-2">Customer Tiers</h4>
              <p className="text-sm">Tier 1: Top customers</p>
              <p className="text-sm">Tier 2: High-value customers</p>
              <p className="text-sm">Tier 3: Regular customers</p>
              <p className="text-sm">Tier 4: Occasional customers</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly Sales Trend */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Sales Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySalesTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" name="Daily Sales (Qty)" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Products & SKU List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <ul className="divide-y">
            {topProducts.map((product, index) => (
              <li key={product.code} className="py-2">
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.brand} - {product.prevMonthSales.qty + product.curMonthSale.qty} units sold</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md md:col-span-2">
          <div className="overflow-x-auto">
            <TableLayout title='SKU List' headers={headers} data={skuData} />
          </div>
        </div>
      </div>
      
      {/* SKU Detail View */}
      {/* {selectedSku && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">SKU Details</h2>
            <button 
              onClick={() => setSelectedSku(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
         <SkuDetailView sku={selectedSku} /> 
        </div>
      )} */}
    </div>
  );
};

export default SkuSummeryAnalatycals;