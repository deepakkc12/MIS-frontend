import React, { useState, useEffect } from 'react';
import { BarChart3, ChevronRight, ShoppingCart } from 'lucide-react';

const InventoryAnalysisCard = ({ onClick, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState("0");
  const [animatedSecondaryValue, setAnimatedSecondaryValue] = useState("0");
  
  // Sample data - replace with actual metrics from your analysis
  const value = "87";
  const secondaryValue = "14";
  const color = "#3B82F6"; // Blue color for inventory analysis
  
  useEffect(() => {
    // Delayed appearance animation
    const appearTimeout = setTimeout(() => {
      setIsVisible(true);
    }, (index + 2) * 150);
    
    return () => clearTimeout(appearTimeout);
  }, [index]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Animate primary value counting up
    const numericValue = parseFloat(value);
    const countDuration = 1500; // ms
    const frameDuration = 16; // ms
    const frames = countDuration / frameDuration;
    const increment = numericValue / frames;
    
    let currentValue = 0;
    const countInterval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        currentValue = numericValue;
        clearInterval(countInterval);
      }
      setAnimatedValue(parseFloat(currentValue.toFixed(1)).toString());
    }, frameDuration);
    
    // Animate secondary value
    const secondaryNumericValue = parseFloat(secondaryValue);
    const secondaryIncrement = secondaryNumericValue / frames;
    
    let currentSecondaryValue = 0;
    const secondaryCountInterval = setInterval(() => {
      currentSecondaryValue += secondaryIncrement;
      if (currentSecondaryValue >= secondaryNumericValue) {
        currentSecondaryValue = secondaryNumericValue;
        clearInterval(secondaryCountInterval);
      }
      setAnimatedSecondaryValue(parseFloat(currentSecondaryValue.toFixed(1)).toString());
    }, frameDuration);
    
    return () => {
      clearInterval(countInterval);
      clearInterval(secondaryCountInterval);
    };
  }, [isVisible]);
  
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer relative overflow-hidden group"
      onClick={onClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s ease'
      }}
    >
      <div 
        className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-10" 
        style={{ 
          backgroundColor: color,
          transform: isVisible ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      ></div>
      <div 
        className="absolute top-0 left-0 w-2 h-full" 
        style={{ 
          backgroundColor: color,
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: '0.2s'
        }}
      ></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p 
            className="text-sm text-gray-500 uppercase font-medium tracking-wider"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.5s ease',
              transitionDelay: '0.2s'
            }}
          >
            Customer Choices
          </p>
          {/* <div className="flex items-center mt-2">
            <span 
              className="text-xl font-bold" 
              style={{ 
                color: '#1E293B',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease',
                transitionDelay: '0.3s'
              }}
            >
              {isVisible ? animatedValue : ''}%
            </span>
            <span 
              className="ml-3 text-sm font-medium text-green-500"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: '0.5s'
              }}
            >
              {isVisible ? animatedSecondaryValue : ''}% Premium
            </span>
          </div> */}
        </div>
        {/* <div
          className="p-3 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: `${color}15`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', 
            transitionDelay: '0.4s'
          }}
        >
          <BarChart3 
            size={22} 
            style={{ 
              color,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: '0.6s'
            }} 
          /> */}
        {/* </div> */}
      </div>
      <div className="flex items-center mt-4">
        {/* <div 
          className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            transitionDelay: '0.6s'
          }}
        >
          <ShoppingCart size={16} className="text-blue-500 mr-2" />
          <span className="text-xs font-medium text-blue-700">
            High Focus Items: 3
          </span>
        </div> */}
      </div>
      <div 
        className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transitionDelay: '0.7s'
        }}
      >
        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
          View Customer Choice Analysis
        </span>
        <div 
          className="bg-gray-100 rounded-full p-1 group-hover:bg-gray-200 transition-all"
          style={{
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease, background-color 0.3s ease'
          }}
        >
          <ChevronRight 
            size={16} 
            className="text-gray-600 transform group-hover:translate-x-1 transition-transform duration-300" 
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalysisCard;