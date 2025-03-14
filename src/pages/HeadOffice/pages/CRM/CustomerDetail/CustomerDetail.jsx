import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign, Phone, ShoppingCart, User, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import MainLayout from '../../../Layout/Layout';
import MonthlySalesChart from './MonthWiseSale';
import { useParams } from 'react-router-dom';
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';
import BillingInfo from './BillingInfo';
import { formatCurrency, formatDate } from '../../../../../utils/helper';
import CustomerDetailsSkeleton from './LoadinSkeleton';
import CustomerAnalytics from './Analatycs';
import SalesTrendChart from './MonthWiseSale';

// Sample data - in a real application, this would come from your API



const CustomerDetails = () => {

    const [salesData,setSalesData] =useState( [  ]);

    const [customerData,setCustomerData] = useState({});
    
  const [activeTab, setActiveTab] = useState('overview');

  const {custCode} = useParams()

  const getSalesList = async()=>{
    const response =await getRequest(`crm/customer-sales-list/?customerCode=${custCode}`)
    if (response.success){
        const arrangedData = response.data.map(sales => ({
                    ...sales,
                    DOT: formatDate(sales.DOT)
                  }));
                  
        setSalesData(arrangedData)
    }
  }
  
  // Calculate analytics from the sales data
  const totalSales = salesData.reduce((sum, sale) => sum + Number(sale.GrossAmt), 0);
  const averageSale = totalSales / salesData.length;
  const lastSaleAmount = salesData[0]?.GrossAmt || 0;
  const lastSaleDate = salesData[0]?.DOT || 'N/A';


  const getCustomerDetails =async ()=>{
    const response = await getRequest(`crm/customer-details/?code=${custCode}`)
    if (response.success){
        setCustomerData(response.data)
    }

  }

  const [loading,setLoading] = useState(false)

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching starts
    
    // Create a promise for both data fetching operations
    const fetchData = async() => {
      await Promise.all([
        getCustomerDetails(),
        getSalesList()
      ]);
      setLoading(false); // Set loading to false when both operations complete
    };
    
    fetchData();
  }, [custCode]);
  
  const monthlySalesTrend = [
    { month: 'May', amount: 9800 },
    { month: 'Jun', amount: 6300.50 },
    { month: 'Jul', amount: 15200 },
    { month: 'Aug', amount: 8750.25 },
    { month: 'Sep', amount: 12500.75 },
    { month: 'May', amount: 9800 },
    { month: 'Jun', amount: 6300.50 },
    { month: 'Jul', amount: 15200 },
    { month: 'Aug', amount: 8750.25 },
    { month: 'Sep', amount: 12500.75 },
    { month: 'Aug', amount: 8750.25 },
    { month: 'Sep', amount: 12500.75 },
  ];


  const yearlySalesTrend = [
    {year:2022,amount:20000},
    {year:2023,amount:209000},
    {year:2024,amount:30000},
    {year:2024,amount:210000},
  ]



  const headers = [
    {key:'DOT',label:'date',style: (row)=>{
        if(Number(row.GrossAmt)>1000){
            return "bg-green-500 text-white "
        }
    }},
    {key:'InvoiceNo',label:'InvoiceNo',style: (row)=>{
        if(Number(row.GrossAmt)>1000){
            return "bg-green-500 text-white "
        }
    }},
    {key:'GrossAmt',label:'Amount',style: (row)=>{
        if(Number(row.GrossAmt)>1000){
            return "bg-green-500 text-white "
        }
    }},

  ]


  // Find the highest month
  const highestMonth = [...monthlySalesTrend].sort((a, b) => b.amount - a.amount)[0];
  
  // Find the lowest month
  const lowestMonth = [...monthlySalesTrend].sort((a, b) => a.amount - b.amount)[0];

  if(loading)return <CustomerDetailsSkeleton/>

  return (
    <MainLayout>
    <div className="bg-gray-100 rounded-xl min-h-screen font-sans">
      {/* Header Section with gradient background */}
      <div className="bg-white shadow-md border border-gray-200 rounded-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Left Section: User Icon + Name */}
          <div className="text-gray-900 flex items-center gap-3">
            <User className="h-10 w-10 text-gray-600 bg-gray-100 p-2 rounded-full shadow-sm" /> 
            <div>
              <h1 className="text-2xl font-semibold">{customerData.Name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mr-2">
                  Card Number: {customerData.code}
                </span>
                <span className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  Customer since {formatDate(customerData.dot)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards - Always visible regardless of tab */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-100 text-blue-600 mr-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(customerData.TotalSales)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-indigo-100 text-indigo-600 mr-4">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Average Sale</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(customerData.ABV)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-100 text-green-600 mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Best Sale</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(customerData.bestSale?.DOT)}</p>
                <p className="text-sm text-gray-500">{formatCurrency(customerData.bestSale?.GrossAmt)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-amber-100 text-amber-600 mr-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Activity</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(lastSaleDate)}</p>
                <p className="text-sm text-gray-500">{formatCurrency(lastSaleAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                activeTab === 'overview' 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                activeTab === 'sales' 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('sales')}
            >
              Sales History
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                activeTab === 'analytics' 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Info Card */}
          {/* Customer Information Card */}
<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Customer Information
    </h2>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition duration-150">
        <div className="p-2 bg-blue-50 rounded-full">
          <User className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</p>
          <p className="mt-1 font-semibold text-gray-900">{customerData.Name}</p>
        </div>
      </div>
      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition duration-150">
        <div className="p-2 bg-blue-50 rounded-full">
          <Phone className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
          <p className="mt-1 font-semibold text-gray-900">{customerData.Phone || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition duration-150">
        <div className="p-2 bg-blue-50 rounded-full">
          <Calendar className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Joining</p>
          <p className="mt-1 font-semibold text-gray-900">{formatDate(customerData.dot)}</p>
        </div>
      </div>
      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition duration-150">
        <div className="p-2 bg-blue-50 rounded-full">
          <ShoppingCart className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Sales Date</p>
          <p className="mt-1 font-semibold text-gray-900">{formatDate(customerData.LastSalesDate)}</p>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Business Metrics Card */}
<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 ">
  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      Business Metrics
    </h2>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 flex flex-col justify-between border border-blue-200">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Number of Bills</p>
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-blue-800">{customerData.NOB || '0'}</p>
          <p className="text-sm font-medium text-blue-700">total bills</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 flex flex-col justify-between border border-green-200">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Average Bill Value</p>
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-green-800">{customerData.ABV || '0'}</p>
          <p className="text-sm font-medium text-green-700">per bill</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 flex flex-col justify-between border border-purple-200 col-span-1 md:col-span-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">ABV Month</p>
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="mt-4 flex flex-row justify-between items-end">
          <div>
            <p className="text-3xl font-bold text-purple-800">{customerData.ABVMth || '0'}</p>
            <p className="text-sm font-medium text-purple-700">month</p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="w-2 bg-purple-300 rounded-full" style={{ height: `${item * 8}px` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
                 
  
          {/* Last Sale */}
          {/* <div>
            <p className="text-sm font-medium text-gray-500">Last Sale</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(lastSaleAmount)}</span>
              <span className="text-sm text-gray-500">{formatDate(lastSaleDate)}</span>
            </div>
          </div> */}
             

            {/* Billing Information Card */}
           <BillingInfo formatDate={formatDate} formatCurrency={formatCurrency} customerData={customerData} />
            {/* Monthly Sales Chart - Spans across full width */}
            <div className="bg-white rounded-xl shadow-sm  col-span-1 md:col-span-3">             
              <SalesTrendChart  data={salesData} />
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <TableLayout  enableRowClick headers={headers} data={salesData} title='Sales History'/>
        )}

        {activeTab === 'analytics' && (
          <CustomerAnalytics salesData={salesData} customerData={customerData}/>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default CustomerDetails;