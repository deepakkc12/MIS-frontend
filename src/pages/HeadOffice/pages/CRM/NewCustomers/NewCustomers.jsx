import React, { useEffect, useState } from "react";
import MainLayout from "../../../Layout/Layout";
import { getRequest } from "../../../../../services/apis/requests";
import TableLayout from "../../../../../components/Table/TableLayout";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../utils/helper";

function TopPrioritCustomers() {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateRangeSelect = (range) => {
    setSelectedDateRange(range);

    // You can use the selected range to fetch or filter data
    console.log("Selected date range:", range);
    // Call your report data loading functions here
  };

  const headers = [
    { key: "Name", label: "Name" ,onColumnClick:(v,r)=>{navigate(`/crm/cut-details/${r.CardHolderCode}`)}},
    { key: "OCT", label: "OCT" },
    { key: "NOV", label: "NOV" },
    { key: "DEC", label: "DEC" },
    { key: "JAN", label: "JAN" },
    { key: "FEB", label: "FEB" },
    { key: "AMOUNT", label: "Total in 5 months" },
  ];

  const getCustomers = async () => {
      setLoading(true);
      const response = await getRequest(
        `crm/new-customers/`
      );

    //   const arrangedData = response.data.map((customer) => ({
    //     ...customer,
    //     dot: formatDate(customer.dot),
    //   }));

      setCustomers(response.data);
      setLoading(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <MainLayout>
      <div className="p-4 w-full rounded-xl bg-gray-50 mx-auto">
        <div className="grid grid-cols-1 gap-6">
         
            <div className="bg-white rounded-lg shadow-md ">
              {/* <h2 className="text-xl font-semibold mb-4">
                  Report for Days {selectedDateRange.startDay}-{selectedDateRange.endDay}
                </h2>
                <p className="text-gray-500">
                  Showing data from {selectedDateRange.startDate} to {selectedDateRange.endDate}
                </p> */}

              {/* Your report components would go here */}
              <div className=" ">
                <TableLayout
                  loading={loading}
                  enableRowClick
                  onRowClick={(row) => {
                    navigate(`/crm/cut-details/${row.CardHolderCode}`);
                  }}
                  headers={headers}
                  data={customers}
                  title="Top Priority customers"
                />
              </div>
            </div>
          
        </div>
      </div>
    </MainLayout>
  );
}

export default TopPrioritCustomers;
