import React from 'react'
import { useNavigate } from 'react-router-dom'

function Orders() {

    const navigate = useNavigate()

  return (
     <button
    onClick={()=>{navigate("/active-orders")}}
    className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg text-[14px] md:textsm
      bg-green-500 hover:bg-green-600 text-white dark:bg-green-600
      transition-colors"
  >
    {/* <UserPlus size={20} /> */}
    <span>Billing</span>
  </button>
  )
}

export default Orders
