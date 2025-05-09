import React, { useState, useEffect } from "react";
import { ArrowLeft, Tag, BarChart3, Download, Search, UserCircle, Package, PieChart } from "lucide-react";
import { getRequest } from "../../../../../../services/apis/requests";
import TableLayout from "../../../../../../components/Table/TableLayout";
import MainLayout from "../../../../Layout/Layout";
import { useNavigate } from "react-router-dom";

const BrowsedPrivateLabelsDetail = () => {
  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "cnt",
    direction: "desc"
  });
  const [aggregatedData, setAggregatedData] = useState({
    totalScans: 0,
    uniqueItems: 0,
    uniqueGroups: 0,
    topUsers: [],
    mostScannedItems: [],
    topProductGroups: []
  });
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'summary', or 'groups'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRequest("barcode/private-labels/");
      if (response.success) {
        setItemsData(response.data);
        processAggregatedData(response.data);
      }
    } catch (error) {
      console.error("Error fetching Private Labels data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processAggregatedData = (data) => {
    // Calculate total scans
    const totalScans = data.reduce((sum, item) => sum + item.cnt, 0);
    
    // Count unique items by code
    const uniqueCodes = new Set(data.map(item => item.code));
    
    // Count unique product groups
    const uniqueGroups = new Set(data.map(item => item.GroupName));
    
    // Get top users by scan count
    const userScans = {};
    data.forEach(item => {
      userScans[item.PostedBy] = (userScans[item.PostedBy] || 0) + item.cnt;
    });
    const topUsers = Object.entries(userScans)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    // Get most scanned items
    const itemScans = {};
    data.forEach(item => {
      const key = `${item.code}-${item.SkuName}`;
      itemScans[key] = (itemScans[key] || 0) + item.cnt;
    });
    const mostScannedItems = Object.entries(itemScans)
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
    
    // Get top product groups
    const groupScans = {};
    data.forEach(item => {
      groupScans[item.GroupName] = (groupScans[item.GroupName] || 0) + item.cnt;
    });
    const topProductGroups = Object.entries(groupScans)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([group, count]) => ({ group, count }));
    
    setAggregatedData({
      totalScans,
      uniqueItems: uniqueCodes.size,
      uniqueGroups: uniqueGroups.size,
      topUsers,
      mostScannedItems,
      topProductGroups
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

  // Calculate aggregated counts by product
  const productCounts = {};
  itemsData.forEach(item => {
    const key = `${item.code}-${item.SkuName}`;
    if (!productCounts[key]) {
      productCounts[key] = {
        code: item.code,
        PTC: item.PTC,
        SkuName: item.SkuName,
        GroupName: item.GroupName,
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
        SkuName: product.SkuName,
        GroupName: product.GroupName,
        cnt: product.cnt,
        users: userScans,
      };
    });

  // Calculate aggregated counts by product group
  const groupCounts = {};
  itemsData.forEach(item => {
    const key = item.GroupName;
    if (!groupCounts[key]) {
      groupCounts[key] = {
        GroupName: item.GroupName,
        cnt: 0,
        uniqueItems: new Set(),
        users: {}
      };
    }
    groupCounts[key].cnt += item.cnt;
    groupCounts[key].uniqueItems.add(item.code);
    groupCounts[key].users[item.PostedBy] = (groupCounts[key].users[item.PostedBy] || 0) + item.cnt;
  });

  // Convert group counts to format suitable for TableLayout
  const groupSummaryData = Object.values(groupCounts)
    .sort((a, b) => b.cnt - a.cnt)
    .map(group => {
      const userScans = Object.entries(group.users)
        .sort((a, b) => b[1] - a[1])
        .map(([user, count]) => `${user}: ${count}`)
        .join(", ");
      
      return {
        GroupName: group.GroupName,
        cnt: group.cnt,
        uniqueItems: group.uniqueItems.size,
        users: userScans,
      };
    });

  const detailHeaders = [
    {key:"PTC", label:"PTC"},
    {key:"SkuName", label:"Item Name"},
    {key:"GroupName", label:"Product Group"},
    {key:"PostedBy", label:"Scanned By"},
    {key:"cnt", label:"Count"},
  ];

  const summaryHeaders = [
    {key:"code", label:"Code"},
    {key:"SkuName", label:"Item Name"},
    {key:"GroupName", label:"Product Group"},
    {key:"cnt", label:"Total Scans"},
    {key:"users", label:"Scanned By"},
  ];

  const groupHeaders = [
    {key:"GroupName", label:"Product Group"},
    {key:"uniqueItems", label:"Unique Items"},
    {key:"cnt", label:"Total Scans"},
    {key:"users", label:"Scanned By"},
  ];

  const navigate = useNavigate();

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
                <Tag className="text-indigo-500" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Browsed Private Labels Detail</h2>
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
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Product Groups</p>
                <p className="text-2xl font-bold">{aggregatedData.uniqueGroups}</p>
              </div>
              <div className="p-2 rounded-full bg-teal-50">
                <PieChart className="text-teal-500" size={20} />
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
                {aggregatedData.topUsers.map((user, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium">{user.name}</span>
                    <span>{user.count} scans</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Second row of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Most Scanned Items</p>
                <div className="p-2 rounded-full bg-amber-50">
                  <Tag className="text-amber-500" size={16} />
                </div>
              </div>
              <div className="space-y-1">
                {aggregatedData.mostScannedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium truncate max-w-56">{item.name}</span>
                    <span>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Top Product Groups</p>
                <div className="p-2 rounded-full bg-rose-50">
                  <PieChart className="text-rose-500" size={16} />
                </div>
              </div>
              <div className="space-y-1">
                {aggregatedData.topProductGroups.map((group, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium truncate max-w-56">{group.group}</span>
                    <span>{group.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
            <button
              onClick={() => setActiveTab('groups')}
              className={`${
                activeTab === 'groups'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Group Analysis
            </button>
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

          {activeTab === 'groups' && (
            <TableLayout 
              title="Product Group Analysis" 
              headers={groupHeaders} 
              data={groupSummaryData}
              loading={loading}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BrowsedPrivateLabelsDetail;