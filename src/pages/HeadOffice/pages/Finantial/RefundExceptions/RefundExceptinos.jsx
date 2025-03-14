import React, { useEffect, useState, useMemo } from "react";
import TableLayout from "../../../../../components/Table/TableLayout";
import { getRequest } from "../../../../../services/apis/requests";
import { formatCurrency, formatDate } from "../../../../../utils/helper";
import MainLayout from "../../../Layout/Layout";
import { useNavigate } from "react-router-dom";

function RefundExceptions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");
  const [Terminals, setTerminals] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [dateRangeFilter, setDateRangeFilter] = useState("30");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const navigate = useNavigate();

  const getList = async () => {
    setLoading(true);
    try {
      // You might want to add dateRangeFilter to your API request
      const response = await getRequest(`acc/cr-note-refund-summary/?range=${dateRangeFilter}`);
      if (response?.success) {
        setData(response.data || []);
        const terminals = response.data
          ? Array.from(
              new Map(
                response.data.map(row => [row.Terminal, { name: row.Terminal, id: row.Terminal }])
              ).values()
            )
          : [];
        setTerminals(terminals);
        setFilteredData(response.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching refund exceptions:", error);
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
        average: 0,
        byTerminal: {},
        byDate: {},
        byPostedBy: {}
      };
    }
    
    const total = data.reduce((sum, item) => {
      const amount = Number(item?.Amount) || 0;
      return sum + amount;
    }, 0);
    
    // Terminal summary
    const byTerminal = data.reduce((acc, item) => {
      if (item?.Terminal) {
        acc[item.Terminal] = (acc[item.Terminal] || 0) + (Number(item?.Amount) || 0);
      }
      return acc;
    }, {});
    
    // Date summary
    const byDate = data.reduce((acc, item) => {
      if (item?.dot) {
        const date = String(item.dot).split("T")[0];
        acc[date] = (acc[date] || 0) + (Number(item?.Amount) || 0);
      }
      return acc;
    }, {});
    
    // Posted by summary
    const byPostedBy = data.reduce((acc, item) => {
      if (item?.PostedBy) {
        acc[item.PostedBy] = (acc[item.PostedBy] || 0) + (Number(item?.Amount) || 0);
      }
      return acc;
    }, {});
    
    return {
      total,
      count: data.length,
      average: data.length ? total / data.length : 0,
      byTerminal,
      byDate,
      byPostedBy
    };
  }, [data]);

  // Get unique terminals for filter
  const terminals = useMemo(() => {
    if (!data || !Array.isArray(data) || !data.length) return ["all"];
    
    const unique = [...new Set(data
      .filter(item => item?.Terminal)
      .map(item => item.Terminal))];
    return ["all", ...unique];
  }, [data]);

  // Get unique dates for filter
  const dates = useMemo(() => {
    if (!data || !Array.isArray(data) || !data.length) return ["all"];
    
    const unique = [...new Set(data
      .filter(item => item?.dot)
      .map(item => {
        try {
          const date = new Date(item.dot);
          return date.toISOString().split("T")[0];
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean))];
    return ["all", ...unique];
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
            const total = periodData.reduce((sum, d) => sum + (Number(d.Amount) || 0), 0);
            result.push({
              period: currentPeriod,
              count: periodData.length,
              total: total,
              average: total / periodData.length
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
        const total = periodData.reduce((sum, d) => sum + (Number(d.Amount) || 0), 0);
        result.push({
          period: currentPeriod,
          count: periodData.length,
          total: total,
          average: total / periodData.length
        });
      }
      
      return result;
    };
    
    return groupByTimePeriod();
  }, [data, timeRange]);

  const filters = { Terminal: Terminals };
  
  // Apply filters to original data
  const applyFilters = (filters) => {
    let newData = [...data]; // Start with original data

    if (filters?.Terminal?.id) {
      newData = newData.filter(row => row.Terminal === filters.Terminal.id);
    }

    return newData;
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters); 
    
    // Apply filters and update filtered data
    const newFilteredData = applyFilters(newFilters);
    setFilteredData(newFilteredData);
  };

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

  const headers = [
    {
      key: "fdot",
      label: "Date",
      onColumnClick: (value,row) => {
        navigate(`/financials/refunds-details?dot=${row.dot}`);
      },
    },
    { key: "Amount", label: "Amount" },
    { key: "Terminal", label: "Terminal" },
    { key: "PostedBy", label: "Posted By" },
    // Only include these if they exist in your data
    ...(data[0]?.RefundReason ? [{ key: "RefundReason", label: "Reason" }] : []),
    ...(data[0]?.TransactionId ? [{ key: "TransactionId", label: "Transaction ID" }] : []),
  ];

  // Function to safely get highest terminal
  const getHighestTerminal = () => {
    const terminalEntries = Object.entries(summary.byTerminal || {});
    if (terminalEntries.length === 0) return "N/A";
    
    terminalEntries.sort((a, b) => b[1] - a[1]);
    return terminalEntries[0][0];
  };

  // Function to safely get highest user
  const getHighestUser = () => {
    const userEntries = Object.entries(summary.byPostedBy || {});
    if (userEntries.length === 0) return "N/A";
    
    userEntries.sort((a, b) => b[1] - a[1]);
    return userEntries[0][0];
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
              <h1 className="text-2xl font-bold text-gray-800">Refund Exceptions</h1>
              <p className="text-gray-500">Analyze and manage exceptional refund entries</p>
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
              
              {/* <button 
                onClick={getList}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button> */}
              
              {/* <button 
                onClick={() => {}} 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export Report
              </button> */}
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
            {/* <button
              className={`py-4 px-4 whitespace-nowrap ${activeTab === 'trends' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('trends')}
            >
              Trends
            </button> */}
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
                    <p className="text-gray-500 text-sm font-medium">Total Exceptions</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Top Terminal</p>
                    <p className="text-2xl font-bold text-gray-800">{getHighestTerminal()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Top Agent</p>
                    <p className="text-2xl font-bold text-gray-800">{getHighestUser()}</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <TableLayout
                filterTitle="Filter"
                filters={filters}
                onFilterChange={handleFilterChange}
                title="Refund Exceptions"
                subtitle={`Showing ${filteredData.length} of ${data.length} total exceptions for ${getCurrentDateRangeLabel()}`}
                data={filteredData.map((item) => ({
                  ...item,
                  fdot: item.dot ? formatDate(item.dot) : "",
                  Amount: item.Amount ? formatCurrency(item.Amount) : "",
                }))}
                headers={headers}
                loading={loading}
                emptyStateMessage="No refund exceptions found matching your filters"
              />
            </div>
          </div>
        )}

        {/* Detailed Analysis Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Terminal Analysis */}
              <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-4">Terminal Distribution</h2>
                {Object.keys(summary.byTerminal || {}).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(summary.byTerminal)
                      .sort((a, b) => b[1] - a[1])
                      .map(([terminal, amount]) => (
                        <div key={terminal} className="flex items-center">
                          <div className="w-28 truncate text-sm font-medium">{terminal}</div>
                          <div className="flex-1 mx-2">
                            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-blue-500"
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
                  <div className="text-center py-8 text-gray-500">No terminal data available</div>
                )}
              </div>

              {/* User Analysis */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-4">Top Users</h2>
                {Object.keys(summary.byPostedBy || {}).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(summary.byPostedBy)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([user, amount], index) => (
                        <div key={user} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{user}</p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(amount)} ({((amount / summary.total) * 100).toFixed(1)}%)
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No user data available</div>
                )}
              </div>
            </div>

            {/* Transaction Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold mb-4">Transaction Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-600 mb-1">Average Transaction</h3>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(summary.average)}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-600 mb-1">Transactions Count</h3>
                  <p className="text-xl font-bold text-gray-800">{summary.count}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-600 mb-1">Total Value</h3>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(summary.total)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab Content */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Time period selector */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold">Trend Analysis for {getCurrentDateRangeLabel()}</h2>
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className={`py-2 px-4 text-sm font-medium ${
                        timeRange === 'day'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } rounded-l-lg border border-gray-300 focus:z-10 focus:ring-2 focus:ring-blue-500`}
                      onClick={() => setTimeRange('day')}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 text-sm font-medium ${
                        timeRange === 'week'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border-t border-b border-gray-300 focus:z-10 focus:ring-2 focus:ring-blue-500`}
                      onClick={() => setTimeRange('week')}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 text-sm font-medium ${
                        timeRange === 'month'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } rounded-r-lg border border-gray-300 focus:z-10 focus:ring-2 focus:ring-blue-500`}
                      onClick={() => setTimeRange('month')}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>
  
              {/* Trend Data Display */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Refund Trends by {timeRange === 'day' ? 'Day' : timeRange === 'week' ? 'Week' : 'Month'}</h2>
                  
                  {timeStats.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Period
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Count
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Average
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
                                {stat.count}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(stat.total)}
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
                    <div className="text-center py-10 text-gray-500">
                      No trend data available for the selected time period
                    </div>
                  )}
                </div>
              </div>
  
              {/* Visualization placeholder */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-4">Visualization</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <p className="mt-2 text-gray-500">Chart visualization would appear here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }
  
  export default RefundExceptions;