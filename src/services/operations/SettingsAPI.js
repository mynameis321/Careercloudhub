import toast from "react-hot-toast";
import { apiConnector } from '../apiconnector';
import { settingsEndpoints } from '../apis';
import { setUser } from "../../slices/profileSlice";
import { logout } from './authAPI'
import { ACCOUNT_TYPE } from "../../utils/constants";

const {
    UPDATE_APPLICANT_PROFILE_DETAILS,
    UPDATE_RECRUITER_PROFILE_DETAILS
} = settingsEndpoints;

export function updateDisplayPicture(token , formData){
    return async(dispatch)=>{
        console.log(formData)
        const toastId = toast.loading("Loading...");
        try{

            const response = await apiConnector(
                "PUT",
                settingsEndpoints.UPDATE_USER_DISPLAY_PICTURE,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            );

            if(!response.data.success)
                throw new Error(response.data.message);

            console.log("UPDATE DISPLAY PICTURE API....",response);
            dispatch(setUser(response.data.data));
            toast.success("Display Picture Updated Successfully");
            
        }catch(err){
            console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE....",err);
            toast.err("Could Not Update Display Picture");
        }
        finally{
            toast.dismiss(toastId);
        }
    }
}

export function updateProfile (token,data,accountType){
    return async(dispatch)=>{
        const toastId = toast.loading("Updating");
        try{

            const response = await apiConnector(
                "PUT",
                accountType === ACCOUNT_TYPE.APPLICANT
                ? UPDATE_APPLICANT_PROFILE_DETAILS : UPDATE_RECRUITER_PROFILE_DETAILS,
                data,
                {
                    Authorization: `Bearer ${token}`
                }
            );
            
            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            toast.dismiss(toastId);
            // console.log("UPDATE USER PROFILE API RESPONSE....",response);

            const userName = response?.data?.updatedUserDetails?.name || response?.data?.updatedUserDetails?.companyName || response?.data?.updatedUserDetails?.firstName + " " + response?.data?.updatedUserDetails?.secondName
            
            let userImage = response?.data?.user?.image ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${userName}`;

            let user = {
                ...response?.data?.updatedUserDetails,
                image: userImage
            }

            dispatch(setUser(user));
            toast.success("Profile Updated Successfully");
            
        }catch(err){
            // console.log("UPDATE USER PROFILE API ERROR....",err);
            toast.dismiss(toastId);
            toast.err(err?.response?.data?.message || err?.message);
        }
    }
}

export async function changePassword(token,data){
 
    const toastId = toast.loading("updating...");
    try{
        const response = await apiConnector(
            "POST",
            settingsEndpoints.UPDATE_USER_PASSWORD,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        );

        if(!response?.data?.success)
            throw new Error(response?.data?.message);

        // console.log("UPDATE PASSWORD API RESPONSE....",response);
        toast.success(response?.data?.message);

    }catch(err){
        // console.log("UPDATE PASSWORD API RESPONSE....",err);
        toast.error(err?.response?.data?.message || err?.message);
    }
    toast.dismiss(toastId);
}

export function deleteAccount(token,navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("deleting");
        try{

            const response = await apiConnector(
                "DELETE",
                settingsEndpoints.DELETE_USER_PROFILE,
                null,
                {
                    Authorization: `Bearer ${token}`
                }
            );

            if(!response?.data?.success)
                throw new Error(response?.data?.message);
            
            // console.log("DELETE PROFILE API RESPONSE....",response);
            toast.success(response?.data?.message);
            
            dispatch(logout(navigate));
            
        }catch(err){
            // console.log("DELETE_PROFILE_API API ERROR............", err);
            toast.error(err?.response?.data?.message || err?.message);
        }
        toast.dismiss(toastId);
    }
}