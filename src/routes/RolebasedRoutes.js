import Dashboard from "../pages/HeadOffice/Dashboard/Index";
import SystemAlerts from "../pages/HeadOffice/pages/Alerts/Alerts";
import CRMDashboard from "../pages/HeadOffice/pages/CRM/CRMDashboard";
import CustomerDetails from "../pages/HeadOffice/pages/CRM/CustomerDetail/CustomerDetail";
import Level1Customer from "../pages/HeadOffice/pages/CRM/CUstomerLevels/Level1";
import Level2Customer from "../pages/HeadOffice/pages/CRM/CUstomerLevels/Level2";
import Level3Customer from "../pages/HeadOffice/pages/CRM/CUstomerLevels/Level3";
import Level4Customer from "../pages/HeadOffice/pages/CRM/CUstomerLevels/Level4";
import FrequentCustomers from "../pages/HeadOffice/pages/CRM/FrequentVisitors/Index";
import NpcCustomersDb from "../pages/HeadOffice/pages/CRM/Npc/Index";
import NonPerformingCustomers from "../pages/HeadOffice/pages/CRM/Npc/Npc";
import PrioritCustomers from "../pages/HeadOffice/pages/CRM/PriorityCustomers/PrioritCustomers";
import TopPrioritCustomers from "../pages/HeadOffice/pages/CRM/TopPriorCustomers/TopPriorCustomers";
// import BranchList from "../pages/HeadOffice/pages/Branches/BranchList/BranchList";
import DailyReport from "../pages/HeadOffice/pages/DailyReport/DailyReport";
import DayWiseReports from "../pages/HeadOffice/pages/DayWiseReports/DayWiseReports";
import DayWiseSummery from "../pages/HeadOffice/pages/DayWiseSummery/DayWIseSummery";
import BackdatedEntriesPage from "../pages/HeadOffice/pages/Finantial/BackDatedEntry/BackDatedEntry";
import BackdatedEntriesCard from "../pages/HeadOffice/pages/Finantial/components/BackDatedEntrieCard";
import ExpenseAsIncomePage from "../pages/HeadOffice/pages/Finantial/ExpenseAsIncome/ExpenseAsINcome";
import FinancialDashboard from "../pages/HeadOffice/pages/Finantial/FinantialDashboard";
import OpexAnalyticsDashboard from "../pages/HeadOffice/pages/Finantial/Opex/OpexDetails";
import PaymentTracksAnalyzer from "../pages/HeadOffice/pages/Finantial/PaymentTracks/PaymentTracks";
import PendingCrNoteRefundExceptions from "../pages/HeadOffice/pages/Finantial/PendingCrNoteExceptions/PendingCrNoteExceptions";
import RangeException from "../pages/HeadOffice/pages/Finantial/RangeExceptions/RangeException";
import RefundExceptinos from "../pages/HeadOffice/pages/Finantial/RefundExceptions/RefundExceptinos";
import ReFundExceptionDetails from "../pages/HeadOffice/pages/Finantial/RefundExceptions/RefundExceptionDetails";
import ROIDashboard from "../pages/HeadOffice/pages/Finantial/ROI/ROI";
import CategoryDetailedView from "../pages/HeadOffice/pages/Inventory/CategoryDetail/CategoryDetail";
import CategoryList from "../pages/HeadOffice/pages/Inventory/CategoryDetail/List";
import CustomerChoices from "../pages/HeadOffice/pages/Inventory/CustomerChices/CustomerChoices";
import GroupAnalatycs from "../pages/HeadOffice/pages/Inventory/Group/GroupDetails";
import GroupNBrandDetails from "../pages/HeadOffice/pages/Inventory/GroupNBrand/Detail/GroupNBrandDetail";
import InventoryDashboard from "../pages/HeadOffice/pages/Inventory/Inventory";
import SalesOpportunityDashboard from "../pages/HeadOffice/pages/Inventory/SalesOpertunityLossModal/SalesOpertunityLoassModal";
import SKUAnalyticsDashboard from "../pages/HeadOffice/pages/Inventory/SkuDetail/SkuDetail";
import VendorDetailsPage from "../pages/HeadOffice/pages/Inventory/Vendor/VendorDetails/VendorDetails";
import Vendors from "../pages/HeadOffice/pages/Inventory/Vendor/Vendors";
import MisReports from "../pages/HeadOffice/pages/MISReports/MisReports";
import BrowsedEANItemsDetail from "../pages/HeadOffice/pages/MISReports/TypedEans/components/BrowsedEANitems";
import ManuallyEnteredBarcodesDetail from "../pages/HeadOffice/pages/MISReports/TypedEans/components/ManualEnteredBarcodes";
import BrowsedPrivateLabelsDetail from "../pages/HeadOffice/pages/MISReports/TypedEans/components/PrivateLbels";
import BrowsedRepackItemsDetail from "../pages/HeadOffice/pages/MISReports/TypedEans/components/RepackItemDetails";
import UnregisteredEANCodesDetail from "../pages/HeadOffice/pages/MISReports/TypedEans/components/UnregisteredEANCodesDetail ";
import SalesDashboard from "../pages/HeadOffice/pages/Sales/Index";


export const routes = {

  superAdmin: [

    { path: "/dashboard", element: Dashboard },
    { path: "/sales", element: SalesDashboard },
    { path: "/monthly-reports", element: DailyReport },


    { path: "/daily-reports", element: DailyReport },
    { path: "/day-wise-reports", element: DayWiseReports },
    { path: "/day-wise-summery", element: DayWiseSummery },
    { path: "/alerts", element: SystemAlerts },
    

    { path: "/mis-reports", element: MisReports },
    { path: "/mis-reports/browsed-ean-items", element: BrowsedEANItemsDetail },
    { path: "/mis-reports/browsed-private-labels", element: BrowsedPrivateLabelsDetail },
    { path: "/mis-reports/browsed-repack-items", element: BrowsedRepackItemsDetail },
    { path: "/mis-reports/unregistered-eans", element: UnregisteredEANCodesDetail },
    { path: "/mis-reports/manual-barcodes", element: ManuallyEnteredBarcodesDetail },


    
    { path: "/crm", element: CRMDashboard },
    { path: "/crm/buying-days", element: PrioritCustomers },
    { path: "/crm/non-pc", element: NpcCustomersDb },
    { path: "/crm/frequent-customers", element: FrequentCustomers },
    { path: "/crm/cut-details/:custCode", element: CustomerDetails },
    { path: "/crm/Premium", element: Level1Customer },
    { path: "/crm/Bronze", element: Level3Customer },
    { path: "/crm/Gold", element: Level2Customer },
    { path: "/crm/Standard", element: Level4Customer },
    { path: "crm/priority-customers", element: TopPrioritCustomers },
    { path: "crm/new-customers", element: TopPrioritCustomers },



    { path: "/inventory", element: InventoryDashboard },
    { path: "/inventory/categories", element: CategoryList },

    { path: "/inventory/sku-details", element: SKUAnalyticsDashboard },
    { path: "/inventory/customer-choices", element: CustomerChoices },
    { path: "/inventory/category-details", element: CategoryDetailedView },
    { path: "/inventory/opertunity-loss", element: SalesOpportunityDashboard },
    { path: "/inventory/vendors", element: Vendors },
    { path: "inventory/vendor-details/:code", element: VendorDetailsPage },
    { path: "inventory/group-details/:gpCode", element: GroupAnalatycs },
    { path: "inventory/gNb/:gpCode/:bdCode", element: GroupNBrandDetails },



    



    { path: "/financials", element: FinancialDashboard },
    { path: "/financials/refund-exceptions", element: RefundExceptinos },
    { path: "/financials/pending-refund-exceptions", element: PendingCrNoteRefundExceptions },
    { path: "/financials/expenses-as-income", element: ExpenseAsIncomePage },
    { path: "/financials/range-exceptions", element: RangeException },
    { path: "/financials/backdated-entries", element: BackdatedEntriesPage },
    { path: "/financials/refunds-details", element: ReFundExceptionDetails },
    { path: "/financials/roi-details", element: ROIDashboard },
    { path: "/financials/receivables-payables", element: PaymentTracksAnalyzer },
    { path: "/financials/opex-details", element: OpexAnalyticsDashboard },

  ],
};

export const roles = {  
  employee: "employee",
  superAdmin: "superAdmin",
};
