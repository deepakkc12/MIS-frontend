import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingDown, Package, Truck, Tag, BarChart2, ChevronRight, ArrowUpRight, Layers, X, Search } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MainLayout from '../../Layout/Layout';
import { ActionCard } from '../Sales/components/Cards';
import InventoryAnalysisCard from './components/ChoiceMatricsCard';
import { getRequest } from '../../../../services/apis/requests';
import { lastUpdated } from '../../../../utils/constants';

const COLORS = {
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  primary: '#6366F1'
};

const InventoryAnalytics = () => {
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

  const getData = async () => {
    if (selectedGroup?.Code) {
      
      setIsAnalyticsLoading(true);
      const response = await getRequest(`inventory/sku-list/?group=${selectedGroup.Code}`);
      if (response.success) {
        setData(response.data);
        
        // Fetch analytics data for the selected category
        const analyticsResponse = await getRequest(`inventory/category-analytics/${selectedGroup.Code}`);
        if (analyticsResponse.success) {
          setCategoryAnalytics(analyticsResponse.data || generateMockAnalytics());
        } else {
          setCategoryAnalytics(generateMockAnalytics());
        }
      }
      setIsAnalyticsLoading(false);
    }
  };

  // Generate mock analytics data for demonstration
  const generateMockAnalytics = () => {
    const months = ['Dec', 'Jan', 'Feb'];
    return {
      stockTrend: months.map((month, index) => ({
        month,
        "In Stock": Math.floor(Math.random() * 50) + 30,
        "Low Stock": Math.floor(Math.random() * 15) + 5,
        "Out of Stock": Math.floor(Math.random() * 8)
      })),
      salesTrend: months.map((month, index) => ({
        month,
        sales: Math.floor(Math.random() * 20000) + 10000,
        profit: Math.floor(Math.random() * 8000) + 4000
      }))
    };
  };

  const getCategories = async () => {
    setIsLoading(true);
    const response = await getRequest('inventory/categories');
    if (response.success) {
      setCategories(response.data);
      setFilteredCategories(response.data);
      setMetrics(prev => ({
        ...prev,
        totalCategories: response.data.length
      }));
    }
    setIsLoading(false);
  };

  const getMetrics = async () => {
    const response = await getRequest('inventory/metrics/summary');
    if (response.success) {
      setMetrics(prev => ({
        ...prev,
        zeroStockCount: response.data.zeroStockCount,
        salesOpportunityLoss: response.data.salesOpportunityLoss,
        totalSkus: response.data.totalSkus,
        recentVendors: response.data.recentVendors || []
      }));
    }
  };

  useEffect(() => {
    getCategories();
    getMetrics();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      getData();
    }
  }, [selectedGroup]);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        category => 
          category.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          category.Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.refCode && category.refCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleCategorySelect = (category) => {
    setSelectedGroup(category);
    setShowModal(true);
  };



  // Calculate metrics for selected category
  const getCategoryMetrics = () => {
    const lowStock = data.filter(item => item.stockLevel < item.minStock).length || 0;
    const outOfStock = data.filter(item => item.stockLevel === 0).length || 0;
    const overStock = data.filter(item => item.stockLevel > item.maxStock).length || 0;
    
    return { total: data.length, lowStock, outOfStock, overStock };
  };

  // Modal component for category details
  const CategoryDetailsModal = () => {
    if (!selectedGroup || !showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedGroup.Name} - 3 Month Analysis
              </h2>
              <p className="text-sm text-gray-500">
                Analytics based on the last quarter's performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => navigate(`/inventory/category/${selectedGroup.Code}`)}
              >
                View Full Details
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-128px)]">
            {isAnalyticsLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Stock Levels</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryAnalytics.stockTrend}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="In Stock" stackId="a" fill="#10B981" />
                        <Bar dataKey="Low Stock" stackId="a" fill="#F59E0B" />
                        <Bar dataKey="Out of Stock" stackId="a" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Sales Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={categoryAnalytics.salesTrend}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#6366F1" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    {getCategoryMetrics().total === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        No data available for this category
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Total SKUs</span>
                            <span className="text-lg font-semibold">{getCategoryMetrics().total}</span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Low Stock Items</span>
                            <span className="text-lg font-semibold text-amber-600">
                              {getCategoryMetrics().lowStock}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Out of Stock</span>
                            <span className="text-lg font-semibold text-red-600">
                              {getCategoryMetrics().outOfStock}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Overstocked</span>
                            <span className="text-lg font-semibold text-indigo-600">
                              {getCategoryMetrics().overStock}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          className="w-full mt-2 py-2 text-sm flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-colors"
                          onClick={() => navigate(`/inventory/category/${selectedGroup.Code}/sku-list`)}
                        >
                          View All SKUs <ChevronRight className="ml-1 h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 rounded-xl min-h-screen">
        {/* Header */}
        <header className="bg-white shadow rounded-xl">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Inventory Analytics</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Top row metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
            <ActionCard
              title="Zero Stock Items"
              value={metrics.zeroStockCount}
              icon={AlertTriangle}
              color={COLORS.danger}
              index={0}
            />
            <ActionCard
              title="Sales Opportunity Loss"
              value={`₹${metrics.salesOpportunityLoss.toLocaleString()}`}
              icon={TrendingDown}
              color={COLORS.warning}
              onClick={() => navigate("/inventory/opertunity-loss")}
              index={1}
            />
            <InventoryAnalysisCard 
              onClick={() => navigate(`/inventory/customer-choices`)} 
              index={2}
            />
            
            {/* New metrics */}
            <ActionCard
              title="Total Categories"
              value={metrics.totalCategories}
              icon={Tag}
              onClick={()=>{navigate(`/inventory/categories`)}}
              color={COLORS.info}
              index={3}
            />
            <ActionCard
              title="Total SKUs"
              value={metrics.totalSkus.toLocaleString()}
              icon={Package}
              color={COLORS.success}
              index={4}
            />
            <ActionCard
              title="Recent Vendors"
              value={metrics.recentVendors.length}
              secondaryText="View Details"
              icon={Truck}
              color={COLORS.primary}
              onClick={() => navigate("/inventory/vendors")}
              index={5}
            />
          </div>

          {/* Category selection section */}
        
        </main>
      </div>
      
      {/* Modal for selected category details */}
      <CategoryDetailsModal />

    </MainLayout>
  );
};

export default InventoryAnalytics;