import React from 'react';
import { Calendar, Clock, DollarSign, Phone, ShoppingCart, User, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import MainLayout from '../../../Layout/Layout';

const CustomerDetailsSkeleton = () => {
  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen font-sans">
        {/* Header Section with gradient background - Skeleton */}
        <div className="bg-white shadow-md border border-gray-200 rounded-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* User Icon + Name - Skeleton */}
              <div className="text-gray-900 flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center mt-2">
                    <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Skeleton */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Summary Cards - Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                <div className="flex items-center">
                  <div className="rounded-full p-3 bg-gray-200 mr-4 animate-pulse h-12 w-12"></div>
                  <div className="w-full">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs - Skeleton */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="flex overflow-x-auto">
              {[1, 2, 3].map((item) => (
                <div key={item} className="px-6 py-4 whitespace-nowrap border-b-2 border-transparent">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Info Card - Skeleton */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="ml-4 w-full">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="mt-1 h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Metrics Card - Skeleton */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className={`bg-gray-50 rounded-lg p-4 ${item === 3 ? 'col-span-2' : ''}`}>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="mt-2 flex items-baseline">
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="ml-1 h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Billing Information Card - Skeleton */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="ml-4 w-full">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="mt-1 h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Sales Chart - Skeleton */}
            <div className="bg-white rounded-xl shadow-sm col-span-1 md:col-span-3">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="h-64 w-full bg-gray-100 rounded-lg flex items-end justify-around px-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="w-1/6 flex flex-col items-center">
                      <div 
                        className="w-full bg-gray-200 rounded-t-lg animate-pulse"
                        style={{ height: `${Math.random() * 70 + 30}%` }}
                      ></div>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mt-2"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CustomerDetailsSkeleton;