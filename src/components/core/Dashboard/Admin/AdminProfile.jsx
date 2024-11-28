import React from 'react'
import { useSelector } from 'react-redux';

const AdminProfile = () => {

    const { user } = useSelector(state => state.profile);

  return (
    <div className='flex flex-col gap-10 w-11/12 text-richblack-5 max-w-[1000px] mx-auto profile'>
        <p className='text-3xl tracking-wide mb-4 font-medium'>My Profile</p>
        
        {/* Section 1 */}
        <section className='flex flex-col justify-between gap-4 bg-richblack-800 p-8 sm:px-12 px-6 rounded-md border border-richblack-700'>
            <div className=' w-full flex max-xmd:flex-col gap-4 xmd:items-center justify-start'>
                <label className='flex flex-col gap-1 xxxs:w-[30%]'>
                    <p className='text-sm text-richblack-600'>Name</p>
                    <p>{user?.name}</p>
                </label>
                
                <label className='flex flex-col gap-1 xmd:w-[30%]'>
                    <p className='text-sm text-richblack-600'>Email</p>
                    <p>{user?.email}</p>
                </label>
            </div>
            <div className='py-6 w-full flex max-xxxs:flex-col gap-4 xxxs:items-center justify-between'>
                <label className='flex flex-col gap-1 xmd:w-[30%]'>
                    <p className='text-sm text-richblack-600'>Phone Number</p>
                    <p>
                        {
                            user && user?.mobile
                            ? user?.mobile
                            : "Add Contact Number" 
                        }
                    </p>
                </label>
            </div>
        </section>
      </div>
  )
}

export default AdminProfile