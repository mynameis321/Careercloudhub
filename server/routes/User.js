const express = require('express');
const router = express.Router();

const { auth, isRecruiter, isAdmin, isApproved } = require('../middlewares/auth');
const { contact } = require('../controllers/Contact');

const {
    sendOTP,
    companySignUp,
    applicantSignUp,
    companyLogin,
    applicantLogin,
    changePassword,
    createAdmin,
    adminLogin,
} = require('../controllers/Auth');

const {
    resetPasswordToken,
    resetPassword
} = require('../controllers/ResetPassword');
const { disApproveAccount } = require('../controllers/Profile');


//Rutes for Login, Signup and Authentication

//***************************************************************************************
//                                 AUTHENTICATION ROUTES
//***************************************************************************************

//Singup
router.post('/signup/applicant',applicantSignUp);
router.post('/signup/company',companySignUp);
router.post('/createAdmin',auth,isApproved,isAdmin,createAdmin);//in future it will be an admin route
router.put('/disApproveUserAccount',auth,isApproved,isAdmin,disApproveAccount);//in future it will be an admin route

//sending otp
router.post('/sendotp',sendOTP);

//login route
router.post('/login/applicant',applicantLogin);
router.post('/login/company',companyLogin);
router.post('/login/admin',adminLogin);

//changing password
router.post('/changePassword',auth,changePassword);


//***************************************************************************************
//                                 RESET PASSWORD ROUTES
//***************************************************************************************

// reset password token
router.post('/reset-password-token',resetPasswordToken);

// reset password
router.post('/reset-password',resetPassword);

//***************************************************************************************
//                                 CONTACT ROUTE
//***************************************************************************************

router.post('/contact',contact);

module.exports = router;