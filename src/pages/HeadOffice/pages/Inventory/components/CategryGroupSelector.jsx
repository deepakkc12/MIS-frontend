import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { getRequest } from '../../../../../services/apis/requests';

const CategoryGroupSelector = ({ onSelectionChange }) => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  
  const categoryDropdownRef = useRef(null);
  const groupDropdownRef = useRef(null);

  const getCategories = async () => {
    setIsLoading(true);
    const response = await getRequest('inventory/categories/');
    if (response.success) {
      setCategories(response.data);
    } else {
      setError("Failed to load categories");
    }
    setIsLoading(false);
  };

  const getGroups = async () => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    const response = await getRequest(`inventory/groups/?category=${selectedCategory}`);
    if (response.success) {
      setGroups(response.data);
      setAllGroups(response.data);
    } else {
      setError("Failed to load groups");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getGroups();
    }
  }, [selectedCategory]);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
        setIsGroupDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    
    return categories.filter(category => 
      category.Name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      (category.refCode && category.refCode.toLowerCase().includes(categorySearch.toLowerCase()))
    );
  }, [categories, categorySearch]);

  // Filter groups based on search input
  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return groups;
    
    return groups.filter(group => 
      group.Name.toLowerCase().includes(groupSearch.toLowerCase())
    );
  }, [groups, groupSearch]);

  // Handle category selection
  const handleCategorySelect = (categoryCode) => {
    setSelectedCategory(categoryCode);
    setIsCategoryDropdownOpen(false);
    setSelectedGroup(''); // Reset group selection when category changes
    setGroupSearch(''); // Reset group search when category changes
  };

  // Handle group selection
  const handleGroupSelect = (groupCode) => {
    setSelectedGroup(groupCode);
    setIsGroupDropdownOpen(false);
    
    // Pass selected values to parent component if needed
    if (onSelectionChange) {
      const selectedCategoryObj = categories.find(cat => cat.Code === selectedCategory);
      const selectedGroupObj = groups.find(grp => grp.Code === groupCode);
      
      onSelectionChange({
        category: selectedCategoryObj,
        group: selectedGroupObj
      });
    }
  };

  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.Code === selectedCategory);
    return category ? `${category.Name} ${category.refCode ? `(${category.refCode})` : ''}` : 'Select category';
  };

  const getSelectedGroupName = () => {
    const group = groups.find(grp => grp.Code === selectedGroup);
    return group ? group.Name : 'Select group';
  };

  if (isLoading && categories.length === 0) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-blue-600 font-medium">Loading selections...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <div className="flex items-center">
        <div className="flex-shrink-0 text-red-500">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Product Selection</h3>
      
      <div className="flex flex-wrap gap-4">
        {/* Category Selection */}
        <div className="flex-1 min-w-[300px]" ref={categoryDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Category
          </label>
          <div className="relative">
            <div 
              className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span className={`truncate ${selectedCategory ? 'text-gray-800' : 'text-gray-500'}`}>
                {getSelectedCategoryName()}
              </span>
              <ChevronDown size={18} className="text-gray-500" />
            </div>
            
            {isCategoryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-hidden flex flex-col">
                <div className="p-2 border-b sticky top-0 bg-white z-20">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {categorySearch && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategorySearch('');
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[200px] custom-scrollbar">
                  {filteredCategories.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">No matching categories found</div>
                  ) : (
                    filteredCategories.map((category) => (
                      <div
                        key={category.Code}
                        className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${selectedCategory === category.Code ? 'bg-blue-100' : ''}`}
                        onClick={() => handleCategorySelect(category.Code)}
                      >
                        <span className="block font-medium">{category.Name}</span>
                        {category.refCode && (
                          <span className="block text-xs text-gray-500 mt-1">{category.refCode}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Group Selection */}
        <div className="flex-1 min-w-[300px]" ref={groupDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Group
          </label>
          <div className="relative">
            <div 
              className={`flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white cursor-pointer transition-colors ${selectedCategory ? 'hover:border-blue-500' : 'bg-gray-100 cursor-not-allowed'}`}
              onClick={() => selectedCategory && setIsGroupDropdownOpen(!isGroupDropdownOpen)}
            >
              <span className={`truncate ${selectedGroup ? 'text-gray-800' : 'text-gray-500'}`}>
                {selectedCategory ? getSelectedGroupName() : 'Select a category first'}
              </span>
              <ChevronDown size={18} className="text-gray-500" />
            </div>
            
            {isGroupDropdownOpen && selectedCategory && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-hidden flex flex-col">
                <div className="p-2 border-b sticky top-0 bg-white z-20">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search groups..."
                      value={groupSearch}
                      onChange={(e) => setGroupSearch(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {groupSearch && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupSearch('');
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[200px] custom-scrollbar">
                  {filteredGroups.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">No matching groups found</div>
                  ) : (
                    filteredGroups.map((group) => (
                      <div
                        key={group.Code}
                        className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${selectedGroup === group.Code ? 'bg-blue-100' : ''}`}
                        onClick={() => handleGroupSelect(group.Code)}
                      >
                        {group.Name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection summary */}
      {selectedCategory && selectedGroup && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-800">
            Selected: {categories.find(c => c.Code === selectedCategory)?.Name} &gt; {groups.find(g => g.Code === selectedGroup)?.Name}
          </p>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default CategoryGroupSelector;