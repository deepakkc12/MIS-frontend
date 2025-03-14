export const  formatDateToDDMMYYYY = (date)=> {
    if (!(date instanceof Date)) {
      throw new Error("Invalid date object");
    }

    const day = String(date.getDate()).padStart(2, '0'); // Ensures 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }

  export const convertDateFormat = (dateString) => {
    // If dateString is null or undefined, return "-"
    if (!dateString) {
      return "-";
    }
  
    console.log(dateString);
    // Split the input date string into an array [YYYY, MM, DD]
    const [year, month, day] = dateString.split('-');
    
    // Extract the last two digits of the year
    const shortYear = year.slice(-2);
    
    // Return the formatted date in DD-MM-YY format
    return `${day}-${month}-${shortYear}`;
  };

export const hasPrivilege = (userPrivileges, requiredPrivileges) => {
    if (!userPrivileges || userPrivileges.length === 0) return false;
  
    if (Array.isArray(requiredPrivileges)) {
      return requiredPrivileges.some(privilege => userPrivileges.includes(privilege));
    }
  
    return userPrivileges.includes(requiredPrivileges);
  };


  export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }


 export  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
 export const formatCurrency = (amount) => {
  const am = parseFloat(amount)
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
      }).format(am);
    };