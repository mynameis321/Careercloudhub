import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ChipInput from '../components/common/ChipInput';
// import FileUploader from './FileUploader';
import toast from 'react-hot-toast';
import { WORK_STATUS } from '../utils/constants';
import IconBtn from '../components/common/IconBtn';
import { MdOutlineNavigateNext } from "react-icons/md";
import {Applicants} from '../data/dummy';
import { submitJobApplication } from '../services/operations/ApplicationsAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobDetails } from '../services/operations/JobAPI';
import { setJob } from '../slices/jobSlice';
export const ApplyJob = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {jobId} = useParams();
  const {token} = useSelector(state => state.auth);
  const {job} = useSelector(state => state.job)
  const [loading, setLoading] = useState(false);
  
  // console.log(job)
  const {

    setValue,
    getValues,
    register,
    handleSubmit,
    reset,
    watch,
    formState : {errors}

  } = useForm();

  useEffect(()=>{
    const getJobDetails = async()=>{
      const result = await fetchJobDetails(jobId);
      if(result)
          dispatch(setJob(result));
    }

    getJobDetails();
  },[jobId]);


  const submitHandler = async(data)=>{
    setLoading(true);

    // console.log(data)
    //apply job 
    const formData = new FormData();
    formData.append("jobId",job?._id);
    formData.append("companyId",job?.company?._id);
    formData.append("education",data?.education);
    formData.append("workStatus",data?.workStatus);
    formData.append("currentOffer",data?.currentOffer);
    formData.append("currentSalary",data?.currentSalary);
    formData.append("resume",data?.resume);
    formData.append("linkedIn",data?.linkedIn);
    formData.append("portfolio",data?.portfolio);
    formData.append("coverLetter",data?.coverLetter);
    formData.append("skills",JSON.stringify(data?.skills));

    const result = await submitJobApplication(formData,token,navigate);
    // console.log("result: ",result);
    // if(result){
    //   dispatch(setCourse(result));
    //   dispatch(setStep(2));
    // }

    setLoading(false);
    // console.log("step: ",step);
  }

  return (
    <div className='w-11/12 h-auto px-6 py-8 mx-auto text-richblack-5 font-inter flex flex-col items-center'>
      <h1 className='p-2 text-4xl font-bold mb-8'>Apply Now</h1>
      <form
        className='w-full max-w-[500px] flex flex-col justify-around'
        onSubmit={handleSubmit(submitHandler)}>
      
        <div
          className='flex flex-col gap-6 bg-richblack-800 p-6 max-sm:px-3 rounded border border-richblack-700'>
          {/* Education */}
          <div className='flex flex-col w-full'>
            <label htmlFor='education'>
              <p>Highest Qualifiction <sup>*</sup> </p>
            </label>
            <input
              className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
              name='education'
              placeholder='Enter Qualifiction'
              type='text'
              {...register("education",{
                required:{
                  value:true,
                  message:"Qualification is required"
                }
                })}
            />
      
            {
              errors.education &&
              <span className='mt-1 text-pink-200 text-[12px]'>
                {errors.education.message}
              </span>
            }
          </div>
      
          {/* Work Status*/}
          <div className='flex flex-col w-full'>
            <label htmlFor="workStatus">
              <p className='text-[16px]'>Experience<sup>*</sup> </p>
              <select
                      {...register("workStatus",{
                      required:{
                          value:true,
                          message:"Experience is required"
                      }
                      })}
                      defaultValue={job?.workPreference?.workStatus}
                      id="workStatus"
                      className="outline-none cursor-pointer mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]"
                  >
      
                      {!loading &&
                          Object.values(WORK_STATUS).slice(0,3).map((ws,index)=>{
                              return <option key={index} value={ws}>
                                      {ws}
                                  </option>
                          })
                      }
                </select>
                {errors.workStatus && (
                    <span className="mt-1 text-pink-200 text-[12px]">
                      {errors.workStatus.message}
                    </span>
                )}
            </label>
          </div>
      
          {/* Current Offer */}
          <div className='flex flex-col w-full'>
            <label htmlFor='currentOffer'>
              <p>Current Offer</p>
            </label>
            <input
              className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
              name='currentOffer'
              placeholder='Current Offer'
              type='text'
              {...register("currentOffer",{
                required:watch('workStatus') === WORK_STATUS.EXPERIENCED ? "Required" : false
                })}
            />
      
            {
              errors.currentOffer &&
              <span className='mt-1 text-pink-200 text-[12px]'>
                {errors.currentOffer.message}
              </span>
            }
          </div>
      
          {/* Current Salary */}
          <div className='flex flex-col w-full'>
            <label htmlFor='currentSalary'>
              <p>Current Salary</p>
            </label>
            <input
              className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
              name='currentSalary'
              placeholder='Current Salary'
              type='text'
              {...register("currentSalary",{
                required:watch('workStatus') === WORK_STATUS.EXPERIENCED ? "Required" : false
                })}
            />
      
            {
              errors.currentSalary &&
              <span className='mt-1 text-pink-200 text-[12px]'>
                {errors.currentSalary.message}
              </span>
            }
          </div>

          {/* Skills */}
          <ChipInput
            label={<p>Skills <sup>*</sup></p>}
            name={"skills"}
            type={"text"}
            placeholder={"Enter Skill and press Enter"}
            register={register}
            errors={errors}
            setValue={setValue}
          />
          {/* Thumbanil Upload */}
          {/* <FileUploader
            label={"Thumbnail"}
            name={"thumbnail"}
            register={register}
            errors={errors}
            setValue={setValue}
            editData={editCourse ? course?.thumbnail : null}
          /> */}

        {/* Resume */}
        <div className='flex flex-col w-full'>
          <label htmlFor='resume'>
            <p>Resume Link <sup>*</sup> </p>
          </label>
          <input
            className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
            name='resume'
            placeholder='Link'
            type='text'
            {...register("resume",{
              required:{
                value:true,
                message:"Resume Link is required"
              }
              })}
          />
    
          {
            errors.resume &&
            <span className='mt-1 text-pink-200 text-[12px]'>
              {errors.resume.message}
            </span>
          }
        </div>

        {/* LinkedIn */}
        <div className='flex flex-col w-full'>
          <label htmlFor='linkedIn'>
            <p>LinkedIn Profile Link <sup>*</sup> </p>
          </label>
          <input
            className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
            name='linkedIn'
            placeholder='Link'
            type='text'
            {...register("linkedIn",{
              required:{
                value:true,
                message:"LinkedIn profile Link is required"
              }
              })}
          />
    
          {
            errors.linkedIn &&
            <span className='mt-1 text-pink-200 text-[12px]'>
              {errors.linkedIn.message}
            </span>
          }
        </div>

        {/* Portfolio */}
        <div className='flex flex-col w-full'>
          <label htmlFor='portfolio'>
            <p>Portfolio Link</p>
          </label>
          <input
            className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
            name='portfolio'
            placeholder='Link'
            type='text'
            {...register("portfolio")}
          />
    
          {
            errors.portfolio &&
            <span className='mt-1 text-pink-200 text-[12px]'>
              {errors.portfolio.message}
            </span>
          }
        </div>
                  
        {/* Cover Letter */}
        <div className='flex flex-col w-full'>
            <label htmlFor='coverLetter'>
              <p>Cover Letter</p>
            </label>
            <textarea
              className='outline-none mt-2 text-richblack-200 w-full min-h-[150px] p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
              name='coverLetter'
              placeholder='Enter Cover Letter'
              {...register("coverLetter")}
            />
            {
              errors.coverLetter &&
              <span className='mt-1 text-pink-200 text-[12px]'>
                {errors.coverLetter.message}
              </span>
            }
          </div>

        <div className='flex flex-wrap-reverse self-end gap-5'>
          <IconBtn
            text={"Apply"}
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
