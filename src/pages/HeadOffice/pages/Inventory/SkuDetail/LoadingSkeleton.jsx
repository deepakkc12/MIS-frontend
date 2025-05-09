import React from "react";
import MainLayout from "../../../Layout/Layout";
import { Activity, DollarSign, Package, Users, ShoppingCart, AlertCircle } from "lucide-react";

const SKUAnalyticsSkeletonLoader = () => {
  const TabButton = ({ label, icon: Icon }) => (
    <div className="px-4 py-2 flex items-center gap-2 font-medium rounded-lg bg-gray-100 animate-pulse">
      {Icon && <Icon size={18} className="text-gray-400" />}
      <div className="h-4 w-16 bg-gray-300 rounded"></div>
    </div>
  );

  const SkeletonStatCard = () => (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="h-4 w-24 bg-gray-300 rounded mb-3"></div>
          <div className="h-6 w-16 bg-gray-300 rounded mb-2"></div>
          <div className="flex items-center mt-2">
            <div className="h-3 w-12 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="p-2 bg-gray-200 rounded-lg">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonCard = ({ height = "h-72" }) => (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="h-5 w-36 bg-gray-300 rounded mb-4"></div>
      <div className={`${height} w-full bg-gray-200 rounded`}></div>
    </div>
  );

  const SkeletonTable = ({ rows = 5 }) => (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="h-5 w-36 bg-gray-300 rounded mb-4"></div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="bg-gray-200 h-10 w-full mb-2 rounded"></div>
          {[...Array(rows)].map((_, idx) => (
            <div key={idx} className="bg-gray-100 h-12 w-full mb-2 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="bg-gray-50 rounded-xl p-6 min-h-screen">
        {/* Header Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
          <div className="flex gap-2 mt-1">
            <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-28 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-24 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton label="Overview" icon={Activity} />
          <TabButton label="Sales Analysis" icon={DollarSign} />
          <TabButton label="Customer Segmentation" icon={Users} />
          <TabButton label="Inventory" icon={Package} />
          <TabButton label="Sub SKUs" icon={Package} />
          <TabButton label="Price Validations" icon={AlertCircle} />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Table Skeleton */}
        <SkeletonTable rows={5} />
      </div>
    </MainLayout>
  );
};

export default SKUAnalyticsSkeletonLoader;