import React, { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../common/IconBtn';
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../../utils/constants';
import { createAdmin } from '../../../../services/operations/AdminAPI';

export const CreateAdmin = () => {

  const dispatch = useDispatch();
//   const navigate = useNavigate();

  const {token} = useSelector(state => state.auth);
  const [loading,setLoading] = useState(false);

  const {
    register,
    isSubmitSuccessful, 
    handleSubmit,
    reset,
    formState : {errors}

  } = useForm();

  useEffect(()=>{
    if(isSubmitSuccessful){
        reset({
            name:"",
            email:"",
            mobile:""
        });
    }
  },[isSubmitSuccessful,reset]);

  const submitHandler = async(data)=>{
    setLoading(true);
    
    data = {...data, accountType: ACCOUNT_TYPE.ADMIN};

    //Create Admin
    // console.log(data)
    dispatch(createAdmin(data,token));

    // if(result){
    //   navigate('/dashboard/admin/categories');
    // }

    setLoading(false);
  }

  return (
    <div className='w-11/12 h-auto sm:px-6 mx-auto text-richblack-5 font-inter flex flex-col items-center'>
      <h1 className='p-2 text-4xl font-bold mb-8'>Create Admin</h1>
      <form
        className='w-full max-w-[500px] flex flex-col justify-around'
        onSubmit={handleSubmit(submitHandler)}>
      
        <div
          className='flex flex-col gap-6 bg-richblack-800 p-6 max-sm:px-3 rounded border border-richblack-700'>
          
            {/* Admin name */}
            <div className='flex flex-col w-full'>
                <label htmlFor='name'>
                    <p>Admin Name<sup>*</sup> </p>
                </label>
                <input
                className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                name='name'
                placeholder='Enter Admin Name'
                type='text'
                {...register("name",{
                    required:{
                    value:true,
                    message:"Admin name is required"
                    }
                    })}
                />
        
                {
                errors.name &&
                <span className='mt-1 text-pink-200 text-[12px]'>
                    {errors.name.message}
                </span>
                }
            </div>
          
            {/* Admin email */}
            <div className='flex flex-col w-full'>
                <label htmlFor='email'>
                    <p>Admin Email<sup>*</sup> </p>
                </label>
                <input
                    className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                    name='email'
                    placeholder='Enter Admin Email'
                    type='email'
                    {...register("email",{
                        required:{
                            value:true,
                            message:"Admin email is required"
                        },
                        pattern:{
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid Email Address"
                        }
                    })}
                />
        
                {
                errors.email &&
                <span className='mt-1 text-pink-200 text-[12px]'>
                    {errors.email.message}
                </span>
                }
            </div>
          
            {/* Admin Mobile */}
            <div className='flex flex-col w-full'>
                <label htmlFor='mobile'>
                    <p>Mobile No<sup>*</sup> </p>
                </label>
                <input
                    className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                    name='mobile'
                    placeholder='Enter Mobile No'
                    type='text'
                    {...register("mobile",{
                        required:{
                            value:true,
                            message:"Admin mobile no is required"
                        },
                        pattern:{
                            value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                            message: "Invalid Mobile No"
                        }
                    })}
                />
        
                {
                errors.mobile &&
                    <span className='mt-1 text-pink-200 text-[12px]'>
                        {errors.mobile.message}
                    </span>
                }
            </div>

            {/* Submit Button  */}
            <div className='flex flex-wrap-reverse self-end gap-5'>
                <IconBtn
                text={"Create"}
                disabled={loading}
                >
                    <MdOutlineNavigateNext />
                </IconBtn>
            </div>
        </div>
      </form>
    </div>
  )
}
