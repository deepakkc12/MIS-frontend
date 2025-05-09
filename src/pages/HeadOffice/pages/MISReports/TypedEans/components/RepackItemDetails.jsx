import React, { useState, useEffect } from "react";
import { ArrowLeft, Package, BarChart3, Download, Search, UserCircle, Repeat } from "lucide-react";
import { getRequest } from "../../../../../../services/apis/requests";
import TableLayout from "../../../../../../components/Table/TableLayout";
import MainLayout from "../../../../Layout/Layout";
import { useNavigate } from "react-router-dom";

const BrowsedRepackItemsDetail = () => {
  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "cnt",
    direction: "desc"
  });
  const [aggregatedData, setAggregatedData] = useState({
    totalScans: 0,
    totalUnits: 0,
    uniqueItems: 0,
    topUsers: [],
    mostScannedItems: [],
    highestVolume: {}
  });
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'summary', or 'userAnalysis'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRequest("barcode/repack-items/");
      if (response.success) {
        setItemsData(response.data);
        processAggregatedData(response.data);
      }
    } catch (error) {
      console.error("Error fetching Repack items data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processAggregatedData = (data) => {
    // Calculate total scans
    const totalScans = data.reduce((sum, item) => sum + item.cnt, 0);
    
    // Count unique items by code
    const uniqueCodes = new Set(data.map(item => item.code));
    
    // Calculate total units (assuming 1 scan = 1 unit)
    const totalUnits = totalScans;
    
    // Get top users by scan count
    const userScans = {};
    data.forEach(item => {
      userScans[item.PostedBy] = (userScans[item.PostedBy] || 0) + item.cnt;
    });
    const topUsers = Object.entries(userScans)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    // Get most scanned items
    const itemScans = {};
    data.forEach(item => {
      const key = `${item.code}-${item.SkuName}`;
      itemScans[key] = (itemScans[key] || 0) + item.cnt;
    });
    const mostScannedItems = Object.entries(itemScans)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const [code, ...nameParts] = key.split('-');
        return { 
          code, 
          name: nameParts.join('-'), 
          count 
        };
      });
    
    // Get highest volume item
    const highestVolumeItem = mostScannedItems[0] || { code: '', name: 'None', count: 0 };
    
    setAggregatedData({
      totalScans,
      totalUnits,
      uniqueItems: uniqueCodes.size,
      topUsers,
      mostScannedItems,
      highestVolume: highestVolumeItem
    });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredItems = itemsData.filter(item => 
    item.SkuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.PostedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.PTC.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Calculate aggregated counts by product
  const productCounts = {};
  itemsData.forEach(item => {
    const key = `${item.code}-${item.SkuName}`;
    if (!productCounts[key]) {
      productCounts[key] = {
        code: item.code,
        PTC: item.PTC,
        SkuName: item.SkuName,
        cnt: 0,
        users: {}
      };
    }
    productCounts[key].cnt += item.cnt;
    productCounts[key].users[item.PostedBy] = (productCounts[key].users[item.PostedBy] || 0) + item.cnt;
  });

  // Convert product counts to format suitable for TableLayout
  const productSummaryData = Object.values(productCounts)
    .sort((a, b) => b.cnt - a.cnt)
    .map(product => {
      const userScans = Object.entries(product.users)
        .sort((a, b) => b[1] - a[1])
        .map(([user, count]) => `${user}: ${count}`)
        .join(", ");
      
      return {
        code: product.code,
        PTC: product.PTC,
        SkuName: product.SkuName,
        cnt: product.cnt,
        users: userScans,
        userCount: Object.keys(product.users).length
      };
    });

  // Calculate aggregated counts by user
  const userAnalysisData = [];
  const userItemCounts = {};
  
  itemsData.forEach(item => {
    if (!userItemCounts[item.PostedBy]) {
      userItemCounts[item.PostedBy] = {
        name: item.PostedBy,
        totalScans: 0,
        uniqueItems: new Set(),
        topItems: {}
      };
    }
    
    userItemCounts[item.PostedBy].totalScans += item.cnt;
    userItemCounts[item.PostedBy].uniqueItems.add(item.code);
    
    const itemKey = `${item.code}-${item.SkuName}`;
    userItemCounts[item.PostedBy].topItems[itemKey] = (userItemCounts[item.PostedBy].topItems[itemKey] || 0) + item.cnt;
  });
  
  // Convert user analysis to format suitable for TableLayout
  Object.values(userItemCounts).forEach(user => {
    const topItemsArray = Object.entries(user.topItems)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count]) => {
        const [code, ...nameParts] = key.split('-');
        return `${nameParts.join('-')}: ${count}`;
      })
      .join(", ");
    
    userAnalysisData.push({
      name: user.name,
      totalScans: user.totalScans,
      uniqueItems: user.uniqueItems.size,
      topItems: topItemsArray,
      averagePerItem: Math.round((user.totalScans / user.uniqueItems.size) * 10) / 10
    });
  });
  
  // Sort user analysis by total scans
  userAnalysisData.sort((a, b) => b.totalScans - a.totalScans);

  const detailHeaders = [
    {key:"PTC", label:"PTC"},
    {key:"SkuName", label:"Item Name"},
    {key:"PostedBy", label:"Scanned By"},
    {key:"cnt", label:"Count"},
  ];

  const summaryHeaders = [
    {key:"code", label:"Code"},
    {key:"PTC", label:"PTC"},
    {key:"SkuName", label:"Item Name"},
    {key:"cnt", label:"Total Scans"},
    {key:"userCount", label:"User Count"},
    {key:"users", label:"Scanned By"},
  ];

  const userAnalysisHeaders = [
    {key:"name", label:"User Name"},
    {key:"totalScans", label:"Total Scans"},
    {key:"uniqueItems", label:"Unique Items"},
    {key:"averagePerItem", label:"Avg per Item"},
    {key:"topItems", label:"Top Items"},
  ];

  const navigate = useNavigate();

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Calculate percentage of total for a user
  const calculatePercentage = (count) => {
    return Math.round((count / aggregatedData.totalScans) * 100);
  };

  return (
    <MainLayout>
      <div className="bg-white space-y-6 p-6 rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-indigo-100">
                <Repeat className="text-indigo-500" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Browsed Repack Items Detail</h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            {/* <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
              <Download size={16} />
              <span>Export</span>
            </button> */}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Scans</p>
                <p className="text-2xl font-bold">{aggregatedData.totalScans}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <BarChart3 className="text-blue-500" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Unique Items</p>
                <p className="text-2xl font-bold">{aggregatedData.uniqueItems}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-50">
                <Package className="text-purple-500" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Highest Volume Item</p>
                <div className="p-2 rounded-full bg-amber-50">
                  <Package className="text-amber-500" size={16} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate max-w-32">{aggregatedData.highestVolume.name}</span>
                  <span>{aggregatedData.highestVolume.count}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Top Scanners</p>
                <div className="p-2 rounded-full bg-green-50">
                  <UserCircle className="text-green-500" size={16} />
                </div>
              </div>
              <div className="space-y-1">
                {aggregatedData.topUsers.slice(0, 3).map((user, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium">{user.name}</span>
                    <span>{user.count} ({calculatePercentage(user.count)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User contribution bar chart */}
        {/* <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">User Contribution</h3>
          <div className="flex flex-col space-y-2">
            {aggregatedData.topUsers.slice(0, 5).map((user, idx) => {
              const percentage = calculatePercentage(user.count);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span>{user.name}</span>
                    <span>{user.count} scans ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}

        {/* Most scanned items */}
        {/* <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Most Scanned Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scans
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aggregatedData.mostScannedItems.map((item, idx) => {
                  const percentage = calculatePercentage(item.count);
                  return (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Scan Details
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`${
                activeTab === 'summary'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Product Summary
            </button>
            {/* <button
              onClick={() => setActiveTab('userAnalysis')}
              className={`${
                activeTab === 'userAnalysis'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              User Analysis
            </button> */}
          </nav>
        </div>

        {/* Table Content based on active tab */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {activeTab === 'details' && (
            <TableLayout 
              title="Scan Details" 
              headers={detailHeaders} 
              data={sortedItems}
              loading={loading}
            />
          )}
          
          {activeTab === 'summary' && (
            <TableLayout 
              title="Product Summary" 
              headers={summaryHeaders} 
              data={productSummaryData}
              loading={loading}
            />
          )}

          {activeTab === 'userAnalysis' && (
            <TableLayout 
              title="User Analysis" 
              headers={userAnalysisHeaders} 
              data={userAnalysisData}
              loading={loading}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BrowsedRepackItemsDetail;