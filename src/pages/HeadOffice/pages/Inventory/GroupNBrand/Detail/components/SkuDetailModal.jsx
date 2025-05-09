import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { X, DollarSign, TrendingUp, Percent, ExternalLink } from 'lucide-react';

// Badge component for customer levels
const LevelBadge = ({ level, count }) => {
  const colors = {
    L1: 'bg-blue-100 text-blue-800',
    L2: 'bg-green-100 text-green-800',
    L3: 'bg-yellow-100 text-yellow-800',
    L4: 'bg-purple-100 text-purple-800',
    Low: 'bg-gray-100 text-gray-800',
  };
  
  return count > 0 ? (
    <span className={`${colors[level]} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {level}: {count}
    </span>
  ) : null;
};

// Card component
const Card = ({ title, value, subValue, icon, trend, color }) => {
  const Icon = icon;
  const isPositive = trend > 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
          <h3 className="text-lg font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-1">
            <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      {subValue && <p className="text-xs text-gray-500 mt-2">{subValue}</p>}
    </div>
  );
};

const SkuDetailModal = ({ sku, isOpen, onClose, onViewFullDetail }) => {
  if (!isOpen || !sku) return null;
  
  // Calculate profit data
  const currentProfit = sku.currentSales - sku.currentCogs;
  const prevProfit = sku.prevSales - sku.prevCogs;
  const profitGrowth = prevProfit !== 0 ? ((currentProfit - prevProfit) / prevProfit * 100).toFixed(1) : 0;
  
  // Prepare chart data for the SKU
  const monthlyData = [
    { name: 'Previous', sales: sku.prevSales, cogs: sku.prevCogs, profit: prevProfit, margin: sku.prevMargin },
    { name: 'Current', sales: sku.currentSales, cogs: sku.currentCogs, profit: currentProfit, margin: sku.currentMargin }
  ];
  
  // Modal backdrop with content
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        {/* Modal header */}
        <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h1 className="text-xl font-bold">{sku.name}</h1>
            <p className="text-sm text-gray-500">SKU Code: {sku.code} | Brand: {sku.brand}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
              onClick={onViewFullDetail}
            >
              <span>View Full Detail</span>
              <ExternalLink size={16} className="ml-1" />
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Modal body */}
        <div className="p-6">
          {/* Customer segments */}
          <div className="flex flex-wrap gap-1 mb-4">
            <LevelBadge level="L1" count={sku.L1Choice} />
            <LevelBadge level="L2" count={sku.L2Choice} />
            <LevelBadge level="L3" count={sku.L3Choice} />
            <LevelBadge level="L4" count={sku.L4Choice} />
            <LevelBadge level="Low" count={sku.LowChoice} />
            <p className="text-xs text-gray-500 ml-2">
              Quantity: {sku.cQty} {sku.uom}
            </p>
          </div>
          
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card 
              title="Sales"
              value={`₹${sku.currentSales.toFixed(2)}`}
              icon={DollarSign}
              trend={sku.growth}
              color="bg-blue-500"
            />
            <Card 
              title="Profit"
              value={`₹${currentProfit.toFixed(2)}`}
              icon={TrendingUp}
              trend={profitGrowth}
              color="bg-green-500"
            />
            <Card 
              title="Margin"
              value={`${sku.currentMargin}%`}
              icon={Percent}
              trend={sku.prevMargin !== 0 ? (sku.currentMargin - sku.prevMargin).toFixed(1) : 0}
              color="bg-purple-500"
            />
          </div>
          
          {/* Chart */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Monthly Performance</h2>
            <div className="border rounded-lg p-4 bg-gray-50">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#3B82F6" />
                  <Bar dataKey="cogs" name="Cost" fill="#EF4444" />
                  <Bar dataKey="profit" name="Profit" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Customer Segment Analysis */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Customer Segment Analysis</h2>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">
                This product has primarily {
                  sku.L1Choice > Math.max(sku.L2Choice, sku.L3Choice, sku.L4Choice, sku.LowChoice) ? 'premium (L1)' :
                  sku.L2Choice > Math.max(sku.L1Choice, sku.L3Choice, sku.L4Choice, sku.LowChoice) ? 'regular high-value (L2)' :
                  sku.L3Choice > Math.max(sku.L1Choice, sku.L2Choice, sku.L4Choice, sku.LowChoice) ? 'occasional (L3)' :
                  sku.L4Choice > Math.max(sku.L1Choice, sku.L2Choice, sku.L3Choice, sku.LowChoice) ? 'infrequent (L4)' :
                  'low frequency'
                } customers, which suggests {
                  sku.L1Choice > Math.max(sku.L2Choice, sku.L3Choice, sku.L4Choice, sku.LowChoice) ? 'it attracts high-value customers. Consider premium pricing strategies.' :
                  sku.L2Choice > Math.max(sku.L1Choice, sku.L3Choice, sku.L4Choice, sku.LowChoice) ? 'it has a solid base of regular customers. Focus on retention.' :
                  sku.L3Choice > Math.max(sku.L1Choice, sku.L2Choice, sku.L4Choice, sku.LowChoice) ? 'it appeals to occasional shoppers. Consider promotion strategies.' :
                  sku.L4Choice > Math.max(sku.L1Choice, sku.L2Choice, sku.L3Choice, sku.LowChoice) ? 'it mostly attracts infrequent buyers. Evaluate product positioning.' :
                  'it has minimal customer loyalty. Review product viability.'
                }
              </p>
              
              <div className="grid grid-cols-5 gap-1 mt-3">
                {sku.L1Choice > 0 && (
                  <div className="bg-blue-100 text-blue-800 p-2 rounded text-center">
                    <p className="text-xs font-medium">L1</p>
                    <p className="text-sm font-bold">{sku.L1Choice}</p>
                  </div>
                )}
                {sku.L2Choice > 0 && (
                  <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                    <p className="text-xs font-medium">L2</p>
                    <p className="text-sm font-bold">{sku.L2Choice}</p>
                  </div>
                )}
                {sku.L3Choice > 0 && (
                  <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center">
                    <p className="text-xs font-medium">L3</p>
                    <p className="text-sm font-bold">{sku.L3Choice}</p>
                  </div>
                )}
                {sku.L4Choice > 0 && (
                  <div className="bg-purple-100 text-purple-800 p-2 rounded text-center">
                    <p className="text-xs font-medium">L4</p>
                    <p className="text-sm font-bold">{sku.L4Choice}</p>
                  </div>
                )}
                {sku.LowChoice > 0 && (
                  <div className="bg-gray-100 text-gray-800 p-2 rounded text-center">
                    <p className="text-xs font-medium">Low</p>
                    <p className="text-sm font-bold">{sku.LowChoice}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end sticky bottom-0 bg-white">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkuDetailModal;