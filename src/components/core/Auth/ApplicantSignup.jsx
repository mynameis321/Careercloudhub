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
import { validateDOB } from '../../../utils/dobValidation';

const ApplicantSignup = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        accountType:ACCOUNT_TYPE.APPLICANT,
        firstName:"",
        lastName:"",
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

    function submitHandler(e){
        e.preventDefault();

        if(!validateDOB(formData?.dob)){
            toast.error("Age must be 18 years or above");
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
            dob:"" 
        })
    }

  return (
    <form className='flex flex-col gap-4 my-8' onSubmit={submitHandler}>
        <fieldset className='flex max-sm:flex-wrap gap-3 '>
            <label className='w-full relative text-white text-[16px]'>
                <span>First Name<sup>*</sup></span>
                <InputField
                    name={'firstName'}
                    type={'text'}
                    placeholder={'Enter First Name'}
                    formData={formData.firstName}
                    changeHandler={changeHandler}
                />
            </label>
            <label className='w-full relative text-white text-[16px]'>
                <span>Last Name<sup>*</sup></span>
                <InputField
                    name={'lastName'}
                    type={'text'}
                    placeholder={'Enter Last Name'}
                    formData={formData.lastName}
                    changeHandler={changeHandler}
                />
            </label>
        </fieldset>
        <label className='w-full relative text-white text-[16px]'>
            <span>Email Address<sup>*</sup></span>
            <InputField
                name={'email'}
                type={'email'}
                placeholder={'Enter email address'}
                formData={formData.email}
                changeHandler={changeHandler}
            />
        </label>
        <label className='w-full relative text-white text-[16px]'>
            <span>Date of Birth<sup>*</sup></span>
            <InputField
                name={'dob'}
                type={'date'}
                placeholder={''}
                formData={formData.dob}
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

export default ApplicantSignup