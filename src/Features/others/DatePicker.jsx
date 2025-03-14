import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({
    onChange,
    value,
    placeholder = "Select Date",
    type = 'single' // 'single' or 'range'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // Ensure onChange is called correctly for both single and range types
    useEffect(() => {
        const today = new Date();

        if (!value) {
            if (type === 'single') {
                const defaultDate = today;
                setLocalValue(defaultDate);
                // Ensure onChange is called with a single date
                onChange(defaultDate);
            } else if (type === 'range') {
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(today.getDate() - 7);

                const defaultRange = [oneWeekAgo, today];
                setLocalValue(defaultRange);
                // Ensure onChange is called with an array of dates
                onChange(defaultRange);
            }
        }
    }, [type, value, onChange]);

    // Improved handleDateChange to ensure correct type handling
    const handleDateChange = (selectedDate) => {
        setLocalValue(selectedDate);
        
        // Explicitly call onChange with the correct type
        if (type === 'single') {
            onChange(selectedDate);
            console.log(selectedDate);
        } else if (type === 'range') {
            onChange(selectedDate);
            console.log(selectedDate); // Added console.log for range type
        }
        
        setIsOpen(false);
    };

    const renderDateInput = () => {
        if (type === 'single') {
            return (
                <input
                    type="date"
                    value={localValue ? localValue.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                />
            );
        }

        // Range picker with labels for start date and end date
        return (
            <div className="flex items-center gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={localValue && localValue[0] ? localValue[0].toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            const newStartDate = new Date(e.target.value);
                            const newRange = [newStartDate, localValue[1] || newStartDate];
                            handleDateChange(newRange);
                        }}
                        placeholder="Start Date"
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={localValue && localValue[1] ? localValue[1].toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            const newEndDate = new Date(e.target.value);
                            const newRange = [localValue[0] || newEndDate, newEndDate];
                            handleDateChange(newRange);
                        }}
                        placeholder="End Date"
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full">
            <div className="flex items-center">
                {renderDateInput()}
                {/* <Calendar
                    className="ml-2 h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                /> */}
            </div>

            {/* Optional: Custom calendar dropdown can be added here */}
            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                    {/* Custom calendar UI */}
                </div>
            )}
        </div>
    );
};

export default DatePicker;