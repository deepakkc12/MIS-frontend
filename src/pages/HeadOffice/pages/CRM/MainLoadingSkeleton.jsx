import React from "react";
import {
  Users, TrendingUp, AlertTriangle, Award, DollarSign, 
  Store, BarChart3, PieChartIcon, Building2, UserCheck
} from "lucide-react";
import MainLayout from "../../Layout/Layout";

const CRMDashboardSkeleton = () => {
  // Pulse animation class
  const pulseClass = "animate-pulse bg-gray-200 rounded";
  
  // Card skeleton component
  const MetricCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gray-50 opacity-20 -mr-8 -mt-8"></div>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-3 rounded-lg ${pulseClass} h-11 w-11`}></div>
          <div className={`${pulseClass} h-4 w-32`}></div>
        </div>
        <div className={`${pulseClass} h-8 w-36 mb-3`}></div>
        <div className="flex items-center">
          <div className={`${pulseClass} h-6 w-20 rounded-full`}></div>
          <div className={`${pulseClass} h-4 w-24 ml-2`}></div>
        </div>
      </div>
    </div>
  );

  // Segment card skeleton
  const CustomerSegmentSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border-l-4 border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`${pulseClass} p-2.5 rounded-lg h-10 w-10`}></div>
            <div>
              <div className={`${pulseClass} h-4 w-24 mb-2`}></div>
              <div className={`${pulseClass} h-6 w-20`}></div>
            </div>
          </div>
        </div>
        <div className={`w-full ${pulseClass} h-2 mb-3`}></div>
        <div className="flex items-center justify-between">
          <div className={`${pulseClass} h-4 w-20`}></div>
          <div className={`${pulseClass} h-4 w-16`}></div>
        </div>
      </div>
    </div>
  );

  // Tier card skeleton
  const TierCardSkeleton = () => (
    <div className={`${pulseClass} rounded-2xl shadow-lg p-6 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-full h-10 w-10"></div>
          <div className="bg-white bg-opacity-20 h-5 w-24 rounded"></div>
        </div>
        <div className="bg-white bg-opacity-20 h-7 w-20 rounded"></div>
      </div>

      <div className="w-full bg-white bg-opacity-10 rounded-full h-2.5 mb-4"></div>

      <div className="flex items-center justify-between">
        <div className="bg-white bg-opacity-20 h-4 w-16 rounded"></div>
        <div className="bg-white bg-opacity-20 h-4 w-24 rounded"></div>
      </div>
    </div>
  );

  // Chart skeleton
  const ChartSkeleton = ({ height = "h-80" }) => (
    <div className={`${pulseClass} rounded ${height} w-full`}></div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className={`${pulseClass} h-8 w-64 mb-2`}></div>
              <div className={`${pulseClass} h-5 w-80`}></div>
            </div>
          </div>

          {/* Top metrics section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>

          {/* Main dashboard content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer segments */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`${pulseClass} h-5 w-5 mr-2`}></div>
                    <div className={`${pulseClass} h-6 w-40`}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <CustomerSegmentSkeleton />
                  <CustomerSegmentSkeleton />
                  <CustomerSegmentSkeleton />
                  <CustomerSegmentSkeleton />
                </div>
              </div>
              
              {/* Chart */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`${pulseClass} h-5 w-5 mr-2`}></div>
                    <div className={`${pulseClass} h-6 w-48`}></div>
                  </div>
                  <div className="flex gap-2">
                    <div className={`${pulseClass} h-7 w-20 rounded-full`}></div>
                    <div className={`${pulseClass} h-7 w-20 rounded-full`}></div>
                  </div>
                </div>
                
                <ChartSkeleton />
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              {/* Value distribution */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className={`${pulseClass} h-5 w-5 mr-2`}></div>
                  <div className={`${pulseClass} h-6 w-56`}></div>
                </div>
                <ChartSkeleton height="h-64" />
              </div>
              
              {/* Tier distribution */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className={`${pulseClass} h-5 w-5 mr-2`}></div>
                  <div className={`${pulseClass} h-6 w-52`}></div>
                </div>
                <ChartSkeleton height="h-64" />
              </div>
            </div>
          </div>
          
          {/* Customer tiers section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gray-600 h-5 w-5 mr-2 rounded"></div>
                <div className="bg-gray-600 h-6 w-48 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TierCardSkeleton />
              <TierCardSkeleton />
              <TierCardSkeleton />
              <TierCardSkeleton />
            </div>
          </div>
            
          {/* Segment performance trends */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`${pulseClass} h-5 w-5 mr-2`}></div>
                <div className={`${pulseClass} h-6 w-52`}></div>
              </div>
              <div className="flex gap-2">
                <div className={`${pulseClass} h-7 w-16 rounded-full`}></div>
                <div className={`${pulseClass} h-7 w-20 rounded-full`}></div>
              </div>
            </div>
            <ChartSkeleton height="h-96" />
          </div>
            
          {/* Footer section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className={`${pulseClass} h-5 w-48`}></div>
            <div className="flex gap-3">
              <div className={`${pulseClass} h-9 w-32 rounded-lg`}></div>
              <div className={`${pulseClass} h-9 w-40 rounded-lg`}></div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CRMDashboardSkeleton;