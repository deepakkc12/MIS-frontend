
const ZeroStockModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Zero Stock Items</h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex justify-between mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              POTENTIAL REVENUE LOSS
            </h3>
            <p className="text-2xl font-bold text-red-600">
              $
              {zeroStockItems
                .reduce((sum, item) => sum + item.potentialLoss, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              CRITICAL ITEMS
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {
                zeroStockItems.filter((item) => item.status === "Critical")
                  .length
              }
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">TOTAL ITEMS</h3>
            <p className="text-2xl font-bold text-blue-600">
              {zeroStockItems.length}
            </p>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700 mr-2">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Last Stocked</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Potential Loss</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zeroStockItems.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.sku}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">
                    {new Date(item.lastStocked).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.status === "Critical"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-red-600 font-medium">
                    ${item.potentialLoss.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SalesOpportunityModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Sales Opportunity Loss Analysis
          </h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              TOTAL LOSS PROJECTION
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              ${salesLossData.totalLoss.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              ACTIVE ISSUES
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {salesLossData.activeItems.length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600">
              AVG MARGIN IMPACT
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {Math.round(
                salesLossData.byReason.reduce(
                  (acc, item) => acc + item.avgMargin,
                  0
                ) / salesLossData.byReason.length
              )}
              %
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Loss Distribution by Reason
            </h3>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
              <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesLossData.byReason}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reason" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke={COLORS.primary}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={COLORS.secondary}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="loss"
                  fill={COLORS.primary}
                  name="Loss Amount ($)"
                />
                <Bar
                  yAxisId="right"
                  dataKey="avgMargin"
                  fill={COLORS.secondary}
                  name="Avg Margin (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Active Issues</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
              <Zap size={16} className="mr-2" />
              Generate Action Plan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Date Range</th>
                  <th className="p-3 text-right">Avg Sales/Day</th>
                  <th className="p-3 text-right">Margin</th>
                  <th className="p-3 text-right">Potential Loss</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesLossData.activeItems.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.skuCode}</td>
                    <td className="p-3">{item.reason}</td>
                    <td className="p-3">
                      {new Date(item.dateFrom).toLocaleDateString()} -{" "}
                      {new Date(item.dateTo).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">${item.avgSalesPerDay}</td>
                    <td className="p-3 text-right">{item.avgMargin}%</td>
                    <td className="p-3 text-right text-red-600 font-medium">
                      ${item.potentialLoss.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Loss Trend Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesLossData.byTimespan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke={COLORS.danger}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={COLORS.info}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="loss"
                  stroke={COLORS.danger}
                  strokeWidth={2}
                  name="Loss Amount ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgSalesPerDay"
                  stroke={COLORS.info}
                  strokeWidth={2}
                  name="Avg Sales/Day"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
