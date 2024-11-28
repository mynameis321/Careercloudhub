// Import the required modules
const express = require("express");
const router = express.Router();

//middlewares
const {
    auth,
    isApplicant,
    isRecruiter,
    isAdmin,
    isApproved
} = require('../middlewares/auth');

//catagory controller imports
const {
    createCategory,
    showAllCategories,
    editCategory,
    getCategoryDetails,
} = require('../controllers/Category');

//Course controller imports 
const {
    createJob,
    getAllJobs,
    getCategoryPageJobs,
    getJobDetails,
    getJobsByCompany,
    editJob,
    deleteJob,
} = require('../controllers/Job');

const {
    createApplication
} = require('../controllers/Applications');

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post('/createCategory',auth,isApproved,isAdmin,createCategory);
router.post('/editCategory',auth,isApproved,isAdmin,editCategory);
router.post('/getCategoryDetails',auth,isApproved,isAdmin,getCategoryDetails);
router.get('/showAllCategories',showAllCategories);
router.post('/getJobsByCategory',getCategoryPageJobs);

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

//Jobs can only be created by recruiters
router.post('/createJob',auth,isApproved,isRecruiter,createJob);
router.get('/getJobsByCompany',auth,isApproved,isRecruiter,getJobsByCompany);
router.get('/getAllJobs',getAllJobs);

//Get Details for a job
router.post('/getJobDetails',getJobDetails);
router.post('/applyJob',auth,isApproved,isApplicant,createApplication);
router.post('/editJob',auth,isApproved,isRecruiter,editJob);
router.post('/deleteJob',auth,isApproved,isRecruiter,deleteJob);


module.exports = router;