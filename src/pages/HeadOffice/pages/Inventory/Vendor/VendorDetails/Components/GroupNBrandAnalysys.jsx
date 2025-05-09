import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VendorGroupsAnalysis = ({ data, onNavigateToGroupDetail, onNavigateToBrandDetail }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'list', 'grid', 'compact'
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Professional color palette with more vibrant colors
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
  
  // Process data
  const groupsData = useMemo(() => {
    if (!data || !data.groups) return [];
    return data.groups;
  }, [data]);
  
  const brandsData = useMemo(() => {
    if (!data || !data.brands) return [];
    return data.brands;
  }, [data]);
  
  // Extract unique categories
  const categories = useMemo(() => {
    if (!groupsData.length) return ['All'];
    const uniqueCategories = [...new Set(groupsData.map(group => group.Category))];
    return ['All', ...uniqueCategories];
  }, [groupsData]);
  
  // Stop animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter and search groups
  const filteredGroups = useMemo(() => {
    let filtered = activeCategory === 'All' 
      ? groupsData 
      : groupsData.filter(group => group.Category === activeCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => 
        group.Name.toLowerCase().includes(query) || 
        group.Code.toLowerCase().includes(query) ||
        group.Category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [groupsData, activeCategory, searchQuery]);
  
  // Get brands for a specific group
  const getBrandsForGroup = (groupCode) => {
    return brandsData.filter(brand => brand.ProductGroupCode === groupCode);
  };
  
  // Count groups by category for chart
  const getCategoryDistribution = () => {
    const distribution = {};
    
    groupsData.forEach(group => {
      if (!distribution[group.Category]) {
        distribution[group.Category] = {
          name: group.Category,
          count: 1
        };
      } else {
        distribution[group.Category].count += 1;
      }
    });
    
    return Object.values(distribution);
  };
  
  // Count brands by category for chart
  const getBrandsByCategoryCount = () => {
    const distribution = {};
    
    categories.filter(cat => cat !== 'All').forEach(category => {
      const groupsInCategory = groupsData.filter(g => g.Category === category);
      let brandCount = 0;
      
      groupsInCategory.forEach(group => {
        brandCount += getBrandsForGroup(group.Code).length;
      });
      
      distribution[category] = {
        name: category,
        brands: brandCount
      };
    });
    
    return Object.values(distribution);
  };
  
  // Toggle group expansion
  const toggleGroup = (groupCode) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupCode]: !prev[groupCode]
    }));
  };

  const navigate = useNavigate()
  // Handle group detail navigation
  const handleGroupDetailClick = (group, e) => {
    e.stopPropagation();
    // console.log(group)
    navigate(`/inventory/group-details/${group.Code}`)
  };

  // Handle brand detail navigation
  const handleBrandDetailClick = (brand, e) => {
    e.stopPropagation();
    if (onNavigateToBrandDetail) {
      onNavigateToBrandDetail(brand);
    }
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    const categoryIndex = categories.indexOf(category) - 1;
    return categoryIndex >= 0 ? COLORS[categoryIndex % COLORS.length] : '#64748B';
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header with animation */}
      

   

{/* Dashboard Stats with subtle hover effects */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
  <div className={`bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 text-slate-800 border border-slate-200 shadow-sm hover:shadow transition-all duration-300 transform ${isAnimating ? 'animate-fadeIn' : ''} hover:-translate-y-1`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-slate-500 text-sm font-medium">Product Groups</p>
        <h3 className="text-3xl font-bold mt-1">{groupsData.length}</h3>
        <p className="text-xs mt-2 text-slate-500">Across {categories.length - 1} categories</p>
      </div>
      <div className="bg-slate-200 bg-opacity-70 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    </div>
  </div>
  
  <div className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 text-slate-800 border border-slate-200 shadow-sm hover:shadow transition-all duration-300 transform ${isAnimating ? 'animate-fadeIn delay-100' : ''} hover:-translate-y-1`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-blue-600 text-sm font-medium">Brands</p>
        <h3 className="text-3xl font-bold mt-1">{brandsData.length}</h3>
        <p className="text-xs mt-2 text-blue-500">Avg {(brandsData.length / (groupsData.length || 1)).toFixed(1)} brands per group</p>
      </div>
      <div className="bg-blue-200 bg-opacity-70 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      </div>
    </div>
  </div>
  
  <div className={`bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 text-slate-800 border border-slate-200 shadow-sm hover:shadow transition-all duration-300 transform ${isAnimating ? 'animate-fadeIn delay-200' : ''} hover:-translate-y-1`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-green-600 text-sm font-medium">Categories</p>
        <h3 className="text-3xl font-bold mt-1">{categories.length - 1}</h3>
        <p className="text-xs mt-2 text-green-500">Click below to filter by category</p>
      </div>
      <div className="bg-green-200 bg-opacity-70 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
    </div>
  </div>
</div>
      {/* Charts with better responsiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Groups by Category</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution of product groups across categories</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCategoryDistribution()}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getCategoryDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} groups`, 'Count']} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Brands by Category</h3>
          <p className="text-sm text-gray-500 mb-4">Number of brands within each product category</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getBrandsByCategoryCount()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis width={30} />
                <Tooltip 
                  formatter={(value) => [`${value} brands`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    boxSboxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="brands" radius={[4, 4, 0, 0]}>
                {getBrandsByCategoryCount().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    
    {/* Search & Filters */}
    <div className="px-6 mb-4">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by group name, code, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border ${viewMode === 'list' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                title="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg border ${viewMode === 'grid' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                title="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-lg border ${viewMode === 'compact' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                title="Compact View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </button>
            </div>
            
            {(activeCategory !== 'All' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === category
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
    
    {/* Product Groups Display */}
    <div className="px-6 pb-6">
      {filteredGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No groups found</h3>
          <p className="text-gray-500 max-w-md">No product groups match your current filters. Try changing your search term or selecting a different category.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredGroups.map((group) => {
            const groupBrands = getBrandsForGroup(group.Code);
            const isExpanded = expandedGroups[group.Code];
            const categoryColor = getCategoryColor(group.Category);
            
            if (viewMode === 'grid') {
              return (
                <div key={group.Code} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="border-l-4 px-4 py-3" style={{ borderColor: categoryColor }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{group.Name}</h4>
                        <p className="text-xs text-gray-500">{group.Category} • Code: {group.Code}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {groupBrands.length} Brand{groupBrands.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <button
                        onClick={(e) => handleGroupDetailClick(group, e)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {groupBrands.length > 0 && (
                        <button
                          onClick={() => toggleGroup(group.Code)}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
                        >
                          {isExpanded ? 'Hide Brands' : 'Show Brands'}
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Brands Panel */}
                  {isExpanded && groupBrands.length > 0 && (
                    <div className="bg-gray-50 border-t border-gray-100 px-4 py-3">
                      <h5 className="text-xs uppercase font-medium text-gray-500 mb-2">Associated Brands</h5>
                      <div className="space-y-2">
                        {groupBrands.map(brand => (
                          <div key={brand.BrandCode} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div>
                              <h5 className="font-medium text-gray-800">{brand.BrandName}</h5>
                              <p className="text-xs text-gray-500">Brand Code: {brand.BrandCode}</p>
                            </div>
                            <button
                              onClick={(e) => handleBrandDetailClick(brand, e)}
                              className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition"
                            >
                              View Brand Details
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            } else if (viewMode === 'compact') {
              return (
                <div key={group.Code} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => groupBrands.length > 0 && toggleGroup(group.Code)}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: categoryColor }}></div>
                      <div>
                        <h4 className="font-medium text-gray-800">{group.Name}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-3">{group.Category}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                        {groupBrands.length}
                      </span>
                      <button
                        onClick={(e) => handleGroupDetailClick(group, e)}
                        className="p-1 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 mr-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {groupBrands.length > 0 && (
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {isExpanded && groupBrands.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100 px-4 py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupBrands.map(brand => (
                        <div key={brand.BrandCode} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                          <div className="text-sm">{brand.BrandName}</div>
                          <button
                            onClick={(e) => handleBrandDetailClick(brand, e)}
                            className="text-xs text-blue-600 px-2 py-1 hover:bg-blue-50 rounded"
                          >
                            Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          } else {
            // Default list view
            return (
              <div key={group.Code} className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div 
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${groupBrands.length > 0 ? 'hover:bg-blue-50' : ''}`}
                  onClick={() => groupBrands.length > 0 && toggleGroup(group.Code)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3`} style={{ backgroundColor: categoryColor }}></div>
                    <div>
                      <h4 className="font-medium text-gray-800">{group.Name}</h4>
                      <p className="text-xs text-gray-500">{group.Category} • Code: {group.Code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      onClick={(e) => handleGroupDetailClick(group, e)}
                      className="bg-white text-blue-600 text-xs px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-50 transition mr-2 opacity-0 group-hover:opacity-100"
                    >
                      View Details
                    </button>
                    
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      {groupBrands.length} Brand{groupBrands.length !== 1 ? 's' : ''}
                    </span>
                    
                    {groupBrands.length > 0 && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Brands Panel with navigation */}
                {isExpanded && groupBrands.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100 px-4 py-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-xs uppercase font-medium text-gray-500">Associated Brands</h5>
                      {groupBrands.length > 3 && (
                        <button className="text-xs text-blue-600 hover:underline">
                          View All {groupBrands.length} Brands
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {groupBrands.slice(0, 3).map(brand => (
                        <div key={brand.BrandCode} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
                          <div>
                            <h5 className="font-medium text-gray-800">{brand.BrandName}</h5>
                            <p className="text-xs text-gray-500">Brand Code: {brand.BrandCode}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => handleBrandDetailClick(brand, e)}
                              className="flex items-center bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                      {groupBrands.length > 3 && (
                        <div className="text-center py-2 text-gray-500 text-sm bg-gray-100 rounded-lg">
                          {groupBrands.length - 3} more brands not shown
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    )}
  </div>
  
  {/* Pagination and Summary */}
  {filteredGroups.length > 0 && (
    <div className="px-6 pb-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-4">
      <div className="text-sm text-gray-600 mb-4 md:mb-0">
        Showing {filteredGroups.length} of {groupsData.length} product groups
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <button className="px-3 py-1 border border-gray-300 rounded-md bg-blue-50 text-blue-600 font-medium">
          1
        </button>
        <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
          Next
        </button>
      </div>
    </div>
  )}
</div>
);
};

export default VendorGroupsAnalysis;