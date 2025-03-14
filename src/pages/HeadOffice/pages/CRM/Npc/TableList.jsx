import React from 'react'
import TableLayout from '../../../../../components/Table/TableLayout'

function TableList({customers,setCustomers}) {

    const headers = [
        {key:'Name',label:'Name',},
        {key:'Phone',label:'date',},
        {key:'ABV',label:'ABV',},
        {key:'AMOUNT',label:'AMOUNT',},
        {key:'rankOutOf100',label:'rankOutOf100',},
    ]

  return (
    <TableLayout title='Total Npc List' enableRowClick data={customers} headers={headers} onRowClick={(data)=>{setCustomers(data);console.log(data)}}/>
  )
}

export default TableList
