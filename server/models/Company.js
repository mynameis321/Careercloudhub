const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    approve:{
        type: Boolean,
        default: false, //to be changed in future
        required: true
    },
    companyName:{
        type:String,
        required:true,
        trim:true
    },
    gstNo:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    mobile:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        default:"Company",
        required:true
    },
    description:{
        type:String,
        trim:true,
        // required: true
    },
    poc:{
        type:String,
        // required: true
    },
    pocDesignation:{
        type:String,
        // required: true
    },
    address:{
        type:String,
        // required: true
    },
    token:{
        type: String
    },
    resetPaswordExpiresIn:{
        type: Date,
    },
    jobs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    }],
    applications:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Application'
    }]
});

module.exports = mongoose.model('Company',companySchema);