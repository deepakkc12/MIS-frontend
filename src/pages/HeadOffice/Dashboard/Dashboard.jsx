import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import MainLayout from '../Layout/Layout';
import SalesComparisonChart from '../../DshBd';

// Consistent color palette
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#6366F1'
};

// Sample data
const salesData = [
  { month: 'Jan', sales: 4000, target: 3500 },
  { month: 'Feb', sales: 3000, target: 3500 },
  { month: 'Mar', sales: 5000, target: 3500 },
  { month: 'Apr', sales: 4500, target: 3500 },
  { month: 'May', sales: 6000, target: 3500 },
];

const inventoryData = [
  { name: 'Electronics', value: 400, icon: <Package /> },
  { name: 'Clothing', value: 300, icon: <Users /> },
  { name: 'Furniture', value: 200, icon: <TrendingUp /> },
];

// Zero Stock and Sales Opportunity Data
const zeroStockItems = [
  { 
    sku: 'ELEC-001', 
    name: 'Wireless Headphones', 
    category: 'Electronics', 
    potentialLoss: 15000,
    lastStocked: '2 months ago'
  },
  { 
    sku: 'CLOTH-005', 
    name: 'Summer Collection Shirt', 
    category: 'Clothing', 
    potentialLoss: 7500,
    lastStocked: '1 month ago'
  },
];

const salesOpportunityData = [
  { category: 'Electronics', opportunityLoss: 45000 },
  { category: 'Clothing', opportunityLoss: 22000 },
  { category: 'Furniture', opportunityLoss: 33000 },
];

const ERPDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  const TotalSalesOpportunityLoss = salesOpportunityData.reduce((sum, item) => sum + item.opportunityLoss, 0);

  const ZeroStockModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Zero Stock Items</h2>
          <button 
            onClick={() => setActiveModal(null)} 
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">SKU</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Potential Loss</th>
            </tr>
          </thead>
          <tbody>
            {zeroStockItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3 font-bold text-red-600">${item.potentialLoss.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SalesOpportunityModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sales Opportunity Loss</h2>
          <button 
            onClick={() => setActiveModal(null)} 
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <PieChart width={500} height={300}>
          <Pie
            data={salesOpportunityData}
            cx={250}
            cy={150}
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="opportunityLoss"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {salesOpportunityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        {salesOpportunityData.map((item, index) => (
          <div key={index} className="flex justify-between p-2 border-b">
            <span>{item.category}</span>
            <span className="font-bold text-red-600">${item.opportunityLoss.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-5 border-l-4 hover:shadow-xl transition-all`} 
         style={{ borderColor: color }}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm uppercase tracking-wide">{title}</h3>
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold mr-3">{value}</span>
            <span className={`text-sm font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '▲' : '▼'} {Math.abs(change)}%
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: color + '20' }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
   <MainLayout>
     <div className="bg-gray-50  rounded-md min-h-screen p-6">
      {activeModal === 'zeroStock' && <ZeroStockModal />}
      {activeModal === 'salesOpportunity' && <SalesOpportunityModal />}

      <div className="grid grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Total Revenue" 
          value="$450K" 
          change={12.5} 
          icon={DollarSign} 
          color={COLORS.primary} 
        />
        <MetricCard 
          title="Profit Margin" 
          value="28%" 
          change={8.3} 
          icon={TrendingUp} 
          color={COLORS.secondary} 
        />
        <div 
          className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActiveModal('zeroStock')}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm uppercase tracking-wide">Zero Stock Items</h3>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold mr-3">{zeroStockItems.length}</span>
                <span className="text-red-500 text-sm">Critical</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span>View Details</span>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        <div 
          className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActiveModal('salesOpportunity')}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm uppercase tracking-wide">Sales Opportunity Loss</h3>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold mr-3">${TotalSalesOpportunityLoss.toLocaleString()}</span>
                <span className="text-red-500 text-sm">Impact</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span>View Details</span>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Sales Performance</h2>
            <div className="flex space-x-2">
              {['1M', '3M', '1Y'].map(period => (
                <button 
                  key={period} 
                  className="px-3 py-1 rounded-full text-sm hover:bg-blue-50 transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <LineChart width={700} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke={COLORS.primary} strokeWidth={3} />
            <Line type="monotone" dataKey="target" stroke={COLORS.secondary} strokeDasharray="5 5" />
          </LineChart>
        </div>

        {/* Inventory Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory Distribution</h2>
          <PieChart width={350} height={250}>
            <Pie
              data={inventoryData}
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {inventoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div className="flex justify-around mt-4">
            {inventoryData.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.icon}
                <span className="ml-2 text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-white rounded-2xl mx-auto mt-6 flex flex-col items-center justify-center shadow-lg p-6'>
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">Weakly Sales Comparison</h2>
      </div>
        <SalesComparisonChart/>
      </div>

      {/* Alerts & Tasks */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pending Tasks</h2>
            <button className="text-blue-500 hover:underline">View All</button>
          </div>
          {[
            { icon: <CheckCircle className="text-green-500" />, title: 'Approve PO #5672', time: '2h ago' },
            { icon: <AlertTriangle className="text-yellow-500" />, title: 'Inventory Audit', time: '1d ago' },
            { icon: <Bell className="text-blue-500" />, title: 'Team Meeting', time: 'Tomorrow' }
          ].map((task, index) => (
            <div key={index} className="flex justify-between items-center border-b py-3 last:border-b-0">
              <div className="flex items-center space-x-4">
                {task.icon}
                <span className="font-medium">{task.title}</span>
              </div>
              <span className="text-gray-500 text-sm">{task.time}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Alerts</h2>
          {[
            { type: 'warning', message: 'Low stock for Product A', icon: <AlertTriangle className="text-yellow-500" /> },
            { type: 'error', message: 'Payment gateway issue', icon: <Bell className="text-red-500" /> },
            { type: 'info', message: 'Software update available', icon: <CheckCircle className="text-blue-500" /> }
          ].map((alert, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 border-b py-3 last:border-b-0"
            >
              {alert.icon}
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
   </MainLayout>
  );
};

export default ERPDashboard;