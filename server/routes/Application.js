// Import the required modules
const express = require("express");
const router = express.Router();

const { auth, isRecruiter, isApplicant, isApproved } = require("../middlewares/auth");
const { 
        getApplicationsByCompany, 
        getApplicationsByApplicant, 
        getApplicationDetails, 
        updateApplicationStatus 
    } = require("../controllers/Applications");

router.get('/recruiter/getApplications',auth,isApproved,isRecruiter,getApplicationsByCompany);
router.get('/applicant/getApplications',auth,isApproved,isApplicant,getApplicationsByApplicant);
router.post('/getApplicationDetails',auth,isApproved,isRecruiter,getApplicationDetails);
router.put('/updateApplicationStatus',auth,isApproved,isRecruiter,updateApplicationStatus);


module.exports = router;