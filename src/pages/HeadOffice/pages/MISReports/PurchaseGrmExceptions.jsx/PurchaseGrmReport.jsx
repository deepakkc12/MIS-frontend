import React from 'react';

const PurchaseGrmReports = () => {
  // Data structure focused on category-wise comparison
  const data = {
    title: "3.3 billion transactions",
    subtitle: "analyzed across categories with",
    subtitle2: "purchase vs GRM exception breakdown",
    description: "Category-wise analysis of purchase and GRM exceptions (2023-2024)",
    purchaseValue: 2.1,
    grmValue: 3.3,
    categories: [
      {
        name: "Vegetables",
        transactions: 850,
        purchaseExceptions: 324,
        grmExceptions: 198,
        percentageOfTotal: 28
      },
      {
        name: "Groceries",
        transactions: 1240,
        purchaseExceptions: 486,
        grmExceptions: 254,
        percentageOfTotal: 32
      },
      {
        name: "Dairy",
        transactions: 620,
        purchaseExceptions: 267,
        grmExceptions: 185,
        percentageOfTotal: 19
      },
      {
        name: "Meat",
        transactions: 590,
        purchaseExceptions: 312,
        grmExceptions: 176,
        percentageOfTotal: 21
      }
    ],
    rightContent: `Purchase and GRM exception rates show significant variance across different product categories, revealing areas where specific improvements can target the most problematic parts of the procurement cycle.

Vegetables show the highest rate of purchase exceptions compared to GRM exceptions, with data indicating issues primarily in initial order entry, possibly due to seasonal price fluctuations and quality specification variations.

Groceries represent the largest volume of transactions and show balanced distribution between purchase and GRM exceptions, suggesting systemic issues that affect both processes equally.

Dairy products show the lowest exception rates overall but demonstrate a concerning trend where GRM exceptions are proportionally higher than in other categories, pointing to potential issues with receiving processes and cold chain verification.

Meat category demonstrates unique challenges with high purchase exception rates related to price changes and specification issues but relatively lower GRM exception rates, suggesting effective quality control at receipt.`
  };

  // Calculate totals for better comparisons
  const totalPurchaseExceptions = data.categories.reduce((sum, cat) => sum + cat.purchaseExceptions, 0);
  const totalGrmExceptions = data.categories.reduce((sum, cat) => sum + cat.grmExceptions, 0);
  
  // Colors for visualization
  const categoryColors = {
    "Vegetables": "#4ade80", // green-400
    "Groceries": "#facc15", // yellow-400
    "Dairy": "#60a5fa", // blue-400
    "Meat": "#f87171", // red-400
  };

  return (
    <div className="flex flex-col lg:flex-row w-full mx-auto bg-white">
      {/* Left side - visualization */}
      <div className="w-full lg:w-2/3 p-6 ">
        {/* Title section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-yellow-500">{data.title}</h1>
          <h2 className="text-2xl font-medium">{data.subtitle}</h2>
          <h2 className="text-2xl font-medium">{data.subtitle2}</h2>
          <p className="mt-6 text-sm max-w-lg mx-auto">{data.description}</p>
        </div>

        <div className='grid grid-cols-3 '>
          {/* Main bar chart */}
          <div className="flex col-span-1  justify-center items-end space-x-6 h-64 mb-12">
            {/* Purchase Bar */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-end" style={{ height: '200px' }}>
                <div className="w-24 bg-purple-400" style={{ height: `${(data.purchaseValue/data.grmValue) * 160}px` }}></div>
              </div>
              <div className="mt-2 text-center">
                <div className="bg-purple-400 w-12 h-12 flex justify-center items-center mx-auto mb-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-800" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">{data.purchaseValue} billion</p>
                <p className="text-gray-600">Purchase Exceptions</p>
              </div>
            </div>

            {/* GRM Bar */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-end" style={{ height: '200px' }}>
                <div className="w-24 bg-cyan-500" style={{ height: '160px' }}></div>
              </div>
              <div className="mt-2 text-center">
                <div className="bg-cyan-500 w-12 h-12 flex justify-center items-center mx-auto mb-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">{data.grmValue} billion</p>
                <p className="text-gray-600">GRM Exceptions</p>
              </div>
            </div>
          </div>

          {/* Category breakdown section */}
          <div className='col-span-2'>
          <h3 className="text-xl font-bold text-center mb-6">Category-wise Exception Analysis</h3>
          
          {/* Distribution chart showing category percentages */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-2">Distribution of Exceptions by Category</p>
            <div className="w-full h-10 flex rounded-md overflow-hidden">
              {data.categories.map((category, index) => (
                <div 
                  key={index} 
                  className="h-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ 
                    width: `${category.percentageOfTotal}%`,
                    backgroundColor: categoryColors[category.name] || '#cbd5e1'
                  }}
                >
                  {category.percentageOfTotal}%
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-2 justify-center">
              {data.categories.map((category, index) => (
                <div key={index} className="flex items-center mr-6 mb-1">
                  <div 
                    className="w-4 h-4 rounded-sm mr-1"
                    style={{ backgroundColor: categoryColors[category.name] || '#cbd5e1' }}
                  ></div>
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category-wise comparison */}
          <div className="space-y-8 mt-6">
            {data.categories.map((category, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div 
                    className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                    style={{ backgroundColor: categoryColors[category.name] || '#cbd5e1' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      {category.name === "Vegetables" && (
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      )}
                      {category.name === "Groceries" && (
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      )}
                      {category.name === "Dairy" && (
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      )}
                      {category.name === "Meat" && (
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{category.name}</h4>
                    <p className="text-sm text-gray-600">Total Transactions: {category.transactions.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Purchase exceptions */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-purple-700">Purchase Exceptions</p>
                      <span className="text-sm font-medium">{category.purchaseExceptions} ({Math.round(category.purchaseExceptions / (category.purchaseExceptions + category.grmExceptions) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-6 relative rounded">
                      <div className="bg-purple-400 h-6 absolute rounded" style={{ 
                        width: `${Math.round(category.purchaseExceptions / (category.purchaseExceptions + category.grmExceptions) * 100)}%` 
                      }}></div>
                      <span className="absolute left-2 text-xs leading-6 text-white font-medium">
                        {Math.round(category.purchaseExceptions / totalPurchaseExceptions * 100)}% of total
                      </span>
                    </div>
                  </div>
                  
                  {/* GRM exceptions */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-cyan-700">GRM Exceptions</p>
                      <span className="text-sm font-medium">{category.grmExceptions} ({Math.round(category.grmExceptions / (category.purchaseExceptions + category.grmExceptions) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-6 relative rounded">
                      <div className="bg-cyan-500 h-6 absolute rounded" style={{ 
                        width: `${Math.round(category.grmExceptions / (category.purchaseExceptions + category.grmExceptions) * 100)}%` 
                      }}></div>
                      <span className="absolute left-2 text-xs leading-6 text-white font-medium">
                        {Math.round(category.grmExceptions / totalGrmExceptions * 100)}% of total
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Exception rate */}
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Exception Rate (% of transactions)</p>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-400" 
                      style={{ width: `${Math.round((category.purchaseExceptions + category.grmExceptions) / category.transactions * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 text-right">
                    {Math.round((category.purchaseExceptions + category.grmExceptions) / category.transactions * 100)}% of {category.name} transactions have exceptions
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>

          {/* Source citation */}
        
        </div>
        <div className="text-xs mt-8 pt-4 border-t border-gray-300 max-w-xl mx-auto">
            <p>Source: Internal procurement system data analysis (February 2024) and Inventory Management System reports.</p>
          </div>
      </div>

      {/* Right side - text content */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-8">
        <h3 className="font-bold text-lg mb-4">Category Analysis Insights</h3>
        <div className="prose max-w-none">
          {data.rightContent.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        {/* Added section for action items */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-md text-gray-700 mb-3">Recommended Actions</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 mt-0.5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Implement advanced validation rules for vegetable price fluctuations during purchase entry</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mt-0.5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Review and enhance dairy GRM receiving process to reduce exceptions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mt-0.5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Develop category-specific training for grocery item purchasers</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mt-0.5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Implement automated price update system for meat products to reduce purchase exceptions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PurchaseGrmReports;