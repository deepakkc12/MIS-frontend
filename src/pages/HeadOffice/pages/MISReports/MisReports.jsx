import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  FileEdit,
  Bell,
  Clock,
  TrendingDown,
  AlertTriangle,
  Wallet,
  FileBarChart,
  ScanQrCode,
} from "lucide-react";
import MainLayout from "../../Layout/Layout";
import TableLayout from "../../../../components/Table/TableLayout";
import PurchaseGrmReports from "./PurchaseGrmExceptions.jsx/PurchaseGrmReport";
import SKUAnalysisMatrix from "./ProductAnalysis/SkuAnalysisMetrix";
import PurchaseGrmAnalytics from "./PurchaseGrmExceptions.jsx/PurchaseGrmANalatycs";
import TypedEANBarcodes from "./TypedEans/TypedEan";

const REPORT_TYPES = [
  {
    id: "6",
    label: "Typed EAN Barcodes",
    icon: ScanQrCode,
    color: "purple",
    description: "Track manually entered barcodes",
    component: TypedEANBarcodes,
  },
  {
    id: "1",
    label: "Ledger Verifications",
    icon: Wallet,
    color: "blue",
    description: "Review and verify ledger entries",
    component: SalesReport,
  },
  {
    id: "3",
    label: "Transaction Count Exceptions",
    icon: FileBarChart,
    color: "orange",
    description: "Track unusual transaction frequencies",
    component: PerformanceReport,
  },
  {
    id: "4",
    label: "Voucher Deletions",
    icon: AlertTriangle,
    color: "yellow",
    description: "Monitor deleted voucher records",
    component: CustomerReport,
  },
  {
    id: "5",
    label: "Voucher Edit Requests",
    icon: FileEdit,
    color: "emerald",
    description: "Review voucher modification requests",
    component: AnalyticsReport,
  },
  
  // {
  //   id: "7",
  //   label: "POS Alerts",
  //   icon: Bell,
  //   color: "pink",
  //   description: "View point-of-sale system alerts",
  //   component: CustomerReport,
  // },
  // {
  //   id: "8",
  //   label: "Expiry Alerts",
  //   icon: Clock,
  //   color: "indigo",
  //   description: "Monitor approaching expiration dates",
  //   component: CustomerReport,
  // },

  {
    id: "9",
    label: "Negative Sales",
    icon: TrendingDown,
    color: "rose",
    description: "Track negative sales transactions",
    component: CustomerReport,
  },
  {
    id: "10",
    label: "Purchase Grm Exceptions",
    icon: TrendingDown,
    color: "rose",
    description: "Track negative sales transactions",
    component: PurchaseGrmAnalytics,
  },
  {
    id: "11",
    label: "Sku Analysis",
    icon: TrendingDown,
    color: "rose",
    description: "Track profit and sales of sku",
    component: SKUAnalysisMatrix,
  },
];

const MisReports = () => {
  const [activeReport, setActiveReport] = useState(REPORT_TYPES[0].id);
  const reportContentRef = useRef(null);

  const ActiveReportComponent =
    REPORT_TYPES.find((report) => report.id === activeReport)?.component ||
    SalesReport;

  const ActiveReportDetails = REPORT_TYPES.find((r) => r.id === activeReport);

  // Handle selecting a report and scrolling to content
  const handleReportSelect = (reportId) => {
    setActiveReport(reportId);

    // Add a small delay to ensure the state has updated before scrolling
    setTimeout(() => {
      if (reportContentRef.current) {
        reportContentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <MainLayout>
      <div className="min-h-screen rounded-md bg-gray-50 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">MIS Analatycs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and analyze business operations
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REPORT_TYPES.map((report) => {
              const ReportIcon = report.icon;
              const isActive = activeReport === report.id;
              const colorClass = isActive ? report.color : "gray";

              return (
                <button
                  key={report.id}
                  onClick={() => handleReportSelect(report.id)}
                  className={`
                    flex items-center space-x-4 rounded-lg border p-4 transition-all
                    ${
                      isActive
                        ? `border-${colorClass}-200 bg-${colorClass}-50 shadow-sm`
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }
                  `}
                  aria-selected={isActive}
                  role="tab"
                >
                  <div
                    className={`
                    rounded-full p-2
                    ${
                      isActive
                        ? `bg-${colorClass}-100 text-${colorClass}-600`
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                  >
                    <ReportIcon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3
                      className={`font-medium
                      ${isActive ? `text-${colorClass}-900` : "text-gray-900"}
                    `}
                    >
                      {report.label}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {report.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            ref={reportContentRef}
            className="rounded-lg bg-white p-6 shadow-sm scroll-mt-4"
            role="tabpanel"
            id="report-content"
          >
            <div className="mb-6 flex items-center space-x-3 border-b pb-4">
              <ActiveReportDetails.icon
                className={`text-${ActiveReportDetails.color}-500`}
                size={24}
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {ActiveReportDetails.label}
                </h2>
                <p className="text-sm text-gray-500">
                  {ActiveReportDetails.description}
                </p>
              </div>
            </div>
            <ActiveReportComponent />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Placeholder Report Components
function SalesReport() {
  return <TableLayout title="Ledger Verification Report" />;
}

function InventoryReport() {
  return <TableLayout title="Range Exceptions Report" />;
}

function PerformanceReport() {
  return <TableLayout title="Transaction Count Exceptions Report" />;
}

function CustomerReport() {
  return <TableLayout title="Report Details" />;
}

function AnalyticsReport() {
  return <TableLayout title="Voucher Edit Requests Report" />;
}




export default MisReports;
