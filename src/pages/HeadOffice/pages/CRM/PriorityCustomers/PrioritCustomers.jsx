import React, { useEffect, useState } from 'react'
import MainLayout from '../../../Layout/Layout'
import DateRangeLabels from './components/dateRangeLabels'
import { getRequest } from '../../../../../services/apis/requests';
import TableLayout from '../../../../../components/Table/TableLayout';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../../utils/helper';

function PrioritCustomers() {
    const [selectedDateRange, setSelectedDateRange] = useState(null);
    const [customers,setCustomers] = useState([])
    const [loading,setLoading] = useState(false)
      
    const handleDateRangeSelect = (range) => {
      setSelectedDateRange(range);

      // You can use the selected range to fetch or filter data
      console.log("Selected date range:", range);
      // Call your report data loading functions here
    };

    const headers = 
    [    { key: "slNo", label: "Sl.No" },
        { key: "dot", label: "Joined Date" },
        { key: "Name", label: "Name" },
        { key: "Phone", label: "Phone" },        
        { key: "ABVMth", label: "ABV per Month" },
        { key: "NOB", label: "NOB" },
        { key: "highValueSales", label: "highValueSales" },

   ]

    const getCustomers = async (startDate)=>{

        console.log(startDate)
        if(startDate){
            setLoading(true)
        const response = await getRequest(`crm/pr-customers-list/?startDate=${startDate}`)

        const arrangedData = response.data.map(customer => ({
            ...customer,
            dot: formatDate(customer.dot)
          }));
          
        setCustomers(arrangedData)
        setLoading(false)
        }
    }

    const navigate = useNavigate()

    useEffect(()=>{
      const  startDate = selectedDateRange?selectedDateRange.startDay:null
        getCustomers(startDate)
        console.log(selectedDateRange)
    },[selectedDateRange])
    
    return (
    <MainLayout>
   
        <div className="p-4 w-full bg-gray-50 mx-auto">
          
          <div className="grid grid-cols-1 gap-6">
            <DateRangeLabels onRangeSelect={handleDateRangeSelect} />
            
            {selectedDateRange && (
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* <h2 className="text-xl font-semibold mb-4">
                  Report for Days {selectedDateRange.startDay}-{selectedDateRange.endDay}
                </h2>
                <p className="text-gray-500">
                  Showing data from {selectedDateRange.startDate} to {selectedDateRange.endDate}
                </p> */}
                
                {/* Your report components would go here */}
                <div className=" bg-gray-100 rounded-md mt-4 flex items-center justify-center">
                <TableLayout loading={loading} enableRowClick  onRowClick={(row)=>{navigate(`/crm/cut-details/${row.code}`)}} headers={headers} data={customers} title='Priority Customers'/>
                </div>
              </div>
            )}
          </div>
        </div>
    </MainLayout>
  )
}

export default PrioritCustomers
