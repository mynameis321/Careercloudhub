import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateProfile } from '../../../../services/operations/SettingsAPI';
import { ACCOUNT_TYPE } from '../../../../utils/constants';
import { validateDOB } from '../../../../utils/dobValidation';
import toast from 'react-hot-toast';

const ApplicantProfileForm = () => {

    const dispatch = useDispatch();
    const {user} = useSelector(state =>  state.profile);
    const {token} = useSelector(state => state.auth);

    const [loading , setLoading] = useState(false);

    const genderData = [
        "Male",
        "Female",
        // "Binary",
        // "Non Binary",
        // "Prefer Not to Say"
    ];

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors,isSubmitSuccessful}
    
    } = useForm();

    useEffect(()=>{
        if(isSubmitSuccessful || user){
            reset({
                firstName:user?.firstName,
                lastName:user?.lastName,
                dob:user?.dob,
                gender:user?.gender,
                mobile:user?.mobile,
                description:user?.description
            });
            // console.log("reseting...")
        }
    },[reset,isSubmitSuccessful,user]);

    const submitHandler = async(data)=>{
        try{
            // console.log("data",data);
            setLoading(true);
            
            if(!validateDOB(data?.dob)){
                toast.error("Age must be 18 years or above");
                return;
            }
            
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
                {/* First Name */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>First Name</p>
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                        type='text'
                        name='firstname'
                        placeholder='Enter First Name'
                        {...register("firstName",{required:true})}
                        defaultValue={user?.firstName}
                    />
                    {
                        errors.firstName &&
                        <span className="text-[12px] text-yellow-100">
                            Please Enter First Name
                        </span>
                    }
                </label>
                {/* Last Name  */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Last Name</p>
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                        type='text'
                        name='lastname'
                        placeholder='Enter Last Name'
                        {...register("lastName")}
                        defaultValue={user?.lastName}
                    />
                </label>
            </div>

            <div className='flex max-sm:flex-col gap-6'>
                {/* dob */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Date Of Birth</p>
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'

                        type='date'
                        name='dob'
                        {...register("dob", {
                            validate: (val)=> {
                                if(!validateDOB(val)) 
                                    return "Age must be 18 years or above"; 
                                return true;
                            },
                            max: {
                                value: new Date().toISOString().split("T")[0],
                                message: "Date of Birth cannot be in the future.",
                            },
                        })}
                        defaultValue={user?.dob}
                    />
                    {errors.dob && (
                        <span className="text-[12px] text-yellow-100">
                            {errors.dob.message}
                        </span>
                    )}
                </label>
                {/* gender */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Gender</p>
                        <select
                            
                            className="outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]"

                            name="gender"
                            size={1}
                            {...register("gender",)}
                            defaultValue={user?.gender}>

                            {
                                genderData.map((element,index)=>{
                                    return <option key={index} value={element}>
                                            {element}
                                        </option>
                                })
                            }
                        </select>
                        {/* {errors.gender && (
                            <span className="text-[12px] text-yellow-100">
                             Please enter your Date of Birth.
                            </span>
                        )} */}
                </label>
            </div>

            <div className='flex max-sm:flex-col gap-6'>
               {/* Contact Number */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Contact Number</p>  
                    
                    <input
                        className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'

                        type='tel'
                        name='mobile'
                        placeholder='Enter Contact Number'
                        {...register("mobile",
                        {
                            required:{value:true,message:"Please Enter Your Contact Number"},
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
                {/* Description */}
                <label className='flex flex-col w-full'>
                    <p className='text-[16px]'>Summary</p>
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

export default ApplicantProfileForm;