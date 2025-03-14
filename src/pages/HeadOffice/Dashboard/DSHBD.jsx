import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid,BarChart,Bar, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import MainLayout from '../Layout/Layout';
import { getTotalSalesSummeryDetails } from '../../../services/apis/Reports/reports';
import { Currency } from '../../../utils/constants';
import SalesComparisonChart from '../../DshBd';
import SalesDashboard from './components/SalesView';

// Color palette
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#6366F1'
};

const ERPDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [zeroStockItems, setZeroStockItems] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [salesOpportunityData, setSalesOpportunityData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 45000,
    profitMargin: 28,
    zeroStockCount: 0,
    salesOpportunityLoss: 100000,
    totalCustomers:0
  });

  const [salesLossData, setSalesLossData] = useState({
    byReason: [],
    byTimespan: [],
    activeItems: [],
    totalLoss: 0
  });

  const getMatricsData =async ()=>{

      try {
        const data = await getTotalSalesSummeryDetails()

        setMetrics({
          totalRevenue: data.TotalRevenue,
          profitMargin: data.ProfitMarginPercentage,
          zeroStockCount: 2,
          salesOpportunityLoss: 100000,
          totalCustomers : data.TotalCustomers
        })

      } catch (error) {
        console.error(error)
      }
  }

  useEffect(() => {
    // Simulated data fetching
    const mockSalesData = [
      { month: 'Jan', sales: 4000, target: 3500 },
      { month: 'Feb', sales: 3000, target: 3500 },
      { month: 'Mar', sales: 5000, target: 3500 },
      { month: 'Apr', sales: 4500, target: 3500 },
      { month: 'May', sales: 6000, target: 3500 }
    ];
    setSalesData(mockSalesData);

    const mockZeroStock = [
      { 
        sku: 'SKU001', 
        name: 'Product A',
        category: 'Electronics',
        potentialLoss: 15000,
        lastStocked: '2023-12-25'
      },
      { 
        sku: 'SKU002', 
        name: 'Product B',
        category: 'Apparel',
        potentialLoss: 7500,
        lastStocked: '2023-12-28'
      }
    ];
    setZeroStockItems(mockZeroStock);

    const mockCategoryData = [
      { name: 'Electronics', value: 400 },
      { name: 'Apparel', value: 300 },
      { name: 'Home', value: 200 }
    ];

    setCategoryData(mockCategoryData);

    const mockSalesLossData = {
        byReason: [
          { reason: 'Stock Stockout', count: 15, loss: 45000, avgMargin: 28 },
          { reason: 'Price Mismatch', count: 8, loss: 22000, avgMargin: 32 },
          { reason: 'Seasonal Demand Miss', count: 12, loss: 33000, avgMargin: 25 }
        ],
        byTimespan: [
          { month: 'Jan', loss: 15000, avgSalesPerDay: 500 },
          { month: 'Feb', loss: 22000, avgSalesPerDay: 550 },
          { month: 'Mar', loss: 18000, avgSalesPerDay: 600 }
        ],
        activeItems: [
          {
            skuCode: 'SKU001',
            reason: 'Stock Stockout',
            dateFrom: '2024-01-15',
            dateTo: '2024-01-30',
            avgMargin: 28,
            avgSalesPerDay: 450,
            potentialLoss: 15000
          },
          {
            skuCode: 'SKU002',
            reason: 'Price Mismatch',
            dateFrom: '2024-01-20',
            dateTo: '2024-02-05',
            avgMargin: 32,
            avgSalesPerDay: 380,
            potentialLoss: 12000
          }
        ],
        totalLoss: 100000
      };
      setSalesLossData(mockSalesLossData);
      getMatricsData()
  }, []);

  const ZeroStockModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Zero Stock Items</h2>
          <button 
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Last Stocked</th>
                <th className="p-3 text-right">Potential Loss</th>
              </tr>
            </thead>
            <tbody>
              {zeroStockItems.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{item.sku}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{new Date(item.lastStocked).toLocaleDateString()}</td>
                  <td className="p-3 text-right text-red-600">${item.potentialLoss.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

 const SalesOpportunityModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sales Opportunity Loss Analysis</h2>
          <button 
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Loss Projection</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${salesLossData.totalLoss.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Active Issues</h3>
            <p className="text-2xl font-bold text-green-600">
              {salesLossData.activeItems.length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Avg Margin Impact</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {Math.round(salesLossData.byReason.reduce((acc, item) => acc + item.avgMargin, 0) / salesLossData.byReason.length)}%
            </p>
          </div>
        </div>

        {/* Loss by Reason Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Loss Distribution by Reason</h3>
          <BarChart width={700} height={300} data={salesLossData.byReason}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="reason" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="loss" fill={COLORS.primary} name="Loss Amount ($)" />
            <Bar dataKey="avgMargin" fill={COLORS.secondary} name="Avg Margin (%)" />
          </BarChart>
        </div>

        {/* Active Issues Table */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Active Issues</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Date Range</th>
                  <th className="p-3 text-right">Avg Sales/Day</th>
                  <th className="p-3 text-right">Margin</th>
                  <th className="p-3 text-right">Potential Loss</th>
                </tr>
              </thead>
              <tbody>
                {salesLossData.activeItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.skuCode}</td>
                    <td className="p-3">{item.reason}</td>
                    <td className="p-3">
                      {new Date(item.dateFrom).toLocaleDateString()} - {new Date(item.dateTo).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">${item.avgSalesPerDay}</td>
                    <td className="p-3 text-right">{item.avgMargin}%</td>
                    <td className="p-3 text-right text-red-600">${item.potentialLoss.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loss Trend Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Loss Trend Analysis</h3>
          <LineChart width={700} height={300} data={salesLossData.byTimespan}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="loss" stroke={COLORS.danger} name="Loss Amount ($)" />
            <Line yAxisId="right" type="monotone" dataKey="avgSalesPerDay" stroke={COLORS.info} name="Avg Sales/Day" />
          </LineChart>
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow  hover:shadow-lg transition-all">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 uppercase">{title}</p>
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold">{value}</span>
            {/* {change && (
              <span className={`ml-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
            )} */}
          </div>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>

    <div className="min-h-screen rounded-md bg-gray-50 p-6">
      {activeModal === 'zeroStock' && <ZeroStockModal />}
      {activeModal === 'salesOpportunity' && <SalesOpportunityModal />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard 
          title="Total Revenue" 
          value={`${ Currency+metrics.totalRevenue.toLocaleString()}`}
          change={-12.5}
          icon={DollarSign}
          color={COLORS.primary}
        />
        <MetricCard 
          title="Profit Margin" 
          value={`${metrics.profitMargin}%`}
          change={2.3}
          icon={TrendingUp}
          color={COLORS.secondary}
        />
        <MetricCard 
          title="Total Customers" 
          value={`${metrics.totalCustomers}`}
          change={2.3}
          icon={TrendingUp}
          color={COLORS.secondary}
        />
         <div 
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer"
          onClick={() => setActiveModal('zeroStock')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 uppercase">Price Revisions</p>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold">{zeroStockItems.length}</span>
                <span className="ml-2 text-sm text-red-500">Critical</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span>View Details</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer"
          onClick={() => setActiveModal('zeroStock')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 uppercase">Zero Stock Items</p>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold">{zeroStockItems.length}</span>
                <span className="ml-2 text-sm text-red-500">Critical</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span>View Details</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer"
          onClick={() => setActiveModal('salesOpportunity')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 uppercase">Sales Opportunity Loss</p>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold">${metrics.salesOpportunityLoss.toLocaleString()}</span>
                <span className="ml-2 text-sm text-red-500">Impact</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span>View Details</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Rest of the dashboard components remain the same */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Sales Performance</h2>
          <LineChart width={700} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke={COLORS.primary} strokeWidth={2} />
            <Line type="monotone" dataKey="target" stroke={COLORS.secondary} strokeDasharray="5 5" />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={categoryData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <SalesDashboard/>

      <div className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {[
              { icon: <AlertTriangle className="text-yellow-500" />, message: 'Low stock alert for SKU001', time: '2h ago' },
              { icon: <Bell className="text-blue-500" />, message: 'Price revision pending for SKU002', time: '4h ago' },
              { icon: <CheckCircle className="text-green-500" />, message: 'Stock updated for SKU003', time: '1d ago' }
            ].map((alert, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {alert.icon}
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </MainLayout>

  );
};

export default ERPDashboard;