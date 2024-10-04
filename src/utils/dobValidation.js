
export const validateDOB = (date)=>{
    const dob = new Date(date);
    const currDate = new Date();
    const yearDiff = currDate.getFullYear() - dob.getFullYear();
    const monthDiff = currDate.getMonth() - dob.getMonth();
    const dayDiff = dob.getDay() - currDate.getDay();
    
    if(yearDiff < 18)
        return false;
    
    if(yearDiff == 0 && monthDiff < 0)
        return false;

    if(monthDiff == 0 && dayDiff < 0)
        return false
    
    return true;
}
