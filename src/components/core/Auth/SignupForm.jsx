import React from 'react';
import { useState } from 'react';
import instructor from '../../../assets/Images/instructor_login.png';
import signupImg from '../../../assets/Images/signup.webp';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import ApplicantSignup from './ApplicantSignup';
import RecruiterSignup from './RecruiterSignup';
// import { DropDown } from './DropDown';
// import dropDownData from '../../../data/countrycode.json';

export const SignupForm = ({setImage}) => {

    const [accountType,setAccountType] = useState(ACCOUNT_TYPE.APPLICANT);

    function setAccount(e){
        let account = e.target.textContent;
        
        account === ACCOUNT_TYPE.RECRUITER 
        ? setImage(instructor)
        : setImage(signupImg);
        setAccountType(account);
    }
  return (
    <div className='mt-2 flex flex-col' >
        <div className='w-fit flex items-center bg-richblack-800 text-sm text-richblack-200 py-[0.1rem] px-1 rounded-3xl cursor-pointer select-none shadow-[0px_0.6px_0px_0px_#424854]'>
            <div onClick={setAccount}
            className={`py-2 px-5 rounded-2xl  transition-all duration-150
            ${accountType === ACCOUNT_TYPE.APPLICANT
            ?"bg-richblack-900 text-richblack-5"
            :"bg-richblack-800"}`}>{ACCOUNT_TYPE.APPLICANT}</div>

            <div className={`py-2 px-5 rounded-2xl  transition-all duration-150
            ${accountType === ACCOUNT_TYPE.RECRUITER
            ?"bg-richblack-900 text-richblack-5"
            :"bg-richblack-800"}`} onClick={setAccount}>{ACCOUNT_TYPE.RECRUITER}</div>
        </div>
        {
            accountType === ACCOUNT_TYPE?.APPLICANT ? <ApplicantSignup/> : <RecruiterSignup/>
        }
    </div>
  )
}
