const mongoose = require('mongoose');

const workPreference = new mongoose.Schema({
    workStatus:{
        type:String,
        enum:["College Student","Fresher","Experienced","All"]
    },
    employmentType:{
        type:String,
        enum:["Full Time","Part Time"]
    },
    workType:{
        type:String,
        enum:["Work from Office","Work from Home","Hybrid"]
    },
    shift:{
        type:String,
        enum:["Night","Day"]
    },
    location:{
        type:[String],
    }
});

module.exports = mongoose.model('Preference',workPreference);