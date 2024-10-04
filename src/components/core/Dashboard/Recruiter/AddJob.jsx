import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, editJobDetails, fetchCategories } from '../../../../services/operations/JobAPI';
import ChipInput from '../../../common/ChipInput';
import Requirements from '../../../common/Requirements';
// import FileUploader from './FileUploader';
import toast from 'react-hot-toast';
import IconBtn from '../../../common/IconBtn';
import { MdOutlineNavigateNext } from "react-icons/md";
import { EMPLOYMENT_TYPE, SHIFT, WORK_STATUS, WORK_TYPE } from '../../../../utils/constants';
import { resetJobState, setJobLoading } from '../../../../slices/jobSlice';
import { useNavigate } from 'react-router-dom';

export const AddJob = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {token} = useSelector(state => state.auth);
  const {user} = useSelector(state => state.profile);
  const {job, editJob, jobLoading} = useSelector(state => state.job)
  const [categories , setCategories] = useState([]);
  const [category,setCategory] = useState("");

  const {

    setValue,
    getValues,
    register,
    handleSubmit,
    reset,
    formState : {errors}

  } = useForm();

  const getCategories = async()=>{
    dispatch(fetchCategories(setCategories));
  }

  useEffect(()=>{
    getCategories();
    
    if(editJob){
      // console.log("edit: ",editCourse,course);
      setValue("role",job?.role);
      setValue("summary",job?.summary);
      setValue("category",job?.category?._id);
      setValue("workStatus",job?.workPreference?.workStatus);
      setValue("employmentType",job?.workPreference?.employmentType);
      setValue("workType",job?.workPreference?.workType);
      setValue("shift",job?.workPreference?.shift);
      setValue("noOfPositions",job?.noOfPositions);
      setValue("salary",job?.salary);
      setValue("responsibilities",job?.responsibilities);
      setValue("requirements",job?.requirements);
      setValue("preferredQualifications",job?.preferredQualifications);
      setValue("skills",job?.skills);
      setValue("benifits",job?.benifits);
      setValue("policies",job?.policies);
      setValue("active",job?.active);
      setCategory(job?.category?._id);
    }

  },[]);
  // console.log("editing: ",getValues());

  const isFormUpdated = ()=>{
    const currentValues = getValues();
    if(   
      currentValues.role !== job?.role ||
      currentValues.summary !== job?.summary ||
      currentValues.category !== job?.category?._id ||
      currentValues.workStatus !== job?.workPreference?.workStatus ||
      currentValues.employmentType !== job?.workPreference?.employmentType ||
      currentValues.workType !== job?.workPreference?.workType ||
      currentValues.shift !== job?.workPreference?.shift ||
      currentValues.noOfPositions !== job?.noOfPositions ||
      currentValues.salary !== job?.salary ||
      currentValues.responsibilities.toString() !== job?.responsibilities.toString() ||
      currentValues.requirements.toString() !== job?.requirements.toString() ||
      currentValues.preferredQualifications.toString() !== job?.preferredQualifications.toString() ||
      currentValues.skills.toString() !== job?.skills.toString() ||
      currentValues.benifits.toString() !== job?.benifits.toString() ||
      currentValues.policies.toString() !== job?.policies.toString() ||
      currentValues.active !== job?.active  
    )
      return true;
    else 
      return false;
  }

  const submitHandler = async(data)=>{
    dispatch(setJobLoading(true));

    if(user && !user?.address || !user?.poc || !user?.pocDesignation){
      dispatch(setJobLoading(false));
        toast.error('User profile not updated');
        return;
    }

    if(editJob){
      if(isFormUpdated()){
        
        const currentValues = getValues();
        let reqBody = {};        
        reqBody = {...reqBody,jobId:job?._id};

        if( currentValues?.role !== job?.role) 
            reqBody = {...reqBody,role:data?.role};

        if( currentValues?.summary !== job?.summary) 
            reqBody = {...reqBody,summary:data?.summary};
        
        if(currentValues?.category !== job?.category?._id) 
            reqBody = {...reqBody,category:data?.category};

        if(currentValues?.workStatus !== job?.workPreference?.workStatuse) 
            reqBody = {...reqBody,workStatus:data?.workStatus};
        
        if(currentValues?.employmentType !== job?.workPreference?.employmentType) 
            reqBody = {...reqBody,employmentType:data?.employmentType}

        if(currentValues?.workType !== job?.workPreference?.workType) 
            reqBody = {...reqBody,workType:data?.workType}

        if(currentValues?.shift !== job?.workPreference?.shift)
            reqBody = {...reqBody,shift:data?.shift}

        if(currentValues?.noOfPositions !== job?.noOfPositions) 
            reqBody = {...reqBody,noOfPositions:data?.noOfPositions}

        if(currentValues?.salary !== job?.salary) 
            reqBody = {...reqBody,salary:data?.salary}

        if(currentValues?.responsibilities?.toString() !== job?.responsibilities.toString())
            reqBody = {...reqBody,responsibilities:JSON.stringify(data?.responsibilities)}
        
        if(currentValues?.requirements?.toString() !== job?.requirements?.toString())
            reqBody = {...reqBody,requirements:JSON.stringify(data?.requirements)}

        if(currentValues?.preferredQualifications?.toString() !== job?.preferredQualifications?.toString())
            reqBody = {...reqBody,preferredQualifications:JSON.stringify(data?.preferredQualifications)}
        
        if(currentValues?.skills?.toString() !== job?.skills.toString())
            reqBody = {...reqBody,skills:JSON.stringify(data?.skills)}
        
        if(currentValues?.benifits?.toString() !== job?.benifits?.toString())
            reqBody = {...reqBody,benifits:JSON.stringify(data?.benifits)}
        
        if(currentValues?.policies?.toString() !== job?.policies.toString())
            reqBody = {...reqBody,policies:JSON.stringify(data?.policies)}
        
        if( currentValues?.active !== job?.active)
            reqBody = {...reqBody,active:data?.active}

        // console.log("updated:",reqBody);

        //Save the changes in backend 
        const result = await editJobDetails(reqBody,token);
        if(result){
          dispatch(resetJobState());
          navigate('/dashboard/recruiter/my-jobs');
        }

      }
      else{
        toast.error("No Changes made so far");
      }
      dispatch(setJobLoading(false));
      return;
    }

    //Create Job
    data = {
      ...data,
      responsibilities: JSON.stringify(data?.responsibilities),
      requirements: JSON.stringify(data?.requirements),
      preferredQualifications: JSON.stringify(data?.preferredQualifications),
      skills: JSON.stringify(data?.skills),
      benifits: JSON.stringify(data?.benifits),
      policies: JSON.stringify(data?.policies),
    };

    // console.log(data)
    const result = await createJob(data,token,navigate);

    if(result){
      navigate('/dashboard/recruiter/my-jobs');
    }

    dispatch(setJobLoading(false));
  }

  return (
    <div className='w-11/12 h-auto sm:px-6 mx-auto text-richblack-5 font-inter flex flex-col items-center'>
      <h1 className='p-2 text-4xl font-bold mb-8'>{!editJob ? "Add Job" : "Edit Job"}</h1>
      <form
        className='w-full max-w-[500px] flex flex-col justify-around'
        onSubmit={handleSubmit(submitHandler)}>
      
        <div
          className='flex flex-col gap-6 bg-richblack-800 p-6 max-sm:px-3 rounded border border-richblack-700'>
          
          {/*Active Status*/}
           <label className='flex gap-x-2 text-lg text-richblack-300 tracking-wide'>
              <input
                  className='bg-transparenta outline-richblack-700 '
                  type='checkbox'
                  disabled={jobLoading}
                  defaultChecked={true}
                  {...register("active")}
              />
              <p>Make the Job Status Active</p>
            </label>
          
          {/* Job Title */}
          <div className='flex flex-col w-full'>
            <label htmlFor='role'>
              <p>Job Title <sup>*</sup> </p>
            </label>
            <input
              className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
              name='role'
              placeholder='Enter Job Title'
              type='text'
              {...register("role",{
                required:{
                  value:true,
                  message:"Job Title is required"
                }
                })}
            />
      
            {
              errors.role &&
              <span className='mt-1 text-pink-200 text-[12px]'>
                {errors.role.message}
              </span>
            }
          </div>
      
          {/* Category */}
          <div className='flex flex-col w-full'>
            <label htmlFor="category">
              <p className='text-[16px]'>Job Category <sup>*</sup> </p>
              <select
                    {...register("category",{
                      required:{
                        value:true,
                        message:"Job category is required"
                      }
                    })}
                    value={category}
                    onChange={(e)=>{setCategory(e.target.value)}}
                    id="category"
                    className="outline-none cursor-pointer mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]"
                  >
                   <option value="" disabled>Choose a Category</option>
                    {!jobLoading &&
                        categories.map(ct=>{
                            return <option key={ct?._id} value={ct?._id}>
                                    {ct?.name}
                                </option>
                        })
                    }
                </select>
                {errors.category && (
                    <span className="mt-1 text-pink-200 text-[12px]">
                      {errors.category.message}
                    </span>
                )}
            </label>
          </div>
      
          <div className='w-full flex gap-3 items-end'>
            {/* Work Status*/}
            <div className='flex flex-col flex-grow'>
              <label htmlFor="workStatus">
                  <p className='text-[16px]'>Experience<sup>*</sup> </p>
                  <select
                          {...register("workStatus",{
                          required:{
                              value:true,
                              message:"Experience is required"
                          }
                          })}
                          defaultValue={WORK_STATUS.EXPERIENCED}
                          id="workStatus"
                          className="outline-none cursor-pointer mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]"
                      >
                          {
                            Object.values(WORK_STATUS).map((ws,index)=>{
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
            {/* Employement Type*/}
            <div className='flex flex-col flex-grow'>
              <label htmlFor="employmentType">
                  <p className='text-[16px]'>Employement Type<sup>*</sup> </p>
                  <select
                          {...register("employmentType",{
                          required:{
                              value:true,
                              message:"Employement Type is required"
                          }
                          })}
                          defaultValue={EMPLOYMENT_TYPE?.FULL}
                          id="employmentType"
                          className="outline-none cursor-pointer mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]"
                      >
                          {
                            Object.values(EMPLOYMENT_TYPE).map((ws,index)=>{
                                return <option key={index} value={ws}>
                                        {ws}
                                    </option>
                            })
                          }
                  </select>
                  {errors.employmentType && (
                      <span className="mt-1 text-pink-200 text-[12px]">
                          {errors.employmentType.message}
                      </span>
                  )}
              </label>
            </div>
          </div>

          <div className='w-full flex gap-3 items-end'>
            {/* Work Type*/}
            <div className='flex flex-col flex-grow'>
              <label htmlFor="workType">
                  <p className='text-[16px]'>Work Type<sup>*</sup> </p>
                  <select
                          {...register("workType",{
                          required:{
                              value:true,
                              message:"Work Type is required"
                          }
                          })}
                          defaultValue={WORK_TYPE.OFFICE}
                          id="workType"
                          className="outline-none cursor-pointer mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]"
                      >
                          {
                            Object.values(WORK_TYPE).map((ws,index)=>{
                                return <option key={index} value={ws}>
                                        {ws}
                                    </option>
                            })
                          }
                  </select>
                  {errors.workType && (
                      <span className="mt-1 text-pink-200 text-[12px]">
                          {errors.workType.message}
                      </span>
                  )}
              </label>
            </div>
            {/* Shift*/}
            <div className='flex flex-col flex-grow'>
              <label htmlFor="shift">
                  <p className='text-[16px]'>Shift<sup>*</sup> </p>
                  <select
                          {...register("shift",{
                          required:{
                              value:true,
                              message:"Shift is required"
                          }
                          })}
                          defaultValue={SHIFT.DAY}
                          id="shift"
                          className="outline-none cursor-pointer mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]"
                      >
                          {
                            Object.values(SHIFT).map((ws,index)=>{
                                return <option key={index} value={ws}>
                                        {ws}
                                    </option>
                            })
                          }
                  </select>
                  {errors.workType && (
                      <span className="mt-1 text-pink-200 text-[12px]">
                          {errors.workType.message}
                      </span>
                  )}
              </label>
            </div>
          </div>
      
          <div className='w-full flex gap-3 items-baseline'>
            {/* Salary */}
            <div className='flex flex-col flex-grow'>
              <label htmlFor="coursePrice">
                <p>Salary</p>
              </label>
              <input
                className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                id='salary'
                placeholder='Enter Salary Offered'
                type='text'
                {...register("salary")}
              />
              {
                errors.salary &&
                <span className='mt-1 text-pink-200 text-[12px]'>
                  {errors.salary.message}
                </span>
              }
            </div>
            {/* No of Positions */}
            <div className='flex flex-col flex-grow'>
              <label htmlFor="noOfPositions">
                <p>No Of Openings<sup>*</sup> </p>
              </label>
              <input
                className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                id='noOfPositions'
                placeholder='Enter No of Openings'
                type='text'
                {...register("noOfPositions",{
                  required:{
                    value:true,
                    message:"Required"
                  },
                  pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message:"Not a Valid number"
                  }
                })}
              />
              {
                errors.noOfPositions &&
                <span className='mt-1 text-pink-200 text-[12px]'>
                  {errors.noOfPositions.message}
                </span>
              }
            </div>
          </div>
          
          {/* Summary */}
          <div className='flex flex-col w-full'>
             <label htmlFor='summary'>
               <p>Job Summary<sup>*</sup> </p>
             </label>
             <textarea
                className='outline-none mt-2 text-richblack-200 w-full min-h-[150px] p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                name='summary'
                placeholder='Enter Job Summary'
                {...register("summary",{
                  required:{
                    value:true,
                    message:"Job Summary is required"
                  }
                  })}
              />
              {
                errors.summary &&
                <span className='mt-1 text-pink-200 text-[12px]'>
                  {errors.summary.message}
                </span>
              }
            </div>
          
          {/* Skills */}
          <ChipInput
            label={<p>Skills <sup>*</sup></p>}
            edit={editJob}
            editData={job?.skills ? job?.skills : []}
            name={"skills"}
            type={"text"}
            placeholder={"Enter Skill and press Enter"}
            register={register}
            errors={errors}
            setValue={setValue}
            require={"Skills"}
          />
      
          {/* Responsibilities */}
          <Requirements
            label={<p>Role & Responsibilities<sup>*</sup></p>}
            edit={editJob}
            editData={job?.responsibilities ? job?.responsibilities : []}
            name={"responsibilities"}
            type={"text"}
            placeholder={"Enter Text and Press Add"}
            register={register}
            errors={errors}
            setValue={setValue}
            require={"Responsibilities"}
          />
          {/* Requirements */}
          <Requirements
            label={<p>Requirements<sup>*</sup></p>}
            edit={editJob}
            editData={job?.requirements ? job?.requirements : []}
            name={"requirements"}
            type={"text"}
            placeholder={"Enter Text and Press Add"}
            register={register}
            errors={errors}
            setValue={setValue}
            require={"Requirements"}
          />
          
          {/* Preferred Qualifications */}
          <Requirements
            label={<p>Preferred Qualifications<sup>*</sup></p>}
            edit={editJob}
            editData={job?.preferredQualifications ? job?.preferredQualifications : []}
            name={"preferredQualifications"}
            type={"text"}
            placeholder={"Enter Text and Press Add"}
            register={register}
            errors={errors}
            setValue={setValue}
            require={"Preferred Qualifications"}
          />
          
          {/* Benifits */}
          <Requirements
            label={<p>Perks & Benifits</p>}
            edit={editJob}
            editData={job?.benifits ? job?.benifits : []}
            name={"benifits"}
            type={"text"}
            placeholder={"Enter Text and Press Add"}
            register={register}
            errors={errors}
            setValue={setValue}
          />
      
          {/* Policies */}
          <Requirements
            label={<p>Company Norms</p>}
            edit={editJob}
            editData={job?.policies ? job?.policies : []}
            name={"policies"}
            type={"text"}
            placeholder={"Enter Text and Press Add"}
            register={register}
            errors={errors}
            setValue={setValue}
          />
          <div className='flex flex-wrap-reverse self-end gap-5'>
              <IconBtn
              text={!editJob ? "Create" : "Save Changes"}
              disabled={jobLoading}
              >
              <MdOutlineNavigateNext />
              </IconBtn>
          </div>
        </div>
      </form>
    </div>
  )
}
