import React, { useState, useEffect } from "react";
import { BarChart3, ArrowRight, Search, Info, AlertCircle, Tag, Package, QrCode } from "lucide-react";
import { getRequest } from "../../../../../services/apis/requests";
import BrowsedEANItemsDetail from "./components/BrowsedEANitems"; // Import the detail component
import { useNavigate } from "react-router-dom";
import { nav } from "framer-motion/client";

const TypedEANBarcodes = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last7days");
  const [showDetailView, setShowDetailView] = useState(false);
  const [activeDetailView, setActiveDetailView] = useState(null);

  const navigate = useNavigate()
  const [metrics, setMetrics] = useState({
    POS_Audit_BrowsedEANitems: {
      count: 387,
      onClick: () => {
        navigate(`/mis-reports/browsed-ean-items`)
      },
      icon: QrCode,
      color: "indigo"
    },
    POS_Audit_BrowsedPrivateLabels: {
      count: 124,
      onClick: () => {
        navigate(`/mis-reports/browsed-private-labels`)
        console.log("Private Labels detail view requested");
      },
      icon: Tag,
      color: "blue"
    },
    POS_Audit_BrowsedRepackItems: {
      count: 78,
      onClick: () => {
        // Implement other detail views as needed
        console.log("Repack Items detail view requested");
      },
      icon: Package,
      color: "emerald"
    },
    POS_Audit_EAN_NotRegistred: {
      count: 43,
      onClick: () => {
        // Implement other detail views as needed
        console.log("Unregistered EAN detail view requested");
      },
      icon: AlertCircle,
      color: "red"
    },
    POS_Audit_ManualEntryBarcodes: {
      count: 218,
      onClick: () => {
        // Implement other detail views as needed
        console.log("Manual Entry detail view requested");
      },
      icon: Search,
      color: "purple"
    }
  });

  const getData = async () => {
    const response = await getRequest(`barcode/metrics/`);

    if (response.success) {
      const data = response.data;
      setMetrics({
        POS_Audit_BrowsedEANitems: {
          count: data.eanItems,
          onClick: () => {
            navigate(`/mis-reports/browsed-ean-items`)
          },
          icon: QrCode,
          color: "indigo"
        },
        POS_Audit_BrowsedPrivateLabels: {
          count: data.privateLabels,
          onClick: () => {
            navigate(`/mis-reports/browsed-private-labels`)
            console.log("Private Labels detail view requested");
          },
          icon: Tag,
          color: "blue"
        },
        POS_Audit_BrowsedRepackItems: {
          count: data.repackItems,
          onClick: () => {
           navigate(`/mis-reports/browsed-repack-items`)
            console.log("Repack Items detail view requested");
          },
          icon: Package,
          color: "emerald"
        },
        POS_Audit_EAN_NotRegistred: {
          count: data.UnregisteredEans,
          onClick: () => {
            navigate(`/mis-reports/unregistered-eans`)
            console.log("Unregistered EAN detail view requested");
          },
          icon: AlertCircle,
          color: "red"
        },
        POS_Audit_ManualEntryBarcodes: {
          count: data.manuallyEntryBarcodes,
          onClick: () => {
            navigate(`/mis-reports/manual-barcodes`)
            console.log("Manual Entry detail view requested");
          },
          icon: Search,
          color: "purple"
        }
      });
    }
  };

  // Simulate data changes when period changes
  useEffect(() => {
    // This would normally fetch data based on the selected period
    getData();
  }, [selectedPeriod]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "last7days":
        return "Last 7 Days";
      case "lastMonth":
        return "Last Month";
      case "lastQuarter":
        return "Last Quarter";
      case "lastYear":
        return "Last Year";
      default:
        return "Last 7 Days";
    }
  };

  const getMetricTitle = (key) => {
    switch (key) {
      case "POS_Audit_BrowsedEANitems":
        return "Browsed EAN Items";
      case "POS_Audit_BrowsedPrivateLabels":
        return "Browsed Private Labels";
      case "POS_Audit_BrowsedRepackItems":
        return "Browsed Repack Items";
      case "POS_Audit_EAN_NotRegistred":
        return "Unregistered EAN Codes";
      case "POS_Audit_ManualEntryBarcodes":
        return "Manual Entry Barcodes";
      default:
        return key.replace("POS_Audit_", "").replace(/([A-Z])/g, " $1");
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

  // Handler to go back from detail view to main view
  const handleBackFromDetail = () => {
    setShowDetailView(false);
    setActiveDetailView(null);
  };

  // If showing detail view
  if (showDetailView) {
    if (activeDetailView === "POS_Audit_BrowsedEANitems") {
      return <BrowsedEANItemsDetail onBack={handleBackFromDetail} />;
    }
    // Add other detail views as needed
    return null;
  }

  // Main metrics view
  return (
    <div className="space-y-6 ">
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
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-3xl font-bold text-gray-900">{metric.count}</span>
                  <button
                    onClick={metric.onClick}
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
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