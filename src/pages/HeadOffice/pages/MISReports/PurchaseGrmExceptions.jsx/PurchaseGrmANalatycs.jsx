import React from 'react';

const PurchaseGrmAnalytics = () => {
  // Sample data - this could be passed as props in a real implementation
  const data = {
    title: "3.7 billion dollars",
    subtitle: "in retail spend shows",
    subtitle2: "significant margin variation by category",
    description: "Analysis of Gross Retail Margin (GRM) differences across major product categories (2023-2024)",
    standardGrmValue: 2.4,
    premiumGrmValue: 3.8,
    categories: [
      {
        name: "Vegetables",
        volume: 145,
        marginDifference: 682
      },
      {
        name: "Grocery",
        volume: 1920,
        marginDifference: 2350
      },
      {
        name: "Fancy Items",
        volume: 165,
        marginDifference: 412
      }
    ],
    rightContent: `Retail margin analytics demonstrate that GRM variations are not only growing across product categories but also significantly impacting overall profitability metrics. Premium product line margins consistently outpace standard product margins across all major categories, with the most pronounced differences in specialty and fancy items.

During peak shopping seasons, Grocery category products maintained stable margins while Vegetable category items experienced margin compression due to supply chain volatility. Fancy items consistently delivered the highest margin percentage despite lower total sales volume.

Overall, retailers analyzing $3.7 billion in transactions showed that optimizing purchase entry classification could improve margin recognition by up to 18%. Moreover, proper category-based procurement strategies increase average GRM by 2.3 points, making purchase analytics a critical component for competitive retail operations.`
  };

  return (
    <div className="flex flex-col lg:flex-row w-full mx-auto bg-white">
      {/* Left side - visualization */}
      <div className="w-full lg:w-2/3 p-6">
        {/* Title section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-yellow-500">{data.title}</h1>
          <h2 className="text-2xl font-medium">{data.subtitle}</h2>
          <h2 className="text-2xl font-medium">{data.subtitle2}</h2>
          <p className="mt-6 text-sm max-w-lg mx-auto">{data.description}</p>
        </div>

        <div className='flex items-end'>

        {/* Main bar chart */}
        <div className="flex justify-center items-end space-x-16 h-64 mb-8">
          {/* Standard GRM Bar */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center justify-end" style={{ height: '200px' }}>
              <div className="w-24 bg-blue-200" style={{ height: `${(data.standardGrmValue/data.premiumGrmValue) * 160}px` }}></div>
            </div>
            <div className="mt-2 text-center">
              <div className="bg-blue-200 w-12 h-12 flex justify-center items-center mx-auto mb-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-800" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-semibold">{data.standardGrmValue} billion</p>
              <p className="text-gray-600">Standard GRM</p>
            </div>
          </div>

          {/* Premium GRM Bar */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center justify-end" style={{ height: '200px' }}>
              <div className="w-24 bg-blue-500" style={{ height: '160px' }}></div>
            </div>
            <div className="mt-2 text-center">
              <div className="bg-blue-500 w-12 h-12 flex justify-center items-center mx-auto mb-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-semibold">{data.premiumGrmValue} billion</p>
              <p className="text-gray-600">Premium GRM</p>
            </div>
          </div>
        </div>

        {/* Category data visualization */}
        <div className="mt-12 max-w-xl mx-auto">
          {data.categories.map((category, index) => (
            <div key={index} className="mb-8 flex items-center">
              {/* Category icon */}
              <div className="mr-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill={index === 0 ? "#10B981" : index === 1 ? "#F59E0B" : "#EC4899"}>
                    {index === 0 && (
                      <path d="M7 10V8h10v2H7zm0 2h10v2H7v-2zm0 4h7v2H7v-2zm13.41-8.5L22 9.09l-6 6-4-4L13.41 9.5 16 12.09l4.41-4.59z" />
                    )}
                    {index === 1 && (
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                    )}
                    {index === 2 && (
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    )}
                  </svg>
                </div>
              </div>
              
              {/* Category data */}
              <div className="flex-1">
                <p className="font-medium mb-1">{category.name}</p>
                
                {/* Volume bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 h-6 relative">
                    <div className="bg-gray-300 h-6 absolute" style={{ 
                      width: `${Math.min((category.volume / 2000) * 100, 100)}%` 
                    }}></div>
                    <span className="absolute left-2 text-sm leading-6">{category.volume}M units</span>
                  </div>
                </div>
                
                {/* Margin difference bar */}
                <div className="flex items-center">
                  <div className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-full bg-gray-200 h-6 relative">
                    <div className="bg-blue-500 h-6 absolute" style={{ 
                      width: `${Math.min((category.marginDifference / 2500) * 100, 100)}%` 
                    }}></div>
                    <span className="absolute left-2 text-sm leading-6 text-white">${category.marginDifference}K</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Source citation */}
        <div className="text-xs mt-8 pt-4 border-t border-gray-300 max-w-xl mx-auto">
          {/* <p>Source: Retail Analytics Dashboard - compiled from Point of Sale data analysis (January 2023 - December 2024).</p> */}
        </div>
      </div>

      {/* Right side - text content */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-8">
        <div className="prose max-w-none">
          {data.rightContent.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseGrmAnalytics;