import React, { useEffect, useState } from 'react'
import { getRequest } from '../../../../../services/apis/requests'
import MainLayout from '../../../Layout/Layout'
import TableLayout from '../../../../../components/Table/TableLayout'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function Vendors() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortField, setSortField] = useState('PurchaseAmount')
    const [sortOrder, setSortOrder] = useState('desc')
    const [searchTerm, setSearchTerm] = useState('')
    const [summary, setSummary] = useState({
        totalPurchase: 0,
        totalDamages: 0,
        totalVendors: 0,
        totalSkus: 0
    })

    const navigate = useNavigate()

    const getData = async () => {
        setLoading(true)
        try {
            const response = await getRequest(`inventory/recent-vendors/`)
            if (response.success) {
                const data = response.data.map(vendor => ({
                    ...vendor,
                    // Convert string values to numbers for calculations
                    PurchaseAmount: parseFloat(vendor.PurchaseAmount),
                    PurchasedAmountWithActiveDamages: parseFloat(vendor.PurchasedAmountWithActiveDamages),
                    // Calculate damage percentage
                    DamagePercentage: parseFloat(vendor.PurchasedAmountWithActiveDamages) > 0 
                        ? ((parseFloat(vendor.PurchasedAmountWithActiveDamages) / parseFloat(vendor.PurchaseAmount)) * 100).toFixed(2)
                        : '0.00',
                    // Calculate average purchase per SKU
                    AvgPurchasePerSku: (parseFloat(vendor.PurchaseAmount) / vendor.CountOfPurchasingSkus).toFixed(2)
                }))
                
                setVendors(data)
                
                // Calculate summary data
                const totalPurchase = data.reduce((sum, vendor) => sum + vendor.PurchaseAmount, 0)
                const totalDamages = data.reduce((sum, vendor) => sum + parseFloat(vendor.PurchasedAmountWithActiveDamages), 0)
                const totalSkus = data.reduce((sum, vendor) => sum + vendor.CountOfPurchasingSkus, 0)
                
                setSummary({
                    totalPurchase,
                    totalDamages,
                    totalVendors: data.length,
                    totalSkus
                })
            }
        } catch (error) {
            console.error("Error fetching vendor data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    // Sort and filter data
    const sortedAndFilteredVendors = [...vendors]
        .filter(vendor => 
            vendor.VendorName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1
            } else {
                return a[sortField] < b[sortField] ? 1 : -1
            }
        })

    // Prepare chart data - top 5 vendors by purchase amount
    const topVendorsChartData = [...vendors]
        .sort((a, b) => b.PurchaseAmount - a.PurchaseAmount)
        .slice(0, 5)
        .map(vendor => ({
            code:vendor.VENDORLEDGERCODE,
            name: vendor.VendorName.length > 15 ? vendor.VendorName.substring(0, 15) + '...' : vendor.VendorName,
            value: vendor.PurchaseAmount
        }))

    // Damage analysis chart data
    const damageAnalysisData = [...vendors]
        .sort((a, b) => b.PurchasedAmountWithActiveDamages - a.PurchasedAmountWithActiveDamages)
        .slice(0, 5)
        .map(vendor => ({
            code:vendor.VENDORLEDGERCODE,
            name: vendor.VendorName.length > 15 ? vendor.VendorName.substring(0, 15) + '...' : vendor.VendorName,
            value: parseFloat(vendor.PurchasedAmountWithActiveDamages)
        }))

    // SKU distribution chart data
    const skuDistributionData = [...vendors]
        .sort((a, b) => b.CountOfPurchasingSkus - a.CountOfPurchasingSkus)
        .slice(0, 5)
        .map(vendor => ({
            name: vendor.VendorName.length > 15 ? vendor.VendorName.substring(0, 15) + '...' : vendor.VendorName,
            value: vendor.CountOfPurchasingSkus
        }))

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    // Table headers with sorting functionality
    const headers = [
        {
            key: "VendorName", 
            label: "Name", 
            onColumnClick: (v, r) => { navigate(`/inventory/vendor-details/${r.VENDORLEDGERCODE}`) },
            sortable: true,
            onSort: () => handleSort("VendorName")
        },
        {
            key: "PurchaseAmount", 
            label: "Total purchase amount", 
            sortable: true,
            onSort: () => handleSort("PurchaseAmount"),
            format: (value) => formatCurrency(value)
        },
        {
            key: "PurchasedAmountWithActiveDamages", 
            label: "Paid with active damages", 
            sortable: true,
            onSort: () => handleSort("PurchasedAmountWithActiveDamages"),
            format: (value) => formatCurrency(value)
        },
        {
            key: "DamagePercentage", 
            label: "Damage %", 
            sortable: true,
            onSort: () => handleSort("DamagePercentage"),
            format: (value) => `${value}%`
        },
        {
            key: "CountOfPurchasingSkus", 
            label: "Items Count", 
            sortable: true,
            onSort: () => handleSort("CountOfPurchasingSkus")
        },
        {
            key: "AvgPurchasePerSku", 
            label: "Avg Purchase/SKU", 
            sortable: true,
            onSort: () => handleSort("AvgPurchasePerSku"),
            format: (value) => formatCurrency(value)
        },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <div className="flex space-x-2">
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={() => navigate(`/inventory/vendor-details/${row.VENDORLEDGERCODE}`)}
                    >
                        View Details
                    </button>
                    <button 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={() => navigate(`/invetory/purchase-orders?vendor=${row.VENDORLEDGERCODE}`)}
                    >
                        Purchase Orders
                    </button>
                </div>
            )
        }
    ]

    // Sort handler
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('desc')
        }
    }

    // Currency formatter
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(value)
    }

    // Summary cards component
    const SummaryCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-medium">Total Purchase Amount</h3>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalPurchase)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm font-medium">Total Active Damages</h3>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalDamages)}</p>
                <p className="text-sm text-gray-500">{((summary.totalDamages / summary.totalPurchase) * 100).toFixed(2)}% of purchases</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-medium">Total Vendors</h3>
                <p className="text-2xl font-bold text-gray-800">{summary.totalVendors}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm font-medium">Total SKUs</h3>
                <p className="text-2xl font-bold text-gray-800">{summary.totalSkus}</p>
                <p className="text-sm text-gray-500">Avg {(summary.totalSkus / summary.totalVendors).toFixed(0)} SKUs per vendor</p>
            </div>
        </div>
    )

    // Search component
    const SearchBar = () => (
        <div className="mb-4">
            <div className="relative">
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    )

    // Refresh button component
    const RefreshButton = () => (
        <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={getData}
            disabled={loading}
        >
            {loading ? 'Loading...' : 'Refresh Data'}
        </button>
    )

    // Charts section component
    const ChartsSection = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Top Vendors by Purchase Amount */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Vendors by Purchase</h3>
                <ResponsiveContainer width="100%" height={300}>
  <BarChart data={topVendorsChartData} layout="vertical" margin={{ left: 30 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" />
    <YAxis type="category" dataKey="name" width={150} />
    <Tooltip formatter={(value) => formatCurrency(value)} />
    <Legend />
    <Bar
      dataKey="value"
      name="Purchase Amount"
      fill="#0088FE"
      onClick={(data) => navigate(`/inventory/vendor-details/${data.code}`)}
    />
  </BarChart>
</ResponsiveContainer>

            </div>

            {/* Top Vendors by Damages */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Vendors by Active Damages</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={damageAnalysisData} layout="vertical" margin={{ left: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
      
      <Bar onClick={(data) => navigate(`/inventory/vendor-details/${data.code}`)}  dataKey="value" name="Active Damages" fill="#FF8042" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Vendors by SKU Count */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Vendors by SKU Count</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={skuDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {skuDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} SKUs`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )

    return (
        <MainLayout>
            <div className="p-4 bg-white rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl font-bold mb-4 md:mb-0">Vendor Analytics Dashboard</h1>
                    {/* <RefreshButton /> */}
                </div>
                
                <SummaryCards />
                {/* <SearchBar /> */}
                <ChartsSection />
                
                <div className="bg-white rounded-lg shadow">
                    
                    <TableLayout 
                        data={sortedAndFilteredVendors} 
                        headers={headers} 
                        title="Vendor List" 
                        isLoading={loading}
                        currentSort={{
                            field: sortField,
                            order: sortOrder
                        }}
                    />
                </div>
            </div>
        </MainLayout>
    )
}

export default Vendors