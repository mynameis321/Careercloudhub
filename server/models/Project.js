const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title:{
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
    link:{
        type:String,
    },
});

module.exports = mongoose.model('Work',projectSchema);