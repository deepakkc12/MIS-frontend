import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Filter, Download, Zap, TrendingDown, ArrowRight, AlertTriangle, X, BarChart2, ArrowUpRight, ShoppingBag } from 'lucide-react';
import MainLayout from '../../../Layout/Layout';
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';
import { useNavigate } from 'react-router-dom';

const SalesOpportunityDashboard = ({ ActionCard, activeModal = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(activeModal);
  const [sampleData, setSampleData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  const navigate = useNavigate();

  const getData = async () => {
    const response = await getRequest(`sales-loss/summery/`);
    if (response.success) {
      const data = response.data.map(d => {
        return {
          ...d,
          active: parseFloat(d.D1) <= 0
        };
      });
      setSampleData(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Processed data for visualizations
  const totalLoss = sampleData.reduce((sum, item) => sum + parseFloat(item.SalesLossInWeek), 0);
  const activeItems = sampleData.filter(item => parseFloat(item.D1) <= 0);

  // Create reason-based grouped data
  const byReason = Array.from(new Set(sampleData.map(item => item.GroupName))).map(group => {
    const groupItems = sampleData.filter(item => item.GroupName === group);
    const loss = groupItems.reduce((sum, item) => sum + parseFloat(item.SalesLossInWeek), 0);
    const avgSales = groupItems.reduce((sum, item) => sum + parseFloat(item.AvgaSalesPerDay), 0) / groupItems.length;
    const margin = Math.round((loss / avgSales) * 100) / 100;

    return {
      reason: group,
      loss: parseFloat(loss.toFixed(2)),
      avgMargin: parseFloat((margin * 100).toFixed(2))
    };
  });

  // Create time-based data (using D1-D7 as days)
  const byTimespan = [
    { day: 'Day 1', loss: sumDayLoss('D1'), avgSalesPerDay: sumDaySales('D1') },
    { day: 'Day 2', loss: sumDayLoss('D2'), avgSalesPerDay: sumDaySales('D2') },
    { day: 'Day 3', loss: sumDayLoss('D3'), avgSalesPerDay: sumDaySales('D3') },
    { day: 'Day 4', loss: sumDayLoss('D4'), avgSalesPerDay: sumDaySales('D4') },
    { day: 'Day 5', loss: sumDayLoss('D5'), avgSalesPerDay: sumDaySales('D5') },
    { day: 'Day 6', loss: sumDayLoss('D6'), avgSalesPerDay: sumDaySales('D6') },
    { day: 'Day 7', loss: sumDayLoss('D7'), avgSalesPerDay: sumDaySales('D7') }
  ];

  function sumDayLoss(day) {
    return parseFloat(sampleData.reduce((sum, item) => {
      const dayValue = parseFloat(item[day]);
      return sum + (dayValue < 0 ? Math.abs(dayValue) * parseFloat(item.cuWSales) : 0);
    }, 0).toFixed(2));
  }

  function sumDaySales(day) {
    return parseFloat(sampleData.reduce((sum, item) => {
      const dayValue = parseFloat(item[day]);
      return sum + (dayValue > 0 ? dayValue * parseFloat(item.cuWSales) : 0);
    }, 0).toFixed(2));
  }

  // Get average margin impact
  const avgMarginImpact = Math.round(byReason.reduce((sum, item) => sum + item.avgMargin, 0) / byReason.length);

  // Color constants
  const COLORS = {
    primary: '#4F46E5',
    secondary: '#10B981',
    danger: '#EF4444',
    info: '#3B82F6',
    warning: '#F59E0B'
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const headers = [
    {
      key: "SkuName",
      label: "Product",
      style: (row) => {
        if (row.active) {
          return 'bg-red-500/90 text-white';
        }
      },
      onColumnClick: (v, r) => {
        setSelectedProduct(r);
        setIsProductDetailOpen(true);
      }
    },
    {
      key: "GroupName",
      label: "Group",
      style: (row) => {
        if (row.active) {
          return 'bg-red-500/90 text-white';
        }
      }
    },
    {
      key: "AvgaSalesPerDay",
      label: "Avg Sales/Day",
      style: (row) => {
        if (row.active) {
          return 'bg-red-500/90 text-white';
        }
      }
    },
    {
      key: "cuWSales",
      label: "Current Week Sales",
      style: (row) => {
        if (row.active) {
          return 'bg-red-500/90 text-white';
        }
      }
    },
    {
      key: "SalesLossInWeek",
      label: "Potential Loss",
      style: (row) => {
        if (row.active) {
          return 'bg-red-500/90 text-white';
        }
      }
    },
  ];

  // Generate daily stock data for product detail modal
  const getProductDailyData = (product) => {
    if (!product) return [];
    
    return [
      { name: 'Day 7', stock: parseFloat(product.D7),},
      { name: 'Day 6', stock: parseFloat(product.D6),},
      { name: 'Day 5', stock: parseFloat(product.D5),},
      { name: 'Day 4', stock: parseFloat(product.D4),},
      { name: 'Day 3', stock: parseFloat(product.D3),},
      { name: 'Day 2', stock: parseFloat(product.D2),},
      { name: 'Day 1', stock: parseFloat(product.D1),}
    ];
  };

  // Calculate average stock level for a product
  const getAverageStock = (product) => {
    if (!product) return 0;
    const stockValues = [
      parseFloat(product.D1),
      parseFloat(product.D2),
      parseFloat(product.D3),
      parseFloat(product.D4),
      parseFloat(product.D5),
      parseFloat(product.D6),
      parseFloat(product.D7)
    ];
    return (stockValues.reduce((sum, val) => sum + val, 0) / 7).toFixed(2);
  };

  // Count days with negative stock
  const getNegativeStockDays = (product) => {
    if (!product) return 0;
    return [
      parseFloat(product.D1),
      parseFloat(product.D2),
      parseFloat(product.D3),
      parseFloat(product.D4),
      parseFloat(product.D5),
      parseFloat(product.D6),
      parseFloat(product.D7)
    ].filter(val => val < 0).length;
  };

  // Product Detail Modal
  const ProductDetailModal = () => {
    if (!selectedProduct) return null;

    const dailyData = getProductDailyData(selectedProduct);
    const averageStock = getAverageStock(selectedProduct);
    const negativeStockDays = getNegativeStockDays(selectedProduct);

    return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
    <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.SkuName}</h2>
              <p className="text-gray-500">SKU Code: {selectedProduct.Code} | Group: {selectedProduct.GroupName}</p>
            </div>
            <button
              onClick={() => setIsProductDetailOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center mb-2">
                <ShoppingBag className="text-blue-600 mr-2" size={18} />
                <h3 className="text-sm font-semibold text-gray-600 uppercase">
                  Avg Sales/Day
                </h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ₹{parseFloat(selectedProduct.AvgaSalesPerDay).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 shadow-sm">
              <div className="flex items-center mb-2">
                <AlertTriangle className="text-amber-600 mr-2" size={18} />
                <h3 className="text-sm font-semibold text-gray-600 uppercase">
                  Potential Loss
                </h3>
              </div>
              <p className="text-2xl font-bold text-amber-600">
                ₹{parseFloat(selectedProduct.SalesLossInWeek).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200 shadow-sm">
              <div className="flex items-center mb-2">
                <TrendingDown className="text-red-600 mr-2" size={18} />
                <h3 className="text-sm font-semibold text-gray-600 uppercase">
                  Negative Stock Days
                </h3>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {negativeStockDays} days
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">7-Day Stock Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke={COLORS.primary}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke={COLORS.info}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="stock"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    name="Stock Level"
                    dot={{ stroke: COLORS.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: COLORS.primary, strokeWidth: 2, r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke={COLORS.info}
                    strokeWidth={2}
                    name="Sales Per Day"
                    dot={{ stroke: COLORS.info, strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: COLORS.info, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Daily Stock Levels</h4>
              <div className="grid grid-cols-2 gap-2">
                {['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1'].map((day, index) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600">Day {index + 1}:</span>
                    <span className={`font-medium ${parseFloat(selectedProduct[day]) <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {parseFloat(selectedProduct[day]).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Additional Insights</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Stock:</span>
                  <span className={`font-medium ${parseFloat(averageStock) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {averageStock}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Week Sales:</span>
                  <span className="font-medium text-blue-600">₹{parseFloat(selectedProduct.cuWSales).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Status:</span>
                  <span className={`font-medium ${selectedProduct.active ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedProduct.active ? 'Critical' : 'Normal'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsProductDetailOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
            >
              Close
            </button>
            <button
              onClick={() => navigate(`/inventory/sku-details?sku=${selectedProduct.Code}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
            >
              <span>View Full Details</span>
              <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isModalOpen) return null;

  return (
    <MainLayout className="fixed  bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg  w-full  ">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Sales Opportunity Loss Analysis
            </h2>
            <p className="text-gray-500">Track and analyze potential sales losses</p>
          </div>
          {/* <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X size={24} />
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center mb-2">
              <TrendingDown className="text-blue-600 mr-2" size={20} />
              <h3 className="text-sm font-semibold text-gray-600 uppercase">
                Total Loss Projection
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              ₹{totalLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">Potential revenue impact</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-sm">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-green-600 mr-2" size={20} />
              <h3 className="text-sm font-semibold text-gray-600 uppercase">
                Active Issues
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {activeItems.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Items requiring attention</p>
          </div>
        </div>

        <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm mb-8">
          <div className="overflow-x-auto">
            <TableLayout
              title='Stock Report'
              data={sampleData}
              headers={headers}
              actionText="Click on product name for detailed analysis"
            />
          </div>
          <div className="text-gray-500 text-sm italic mt-4">
            Note: Sales opportunity loss is calculated based on negative stock days
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Loss Trend Analysis (7-Day View)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byTimespan}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke={COLORS.danger}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={COLORS.info}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="loss"
                  stroke={COLORS.danger}
                  strokeWidth={2}
                  name="Loss Amount (₹)"
                  dot={{ stroke: COLORS.danger, strokeWidth: 2, r: 4 }}
                  activeDot={{ stroke: COLORS.danger, strokeWidth: 2, r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgSalesPerDay"
                  stroke={COLORS.info}
                  strokeWidth={2}
                  name="Avg Sales/Day"
                  dot={{ stroke: COLORS.info, strokeWidth: 2, r: 4 }}
                  activeDot={{ stroke: COLORS.info, strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-gray-500 text-sm italic mt-2 text-center">
            Note: Sales opportunity loss is calculated by ignoring the negative stocks
          </div>
        </div>

        {isProductDetailOpen && <ProductDetailModal />}
      </div>
    </MainLayout>
  );
};

export default SalesOpportunityDashboard;