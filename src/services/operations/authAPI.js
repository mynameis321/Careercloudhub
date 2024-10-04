import { setLoading, setToken, setTokenExpiry } from '../../slices/authSlice';
import { endpoints } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from '../apiconnector';
import { setUser } from '../../slices/profileSlice';
import { ACCOUNT_TYPE } from '../../utils/constants';

export function sessionExpire(navigate , dispatch){
    
    console.log(Date.now());
    setTimeout(()=>{
        console.log("logging out");
        dispatch(logout(navigate));
        console.log(Date.now());
    },240*60*1000);
}

export function validatePassword(formData){
    let pass = formData.password;

    const uppercase = (pass) => /[A-Z]/.test(pass);
    const lowercase = (pass) => /[a-z]/.test(pass);
    const number =  (pass) => /[0-9]/.test(pass);
    const specialChar = pass.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) ? true : false;

    // console.log(uppercase(pass),lowercase(pass),number(pass),specialChar);

    if(!uppercase(pass) || !lowercase(pass) || !number(pass) || !specialChar || pass.length < 8 ){
        toast.error("Password must match the rules");
        return false;
    }

    return true;
}

export function sendOTP(email , navigate ){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{

            const result = await apiConnector("POST",endpoints.SENDOTP_APT,{
                email,
            })

            if(!result?.data?.success)
                throw new Error(result?.data?.message);

            // console.log("SENDOTP RESPONSE....",result);
            toast.success(result?.data?.message);
            navigate('/verify-email');
        
        }catch(err){
            // console.log("SENDOTP RESPONSE....",err);
            toast.error(err?.response?.data?.message || err?.message);
        }
        dispatch(setLoading(false));
    }
}

export function signup(data,otp,navigate){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{

            const API_PATH = data?.accountType === ACCOUNT_TYPE?.APPLICANT 
            ? endpoints.APPLICANT_SIGNUP_API : endpoints.RECRUITER_SIGNUP_API
            
            const response = await apiConnector("POST",API_PATH,{...data,otp});

            if(!response?.data?.success)
                throw new Error(response?.data?.message);

            // console.log("SIGNUP API RESPONSE....",response);
            toast.success(response?.data?.message);
            navigate('/login');

        }catch(err){
            // console.log("SIGNUP API RESPONSE....",err);
            toast.error(err?.response?.data?.message || err?.message);
            navigate('/signup');
        }
        dispatch(setLoading(false));
    }
}

export function login(data, navigate){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const API_PATH = data?.accountType === ACCOUNT_TYPE?.APPLICANT ? endpoints.APPLICANT_LOGIN_API : endpoints.RECRUITER_LOGIN_API;
            const response = await apiConnector("POST",API_PATH,data);
            
            if(!response?.data?.success)
                throw new Error(response?.data?.message);

            // console.log("LOGIN API RESPONSE....",response);
            toast.success(response?.data?.message);
            dispatch(setToken(response?.data?.token));
            dispatch(setTokenExpiry(response?.data?.tokenExpiry));

            response.data.user.image = response.data.user.image ? response.data.user.image  : `https://api.dicebear.com/5.x/initials/svg?seed=${response?.data?.user?.firstName || response?.data?.user?.name}`;
            dispatch(setUser(response?.data?.user));

            // sessionExpire(navigate,dispatch);

            localStorage.setItem("token",JSON.stringify(response?.data?.token))
            localStorage.setItem("tokenExpiry",JSON.stringify(response?.data?.tokenExpiry))
            const user = response?.data?.user;

            if(user?.accountType === ACCOUNT_TYPE.APPLICANT)
                navigate('/dashboard/applicant/profile');
            else if(user?.accountType === ACCOUNT_TYPE.RECRUITER)
                navigate('/dashboard/recruiter/profile');

        }catch(err){
            // console.log("LOGIN API RESPONSE.....",err);
            toast.error(err?.response?.data?.message || err?.message);
        }
        dispatch(setLoading(false));
    }
}

export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null));
        dispatch(setTokenExpiry(null));
        dispatch(setUser(null));
        // dispatch(resetCart());
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast.success("Logged Out");
        navigate("/");
    }
}

export function getPasswordResetToken(email , setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            
            const response = await apiConnector("POST",endpoints.RESETPASSTOKEN_API,{email});
            
            if(!response?.data?.success)
                throw new Error(response.data.message);
            
            // console.log("RESET_PASSWORD_TOKEN_RESPONSE....",response);
            toast.success(response?.data?.message);
            setEmailSent(true);

        }catch(err){
            // console.log("RESET_PASS_TOKEN_ERROR............", err);
            toast.error(err?.response?.data?.message || err?.message);
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(token , formData , setEmailSent){

    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{

            // console.log(formData);
            const response = await apiConnector("POST",endpoints.RESETPASSWORD_API,{
                token,
                newPassword: formData?.password,
                confirmNewPassword: formData?.confirmPassword,
                accountType: formData?.accountType
            });
            
            if(!response?.data?.success)
                throw new Error(response?.data?.message);

            setEmailSent(true);
            // console.log("RESET PASSWORD RESPONSE....",response);
            toast.success(response?.data?.message);

        }catch(err){
            // console.log("RESET PASSWORD ERROR............", err);
            toast.error(err?.response?.data?.message || err?.message);
        }
        dispatch(setLoading(false));
    };
}