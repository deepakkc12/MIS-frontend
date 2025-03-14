import React, { useState } from 'react';
import { 
  TrendingUp as TrendingUpIcon, 
  Package as PackageIcon, 
  Users as UsersIcon, 
  DollarSign as DollarSignIcon,
  BarChart2 as BarChart2Icon,
  Calendar as CalendarIcon
} from 'lucide-react';
import DatePicker from '../../../../Features/others/DatePicker';
import MainLayout from '../../Layout/Layout';
import TableLayout from '../../../../components/Table/TableLayout';

const REPORT_TYPES = [
  { 
    id: 'sales', 
    label: 'Sales Report', 
    icon: DollarSignIcon,
    color: 'emerald',
    component: SalesReport 
  },
  { 
    id: 'inventory', 
    label: 'Inventory Report', 
    icon: PackageIcon,
    color: 'blue',
    component: InventoryReport 
  },
  { 
    id: 'performance', 
    label: 'Performance Report', 
    icon: TrendingUpIcon,
    color: 'purple',
    component: PerformanceReport 
  },
  { 
    id: 'customer', 
    label: 'Customer Report', 
    icon: UsersIcon,
    color: 'orange',
    component: CustomerReport 
  },
  { 
    id: 'analytics', 
    label: 'Analytics Report', 
    icon: BarChart2Icon,
    color: 'red',
    component: AnalyticsReport 
  },
  { 
    id: 'customer', 
    label: 'Customer Report', 
    icon: UsersIcon,
    color: 'orange',
    component: CustomerReport 
  },
  { 
    id: 'customer', 
    label: 'Customer Report', 
    icon: UsersIcon,
    color: 'orange',
    component: CustomerReport 
  },
];

const DayWiseSummery = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeReport, setActiveReport] = useState(REPORT_TYPES[0].id);

  const ActiveReportComponent = REPORT_TYPES.find(
    report => report.id === activeReport
  ).component;

  const ActiveReportDetails = REPORT_TYPES.find(r => r.id === activeReport);

  return (
    <MainLayout>
      <div className="bg-gray-50  rounded-md  min-h-screen ">
        <div className="  rounded-md space-y-6  mx-auto">
     <div>
     <div className="rounded-md  bg-white text-gray-700 p-6">
            <h1 className="text-3xl font-bold">Day wise Business Summery</h1>
            {/* <p className="text-sm opacity-80">Generate insights for your business</p> */}
          </div>

          {/* Top Section: Date Picker and Report Types */}
          <div className="bg-white py-3 rounded-md  shadow-sm mb-6 p-4">
             <div className="mb-3 flex items-center space-x-2 w-64">
                <CalendarIcon className="text-blue-500" />
                <DatePicker 
                  onChange={setSelectedDate}
                  type='range'
                  className="flex-grow"
                />
              </div>
            <div className="flex items-center rounded-md space-x-4">
              {/* Date Picker */}
             

              {/* Horizontal Scrollable Report Types */}
              <div className="flex-grow hide-scrollbar overflow-x-auto">
                <div className="inline-flex space-x-2">
                  {REPORT_TYPES.map((report) => {
                    const ReportIcon = report.icon;
                    return (
                      <button
                        key={report.id}
                        onClick={() => setActiveReport(report.id)}
                        className={`
                          flex-shrink-0  flex items-center 
                          px-6 py-4 rounded-lg 
                          transition-all duration-300
                          ${activeReport === report.id 
                            ? `bg-blue-100 text-blue-800` 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                          space-x-2
                        `}
                      >
                        <ReportIcon 
                          size={18} 
                          className={activeReport === report.id 
                            ? `text-${report.color}-600` 
                            : 'text-gray-400'} 
                        />
                        <span className="text-sm font-medium whitespace-nowrap">
                          {report.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
     </div>

          {/* Full Width Report Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* <div className="p-6  border-b flex items-center"> */}
              {/* <ActiveReportDetails.icon 
                className="mr-3 text-gray-500" 
                size={24} 
              /> */}
              {/* <h2 className="text-xl font-bold text-gray-800">
                {ActiveReportDetails.label}
              </h2> */}
            {/* </div> */}
            <div className="p-6">
              <ActiveReportComponent selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Placeholder Report Components
function SalesReport() {
  return <div className="text-gray-600">
  <TableLayout title='Sales Reports' />
  </div>;
}

function InventoryReport() {
  return <div className="text-gray-600">Inventory report content placeholder</div>;
}

function PerformanceReport() {
  return <div className="text-gray-600">Performance report content placeholder</div>;
}

function CustomerReport() {
  return <div className="text-gray-600">Customer report content placeholder</div>;
}

function AnalyticsReport() {
  return <div className="text-gray-600">Analytics report content placeholder</div>;
}

export default DayWiseSummery;