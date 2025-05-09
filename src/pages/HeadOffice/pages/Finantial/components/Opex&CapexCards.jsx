import React from 'react';
import { DollarSign, CreditCard, Eye, ArrowDownFromLine } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { lastUpdated } from '../../../../../utils/constants';

// Operating Expenses Card
const OpExDetailsCard = ({ metricsData, opexSampleData = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow relative">
      <div className="flex items-center mb-2">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <ArrowDownFromLine className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Operating Expenses</span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(metricsData?.total_opex || '32,450')}</p>
          <p className="text-xs text-gray-500">Total OpEx in last 2 months</p>
        </div>
        <button 
          onClick={() => navigate('/financials/opex-details')}
          className="text-sm text-blue-600 flex items-center"
        >
          View Details <Eye className="h-3 w-3 ml-1" />
        </button>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Last updated on</span>
          <span className="font-medium">{lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

// Capital Expenditures Card
const CapExDetailsCard = ({ metricsData, capexSampleData = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow relative">
      <div className="flex items-center mb-2">
        <div className="bg-purple-100 p-2 rounded-full mr-3">
          <CreditCard className="h-5 w-5 text-purple-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Capital Expenditures</span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(metricsData?.total_capex || '78,920')}</p>
          <p className="text-xs text-gray-500">Total CapEx to date</p>
        </div>
        <button 
          onClick={() => navigate('/financials/capex-details')}
          className="text-sm text-purple-600 flex items-center"
        >
          View Details <Eye className="h-3 w-3 ml-1" />
        </button>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Last investment on</span>
          <span className="font-medium">{formatDate('2025-03-10')}</span>
        </div>
      </div>
    </div>
  );
};

export { OpExDetailsCard, CapExDetailsCard };