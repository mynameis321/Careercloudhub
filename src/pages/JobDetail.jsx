import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobDetails } from '../services/operations/JobAPI'
import { LuAlertCircle } from "react-icons/lu";
import { formatDate } from '../services/formatDate'
// import { MdOutlineLanguage } from "react-icons/md";
import IconBtn from '../components/common/IconBtn';
// import { addCart, removeCart } from '../slices/cartSlice';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { ACCOUNT_TYPE, WORK_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';
import { FaShareFromSquare } from "react-icons/fa6";
import copy from 'copy-to-clipboard';
import { MdPlayArrow } from "react-icons/md";
import Footer from '../components/common/Footer'
import Spinner from '../components/common/Spinner'

export const JobDetail = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {jobId} = useParams();
    const {token} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.profile);
    const {cart} = useSelector(state => state.cart);

    const [isActive , setIsActive] = useState([]);//open sections
    const [jobData,setJobData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [confirmationModal,setConfirmationModal] = useState(null);

    //get complete Job details
    useEffect(()=>{

        const getJobDetails = async()=>{
            const result = await fetchJobDetails(jobId);
            if(result)
                setJobData(result);
        }

        getJobDetails();
    },[jobId]);

    const isTrue = ()=>{
        return jobData?.applications?.some(ap => ap?.applicant === user?._id);
    }

    // const inCartTrue = ()=>{
    //     return cart.some(course => course?._id === courseData?._id);
    // }

    //buy course
    // const handleBuyCourse = ()=>{
    //     if(token){
    //         BuyCourse([courseId],user,token,dispatch,navigate);
    //     }
    // }

    //handle cart
    // const handleCart = ()=>{
    //     setLoading(true);
        
    //     if(inCartTrue()){
    //         dispatch(removeCart(courseData));
    //         setLoading(false);
    //         return;
    //     }
        
    //     if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
    //         toast.error("You Are Instructor. You Can't Buy Course"); 
    //         setLoading(false);
    //         return;
    //     }
        

    //     if(token)
    //         dispatch(addCart(courseData));
    //     else
    //         setConfirmationModal({
    //             text1:"You are not logged in!",
    //             text2:"Please login to Purchase Course.",
    //             btnText1:"Login",
    //             btnText2:"Cancel",
    //             btnHandler1:()=>{navigate('/login')},
    //             btnHandler2:()=>{setConfirmationModal(null)}
    //         });
    //     setLoading(false);
    // }

    //share course
    const handleShare = ()=>{
        //getting current url from window class and location object and 
        //sending it to copy function of react copy to clipboard function 
        copy(window.location.href);
        toast.success("Link Copied");
    }

    //submit handler for buy button in form
    const handleApplyJob = (e)=>{
        e.preventDefault();
        
        setLoading(true);

        //not logged in user
        if(!token){
            setConfirmationModal({
                text1:"You are not logged in!",
                text2:"Please login to Apply.",
                btnText1:"Login",
                btnText2:"Cancel",
                btnHandler1:()=>{navigate('/login')},
                btnHandler2:()=>{setConfirmationModal(null)}
            });
            setLoading(false);
            return;
        }
        
        //Job expired 
        if(!jobData?.active){
            setLoading(false);
            toast.error('Not Accepting Applications');
            return;
        }

        //Not an Applicant 
        if(user?.accountType !== ACCOUNT_TYPE.APPLICANT){
            setLoading(false);
            toast.error("User must be an Applicant");
            return;
        }

        //if already enrolled
        if(isTrue()){
            navigate('/dashboard/applicant/my-applications');
            return;
        }

        if(!user?.firstName || !user?.lastName || !user?.mobile || !user?.description){
            setLoading(false);
            toast.error("User must update profile");
            return;
        }

        //work preference does not match (in future scoop or phase 2)
        if(user?.workPreference?.workStatus){
            if(jobData?.workPreference?.workStatus !== WORK_STATUS.ALL && 
                jobData?.workPreference?.workStatus !== user?.workPreference?.workStatus)
                {
                    setLoading(false);
                    toast.error(`Not eligible. Only available for ${jobData?.workPreference?.workStatus}`)
                    return;
                }
        }

        navigate(`/applicant/apply/${jobId}`)

        // handleBuyCourse();
        setLoading(false);
    }

    if(!jobData || loading)
        return <Spinner/>

    return (
        <div >
            {/* Job and Compny Information */}
            <section className='bg-richblack-800'>
              
                <div className='relative w-11/12 max-w-maxContent mx-auto'>         
                    
                    <div className='w-full py-12 flex flex-col items-center lg:flex-row lg:justify-between lg:gap-x-8 gap-y-8'>
                        {/* Job Title and basic details */}
                        <div className='py-6 text-lg text-richblack-25 w-full md:w-11/12 lg:max-w-[65%] flex flex-col gap-4'>
                        
                            {/* path */}
                            <p className='text-richblack-300 text-base tracking-wide'>
                                {`Home / Jobs / `}
                                <span className='text-yellow-50'>
                                    {` ${jobData?.category?.name}`}
                                </span>
                            </p>
                        
                            {/* Role  */}
                            <p className='text-4xl text-richblack-5 font-bold'>
                                {jobData?.role}
                            </p>
                        
                            {/* Short Company Details */}
                            <div className='flex flex-col gap-y-2'>
                                {/* <p className='text-richblack-300 text-lg'>
                                    {jobData?.company?.companyName}
                                </p> */}
                                {/* <p className='text-richblack-300 text-lg'>
                                    {jobData?.company?.address}
                                </p> */}
                                <div className='flex gap-x-2 items-center text-richblack-300 text-lg'>
                                    <LuAlertCircle />
                                    <span> Posted on</span>
                                    <span>{formatDate(jobData?.createdAt)}</span>
                                </div>
                                <div className='flex gap-x-1 items-center text-richblack-300 text-lg'>
                                    <span> No of Oppenings:</span>
                                    <span>{jobData?.noOfPositions}</span>
                                </div>
                            </div>
                        </div>

                        {/* Apply and Share button */}
                        <div className='p-6 w-full md:w-11/12 lg:w-auto lg:place-self-end lg:flex-grow flex flex-col md:flex-row-reverse md:justify-between lg:flex-col gap-y-3 bg-richblack-900 border border-richblack-700 rounded-xl'>
                            {/* Cart and Purchase */}
                            <form className='flex-grow' onSubmit={handleApplyJob}>
                        
                                {
                                    // !isTrue() &&
                                    // <button
                                    //     className='cursor-pointer p-2 px-5 bg--50 font-bold rounded-md bg-richblack-800 text-richblack-5 w-full'
                                    //     type='button'
                                    //     disabled={loading}
                                    //     onClick={handleCart}
                                    // >
                                    //     {
                                    //         !inCartTrue() ? "Add To Cart" : "Remove From Cart"
                                    //     }
                                    // </button>
                                }
                                <IconBtn
                                    type={'submit'}
                                    disabled={loading || isTrue()}
                                    text={jobData?.active ? (isTrue() ? "Applied" : "Apply"):"Closed"}
                                    customClasses={'w-full my-3'}
                                />
                            </form>
                        
                                {/* Share Button */}
                                <button
                                className='cursor-pointer font-medium flex-grow rounded-md text-yellow-50 lg:w-full flex gap-x-2 items-center justify-center'
                                type='button'
                                onClick={handleShare}
                            >
                                <FaShareFromSquare />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Details  */}
            <section className='w-11/12 max-w-maxContent mx-auto'>
                <div className='w-full py-10 flex flex-col items-center lg:flex-row-reverse lg:justify-between lg:gap-x-[5.4rem] gap-y-8'>
                    {/* Floating Job Details Box */}
                    <div className='w-full md:w-11/12 lg:w-auto lg:self-start lg:flex-grow flex gap-y-3 border sm:gap-x-2 border-richblack-700 p-6 rounded-b-md'>
                        <div className='flex flex-col gap-y-2 flex-grow'>
                            <div className='flex lg:flex-col sm:flex-row flex-col justify-around gap-y-2'>
                                <p className='text-richblack-200'>Open for {jobData?.workPreference?.workStatus}</p>
                                <p className='text-richblack-200'>{jobData?.workPreference?.employmentType}</p>
                            </div>
                            <div className='flex lg:flex-col sm:flex-row flex-col justify-around gap-y-2'>
                                <p className='text-richblack-200'>{jobData?.workPreference?.workType}</p>
                                <p className='text-richblack-200'>{jobData?.workPreference?.shift}</p>
                            </div>
                        </div>
                        <div className='flex sm:flex-col gap-3 sm:items-center flex-grow'>
                            <p className='text-richblack-200'>Applied</p>
                            <p className='font-bold'>{`${jobData?.applications?.length} `}</p>
                        </div>
                    </div>

                    <div className='w-full md:w-11/12 lg:max-w-[60%] border border-richblack-700'>
                        {/* About Company  */}
                        <div className='p-6 flex flex-col gap-y-3 '>
                            <p className='text-3xl font-bold'>About Company</p>
                            <p className='text-richblack-50 '>
                                {jobData?.company?.description}
                            </p>
                        </div>
                        
                        {/* Job Summary  */}
                        <div className='p-6 flex flex-col gap-y-3 '>
                            <p className='text-3xl font-bold'>Job Summary</p>
                            <p className='text-richblack-50 '>
                                {jobData?.summary}
                            </p>
                        </div>

                        {/*Responsibilities */}
                        <div className='p-6 flex flex-col gap-y-3 '>
                            <p className='text-3xl font-bold'>Responsibilities</p>
                            <div className='text-richblack-50 flex flex-col gap-y-2'>
                                {
                                    jobData && jobData?.responsibilities?.map((str,index)=>(
                                        <p 
                                            key={index}
                                            className='flex gap-x-3 text-richblack-50 items-start'
                                        >
                                            <span>{<MdPlayArrow />}</span>
                                            <span>{str}</span>
                                        </p>
                                    ))
                                }
                            </div>
                        </div>

                        {/*Requirements */}
                        <div className='p-6 flex flex-col gap-y-3 '>
                            <p className='text-3xl font-bold'>Requirements</p>
                            <div className='text-richblack-50 flex flex-col gap-y-2'>
                                {
                                    jobData && jobData?.requirements?.map((str,index)=>(
                                        <p 
                                            key={index}
                                            className='flex gap-x-3 text-richblack-50 items-start'
                                        >
                                            <span>{<MdPlayArrow />}</span>
                                            <span>{str}</span>
                                        </p>
                                    ))
                                }
                            </div>
                        </div>

                        {/*Preferred Qualificaions */}
                        <div className='p-6 flex flex-col gap-y-3 '>
                            <p className='text-3xl font-bold'>Preferred Qualifications</p>
                            <div className='text-richblack-50 flex flex-col gap-y-2'>
                                {
                                    jobData && jobData?.preferredQualifications?.map((str,index)=>(
                                        <p 
                                            key={index}
                                            className='flex gap-x-3 text-richblack-50 items-start'
                                        >
                                            <span>{<MdPlayArrow />}</span>
                                            <span>{str}</span>
                                        </p>
                                    ))
                                }
                            </div>
                        </div>

                        {/*Skills */}
                        <div className='p-6 flex flex-col gap-y-3 '>
                            <p className='text-3xl font-bold'>Skills Required</p>
                            <div className='text-richblack-50 flex gap-x-3 flex-wrap'>
                                {
                                    jobData && jobData?.skills?.map((str,index)=>(
                                        <p 
                                            key={index}
                                            className='flex gap-x-1 text-richblack-50 items-center'
                                        >
                                            <span>{<MdPlayArrow />}</span>
                                            <span>{str}</span>
                                        </p>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Benifits */}
                        {
                            jobData && jobData?.benifits && jobData?.benifits?.length > 0 && 
                            <div className='p-6 flex flex-col gap-y-3'>
                                <p className='text-3xl font-bold'>Perks and Benifits </p>
                                {
                                    jobData?.benifits?.map((str,index) =>(
                                        <p 
                                            key={index}
                                            className='flex gap-x-3 text-richblack-50 items-start'
                                        >
                                            <span>{<MdPlayArrow />}</span>
                                            <span>{str}</span>
                                        </p>
                                    ))
                                }
                            </div>
                        }
                        
                        {/* Policies */}
                        {
                            jobData && jobData?.policies && jobData?.policies?.length > 0 && 
                            <div className='p-6 flex flex-col gap-y-3'>
                                <p className='text-3xl font-bold'>Company Policies </p>
                                {
                                    jobData?.policies?.map?.((str,index) =>(
                                        <p 
                                            key={index}
                                            className='flex gap-x-3 text-richblack-50 items-start'
                                        >
                                            <span>{<MdPlayArrow />}</span>
                                            <span>{str}</span>
                                        </p>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>
            </section>

            <Footer/>
            {   
                confirmationModal &&
                <ConfirmationModal
                    modalData={confirmationModal}
                />
            }
        </div>
    )
}
