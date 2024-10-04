const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    institute:{
        type:String,
        required: true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    media:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Certificate',certificateSchema);