import React, { useState, useEffect } from "react";
import { ArrowLeft, QrCode, BarChart3, Download, Search, Tag, Package } from "lucide-react";
import { getRequest } from "../../../../../../services/apis/requests";
import TableLayout from "../../../../../../components/Table/TableLayout";
import MainLayout from "../../../../Layout/Layout";
import { useNavigate } from "react-router-dom";

const UnregisteredEANCodesDetail = () => {
  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "code",
    direction: "asc"
  });
  const [aggregatedData, setAggregatedData] = useState({
    totalItems: 0,
    uniqueCodes: 0,
    topGroups: [],
    priceRanges: {}
  });
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'summary'

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real scenario, we would fetch from the API
      // For demonstration, we'll use sample data
      const response =await getRequest(`barcode/unregistered-eans/`)

      if(response.success){
        setItemsData(response.data);
        processAggregatedData(response.data);
      }
      // In a real scenario, we would get this from response

      setLoading(false);
    } catch (error) {
      console.error("Error fetching unregistered EAN codes data:", error);
      setLoading(false);
    }
  };

  const processAggregatedData = (data) => {
    // Count total items
    const totalItems = data.length;
    
    // Count unique codes
    const uniqueCodes = new Set(data.map(item => item.code)).size;
    
    // Get top groups by count
    const groupCounts = {};
    data.forEach(item => {
      groupCounts[item.GroupName] = (groupCounts[item.GroupName] || 0) + 1;
    });
    const topGroups = Object.entries(groupCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    // Calculate price ranges
    const priceRanges = {
      below50: 0,
      between50And100: 0,
      between100And200: 0,
      above200: 0
    };
    
    data.forEach(item => {
      const price = parseFloat(item.MRP);
      if (price < 50) priceRanges.below50++;
      else if (price >= 50 && price < 100) priceRanges.between50And100++;
      else if (price >= 100 && price < 200) priceRanges.between100And200++;
      else priceRanges.above200++;
    });
    
    setAggregatedData({
      totalItems,
      uniqueCodes,
      topGroups,
      priceRanges
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

  // Calculate aggregated data by group
  const groupSummary = {};
  itemsData.forEach(item => {
    const key = item.GroupName;
    if (!groupSummary[key]) {
      groupSummary[key] = {
        GroupName: key,
        count: 0,
        avgPrice: 0,
        totalPrice: 0,
        items: []
      };
    }
    groupSummary[key].count += 1;
    groupSummary[key].totalPrice += parseFloat(item.MRP);
    groupSummary[key].items.push(item.SkuName);
  });

  // Convert to array and calculate averages
  const groupSummaryData = Object.values(groupSummary)
    .sort((a, b) => b.count - a.count)
    .map(group => {
      const uniqueItems = [...new Set(group.items)];
      return {
        GroupName: group.GroupName,
        count: group.count,
        avgPrice: (group.totalPrice / group.count).toFixed(2),
        items: uniqueItems.length > 3 
          ? `${uniqueItems.slice(0, 3).join(", ")} +${uniqueItems.length - 3} more` 
          : uniqueItems.join(", ")
      };
    });

  const detailHeaders = [
    {key: "code", label: "EAN Code"},
    {key: "PTC", label: "PTC"},
    {key: "SkuName", label: "Item Name"},
    {key: "MRP", label: "MRP"},
    {key: "GroupName", label: "Group"}
  ];

  const summaryHeaders = [
    {key: "GroupName", label: "Group Name"},
    {key: "count", label: "Count"},
    {key: "avgPrice", label: "Avg. Price"},
    {key: "items", label: "Items"}
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
              <div className="p-2 rounded-full bg-red-100">
                <QrCode className="text-red-500" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Unregistered EAN Codes Detail</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-bold">{aggregatedData.totalItems}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <BarChart3 className="text-blue-500" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Unique Codes</p>
                <p className="text-2xl font-bold">{aggregatedData.uniqueCodes}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-50">
                <QrCode className="text-purple-500" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Top Groups</p>
                <div className="p-2 rounded-full bg-green-50">
                  <Package className="text-green-500" size={16} />
                </div>
              </div>
              <div className="space-y-1">
                {aggregatedData.topGroups.map((group, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium">{group.name}</span>
                    <span>{group.count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Price Ranges</p>
                <div className="p-2 rounded-full bg-amber-50">
                  <Tag className="text-amber-500" size={16} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Below ₹50</span>
                  <span>{aggregatedData.priceRanges.below50}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">₹50 - ₹100</span>
                  <span>{aggregatedData.priceRanges.between50And100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Above ₹100</span>
                  <span>{aggregatedData.priceRanges.between100And200 + aggregatedData.priceRanges.above200}</span>
                </div>
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
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Item Details
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`${
                activeTab === 'summary'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Group Summary
            </button>
          </nav>
        </div>

        {/* Table Content based on active tab */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {activeTab === 'details' && (
            <TableLayout 
              title="Unregistered EAN Codes" 
              headers={detailHeaders} 
              data={itemsData}
              loading={loading}
            />
          )}
          
          {activeTab === 'summary' && (
            <TableLayout 
              title="Group Summary" 
              headers={summaryHeaders} 
              data={groupSummaryData}
              loading={loading}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UnregisteredEANCodesDetail;