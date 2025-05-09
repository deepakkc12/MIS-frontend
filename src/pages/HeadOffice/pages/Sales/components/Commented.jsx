
      {/* Bottom Analytics */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"> */}
        {/* Sales Volume Chart */}
        {/* <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Sales Volume
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={getDisplayData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey={getXAxisKey()}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value) => [value.toLocaleString(), "Sales"]}
              />
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="nob"
                name="Number of Sales"
                fill="url(#colorSales)"
                radius={[4, 4, 0, 0]}
              />
              {comparisonMode && (
                <Bar
                  dataKey="nob"
                  data={getPreviousData()}
                  name="Previous Period"
                  fill="rgba(251, 191, 36, 0.6)"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* Sales vs. Revenue Comparison */}
        {/* <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Sales to Revenue Ratio
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="nob"
                name="Sales Volume"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                label={{
                  value: "Sales Volume",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                type="number"
                dataKey="grossAmount"
                name="Revenue"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                label={{ value: "Revenue", angle: -90, position: "insideLeft" }}
                tickFormatter={formatYAxisValue}
              /> */}
              {/* <Tooltip 
        cursor={{ strokeDasharray: '3 3' }}
        contentStyle={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}
      /> */}
              {/* <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Sales-Revenue Correlation"
                data={getEnhancedDisplayData()}
                fill="#8884d8"
                shape="circle"
              >
                {getEnhancedDisplayData()?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Revenue Growth Tracking */}
      {/* <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">
          Revenue Growth Tracking
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={getDisplayData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey={getXAxisKey()}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatYAxisValue}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, getMaxRevenue()]}

              // domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
              // allowDataOverflow={true}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
              formatter={(value, name) => {
                if (name === "Revenue") return [formatCurrency(value), name];
                if (name === "Growth %") return [`${value.toFixed(2)}%`, name];
                return [value.toLocaleString(), name];
              }}
            />
            <Legend />
            <defs>
              <linearGradient
                id="colorAmountGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="grossAmount"
              name="Revenue"
              fill="url(#colorAmountGradient)"
              stroke="#3b82f6"
              fillOpacity={0.6}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trend"
              name="Growth %"
              stroke="#10B981"
              strokeWidth={2}
              dot={{
                r: 4,
                stroke: "#10B981",
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div> */}
      {/* <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <span>
            {isLoading ? 'Loading data...' : `Data loaded successfully`}
          </span>
          <span>
            Last updated: {new Date().toLocaleString()}
          </span>
        </div> */}