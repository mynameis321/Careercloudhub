import React from 'react';
import { Template } from '../components/core/Auth/Template';
import loginImg from "../assets/Images/frame.png";

export const Login = () => {
  return (
    <div className='w-11/12 max-w-maxContent mx-auto flex justify-center items-center'>
      <section>
        <Template
          title="Welcome Back"
          desc1="Explore jobs for today, tomorrow, and beyond."
          desc2="Hire team of future-proof Growth."
          frame={loginImg}
          formtype="login"
        />
      </section>
    </div>
  )
}
