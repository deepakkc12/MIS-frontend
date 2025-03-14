import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, AlertTriangle, FileText, Clock, HelpCircle, Eye, RefreshCw, Search, ChevronRight } from 'lucide-react';
import MainLayout from '../../Layout/Layout';
import Rupee from '../../../../components/Elements/Rupee';
import { getRequest } from '../../../../services/apis/requests';
import { useNavigate } from 'react-router-dom';
import BackdatedEntriesCard from './components/BackDatedEntrieCard';

const FinancialDashboard = () => {
    const [dateRange, setDateRange] = useState('30');
    const [matricsData, setMatricsData] = useState({});
    const [showTooltip, setShowTooltip] = useState(null);
    const [refundData, setRefundData] = useState([]);
    const [pendingCreditData, setPendingCreditData] = useState([]);
    const [expenseAsIncomeData, setExpenseAsIncomeData] = useState([]);
    const [rangeExceededData, setRangeExceededData] = useState([]);
    const [backDatedEntries, setBackDatedEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDataFetched, setIsDataFetched] = useState(false);
  
    const navigate = useNavigate();
  
    // Function to fetch metrics data
    const getMetricsData = async() => {
      try {
        setLoading(true);
        const response = await getRequest(`acc/metrics/?range=${dateRange}`);
        if(response.success) {
          setMatricsData(response.data);
        } else {
          console.error("Failed to fetch metrics data");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching metrics data:", error);
        setLoading(false);
      }
    };
  
    // Function to fetch cash refund data
    const getRefundData = async() => {
      try {
        const response = await getRequest(`acc/cr-note-refund-summary/?range=${dateRange}`);
        if(response.success) {
          setRefundData(response.data || []);
        } else {
          console.error("Failed to fetch refund data");
          // Fallback data for development
          setRefundData([
            { dot: "2025-02-21T00:00:00", Amount: "49.0000", Termina: "ACC-NDK", PostedBy: "CHINJU", Terminal: "ACC-NDK" },
            { dot: "2025-01-29T00:00:00", Amount: "4293.0000", Termina: "SERVER", PostedBy: "FEMIN", Terminal: "SERVER" },
            { dot: "2025-01-28T00:00:00", Amount: "991.0000", Termina: "SERVER", PostedBy: "FEMIN", Terminal: "SERVER" },
            { dot: "2025-01-27T00:00:00", Amount: "239.0000", Termina: "SERVER", PostedBy: "FEMIN", Terminal: "SERVER" },
            { dot: "2025-01-26T00:00:00", Amount: "210.0000", Termina: "SERVER", PostedBy: "FEMIN", Terminal: "SERVER" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching refund data:", error);
        // Fallback data
        setRefundData([
          { dot: "2025-02-21T00:00:00", Amount: "49.0000", Termina: "ACC-NDK", PostedBy: "CHINJU", Terminal: "ACC-NDK" },
          { dot: "2025-01-29T00:00:00", Amount: "4293.0000", Termina: "SERVER", PostedBy: "FEMIN", Terminal: "SERVER" }
        ]);
      }
    };
  
    // Function to fetch pending credit notes data
    const getPendingCreditData = async() => {
      try {
        const response = await getRequest(`acc/pending-cr-note-list/?range=${dateRange}`);
        if(response.success) {
          setPendingCreditData(response.data || []);
        } else {
          console.error("Failed to fetch pending credit data");
          // Fallback data
          setPendingCreditData([
            { dot: "2023-04-01T00:00:00", Amount: "42.0000", BackDatedDays: 708, cnt: 1 },
            { dot: "2023-04-02T00:00:00", Amount: "212.0000", BackDatedDays: 707, cnt: 1 },
            { dot: "2023-04-05T00:00:00", Amount: "381.0000", BackDatedDays: 704, cnt: 4 },
            { dot: "2023-04-09T00:00:00", Amount: "278.0000", BackDatedDays: 700, cnt: 3 },
            { dot: "2023-04-10T00:00:00", Amount: "54.0000", BackDatedDays: 699, cnt: 1 }
          ]);
        }
      } catch (error) {
        console.error("Error fetching pending credit data:", error);
        // Fallback data
        setPendingCreditData([
          { dot: "2023-04-01T00:00:00", Amount: "42.0000", BackDatedDays: 708, cnt: 1 },
          { dot: "2023-04-02T00:00:00", Amount: "212.0000", BackDatedDays: 707, cnt: 1 }
        ]);
      }
    };
  
    // Function to fetch expense as income data
    const getExpenseAsIncomeData = async() => {
      try {
        const response = await getRequest(`acc/expense-as-incomes/?range=${dateRange}`);
        if(response.success) {
          setExpenseAsIncomeData(response.data || []);
        } else {
          console.error("Failed to fetch expense as income data");
          // Fallback data
          setExpenseAsIncomeData([
            { code: "6147464240", DOT: "2025-01-15T00:00:00", VoucherNo: "94", Description: "Rs. 99 REVSL RENTAL CHARGE DEC24", Account: "Hdfc Bank", DrAmout: "99.0000", CrAmout: "0.0000" },
            { code: "6147464240", DOT: "2025-01-15T00:00:00", VoucherNo: "94", Description: "Rs. 99 REVSL RENTAL CHARGE DEC24", Account: "Bank Charges", DrAmout: "0.0000", CrAmout: "99.0000" },
            { code: "6147455472", DOT: "2025-01-17T00:00:00", VoucherNo: "52", Description: "Rs. 35400 KLF NIRMAL INDUSTRIES ", Account: "Federal Bank", DrAmout: "35400.0000", CrAmout: "0.0000" },
            { code: "6147455472", DOT: "2025-01-17T00:00:00", VoucherNo: "52", Description: "Rs. 35400 KLF NIRMAL INDUSTRIES ", Account: "Sales Promotion", DrAmout: "0.0000", CrAmout: "35400.0000" },
            { code: "6147466010", DOT: "2025-02-15T00:00:00", VoucherNo: "123", Description: "Rs. 99 RVSL EDC RENTAL JAN25-FPZ573 ", Account: "Hdfc Bank", DrAmout: "99.0000", CrAmout: "0.0000" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching expense as income data:", error);
        // Fallback data
        setExpenseAsIncomeData([
          { code: "6147464240", DOT: "2025-01-15T00:00:00", VoucherNo: "94", Description: "Rs. 99 REVSL RENTAL CHARGE DEC24", Account: "Hdfc Bank", DrAmout: "99.0000", CrAmout: "0.0000" },
          { code: "6147464240", DOT: "2025-01-15T00:00:00", VoucherNo: "94", Description: "Rs. 99 REVSL RENTAL CHARGE DEC24", Account: "Bank Charges", DrAmout: "0.0000", CrAmout: "99.0000" }
        ]);
      }
    };
  
    // Function to fetch range exceeded data
    const getRangeExceededData = async() => {
      try {
        const response = await getRequest(`acc/range-audits/?range=${dateRange}`);
        if(response.success) {
          setRangeExceededData(response.data || []);
        } else {
          console.error("Failed to fetch range exceeded data");
          // Fallback data
          setRangeExceededData([
            { code: "6147428759", DOT: "2024-12-28T00:00:00", VoucherNo: "86", Name: "Loading And Unloading", Amount: "570.0000", Mode: 1, Description: "Rs. 570 26-12-24 50-24=240 & 26-9=67.5 & 28-12-24 50-11=110 & 26-20=150", accGroup: "Administrative Expense", LedgerCode: "41" },
            { code: "6147428759", DOT: "2024-12-28T00:00:00", VoucherNo: "86", Name: "Cash", Amount: "570.0000", Mode: 2, Description: "Rs. 570 26-12-24 50-24=240 & 26-9=67.5 & 28-12-24 50-11=110 & 26-20=150", accGroup: "Cash In Hand", LedgerCode: "39" },
            { code: "6147464057", DOT: "2025-01-03T00:00:00", VoucherNo: "1526", Name: "Bank Charges", Amount: "1031.0000", Mode: 1, Description: "Rs. 1031 SI HGAFP144020755418789", accGroup: "Administrative Expense", LedgerCode: "62" },
            { code: "6147464057", DOT: "2025-01-03T00:00:00", VoucherNo: "1526", Name: "Hdfc Bank", Amount: "1031.0000", Mode: 2, Description: "Rs. 1031 SI HGAFP144020755418789", accGroup: "Bank Acounts", LedgerCode: "614713493" },
            { code: "6147438581", DOT: "2025-01-10T00:00:00", VoucherNo: "274", Name: "Loading And Unloading", Amount: "585.0000", Mode: 1, Description: "Rs. 585 50-23=230  26-14=105   50-25=250  4181", accGroup: "Administrative Expense", LedgerCode: "41" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching range exceeded data:", error);
        // Fallback data
        setRangeExceededData([
          { code: "6147428759", DOT: "2024-12-28T00:00:00", VoucherNo: "86", Name: "Loading And Unloading", Amount: "570.0000", Mode: 1, Description: "Rs. 570 26-12-24 50-24=240 & 26-9=67.5 & 28-12-24 50-11=110 & 26-20=150", accGroup: "Administrative Expense", LedgerCode: "41" },
          { code: "6147428759", DOT: "2024-12-28T00:00:00", VoucherNo: "86", Name: "Cash", Amount: "570.0000", Mode: 2, Description: "Rs. 570 26-12-24 50-24=240 & 26-9=67.5 & 28-12-24 50-11=110 & 26-20=150", accGroup: "Cash In Hand", LedgerCode: "39" }
        ]);
      }
    };
  
    // Function to fetch backdated entries
    const getBackdatedEntriesData = async() => {
      try {
        const response = await getRequest(`acc/back-dated-entreis/?range=${dateRange}`);
        if(response.success) {
          setBackDatedEntries(response.data || []);
        } else {
          console.error("Failed to fetch backdated entries data");
          // Fallback data
          setBackDatedEntries([
            {
              CODE: "6147468605",
              DOT: "2024-12-03T00:00:00",
              EntryDate: "2025-03-02T00:00:00",
              VoucherNo: "767",
              Description: "NAVYA DM",
              Name: "Navya Dm",
              Dr: "101.1500",
              Cr: "0.0000",
              Alias: "Dec 24",
              caCode: 180
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching backdated entries data:", error);
        // Fallback data
        setBackDatedEntries([
          {
            CODE: "6147468605",
            DOT: "2024-12-03T00:00:00",
            EntryDate: "2025-03-02T00:00:00",
            VoucherNo: "767",
            Description: "NAVYA DM",
            Name: "Navya Dm",
            Dr: "101.1500",
            Cr: "0.0000",
            Alias: "Dec 24",
            caCode: 180
          }
        ]);
      }
    };
  
    // Format date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
  
    // Format amount
    const formatAmount = (amount) => {
      return parseFloat(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
    };
  
    // Calculate days between dates
    const calculateDaysDiff = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(today - date);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
  
    // Handle tooltip display
    const handleTooltipToggle = (id) => {
      setShowTooltip(showTooltip === id ? null : id);
    };
  
    // Fetch all data
    const fetchAllData = () => {
      getMetricsData();
      getRefundData();
      getPendingCreditData();
      getExpenseAsIncomeData();
      getRangeExceededData();
      getBackdatedEntriesData();
      setIsDataFetched(true);
    };
  
    useEffect(() => {
      fetchAllData();
    }, [dateRange]);
  
    // Filter expense data based on search term
    const filteredExpenseData = expenseAsIncomeData.filter(item => 
      item.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <MainLayout>
      <div className="bg-gray-50 p-6 rounded-lg w-full mx-auto">
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Financial Exceptions Dashboard</h1>
            <p className="text-sm text-gray-500">Monitor accounting exceptions and financial audit items requiring attention</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center bg-white px-3 py-2 rounded-md shadow">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <select 
                className="bg-transparent border-none text-sm focus:outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">This Week</option>
                <option value="30">This Month</option>
                <option value="120">Last Quarter</option>
                <option value="360">Year to Date</option>
              </select>
            </div>
            {/* <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
              onClick={fetchAllData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button> */}
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Cash Refunds Metric Box */}
          <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Cash Refunds</span>
              <button 
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={() => handleTooltipToggle('refunds')}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            {showTooltip === 'refunds' && (
              <div className="absolute z-10 bg-white border border-gray-200 p-3 rounded-md shadow-lg w-64 text-xs text-gray-600 top-12 right-4">
                <p className="font-semibold mb-1">System CR Note Refunds</p>
                <p>Cash refunds processed through the system's credit note functionality, which is currently disabled but still recording transactions.</p>
                <div className="mt-2 bg-blue-50 p-1 rounded">
                  <p className="font-semibold">Recent Refund Entry:</p>
                  <p>Date: {formatDate(refundData[0].dot)}</p>
                  <p>Amount: ₹{formatAmount(refundData[0].Amount)}</p>
                  <p>Terminal: {refundData[0].Terminal}</p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold"><Rupee/>{matricsData?.total_refund || 0}</p>
                <p className="text-xs text-gray-500">{matricsData?.total_refund_entries || 0} transactions</p>
                <p className="text-xs text-blue-600 mt-1">System CR Note refunds (disabled feature)</p>
              </div>
              <button 
                onClick={() => navigate('/financials/refund-exceptions')}
                className="text-sm text-blue-600 flex items-center"
              >
                View Details <Eye className="h-3 w-3 ml-1" />
              </button>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Last entry:</span>
                <span className="font-medium">{refundData.length > 0 ? formatDate(refundData[0].dot) : "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Pending Credit Notes Metric Box */}
          <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="flex items-center mb-2">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Pending Credit Notes</span>
              <button 
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={() => handleTooltipToggle('pending')}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            {showTooltip === 'pending' && (
              <div className="absolute z-10 bg-white border border-gray-200 p-3 rounded-md shadow-lg w-64 text-xs text-gray-600 top-12 right-4">
                <p className="font-semibold mb-1">Pending Credit Notes</p>
                <p>Credit notes that have been issued but are still awaiting approval or processing, some with significant backdating.</p>
                <div className="mt-2 bg-yellow-50 p-1 rounded">
                  <p className="font-semibold">Oldest Pending Entry:</p>
                  <p>Date: {pendingCreditData.length > 0 ? formatDate(pendingCreditData[0].dot) : "N/A"}</p>
                  <p>Amount: ₹{pendingCreditData.length > 0 ? formatAmount(pendingCreditData[0].Amount) : "N/A"}</p>
                  <p>Backdated: {pendingCreditData.length > 0 ? pendingCreditData[0].BackDatedDays : "N/A"} days</p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold"><Rupee/>{matricsData?.total_pending_refund_amount || 0}</p>
                <p className="text-xs text-gray-500">{matricsData?.total_pending_refund_entries || 0} transactions</p>
                <p className="text-xs text-yellow-600 mt-1">Some entries backdated 700+ days</p>
              </div>
              <button 
                onClick={() => navigate('/financials/pending-refund-exceptions')}
                className="text-sm text-yellow-600 flex items-center"
              >
                View Details <Eye className="h-3 w-3 ml-1" />
              </button>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Oldest entry:</span>
                <span className="font-medium text-yellow-600">
                  {pendingCreditData.length > 0 ? 
                    `${formatDate(pendingCreditData[0].dot)} (${pendingCreditData[0].BackDatedDays} days old)` : 
                    "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Expenses as Income Metric Box */}
          <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Expenses as Income</span>
              <button 
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={() => handleTooltipToggle('expenses')}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            {showTooltip === 'expenses' && (
              <div className="absolute z-10 bg-white border border-gray-200 p-3 rounded-md shadow-lg w-64 text-xs text-gray-600 top-12 right-4">
                <p className="font-semibold mb-1">Expenses Entered as Income</p>
                <p>Ledger entries where expense transactions were incorrectly classified as income, requiring correction to maintain accurate financial reporting.</p>
                <div className="mt-2 bg-red-50 p-1 rounded">
                  <p className="font-semibold">Example Entry:</p>
                  <p>Date: {expenseAsIncomeData.length > 0 ? formatDate(expenseAsIncomeData[0].DOT) : "N/A"}</p>
                  <p>Description: {expenseAsIncomeData.length > 0 ? expenseAsIncomeData[0].Description : "N/A"}</p>
                  <p>Account: {expenseAsIncomeData.length > 0 ? expenseAsIncomeData[0].Account : "N/A"}</p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold"><Rupee/>{matricsData?.expense_as_income_total || 0}</p>
                <p className="text-xs text-gray-500">{matricsData?.expense_as_income_entries || 0} uncorrected entries</p>
                <p className="text-xs text-red-600 mt-1">Misclassified expense ledger entries</p>
              </div>
              <button 
                onClick={() => navigate('/financials/expenses-as-income')}
                className="text-sm text-red-600 flex items-center"
              >
                View Details <Eye className="h-3 w-3 ml-1" />
              </button>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Latest entry:</span>
                <span className="font-medium">
                  {expenseAsIncomeData.length > 0 ? formatDate(expenseAsIncomeData[0].DOT) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Range Exceptions Metric Box */}
          <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="flex items-center mb-2">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Range Exceptions</span>
              <button 
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={() => handleTooltipToggle('range')}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            {showTooltip === 'range' && (
              <div className="absolute z-10 bg-white border border-gray-200 p-3 rounded-md shadow-lg w-64 text-xs text-gray-600 top-12 right-4">
                <p className="font-semibold mb-1">Account Range Exceptions</p>
                <p>Transactions that exceeded their normal expected value ranges, potentially indicating unusual activity that requires review.</p>
                <div className="mt-2 bg-purple-50 p-1 rounded">
                  <p className="font-semibold">Example Transaction:</p>
                  <p>Account: {rangeExceededData.length > 0 ? rangeExceededData[0].Name : "N/A"}</p>
                  <p>Amount: ₹{rangeExceededData.length > 0 ? formatAmount(rangeExceededData[0].Amount) : "N/A"}</p>
                  <p>Date: {rangeExceededData.length > 0 ? formatDate(rangeExceededData[0].DOT) : "N/A"}</p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold"><Rupee/>{matricsData?.range_exceptions_amount || 0}</p>
                <p className="text-xs text-gray-500">{matricsData?.range_exceptions || 0} transactions</p>
                <p className="text-xs text-purple-600 mt-1">Entries exceeding normal value ranges</p>
              </div>
              <button 
                onClick={() => navigate('/financials/range-exceptions')}
                className="text-sm text-purple-600 flex items-center"
              >
                View Details <Eye className="h-3 w-3 ml-1" />
              </button>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Latest exception:</span>
                <span className="font-medium text-purple-600">
                  {rangeExceededData.length > 0 ? formatDate(rangeExceededData[0].DOT) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Backdated Entries Card */}
          <BackdatedEntriesCard 
            backdatedSampleData={backDatedEntries} 
            showTooltip={showTooltip} 
            navigate={navigate} 
            handleTooltipToggle={handleTooltipToggle} 
            formatDate={formatDate} 
            matricsData={matricsData} 
          />
        </div>

        {/* Expense as Income Data Table */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-red-600" />
              Recent Expenses as Income Entries
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button 
                onClick={() => navigate('/financials/expenses-as-income')}
                className="text-sm text-red-600 flex items-center"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dr Amount</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cr Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenseData.slice(0, 10).map((item, index) => (
                  <tr key={`${item.code}-${index}`} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{formatDate(item.DOT)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.VoucherNo}</td>
                    <td className="px-3 py-2 text-xs text-gray-900 max-w-xs truncate" title={item.Description}>
                      {item.Description}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.Account}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right">
                      {parseFloat(item.DrAmout) > 0 ? `₹${formatAmount(item.DrAmout)}` : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right">
                      {parseFloat(item.CrAmout) > 0 ? `₹${formatAmount(item.CrAmout)}` : '-'}
                    </td>
                  </tr>
                ))}
                {filteredExpenseData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-500">
                      No expenses as income entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredExpenseData.length > 0 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/financials/expenses-as-income')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                View All Expense as Income Entries <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Range Exceeded Data Table */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-600" />
              Recent Range Exceptions
            </h2>
            <button 
              onClick={() => navigate('/financials/range-exceptions')}
              className="text-sm text-purple-600 flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rangeExceededData.slice(0, 10).map((item, index) => (
                  <tr key={`${item.code}-${index}`} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{formatDate(item.DOT)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.VoucherNo}</td>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.Name}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{item.accGroup}</td>
                    <td className="px-3 py-2 text-xs text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.Mode === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.Mode === 1 ? 'Debit' : 'Credit'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-right font-medium text-gray-900">
                      ₹{formatAmount(item.Amount)}
                    </td>
                  </tr>
                ))}
                {rangeExceededData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-500">
                      No range exception entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {rangeExceededData.length > 0 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/financials/range-exceptions')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                View All Range Exceptions <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Backdated Entries Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Recent Backdated Entries
            </h2>
            <button 
              onClick={() => navigate('/financials/backdated-entries')}
              className="text-sm text-orange-600 flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Date</th>
                  <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Days Backdated</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account/Description</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dr Amount</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cr Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backDatedEntries.slice(0, 10).map((item, index) => {
                  const daysDiff = calculateDaysDiff(item.DOT);
                  return (
                    <tr key={`${item.CODE}-${index}`} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {formatDate(item.DOT)}
                        <span className="block text-xs text-gray-500">{item.Alias}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{formatDate(item.EntryDate)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          daysDiff > 90 ? 'bg-red-100 text-red-800' : 
                          daysDiff > 30 ? 'bg-orange-100 text-orange-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {daysDiff} days
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.VoucherNo}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        <div className="font-medium">{item.Name}</div>
                        <div className="text-gray-500 text-xs">{item.Description}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-right font-medium text-gray-900">
                        {parseFloat(item.Dr) > 0 ? `₹${formatAmount(item.Dr)}` : '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-right font-medium text-gray-900">
                        {parseFloat(item.Cr) > 0 ? `₹${formatAmount(item.Cr)}` : '-'}
                      </td>
                    </tr>
                  );
                })}
                {backDatedEntries.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-3 py-4 text-center text-sm text-gray-500">
                      No backdated entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {backDatedEntries.length > 0 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/financials/backdated-entries')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                View All Backdated Entries <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FinancialDashboard;