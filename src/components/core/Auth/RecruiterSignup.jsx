import React from 'react'
import { sendOTP, validatePassword } from '../../../services/operations/authAPI';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSignupData } from '../../../slices/authSlice';
import {AiOutlineEyeInvisible,AiOutlineEye} from "react-icons/ai";
import { ACCOUNT_TYPE } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { InputField } from './InputField';
import { useState } from 'react';
import { apiConnector } from '../../../services/apiconnector';

const RecruiterSignup = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        accountType:ACCOUNT_TYPE.RECRUITER,
        companyName:"",
        gstNo:"",
        email:"",
        password:"",confirmPassword:"",
    });

    const [showPassword,setShowPassword] = useState({
        create: false,
        confirmPassword:false
    })

    function changeHandler(e){
        // console.log(formData);
        setFormData((prev)=>{
            return {
                ...prev,
                [e.target.name]:e.target.value
            }
        })
    }
    
    function showPasswordHandler(name,value){
        setShowPassword((prev)=>{
            return{
                ...prev,
                [name]: !value
            }
        })
    }

    function validateCompanyDomain(mail){
        const companyDomainPattern = /^[A-Za-z0-9._%+-]+@(?!gmail\.com|yahoo\.com|hotmail\.com)[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return companyDomainPattern.test(mail);
    }

    async function validateCompanyGSTandName(gst,name){
        try {
            const result = await apiConnector("GET",
                `https://gst-insights-api.p.rapidapi.com/validateGSTNumber/${gst}`,null,
                {
                    'x-rapidapi-key': process.env.REACT_APP_GST_API_SECRET,
                    'x-rapidapi-host': 'gst-insights-api.p.rapidapi.com'
                }
            );
    
            const response = result?.data;

            if(!response?.success)
                return response;
    
            if(!response?.data?.isActive){
                return {
                    success: false,
                    message: "GST not Active"
                }
            }
    
            name = name.split(" ").join("").toLowerCase();
            const legalName = response?.data?.legalName.split(" ").join("").toLowerCase();
            const tradeName = response?.data?.tradeName.split(" ").join("").toLowerCase();
            if(name !== legalName && name !== tradeName){
                return {
                    success: false,
                    message: "Company name not Registered with GST"
                }
            }
    
            return {
                success: true
            }
        } catch (err) {
            console.log("GST API ERROR",err);
            return {
                success: false,
                message: err?.response?.data?.message || err?.message
            }
        }
    }

    async function submitHandler(e){
        e.preventDefault();

        //validate company by GST No and Name 
        const response = await validateCompanyGSTandName(formData?.gstNo,formData?.companyName);
        if(!response?.success){
            toast.error(response?.message);
            return;
        }        

        if(!validateCompanyDomain(formData?.email)){
            toast.error("Not a valid Company domain Mail");
            return;
        }

        if(formData.password !== formData.confirmPassword){
            toast.error("Password must match Confirm password");
            return;
        }

        if(!validatePassword(formData))
            return;

        // console.log(formData);
        
        dispatch(setSignupData(formData));
        
        // console.log(signupData);

        dispatch(sendOTP(formData.email,navigate));

        setFormData({
            accountType:ACCOUNT_TYPE.APPLICANT,
            name:"",
            email:"",
            password:"",confirmPassword:"", 
        })
    }

  return (
    <form className='flex flex-col gap-4 my-8' onSubmit={submitHandler}>
        <fieldset className='flex max-sm:flex-wrap gap-3 '>
            <label className='w-full relative text-white text-[16px]'>
                <span>GST Registered Company Name<sup>*</sup></span>
                <InputField
                    name={'companyName'}
                    type={'text'}
                    placeholder={'Enter Company Name'}
                    formData={formData.companyName}
                    changeHandler={changeHandler}
                />
            </label>
        </fieldset>
        <label className='w-full relative text-white text-[16px]'>
            <span>Company GST No<sup>*</sup></span>
            <InputField
                name={'gstNo'}
                type={'text'}
                placeholder={'Enter GST No'}
                formData={formData.gstNo}
                changeHandler={changeHandler}
            />
        </label>
        <label className='w-full relative text-white text-[16px]'>
            <span>Official Company Mail<sup>*</sup></span>
            <InputField
                name={'email'}
                type={'email'}
                placeholder={'Enter email address'}
                formData={formData.email}
                changeHandler={changeHandler}
            />
        </label>
        <fieldset className='flex max-sm:flex-wrap gap-3 text-sm'>
            <label className='w-full relative text-white text-[16px]'>
                <span>Create Password<sup>*</sup></span>
                <InputField
                    name={'password'}
                    type={!showPassword.create ? "password":"text"}
                    placeholder={'Enter Password'}
                    formData={formData.password}
                    changeHandler={changeHandler}
                    showPasswordHandler={showPasswordHandler}
                />
                <span className={`absolute bottom-[15%] text-richblack-200 text-[20px] right-[5%] left-[85%]`}
                        onClick={()=>{showPasswordHandler("create",showPassword.create)}}>
                        {showPassword.create === true
                            ?<AiOutlineEyeInvisible />
                            :<AiOutlineEye/>
                        }
                </span>
            </label>

            <label className='w-full relative text-white text-[16px]'>
                <span>Confirm Password<sup>*</sup></span>
                <InputField
                    name={'confirmPassword'}
                    type={!showPassword.confirmPassword ? "password":"text"}
                    placeholder={'Confirm Password'}
                    formData={formData.confirmPassword}
                    changeHandler={changeHandler}
                    showPasswordHandler={showPasswordHandler}
                />
                <span className='absolute left-[85%] bottom-[15%] text-richblack-200 text-[20px]' onClick={()=>{showPasswordHandler("confirmPassword",showPassword.confirmPassword)}}>
                    {
                        showPassword.confirmPassword === true
                        ?<AiOutlineEyeInvisible/>
                        :<AiOutlineEye/>
                    }
                </span>
            </label>

        </fieldset>
        <button type='submit' className='bg-[#FFD60A] text-black font-semibold py-2 rounded-lg'>
            Create Account
        </button>
    </form>
  )
}

export default RecruiterSignup