// Import the required modules
const express = require("express");
const router = express.Router();

const { auth, isRecruiter, isApplicant } = require("../middlewares/auth");
const { 
        getApplicationsByCompany, 
        getApplicationsByApplicant, 
        getApplicationDetails, 
        updateApplicationStatus 
    } = require("../controllers/Applications");

router.get('/recruiter/getApplications',auth,isRecruiter,getApplicationsByCompany);
router.get('/applicant/getApplications',auth,isApplicant,getApplicationsByApplicant);
router.post('/getApplicationDetails',auth,isRecruiter,getApplicationDetails);
router.put('/updateApplicationStatus',auth,isRecruiter,updateApplicationStatus);


module.exports = router;