import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateProfile } from '../../../../services/operations/SettingsAPI';
import { ACCOUNT_TYPE } from '../../../../utils/constants';

const RecruiterProfileForm = () => {

    const dispatch = useDispatch();
    const {user} = useSelector(state =>  state.profile);
    const {token} = useSelector(state => state.auth);

    const [loading , setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors,isSubmitSuccessful}
    
    } = useForm();

    useEffect(()=>{
        if(isSubmitSuccessful || user){
            reset({
                companyName:user?.companyName,
                mobile:user?.mobile,
                poc:user?.poc,
                pocDesignation:user?.pocDesignation,
                address:user?.address,
                description:user?.description
            });
            // console.log("reseting...")
        }
    },[reset,isSubmitSuccessful,user]);

    const submitHandler = async(data)=>{
        try{
            // console.log("data",data);
            setLoading(true);
            dispatch(updateProfile(token,data,user?.accountType)).then(()=>{
                setLoading(false);
                // console.log("user data",user);
            });
        }catch(err){
            console.log("ERROR MESSAGE - ", err.message)
        }
    }

  return (
    <form
        className='flex flex-col'
        onSubmit={handleSubmit(submitHandler)}>
       
        <div className='my-6 flex flex-col justify-between gap-6 bg-richblack-800 p-6 sm:px-10 px-6  rounded-md border border-richblack-700'>

            <p className='text-xl font-bold'>Profile Information</p>

            <div className='flex max-sm:flex-col gap-6'>
                {/* POC  */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>POC</p>
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                        type='text'
                        name='poc'
                        placeholder='Enter POC Name'
                        {...register("poc",{
                            required:{
                                value: true,
                                message:"POC name required"
                            }
                        })}
                        defaultValue={user?.poc}
                    />
                    {errors.poc && (
                        <span className="text-[12px] text-yellow-100">
                            {errors.poc.message}
                        </span>
                    )}
                </label>
                {/* POC Designation */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>POC Designation</p>
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                        type='text'
                        name='pocDesignation'
                        placeholder='Enter POC Designation'
                        {...register("pocDesignation",{
                            required:{
                                value: true,
                                message:"POC Designation required"
                            }
                        })}
                        defaultValue={user?.poc}
                    />
                    {errors.pocDesignation && (
                        <span className="text-[12px] text-yellow-100">
                            {errors.pocDesignation.message}
                        </span>
                    )}
                </label>
            </div>

            <div className='flex max-sm:flex-col gap-6'>
                {/* Contact Number */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Company Contact Number</p>  
                    
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'

                        type='tel'
                        name='mobile'
                        placeholder='Enter Company Contact Number'
                        {...register("mobile",
                        {
                            required:{value:true,message:"Please Enter Contact Number"},
                            maxLength:{value:10,message:"Invalid Contact Number"},
                            minLength:{value:8,message:"Invalid Contact Number"}
                        })}
                        defaultValue={user?.mobile}
                    />
                    {
                        errors.mobile &&
                        <span className="text-[12px] text-yellow-100">
                            {errors.mobile.message}
                        </span>
                    }
                </label>
            </div>

            <div className='flex max-sm:flex-col gap-6'>

                {/* Description */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Description</p>
                    <textarea
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                        rows={5}
                        name='description'
                        placeholder='Enter something about yourself'
                        {...register("description",{
                            required:{
                                value:true,
                                message:"Please enter a short description"
                            },
                            minLength:{
                                value:300,
                                message:"Description should be of minimum 300 letters"
                            },
                            maxLength:{
                                value:600,
                                message:"Description should not exceed 600 letters"
                            }
                        })}
                        defaultValue={user?.description}
                    />
                    {
                        errors.description &&
                        <span className=" text-[12px] text-yellow-100">
                            {errors.description?.message}
                        </span>
                    }
                </label>
            </div>
            <div className='flex max-sm:flex-col gap-6'>

                {/* Address */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Address</p>
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                        type='text'
                        name='address'
                        placeholder='Enter your address'
                        {...register("address",{
                            required:{
                                value:true,
                                message:"Please enter address"
                            }
                        })}
                        defaultValue={user?.address}
                    />
                    {
                        errors.address &&
                        <span className=" text-[12px] text-yellow-100">
                            {errors.address?.message}
                        </span>
                    }
                </label>
            </div>
        </div>
        
        {/* Form Buttons */}
        <div className='flex items-center gap-2 self-end'>
            {/* Cancel */}
            <Link to={`/dashboard/${
                user?.accountType === ACCOUNT_TYPE.APPLICANT ? "applicant" 
                : (user?.accountType === ACCOUNT_TYPE.RECRUITER ? "recruiter" : "admin") 
            }/profile`}>
                <button 
                    type='reset'
                    className='p-2 px-5 bg-richblack-700 text-richblack-5 font-bold rounded-md'
                    disabled={loading}>
                    Cancel
                </button>
            </Link>
            {/* Submit */}
            <button 
                className='p-2 px-5 bg-yellow-50 text-richblack-900 font-bold rounded-md'
                type='save'
                disabled={loading}>

                Save
            </button>
        </div>
    </form>
  )
}

export default RecruiterProfileForm;