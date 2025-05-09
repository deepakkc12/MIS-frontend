import React, { useEffect, useState } from "react";
import MainLayout from "../../../Layout/Layout";
import { getRequest } from "../../../../../services/apis/requests";
import { ChevronRight, ArrowUpRight, Search, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  info: "#3B82F6",
  primary: "#6366F1",
};

function CategoryList() {

  const [data, setData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryAnalytics, setCategoryAnalytics] = useState({
    stockTrend: [],
    salesTrend: []
  });
  const [metrics, setMetrics] = useState({
    zeroStockCount: 0,
    salesOpportunityLoss: 0,
    totalCategories: 0,
    totalSkus: 0,
    recentVendors: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const getCategories = async () => {
    setIsLoading(true);
    const response = await getRequest("inventory/categories");
    if (response.success) {
      setCategories(response.data);
      setFilteredCategories(response.data);
    
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <MainLayout>
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Product Categories
          </h2>
          <button
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => navigate("/inventory/categories")}
          >
            View All Categories <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search categories by name, code or reference..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Select a category to view detailed analytics based on the last 3
          months of sales data
        </p>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No categories found matching "{searchTerm}"</p>
            <button
              className="mt-2 text-indigo-600 hover:text-indigo-800"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((category, index) => {
              // Generate a consistent but unique color for each category
              const hue = (index * 40) % 360;
              const bgColor = `hsl(${hue}, 70%, 97%)`;
              const borderColor = `hsl(${hue}, 70%, 85%)`;
              const iconColor = `hsl(${hue}, 70%, 50%)`;

              return (
                <div
                  key={category.Code}
                  className={`relative overflow-hidden rounded-lg p-4 cursor-pointer transition-all hover:shadow-md border border-gray-200 ${
                    selectedGroup?.Code === category.Code && showModal
                      ? "ring-2 ring-indigo-500"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      selectedGroup?.Code === category.Code && showModal
                        ? bgColor
                        : "white",
                    borderColor:
                      selectedGroup?.Code === category.Code && showModal
                        ? borderColor
                        : "",
                  }}
                  // onClick={() => handleCategorySelect(category)}
                  onClick={() =>
                    navigate(
                      `/inventory/category-details/?code=${category.Code}`
                    )
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: bgColor }}
                      >
                        <Layers
                          className="h-5 w-5"
                          style={{ color: iconColor }}
                        />
                      </div>
                      <div>
                        <h3
                          className="font-medium text-gray-900 text-base truncate"
                          title={category.Name}
                        >
                          {category.Name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Code: {category.Code}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      Ref: {category.refCode}
                    </div>
                    <div className="flex items-center text-xs text-indigo-600 font-medium">
                      View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>

                  {selectedGroup?.Code === category.Code && showModal && (
                    <div
                      className="absolute -bottom-10 -right-10 w-24 h-24 opacity-10 rounded-full"
                      style={{ backgroundColor: iconColor }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CategoryList;
