import { apiConnector } from "../apiconnector";
import toast from "react-hot-toast";
import { adminEndpoints, categories, settingsEndpoints } from "../apis";

const {
    CREATE_ADMIN_API,
    FETCH_ALL_APPLICANTS,
    FETCH_ALL_RECRUITERS
} = adminEndpoints;

const {
    BAN_USER_ACCOUNT_API
} = settingsEndpoints;

const {
    EDIT_CATEGORY_API,
    GET_CATEGORY_DETAILS_API
} = categories

export function createAdmin(data,token){
    return async(dispatch)=>{
        const toastId = toast.loading("Creating Admin");
        try{
            const response = await apiConnector(
                "POST",CREATE_ADMIN_API,data,
                {
                    Authorization:`Bearer ${token}`
                }
            );
            
            if(!response?.data?.success)
            throw new Error(response?.data?.message);
    
            toast.dismiss(toastId);
            // console.log("CREATE ADMIN API RESPONSE....",response);
            toast.success("Admin Created Successfully successfully");
            
        }catch(err){
            toast.dismiss(toastId);
            // console.log("CREATE ADMIN API ERROR....",err);
            toast.error(err?.response?.data?.message || err?.message);
        }
    }
}

export async function editCategoryDetails(formData,token){
    let result = null;
    const toastId = toast.loading("Saving Category Details");
    try{

        // console.log(Object.fromEntries(formData))
            const response = await apiConnector(
                "POST",
                EDIT_CATEGORY_API,
                formData,
                {
                    Authorization:`Bearer ${token}`
                }
            );

            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            toast.success(response?.data?.message);
            // console.log("UPDATE CATEGORY API REPONSE....",response);
            result = response?.data?.data;

    }catch(err){
        // console.log("UPDATE CATEGORY API ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function fetchCategoryDetails(categoryId,token){
    let result = null;
    const toastId = toast.loading("fetching");
    try{

        // console.log(Object.fromEntries(formData))
            const response = await apiConnector(
                "POST",
                GET_CATEGORY_DETAILS_API,
                {categoryId},
                {
                    Authorization:`Bearer ${token}`
                }
            );

            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            toast.success(response?.data?.message);
            // console.log("GET_CATEGORY_DETAILS_API_REPONSE....",response);
            result = response?.data?.data;

    }catch(err){
        // console.log("GET_CATEGORY_DETAILS_API_ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export function fetchAllRecruiters(setRecruiters,token){
    return async(dispatch)=>{
        try{
            const response = await apiConnector(
                "GET",FETCH_ALL_RECRUITERS,null,
                {
                    Authorization:`Bearer ${token}`
                }
            );
            
            if(!response?.data?.success)
            throw new Error(response?.data?.message);
    
            // console.log("FETCH RECRUITERS API RESPONSE....",response);
            setRecruiters(response?.data?.companies);
            // toast.success("Categories fetched successfully");
    
        }catch(err){
            // console.log("FETCH RECRUITERS API ERROR....",err);
            toast.error(err?.response?.data?.message || err?.message);
        }
    }
}

export function fetchAllApplicants(setApplicants,token){
    return async(dispatch)=>{
        try{
            const response = await apiConnector(
                "GET",FETCH_ALL_APPLICANTS,null,
                {
                    Authorization:`Bearer ${token}`
                }
            );
            
            if(!response?.data?.success)
            throw new Error(response?.data?.message);
    
            // console.log("FETCH APPLICANTS API RESPONSE....",response);
            setApplicants(response?.data?.applicants);
            // toast.success("Categories fetched successfully");
    
        }catch(err){
            // console.log("FETCH APPLICANTS API ERROR....",err);
            toast.error(err?.response?.data?.message || err?.message);
        }
    }
}

export function banUnbanUserAccount(token,data,setAccounts){
    return async(dispatch)=>{
        const toastId = toast.loading("Banning");
        try{

            const response = await apiConnector(
                "PUT",
                BAN_USER_ACCOUNT_API,
                data,
                {
                    Authorization: `Bearer ${token}`
                }
            );
            
            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            toast.dismiss(toastId);
            // console.log("BAN USER ACCOUNT API RESPONSE....",response);
            setAccounts(response?.data?.user);
            toast.success(response?.data?.message);
            
        }catch(err){
            // console.log("BAN USER ACCOUNT API ERROR....",err);
            toast.dismiss(toastId);
            toast.err(err?.response?.data?.message || err?.message);
        }
    }
}
