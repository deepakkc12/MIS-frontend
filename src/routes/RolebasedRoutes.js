import Dashboard from "../pages/HeadOffice/Dashboard/Index";
import SystemAlerts from "../pages/HeadOffice/pages/Alerts/Alerts";
import CRMDashboard from "../pages/HeadOffice/pages/CRM/CRMDashboard";
import CustomerDetails from "../pages/HeadOffice/pages/CRM/CustomerDetail/CustomerDetail";
import FrequentCustomers from "../pages/HeadOffice/pages/CRM/FrequentVisitors/Index";
import NpcCustomersDb from "../pages/HeadOffice/pages/CRM/Npc/Index";
import NonPerformingCustomers from "../pages/HeadOffice/pages/CRM/Npc/Npc";
import PrioritCustomers from "../pages/HeadOffice/pages/CRM/PriorityCustomers/PrioritCustomers";
// import BranchList from "../pages/HeadOffice/pages/Branches/BranchList/BranchList";
import DailyReport from "../pages/HeadOffice/pages/DailyReport/DailyReport";
import DayWiseReports from "../pages/HeadOffice/pages/DayWiseReports/DayWiseReports";
import DayWiseSummery from "../pages/HeadOffice/pages/DayWiseSummery/DayWIseSummery";
import BackdatedEntriesPage from "../pages/HeadOffice/pages/Finantial/BackDatedEntry/BackDatedEntry";
import BackdatedEntriesCard from "../pages/HeadOffice/pages/Finantial/components/BackDatedEntrieCard";
import ExpenseAsIncomePage from "../pages/HeadOffice/pages/Finantial/ExpenseAsIncome/ExpenseAsINcome";
import FinancialDashboard from "../pages/HeadOffice/pages/Finantial/FinantialDashboard";
import PendingCrNoteRefundExceptions from "../pages/HeadOffice/pages/Finantial/PendingCrNoteExceptions/PendingCrNoteExceptions";
import RangeException from "../pages/HeadOffice/pages/Finantial/RangeExceptions/RangeException";
import RefundExceptinos from "../pages/HeadOffice/pages/Finantial/RefundExceptions/RefundExceptinos";
import ReFundExceptionDetails from "../pages/HeadOffice/pages/Finantial/RefundExceptions/RefundExceptionDetails";
import MisReports from "../pages/HeadOffice/pages/MISReports/MisReports";


export const routes = {

  superAdmin: [
    { path: "/dashboard", element: Dashboard },
    { path: "/daily-reports", element: DailyReport },
    { path: "/day-wise-reports", element: DayWiseReports },
    { path: "/day-wise-summery", element: DayWiseSummery },
    { path: "/crm", element: CRMDashboard },
    { path: "/alerts", element: SystemAlerts },
    { path: "/mis-reports", element: MisReports },
    { path: "/crm/priority-customers", element: PrioritCustomers },
    { path: "/crm/non-pc", element: NpcCustomersDb },
    { path: "/crm/frequent-customers", element: FrequentCustomers },
    { path: "/crm/cut-details/:custCode", element: CustomerDetails },
    { path: "/inventory", element: CustomerDetails },
    { path: "/financials", element: FinancialDashboard },
    { path: "/financials/refund-exceptions", element: RefundExceptinos },
    { path: "/financials/pending-refund-exceptions", element: PendingCrNoteRefundExceptions },
    { path: "/financials/expenses-as-income", element: ExpenseAsIncomePage },
    { path: "/financials/range-exceptions", element: RangeException },
    { path: "/financials/backdated-entries", element: BackdatedEntriesPage },




    { path: "/financials/refunds-details", element: ReFundExceptionDetails },
  ],
};

export const roles = {  
  employee: "employee",
  superAdmin: "superAdmin",
};
