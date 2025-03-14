import React from 'react';
import { Clock, HelpCircle, Eye } from 'lucide-react';
import { formatCurrency } from '../../../../../utils/helper';

const BackdatedEntriesCard = ({ matricsData, formatDate, handleTooltipToggle, showTooltip, navigate, backdatedSampleData = [] }) => {
  // Sample data to use if none is provided
  const sampleData = backdatedSampleData.length > 0 ? backdatedSampleData : [];

  // Calculate metrics from data
  const maxBackdatedDays = sampleData.length > 0 ? 
    Math.max(...sampleData?.map(item => {
      const dot = new Date(item?.DOT);
      const entryDate = new Date(item.EntryDate);
      const diffTime = Math.abs(entryDate - dot);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    })) : 0;

  // Calculate total value (using Dr or Cr values)
  const totalValue = sampleData.reduce((total, item) => {
    const drAmount = parseFloat(item.Dr) || 0;
    const crAmount = parseFloat(item.Cr) || 0;
    return total + Math.max(drAmount, crAmount);
  }, 0);



  return (
    <div className="bg-white p-4 rounded-lg shadow relative">
      <div className="flex items-center mb-2">
        <div className="bg-orange-100 p-2 rounded-full mr-3">
          <Clock className="h-5 w-5 text-orange-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Backdated Entries</span>
        <button 
          className="ml-2 text-gray-400 hover:text-gray-600"
          onClick={() => handleTooltipToggle('backdated')}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
      {showTooltip === 'backdated' && (
        <div className="absolute z-10 bg-white border border-gray-200 p-3 rounded-md shadow-lg w-64 text-xs text-gray-600 top-12 right-4">
          <p className="font-semibold mb-1">Backdated Account Entries</p>
          <p>Transactions where the entry date is significantly later than the transaction date, potentially indicating improper accounting practices.</p>
          <div className="mt-2 bg-orange-50 p-1 rounded">
            <p className="font-semibold">Example Entry:</p>
            <p>Transaction Date: {formatDate(sampleData[0].DOT)}</p>
            <p>Entry Date: {formatDate(sampleData[0].EntryDate)}</p>
            <p>Gap: {maxBackdatedDays} days</p>
            <p>Account: {sampleData[0].Name}</p>
            <p>Amount: ₹{sampleData[0].Dr > 0 ? sampleData[0].Dr : sampleData[0].Cr}</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(parseFloat(matricsData?.total_backdated_amount) )}</p>
          <p className="text-xs text-gray-500">{matricsData?.total_backdated_entries} entries</p>
          <p className="text-xs text-orange-600 mt-1">Max gap: {maxBackdatedDays} days</p>
        </div>
        <button 
          onClick={() => navigate('/financials/backdated-entries')}
          className="text-sm text-orange-600 flex items-center"
        >
          View Details <Eye className="h-3 w-3 ml-1" />
        </button>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Latest journal date:</span>
          <span className="font-medium">{formatDate(sampleData[0]?.DOT)}</span>
        </div>
      </div>
    </div>
  );
};

export default BackdatedEntriesCard;