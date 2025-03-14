import React, { useState, useEffect } from 'react';
import { 
  Calendar, DollarSign, FileText, Download, 
  RefreshCw, AlertCircle, HelpCircle, 
  ArrowLeft, Eye 
} from 'lucide-react';
import MainLayout from '../../../Layout/Layout';
import Rupee from '../../../../../components/Elements/Rupee';
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';

const ExpenseAsIncomePage = () => {
  const [dateRange, setDateRange] = useState('30');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenseAsIncomeData, setExpenseAsIncomeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const headers = [
    {
      key: "VoucherNo",
      label: "Voucher",
      onColumnClick: (value, row) => viewEntryDetails(row.groupedEntries),
    },
    {key: "DOT", label: "Date"},
    {key: "Description", label: "Description"},
    {key: "Account", label: "Accounts Involved"},
    {key: "Amount", label: "Amount"},
    {
      key: "actions",
      label: "View",
      custom: true,
      component: (row) => (
        <div className="flex justify-end">
          <button 
            onClick={() => viewEntryDetails(row.groupedEntries)}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRequest(`acc/expense-as-incomes/?range=${dateRange}`);
      
      if (response.success) {
        setExpenseAsIncomeData(response.data || []);
        processDataForTable(response.data || []);
      } else {
        setExpenseAsIncomeData([]);
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
      if (!acc[entry.code + entry.VoucherNo]) {
        acc[entry.code + entry.VoucherNo] = [];
      }
      acc[entry.code + entry.VoucherNo].push(entry);
      return acc;
    }, {});

    // Format data for TableLayout component
    const formattedData = Object.entries(groupedEntries).map(([key, entries]) => {
      const debitEntry = entries.find(e => parseFloat(e.DrAmout) > 0);
      const creditEntry = entries.find(e => parseFloat(e.CrAmout) > 0);
      const amount = debitEntry ? parseFloat(debitEntry.DrAmout) : (creditEntry ? parseFloat(creditEntry.CrAmout) : 0);
      
      return {
        id: key,
        VoucherNo: entries[0].VoucherNo,
        DOT: formatDate(entries[0].DOT),
        Description: entries[0].Description,
        Account: debitEntry?.Account && creditEntry?.Account ? 
          `${debitEntry.Account} → ${creditEntry.Account}` : entries[0].Account,
        Amount: `₹${formatAmount(amount)}`,
        code: entries[0].code,
        groupedEntries: entries // Keep original entries for modal view
      };
    });

    setFilteredData(formattedData);
  };

  // Format date
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

  // Calculate summary statistics
  const totalEntries = filteredData.length;
  
  const totalAmount = filteredData.reduce((sum, entry) => {
    const amount = parseFloat(entry.Amount.replace('₹', '').replace(/,/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const averageAmount = totalEntries > 0 ? totalAmount / totalEntries : 0;

  // View entry details
  const viewEntryDetails = (entries) => {
    setSelectedEntry(entries);
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
              <h1 className="text-2xl font-bold text-gray-800">Expenses as Income Analysis</h1>
              <p className="text-sm text-gray-500">Analytical view of misclassified expense transactions</p>
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
            <h3 className="font-bold text-gray-800 mb-2">About Expense as Income Analysis</h3>
            <p className="mb-2">This analytical view shows journal entries where expense transactions were incorrectly classified as income.</p>
            <p className="mb-2">Key information in this report:</p>
            <ul className="list-disc pl-5 mb-3">
              <li>Each row represents a journal voucher with misclassified entries</li>
              <li>View detailed transaction information by clicking on any entry</li>
              <li>Use the date range selector to adjust the analysis period</li>
            </ul>
            <p className="text-blue-600 font-semibold">Impact: These misclassifications affect P&L statements and overall financial reporting accuracy.</p>
          </div>
        )}

        {/* Summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Total Entries</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{totalEntries}</p>
                <p className="text-xs text-gray-500">journal entries</p>
              </div>
              <p className="text-xs text-blue-600 mt-1">Across {dateRange} days</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Average Amount</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold"><Rupee/>{formatAmount(averageAmount)}</p>
                <p className="text-xs text-gray-500">per misclassification</p>
              </div>
              <p className="text-xs text-amber-600 mt-1">Trend indicator</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Total Misclassified Amount</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold"><Rupee/>{formatAmount(totalAmount)}</p>
                <p className="text-xs text-gray-500">misclassified value</p>
              </div>
              <p className="text-xs text-red-600 mt-1">Impact on financial statements</p>
            </div>
          </div>
        </div>

        {/* Journal entry list using TableLayout */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <TableLayout
            title="Misclassified Journal Entries"
            subtitle={`Showing ${filteredData.length} entries with incorrect expense classification`}
            data={filteredData}
            loading={loading}
            headers={headers}
            emptyMessage="No expense-as-income entries found for the selected period."
          />
        </div>

        {/* Entry details modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Journal Entry Details - {selectedEntry[0].VoucherNo}
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
                        <td className="p-2">{entry.Account}</td>
                        <td className="p-2 text-right">{parseFloat(entry.DrAmout) > 0 ? `₹${formatAmount(entry.DrAmout)}` : ''}</td>
                        <td className="p-2 text-right">{parseFloat(entry.CrAmout) > 0 ? `₹${formatAmount(entry.CrAmout)}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <td className="p-2">Total</td>
                      <td className="p-2 text-right">
                        ₹{formatAmount(selectedEntry.reduce((sum, entry) => sum + parseFloat(entry.DrAmout || 0), 0))}
                      </td>
                      <td className="p-2 text-right">
                        ₹{formatAmount(selectedEntry.reduce((sum, entry) => sum + parseFloat(entry.CrAmout || 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded mb-4 text-sm">
              <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Classification Issue Detected</p>
                    <p className="text-yellow-700">This entry records an expense account as a credit (income) entry which results in inaccurate financial reporting.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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

export default ExpenseAsIncomePage;