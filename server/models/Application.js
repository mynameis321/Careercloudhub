const mongose = require('mongoose');

const applicationSchema = new mongose.Schema({
    createdAt:{
        type: Date,
        default: Date.now(),
        required: true
    },
    applicant:{
        type:mongose.Schema.Types.ObjectId,
        ref:"Applicant",
        required:true
    },
    job:{
        type:mongose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    company:{
        type:mongose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    education:{
        type:String,
        required:true
    },
    workStatus:{
        type:String,
        required:true
    },
    currentOffer:{
        type:String,
        required: this.workStatus === "Experienced"
    },
    currentSalary:{
        type:String,
        required: this.currentOffer 
    },
    skills:{
        type:[String],
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    linkedIn:{
        type:String,
        required:true
    },
    portfolio:{
        type:String,
    },
    coverLetter:{
        type:String,
    },
    linkedIn:{
        type:String,
        // required:true
    },
    status:{
        type:String,
        default:"Awaiting",
        enum:["Awaiting","Shortlisted","Call for Interview","Interview Scheduled","Hired","Rejected"],
        required:true
    }
});

module.exports = mongose.model('Application',applicationSchema);