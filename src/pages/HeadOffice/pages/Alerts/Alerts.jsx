import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import MainLayout from '../../Layout/Layout';

const ALERT_CONFIGS = {
  CRITICAL: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    shadowColor: 'shadow-red-100'
  },
  WARNING: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    shadowColor: 'shadow-yellow-100'
  },
  RESOLVED: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    shadowColor: 'shadow-green-100'
  },
  PENDING: {
    icon: Info,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    shadowColor: 'shadow-blue-100'
  }
};

const systemAlertsMockData = [
  {
    id: 1,
    system: 'Payment Gateway',
    message: 'Transaction processing delay detected',
    timestamp: '2024-01-25 14:30:00',
    status: 'CRITICAL',
    severity: 'High',
    duration: '2h 15m'
  },
  {
    id: 2,
    system: 'Inventory Management',
    message: 'Low stock in Electronics category',
    timestamp: '2024-01-24 09:15:00', 
    status: 'WARNING',
    severity: 'Medium',
    duration: '12h 45m'
  },
  {
    id: 3, 
    system: 'Server Infrastructure',
    message: 'Database backup completed successfully',
    timestamp: '2024-01-23 22:45:00',
    status: 'RESOLVED',
    severity: 'Low',
    duration: '45m'
  },
  {
    id: 4,
    system: 'Software Update',
    message: 'Patch awaiting approval',
    timestamp: '2024-01-22 11:20:00',
    status: 'PENDING',
    severity: 'Low',
    duration: '1d 6h'
  }
];

const SoftSystemAlerts = () => {
  return (
   <MainLayout>
     <div className="min-h-screen rounded-md bg-white p-8">
      <div className=" mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">System Alerts</h1>
        
        {systemAlertsMockData.map((alert) => {
          const config = ALERT_CONFIGS[alert.status];
          const AlertIcon = config.icon;
          
          return (
            <div 
              key={alert.id} 
              className={`
                ${config.bgColor} ${config.borderColor} ${config.shadowColor}
                rounded-3xl border p-5 
                shadow-lg hover:shadow-xl 
                transition-all duration-300 
                flex items-center 
                space-x-5
              `}
            >
              <div className="flex-shrink-0">
                <AlertIcon className={`w-10 h-10 ${config.textColor} opacity-70`} />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800">{alert.system}</h3>
                  <span className={`
                    text-xs font-semibold uppercase 
                    px-2 py-1 rounded-full 
                    ${config.bgColor} ${config.textColor}
                  `}>
                    {alert.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{alert.timestamp}</span>
                  <span>Duration: {alert.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
   </MainLayout>
  );
};

export default SoftSystemAlerts;