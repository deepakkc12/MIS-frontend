import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="">
      {/* Dashboard Header Skeleton */}

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      {/* Action Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, index) => (
          <ActionCardSkeleton key={index} />
        ))}
      </div>

      {/* Sales Graph Skeleton */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow">
        <div className="h-6 w-48 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-80 w-full bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Regional Performance and Alerts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow col-span-2">
          <div className="h-6 w-48 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-80 w-full bg-gray-100 rounded-2xl"></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-36 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-14 bg-blue-100 rounded-full"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <AlertSkeleton key={index} />
            ))}
          </div>
          <div className="h-8 w-full bg-gray-100 rounded-full mt-4"></div>
        </div>
      </div>

      {/* Top Products Table Skeleton */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-48 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {[...Array(6)].map((_, index) => (
                  <th key={index} className="p-3">
                    <div className="h-4 w-full bg-gray-200 rounded-full"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {[...Array(6)].map((_, colIndex) => (
                    <td key={colIndex} className="p-3">
                      <div className="h-4 w-full bg-gray-200 rounded-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Skeleton for Metric Cards
const MetricCardSkeleton = () => (
  <div className="bg-white  p-6 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-2 h-full bg-gray-200 rounded-r-full"></div>
    <div className="flex justify-between items-start">
      <div>
        <div className="h-4 w-24 animate-pulse bg-gray-200 rounded-full mb-4"></div>
        <div className="h-8 w-36 animate-pulse bg-gray-200 rounded-full mb-2"></div>
        <div className="h-3 w-20 animate-pulse bg-gray-200 rounded-full"></div>
      </div>
      <div className="p-3 bg-gray-100 rounded-full">
        <div className="h-6 w-6 animate-pulse bg-gray-200 rounded-full"></div>
      </div>
    </div>
    <div className="w-full h-1 bg-gray-100 mt-4 rounded-full">
      <div className="h-full animate-pulse rounded-full bg-gray-200 w-1/2"></div>
    </div>
  </div>
);

// Skeleton for Action Cards
const ActionCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
    <div className="absolute -bottom-6  -right-6 w-32 h-32 rounded-full bg-gray-50"></div>
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 w-32 animate-pulse bg-gray-200 rounded-full"></div>
      <div className="p-2 bg-gray-100 rounded-full">
        <div className="h-5 w-5 animate-pulse bg-gray-200 rounded-full"></div>
      </div>
    </div>
    <div className="h-8 w-24 animate-pulse bg-gray-200 rounded-full mb-2"></div>
    <div className="h-3 w-16 animate-pulse bg-gray-200 rounded-full mb-4"></div>
    <div className="flex items-center justify-end">
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// Skeleton for Alert Items
const AlertSkeleton = () => (
  <div className="flex items-start p-3 bg-gray-50 rounded-2xl">
    <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full"></div>
    <div className="ml-3 flex-grow">
      <div className="h-4 w-ful animate-pulsel bg-gray-200 rounded-full mb-2"></div>
      <div className="h-3 w-16 animate-pulse bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default SkeletonLoader;