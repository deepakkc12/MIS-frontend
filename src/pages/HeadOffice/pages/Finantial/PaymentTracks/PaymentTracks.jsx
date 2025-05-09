import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getRequest } from '../../../../../services/apis/requests';
import MainLayout from '../../../Layout/Layout';
import TableLayout from '../../../../../components/Table/TableLayout';

const PaymentTracksAnalyzer = () => {
  const [data, setData] = useState({ receivables: [], payables: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('receivables');
  const [timeView, setTimeView] = useState('monthly'); // 'monthly' or 'total'

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRequest(`acc/payment-tracks/`)
        if(response.success){
            setData(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  // Calculate summary statistics for receivables
  const calculateReceivableSummary = () => {
    if (!data.receivables.length) return {};
    
    const totalDr = data.receivables.reduce((sum, item) => sum + parseFloat(item.Dr), 0);
    const totalCr = data.receivables.reduce((sum, item) => sum + parseFloat(item.Cr), 0);
    const netReceivable = totalDr - totalCr;
    
    const m1Dr = data.receivables.reduce((sum, item) => sum + parseFloat(item.M1Dr), 0);
    const m1Cr = data.receivables.reduce((sum, item) => sum + parseFloat(item.M1Cr), 0);
    const m2Dr = data.receivables.reduce((sum, item) => sum + parseFloat(item.M2Dr), 0);
    const m2Cr = data.receivables.reduce((sum, item) => sum + parseFloat(item.M2Cr), 0);
    
    const m1Net = m1Dr - m1Cr;
    const m2Net = m2Dr - m2Cr;
    
    // Calculate pending (outstanding) vs received
    const totalReceived = totalCr; // Amount credited is what's been received
    const totalPending = totalDr; // Total debits represent total amounts we should receive
    const outstandingReceivable = totalDr - totalCr; // What's still pending
    
    return {
      totalDr,
      totalCr,
      netReceivable,
      m1Net,
      m2Net,
      m1Dr,
      m1Cr,
      m2Dr,
      m2Cr,
      totalReceived,
      totalPending,
      outstandingReceivable
    };
  };

  // Calculate summary statistics for payables
  const calculatePayableSummary = () => {
    if (!data.payables.length) return {};
    
    const totalDr = data.payables.reduce((sum, item) => sum + parseFloat(item.Dr), 0);
    const totalCr = data.payables.reduce((sum, item) => sum + parseFloat(item.Cr), 0);
    const netPayable = totalCr - totalDr; // For payables, Cr is what we owe
    
    const m1Dr = data.payables.reduce((sum, item) => sum + parseFloat(item.M1Dr), 0);
    const m1Cr = data.payables.reduce((sum, item) => sum + parseFloat(item.M1Cr), 0);
    const m2Dr = data.payables.reduce((sum, item) => sum + parseFloat(item.M2Dr), 0);
    const m2Cr = data.payables.reduce((sum, item) => sum + parseFloat(item.M2Cr), 0);
    
    const m1Net = m1Cr - m1Dr;
    const m2Net = m2Cr - m2Dr;
    
    // Calculate paid vs to-be-paid
    const totalPaid = totalDr; // Amount debited is what we've paid
    const totalToBePaid = totalCr; // Total credits represent total amounts we need to pay
    const outstandingPayable = totalCr - totalDr; // What we still need to pay
    
    return {
      totalDr,
      totalCr,
      netPayable,
      m1Net,
      m2Net,
      m1Dr,
      m1Cr,
      m2Dr,
      m2Cr,
      totalPaid,
      totalToBePaid,
      outstandingPayable
    };
  };

  // Prepare data for charts
  const prepareChartData = (type) => {
    const items = data[type];
    if (!items.length) return [];
    
    // Group by AccHead
    const groupedByAccHead = items.reduce((acc, item) => {
      if (!acc[item.AccHead]) {
        acc[item.AccHead] = {
          name: item.AccHead,
          totalDr: 0,
          totalCr: 0,
          netAmount: 0,
          count: 0,
          m1Dr: 0,
          m1Cr: 0,
          m1Amount: 0,
          m2Dr: 0,
          m2Cr: 0,
          m2Amount: 0
        };
      }
      
      const netAmount = type === 'receivables' 
        ? parseFloat(item.Dr) - parseFloat(item.Cr)
        : parseFloat(item.Cr) - parseFloat(item.Dr);
        
      const m1Net = type === 'receivables'
        ? parseFloat(item.M1Dr) - parseFloat(item.M1Cr)
        : parseFloat(item.M1Cr) - parseFloat(item.M1Dr);
        
      const m2Net = type === 'receivables'
        ? parseFloat(item.M2Dr) - parseFloat(item.M2Cr)
        : parseFloat(item.M2Cr) - parseFloat(item.M2Dr);
      
      acc[item.AccHead].totalDr += parseFloat(item.Dr);
      acc[item.AccHead].totalCr += parseFloat(item.Cr);
      acc[item.AccHead].netAmount += netAmount;
      acc[item.AccHead].m1Dr += parseFloat(item.M1Dr);
      acc[item.AccHead].m1Cr += parseFloat(item.M1Cr);
      acc[item.AccHead].m1Amount += m1Net;
      acc[item.AccHead].m2Dr += parseFloat(item.M2Dr);
      acc[item.AccHead].m2Cr += parseFloat(item.M2Cr);
      acc[item.AccHead].m2Amount += m2Net;
      acc[item.AccHead].count += 1;
      
      return acc;
    }, {});
    
    return Object.values(groupedByAccHead);
  };

  // Prepare monthly comparison data
  const prepareMonthlyComparisonData = (type) => {
    const summary = type === 'receivables' ? calculateReceivableSummary() : calculatePayableSummary();
    
    return [
      { name: 'Last Month', amount: summary.m1Net },
      { name: 'Current Month', amount: summary.m2Net }
    ];
  };

  // Prepare data for Dr vs Cr comparison
  const prepareDrCrComparisonData = (type) => {
    const isReceivables = type === 'receivables';
    const summary = isReceivables ? calculateReceivableSummary() : calculatePayableSummary();
    
    return [
      { 
        name: isReceivables ? 'Total to Receive' : 'Total to Pay', 
        value: isReceivables ? summary.totalPending : summary.totalToBePaid,
        fill: isReceivables ? '#8884d8' : '#FF8042'
      },
      { 
        name: isReceivables ? 'Already Received' : 'Already Paid', 
        value: isReceivables ? summary.totalReceived : summary.totalPaid,
        fill: isReceivables ? '#82ca9d' : '#0088FE'
      }
    ];
  };

  // Prepare data for outstanding vs settled comparison
  const prepareOutstandingComparisonData = (type) => {
    const isReceivables = type === 'receivables';
    const summary = isReceivables ? calculateReceivableSummary() : calculatePayableSummary();
    
    return [
      { 
        name: isReceivables ? 'Outstanding Receivables' : 'Outstanding Payables', 
        value: isReceivables ? summary.outstandingReceivable : summary.outstandingPayable,
        fill: '#FF8042'
      },
      { 
        name: 'Settled Amount', 
        value: isReceivables ? summary.totalReceived : summary.totalPaid, 
        fill: '#82ca9d'
      }
    ];
  };

  // Prepare trend data for monthly view
  const prepareTrendData = (type) => {
    const isReceivables = type === 'receivables';
    const summary = isReceivables ? calculateReceivableSummary() : calculatePayableSummary();
    
    return [
      {
        name: 'Last Month',
        pending: isReceivables ? summary.m1Dr : summary.m1Cr,
        settled: isReceivables ? summary.m1Cr : summary.m1Dr,
        net: summary.m1Net
      },
      {
        name: 'Current Month',
        pending: isReceivables ? summary.m2Dr : summary.m2Cr,
        settled: isReceivables ? summary.m2Cr : summary.m2Dr,
        net: summary.m2Net
      }
    ];
  };

  const receivablesSummary = calculateReceivableSummary();
  const payablesSummary = calculatePayableSummary();
  
  const receivablesChartData = prepareChartData('receivables');
  const payablesChartData = prepareChartData('payables');
  
  const receivablesMonthlyData = prepareMonthlyComparisonData('receivables');
  const payablesMonthlyData = prepareMonthlyComparisonData('payables');
  
  const receivablesDrCrData = prepareDrCrComparisonData('receivables');
  const payablesDrCrData = prepareDrCrComparisonData('payables');
  
  const receivablesOutstandingData = prepareOutstandingComparisonData('receivables');
  const payablesOutstandingData = prepareOutstandingComparisonData('payables');
  
  const receivablesTrendData = prepareTrendData('receivables');
  const payablesTrendData = prepareTrendData('payables');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  const STATUS_COLORS = {
    positive: '#22c55e', // green-500
    negative: '#ef4444', // red-500
    neutral: '#3b82f6'   // blue-500
  };

  // For acc head pie chart, ensure we don't have too many tiny slices
  const prepareForPieChart = (chartData) => {
    if (!chartData.length) return [];
    
    // Sort by amount descending
    const sortedData = [...chartData].sort((a, b) => Math.abs(b.netAmount) - Math.abs(a.netAmount));
    console.log(sortedData)
    // Take top 5 and group the rest as "Others"
    if (sortedData.length > 6) {
      const topItems = sortedData.slice(0, 5);
      const othersTotal = sortedData.slice(5).reduce((sum, item) => sum + item.netAmount, 0);
      
      return [
        ...topItems,
        { name: 'Others', netAmount: othersTotal }
      ];
    }
    
    return sortedData;
  };

  const recievableHeaders = [
    {key:"AccHead",label:"Acc Head"},
    {key:"Name",label:"Name"},
    {key:"Cr",label:"Total Recieved"},
    {key:"Dr",label:"Total Receivable"},
    {key:"M1Cr",label:"last month Recieved"},
    {key:"M1Dr",label:"last month Receivable"},
    {key:"M2Cr",label:"current month Recieved"},
    {key:"M2Dr",label:"current month Receivable"},
  ]

  
  const payableHeaders = [
    {key:"AccHead",label:"Acc Head"},
    {key:"Name",label:"Name"},
    {key:"Cr",label:"Total Paid"},
    {key:"Dr",label:"Total Payable"},
    {key:"M1Cr",label:"last month Paid"},
    {key:"M1Dr",label:"last month Payable"},
    {key:"M2Cr",label:"current month Paid"},
    {key:"M2Dr",label:"current month Payable"},
  ]


  if (loading) {
    return (
     <MainLayout>
         <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-2">Loading payment data...</p>
      </div>
     </MainLayout>
    );
  }

  if (error) {
    return (
        <MainLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
      </MainLayout>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Show percentage of a value relative to the total
  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / Math.abs(total)) * 100).toFixed(1)}%`;
  };

  // Format for trend values
  const getStatusColor = (value) => {
    if (value > 0) return STATUS_COLORS.positive;
    if (value < 0) return STATUS_COLORS.negative;
    return STATUS_COLORS.neutral;
  };

  return (
    <MainLayout>
    <div className="bg-gray-50 rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Tracks Analysis Dashboard</h1>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`py-2 px-4 ${activeTab === 'receivables' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('receivables')}
            >
              Receivables
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'payables' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('payables')}
            >
              Payables
            </button>
          </div>
        </div>
      </div>

      {/* Time View Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">View:</span>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeView === 'monthly' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setTimeView('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeView === 'total' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setTimeView('total')}
            >
              Total
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Receivables Tab Content */}
        {activeTab === 'receivables' && (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">
                  {timeView === 'total' ? 'Total Outstanding Receivables' : 'Current Month Net Receivables'}
                </h3>
                <p className={`text-xl font-semibold ${
                  timeView === 'total' 
                    ? receivablesSummary.outstandingReceivable >= 0 ? 'text-green-600' : 'text-red-600'
                    : receivablesSummary.m2Net >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(timeView === 'total' ? receivablesSummary.outstandingReceivable : receivablesSummary.m2Net)}
                </p>
                {timeView === 'total' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage(receivablesSummary.outstandingReceivable, receivablesSummary.totalPending)} of Total Invoiced
                  </p>
                )}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">
                  {timeView === 'total' ? 'Total Receivables (Invoiced)' : 'Last Month Net'}
                </h3>
                <p className="text-xl font-semibold">
                  {formatCurrency(timeView === 'total' ? receivablesSummary.totalPending : receivablesSummary.m1Net)}
                </p>
                {timeView === 'total' && (
                  <div className="flex items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                    <span className="text-xs text-gray-500">Total Dr</span>
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">
                  {timeView === 'total' ? 'Total Received' : 'Month-over-Month Change'}
                </h3>
                <p className="text-xl font-semibold text-green-600">
                  {timeView === 'total' 
                    ? formatCurrency(receivablesSummary.totalReceived)
                    : receivablesSummary.m1Net !== 0 
                      ? `${(((receivablesSummary.m2Net - receivablesSummary.m1Net) / Math.abs(receivablesSummary.m1Net)) * 100).toFixed(1)}%` 
                      : 'N/A'
                  }
                </p>
                {timeView === 'total' && (
                  <div className="flex items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-xs text-gray-500">Total Cr</span>
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">Collection Ratio</h3>
                <p className="text-xl font-semibold">
                  {receivablesSummary.totalPending > 0 
                    ? `${((receivablesSummary.totalReceived / receivablesSummary.totalPending) * 100).toFixed(1)}%` 
                    : '0%'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(receivablesSummary.totalReceived)} of {formatCurrency(receivablesSummary.totalPending)}
                </p>
              </div>
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Receivables Charts */}
                {/* Total vs Outstanding Chart */}
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-medium mb-4">Dr vs Cr Breakdown</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={receivablesDrCrData}
                        layout="vertical"
                        margin={{ left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" name="Amount">
                          {receivablesDrCrData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700">Total Received Amount (Cr)</h4>
                  <p className="text-xl font-semibold text-green-600">{formatCurrency(receivablesSummary.totalReceived)}</p>
                  <p className="text-xs text-gray-500">{formatPercentage(receivablesSummary.totalReceived, receivablesSummary.totalPending)} of Total Receivables</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700">Pending Receivable (Dr)</h4>
                  <p className="text-xl font-semibold text-purple-600">{formatCurrency(receivablesSummary.outstandingReceivable)}</p>
                  <p className="text-xs text-gray-500">{formatPercentage(receivablesSummary.outstandingReceivable, receivablesSummary.totalPending)} of Total Receivables</p>
                </div>
              </div>
                </div>

              {/* Right Column - Additional Analysis */}
              <div className="space-y-6">
                <div className="bg-white w-full h-full p-4 rounded shadow">
                  <h3 className="text-lg font-medium mb-4">Account Head Distribution</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareForPieChart(receivablesChartData)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="netAmount"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareForPieChart(receivablesChartData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <TableLayout title='Racievables' headers={recievableHeaders} data={data.receivables}/>

       
          </div>
        )}

        {/* Payables Tab Content */}
        {activeTab === 'payables' && (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">
                  {timeView === 'total' ? 'Total Outstanding Payables' : 'Current Month Net Payables'}
                </h3>
                <p className={`text-xl font-semibold ${
                  timeView === 'total' 
                    ? payablesSummary.outstandingPayable >= 0 ? 'text-red-600' : 'text-green-600'
                    : payablesSummary.m2Net >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(timeView === 'total' ? payablesSummary.outstandingPayable : payablesSummary.m2Net)}
                </p>
                {timeView === 'total' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage(payablesSummary.outstandingPayable, payablesSummary.totalToBePaid)} of Total Payables
                  </p>
                )}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">
                  {timeView === 'total' ? 'Total Payables' : 'Last Month Net'}
                </h3>
                <p className="text-xl font-semibold">
                  {formatCurrency(timeView === 'total' ? payablesSummary.totalToBePaid : payablesSummary.m1Net)}
                </p>
                {timeView === 'total' && (
                  <div className="flex items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                    <span className="text-xs text-gray-500">Total Cr</span>
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">
                  {timeView === 'total' ? 'Total Paid' : 'Month-over-Month Change'}
                </h3>
                <p className="text-xl font-semibold text-blue-600">
                  {timeView === 'total' 
                    ? formatCurrency(payablesSummary.totalPaid)
                    : payablesSummary.m1Net !== 0 
                      ? `${(((payablesSummary.m2Net - payablesSummary.m1Net) / Math.abs(payablesSummary.m1Net)) * 100).toFixed(1)}%` 
                      : 'N/A'
                  }
                </p>
                {timeView === 'total' && (
                  <div className="flex items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                    <span className="text-xs text-gray-500">Total Dr</span>
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">Payment Ratio</h3>
                <p className="text-xl font-semibold">
                  {payablesSummary.totalToBePaid > 0 
                    ? `${((payablesSummary.totalPaid / payablesSummary.totalToBePaid) * 100).toFixed(1)}%` 
                    : '0%'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(payablesSummary.totalPaid)} of {formatCurrency(payablesSummary.totalToBePaid)}
                </p>
              </div>
            </div>

            {/* Main Charts Section */}
              {/* Left Column - Payables Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Total vs Outstanding Chart */}
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-medium mb-4">Dr vs Cr Breakdown</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={payablesDrCrData}
                        layout="vertical"
                        margin={{ left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" name="Amount">
                          {payablesDrCrData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700">Total Paid Amount (Dr)</h4>
                  <p className="text-xl font-semibold text-blue-600">{formatCurrency(payablesSummary.totalPaid)}</p>
                  <p className="text-xs text-gray-500">{formatPercentage(payablesSummary.totalPaid, payablesSummary.totalToBePaid)} of Total Payables</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700">To Be Paid (Cr)</h4>
                  <p className="text-xl font-semibold text-orange-600">{formatCurrency(payablesSummary.outstandingPayable)}</p>
                  <p className="text-xs text-gray-500">{formatPercentage(payablesSummary.outstandingPayable, payablesSummary.totalToBePaid)} of Total Payables</p>
                </div>
              </div>
                </div>


              {/* Right Column - Additional Analysis */}
              <div className="space-y-6 ">
                {/* Dr vs Cr Breakdown */}
                <div className="bg-white h-full p-4 rounded shadow">
                  <h3 className="text-lg font-medium mb-4">Account Head Distribution</h3>
                  <div style={{ height: '300px' }} className='my-auto'>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareForPieChart(payablesChartData)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="totalDr"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareForPieChart(payablesChartData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Account Head Distribution */}
               
              </div>
              </div>


            {/* Additional Charts - Comparison of Total Paid vs To Be Paid */}
           <TableLayout title='Payables' headers={payableHeaders} data={data.payables}/>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default PaymentTracksAnalyzer;