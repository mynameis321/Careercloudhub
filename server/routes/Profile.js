const express = require('express');
const router = express.Router();

const { auth, isApplicant, isRecruiter, isAdmin, isApproved } = require('../middlewares/auth');
const { 
    deleteAccount,
    // getAllUserDetails,
    // updateProfilePicture,
    updateApplicantProfile,
    updateRecruiterProfile,
    fetchAllRecruiters,
    fetchAllApplicants
} = require('../controllers/Profile');


//Rutes for Update profile, get all user details, get courses enrolled for a user, delete account or profile

//***************************************************************************************
//                                 PROFILE ROUTES
//***************************************************************************************

// update and get profile details 
router.get('/getAllComopanies',auth,isApproved,isAdmin,fetchAllRecruiters);//in future to be accessed by admin only
router.get('/getAllApplicants',auth,isApproved,isAdmin,fetchAllApplicants);//in future to be accessed by admin only
router.put('/applicant/updateProfile',auth,isApproved,isApplicant,updateApplicantProfile);
router.put('/recruiter/updateProfile',auth,isApproved,isRecruiter,updateRecruiterProfile);
// router.put('/updateDisplayPicture',auth,updateProfilePicture);

//delete account
router.delete('/deleteProfile',auth,deleteAccount);

module.exports = router;