import React from 'react';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from '../../../../utils/constants';
import ApplicantProfileForm from '../Applicant/ApplicantProfileForm';
import RecruiterProfileForm from '../Recruiter/RecruiterProfileForm';

const UpdateProfileSection = () => {

    const {user} = useSelector(state =>  state.profile);

  return (
    <div>
       {
        user?.accountType === ACCOUNT_TYPE.APPLICANT 
        ? <ApplicantProfileForm/>
        :(
            user?.accountType === ACCOUNT_TYPE.RECRUITER
            ? <RecruiterProfileForm/> : <></>
        )
       }
    </div>
  )
}

export default UpdateProfileSection;