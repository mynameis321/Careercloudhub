// Import the required modules
const express = require("express");
const router = express.Router();

//middlewares
const {
    auth,
    isApplicant,
    isRecruiter,
    isAdmin
} = require('../middlewares/auth');

//catagory controller imports
const {
    createCategory,
    showAllCategories,
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
router.post('/createCategory',auth,isRecruiter,createCategory);
router.get('/showAllCategories',showAllCategories);
router.post('/getJobsByCategory',getCategoryPageJobs);

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

//Jobs can only be created by recruiters
router.post('/createJob',auth,isRecruiter,createJob);
router.get('/getJobsByCompany',auth,isRecruiter,getJobsByCompany);
router.get('/getAllJobs',getAllJobs);

//Get Details for a job
router.post('/getJobDetails',getJobDetails);
router.post('/applyJob',auth,isApplicant,createApplication);
router.post('/editJob',auth,isRecruiter,editJob);
router.post('/deleteJob',auth,isRecruiter,deleteJob);


module.exports = router;