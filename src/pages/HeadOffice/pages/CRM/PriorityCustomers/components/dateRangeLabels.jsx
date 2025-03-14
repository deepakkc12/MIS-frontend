import React, { useState, useEffect, useRef } from 'react';

const DateRangeSelector = ({ onRangeSelect }) => {
  const [selectedRange, setSelectedRange] = useState(null);
  const [dateRanges, setDateRanges] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [daysInMonth, setDaysInMonth] = useState(0);
  const hasInitiallyFired = useRef(false);

  useEffect(() => {
    // Get current date information
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    const currentDay = now.getDate();
    
    // Calculate days in current month
    const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    setDaysInMonth(lastDayOfMonth);
    
    // Set current month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    setCurrentMonth(`${monthNames[currentMonthIndex]} ${currentYear}`);
    
    // Calculate 6 equal(ish) ranges for the month
    const rangeSize = Math.ceil(lastDayOfMonth / 6);
    const ranges = [];
    let defaultRangeIndex = 0;
    
    for (let i = 0; i < 6; i++) {
      const start = i * rangeSize + 1;
      const end = Math.min((i + 1) * rangeSize, lastDayOfMonth);
      
      // Format date as YYYY-MM-DD
      const startDate = new Date(currentYear, currentMonthIndex, start);
      const endDate = new Date(currentYear, currentMonthIndex, end);
      
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };
      
      ranges.push({
        label: `${start}-${end}`,
        startDay: start,
        endDay: end,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
      });
      
      // Check if current day falls within this range
      if (currentDay >= start && currentDay <= end) {
        defaultRangeIndex = i;
      }
    }
    
    setDateRanges(ranges);
    
    // Only set selected range the first time
    if (!hasInitiallyFired.current) {
      setSelectedRange(defaultRangeIndex);
      hasInitiallyFired.current = true;
    }
  }, []);

  // Only call onRangeSelect when selectedRange actually changes
  // or when dateRanges are first loaded and selectedRange is set
  useEffect(() => {
    if (dateRanges.length > 0 && selectedRange !== null && onRangeSelect) {
      onRangeSelect(dateRanges[selectedRange]);
    }
  }, [selectedRange, dateRanges.length]); // Removed onRangeSelect from dependencies

  const handleRangeSelect = (index) => {
    setSelectedRange(index);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full border border-blue-100">
      <div className="flex justify-between items-center mb-6">
        <h3>Priority Customers List</h3>
        <h3 className="text-xl font-semibold text-indigo-800">{currentMonth}</h3>
        <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
          {daysInMonth} days
        </span>
      </div>
      
      <div className="grid grid-cols-6 gap-3 mb-6">
        {dateRanges.map((range, index) => (
          <button
            key={index}
            onClick={() => handleRangeSelect(index)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 
              ${selectedRange === index 
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md transform scale-105' 
                : 'bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-300'}`}
          >
            {range.label}
          </button>
        ))}
      </div>
      
      {dateRanges.length > 0 && selectedRange !== null && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-xs text-indigo-400 uppercase tracking-wider">From</p>
                <p className="text-sm font-bold text-indigo-800">{dateRanges[selectedRange].startDate}</p>
              </div>
              <div className="h-px w-8 bg-indigo-200"></div>
              <div>
                <p className="text-xs text-indigo-400 uppercase tracking-wider">To</p>
                <p className="text-sm font-bold text-indigo-800">{dateRanges[selectedRange].endDate}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-indigo-100 to-blue-100 px-3 py-1.5 rounded-full shadow-inner">
              <p className="text-xs font-semibold text-indigo-700">
                {dateRanges[selectedRange].endDay - dateRanges[selectedRange].startDay + 1} days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;