import React, { useState, useEffect } from 'react';

const AnimatedMetricCards = ({ performanceMetrics }) => {
  // Animation state
  const [showCards, setShowCards] = useState(false);
  
  // Calculate impact percentage
  const impactPercentage = performanceMetrics?.totalRevenue 
    ? ((performanceMetrics.projectedLoss / performanceMetrics.totalRevenue) * 100).toFixed(1)
    : '0.0';
  
  // Trigger animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div 
        className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500 transition-all duration-700 hover:shadow-lg"
        style={{ 
          opacity: showCards ? 1 : 0,
          transform: showCards ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '50ms'
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Total NPC
            </h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {performanceMetrics.customerCount}
            </p>
          </div>
          <div className="bg-blue-100 p-2 rounded transform transition-transform duration-500" 
            style={{
              transform: showCards ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-15deg)',
              transitionDelay: '100ms'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
        <div 
          className="mt-2 transition-all duration-500"
          style={{ 
            opacity: showCards ? 1 : 0,
            transitionDelay: '150ms'
          }}
        >
          <span className="text-sm text-gray-500">Avg. Customer Rank: </span>
          <span className="text-sm font-medium">
            {performanceMetrics.averageRank?.toFixed(1)}/100
          </span>
        </div>
      </div>

      <div 
        className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500 transition-all duration-700 hover:shadow-lg"
        style={{ 
          opacity: showCards ? 1 : 0,
          transform: showCards ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '400ms'
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Revenue in frequent months
            </h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              ₹{performanceMetrics.totalRevenue?.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-100 p-2 rounded transform transition-transform duration-500" 
            style={{
              transform: showCards ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-15deg)',
              transitionDelay: '600ms'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div 
          className="mt-2 transition-all duration-500"
          style={{ 
            opacity: showCards ? 1 : 0,
            transitionDelay: '800ms'
          }}
        >
          <span className="text-sm text-gray-500">Monthly Average: </span>
          <span className="text-sm font-medium">
            ₹{(performanceMetrics.totalRevenue / 3)?.toFixed(2)}
          </span>
        </div>
      </div>

      <div 
        className="bg-white shadow-md rounded-lg p-4 border-l-4 border-red-500 transition-all duration-700 hover:shadow-lg"
        style={{ 
          opacity: showCards ? 1 : 0,
          transform: showCards ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '600ms'
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Revenue Loss
            </h3>
            <p className="text-xl font-bold text-red-600 mt-1">
              ₹{performanceMetrics.projectedLoss.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-100 p-2 rounded transform transition-transform duration-500" 
            style={{
              transform: showCards ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-15deg)',
              transitionDelay: '800ms'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
        </div>
        <div 
          className="mt-2 transition-all duration-500"
          style={{ 
            opacity: showCards ? 1 : 0,
            transitionDelay: '1000ms'
          }}
        >
          <span className="text-sm text-gray-500">Impact on Revenue: </span>
          <span className="text-sm font-medium text-red-600">
            {impactPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedMetricCards;