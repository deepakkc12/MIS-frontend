import React, { useState, useEffect } from "react";
import { ArrowLeft, QrCode, BarChart3, Download, Search, UserCircle, Package, Pencil, PieChart } from "lucide-react";
import { getRequest } from "../../../../../../services/apis/requests";
import TableLayout from "../../../../../../components/Table/TableLayout";
import MainLayout from "../../../../Layout/Layout";
import { useNavigate } from "react-router-dom";

const ManuallyEnteredBarcodesDetail = () => {
  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "cnt",
    direction: "desc"
  });
  const [aggregatedData, setAggregatedData] = useState({
    totalScans: 0,
    totalUsers: 0,
    uniqueItems: 0,
    topUsers: [],
    topGroups: [],
    topScannedItems: [],
    scansByDay: {}
  });
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'summary', 'users'

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real scenario, we would fetch from the API
      const response = await getRequest("barcode/manually-entered/");
      
      
      const data = response.data ;
      setItemsData(data);
      processAggregatedData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching manually entered barcodes data:", error);
      setLoading(false);
    }
  };

  const processAggregatedData = (data) => {
    // Calculate total scans
    const totalScans = data.reduce((sum, item) => sum + item.cnt, 0);
    
    // Count unique users
    const uniqueUsers = new Set(data.map(item => item.PostedBy)).size;
    
    // Count unique items by combination of code and SKU name
    const uniqueItems = new Set(data.map(item => `${item.code}-${item.SkuName}`)).size;
    
    // Get top users by scan count
    const userScans = {};
    data.forEach(item => {
      userScans[item.PostedBy] = (userScans[item.PostedBy] || 0) + item.cnt;
    });
    const topUsers = Object.entries(userScans)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    // Get top groups by scan count
    const groupScans = {};
    data.forEach(item => {
      groupScans[item.GroupName] = (groupScans[item.GroupName] || 0) + item.cnt;
    });
    const topGroups = Object.entries(groupScans)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    // Get top scanned items
    const itemScans = {};
    data.forEach(item => {
      const key = `${item.code}-${item.SkuName}`;
      itemScans[key] = (itemScans[key] || 0) + item.cnt;
    });
    const topScannedItems = Object.entries(itemScans)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count]) => {
        const [code, ...nameParts] = key.split('-');
        return { 
          code, 
          name: nameParts.join('-'), 
          count 
        };
      });
    
    // Calculate scans by day
    const scansByDay = {};
    data.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString();
      scansByDay[date] = (scansByDay[date] || 0) + item.cnt;
    });
    
    setAggregatedData({
      totalScans,
      totalUsers: uniqueUsers,
      uniqueItems,
      topUsers,
      topGroups,
      topScannedItems,
      scansByDay
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
    item.scannedCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.PostedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.PTC.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.GroupName.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Create user performance data
  const userPerformanceData = [];
  const userMap = {};
  
  itemsData.forEach(item => {
    if (!userMap[item.PostedBy]) {
      userMap[item.PostedBy] = {
        name: item.PostedBy,
        totalScans: 0,
        uniqueItems: new Set(),
        groups: new Set(),
        subSkuCodes: new Set()
      };
    }
    
    userMap[item.PostedBy].totalScans += item.cnt;
    userMap[item.PostedBy].uniqueItems.add(`${item.code}-${item.SkuName}`);
    userMap[item.PostedBy].groups.add(item.GroupName);
    userMap[item.PostedBy].subSkuCodes.add(item.scannedCode);
  });
  
  Object.values(userMap).forEach(user => {
    userPerformanceData.push({
      name: user.name,
      totalScans: user.totalScans,
      uniqueItems: user.uniqueItems.size,
      groups: user.groups.size,
      subSkuCodes: user.subSkuCodes.size
    });
  });

  const sortedUserPerformance = userPerformanceData.sort((a, b) => b.totalScans - a.totalScans);

  // Create product summary data
  const productSummaryData = [];
  const productMap = {};
  
  itemsData.forEach(item => {
    const key = `${item.code}-${item.SkuName}`;
    if (!productMap[key]) {
      productMap[key] = {
        code: item.code,
        SkuName: item.SkuName,
        GroupName: item.GroupName,
        totalScans: 0,
        users: new Set(),
        subSkuCodes: new Set()
      };
    }
    
    productMap[key].totalScans += item.cnt;
    productMap[key].users.add(item.PostedBy);
    productMap[key].subSkuCodes.add(item.scannedCode);
  });
  
  Object.values(productMap).forEach(product => {
    productSummaryData.push({
      code: product.code,
      SkuName: product.SkuName,
      GroupName: product.GroupName,
      totalScans: product.totalScans,
      users: Array.from(product.users).join(', '),
      subSkuCodes: Array.from(product.subSkuCodes).join(', ')
    });
  });

  const sortedProductSummary = productSummaryData.sort((a, b) => b.totalScans - a.totalScans);

  const detailHeaders = [
    {key: "code", label: "Primary Code"},
    {key: "scannedCode", label: "Sub SKU Code"},
    {key: "PTC", label: "PTC"},
    {key: "SkuName", label: "Item Name"},
    {key: "PostedBy", label: "User"},
    {key: "cnt", label: "Count"},
    {key: "GroupName", label: "Group"}
  ];

  const userHeaders = [
    {key: "name", label: "User Name"},
    {key: "totalScans", label: "Total Scans"},
    {key: "uniqueItems", label: "Unique Items"},
    {key: "groups", label: "Product Groups"},
    {key: "subSkuCodes", label: "Sub SKU Codes Used"}
  ];

  const productHeaders = [
    {key: "code", label: "Primary Code"},
    {key: "SkuName", label: "Item Name"},
    {key: "GroupName", label: "Group"},
    {key: "totalScans", label: "Total Scans"},
    {key: "users", label: "Users"},
    // {key: "subSkuCodes", label: "Sub SKU Codes"}
  ];

  return (
    <MainLayout>
      <div className="bg-white space-y-6 p-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-orange-100">
                <Pencil className="text-orange-500" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Manually Entered Barcodes Detail</h2>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button 
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
              title="Download data"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Scans</p>
                <p className="text-2xl font-bold">{aggregatedData.totalScans}</p>
              </div>
              <div className="p-2 rounded-full bg-orange-50">
                <BarChart3 className="text-orange-500" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{aggregatedData.totalUsers}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <UserCircle className="text-blue-500" size={20} />
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
        </div>

        {/* Top performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Top Users</h3>
              <div className="p-2 rounded-full bg-blue-50">
                <UserCircle className="text-blue-500" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              {aggregatedData.topUsers.map((user, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(user.count / aggregatedData.topUsers[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <div className="ml-4 flex justify-between items-center w-32">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-sm text-gray-500">{user.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Top Groups</h3>
              <div className="p-2 rounded-full bg-purple-50">
                <Package className="text-purple-500" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              {aggregatedData.topGroups.map((group, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(group.count / aggregatedData.topGroups[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <div className="ml-4 flex justify-between items-center w-32">
                    <span className="text-sm font-medium truncate max-w-32">{group.name}</span>
                    <span className="text-sm text-gray-500">{group.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Detail View
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`${
                activeTab === 'summary'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Product Summary
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              User Performance
            </button>
          </nav>
        </div>

        {/* Table Content based on active tab */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {activeTab === 'details' && (
            <TableLayout 
              title="Manually Entered Barcodes" 
              headers={detailHeaders} 
              data={sortedItems}
              loading={loading}
            />
          )}
          
          {activeTab === 'summary' && (
            <TableLayout 
              title="Product Summary" 
              headers={productHeaders} 
              data={sortedProductSummary}
              loading={loading}
            />
          )}
          
          {activeTab === 'users' && (
            <TableLayout 
              title="User Performance" 
              headers={userHeaders} 
              data={sortedUserPerformance}
              loading={loading}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ManuallyEnteredBarcodesDetail;