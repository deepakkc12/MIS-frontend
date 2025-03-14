import React from 'react';
import { X } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const CustomerModal = ({ 
  selectedCustomer, 
  onClose, 
  animationEnabled = true 
}) => {
  
  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Revenue: <span className="font-semibold">₹{payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const navigate = useNavigate()

  // Helper functions
  const getRadarChartData = (customer) => {
    // Replace with your actual implementation
    return [
      { subject: 'Revenue', A: customer.contributionPercentage * 100 },
      { subject: 'Frequency', A: (customer.NOB / 10) * 100 },
      { subject: 'Growth', A: 60 }, // Example value
      { subject: 'Loyalty', A: 85 }, // Example value
      { subject: 'Recency', A: 70 }, // Example value
    ];
  };

  const getCustomerInsights = (customer) => {
    // Replace with your actual implementation
    return {
      trend: 'Consistent',
      variabilityIndex: 23,
      recoveryPotential: 'High',
      recommendation: 'This customer has shown consistent buying patterns. Consider offering a loyalty program to increase engagement.',
    };
  };

  if (!selectedCustomer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Customer Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Profile Section */}
            <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Customer Profile</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  ID: {selectedCustomer.code}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold">{selectedCustomer.Name}</h3>
                <p className="text-gray-600">
                  <span className="inline-block mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {selectedCustomer.Phone}
                  </span>
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-lg font-bold">₹{selectedCustomer.totalRevenue?.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Avg. Bill Value</p>
                  <p className="text-lg font-bold">₹{selectedCustomer.ABV?.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Number of Bills</p>
                  <p className="text-lg font-bold">{selectedCustomer.NOB}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Contribution</p>
                  <p className="text-lg font-bold">{(selectedCustomer.contributionPercentage * 100).toFixed(2)}%</p>
                </div>
              </div>
              
             
              
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Monthly Revenue</h4>
                <div className="grid grid-cols-5 gap-1">
                  {selectedCustomer.revenueByMonth.map(item => (
                    <div key={item.month} className={`p-2 rounded text-center ${item.month === 'JAN' || item.month === 'FEB' ? 'bg-red-50' : 'bg-blue-50'}`}>
                      <p className="text-xs text-gray-500">{item.month}</p>
                      <p className={`text-sm font-medium ${item.month === 'JAN' || item.month === 'FEB' ? 'text-red-600' : ''}`}>
                        ₹{item.amount.toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Performance Analysis Section */}
            <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Performance Analysis</h2>

              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedCustomer.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#2196F3" 
                      name="Revenue"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationBegin={0}
                      animationDuration={animationEnabled ? 1000 : 0}
                    />
                    <ReferenceLine x="DEC" stroke="#FF9800" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarChartData(selectedCustomer)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Performance" 
                      dataKey="A" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.5}
                      animationBegin={0}
                      animationDuration={animationEnabled ? 1000 : 0}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div> */}
              
              {/* Insights */}
              {(() => {
                const insights = getCustomerInsights(selectedCustomer);
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Buying Pattern</p>
                        <p className="font-medium text-sm">{insights.trend}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Variability</p>
                        <p className="font-medium text-sm">{insights.variabilityIndex}%</p>
                      </div>
                      <div className={`p-2 rounded ${
                        insights.recoveryPotential === 'High' ? 'bg-green-50' : 
                        insights.recoveryPotential === 'Medium' ? 'bg-yellow-50' : 'bg-red-50'
                      }`}>
                        <p className="text-xs text-gray-500">Recovery Potential</p>
                        <p className={`font-medium text-sm ${
                          insights.recoveryPotential === 'High' ? 'text-green-600' : 
                          insights.recoveryPotential === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{insights.recoveryPotential}</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-gray-500 mb-1">Recommendation</p>
                      <p className="text-sm">{insights.recommendation}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md mr-2"
          >
            Close
          </button>
          <button 
            onClick={()=>navigate(`/crm/cut-details/${selectedCustomer.code}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Go to full profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;