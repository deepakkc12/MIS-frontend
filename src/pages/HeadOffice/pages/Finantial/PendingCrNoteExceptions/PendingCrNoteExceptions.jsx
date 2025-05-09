import React, { useEffect, useState, useMemo } from "react";
import TableLayout from "../../../../../components/Table/TableLayout";
import { getRequest } from "../../../../../services/apis/requests";
import { formatCurrency, formatDate } from "../../../../../utils/helper";
import MainLayout from "../../../Layout/Layout";
import { useNavigate } from "react-router-dom";

function PendingCrNoteRefundExceptions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [dateRangeFilter, setDateRangeFilter] = useState("30");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const navigate = useNavigate();

  const getList = async () => {
    setLoading(true);
    try {
      // Adjust the API endpoint for pending CrNote refunds
      const response = await getRequest(`acc/pending-cr-note-list/?range=${dateRangeFilter}`);
      if (response?.success) {
        setData(response.data || []);
        setFilteredData(response.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching pending CrNote refund exceptions:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, [dateRangeFilter]); // Reload data when date range changes

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!data || !Array.isArray(data) || !data.length) {
      return { 
        total: 0, 
        count: 0, 
        totalTransactions: 0,
        average: 0,
        averageBackDated: 0,
        byDate: {},
        byBackDatedDays: {}
      };
    }
    
    const total = data.reduce((sum, item) => {
      const amount = Number(item?.Amount) || 0;
      return sum + amount;
    }, 0);
    
    const totalTransactions = data.reduce((sum, item) => {
      return sum + (Number(item?.cnt) || 0);
    }, 0);
    
    // Calculate average back-dated days
    const totalBackDatedDays = data.reduce((sum, item) => {
      return sum + (Number(item?.BackDatedDays) || 0) * (Number(item?.cnt) || 1);
    }, 0);
    
    // Date summary
    const byDate = data.reduce((acc, item) => {
      if (item?.dot) {
        const date = String(item.dot).split("T")[0];
        acc[date] = (acc[date] || 0) + (Number(item?.Amount) || 0);
      }
      return acc;
    }, {});
    
    // BackDatedDays ranges summary
    const byBackDatedDays = data.reduce((acc, item) => {
      if (item?.BackDatedDays) {
        const days = Number(item.BackDatedDays);
        // Create ranges for back-dated days
        let range = "0-30 days";
        if (days > 30 && days <= 90) range = "31-90 days";
        else if (days > 90 && days <= 180) range = "91-180 days";
        else if (days > 180 && days <= 365) range = "181-365 days";
        else if (days > 365) range = "Over 365 days";
        
        acc[range] = (acc[range] || 0) + (Number(item?.Amount) || 0);
      }
      return acc;
    }, {});
    
    return {
      total,
      count: data.length,
      totalTransactions,
      average: totalTransactions ? total / totalTransactions : 0,
      averageBackDated: totalTransactions ? totalBackDatedDays / totalTransactions : 0,
      byDate,
      byBackDatedDays
    };
  }, [data]);

  // Get the oldest back-dated entry
  const oldestBackDated = useMemo(() => {
    if (!data || !Array.isArray(data) || !data.length) return { days: 0, date: "N/A" };
    
    const oldestEntry = [...data].sort((a, b) => (b.BackDatedDays || 0) - (a.BackDatedDays || 0))[0];
    
    return {
      days: oldestEntry?.BackDatedDays || 0,
      date: oldestEntry?.dot ? formatDate(oldestEntry.dot) : "N/A"
    };
  }, [data]);

  // Get the day with most refunds
  const dayWithMostRefunds = useMemo(() => {
    if (!data || !Array.isArray(data) || !data.length) return { date: "N/A", amount: 0, count: 0 };
    
    const dayEntry = [...data].sort((a, b) => (b.cnt || 0) - (a.cnt || 0))[0];
    
    return {
      date: dayEntry?.dot ? formatDate(dayEntry.dot) : "N/A",
      amount: dayEntry?.Amount || 0,
      count: dayEntry?.cnt || 0
    };
  }, [data]);

  // Calculate time-based statistics
  const timeStats = useMemo(() => {
    if (!data || !Array.isArray(data) || !data.length) return [];
    
    // Sort data by date
    const sortedData = [...data]
      .filter(item => item?.dot)
      .sort((a, b) => new Date(a.dot) - new Date(b.dot));
    
    if (sortedData.length === 0) return [];
    
    // Group by time period based on selected range
    const groupByTimePeriod = () => {
      const result = [];
      let currentPeriod = "";
      let periodData = [];
      
      sortedData.forEach(item => {
        const date = new Date(item.dot);
        let period = "";
        
        if (timeRange === "day") {
          period = date.toISOString().split("T")[0];
        } else if (timeRange === "week") {
          // Get week number
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          period = `Week ${weekNum}, ${date.getFullYear()}`;
        } else if (timeRange === "month") {
          period = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        }
        
        if (period !== currentPeriod) {
          if (currentPeriod !== "") {
            const periodTotal = periodData.reduce((sum, d) => sum + (Number(d.Amount) || 0), 0);
            const periodTransactions = periodData.reduce((sum, d) => sum + (Number(d.cnt) || 0), 0);
            result.push({
              period: currentPeriod,
              count: periodData.length,
              transactions: periodTransactions,
              total: periodTotal,
              average: periodTransactions ? periodTotal / periodTransactions : 0
            });
          }
          currentPeriod = period;
          periodData = [item];
        } else {
          periodData.push(item);
        }
      });
      
      // Add the last period
      if (periodData.length > 0) {
        const periodTotal = periodData.reduce((sum, d) => sum + (Number(d.Amount) || 0), 0);
        const periodTransactions = periodData.reduce((sum, d) => sum + (Number(d.cnt) || 0), 0);
        result.push({
          period: currentPeriod,
          count: periodData.length,
          transactions: periodTransactions,
          total: periodTotal,
          average: periodTransactions ? periodTotal / periodTransactions : 0
        });
      }
      
      return result;
    };
    
    return groupByTimePeriod();
  }, [data, timeRange]);

  // Apply filters to original data - using BackDatedDays ranges
  const applyFilters = (filters) => {
    let newData = [...data]; // Start with original data

    if (filters?.BackDatedRange?.id && filters.BackDatedRange.id !== "all") {
      // Apply backdated range filter
      const range = filters.BackDatedRange.id;
      
      if (range === "0-30") {
        newData = newData.filter(row => (row.BackDatedDays || 0) <= 30);
      } else if (range === "31-90") {
        newData = newData.filter(row => (row.BackDatedDays || 0) > 30 && (row.BackDatedDays || 0) <= 90);
      } else if (range === "91-180") {
        newData = newData.filter(row => (row.BackDatedDays || 0) > 90 && (row.BackDatedDays || 0) <= 180);
      } else if (range === "181-365") {
        newData = newData.filter(row => (row.BackDatedDays || 0) > 180 && (row.BackDatedDays || 0) <= 365);
      } else if (range === "365+") {
        newData = newData.filter(row => (row.BackDatedDays || 0) > 365);
      }
    }

    return newData;
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters); 
    
    // Apply filters and update filtered data
    const newFilteredData = applyFilters(newFilters);
    setFilteredData(newFilteredData);
  };

  // BackDated range options for filtering
  const backDatedRanges = [
    { id: "all", name: "All Ranges" },
    { id: "0-30", name: "0-30 days" },
    { id: "31-90", name: "31-90 days" },
    { id: "91-180", name: "91-180 days" },
    { id: "181-365", name: "181-365 days" },
    { id: "365+", name: "Over 365 days" }
  ];

  // Date range options
  const dateRangeOptions = [
    { id: "7", label: "Last 7 Days" },
    { id: "30", label: "Last 30 Days" },
    { id: "120", label: "Last Quarter" },
    { id: "365", label: "This Year" },
  ];

  const handleDateRangeChange = (range) => {
    setDateRangeFilter(range);
    setIsDatePickerOpen(false);
  };

  const filters = { BackDatedRange: backDatedRanges };

  const headers = [
    {
      key: "fdot",
      label: "Date",
      onColumnClick: (value, row) => {
        navigate(`/financials/refunds-details?dot=${row.dot}`);
      },
    },
    { key: "Amount", label: "Amount" },
    { key: "cnt", label: "Transactions" },
    { key: "BackDatedDays", label: "Back-Dated Days" },
  ];

  // Function to get severity class based on back-dated days
  const getBackDatedSeverity = (days) => {
    if (days <= 30) return "bg-green-100 text-green-800";
    if (days <= 90) return "bg-yellow-100 text-yellow-800";
    if (days <= 180) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  // Get the label for current date range
  const getCurrentDateRangeLabel = () => {
    const option = dateRangeOptions.find(opt => opt.id === dateRangeFilter);
    return option ? option.label : "Select Range";
  };

  return (
    <MainLayout>
      <div className="pb-6">
        {/* Header with action buttons and date range selector */}
        <div className="bg-white shadow-md rounded-xl mb-6">
          <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pending Credit Notes

</h1>
              <p className="text-gray-500">Analyze and manage pending credit note entries</p>
            </div>
            <div className="flex flex-wrap gap-3 self-end sm:self-auto">
              {/* Date Range Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {getCurrentDateRangeLabel()}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {isDatePickerOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      {dateRangeOptions.map(option => (
                        <button
                          key={option.id}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => handleDateRangeChange(option.id)}
                        >
                          {option.id === dateRangeFilter && (
                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation tabs */}
          <div className="px-6 flex overflow-x-auto scrollbar-hide">
            <button
              className={`py-4 px-4 whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-4 whitespace-nowrap ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Detailed Analysis
            </button>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Date range info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    Showing data for <span className="font-medium">{getCurrentDateRangeLabel()}</span>. 
                    <button 
                      onClick={() => setIsDatePickerOpen(true)} 
                      className="underline ml-1 font-medium"
                    >
                      Change
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Entries</p>
                    <p className="text-2xl font-bold text-gray-800">{summary.count}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.total)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Avg. Back-Dated</p>
                    <p className="text-2xl font-bold text-gray-800">{Math.round(summary.averageBackDated)} days</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-800">{summary.totalTransactions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert for oldest back-dated entry */}
            <div className={`p-4 rounded-lg border ${oldestBackDated.days > 180 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Oldest back-dated entry is <span className="font-bold">{oldestBackDated.days} days</span> old from {oldestBackDated.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <TableLayout
                filterTitle="Filter"
                filters={filters}
                onFilterChange={handleFilterChange}
                title="Pending CrNote Refund Exceptions"
                subtitle={`Showing ${filteredData.length} of ${data.length} total entries for ${getCurrentDateRangeLabel()}`}
                data={filteredData.map((item) => ({
                  ...item,
                  fdot: item.dot ? formatDate(item.dot) : "",
                  Amount: item.Amount ? formatCurrency(item.Amount) : "",
                  BackDatedDays: (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBackDatedSeverity(item.BackDatedDays)}`}>
                      {item.BackDatedDays} days
                    </span>
                  )
                }))}
                headers={headers}
                loading={loading}
                emptyStateMessage="No pending CrNote refund exceptions found matching your filters"
              />
            </div>
          </div>
        )}

        {/* Detailed Analysis Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Back-dated Analysis */}
              <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-4">Back-dated Days Distribution</h2>
                {Object.keys(summary.byBackDatedDays || {}).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(summary.byBackDatedDays)
                      .sort((a, b) => {
                        const ranges = ["0-30 days", "31-90 days", "91-180 days", "181-365 days", "Over 365 days"];
                        return ranges.indexOf(a[0]) - ranges.indexOf(b[0]);
                      })
                      .map(([range, amount]) => (
                        <div key={range} className="flex items-center">
                          <div className="w-28 truncate text-sm font-medium">{range}</div>
                          <div className="flex-1 mx-2">
                            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`absolute top-0 left-0 h-full ${
                                  range.includes("0-30") ? "bg-green-500" :
                                  range.includes("31-90") ? "bg-yellow-500" :
                                  range.includes("91-180") ? "bg-orange-500" :
                                  "bg-red-500"
                                }`}
                                style={{ 
                                  width: `${summary.total ? (amount / summary.total) * 100 : 0}%` 
                                }}
                              />
                              <div className="absolute inset-0 flex items-center pl-2 text-xs text-white font-medium">
                                {summary.total ? ((amount / summary.total) * 100).toFixed(1) : 0}%
                              </div>
                            </div>
                          </div>
                          <div className="w-24 text-right text-sm font-medium">
                            {formatCurrency(amount)}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No back-dated data available</div>
                )}
              </div>

              {/* Day with Most Refunds */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-4">Peak Refund Day</h2>
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-3">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{dayWithMostRefunds.date}</h3>
                  <p className="text-gray-500">
                    {dayWithMostRefunds.count} transactions totaling {formatCurrency(dayWithMostRefunds.amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Transaction Statistics</h2>
              
              {/* Time range selector */}
              <div className="flex mb-6 space-x-2 border-b border-gray-200 pb-4">
                <button
                  onClick={() => setTimeRange("day")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    timeRange === "day" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    timeRange === "week" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    timeRange === "month" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Monthly
                </button>
              </div>

              {timeStats.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Period
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transactions
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Per Transaction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeStats.map((stat, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stat.period}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(stat.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stat.transactions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(stat.average)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No transaction data available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default PendingCrNoteRefundExceptions;
