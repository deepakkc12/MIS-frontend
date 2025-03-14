import React, { useState, useEffect } from 'react';
import { 
  Calendar, DollarSign, FileText, Download, 
  RefreshCw, AlertCircle, HelpCircle, 
  ArrowLeft, Eye, Filter
} from 'lucide-react';
import MainLayout from '../../../Layout/Layout';
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';
import { formatDate } from '../../../../../utils/helper';

const RangeExceptionPage = () => {
  const [dateRange, setDateRange] = useState('30');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exceptionData, setExceptionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const headers = [
    {
      key: "VoucherNo",
      label: "Voucher",
      onColumnClick: (value, row) => viewEntryDetails(row.groupedEntries),
    },
    {key: "DOT", label: "Date"},
    {key: "ExpenseType", label: "Expense Type"},
    {key: "AccountGroup", label: "Account Group"},
    {key: "PaymentMethod", label: "Payment Method"},
    {key: "Amount", label: "Amount"},
    {key: "ExpectedRange", label: "Expected Range"},
    // {
    //   key: "Deviation",
    //   label: "Deviation",
    //   custom: true,
    //   component: (row) => (
    //     <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityClass(row.SeverityLevel)}`}>
    //       {row.Deviation}
    //     </div>
    //   )
    // },
    // {
    //   key: "actions",
    //   label: "View",
    //   custom: true,
    //   component: (row) => (
    //     <div className="flex justify-end">
    //       <button 
    //         onClick={() => viewEntryDetails(row.groupedEntries)}
    //         className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
    //       >
    //         <Eye className="h-4 w-4" />
    //       </button>
    //     </div>
    //   )
    // }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRequest(`acc/range-audits/?range=${dateRange}`);
      
      if (response.success) {
        setExceptionData(response.data || []);
        processDataForTable(response.data || []);
      } else {
        setExceptionData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  // Group entries by voucher code and prepare data for table
  const processDataForTable = (data) => {
    // Group entries by voucher code
    const groupedEntries = data.reduce((acc, entry) => {
      if (!acc[entry.code]) {
        acc[entry.code] = [];
      }
      acc[entry.code].push(entry);
      return acc;
    }, {});

    // Format data for table
    const formattedData = Object.entries(groupedEntries).map(([key, entries]) => {
      const debitEntry = entries.find(e => e.Mode === 1);
      const creditEntry = entries.find(e => e.Mode === 2);
      const amount = debitEntry ? parseFloat(debitEntry.Amount) : 0;
      
      // Define typical range for this type of transaction
      const minRange = debitEntry.AmountFrom && parseFloat(debitEntry.AmountFrom);
      const maxRange = debitEntry.AmountTo && parseFloat(debitEntry.AmountTo);


      const rangeText =  minRange && maxRange?`₹${minRange.toFixed(2)} - ₹${maxRange.toFixed(2)}` : 'N/A';
      const deviation =  minRange && maxRange ? ((amount - maxRange) / maxRange * 100).toFixed(1) : 'N/A';
      const deviationText = deviation !== 'N/A' ? `${deviation}%` : 'N/A';
      const severityLevel = getSeverityLevel(deviation);
      
      return {
        id: key,
        VoucherNo: entries[0].VoucherNo,
        DOT: formatDate(entries[0].DOT),
        ExpenseType: debitEntry?.Name || 'Unknown',
        AccountGroup: debitEntry?.accGroup || 'Unknown',
        PaymentMethod: creditEntry?.Name || 'Unknown',
        Description: entries[0].Description,
        Amount: `₹${formatAmount(amount)}`,
        ExpectedRange: rangeText,
        Deviation: deviationText,
        SeverityLevel: severityLevel,
        code: entries[0].code,
        groupedEntries: entries // Keep original entries for modal view
      };
    });

    setFilteredData(formattedData);
  };

  // Helper function to get estimated range (in a real app, this would come from historical data)
  const getEstimatedRange = (expenseType) => {
    const ranges = {
      "Loading And Unloading": { min: 200, max: 500 },
      "Bank Charges": { min: 50, max: 500 },
      "Advertisement Expense": { min: 1000, max: 1500 },
      "Rent": { min: 2000, max: 2500 },
      "Computer Expenses": { min: 500, max: 800 }
    };
    
    return ranges[expenseType] || null;
  };
  
  // Helper function to determine severity level
  const getSeverityLevel = (deviation) => {
    if (deviation === 'N/A') return 'unknown';
    const dev = parseFloat(deviation);
    if (dev > 50) return 'critical';
    if (dev > 25) return 'high';
    if (dev > 10) return 'medium';
    return 'low';
  };

  // Format date


  // Format amount
  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  // Calculate summary statistics
  const totalExceptions = filteredData.length;
  
  const totalExceptionAmount = filteredData.reduce((sum, entry) => {
    const amount = parseFloat(entry.Amount.replace('₹', '').replace(/,/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const highSeverityCount = filteredData.filter(entry => 
    entry.SeverityLevel === 'high' || entry.SeverityLevel === 'critical'
  ).length;

  // View entry details
  const viewEntryDetails = (entries) => {
    setSelectedEntry(entries);
  };

  // Get severity class for coloring
  const getSeverityClass = (level) => {
    switch(level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 p-6 rounded-lg w-full mx-auto">
        {/* Header with back button and date range */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => window.history.back()} 
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Range Exception Analysis</h1>
              <p className="text-sm text-gray-500">Transactions that exceed expected amount ranges</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-300">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <select 
                className="bg-transparent border-none text-sm focus:outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last Quarter</option>
                <option value="365">Last Year</option>
              </select>
            </div>
            {/* <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center shadow-sm"
              onClick={fetchData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button> */}
            <button 
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              onClick={() => setShowHelp(!showHelp)}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Help tooltip */}
        {showHelp && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-sm shadow-md">
            <h3 className="font-bold text-gray-800 mb-2">About Range Exception Analysis</h3>
            <p className="mb-2">This report identifies journal entries where transaction amounts exceed the typical range for that type of expense.</p>
            <p className="mb-2">Key information in this report:</p>
            <ul className="list-disc pl-5 mb-3">
              <li>Each row represents an expense transaction that exceeds expected ranges</li>
              <li>Severity levels indicate how far the transaction exceeds typical ranges</li>
              <li>View detailed transaction information by clicking on any entry</li>
              <li>Use the date range selector to adjust the analysis period</li>
            </ul>
            <p className="text-red-600 font-semibold">Impact: Range exceptions may indicate errors, fraud, or legitimate but unusual transactions that require review.</p>
          </div>
        )}

        {/* Summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Total Exceptions</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{totalExceptions}</p>
                <p className="text-xs text-gray-500">unusual transactions</p>
              </div>
              <p className="text-xs text-blue-600 mt-1">Across {dateRange} days</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">High Severity</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{highSeverityCount}</p>
                <p className="text-xs text-gray-500">critical exceptions</p>
              </div>
              <p className="text-xs text-red-600 mt-1">{totalExceptions > 0 ? Math.round(highSeverityCount/totalExceptions*100) : 0}% of total</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Total Exception Amount</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">₹{formatAmount(totalExceptionAmount)}</p>
                <p className="text-xs text-gray-500">total value of exceptions</p>
              </div>
              <p className="text-xs text-amber-600 mt-1">Potential impact</p>
            </div>
          </div>
        </div>

        {/* Filter tags */}
        {/* <div className="mb-4 flex items-center gap-2">
          <span className="text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Filters:
          </span>
          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
            All Severities
            <span className="ml-1">×</span>
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center">
            Add Filter
            <span className="ml-1">+</span>
          </button>
        </div> */}

        {/* Journal entry list using TableLayout */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <TableLayout
            title="Range Exception Entries"
            subtitle={`Showing ${filteredData.length} transactions exceeding expected amount ranges`}
            data={filteredData}
            loading={loading}
            headers={headers}
            emptyMessage="No range exceptions found for the selected period."
          />
        </div>

        {/* Entry details modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Range Exception Details - {selectedEntry[0].VoucherNo}
                </h2>
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
              
              <div className="mb-4 flex flex-wrap gap-4 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Date:</span> {formatDate(selectedEntry[0].DOT)}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Voucher:</span> {selectedEntry[0].VoucherNo}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Account Group:</span> {selectedEntry[0].accGroup || 'N/A'}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedEntry[0].Description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Journal Entries</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Account</th>
                      <th className="p-2 text-right">Debit</th>
                      <th className="p-2 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEntry.map((entry, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{entry.Name}</td>
                        <td className="p-2 text-right">{entry.Mode === 1 ? `₹${formatAmount(entry.Amount)}` : ''}</td>
                        <td className="p-2 text-right">{entry.Mode === 2 ? `₹${formatAmount(entry.Amount)}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <td className="p-2">Total</td>
                      <td className="p-2 text-right">
                        ₹{formatAmount(selectedEntry.reduce((sum, entry) => sum + (entry.Mode === 1 ? parseFloat(entry.Amount || 0) : 0), 0))}
                      </td>
                      <td className="p-2 text-right">
                        ₹{formatAmount(selectedEntry.reduce((sum, entry) => sum + (entry.Mode === 2 ? parseFloat(entry.Amount || 0) : 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Range visualization */}
              <div className="bg-red-50 p-3 rounded mb-4">
                <h3 className="font-semibold mb-2 text-red-800">Range Exception Analysis</h3>
                {selectedEntry[0].Name && selectedEntry[0].AmountFrom && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Expected Range: ₹{selectedEntry[0].AmountFrom.toFixed(2)} - ₹{selectedEntry[0].AmountTo.toFixed(2)}</span>
                      <span>Actual: ₹{formatAmount(selectedEntry[0].Amount)}</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded mt-3">
                      <div className="absolute top-0 left-0 h-2 bg-red-200 rounded" 
                          style={{width: `${(parseFloat(selectedEntry[0].AmountTo) / parseFloat(selectedEntry[0].Amount)) * 100}%`}}>
                      </div>
                      <div className="absolute -top-1 left-0 h-4 w-1 bg-gray-800 rounded-full" 
                          style={{left: `${(parseFloat(selectedEntry[0].AmountFrom) / parseFloat(selectedEntry[0].Amount)) * 100}%`}}>
                      </div>
                      <div className="absolute -top-1 left-0 h-4 w-1 bg-gray-800 rounded-full" 
                          style={{left: `${(parseFloat(selectedEntry[0].AmountTo) / parseFloat(selectedEntry[0].Amount)) * 100}%`}}>
                      </div>
                      <div className="absolute -top-1 right-0 h-4 w-1 bg-red-800 rounded-full">
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-2 text-sm">
                  <p className="font-medium text-red-800">Recommended Actions:</p>
                  <ul className="list-disc pl-5 text-red-700">
                    <li>Verify transaction details with the department</li>
                    <li>Check for supporting documentation</li>
                    <li>Confirm authorization for higher amount</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                {/* <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                  Mark as Reviewed
                </button> */}
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RangeExceptionPage;