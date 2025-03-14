import React, { useState, useEffect } from 'react';
import { 
  Calendar, DollarSign, FileText, Download, 
  RefreshCw, AlertCircle, HelpCircle, 
  ArrowLeft, Eye, Clock
} from 'lucide-react';
import MainLayout from '../../../Layout/Layout';
import Rupee from '../../../../../components/Elements/Rupee';
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';
import { formatCurrency, formatDate } from '../../../../../utils/helper';

const BackdatedEntriesPage = () => {
  const [dateRange, setDateRange] = useState('30');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backdatedData, setBackdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const headers = [
    {
      key: "VoucherNo",
      label: "Voucher",
      onColumnClick: (value, row) => viewEntryDetails(row.groupedEntries),
    },
    {key: "DOT", label: "Bill Date"},
    {key: "EntryDate", label: "Entry Date"},
    {key: "DaysDiff", label: "Days Gap"},
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
      const response = await getRequest(`acc/back-dated-entreis/?range=${dateRange}`);
      
      if (response?.success) {
        setBackdatedData(response.data || []);
        processDataForTable(response.data || []);
      } else {
        setBackdatedData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Failed to fetch backdated entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  // Calculate days difference between bill date and entry date
  const calculateDaysDifference = (billDate, entryDate) => {
    const bill = new Date(billDate);
    const entry = new Date(entryDate);
    const diffTime = Math.abs(entry - bill);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group entries by voucher code and prepare data for table
  const processDataForTable = (data) => {
    // Group entries by voucher code
    const groupedEntries = data.reduce((acc, entry) => {
      if (!acc[entry.CODE]) {
        acc[entry.CODE] = [];
      }
      acc[entry.CODE].push(entry);
      return acc;
    }, {});

    // Format data for TableLayout component
    const formattedData = Object.entries(groupedEntries).map(([key, entries]) => {
      const debitEntry = entries.find(e => parseFloat(e.Dr) > 0);
      const creditEntry = entries.find(e => parseFloat(e.Cr) > 0);
      const amount = debitEntry ? parseFloat(debitEntry.Dr) : (creditEntry ? parseFloat(creditEntry.Cr) : 0);
      
      return {
        id: key,
        VoucherNo: entries[0].VoucherNo,
        DOT: formatDate(entries[0].DOT),
        EntryDate: formatDate(entries[0].EntryDate),
        DaysDiff: entries[0].DaysDiff,
        Description: entries[0].Description,
        Account: debitEntry?.Name && creditEntry?.Name ? 
          `${debitEntry.Name} → ${creditEntry.Name}` : entries[0].Name,
        Amount: `${formatCurrency(amount)}`,
        TransName: entries[0].TransName,
        groupedEntries: entries // Keep original entries for modal view
      };
    });

    setFilteredData(formattedData);
  };

  // Format date

  // Format amount


  // Calculate summary statistics
  const totalEntries = filteredData.length;
  
  const totalAmount = filteredData.reduce((sum, entry) => {
    const amount = parseFloat(entry.Amount.replace('', '').replace(/,/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const averageDaysGap = filteredData.reduce((sum, entry) => sum + entry.DaysDiff, 0) / (totalEntries || 1);

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
              <h1 className="text-2xl font-bold text-gray-800">Backdated Entries Analysis</h1>
              <p className="text-sm text-gray-500">Entries recorded after the actual transaction date</p>
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
            <h3 className="font-bold text-gray-800 mb-2">About Backdated Entries Analysis</h3>
            <p className="mb-2">This report shows journal entries where the entry date is later than the bill/transaction date.</p>
            <p className="mb-2">Key information in this report:</p>
            <ul className="list-disc pl-5 mb-3">
              <li>Each row represents a journal voucher with backdated entries</li>
              <li>"Days Gap" shows the delay between the transaction and recording date</li>
              <li>View detailed transaction information by clicking on any entry</li>
              <li>Use the date range selector to adjust the analysis period</li>
            </ul>
            <p className="text-blue-600 font-semibold">Impact: Backdated entries can affect period-specific reporting accuracy and may indicate process inefficiencies.</p>
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
                <p className="text-xs text-gray-500">backdated entries</p>
              </div>
              <p className="text-xs text-blue-600 mt-1">Across {dateRange} days</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Average Days Gap</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{averageDaysGap.toFixed(1)}</p>
                <p className="text-xs text-gray-500">days between transaction and entry</p>
              </div>
              <p className="text-xs text-amber-600 mt-1">Process efficiency indicator</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Total Amount</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                <p className="text-xs text-gray-500">backdated transaction value</p>
              </div>
              <p className="text-xs text-red-600 mt-1">Impact on financial statements</p>
            </div>
          </div>
        </div>

        {/* Journal entry list using TableLayout */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <TableLayout
            title="Backdated Journal Entries"
            subtitle={`Showing ${filteredData.length} entries with delayed recording`}
            data={filteredData.map(data=>({...data,actions:<div className="flex justify-center">
                <button 
                  onClick={() => viewEntryDetails(data.groupedEntries)}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>}))}
            loading={loading}
            headers={headers}
            emptyMessage="No backdated entries found for the selected period."
          />
        </div>

        {/* Entry details modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Backdated Entry Details - {selectedEntry[0].VoucherNo}
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
                  <span className="text-gray-500">Voucher Type:</span> {selectedEntry[0].TransName}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Voucher Number:</span> {selectedEntry[0].VoucherNo}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Bill Date:</span> {formatDate(selectedEntry[0].DOT)}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Entry Date:</span> {formatDate(selectedEntry[0].EntryDate)}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Days Gap:</span> {calculateDaysDifference(selectedEntry[0].DOT, selectedEntry[0].EntryDate)}
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
                        <td className="p-2 text-right">{parseFloat(entry.Dr) > 0 ? `${formatCurrency(entry.Dr)}` : ''}</td>
                        <td className="p-2 text-right">{parseFloat(entry.Cr) > 0 ? `${formatCurrency(entry.Cr)}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <td className="p-2">Total</td>
                      <td className="p-2 text-right">
                        {formatCurrency(selectedEntry.reduce((sum, entry) => sum + parseFloat(entry.Dr || 0), 0))}
                      </td>
                      <td className="p-2 text-right">
                        {formatCurrency(selectedEntry.reduce((sum, entry) => sum + parseFloat(entry.Cr || 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded mb-4 text-sm">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Backdated Entry Issue</p>
                    <p className="text-yellow-700">This transaction was recorded {calculateDaysDifference(selectedEntry[0].DOT, selectedEntry[0].EntryDate)} days after the actual transaction date. This can affect period-specific financial reporting accuracy.</p>
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

export default BackdatedEntriesPage;