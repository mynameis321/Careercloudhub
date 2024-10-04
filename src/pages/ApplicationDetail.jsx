import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { fetchApplicationDetails } from '../services/operations/ApplicationsAPI';
import { useSelector } from 'react-redux';
import { APPLICATION_STATUS, WORK_STATUS } from '../utils/constants';
import Spinner from '../components/common/Spinner';

const ApplicationDetail = () => {

    const {applicationId} = useParams();
    const {token} = useSelector(state => state.auth);
    const [application,setApplication] = useState(null);
    const [loading,setLoading] = useState(false);

    //get complete course details
    useEffect(()=>{

        const getApplicationDetails = async()=>{
            setLoading(true);
            const result = await fetchApplicationDetails(applicationId,token);
            // console.log(result);
            if(result)
                setApplication(result);
            setLoading(false);
        }

        if(applicationId){
            getApplicationDetails();
        }
    },[applicationId]);

    if(loading)
        return <Spinner/>

  return (
    <div >
        {/* Job Details  */}
        <section className='w-11/12 max-w-maxContent mx-auto'>
            <div className='w-full md:w-11/12 lg:max-w-[70%] flex flex-col gap-y-6'>
                {/* Application Status */}
                <p className='flex flex-col gap-y-3 sm:flex-row sm:gap-x-8 sm:items-center'>
                    <span className='font-bold text-3xl'>Application Details</span>
                    <span className={`w-fit px-3 py-[0.1rem] rounded-2xl bg-opacity-25 border
                        ${application?.status !== APPLICATION_STATUS.REJECT  ? (
                                application?.status !== APPLICATION_STATUS.AWAIT ? "bg-caribbeangreen-400 text-caribbeangreen-200 border-caribbeangreen-200" : "bg-yellow-50 text-yellow-5 border-yellow-5"
                            )
                            :"bg-pink-500 text-pink-300 border-pink-300"}
                        `}>
                        {`${application?.status}`}
                    </span>
                </p>
                <div className='flex flex-col gap-y-2 px-5'>
                    {/* Applicant Name */}
                    <div className='flex gap-x-3 items-start'>
                        <p className='font-bold text-yellow-100'>Name: </p>
                        <p className='text-richblack-50'>
                            {`${application?.applicant?.firstName} ${application?.applicant?.lastName}`}
                        </p>
                    </div>
                    {/* Applicant Mobile*/}
                    <div className='flex gap-x-3 items-start'>
                        <p className='font-bold text-yellow-100'>Contact: </p>
                        <p className='text-richblack-50'>
                            {application?.applicant?.mobile}
                        </p>
                    </div>
                    {/* Applicant Email*/}
                    <div className='flex gap-x-3 items-start'>
                        <p className='font-bold text-yellow-100'>Email Address: </p>
                        <p className='text-richblack-50'>
                            {application?.applicant?.email}
                        </p>
                    </div>
                    {/* Applicant Education */}
                    <div className='flex gap-x-3 items-start'>
                        <p className='font-bold text-yellow-100'>Educational Qualification: </p>
                        <p className='text-richblack-50'>
                            {application?.education}
                        </p>
                    </div>
                    
                    {/* Applicant Experience */}
                    <div className='flex gap-x-3 items-start'>
                        <p className='font-bold text-yellow-100'>Work Status: </p>
                        <p className='text-richblack-50'>
                            {application?.workStatus}
                        </p>
                    </div>
                    
                    {/* Applicant current Salary and offer */}
                    {
                        application?.workStatus === WORK_STATUS?.EXPERIENCED &&

                        <div className='flex flex-col gap-y-3'>
                            <div className='flex gap-x-3 items-start'>
                                <p className='font-bold text-yellow-100'>Current Offer: </p>
                                <p className='text-richblack-50'>
                                    {application?.currentOffer}
                                </p>
                            </div>
                            <div className='flex gap-x-3 items-start'>
                                <p className='font-bold text-yellow-100'>Current Salary: </p>
                                <p className='text-richblack-50'>
                                    {application?.currentSalary}
                                </p>
                            </div>
                        </div>
                    }

                </div>                
                {/* Applicant Interview Schedule */}
                {
                    application?.interview &&

                    <div className='flex flex-col gap-y-6'>
                        <p className='font-bold text-2xl'>Interview Schedule</p>
                        <div className='flex flex-col gap-y-2 px-5'>
                            <div className='flex gap-x-3 items-start'>
                                <p className='font-bold text-yellow-100'>Date: </p>
                                <p className='text-richblack-50'>
                                    {application?.interview?.date}
                                </p>
                            </div>
                            <div className='flex gap-x-3 items-start'>
                                <p className='font-bold text-yellow-100'>Timings: </p>
                                <p className='text-richblack-50'>
                                    {application?.interview?.time}
                                </p>
                            </div><div className='flex gap-x-3 items-start'>
                                <p className='font-bold text-yellow-100'>Location: </p>
                                <p className='text-richblack-50'>
                                    {application?.interview?.date}
                                </p>
                            </div>
                        </div>
                    </div>
                }

            </div>
        </section>
    </div>
  )
}

export default ApplicationDetail