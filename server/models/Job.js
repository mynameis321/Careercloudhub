const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required: true
    },
    active:{
        type:Boolean,
        required:true
    },
    noOfPositions:{
        type:Number,
        required: true
    },
    role:{
        type:String,
        required: true,
    },
    summary:{
        type:String,
        required: true,
    },
    responsibilities:{
        type:[String],
        required: true,
        trim:true
    },
    preferredQualifications:{
        type:[String],
        required: true,
        trim:true
    },
    skills:{
        type:[String],
        required: true
    },
    requirements: {
		type: [String],
        required:true
	},
    benifits: {
		type: [String],
        // required:true
	},
    policies: {
		type: [String],
        // required:true
	},
    workPreference:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Preference",
        required:true
    },
    salary:{
        type:String,
        // required: true
    },
    applications:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application"
    }],
    applicants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Applicant"
    }],
});

module.exports = mongoose.model("Job",jobSchema);