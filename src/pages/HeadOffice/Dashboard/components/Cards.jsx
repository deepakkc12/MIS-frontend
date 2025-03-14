import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

const MetricCard = ({
  title,
  value,
  previousValue,
  change,
  icon: Icon,
  color,
  showPercent = false,
  index = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState("0");
  const [progressWidth, setProgressWidth] = useState("0%");
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // Parse the numeric value from string representations like "$1,234" or "1,234"
  const parseNumericValue = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(val?.replace(/[₹,]/g, ''));
  };
  
  // Format the value in the same format as the original
  const formatValue = (numValue) => {
    if (typeof value === 'string' && value.includes('₹')) {
      return `₹${numValue.toLocaleString()}`;
    }
    return showPercent ? `${numValue}` : numValue.toLocaleString();
  };
  
  // Calculate fixed width for value display to prevent layout shift
  const getValueDisplayWidth = () => {
    const numericValue = parseNumericValue(value);
    const formattedValue = showPercent ? `${numericValue}%` : formatValue(numericValue);
    return `${formattedValue.toString().length * 1.2}ch`;
  };
  
  useEffect(() => {
    // Delayed appearance animation
    const appearTimeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);
    
    return () => clearTimeout(appearTimeout);
  }, [index]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Animate value counting up
    const numericValue = parseNumericValue(value);
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
        setIsAnimationComplete(true);
      }
      setAnimatedValue(formatValue(parseFloat(currentValue.toFixed(1))));
    }, frameDuration);
    
    // Animate progress bar
    setTimeout(() => {
      setProgressWidth(`${change > 0 ? change*2 : 50}%`);
    }, 300);
    
    return () => clearInterval(countInterval);
  }, [isVisible, value]);
  
  return (
    <div 
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden"
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
            {title}
          </p>
          <div className="flex items-baseline mt-2">
            <span 
              className="text-xl font-bold" 
              style={{ 
                color: '#1E293B',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease',
                transitionDelay: '0.3s',
                minWidth: getValueDisplayWidth(),
                display: 'inline-block',
                textAlign: 'left'
              }}
            >
              {isVisible ? (showPercent ? `${animatedValue}%` : animatedValue) : ''}
            </span>
            {change && (
              <span
                className={`ml-3 text-sm flex items-center font-medium ${
                  Number(change) >= 0 ? "text-emerald-500" : "text-rose-500"
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: '0.5s'
                }}
              >
                {Number(change) >= 0 ? (
                  <ArrowUpRight size={16} className="mr-1" />
                ) : (
                  <ArrowDownRight size={16} className="mr-1" />
                )}
                {Math.abs(change)}%
              </span>
            )}
          </div>
          {previousValue && (
            <p 
              className="text-xs text-gray-500 mt-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease',
                transitionDelay: '0.6s'
              }}
            >
              Previous: {showPercent ? `${previousValue}%` : previousValue}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: `${color}15`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: '0.4s'
          }}
        >
          <Icon 
            size={22} 
            style={{ 
              color,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: '0.6s'
            }} 
          />
        </div>
      </div>
      <div 
        className="w-full h-1 bg-gray-100 mt-4 rounded-full overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease',
          transitionDelay: '0.7s'
        }}
      >
        <div 
          className="h-full rounded-full" 
          style={{ 
            backgroundColor: color, 
            width: progressWidth,
            transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: '0.8s'
          }}
        ></div>
      </div>
    </div>
  );
};


const ActionCard = ({
  title,
  value,
  secondaryText,
  icon: Icon,
  color,
  onClick,
  index = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState("0");
  
  // Parse the numeric value from string representations like "₹1,234" or "1,234"
  const parseNumericValue = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(val.replace(/[₹,]/g, ''));
  };
  
  // Format the value in the same format as the original
  const formatValue = (numValue) => {
    if (typeof value === 'string' && value.includes('₹')) {
      return `₹${numValue.toLocaleString()}`;
    }
    return numValue.toLocaleString();
  };
  
  useEffect(() => {
    // Delayed appearance animation
    const appearTimeout = setTimeout(() => {
      setIsVisible(true);
    }, (index + 4) * 150); // Start after metric cards
    
    return () => clearTimeout(appearTimeout);
  }, [index]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Animate value counting up
    const numericValue = parseNumericValue(value);
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
      setAnimatedValue(formatValue(parseFloat(currentValue.toFixed(1))));
    }, frameDuration);
    
    return () => clearInterval(countInterval);
  }, [isVisible, value]);
  
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
            {title}
          </p>
          <div className="flex items-center mt-2">
            <span 
              className="text-xl font-bold" 
              style={{ 
                color: '#1E293B',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease',
                transitionDelay: '0.3s'
              }}
            >
              {isVisible ? animatedValue : ''}
            </span>
            {secondaryText && (
              <span 
                className="ml-3 text-sm font-medium text-rose-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: '0.5s'
                }}
              >
                {secondaryText}
              </span>
            )}
          </div>
        </div>
        <div
          className="p-3 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: `${color}15`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', 
            transitionDelay: '0.4s'
          }}
        >
          <Icon 
            size={22} 
            style={{ 
              color,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: '0.6s'
            }} 
          />
        </div>
      </div>
      <div 
        className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transitionDelay: '0.7s'
        }}
      >
        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
          View Details
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

export {MetricCard,ActionCard}