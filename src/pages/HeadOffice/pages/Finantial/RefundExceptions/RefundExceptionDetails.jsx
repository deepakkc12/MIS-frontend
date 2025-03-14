import React, { useEffect, useState, useMemo } from "react";
import TableLayout from "../../../../../components/Table/TableLayout";
import { getRequest } from "../../../../../services/apis/requests";
import { formatCurrency, formatDate } from "../../../../../utils/helper";
import MainLayout from "../../../Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";

function RefundExceptionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const dot = searchParams.get("dot");
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBackdated, setShowBackdated] = useState(false);

  const getList = async () => {
    setLoading(true);
    try {
      const response = await getRequest(`acc/cr-note-refund-details/?dot=${dot}`);
      if (response?.success) {
        setData(response.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching refund exception details:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dot) {
      getList();
    }
  }, [dot]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalAmount: 0,
        totalEntries: 0,
        averageAmount: 0,
        terminals: {},
        users: {},
        backDatedCount: 0
      };
    }

    // Calculate totals
    const totalAmount = data.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
    const backDatedCount = data.filter(item => item.BackDatedDays > 0).length;
    
    // Calculate by terminal
    const terminals = data.reduce((acc, item) => {
      const terminal = item.Termina || "Unknown";
      if (!acc[terminal]) {
        acc[terminal] = {
          count: 0,
          amount: 0
        };
      }
      acc[terminal].count += 1;
      acc[terminal].amount += Number(item.Amount) || 0;
      return acc;
    }, {});
    
    // Calculate by user
    const users = data.reduce((acc, item) => {
      const user = item.PostedBy || "Unknown";
      if (!acc[user]) {
        acc[user] = {
          count: 0,
          amount: 0
        };
      }
      acc[user].count += 1;
      acc[user].amount += Number(item.Amount) || 0;
      return acc;
    }, {});

    return {
      totalAmount,
      totalEntries: data.length,
      averageAmount: totalAmount / data.length,
      terminals,
      users,
      backDatedCount
    };
  }, [data]);

  const formattedDate = dot ? formatDate(dot) : "Invalid Date";

  const headers = [
    { 
      key: "code", 
      label: "Voucher Code",
    //   onColumnClick: (value, row) => {
    //     // You can navigate to a more detailed view if needed
    //     // navigate(`/financials/voucher-details?code=${row.code}`);
    //   }
    },
    { key: "dot", label: "Date" },
    { key: "entryDate", label: "Entry Date" },
    { key: "VoucherNo", label: "Voucher No" },
    { key: "Description", label: "Description" },
    { key: "AccountName", label: "Account" },
    { key: "Amount", label: "Amount" },
    { key: "Termina", label: "Terminal" },
    { key: "PostedBy", label: "Posted By" },
    { key: "BackDatedDays", label: "Backdated Days" },
  ];

  const filteredData = showBackdated 
    ? data.filter(item => item.BackDatedDays > 0)
    : data;

  return (
    <MainLayout>
      <div className="pb-6">
        {/* Header */}
        <div className="bg-white shadow-md rounded-xl mb-6">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Refund Exceptions Details</h1>
              <p className="text-gray-500">
                Entries for date: <span className="font-medium">{formattedDate}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate("/financials/refund-exceptions")} 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Summary
              </button>
              {/* <button 
                onClick={() => getList()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button> */}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Entries</p>
                <p className="text-2xl font-bold text-gray-800">{summary.totalEntries}</p>
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
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalAmount)}</p>
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
                <p className="text-gray-500 text-sm font-medium">Average Amount</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.averageAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowBackdated(!showBackdated)}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Backdated Entries</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-800">{summary.backDatedCount}</p>
                  {showBackdated && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Filtered</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal and User Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Terminal Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Terminal Distribution</h2>
            {Object.keys(summary.terminals).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(summary.terminals)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([terminal, stats]) => (
                    <div key={terminal} className="flex items-center">
                      <div className="w-28 truncate text-sm font-medium">{terminal}</div>
                      <div className="flex-1 mx-2">
                        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-blue-500"
                            style={{ 
                              width: `${summary.totalAmount ? (stats.amount / summary.totalAmount) * 100 : 0}%` 
                            }}
                          />
                          <div className="absolute inset-0 flex items-center pl-2 text-xs text-white font-medium">
                            {summary.totalAmount ? ((stats.amount / summary.totalAmount) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>
                      <div className="w-24 text-right text-sm font-medium">
                        {formatCurrency(stats.amount)}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No terminal data available</div>
            )}
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
            {Object.keys(summary.users).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(summary.users)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([user, stats]) => (
                    <div key={user} className="flex items-center">
                      <div className="w-28 truncate text-sm font-medium">{user}</div>
                      <div className="flex-1 mx-2">
                        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-green-500"
                            style={{ 
                              width: `${summary.totalAmount ? (stats.amount / summary.totalAmount) * 100 : 0}%` 
                            }}
                          />
                          <div className="absolute inset-0 flex items-center pl-2 text-xs text-white font-medium">
                            {summary.totalAmount ? ((stats.amount / summary.totalAmount) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>
                      <div className="w-24 text-right text-sm font-medium">
                        {formatCurrency(stats.amount)}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No user data available</div>
            )}
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-lg font-semibold">Detailed Refund Entries</h2>
            {showBackdated && (
              <div className="flex items-center">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium mr-2">
                  Showing backdated entries only
                </span>
                <button 
                  onClick={() => setShowBackdated(false)} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Show All
                </button>
              </div>
            )}
          </div>
          <TableLayout 
            data={filteredData.map(item => ({
              ...item,
              dot: formatDate(item.dot),
              entryDate: formatDate(item.entryDate),
              Amount: formatCurrency(item.Amount),
              BackDatedDays: item.BackDatedDays > 0 ? 
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  {item.BackDatedDays} {item.BackDatedDays === 1 ? 'day' : 'days'}
                </span> : 
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Same day</span>
            }))}
            headers={headers}
            loading={loading}
            emptyStateMessage="No refund entries found for this date"
            showPagination={true}
            showSearch={true}
            searchPlaceholder="Search by voucher code, terminal, user..."
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default RefundExceptionDetails;