import React from 'react';
import { ArrowDownUp, Eye } from 'lucide-react';
import { formatCurrency } from '../../../../../utils/helper';
import { useNavigate } from 'react-router-dom';

const ReceivablesPayablesCard = ({ metricsData, formatDate,  receivablesPayablesSampleData = [] }) => {
  // Sample data to use if none is provided
  const sampleData = receivablesPayablesSampleData.length > 0 ? receivablesPayablesSampleData : [];

  const navigate = useNavigate()

  return (
    <div className="bg-white p-4 rounded-lg shadow relative">
      <div className="flex items-center mb-2">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <ArrowDownUp className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Receivables & Payables</span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="flex gap-4">
            <div>
              <p className="text-xl font-bold text-green-600">{formatCurrency(metricsData?.total_receivables || 1250000)}</p>
              <p className="text-xs text-gray-500">Receivables</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{formatCurrency(metricsData?.total_payables || 950000)}</p>
              <p className="text-xs text-gray-500">Payables</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-1">Net: {formatCurrency((metricsData?.total_receivables || 1250000) - (metricsData?.total_payables || 950000))}</p>
        </div>
        <button 
          onClick={() => navigate('/financials/receivables-payables')}
          className="text-sm text-blue-600 flex items-center"
        >
          View Details <Eye className="h-3 w-3 ml-1" />
        </button>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Total accounts:</span>
          <span className="font-medium">{metricsData?.total_accounts || 42}</span>
        </div>
      </div>
    </div>
  );
};

export default ReceivablesPayablesCard;