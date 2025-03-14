import React, { useState, useEffect } from "react";
import { BarChart3, ArrowRight, Search, Info, AlertCircle, Tag, Package, QrCode } from "lucide-react";

const TypedEANBarcodes = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last7days");
  const [metrics, setMetrics] = useState({
    POS_Audit_BrowsedEANitems: {
      count: 387,
      change: "+12.4%",
      isPositive: false,
      icon: QrCode,
      color: "indigo"
    },
    POS_Audit_BrowsedPrivateLabels: {
      count: 124,
      change: "-5.2%",
      isPositive: true,
      icon: Tag,
      color: "blue"
    },
    POS_Audit_BrowsedRepackItems: {
      count: 78,
      change: "+8.1%",
      isPositive: false,
      icon: Package,
      color: "emerald"
    },
    POS_Audit_EAN_NotRegistred: {
      count: 43,
      change: "+21.5%",
      isPositive: false,
      icon: AlertCircle,
      color: "red"
    },
    POS_Audit_ManualEntryBarcodes: {
      count: 218,
      change: "-3.7%",
      isPositive: true,
      icon: Search,
      color: "purple"
    }
  });

  // Simulate data changes when period changes
  useEffect(() => {
    // This would normally fetch data based on the selected period
    const generateRandomData = () => {
      const newMetrics = { ...metrics };
      
      Object.keys(newMetrics).forEach(key => {
        const baseCount = newMetrics[key].count;
        const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        
        newMetrics[key] = {
          ...newMetrics[key],
          count: Math.round(baseCount * randomFactor),
          change: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 25).toFixed(1)}%`,
          isPositive: Math.random() > 0.5
        };
      });
      
      setMetrics(newMetrics);
    };
    
    generateRandomData();
  }, [selectedPeriod]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "last7days": return "Last 7 Days";
      case "lastMonth": return "Last Month";
      case "lastQuarter": return "Last Quarter";
      case "lastYear": return "Last Year";
      default: return "Last 7 Days";
    }
  };

  const getMetricTitle = (key) => {
    switch (key) {
      case "POS_Audit_BrowsedEANitems": return "Browsed EAN Items";
      case "POS_Audit_BrowsedPrivateLabels": return "Browsed Private Labels";
      case "POS_Audit_BrowsedRepackItems": return "Browsed Repack Items";
      case "POS_Audit_EAN_NotRegistred": return "Unregistered EAN Codes";
      case "POS_Audit_ManualEntryBarcodes": return "Manual Entry Barcodes";
      default: return key.replace("POS_Audit_", "").replace(/([A-Z])/g, " $1");
    }
  };

  const getMetricDescription = (key) => {
    switch (key) {
      case "POS_Audit_BrowsedEANitems": 
        return "Products scanned by EAN barcode";
      case "POS_Audit_BrowsedPrivateLabels": 
        return "Private label products scanned by barcode";
      case "POS_Audit_BrowsedRepackItems": 
        return "Repack items scanned at POS";
      case "POS_Audit_EAN_NotRegistred": 
        return "Barcode scans for unregistered products";
      case "POS_Audit_ManualEntryBarcodes": 
        return "Barcodes manually entered by cashiers";
      default: 
        return "Metric description not available";
    }
  };

  return (
    <div className="space-y-6">
      {/* Time period selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Typed EAN Barcode Metrics</h2>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastQuarter">Last Quarter</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 p-4">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="text-purple-500" size={20} />
          <h3 className="font-medium text-purple-900">Summary for {getPeriodLabel()}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          During this period, there were a total of <span className="font-semibold">{Object.values(metrics).reduce((sum, metric) => sum + metric.count, 0)}</span> barcode 
          related activities. Unregistered EAN codes represent <span className="font-semibold">{((metrics.POS_Audit_EAN_NotRegistred.count / Object.values(metrics).reduce((sum, metric) => sum + metric.count, 0)) * 100).toFixed(1)}%</span> of 
          all scanned barcodes, which requires attention.
        </p>
        <p className="text-sm text-gray-600">
          Manual entry barcodes have {metrics.POS_Audit_ManualEntryBarcodes.isPositive ? "decreased" : "increased"} by {metrics.POS_Audit_ManualEntryBarcodes.change.replace('-', '').replace('+', '')} compared to the previous period.
        </p>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(metrics).map((key) => {
          const metric = metrics[key];
          const IconComponent = metric.icon;
          
          return (
            <div key={key} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className={`p-4 border-b border-${metric.color}-100 bg-${metric.color}-50`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full bg-${metric.color}-100`}>
                      <IconComponent className={`text-${metric.color}-500`} size={16} />
                    </div>
                    <h3 className="font-medium text-gray-900">{getMetricTitle(key)}</h3>
                  </div>
                  <div className={`flex items-center text-sm ${metric.isPositive ? "text-green-600" : "text-red-600"}`}>
                    {metric.change}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-3xl font-bold text-gray-900">{metric.count}</span>
                  <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                    View Details <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{getMetricDescription(key)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TypedEANBarcodes;