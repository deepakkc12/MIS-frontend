import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const SalesPerformanceChart = ({ getDisplayData, getPreviousData,comparisonMode }) => {
  // Helper functions

  const getXAxisKey = () => 'period';
  
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };
  
  const formatYAxisValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-8 border border-gray-100">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Sales Performance</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={getDisplayData()} 
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey={getXAxisKey()} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#9ca3af' }}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#2BA697"
            tickFormatter={formatYAxisValue}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={[0, 'auto']}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#0E60B6"
            tickFormatter={(value) => formatYAxisValue(value)}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={[0, 'dataMax + 10%']} // Add padding to ensure line is always visible
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
            formatter={(value, name) => {
              if (name === "Revenue" || name === "Previous Period Revenue") 
                return [formatCurrency(value), name];
              return [value.toLocaleString(), name];
            }}
            labelFormatter={(label) => {
              return `Period: ${label}`;
            }}
          />
          <Legend />
          <defs>
            <linearGradient id="colorNob" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2BA697" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2BA697" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0E60B6" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#0E60B6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPrevAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          {/* Sales Area Chart */}
          <Area 
            yAxisId="left" 
            type="monotone"
            dataKey="nob" 
            name="Number of Sales" 
            fill="url(#colorNob)"
            stroke="#2BA697"
            strokeWidth={2}
            fillOpacity={0.8}
          />
          
          {/* Current Revenue Area Chart with Line */}
          <Area 
            yAxisId="right" 
            type="monotone" 
            dataKey="grossAmount" 
            name="Revenue" 
            fill="url(#colorAmount)"
            stroke="#0E60B6" 
            strokeWidth={3}
            fillOpacity={0.8}
          />
          
          {/* Add a line on top to ensure visibility */}
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="grossAmount" 
            stroke="#0E60B6" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1, fill: "#0E60B6" }}
            activeDot={{ r: 6 }}
            name=""
          />
          
          {/* Previous Period Revenue (conditional) */}
          {comparisonMode && (
            <>
              <Area 
                yAxisId="right" 
                type="monotone" 
                data={getPreviousData()} 
                dataKey="grossAmount" 
                name="Previous Period Revenue" 
                fill="url(#colorPrevAmount)"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={0.6}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                data={getPreviousData()} 
                dataKey="grossAmount" 
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1, fill: "#F59E0B" }}
                name=""
              />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPerformanceChart;