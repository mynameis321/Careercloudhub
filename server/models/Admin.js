const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    approve:{
        type: Boolean,
        default: false, //to be changed in future
        required: true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        default:"Applicant",
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    token:{
        type: String
    },
    resetPaswordExpiresIn:{
        type: Date,
    },
});

module.exports = mongoose.model('Admin',adminSchema);