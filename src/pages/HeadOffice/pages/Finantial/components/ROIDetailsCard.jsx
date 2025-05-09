import React from 'react';
import { TrendingUp, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../../utils/helper';
import { useNavigate } from 'react-router-dom';

const ROIDetailsCard = ({ metricsData,  roiSampleData = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow relative">
      <div className="flex items-center mb-2">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Return on Investment</span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(metricsData?.total_roi_received || '45,680')}</p>
          <p className="text-xs text-gray-500">Total ROI received to date</p>
        </div>
        <button 
          onClick={() => navigate('/financials/roi-details')}
          className="text-sm text-green-600 flex items-center"
        >
          View Details <Eye className="h-3 w-3 ml-1" />
        </button>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-xs">
        <span className="text-gray-500">Last returned on</span>
        <span className="font-medium">{formatDate('2025-02-28')}</span>
        </div>
      </div>
    </div>
  );
};

export default ROIDetailsCard;