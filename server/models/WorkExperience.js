const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
    role:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    description:{
        type:[String],
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    media:{
        type:[String],
    },
});

module.exports = mongoose.model('Work',workSchema);