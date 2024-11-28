import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../utils/constants';
import { login, validatePassword } from '../services/operations/authAPI';
import {AiOutlineEyeInvisible,AiOutlineEye} from "react-icons/ai";
import { InputField } from '../components/core/Auth/InputField';

const AdminLogin = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [showPassword,setShowPassword] = useState(false);
    const [formData,setFormData] = useState({
        email:"", password:"",accountType:ACCOUNT_TYPE.ADMIN
    })

    function changeHandler(e){
        // console.log(formData)
        setFormData((prev)=>{
           return { 
                ...prev,
                [e.target.name] : e.target.value
            }
        })
    }

    function showPasswordHandler(){
        setShowPassword((prev)=>{return !prev})
    }

    function submitHandler(e){
        e.preventDefault();

        if(!validatePassword(formData))
            return;

        dispatch(login(formData,navigate));
    }

  return (
    <div className='w-screen  overflow-hidden flex items-center justify-center p-10'>
      <section className='w-11/12 max-w-[450px]'>
        <h2 className='text-center p-2 text-3xl font-bold mb-6'>Admin Login</h2>
        <form className='w-full flex flex-col gap-16' onSubmit={submitHandler}>
            <div className='flex flex-col gap-4 w-full'>
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
                    <span>Password<sup>*</sup></span>
                    <InputField
                        name={'password'}
                        type={!showPassword ? "password":"text"}
                        placeholder={'Enter Password'}
                        formData={formData.password}
                        changeHandler={changeHandler}
                        showPassword={showPassword}
                        showPasswordHandler={showPasswordHandler}
                    />
                    <span className={`absolute bottom-[15%] text-richblack-200 text-[20px] right-[5%] cursor-pointer`}
                            onClick={()=>{showPasswordHandler("create",showPassword.create)}}>
                            {showPassword.create === true
                                ?<AiOutlineEyeInvisible />
                                :<AiOutlineEye/>
                            }
                    </span>
                    <Link to={`/forgot-password`}>
                        <p className='absolute text-xs text-[#47A5C5] right-0 leading-8 capitalize'>forgot password</p>
                    </Link>
                </label>
            </div>
            <button type='submit' className='bg-[#FFD60A] text-black font-semibold py-2 rounded-lg'>
                Sign In
            </button>
        </form>
      </section>
    </div>
  )
}

export default AdminLogin