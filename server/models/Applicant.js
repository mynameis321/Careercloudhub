const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
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
    description:{
        type:String,
        trim:true,
        // required:true
    },
    gender:{
        type:String,
        enum:["Male","Female"]
    },
    dob:{
        type:String,
    },
    mobile:{
        type:String,
        // required:true
    }, 
    applications:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application"
    }],
    token:{
        type: String
    },
    resetPaswordExpiresIn:{
        type: Date,
    },
    // education:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Education'
    // }],
    // certification:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Certificate',
    // }],
    // workPreference:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Preference"
    // },
    // shortListed:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Job'
    // }],
    // hired:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Job'
    // }]
});

module.exports = mongoose.model('Applicant',applicantSchema);