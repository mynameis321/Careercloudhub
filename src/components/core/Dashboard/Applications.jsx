import React from 'react'
import ApplicationCard from './ApplicationCard'
import { useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from '../../../utils/constants';

const Applications = ({applications,setApplications}) => {

    const {user} = useSelector(state => state.profile); 
    
    const updateApplication = (application)=>{
        const currentApplicationIndex = applications.findIndex(ap => ap?._id === application?._id);
        applications[currentApplicationIndex] = application;
        setApplications(applications);
    }

  return (
    <div className='flex flex-wrap gap-x-8 items-center w-full h-full'>
        {
            applications && applications.length ? <>
                <div className='flex flex-col gap-y-8 items-center'>
                    {
                        applications.map(ap => (
                            <div key={ap?._id} className='w-full max-w-[650px]'>
                                <ApplicationCard application={ap} updateApplication={updateApplication} path={
                                    user && user.accountType === ACCOUNT_TYPE.APPLICANT
                                    ? `/jobs/${ap?.job?._id}` 
                                    : `/dashboard/recruiter/application/${ap?._id}`
                                } key={ap?._id}/>
                            </div>
                        ))
                    }
                </div>
            </>
            :<p className='w-full text-center text-richblack-100 my-10'>No Applications Yet</p>
        }
    </div>
  )
}

export default Applications