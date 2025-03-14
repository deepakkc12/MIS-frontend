import { useToast } from "../../hooks/UseToast";
import { openBillPrintModal } from "../../redux/billPreviewModal/action";
import { clearCart, fetchCart } from "../../redux/cart/actions";
import { postRequest } from "../../services/apis/requests";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { KOT_TYEPES, userPrivileges } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { hasPrivilege } from "../../utils/helper";

const PrintButton = ({ kotType, masterId, removeOrder, newBill,phone='' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [vehicleLastDigits, setVehicleLastDigits] = useState("");
  const [priority, setPriority] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("ring");
  const [tenderAmount, setTenderAmount] = useState("");
  const [loading,setLoading] = useState(false)


  const {user} = useSelector(state=>state.auth)



  const toast = useToast()

  const dispatch = useDispatch();

  const openPreview = async () => {
    const handlePrint = () => {
      dispatch(clearCart())
      dispatch(fetchCart(masterId))
      // navigate(`/cash-counter/${masterId}`)
      // return
      if (kotType == KOT_TYEPES.dineIn || kotType == KOT_TYEPES.homeDelivery) {
        console.log(`Print for KOT Type ${kotType} - No modal configuration`);
        handleProceed()
        return;
      }
      else if(kotType = KOT_TYEPES.takeAway && phone){
        handleProceed()
        return;
      }
      setIsModalOpen(true);
    };
    handlePrint()
  };


const navigate = useNavigate()
  
  const handleProceed =async () => {

    if(kotType==KOT_TYEPES.takeAway && phoneNumber==""){
      toast.error("Enter customer phonenumber")
      return
    }else{
    if(!loading){
      setLoading(true)
  
      if(phoneNumber && !phone){
        const response = await postRequest(`kot/${masterId}/update-customer-no/`,{phoneNo:phoneNumber})
        if(response.success){
          toast.success("Customer number updated")
        }
      navigate(`/cash-counter/${masterId}`)
      }
      navigate(`/cash-counter/${masterId}`)
  
      return
  
      const additionalDetails = {
        kotType,
        customerName,
        phoneNumber,
        ...(kotType == KOT_TYEPES.driveThrough && { vehicleLastDigits, priority }),
        ...(kotType == "" && { deliveryPreference, tenderAmount })
      };
  
  
      if(!kotType==KOT_TYEPES.dineIn ){
  
        // dispatch(openKotPrintModal())
  
      //   const response = await postRequest(`kot/update-kot-no/${masterId}/`)
  
        
      //   if (response.success){
      //   toast.success("Kot send to kitchen")
      //   // dispatch(fetchCart())
      // }
  
      }
  
      dispatch(openBillPrintModal())
  
      // openBillPreview()
  
      // dispatch(openPaymentModal())
      
      console.log('Printing with details:', additionalDetails);
      // setLoading(false)
      setIsModalOpen(false);
     }}
    };

  const InputField = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    maxLength,
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          transition-all duration-200"
      />
    </div>
  );

  const renderTakeAwayContent = () => (
    <div>
    {/* <InputField 
      label="Customer Name"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      placeholder="Enter customer name (Optional)"
    /> */}
   <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Phone Number
    </label>
    <input 
      type="number"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      placeholder={"Enter phone number "}
      // maxLength={maxLength}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        transition-all duration-200"
    />
  </div>
  </div>
  );


  const has_privilege = hasPrivilege(user.privileges,userPrivileges.cashCounter)

  if (!has_privilege) return null

  return (
    <>
     <button
      onClick={openPreview}
      className="py-3 px-4 w-full rounded-lg flex items-center justify-center gap-2 
                 transition-all duration-300 
                 bg-green-500 dark:bg-green-600 
                 hover:bg-green-600 dark:hover:bg-green-700 
                 text-white font-medium shadow-sm"
      aria-label="Print Bill"
    >
      Print Bill
    </button>


      {isModalOpen && kotType ==KOT_TYEPES.takeAway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Take Away
            </h2>

            {renderTakeAwayContent()}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrintButton;