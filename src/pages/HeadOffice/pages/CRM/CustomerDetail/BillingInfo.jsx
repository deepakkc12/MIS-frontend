const BillingInfo = ({ customerData,formatCurrency, lastSaleAmount, lastSaleDate,formatDate }) => {
    const primarySales = customerData.primaryDaySales || 0;
    const salesPercentage = customerData.TotalSales > 0 ? ((primarySales / customerData.TotalSales) * 100).toFixed(2) : 0;
  
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zm0 0l1 2h6l1-2M9 12h6m-6 4h6M9 8h6" />
</svg>

      Billing Information    </h2>
  </div>
  
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Primary Buying Days */}
          <div>
            <p className="text-sm font-medium text-gray-500">Primary Buying Days</p>
            <div className="mt-2 flex items-center">
              <span className="text-sm font-semibold text-gray-900">
                Day {customerData.BillDaysFrom || 'N/A'} to {customerData.BillDaysTo || 'N/A'}
              </span>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Monthly
              </span>
            </div>
          </div>
  
          {/* Primary Day Sales Comparison */}
          <div>
            <p className="text-sm font-medium text-gray-500">Primary Day Sales</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(primarySales)}</p>
            <p className="text-sm text-gray-600">
              Contributes <span className="font-semibold text-gray-900">{salesPercentage}%</span> to total sales
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${salesPercentage}%` }}
              ></div>
            </div>
          </div>
  
          {/* Total Sales (YTD) */}
          <div>
            <p className="text-sm font-medium text-gray-500">Total Sales (YTD)</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(customerData.TotalSales)}</p>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: '100%' }}></div>
            </div>
          </div>
         
        </div>
      </div>
    );
  };
  
  export default BillingInfo;
  