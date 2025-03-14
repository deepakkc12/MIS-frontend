import React, { useEffect, useState } from 'react'
import NonPerformingCustomers from './Npc'
import { getRequest } from '../../../../../services/apis/requests'
import MainLayout from '../../../Layout/Layout'

function NpcCustomersDb() {

    const [customers,setCustomers] = useState([])

    const getNpcCustomers = async ()=>{
        const response = await getRequest(`crm/npc-list/`)
        if(response.success){
            setCustomers(response.data)
        }else{
            
        }
    }
    
    useEffect(()=>{
        getNpcCustomers()
    },[])
 

  return (
    <MainLayout>
      <NonPerformingCustomers customers={customers}/>
    </MainLayout>
  )
}

export default NpcCustomersDb
