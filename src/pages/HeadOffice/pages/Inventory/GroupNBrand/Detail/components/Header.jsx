import React from 'react';
import { ChevronRight, PieChart, Tag, BarChart3, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupAnalysisHeader = ({ data, onCategoryClick, brandName, brandCode, groupCode }) => {
  // Extract necessary data
  const { Name, category, Code, ProductCategoryCode } = data.info[0];
  const navigate = useNavigate();

  const navigateToBrandOverview = () => {
    navigate(`/inventory/brand/${brandCode}`);
  };
  
  const navigateToGroupDetails = () => {
    navigate(`/inventory/group/${groupCode}`);
  };
  
  return (
    <div className="bg-white p-4 py-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <PieChart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">{Name} - {brandName}</h1>
              <div className="ml-3 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                GROUP & BRAND ANALYSIS
              </div>
            </div>
            <div className="flex items-center mt-1 text-gray-500">
              <span className="flex items-center">
                <Tag className="h-4 w-4 mr-1" /> 
                <button 
                  onClick={() => navigate(`/inventory/category-details?code=${ProductCategoryCode}`)}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center"
                >
                  {category}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </span>
              <span className="mx-2">•</span>
              <span>Code: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{Code}</span></span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={navigateToGroupDetails}
            className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 text-sm font-medium flex items-center justify-center"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Group Details
          </button>
          
          <button
            onClick={navigateToBrandOverview}
            className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50 text-sm font-medium flex items-center justify-center"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Brand Overview
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center justify-center">
            <PieChart className="h-4 w-4 mr-2" />
            Update Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupAnalysisHeader;