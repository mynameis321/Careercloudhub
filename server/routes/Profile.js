const express = require('express');
const router = express.Router();

const { auth, isApplicant, isRecruiter } = require('../middlewares/auth');
const { 
    deleteAccount,
    // getAllUserDetails,
    // updateProfilePicture,
    updateApplicantProfile,
    updateRecruiterProfile
} = require('../controllers/Profile');


//Rutes for Update profile, get all user details, get courses enrolled for a user, delete account or profile

//***************************************************************************************
//                                 PROFILE ROUTES
//***************************************************************************************

// update and get profile details 
// router.get('/getUserDetails',auth,getAllUserDetails);
router.put('/applicant/updateProfile',auth,isApplicant,updateApplicantProfile);
router.put('/recruiter/updateProfile',auth,isRecruiter,updateRecruiterProfile);
// router.put('/updateDisplayPicture',auth,updateProfilePicture);

//delete account
router.delete('/deleteProfile',auth,deleteAccount);

module.exports = router;