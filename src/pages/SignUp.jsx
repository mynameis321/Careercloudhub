import React from 'react';
import signupImg from "../assets/Images/frame.png";
import { Template } from '../components/core/Auth/Template';

export const SignUp = () => {
  return (
    <div className='w-11/12 max-w-maxContent mx-auto flex justify-center items-center'>
          <Template
            title="Join the millions talented professionals with CareerCloudHub for free"
            desc1="Explore jobs for today, tomorrow, and beyond."
            desc2="Hire team of future-proof Growth."
            frame={signupImg}
            formtype="signup"
          />
    </div>
  )
}
