import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ComposedChart,
  Area,
  ReferenceLine,
  Pie,
  PieChart,
  Cell,
  Sector,
  Treemap,
} from "recharts";
import RevenueChart from "./RevenueChart";
import CustomerModal from "./CustomerModal";
import TableList from "./TableList";
import AnimatedMetricCards from "./MetricsCards";

const NonPerformingCustomers = ({ customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationEnabled, setAnimationEnabled] = useState(false);

  // Enable animations after initial render
  useEffect(() => {
    const timer = setTimeout(() => setAnimationEnabled(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Preprocessing the data
  const processedData = useMemo(() => {
    if (!customers || !customers.length) return [];

    return customers
      .map((customer) => ({
        ...customer,
        totalRevenue:
          parseFloat(customer.OCT) +
          parseFloat(customer.NOV) +
          parseFloat(customer.DEC),
        OCT: parseFloat(customer.OCT),
        NOV: parseFloat(customer.NOV),
        DEC: parseFloat(customer.DEC),
        JAN: parseFloat(customer.JAN),
        FEB: parseFloat(customer.FEB),
        revenueByMonth: [
          { month: "OCT", amount: parseFloat(customer.OCT) },
          { month: "NOV", amount: parseFloat(customer.NOV) },
          { month: "DEC", amount: parseFloat(customer.DEC) },
          { month: "JAN", amount: parseFloat(customer.JAN) },
          { month: "FEB", amount: parseFloat(customer.FEB) },
        ],
        contributionPercentage: parseFloat(customer.contributionPercentage),
        rankOutOf100: parseFloat(customer.rankOutOf100),
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [customers]);

  // Performance Metrics
  const performanceMetrics = useMemo(() => {
    if (!processedData.length)
      return {
        totalRevenue: 0,
        averageRevenue: 0,
        topPerformers: [],
        projectedLoss: 0,
      };

    const totalRevenue = processedData.reduce(
      (sum, customer) => sum + customer.totalRevenue,
      0
    );
    const averageRevenue = totalRevenue / processedData.length;
    const topPerformers = processedData.slice(0, 5);

    // Calculate average monthly revenue (Oct-Dec) to project potential loss
    const avgMonthlyRevenue = totalRevenue / 3; // 3 months (Oct, Nov, Dec)
    const projectedLoss = avgMonthlyRevenue * 2; // Jan & Feb loss

    const monthlyTotals = {
      OCT: processedData.reduce((sum, customer) => sum + customer.OCT, 0),
      NOV: processedData.reduce((sum, customer) => sum + customer.NOV, 0),
      DEC: processedData.reduce((sum, customer) => sum + customer.DEC, 0),
    };

    // Revenue change percentages
    const octToNovChange =
      ((monthlyTotals.NOV - monthlyTotals.OCT) / monthlyTotals.OCT) * 100;
    const novToDecChange =
      ((monthlyTotals.DEC - monthlyTotals.NOV) / monthlyTotals.NOV) * 100;

    return {
      totalRevenue,
      averageRevenue,
      projectedLoss,
      topPerformers,
      monthlyTotals,
      customerCount: processedData.length,
      octToNovChange,
      novToDecChange,
      averageRank:
        processedData.reduce((sum, c) => sum + parseFloat(c.rankOutOf100), 0) /
        processedData.length,
    };
  }, [processedData]);

  // Monthly trend data for chart
  const monthlyTrendData = useMemo(() => {
    if (!performanceMetrics.monthlyTotals) return [];

    return [
      {
        name: "OCT",
        revenue: performanceMetrics.monthlyTotals.OCT,
        avg: performanceMetrics.averageRevenue / 3,
      },
      {
        name: "NOV",
        revenue: performanceMetrics.monthlyTotals.NOV,
        avg: performanceMetrics.averageRevenue / 3,
      },
      {
        name: "DEC",
        revenue: performanceMetrics.monthlyTotals.DEC,
        avg: performanceMetrics.averageRevenue / 3,
      },
      {
        name: "JAN",
        revenue: 0,
        avg: performanceMetrics.averageRevenue / 3,
        projected: performanceMetrics.averageRevenue / 3,
      },
      {
        name: "FEB",
        revenue: 0,
        avg: performanceMetrics.averageRevenue / 3,
        projected: performanceMetrics.averageRevenue / 3,
      },
    ];
  }, [performanceMetrics]);

  // Revenue distribution by segmentation
  const revenueDistributionData = useMemo(() => {
    if (!processedData.length) return [];

    // Group customers by revenue segment for treemap
    const segmentGroups = {
      "High Value (₹10000+)": {
        name: "High Value (₹10000+)",
        value: 0,
        count: 0,
      },
      "Medium Value (₹5000-10000)": {
        name: "Medium Value (₹5000-10000)",
        value: 0,
        count: 0,
      },
      "Low Value (₹1000-5000)": {
        name: "Low Value (₹1000-5000)",
        value: 0,
        count: 0,
      },
      "Micro Value (<₹1000)": {
        name: "Micro Value (<₹1000)",
        value: 0,
        count: 0,
      },
    };

    processedData.forEach((customer) => {
      if (customer.totalRevenue >= 10000) {
        segmentGroups["High Value (₹10000+)"].value += customer.totalRevenue;
        segmentGroups["High Value (₹10000+)"].count++;
      } else if (customer.totalRevenue >= 5000) {
        segmentGroups["Medium Value (₹5000-10000)"].value +=
          customer.totalRevenue;
        segmentGroups["Medium Value (₹5000-10000)"].count++;
      } else if (customer.totalRevenue >= 1000) {
        segmentGroups["Low Value (₹1000-5000)"].value += customer.totalRevenue;
        segmentGroups["Low Value (₹1000-5000)"].count++;
      } else {
        segmentGroups["Micro Value (<₹1000)"].value += customer.totalRevenue;
        segmentGroups["Micro Value (<₹1000)"].count++;
      }
    });

    return Object.values(segmentGroups);
  }, [processedData]);

  // Prepare data for radar chart
  const getRadarChartData = (customer) => {
    if (!customer) return [];

    return [
      {
        subject: "Contribution",
        A: parseFloat(customer.contributionPercentage) * 100 * 3,
        fullMark: 30,
      },
      {
        subject: "Revenue",
        A: (customer.totalRevenue / 15000) * 100,
        fullMark: 100,
      },
      { subject: "Bills", A: customer.NOB, fullMark: 100 },
      { subject: "ABV", A: (customer.ABV / 2000) * 100, fullMark: 100 },
      { subject: "Rank", A: customer.rankOutOf100, fullMark: 100 },
    ];
  };

  // Get analysis and recommendations for customer
  const getCustomerInsights = (customer) => {
    if (!customer) return {};

    const monthlyVariation =
      (Math.abs(customer.OCT - customer.NOV) +
        Math.abs(customer.NOV - customer.DEC)) /
      2;
    const variabilityIndex =
      (monthlyVariation / (customer.totalRevenue / 3)) * 100;

    // Buying pattern trend
    let trend = "Stable";
    if (customer.OCT < customer.NOV && customer.NOV < customer.DEC)
      trend = "Increasing";
    else if (customer.OCT > customer.NOV && customer.NOV > customer.DEC)
      trend = "Decreasing";
    else if (variabilityIndex > 50) trend = "Highly Variable";

    // Recovery potential
    let recoveryPotential = "Medium";
    if (trend === "Increasing" && customer.rankOutOf100 > 80)
      recoveryPotential = "High";
    else if (trend === "Decreasing" && customer.rankOutOf100 < 50)
      recoveryPotential = "Low";

    // Recommendations
    let recommendation = "";
    if (recoveryPotential === "High") {
      recommendation =
        "Priority recovery target. Offer personalized discount on their frequent purchases.";
    } else if (recoveryPotential === "Medium") {
      recommendation =
        "Follow up with a loyalty program offer or new product announcements.";
    } else {
      recommendation =
        "Monitor for organic return or include in mass marketing campaigns.";
    }

    return {
      trend,
      variabilityIndex: variabilityIndex.toFixed(1),
      recoveryPotential,
      recommendation,
    };
  };

  // Color scales
  const COLORS = ["#4264D0", "#04B67C", "#F5B700", "#F25252", "#8884d8"];
  const GRADIENT_COLORS = [
    "#BBDEFB",
    "#90CAF9",
    "#64B5F6",
    "#42A5F5",
    "#2196F3",
    "#1E88E5",
    "#1976D2",
    "#1565C0",
    "#0D47A1",
  ];

  // Active shape for pie chart
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-20}
          textAnchor="middle"
          fill="#333"
          className="text-lg font-medium"
        >
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333">
          {`₹${value.toFixed(2)}`}
        </text>
        <text
          x={cx}
          y={cy}
          dy={30}
          textAnchor="middle"
          fill="#999"
          className="text-sm"
        >
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}:{" "}
              {typeof entry.value === "number"
                ? `₹${entry.value.toFixed(2)}`
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const impactPercentage = performanceMetrics.averageRevenue
    ? (
        (performanceMetrics.projectedLoss /
          2 /
          performanceMetrics.averageRevenue) *
        100
      ).toFixed(1)
    : "N/A";

  return (
    <div className="p-6 bg-gradient-to-br rounded-xl from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Non-Performing Customers Analytics</h1>
        {/* <p className="text-gray-600">Insights for customers active Oct-Dec but inactive in Jan-Feb</p> */}
      </div>

      {/* Performance Overview Cards */}
    <AnimatedMetricCards performanceMetrics={performanceMetrics}/>

      {/* Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <RevenueChart
            monthlyTrendData={monthlyTrendData}
            performanceMetrics={performanceMetrics}
          />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Top Non-Performing Customers
          </h2>
          {/* <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={performanceMetrics.topPerformers}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                barCategoryGap={8}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="Name" tick={{ fontSize: 12 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  {GRADIENT_COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={GRADIENT_COLORS[Math.max(0, index-1)]} />
                      <stop offset="100%" stopColor={color} />
                    </linearGradient>
                  ))}
                </defs>
                <Bar 
                  dataKey="totalRevenue" 
                  name="Total Revenue"
                  animationBegin={0}
                  animationDuration={animationEnabled ? 1000 : 0}
                >
                  {performanceMetrics.topPerformers.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient${Math.min(GRADIENT_COLORS.length - 1, Math.floor((entry.totalRevenue / 15000) * GRADIENT_COLORS.length))})`}
                      onClick={() => setSelectedCustomer(entry)}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div> */}
          <div className="space-y-2">
            {performanceMetrics.topPerformers.map((customer, idx) => (
              <div
                key={customer.code}
                className={`flex justify-between items-center p-2 rounded cursor-pointer transition-all hover:bg-blue-50 ${
                  selectedCustomer?.code == customer.code ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{customer.Name}</p>
                    <p className="text-xs text-gray-500">
                      ₹{customer.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    Rank: {customer.rankOutOf100}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segmentation */}
        {/* <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Value Segments</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={revenueDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  animationBegin={0}
                  animationDuration={animationEnabled ? 1000 : 0}
                >
                  {revenueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {revenueDistributionData.map((segment, idx) => (
              <div key={segment.name} className="flex items-center text-sm">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <div className="flex-1">
                  <div className="font-medium truncate">{segment.name}</div>
                  <div className="text-xs text-gray-500">{segment.count} customers</div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Top Performers and Customer Detail */}
      <div className="grid ">
        {/* Top Performers */}

        {/* Customer Detail */}
        <TableList
        
          customers={processedData}
          setCustomers={(data) => setSelectedCustomer(data)}
        />
      </div>
      {selectedCustomer && (
        <CustomerModal
          onClose={() => setSelectedCustomer(null)}
          selectedCustomer={selectedCustomer}
          animationEnabled={animationEnabled}
        />
      )}
    </div>
  );
};

export default NonPerformingCustomers;




// {selectedCustomer ? (
//     <>
//       <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-lg font-semibold text-gray-800">Customer Profile</h2>
//           <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
//             ID: {selectedCustomer.code}
//           </span>
//         </div>

//         <div className="mb-4">
//           <h3 className="text-xl font-bold">{selectedCustomer.Name}</h3>
//           <p className="text-gray-600">
//             <span className="inline-block mr-2">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//               </svg>
//               {selectedCustomer.Phone}
//             </span>
//           </p>
//         </div>

//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className="bg-gray-50 p-3 rounded">
//             <p className="text-xs text-gray-500">Total Revenue</p>
//             <p className="text-lg font-bold">₹{selectedCustomer.totalRevenue.toFixed(2)}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded">
//             <p className="text-xs text-gray-500">Avg. Bill Value</p>
//             <p className="text-lg font-bold">₹{selectedCustomer.ABV.toFixed(2)}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded">
//             <p className="text-xs text-gray-500">Number of Bills</p>
//             <p className="text-lg font-bold">{selectedCustomer.NOB}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded">
//             <p className="text-xs text-gray-500">Contribution</p>
//             <p className="text-lg font-bold">{(selectedCustomer.contributionPercentage * 100).toFixed(2)}%</p>
//           </div>
//         </div>

//         <div className="h-40">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={selectedCustomer.revenueByMonth}>
//               <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip content={<CustomTooltip />} />
//               <Line
//                 type="monotone"
//                 dataKey="amount"
//                 stroke="#2196F3"
//                 name="Revenue"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//                 animationBegin={0}
//                 animationDuration={animationEnabled ? 1000 : 0}
//               />
//               <ReferenceLine x="DEC" stroke="#FF9800" strokeDasharray="3 3" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="mt-4">
//           <h4 className="font-medium text-sm mb-2">Monthly Revenue</h4>
//           <div className="grid grid-cols-5 gap-1">
//             {selectedCustomer.revenueByMonth.map(item => (
//               <div key={item.month} className={`p-2 rounded text-center ${item.month === 'JAN' || item.month === 'FEB' ? 'bg-red-50' : 'bg-blue-50'}`}>
//                 <p className="text-xs text-gray-500">{item.month}</p>
//                 <p className={`text-sm font-medium ${item.month === 'JAN' || item.month === 'FEB' ? 'text-red-600' : ''}`}>
//                   ₹{item.amount.toFixed(0)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
//         <h2 className="text-lg font-semibold mb-4 text-gray-800">Performance Analysis</h2>

//         <div className="h-48 mb-4">
//           <ResponsiveContainer width="100%" height="100%">
//             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarChartData(selectedCustomer)}>
//               <PolarGrid />
//               <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
//               <PolarRadiusAxis angle={30} domain={[0, 100]} />
//               <Radar
//                 name="Performance"
//                 dataKey="A"
//                 stroke="#8884d8"
//                 fill="#8884d8"
//                 fillOpacity={0.5}
//                 animationBegin={0}
//                 animationDuration={animationEnabled ? 1000 : 0}
//               />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Insights */}
//         {(() => {
//           const insights = getCustomerInsights(selectedCustomer);
//           return (
//             <div className="space-y-4">
//               <div className="grid grid-cols-3 gap-2">
//                 <div className="bg-gray-50 p-2 rounded">
//                   <p className="text-xs text-gray-500">Buying Pattern</p>
//                   <p className="font-medium text-sm">{insights.trend}</p>
//                 </div>
//                 <div className="bg-gray-50 p-2 rounded">
//                   <p className="text-xs text-gray-500">Variability</p>
//                   <p className="font-medium text-sm">{insights.variabilityIndex}%</p>
//                 </div>
//                 <div className={`p-2 rounded ${
//                   insights.recoveryPotential === 'High' ? 'bg-green-50' :
//                   insights.recoveryPotential === 'Medium' ? 'bg-yellow-50' : 'bg-red-50'
//                 }`}>
//                   <p className="text-xs text-gray-500">Recovery Potential</p>
//                   <p className={`font-medium text-sm ${
//                     insights.recoveryPotential === 'High' ? 'text-green-600' :
//                     insights.recoveryPotential === 'Medium' ? 'text-yellow-600' : 'text-red-600'
//                   }`}>{insights.recoveryPotential}</p>
//                 </div>
//               </div>

//               <div className="bg-blue-50 p-3 rounded">
//                 <p className="text-xs text-gray-500 mb-1">Recommendation</p>
//                 <p className="text-sm">{insights.recommendation}</p>
//               </div>
//             </div>
//           );
//         })()}
//       </div>
//     </>
//   ) : (
//     <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-8 flex items-center justify-center">
//       <div className="text-center">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         <h3 className="text-lg font-medium text-gray-700 mb-1">Select a Customer</h3>
//         <p className="text-gray-500">Click on a customer from the list to view detailed analysis</p>
//       </div>
//     </div>
//   )}
