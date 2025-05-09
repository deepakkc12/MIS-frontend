import React, { useState, useEffect } from "react";
import { ArrowLeft, QrCode, BarChart3, Download, Search, UserCircle, Package } from "lucide-react";
import { getRequest } from "../../../../../../services/apis/requests";
import TableLayout from "../../../../../../components/Table/TableLayout";
import MainLayout from "../../../../Layout/Layout";
import { useNavigate } from "react-router-dom";

const BrowsedEANItemsDetail = ({ onBack }) => {
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
    topUsers: [],
    mostScannedItems: []
  });
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'summary'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRequest("barcode/ean-items/");
      if (response.success) {
        setItemsData(response.data);
        processAggregatedData(response.data);
      }
    } catch (error) {
      console.error("Error fetching EAN items data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processAggregatedData = (data) => {
    // Calculate total scans
    const totalScans = data.reduce((sum, item) => sum + item.cnt, 0);
    
    // Count unique items by code
    const uniqueCodes = new Set(data.map(item => item.code));
    
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
    
    setAggregatedData({
      totalScans,
      uniqueItems: uniqueCodes.size,
      topUsers,
      mostScannedItems
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
        SkuName: product.SkuName,
        cnt: product.cnt,
        users: userScans,
      };
    });

  const detailHeaders = [
    {key:"PTC", label:"PTC"},
    {key:"SkuName", label:"Item Name"},
    {key:"PostedBy", label:"Scanned By"},
    {key:"cnt", label:"Count"},
  ];

  const summaryHeaders = [
    {key:"code", label:"EAN Code"},
    {key:"SkuName", label:"Item Name"},
    {key:"cnt", label:"Total Scans"},
    {key:"users", label:"Scanned By"},
  ];
const navigate=useNavigate()
  return (
    <MainLayout>
        <div className="bg-white space-y-6 p-6 rounded-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button 
            onClick={()=>{navigate(-1)}} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-indigo-100">
              <QrCode className="text-indigo-500" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Browsed EAN Items Detail</h2>
          </div>
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
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">Most Scanned Items</p>
              <div className="p-2 rounded-full bg-amber-50">
                <QrCode className="text-amber-500" size={16} />
              </div>
            </div>
            <div className="space-y-1">
              {aggregatedData.mostScannedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="font-medium truncate max-w-32">{item.name}</span>
                  <span>{item.count}</span>
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
      </div>
    </div>
    </MainLayout>

  );
};

export default BrowsedEANItemsDetail;