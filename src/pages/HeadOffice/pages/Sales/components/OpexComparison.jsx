import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart as BarChartIcon, Activity } from 'lucide-react';

const OpexSalesComparison = () => {
  // State management
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);
  const [chartType, setChartType] = useState('pie');

  // Data provided
  const data = {
    "opex": {
      "Mont1Debit": "198402.3631",
      "Mont1Credit": "37260.8152",
      "Mont2Debit": "98163.9314",
      "Mont2Credit": "1669.5122"
    },
    "sales": {
      "M1TotalSales": "5242544.5790",
      "M2TotalSales": "3553295.8410"
    }
  };

  const month1NetOpex = parseFloat(data.opex.Mont1Debit) - parseFloat(data.opex.Mont1Credit);
  const month2NetOpex = parseFloat(data.opex.Mont2Debit) - parseFloat(data.opex.Mont2Credit);
  
  // Parse sales values
  const month1Sales = parseFloat(data.sales.M1TotalSales);
  const month2Sales = parseFloat(data.sales.M2TotalSales);

  // Calculate percentages for bar chart
  const month1Total = month1Sales + month1NetOpex;
  const month2Total = month2Sales + month2NetOpex;
  
  // Prepare data for charts with premium colors
  const month1Data = [
    { name: 'Sales', value: month1Sales, color: '#3B82F6', percentage: (month1Sales/month1Total)*100 }, // Blue for sales
    { name: 'OPEX', value: month1NetOpex, color: '#F59E0B', percentage: (month1NetOpex/month1Total)*100 }  // Amber for OPEX
  ];
  
  const month2Data = [
    { name: 'Sales', value: month2Sales, color: '#3B82F6', percentage: (month2Sales/month2Total)*100 },
    { name: 'OPEX', value: month2NetOpex, color: '#F59E0B', percentage: (month2NetOpex/month2Total)*100 }
  ];
  
  // Bar chart data
  const barData = [
    { name: 'Month 1', Sales: month1Sales, OPEX: month1NetOpex },
    { name: 'Month 2', Sales: month2Sales, OPEX: month2NetOpex }
  ];
  
  // Line chart data for trend
  const lineData = [
    { name: 'Month 1', Sales: month1Sales, OPEX: month1NetOpex, Ratio: (month1NetOpex/month1Sales)*100 },
    { name: 'Month 2', Sales: month2Sales, OPEX: month2NetOpex, Ratio: (month2NetOpex/month2Sales)*100 }
  ];

  // Format currency values in Rupees
  const formatRupees = (value) => {
    return "₹" + value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };
  
  // Format large numbers with K/M/B suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  // Enhanced tooltip with animation
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-xl rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <p className="font-semibold text-gray-800 text-lg">{payload[0].name}</p>
          <p className="text-xl font-bold">{formatRupees(payload[0].value)}</p>
          <div className="w-full h-1 bg-gray-200 my-2 rounded-full">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${payload[0].payload.percentage}%`,
                backgroundColor: payload[0].color
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{payload[0].payload.percentage.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Active shape for pie chart (animated on hover)
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.9}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 12}
          fill={fill}
        />
        <text x={cx} y={cy - 25} dy={8} textAnchor="middle" fill="#333" fontSize={16} fontWeight="bold">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" fontSize={14} fontWeight="bold">
          {formatRupees(value)}
        </text>
        <text x={cx} y={cy + 25} textAnchor="middle" fill="#666" fontSize={12}>
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex justify-center mt-4 space-x-8">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg shadow-sm">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render the appropriate chart based on selection
  const renderChart = (monthData, monthNumber) => {
    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={monthData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              activeIndex={activeMonth === `month${monthNumber}` ? activeIndex : undefined}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => { setActiveIndex(index); setActiveMonth(`month${monthNumber}`); }}
              onMouseLeave={() => { setActiveIndex(null); setActiveMonth(null); }}
            >
              {monthData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[{ name: `Month ${monthNumber}`, Sales: monthData[0].value, OPEX: monthData[1].value }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip 
              formatter={value => formatRupees(value)} 
              labelFormatter={() => `Month ${monthNumber}`}
            />
            <Bar dataKey="Sales" fill="#3B82F6" name="Sales" />
            <Bar dataKey="OPEX" fill="#F59E0B" name="OPEX" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'comparison') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={value => formatRupees(value)} />
            <Bar dataKey="Sales" fill="#3B82F6" name="Sales" />
            <Bar dataKey="OPEX" fill="#F59E0B" name="OPEX" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" tickFormatter={formatNumber} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} unit="%" />
            <Tooltip formatter={(value, name) => {
              if (name === "Ratio") return value.toFixed(2) + "%";
              return formatRupees(value);
            }} />
            <Line yAxisId="left" type="monotone" dataKey="Sales" stroke="#3B82F6" name="Sales" />
            <Line yAxisId="left" type="monotone" dataKey="OPEX" stroke="#F59E0B" name="OPEX" />
            <Line yAxisId="right" type="monotone" dataKey="Ratio" stroke="#10B981" name="OPEX/Sales Ratio" />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg ">
      <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
        <h1 className="text-xl font-semibold text-gray-900">Last 2 Months Sales vs OPEX Comparison</h1>
        
        {/* Visualization Type Selector */}
        <div className="flex mt-4 md:mt-0 bg-white rounded-lg shadow-sm p-1">
          <button 
            className={`flex items-center px-3 py-2 rounded-md ${chartType === 'pie' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setChartType('pie')}
          >
            <PieChartIcon size={16} className="mr-1" />
            <span className="text-sm">Pie</span>
          </button>
          <button 
            className={`flex items-center px-3 py-2 rounded-md ${chartType === 'bar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setChartType('bar')}
          >
            <BarChartIcon size={16} className="mr-1" />
            <span className="text-sm">Bar</span>
          </button>
          <button 
            className={`flex items-center px-3 py-2 rounded-md ${chartType === 'comparison' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setChartType('comparison')}
          >
            <DollarSign size={16} className="mr-1" />
            <span className="text-sm">Compare</span>
          </button>
          <button 
            className={`flex items-center px-3 py-2 rounded-md ${chartType === 'trend' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setChartType('trend')}
          >
            <Activity size={16} className="mr-1" />
            <span className="text-sm">Trend</span>
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Sales Change</h3>
            <div className={`p-2 rounded-full ${month2Sales >= month1Sales ? 'bg-green-100' : 'bg-red-100'}`}>
              {month2Sales >= month1Sales ? 
                <TrendingUp size={16} className="text-green-600" /> : 
                <TrendingDown size={16} className="text-red-600" />
              }
            </div>
          </div>
          <p className={`text-2xl font-bold ${month2Sales >= month1Sales ? 'text-green-600' : 'text-red-600'}`}>
            {((month2Sales - month1Sales) / month1Sales * 100).toFixed(2)}%
          </p>
          <div className="w-full h-1 bg-gray-100 mt-2 rounded-full overflow-hidden">
            <div 
              className={`h-1 rounded-full ${month2Sales >= month1Sales ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${Math.min(Math.abs((month2Sales - month1Sales) / month1Sales * 100), 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">OPEX Change</h3>
            <div className={`p-2 rounded-full ${month2NetOpex <= month1NetOpex ? 'bg-green-100' : 'bg-red-100'}`}>
              {month2NetOpex <= month1NetOpex ? 
                <TrendingDown size={16} className="text-green-600" /> : 
                <TrendingUp size={16} className="text-red-600" />
              }
            </div>
          </div>
          <p className={`text-2xl font-bold ${month2NetOpex <= month1NetOpex ? 'text-green-600' : 'text-red-600'}`}>
            {((month2NetOpex - month1NetOpex) / month1NetOpex * 100).toFixed(2)}%
          </p>
          <div className="w-full h-1 bg-gray-100 mt-2 rounded-full overflow-hidden">
            <div 
              className={`h-1 rounded-full ${month2NetOpex <= month1NetOpex ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${Math.min(Math.abs((month2NetOpex - month1NetOpex) / month1NetOpex * 100), 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">OPEX/Sales Ratio Change</h3>
            <div className={`p-2 rounded-full ${(month2NetOpex / month2Sales) <= (month1NetOpex / month1Sales) ? 'bg-green-100' : 'bg-red-100'}`}>
              {(month2NetOpex / month2Sales) <= (month1NetOpex / month1Sales) ? 
                <TrendingDown size={16} className="text-green-600" /> : 
                <TrendingUp size={16} className="text-red-600" />
              }
            </div>
          </div>
          <p className={`text-2xl font-bold ${(month2NetOpex / month2Sales) <= (month1NetOpex / month1Sales) ? 'text-green-600' : 'text-red-600'}`}>
            {(((month2NetOpex / month2Sales) - (month1NetOpex / month1Sales)) * 100).toFixed(2)}%
          </p>
          <div className="w-full h-1 bg-gray-100 mt-2 rounded-full overflow-hidden">
            <div 
              className={`h-1 rounded-full ${(month2NetOpex / month2Sales) <= (month1NetOpex / month1Sales) ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${Math.min(Math.abs(((month2NetOpex / month2Sales) - (month1NetOpex / month1Sales)) * 100), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* If trend or comparison view is selected, show the combined chart */}
      {(chartType === 'trend' || chartType === 'comparison') ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly Comparison</h2>
          {chartType === 'trend' ? 
            renderChart(null, null) : 
            renderChart(null, null)
          }
        </div>
      ) : (
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Month 1 Section */}
          <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <h2 className="text-xl font-bold text-center">Month 1</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-lg font-bold text-blue-600">{formatRupees(month1Sales)}</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total OPEX</p>
                  <p className="text-lg font-bold text-amber-600">{formatRupees(month1NetOpex)}</p>
                </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">OPEX to Sales Ratio</p>
                <p className="text-lg font-bold text-indigo-600">{((month1NetOpex / month1Sales) * 100).toFixed(2)}%</p>
              </div>
              </div>
              {renderChart(month1Data, 1)}
            </div>
          </div>
          
          {/* Month 2 Section */}
          <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
              <h2 className="text-xl font-bold text-center">Month 2</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-lg font-bold text-blue-600">{formatRupees(month2Sales)}</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total OPEX</p>
                  <p className="text-lg font-bold text-amber-600">{formatRupees(month2NetOpex)}</p>
                </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">OPEX to Sales Ratio</p>
                <p className="text-lg font-bold text-indigo-600">{((month2NetOpex / month2Sales) * 100).toFixed(2)}%</p>
              </div>
              </div>
              {renderChart(month2Data, 2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpexSalesComparison;