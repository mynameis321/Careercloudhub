import { apiConnector } from "../apiconnector";
import { jobEndpoints } from "../apis";
import { categories } from "../apis";
import toast from "react-hot-toast";

const {
    CREATE_JOB_API,
    GET_ALL_JOBS_API,
    GET_CATEGORY_PAGE_JOBS_API,
    GET_JOBS_BY_RECRUITER_API,
    GET_JOB_DETAILS_API,
    EDIT_JOB_API,
    DELETE_JOB_API
} = jobEndpoints;

export function fetchCategories(setCategories){
    return async(dispatch)=>{
        try{
            const response = await apiConnector("GET",categories.CATEGORIES_API);
            
            if(!response?.data?.success)
            throw new Error(response?.data?.message);
    
            // console.log("FETCH CATEGORIES API RESPONSE....",response);
            setCategories(response?.data?.allCategories);
            // toast.success("Categories fetched successfully");
    
        }catch(err){
            console.log("FETCH CATAGORIES API RESPONSE....",err);
            toast.error(err?.response?.data?.message || err?.message);
        }
    }
}

export async function createJob(formData,token,navigate){
    const toastId = toast.loading("Creating Job");
    try{
            // console.log("here: , formData: ",formData);
            const response = await apiConnector(
                "POST",
                CREATE_JOB_API,
                formData,
                {
                    Authorization:`Bearer ${token}`
                }
            );

            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            toast.dismiss(toastId)
            toast.success(response?.data?.message);
            navigate('/dashboard/recruiter/my-jobs');
            // console.log("CREATE_JOB_API_REPONSE....",response);
            return response?.data?.data;
    }catch(err){
        // console.log("CREATE JOB API RESPONSE....",err);
        toast.error(err?.response?.data?.message || err?.message);
        toast.dismiss(toastId)
        return null
    }
}

export async function fetchCategoryPageJobs(category){
    let result = null;
    const toastId = toast.loading("Fetching Jobs");
    try{

        const response = await apiConnector(
            "POST",
            GET_CATEGORY_PAGE_JOBS_API,
            {category}
        );

        if(!response?.data?.success)
            throw new Error(response?.data?.message);
            
        // toast.success(response?.data?.message);
        // console.log("GET ALL JOBS API RESPONSE...",response);
        result = response?.data?.data;

    }catch(err){
        // console.log("GET ALL JOBS API ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function fetchCaJobsByRecruiter(token){
    let result = null;
    const toastId = toast.loading("Fetching Jobs");
    try{

        const response = await apiConnector(
            "GET",
            GET_JOBS_BY_RECRUITER_API,
            null,
            {
                "Authorization":`Bearer ${token}`
            }
        );

        if(!response?.data?.success)
            throw new Error(response?.data?.message);
            
        // toast.success(response?.data?.message);
        // console.log("GET ALL JOBS API RESPONSE...",response);
        result = response?.data?.data;

    }catch(err){
        // console.log("GET ALL JOBS API ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function fetchJobDetails(jobId){
    let result = null;
    const toastId = toast.loading("loading");
    try{

        const response = await apiConnector(
            "POST",
            GET_JOB_DETAILS_API,
            {jobId}
        );
        
        if(!response?.data?.success)
            throw new Error(response?.data?.message);

        // toast.success(response?.data?.message);
        // console.log("GET JOB DETAILS API RESPONSE....",response);
        result = response?.data?.data;

    }catch(err){
        // console.log("GET JOB DETAILS API RESPONSE....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function fetchAllJobs(){
    let result = null;
    // const toastId = toast.loading("Fetching Jobs");
    try{

        const response = await apiConnector(
            "GET",
            GET_ALL_JOBS_API,
        );

        if(!response?.data?.success)
            throw new Error(response?.data?.message);
            
        // toast.success(response?.data?.message);
        // console.log("GET ALL JOBS API RESPONSE...",response);
        result = response?.data?.data;

    }catch(err){
        // console.log("GET ALL JOBS API ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    // toast.dismiss(toastId);
    return result;
}

export async function editJobDetails(formData,token){
    let result = null;
    const toastId = toast.loading("Saving Job Details");
    try{

        // console.log(Object.fromEntries(formData))
            const response = await apiConnector(
                "POST",
                EDIT_JOB_API,
                formData,
                {
                    Authorization:`Bearer ${token}`
                }
            );

            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            toast.success(response?.data?.message);
            // console.log("UPDATE JOB API REPONSE....",response);
            result = response?.data?.data;

    }catch(err){
        // console.log("UPDATE JOB API ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function deleteJobByRecruiter(formData,token){
    const toastId = toast.loading("Deleting Job");

    try{
        const response = await apiConnector(
            "POST",
            DELETE_JOB_API,
            formData,
            {
                Authorization:`Bearer ${token}`
            }
        );
        
        if(!response?.data?.success)
            throw new Error(response?.data?.message);
        
        // console.log("DELETE JOB API RESPONSE...." ,response);
        toast.dismiss(toastId);
        toast.success(response?.data?.message);

    }catch(err){
        toast.dismiss(toastId);
        // console.log("DELETE JOB API ERROR...." ,err);
        toast.error(err?.response?.data?.message || err?.message);
    }
}


