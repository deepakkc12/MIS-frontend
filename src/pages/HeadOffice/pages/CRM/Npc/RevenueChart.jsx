import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label
} from 'recharts';

const RevenueChart = ({ monthlyTrendData, performanceMetrics }) => {
  // State for controlling animations
  const [showChart, setShowChart] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  
  // Instead of animating data points individually, we'll use Recharts' built-in animations
  useEffect(() => {
    // Trigger chart visibility after a short delay
    const chartTimer = setTimeout(() => {
      setShowChart(true);
    }, 300);
    
    // Trigger metrics visibility after chart animation
    const metricsTimer = setTimeout(() => {
      setShowMetrics(true);
    }, 1500);
    
    return () => {
      clearTimeout(chartTimer);
      clearTimeout(metricsTimer);
    };
  }, []);

  // Custom tooltip component with improved styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-md border border-gray-200">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }} 
              />
              <p className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                <span className="font-semibold">₹{entry.value.toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format numbers to display with ₹ and commas
  const formatYAxis = (value) => `₹${value.toLocaleString()}`;

  // Calculate percent difference for metric cards
  const getChangeDisplay = (percent) => {
    const isPositive = percent >= 0;
    const formattedPercent = Math.abs(percent).toFixed(1);
    const icon = isPositive ? '↑' : '↓';
    const textColor = isPositive ? 'text-emerald-600' : 'text-red-600';
    const bgColor = isPositive ? 'bg-emerald-50' : 'bg-red-50';
    
    return { icon, formattedPercent, textColor, bgColor };
  };

  const octToNovDisplay = getChangeDisplay(performanceMetrics?.octToNovChange || 0);
  const novToDecDisplay = getChangeDisplay(performanceMetrics?.novToDecChange || 0);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-all duration-500 hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Revenue Trend & Forecast</h2>
        <div className="flex space-x-2">
          {/* <button className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Monthly</button>
          <button className="text-sm px-3 py-1 text-gray-500 rounded-full font-medium">Quarterly</button> */}
        </div>
      </div>
      
      <div className="h-72 transition-opacity duration-700" style={{ opacity: showChart ? 1 : 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={monthlyTrendData} 
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              name="Actual Revenue" 
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-out"
            />
            <Area 
              type="monotone" 
              dataKey="projected" 
              stroke="#EF4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorProjected)" 
              name="Lost Revenue" 
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-out"
              animationBegin={300}
            />
            <Line 
              type="monotone" 
              dataKey="avg" 
              name="Target Revenue" 
              stroke="#10B981" 
              strokeWidth={2}
              strokeDasharray="5 5" 
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-out"
              animationBegin={600}
            />
            <ReferenceLine 
              x="DEC" 
              stroke="#FB923C" 
              strokeWidth={2}
              strokeDasharray="3 3"
            >
              <Label 
                value="Service Outage" 
                position="top" 
                fill="#FB923C"
                fontSize={12}
                fontWeight={500}
              />
            </ReferenceLine>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div 
          className={`${octToNovDisplay.bgColor} p-3 rounded-lg transition-all duration-500`}
          style={{ 
            opacity: showMetrics ? 1 : 0,
            transform: showMetrics ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '200ms'
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-medium text-gray-600">OCT → NOV</p>
            <span className={`text-xs font-bold ${octToNovDisplay.textColor}`}>MoM</span>
          </div>
          <p className={`text-lg font-bold ${octToNovDisplay.textColor}`}>
            {octToNovDisplay.icon} {octToNovDisplay.formattedPercent}%
          </p>
        </div>
        
        <div 
          className={`${novToDecDisplay.bgColor} p-3 rounded-lg transition-all duration-500`}
          style={{ 
            opacity: showMetrics ? 1 : 0,
            transform: showMetrics ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '300ms'
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-medium text-gray-600">NOV → DEC</p>
            <span className={`text-xs font-bold ${novToDecDisplay.textColor}`}>MoM</span>
          </div>
          <p className={`text-lg font-bold ${novToDecDisplay.textColor}`}>
            {novToDecDisplay.icon} {novToDecDisplay.formattedPercent}%
          </p>
        </div>
        
        <div 
          className="bg-red-50 p-3 rounded-lg transition-all duration-500 hover:shadow-md"
          style={{ 
            opacity: showMetrics ? 1 : 0,
            transform: showMetrics ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '400ms'
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-medium text-gray-600">DEC → JAN</p>
            <span className="text-xs font-bold text-red-600">MoM</span>
          </div>
          <p className="text-lg font-bold text-red-600">
            ↓ 100.0%
          </p>
          <p className="text-xs text-red-500 mt-1">Service Outage</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;