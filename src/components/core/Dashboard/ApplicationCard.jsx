import React from 'react'
import { ACCOUNT_TYPE, APPLICATION_STATUS, WORK_STATUS } from '../../../utils/constants'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { formattedDate } from '../../../utils/dateFormatter';
import { updateApplicationStatus } from '../../../services/operations/ApplicationsAPI';
import { useForm } from 'react-hook-form';

const ApplicationCard = ({application,updateApplication,path}) => {

    const navigate = useNavigate();
    const {token} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.profile);

    const {
        register,
        handleSubmit,
    } = useForm();
    const handleNavigate = (e)=>{
        e.preventDefault();
        navigate(path);
    }
    // console.log(user, ACCOUNT_TYPE.RECRUITER)

    const updateStatus = async(data)=>{
        // if(data.status === APPLICATION_STATUS.SHORTLIST){
            
        // }
        // if(data.status === APPLICATION_STATUS.HIRE){

        // }
        // if(data.status === APPLICATION_STATUS.REJECT){

        // }

        data = {...data,applicationId: application?._id};

        const result = await updateApplicationStatus(data,token);
        if(result){
            updateApplication(result);
        }
    }

  return (
        <div onClick={handleNavigate}
            className='cursor-pointer flex flex-col gap-y-5 select-none border p-3 py-4 sm:p-5 rounded-md w-full h-full'>
            <div className='flex flex-col gap-y-2'>
                {/*Application Title */}
                <p className='text-2xl font-bold'>
                    {
                        user?.accountType === ACCOUNT_TYPE.APPLICANT
                        ? `${application?.job?.role}`
                        : `${application?.applicant?.firstName} ${application?.applicant?.lastName}`
                    }
                </p>
                
                <div className='flex gap-x-2 items-end mb-2'>
                    {/* Work Status */}
                    <p className={`px-3 py-[0.1rem] rounded-xl bg-opacity-30 text-sm
                        ${
                            application?.job?.workPreference?.workStatus === WORK_STATUS.ALL ||
                            application?.job?.workPreference?.workStatus === application?.workStatus
                            ? "bg-caribbeangreen-400 text-caribbeangreen-200" : "bg-pink-500 text-pink-300"
                    }`}>
                            {`${
                                user?.accountType !== ACCOUNT_TYPE?.APPLICANT
                                ? application?.job?.workPreference?.workStatus
                                : application?.workStatus
                            }`}    
                    </p>

                    {/* Education */}
                    <p className='px-3 py-[0.1rem] rounded-xl bg-opacity-30 text-sm bg-yellow-200 text-yellow-50'>
                        {application?.education}
                    </p>
                </div>                
                
                {/* Description */}
                {
                    user?.accountType === ACCOUNT_TYPE.RECRUITER &&
                    (<p className='text-richblack-25'>
                        {application?.applicant?.description}
                        {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia repudiandae, aliquid error excepturi amet ad qui quas deserunt, tempora nulla eligendi numquam nemo hic at pariatur nisi dolor. Aperiam, laborum. */}
                    </p>)
                }
                {
                    user?.accountType === ACCOUNT_TYPE.APPLICANT &&
                    <p className='text-richblack-25'>
                        {application?.job?.summary}
                    </p>
                }

                {/* Applicant Skills  */}
                <div className='flex items-center gap-2 flex-wrap'>
                    {
                        application?.skills?.map((sk,index) => (
                        <span className='text-yellow-25' key={index}>{sk}</span>
                        ))
                    }
                </div>

                {/* Applied At */}
                <p className='text-sm text-richblack-50'>{
                    user?.accountType === ACCOUNT_TYPE?.APPLICANT ? "Applied on " : "Received on "
                }{formattedDate(application?.createdAt)}</p>

                {/* Application Footer */}
                <div onClick={e => e.stopPropagation()}
                    className='flex flex-col md:flex-row md:items-baseline  gap-4 flex-wrap pr-4 mt-3'>
                    {/* Update Status Form */}
                    <form className='flex-grow flex gap-x-4 flex-wrap' 
                        onSubmit={handleSubmit(updateStatus)}>     
                        {
                            user?.accountType !== ACCOUNT_TYPE?.RECRUITER 
                            ? (<p className={` p-3 py-2 text-richblack-100 border bg-opacity-40 text-sm hover:text-richblack-25`}>
                                    {`${application?.status}`}
                                </p>)

                            :(
                            <select className={` p-3 py-2 bg-richblack-800 text-richblack-100 border bg-opacity-40 text-sm hover:text-richblack-25`}
                                defaultValue={application?.status}
                                {...register('status',{
                                    required: true
                                })}
                            >
                                {
                                    Object.values(APPLICATION_STATUS).map((st,index) => (
                                        <option className='bg-richblack-800' key={index}>{st}</option>
                                    ))
                                }
                            </select>)
                        }
                        {
                            user?.accountType === ACCOUNT_TYPE?.RECRUITER &&
                            <button type='submit' className='px-3 py-2 bg-[#4078c0] bg-opacity-80 hover:opacity-80 duration-100'>
                                Update Status
                            </button>
                        }
                    </form>
                    {/* Applicant Links */}
                    <div className='flex items-baseline justify-start md:justify-end gap-x-3 flex-grow'>
                        <p className='px-3 py-2 rounded-sm bg-[#FF0000] bg-opacity-80 font-bold text-richblack-5 text-sm flex-wrap hover:opacity-80 duration-100'>
                            <a target="_blank" href={application?.resume}>Resume</a>
                        </p>
                        <p className='px-3 py-2 rounded-sm bg-[#0072b1] bg-opacity-80 font-bold text-richblack-5 text-sm hover:opacity-80 duration-100'>
                            <a target="_blank" href={application?.linkedIn}>LinkedIn</a>
                        </p>
                        {
                            application?.portfolio &&
                            <p className='px-3 py-2 rounded-sm bg-caribbeangreen-200 bg-opacity-80 font-bold text-richblack-5 text-sm hover:opacity-80 duration-100'>
                                <a target="_blank" href={application?.portfolio}>Portfolio</a>
                            </p>
                        }
                    </div>
                </div>
                {/* <div></div> */}
            </div>
        </div>
  )
}

export default ApplicationCard