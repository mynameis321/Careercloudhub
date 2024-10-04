import React from 'react'
import { useSelector } from 'react-redux';


const RecruiterProfile = () => {

  const { user } = useSelector(state => state.profile);

  return (
      <div className='flex flex-col gap-10 w-11/12 text-richblack-5 max-w-[1000px] mx-auto profile'>
        <p className='text-3xl tracking-wide mb-4 font-medium'>My Profile</p>
        
        {/* Section 3 */}
        <section className='flex flex-col justify-between gap-10 bg-richblack-800 p-8 sm:px-12 px-6 rounded-md border border-richblack-700'>
  
          {/* Heading and Edit BTN */}
          <div className='flex justify-between items-center'>
            <p className='text-lg font-bold'>Company Details</p>
          </div>
          
          {/* Details */}
          <div className='flex flex-col gap-5 max-w-[500px] text-[15px]'>

            <div className=' w-full flex max-xxxs:flex-col gap-4 xxxs:items-center justify-between'>
              
              <label className='flex flex-col gap-2 xxxs:w-[30%]'>
                <p className='text-sm text-richblack-600'>Company Name</p>
                <p>{user?.companyName}</p>
              </label>
              
              <label className='flex flex-col gap-2 xxxs:w-[30%]'>
                <p className='text-sm text-richblack-600'>Company GST No</p>
                <p>{user?.gstNo}</p>
              </label>
            </div>
           
            <div className=' w-full flex max-xmd:flex-col gap-4 xmd:items-center justify-between'>
              <label className='flex flex-col gap-2 xmd:w-[30%]'>
                <p className='text-sm text-richblack-600'>Company Email</p>
                <p>{user?.email}</p>
              </label>
              
              <label className='flex flex-col gap-2 xmd:w-[30%]'>
                <p className='text-sm text-richblack-600'>Company Contact</p>
                <p>
                  {
                    user && user?.mobile
                    ? user?.mobile
                    : "Add Contact Number" 
                  }
                </p>
              </label>
            </div>
            
            <div className='w-full flex max-xmd:flex-col gap-4 xmd:items-center justify-between'>
              <label className='flex flex-col gap-2 xmd:w-[30%]'>
                <p className='text-sm text-richblack-600'>POC Designation</p>
                <p>
                  {
                    user && user?.pocDesignation 
                    ? user?.pocDesignation
                    : "Add Designation"
                  }
                </p>
              </label>
              
              <label className='flex flex-col gap-2 xmd:w-[30%]'>
                <p className='text-sm text-richblack-600'>POC</p>
                <p>
                  {
                    user && user?.poc
                    ? user?.poc
                    : "Add POC" 
                  }
                </p>
              </label>
            </div>

            <div className='w-full flex max-xmd:flex-col gap-4 xmd:items-center justify-between'>
              <label className='flex flex-col gap-2 w-full'>
                <p className='text-sm text-richblack-600'>Address</p>
                <p>
                  {
                    user && user?.address 
                    ? user?.address
                    : "Add Address"
                  }
                </p>
              </label>
            </div>
          </div>
  
        </section>
        
        {/* Section 2 */}
        <section className='flex flex-col justify-between gap-10 bg-richblack-800 p-8 sm:px-12 px-6 rounded-md border border-richblack-700'>
            <div className='flex justify-between items-center'>
              <p className='text-lg font-bold'>Description</p>
            </div>
            <p className='w-[90%]'>
              {
                user?.description != null 
                ? <span>{user?.description}</span>
                : <span className='text-richblack-300 text-[14px] tracking-wide'>
                  Write Something About Yourself
                </span>
              }
            </p>
        </section>

      </div>
  )
}

export default RecruiterProfile;