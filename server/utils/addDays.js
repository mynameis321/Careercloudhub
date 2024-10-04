Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const addDaysToCurrentdate = (days)=>{    
    var date = new Date();
    return date.addDays(days);    
}