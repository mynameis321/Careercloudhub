import toast from "react-hot-toast";
import { applicationEndpoint } from "../apis";
import { apiConnector } from "../apiconnector";

const {
    SUBMIT_JOB_APPLICATION_API,
    GET_APPLICATIONS_BY_RECRUITER_API,
    GET_APPLICATIONS_BY_APPLICANT_API,
    GET_APPLICATION_DETAILS_API,
    UPDATE_APPLICATION_STATUS_API
} = applicationEndpoint;

export async function submitJobApplication(formData,token,navigate){
    const toastId = toast.loading("Submitting Application");
    try{
            // console.log("here: , formData: ",formData);
            const response = await apiConnector(
                "POST",
                SUBMIT_JOB_APPLICATION_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization:`Bearer ${token}`
                }
            );

            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            toast.dismiss(toastId)
            toast.success(response?.data?.message);
            navigate('/dashboard/applicant/my-applications');
            // console.log("SUBMIT_JOB_API_REPONSE....",response);
            return response?.data?.data;
    }catch(err){
        // console.log("SUBMIT_JOB_API_ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
        toast.dismiss(toastId)
        return null
    }
}

export async function fetchApplicationsByRecruiter(token){
    let result = null;
    const toastId = toast.loading("Fetching Applications");
    try{

        const response = await apiConnector(
            "GET",
            GET_APPLICATIONS_BY_RECRUITER_API,
            null,
            {
                "Authorization":`Bearer ${token}`
            }
        );

        if(!response?.data?.success)
            throw new Error(response?.data?.message);
            
        // toast.success(response?.data?.message);
        // console.log("GET_APPLICATIONS_BY_RECRUITER_API_RESPONSE...",response);
        result = response?.data?.data;

    }catch(err){
        // console.log("GET_APPLICATIONS_BY_RECRUITER_API_ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function fetchApplicationsByApplicant(token){
    let result = null;
    const toastId = toast.loading("Fetching Applications");
    try{

        const response = await apiConnector(
            "GET",
            GET_APPLICATIONS_BY_APPLICANT_API,
            null,
            {
                "Authorization":`Bearer ${token}`
            }
        );

        if(!response?.data?.success)
            throw new Error(response?.data?.message);
            
        // toast.success(response?.data?.message);
        // console.log("GET_APPLICATIONS_BY_APPLICANT_API_RESPONSE...",response);
        result = response?.data?.data;

    }catch(err){
        // console.log("GET_APPLICATIONS_BY_APPLICANT_API_ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function fetchApplicationDetails(applicationId,token) {
    let result = null;
    const toastId = toast.loading("loading");
    try{

        const response = await apiConnector(
            "POST",
            GET_APPLICATION_DETAILS_API,
            {applicationId},
            {
                Authorization:`Bearer ${token}`
            }
        );
        
        if(!response?.data?.success)
            throw new Error(response?.data?.message);

        // toast.success(response?.data?.message);
        // console.log("GET APPLICATION DETAILS API RESPONSE....",response);
        result = response?.data?.data;

    }catch(err){
        // console.log("GET APPLICATION DETAILS API ERROR....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
    return result;
}

export async function updateApplicationStatus(data,token){
    const toastId = toast.loading("Updating");
    try{

        const response = await apiConnector(
            "PUT",
            UPDATE_APPLICATION_STATUS_API,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        );
        
        if(!response?.data?.success)
            throw new Error(response?.data?.message);
        
        // console.log("UPDATE APPLICATION STATUS API RESPONSE....",response);
        toast.dismiss(toastId);
        toast.success(response?.data?.message);
        return response?.data?.data;
        
    }catch(err){
        // console.log("UPDATE APPLICATION STATUS API ERROR....",err);
        toast.dismiss(toastId);
        toast.err(err?.response?.data?.message || err?.message);
        return null;
    }
}