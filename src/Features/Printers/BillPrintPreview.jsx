import { useToast } from "../../hooks/UseToast";
import {
  CloseBillPrintModal,
  openBillPrintModal,
} from "../../redux/billPreviewModal/action";
import {
  clearCart,
  fetchCart,
  PrintBill,
  setBillPrintFalse,
} from "../../redux/cart/actions";
import { postRequest } from "../../services/apis/requests";
import {
  Currency,
  KOT_TYEPES,
  Seperate_packing_code,
} from "../../utils/constants";
import { X, Printer, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const PaymentDetails = React.memo(({ payments, totalAmount }) => {
    // Find the cash payment, default to 0 if not found
    const cashPayment = payments.find((pay) => pay.method === 'cash')?.amount || 0;
  
    // Calculate the change
    const change =cashPayment - totalAmount;

    // console.log(change,cashPayment)
  
    return (
      <div className="mt-4 pt-2 border-t border-dashed border-black">
        <div className="font-bold mb-2">Payment Details:</div>
        {payments.map(
          (payment, index) =>
            payment.amount > 0 && (
              <div key={index} className="flex justify-between mb-1">
                <span className="capitalize">{payment.method}:</span>
                <span>{Currency}{parseFloat(payment.amount).toFixed(2)}</span>
              </div>
            )
        )}
        {change > 0 && (
          <div className="flex justify-between mt-2">
            <span className="font-semibold">Change:</span>
            <span>{Currency}{parseFloat(change).toFixed(2)}</span>
          </div>
        )}
      </div>
    );
  });

const BillHeader = React.memo(({ isPrinted, onPrint, onReprint, onClose, loading, rePrint, hasItems }) => (
  <div className="flex justify-between items-center p-4 border-b">
    <h2 className="text-xl text-black font-semibold">
      {isPrinted ? "Print Successful" : "Bill Preview"}
    </h2>
    {rePrint ? (
      <button
        onClick={onReprint}
        className="flex items-center px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all duration-200 shadow-sm"
      >
        <Printer size={16} className="mr-2" />
        {loading ? "Processing.." : "Re-Print"}
      </button>
    ) : (
      hasItems && (
        <button
          onClick={onPrint}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
        >
          <Printer size={16} className="mr-2" />
          {loading ? "Processing.." : "Print Bill"}
        </button>
      )
    )}
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      <X size={24} />
    </button>
  </div>
));

const BillItem = React.memo(({ item }) => (
  <div className="mb-2 pb-1 border-b border-dashed border-gray-300">
    <div className="flex justify-between">
      <div>
        <span className="font-semibold text-black">{item.SkuName}</span>
      </div>
      <div className="text-right">
        <span className="font-bold">Qty: {item.Qty}</span>
        <br />
        <span>{Currency}{parseFloat(item.TotalAmount).toFixed(2)}</span>
      </div>
    </div>
  </div>
));

const BillTotals = React.memo(({ totalTaxable, totalTax, netTotal, additionalCharges, discount }) => (
  <div className="mt-4 pt-2 border-t border-dashed border-black">
    <div className="flex justify-between mb-1">
      <span>Subtotal (Taxable):</span>
      <span>{Currency}{totalTaxable.toFixed(2)}</span>
    </div>
    <div className="flex justify-between mb-1">
      <span>Total Tax:</span>
      <span>{Currency}{totalTax.toFixed(2)}</span>
    </div>
    {discount > 0 && (
      <div className="flex justify-between mb-1">
        <span>Discount:</span>
        <span>-{Currency}{parseFloat(discount).toFixed(2)}</span>
      </div>
    )}
    {additionalCharges > 0 && (
      <div className="flex justify-between mb-1">
        <span>Additional Charges:</span>
        <span>{Currency}{parseFloat(additionalCharges).toFixed(2)}</span>
      </div>
    )}
    <div className="flex justify-between font-bold">
      <span>Net Total:</span>
      <span>{Currency}{netTotal.toFixed(2)}</span>
    </div>
  </div>
));

const BillPreview = ({
  removeOrder,
  items = [],
  handelPayment,
  rePrint = false,
  masterCode,
  kotTypeCode = "",
  payments = [],
  billDetails = {},
  changes=0
}) => {
  const [isPrinted, setIsPrinted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [kotItems, setKotItems] = React.useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen } = useSelector((state) => state.billPrintModal);

  React.useEffect(() => {
    if (!items.length) return;

    const filteredItems = kotTypeCode === KOT_TYEPES.dineIn
      ? items.filter(item => item.KOTNo != 0)
      : items;

    const newKotItems = filteredItems.filter(
      item => item.SubSkuCode !== Seperate_packing_code
    );

    setKotItems(newKotItems);
  }, [items, kotTypeCode]);

  const totals = React.useMemo(() => {
    const totalTaxable = kotItems.reduce(
      (sum, item) => sum + parseFloat(item.TotalTaxable || "0"),
      0
    );
    const totalTax = kotItems.reduce(
      (sum, item) => sum + parseFloat(item.TotalTax || "0"),
      0
    );
    const additionalCharges = parseFloat(billDetails.additionalCharges || 0);
    const discount = parseFloat(billDetails.discount || 0);
    return {
      totalTaxable,
      totalTax,
      additionalCharges,
      discount,
      netTotal: totalTaxable + totalTax + additionalCharges - discount
    };
  }, [kotItems, billDetails]);

  const handleClose = React.useCallback(() => {
    setIsPrinted(false);
    dispatch(CloseBillPrintModal());
    if (isPrinted) {
      dispatch(clearCart());
    }
  }, [dispatch, isPrinted]);

  
  const handleReprint = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await postRequest(`sales/reprint-bill/${masterCode}/`);
      if (response.success) {
        toast.success("Re-printing...");
      } else {
        toast.error("Something went wrong");
      }
      dispatch(CloseBillPrintModal());
    } catch (error) {
      toast.error("Failed to reprint bill");
    } finally {
      setLoading(false);
    }
  }, [masterCode, dispatch, toast]);

  const handleBillPrint = React.useCallback(async () => {
    try {

      const response = await postRequest(`kot/${masterCode}/update-sales-prices/`);
      if (response.success) {
        // toast.success("Bill Printing..");
        if (removeOrder) {
          removeOrder(masterCode);
        }
        setIsPrinted(true);
        if (handelPayment) {
          await handelPayment();
        }
      }

    } catch (error) {
      toast.error("Failed to print bill");
    }
  }, [masterCode, removeOrder, handelPayment, toast]);

  const handlePrint = React.useCallback(async () => {
    if (kotItems.length === 0) {
      toast.warning("No items in the order");
      return;
    }

    setLoading(true);
    try {
      if (kotTypeCode !== KOT_TYEPES.dineIn) {
        const kotResponse = await postRequest(`kot/update-kot-no/${masterCode}/`);
        if (kotResponse.success) {
          toast.success("Kot sent to kitchen");
          await handleBillPrint();
        }
      } else {
        await handleBillPrint();
      }
    } catch (error) {
      toast.error("Failed to print bill");
    } finally {
      setLoading(false);
    }
  }, [kotItems.length, kotTypeCode, masterCode, handleBillPrint, toast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto relative">
        <BillHeader
          isPrinted={isPrinted}
          onPrint={handlePrint}
          onReprint={handleReprint}
          onClose={handleClose}
          loading={loading}
          rePrint={rePrint}
          hasItems={kotItems.length > 0}
        />

        {isPrinted ? (
          <div className="flex items-center justify-center py-10 text-green-600">
            <CheckCircle size={20} className="mr-2" />
            Bill Printed Successfully
          </div>
        ) : (
          <div className="p-4">
            <div className="w-full text-gray-800 bg-white p-4 font-mono text-xs border-2 border-black">
              <div className="text-center mb-2">
                <h1 className="text-base font-bold">Restaurant Name</h1>
                <p>Tax Invoice</p>
              </div>

              <div className="border-b border-dashed border-black pb-2 mb-2">
                <div className="flex justify-between">
                  <span>Bill #: {masterCode}</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>

              {kotItems.length === 0 ? (
                <span className="font-semibold text-black">No Items</span>
              ) : (
                <div>
                  {kotItems.map((item) => (
                    <BillItem key={item.Code} item={item} />
                  ))}
                  <BillTotals {...totals} />
                  <PaymentDetails totalAmount={totals.netTotal} payments={payments} />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end p-4 border-t space-x-2">
          {!isPrinted && !rePrint && (
            <button
              onClick={() => {
                setIsPrinted(false);
                navigate(`/cash-counter/${masterCode}`);
                handleClose();
                dispatch(clearCart());
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center"
            >
              Go to Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(BillPreview);