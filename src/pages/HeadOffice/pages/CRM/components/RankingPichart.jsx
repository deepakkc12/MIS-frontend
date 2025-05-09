import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Legend, Tooltip } from 'recharts';
import { getRequest } from '../../../../../services/apis/requests';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CustomerLevelPieChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [rawData, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataTimestamp, setDataTimestamp] = useState(null);

//   const {lastUpdated} = useSelector(state=>state.settings.lastUpdated)

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await getRequest(`crm/live-levels/`);
      setData(response.data);
      
      // Set current date as data timestamp (in production, this would come from the API)
      const now = new Date();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(now.getMonth() - 2);
      
      setDataTimestamp({
        start: twoMonthsAgo,
        end: now
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Transform data to include tier names
  const transformData = (data) => {
    const tierMapping = {
      '1': { name: "Premium", color: "#8A2BE2", description: "Top-tier membership with exclusive benefits" }, // Vibrant Purple
      '2': { name: "Gold", color: "#FFD700", description: "Enhanced features and priority service" }, // Gold
      '3': { name: "Bronze", color: "#CD7F32", description: "Standard features with additional benefits" }, // Bronze
      '4': { name: "Standard", color: "#3498DB", description: "Basic membership tier" } // Blue
    };

    return data.map(item => ({
      customerLevel: item.CustomerLevel,
      count: item["count"] || 0,
      tierName: tierMapping[item.CustomerLevel]?.name || `Level ${item.CustomerLevel}`,
      color: tierMapping[item.CustomerLevel]?.color || "#CCCCCC",
      description: tierMapping[item.CustomerLevel]?.description || ""
    })).sort((a, b) => a.customerLevel - b.customerLevel);
  };

  const data = transformData(rawData);
  
  // Total customers for percentage calculation
  const totalCustomers = data.reduce((sum, item) => sum + item.count, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

const navigate = useNavigate()
  // Custom click handler
  const handlePieClick = (_, index) => {
    const tier = data[index]?.tierName;
    setSelectedTier(tier === selectedTier ? null : tier);
    console.log(tier)
    navigate(`/crm/${tier}`)
  };


  // Custom active shape with enhanced animation and details
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    const percentage = ((payload.count / totalCustomers) * 100).toFixed(1);
    
    return (
      <g>
        {/* Outer highlighted sector */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          onClick={(d)=>{console.log(d)}}
          fill={fill}
          strokeWidth={2}
          stroke="#fff"
          style={{filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))'}}
        />
        
        {/* Outer ring indicator */}
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 14}
          outerRadius={outerRadius + 18}
          fill={fill}
        />
        
        {/* Center information area */}
        <circle cx={cx} cy={cy} r={innerRadius - 5} fill="#fff" stroke="#f5f5f5" />
        <text 
          x={cx} 
          y={cy - 25} 
          textAnchor="middle" 
          fill="#333" 
          className="text-xl font-bold"
        >
          {payload.tierName}
        </text>
        <text 
          x={cx} 
          y={cy + 5} 
          textAnchor="middle" 
          fill="#555" 
          className="text-lg font-semibold"
        >
          {`${payload.count.toLocaleString()}`}
        </text>
        <text 
          x={cx} 
          y={cy + 30} 
          textAnchor="middle" 
          fill="#777" 
          className="text-md font-medium"
        >
          {`${percentage}%`}
        </text>
      </g>
    );
  };

  // Enhanced custom legend with tier descriptions
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center mt-1 gap-4 flex-wrap">
        {payload.map((entry, index) => {
          const item = data[index];
          if (!item) return null;
          
          const percentage = ((item.count / totalCustomers) * 100).toFixed(1);
          const isActive = index === activeIndex;
          const isSelected = item.tierName === selectedTier;
          
          return (
            <div 
              key={`legend-${index}`}
              className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isActive || isSelected ? 'shadow-lg transform scale-105' : 'shadow-sm hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: isSelected ? `${item.color}15` : isActive ? '#f8f8f8' : '#fff',
                borderLeft: `4px solid ${item.color}`
              }}
              onClick={() => console.log("jjr")}
            //   onMouseEnter={() => setActiveIndex(index)}
            //   onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{item.tierName}</span>
                <div className="flex items-center mt-1 mb-1">
                  <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm text-gray-700 font-medium">{item.count.toLocaleString()} ({percentage}%)</span>
                </div>
                {(isActive || isSelected) && item.description && (
                  <span className="text-xs text-gray-500 mt-1 max-w-xs">{item.description}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-semibold text-gray-800">{data.tierName}</p>
          <p className="text-sm text-gray-600">{data.count.toLocaleString()} customers</p>
          <p className="text-sm text-gray-600">
            {((data.count / totalCustomers) * 100).toFixed(1)}% of total
          </p>
          {data.description && (
            <p className="text-xs text-gray-500 mt-1">{data.description}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full h-[31rem] border border-gray-100">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Customer Tier Distribution</h2>
        {dataTimestamp && (
          <p className="text-sm text-gray-500 mt-1">
            Based on data from last two months
          </p>
        )}
      </div>
      
      {/* 
      {selectedTier && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-800">{selectedTier} Tier Selected</p>
            <p className="text-sm text-gray-600">
              {data.find(d => d.tierName === selectedTier)?.count.toLocaleString()} customers 
              ({((data.find(d => d.tierName === selectedTier)?.count / totalCustomers) * 100).toFixed(1)}%)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.find(d => d.tierName === selectedTier)?.description}
            </p>
          </div>
          <button 
            className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors"
            onClick={() => setSelectedTier(null)}
          >
            Clear Selection
          </button>
        </div>
      )}
       */}

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Loading customer data...</div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                onClick={handlePieClick}
                animationDuration={800}
                animationBegin={0}
                isAnimationActive={true}
              >
                {data.map((entry, index) => {
                  const isSelected = entry.tierName === selectedTier;
                  return (
                    <Cell 
                    onClick={(S)=>{console.log(entry.tierName)}}
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={isSelected ? 3 : 1}
                      style={{
                        filter: isSelected ? 'drop-shadow(0px 6px 10px rgba(0,0,0,0.2))' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                content={renderCustomizedLegend}
                verticalAlign="bottom"
                height={30}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* <div className="mt-6 flex justify-between items-center px-2">
        <div className="text-sm text-gray-600 font-medium">
          Total Members: {totalCustomers.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">
          Click on segments or legend items for details
        </div>
      </div> */}
    </div>
  );
};

export default CustomerLevelPieChart;