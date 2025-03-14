import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SalesTrendChart = ({ data }) => {
  // Process the data to convert string amounts to numbers and sort by date
  const processedData = data
    .map(item => ({
      date: item.DOT, // Keep original date string
      index: new Date(item.DOT).getTime(), // Using timestamp for sorting
      amount: parseFloat(item.GrossAmt),
      invoiceNo: item.InvoiceNo
    }))
    .sort((a, b) => a.index - b.index)
    .map((item, index) => ({
      ...item,
      pointNumber: index + 1 // Add sequential point numbers instead of dates
    }));

  return (
    <div className="w-full h-96 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Purchase Trend Analysis</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={processedData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
          <XAxis
            dataKey="pointNumber"
            tick={false} // Hide the tick labels
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "gray" }}
            tickFormatter={(value) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            labelFormatter={(value, array) => {
              if (array && array.length > 0 && array[0].payload) {
                return `Date: ${array[0].payload.date}`;
              }
              return "Date: N/A";
            }}
            contentStyle={{ backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 2 }}
            activeDot={{ r: 2, fill: "#1e40af" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center items-center mt-2">
        <div className="h-1 w-24 bg-gradient-to-r from-blue-100 to-blue-500 rounded-full"></div>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">Purchase trend visualization</div>
    </div>
  );
};

export default SalesTrendChart;