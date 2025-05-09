import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getRequest } from '../../../../../services/apis/requests';
import MainLayout from '../../../Layout/Layout';

const ROIDashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest('acc/roi-list/');
      if (response.success) {
        setData(response.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('ROI data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Process data for better display - handle potential null or undefined values
  const processedData = data?.length ? data.map(item => ({
    Month: item.Month?.split('-')?.[1] || 'Unknown', // Extract just the month name with fallback
    MonthFull: item.Month || 'Unknown',
    Received: parseFloat(item.ReceivedAmount) || 0,
    Target: parseFloat(item.TargetAmount) || 0,
    Percentage: ((parseFloat(item.ReceivedAmount || 0) / parseFloat(item.TargetAmount || 1)) * 100).toFixed(1)
  })) : [];

  // Calculate totals and averages with safety checks
  const totalReceived = processedData.reduce((sum, item) => sum + item.Received, 0);
  const totalTarget = processedData.reduce((sum, item) => sum + item.Target, 0);
  const overallPercentage = totalTarget ? ((totalReceived / totalTarget) * 100).toFixed(1) : '0.0';

  // Find best and worst performing months
  const sortedByPerformance = [...processedData].sort((a, b) => parseFloat(b.Percentage) - parseFloat(a.Percentage));
  const bestMonth = sortedByPerformance.length ? sortedByPerformance[0] : null;
  const worstMonth = sortedByPerformance.length ? sortedByPerformance[sortedByPerformance.length - 1] : null;

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold text-gray-800 border-b pb-2 mb-2">{`${label} 2025`}</p>
          <p className="text-blue-600 flex justify-between">
            <span>Received:</span> 
            <span className="font-semibold">₹{payload[0]?.value.toLocaleString()}</span>
          </p>
          <p className="text-green-600 flex justify-between">
            <span>Target:</span> 
            <span className="font-semibold">₹{payload[1]?.value.toLocaleString()}</span>
          </p>
          <p className="font-medium text-purple-700 flex justify-between mt-2 pt-2 border-t">
            <span>Achievement:</span> 
            <span className="font-semibold">{((payload[0]?.value / payload[1]?.value) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Loading and error states
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-md" role="alert">
          <strong className="font-bold text-lg">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-all duration-200"
            onClick={getData}
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-gray-50 to-white p-8 rounded-xl shadow-xl">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">ROI Performance</h1>
          <p className="text-gray-600">Year-to-date ROI analysis for 2025</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 transition-transform hover:scale-105 duration-300">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">Total Received</p>
            <p className="text-xl font-bold text-blue-600 mt-2">₹{totalReceived.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500 transition-transform hover:scale-105 duration-300">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">Total Target</p>
            <p className="text-xl font-bold text-green-600 mt-2">₹{totalTarget.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500 transition-transform hover:scale-105 duration-300">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">Overall Achievement</p>
            <p className="text-xl font-bold text-purple-600 mt-2">{overallPercentage}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500 transition-transform hover:scale-105 duration-300">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">Monthly Average</p>
            <p className="text-xl font-bold text-orange-500 mt-2">
              ₹{(totalReceived / (processedData.length || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
        </div>

        {/* Additional Summary */}
        {bestMonth && worstMonth && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md border border-green-100 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm uppercase tracking-wider font-medium">Best Performing Month</p>
              </div>
              <p className="text-xl font-bold text-green-700">{bestMonth.Month} 2025</p>
              <p className="text-sm font-bold text-green-600 mb-3">{bestMonth.Percentage}% Achievement</p>
              <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                <div className="bg-white bg-opacity-70 p-2 rounded">
                  <p className="text-gray-500">Received</p>
                  <p className="font-bold text-gray-800">₹{bestMonth.Received.toLocaleString()}</p>
                </div>
                <div className="bg-white bg-opacity-70 p-2 rounded">
                  <p className="text-gray-500">Target</p>
                  <p className="font-bold text-gray-800">₹{bestMonth.Target.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl shadow-md border border-red-100 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm uppercase tracking-wider font-medium">Needs Improvement</p>
              </div>
              <p className="text-xl font-bold text-red-700">{worstMonth.Month} 2025</p>
              <p className="text-sm font-bold text-red-600 mb-3">{worstMonth.Percentage}% Achievement</p>
              <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                <div className="bg-white bg-opacity-70 p-2 rounded">
                  <p className="text-gray-500">Received</p>
                  <p className="font-bold text-gray-800">₹{worstMonth.Received.toLocaleString()}</p>
                </div>
                <div className="bg-white bg-opacity-70 p-2 rounded">
                  <p className="text-gray-500">Target</p>
                  <p className="font-bold text-gray-800">₹{worstMonth.Target.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Structure for Charts and Table */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <a className="inline-block p-4 border-b-2 border-blue-500 rounded-t-lg font-medium text-blue-600">
                  Performance Details
                </a>
              </li>
            </ul>
          </div>
          
          <div className="mt-6">
            {/* Monthly Performance Table */}
            <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Monthly Performance Breakdown</h2>
                <div className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">
                  {processedData.length} months analyzed
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Received (₹)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target (₹)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement (%)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processedData.map((item, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Month} 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-blue-600">₹{item.Received.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">₹{item.Target.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            parseFloat(item.Percentage) >= 90 ? 'bg-green-100 text-green-800' : 
                            parseFloat(item.Percentage) >= 75 ? 'bg-blue-100 text-blue-800' : 
                            parseFloat(item.Percentage) >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.Percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded ${
                            parseFloat(item.Percentage) >= 90 ? 'bg-green-50 text-green-700 border border-green-200' : 
                            parseFloat(item.Percentage) >= 75 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                            parseFloat(item.Percentage) >= 50 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {parseFloat(item.Percentage) >= 90 ? 'Excellent' :
                             parseFloat(item.Percentage) >= 75 ? 'Good' :
                             parseFloat(item.Percentage) >= 50 ? 'Fair' : 'Needs Attention'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">ROI Comparison Chart</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={processedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    barSize={25}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="Month" padding={{ left: 10, right: 10 }} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0, 0, 0, 0.05)'}} />
                    <Legend wrapperStyle={{paddingTop: 15}} />
                    <Bar dataKey="Received" name="Received Amount" radius={[4, 4, 0, 0]}>
                      {
                        processedData.map((entry, index) => (
                          <cell key={`cell-${index}`} fill="#3B82F6" />
                        ))
                      }
                    </Bar>
                    <Bar dataKey="Target" name="Target Amount" radius={[4, 4, 0, 0]}>
                      {
                        processedData.map((entry, index) => (
                          <cell key={`cell-${index}`} fill="#10B981" />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Line Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Achievement Trend</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart
                    data={processedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="Month" />
                    <YAxis domain={[0, 100]} unit="%" />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Achievement']}
                      contentStyle={{background: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Legend wrapperStyle={{paddingTop: 15}} />
                    <Line 
                      type="monotone" 
                      dataKey="Percentage" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }} 
                      name="Achievement %" 
                      strokeWidth={3}
                    />
                    {/* Reference lines for different thresholds */}
                    <svg>
                      <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="#10B981" strokeWidth="1" strokeDasharray="5,5" />
                      <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#FBBF24" strokeWidth="1" strokeDasharray="5,5" />
                    </svg>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ROIDashboard;