import { getRequest } from "../requests"

export const getTotalSalesSummeryDetails =async ()=>{
    const response =await getRequest('dashboard/sales-summery/')
    if (response.success){
        return response.data
    }else{
        throw new Error(response.errors[0])
    }
}