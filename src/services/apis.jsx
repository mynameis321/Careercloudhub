
const BASE_URL = process.env.REACT_APP_BASE_URL;

//AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_APT: BASE_URL + "/auth/sendotp",
    RECRUITER_SIGNUP_API: BASE_URL + "/auth/signup/company",
    APPLICANT_SIGNUP_API: BASE_URL + "/auth/signup/applicant",
    RECRUITER_LOGIN_API: BASE_URL + "/auth/login/company",
    APPLICANT_LOGIN_API: BASE_URL + "/auth/login/applicant",
    ADMIN_LOGIN_API: BASE_URL + "/auth/login/admin",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

//CATAGORIES ENDPOINTS
export const categories = {
    CREATE_CATEGORY_API: BASE_URL + "/job/createCategory",
    EDIT_CATEGORY_API: BASE_URL + "/job/editCategory",
    GET_CATEGORY_DETAILS_API: BASE_URL + "/job/getCategoryDetails",
    CATEGORIES_API: BASE_URL + "/job/showAllCategories",
}

export const contact = {
    CONTACT_API: BASE_URL + "/auth/contact"
}

//SETTINGS ENDPOINTS
export const settingsEndpoints = {
    BAN_USER_ACCOUNT_API: BASE_URL + "/auth/disApproveUserAccount",
    UPDATE_USER_DISPLAY_PICTURE: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_APPLICANT_PROFILE_DETAILS: BASE_URL + "/profile/applicant/updateProfile",
    UPDATE_RECRUITER_PROFILE_DETAILS: BASE_URL + "/profile/recruiter/updateProfile",
    UPDATE_USER_PASSWORD: BASE_URL + "/auth/changePassword",
    DELETE_USER_PROFILE: BASE_URL + "/profile/deleteProfile"
}

//ADMIN ENDPOINT
export const adminEndpoints = {
    CREATE_ADMIN_API: BASE_URL + "/auth/createAdmin",
    FETCH_ALL_RECRUITERS: BASE_URL + "/profile/getAllComopanies",
    FETCH_ALL_APPLICANTS: BASE_URL + "/profile/getAllApplicants"
}

//APPLICATION ENDPOINT
export const applicationEndpoint = {
    SUBMIT_JOB_APPLICATION_API: BASE_URL + "/job/applyJob",
    GET_APPLICATIONS_BY_RECRUITER_API: BASE_URL + "/application/recruiter/getApplications",
    GET_APPLICATIONS_BY_APPLICANT_API: BASE_URL + "/application/applicant/getApplications",
    GET_APPLICATION_DETAILS_API: BASE_URL + "/application/getApplicationDetails",
    UPDATE_APPLICATION_STATUS_API: BASE_URL + "/application/updateApplicationStatus",
}

//COURSE ENDPOINTS
export const jobEndpoints = {
    CREATE_JOB_API: BASE_URL + "/job/createJob",
    EDIT_JOB_API: BASE_URL + "/job/editJob",
    DELETE_JOB_API: BASE_URL + "/job/deleteJob",
    GET_ALL_JOBS_API: BASE_URL + "/job/getAllJobs",
    GET_CATEGORY_PAGE_JOBS_API: BASE_URL + "/job/getJobsByCategory" ,
    GET_JOBS_BY_RECRUITER_API: BASE_URL + "/job/getJobsByCompany" ,
    GET_JOB_DETAILS_API: BASE_URL + "/job/getJobDetails",

   
    GET_COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
    GET_FULL_COURSE_DETAILS_API: BASE_URL + "/course/getFullCourseDetails"
}
