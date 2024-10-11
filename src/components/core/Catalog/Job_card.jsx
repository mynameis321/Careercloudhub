import { Link, useLocation } from 'react-router-dom'
import {formattedDate} from '../../../utils/dateFormatter'
import { deleteJobByRecruiter } from '../../../services/operations/JobAPI';
import { useSelector } from 'react-redux';

export const Job_card = ({job,deleteJob,path}) => {
  
  const location = useLocation();
  const {token} = useSelector(state => state.auth);

  const deleteJobById = async(jobId)=>{
    const result = await deleteJobByRecruiter({jobId},token);
    deleteJob(jobId);
  }

  return (
      path ? (
        <Link to={path}>
          <div className='cursor-pointer flex flex-col gap-y-5 select-none border p-3 rounded-md h-full'>
            <div className='flex flex-col gap-y-2'>
              <p className='text-xl font-semibold'>{job && job?.role}</p>
              {/* <p className='text-richblack-200'>
                {job && `${job?.company?.companyName}`}
              </p> */}
              <div className='flex gap-2 items-center tracking-wide'>
                <p className='text-richblack-25'>{`${job?.workPreference?.workStatus}`}</p>
                <p className='text-richblack-25'>{`${job?.workPreference?.employmentType}`}</p>
              </div>
              <div className='flex items-center gap-2 flex-wrap'>
                {
                  job?.skills?.slice(0,4).map((sk,index) => (
                    <span className='text-yellow-25' key={index}>{sk}</span>
                  ))
                }
              </div>
              <p className='text-sm text-richblack-50'>Posted on {formattedDate(job?.createdAt)}</p>
              <div className='flex items-baseline gap-x-3 flex-wrap pr-4 mt-2'>
                <p className={` px-3 py-[0.1rem] rounded-xl bg-opacity-40 text-sm
                    ${job?.active ? "bg-caribbeangreen-400 text-caribbeangreen-200"
                                  :"bg-pink-500 text-pink-300"}
                  `}>
                  {`${job?.active ? "Active" : "Expired"}`}
                </p>
                {
                  location.pathname === '/dashboard/recruiter/my-jobs' && 
                  <div className='flex gap-x-3 items-center'>
                    <Link to={`/dashboard/recruiter/edit-job/${job?._id}`}>
                      <button className='text-sm text-richblack-200 hover:text-caribbeangreen-200 duration-100 p-1'>
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        deleteJobById(job?._id)
                      }}
                     className='text-sm text-richblack-200 hover:text-pink-300 duration-100 p-1'>
                      Delete
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </Link>
      )
      :(
        <div className='flex flex-col gap-y-5 select-none border p-3 rounded-md h-full'>
          <div className='flex flex-col gap-y-2'>
            <p className='text-lg'>{job && job?.role}</p>
            {/* <p className='text-richblack-200'>
              {job && `${job?.company?.companyName}`}
            </p> */}
            <div className='flex gap-3 items-center tracking-wide'>
              <p className='text-richblack-25'>{`Open for ${job?.workPreference?.workStatus}`}</p>
              <p className='text-richblack-25'>{`${job?.workPreference?.employmentType}`}</p>
            </div>
            <div className='flex items-center gap-2 flex-wrap'>
              {
                job?.skills?.slice(0,3).map((sk,index) => (
                  <span className='text-yellow-25' key={index}>{sk}</span>
                ))
              }
            </div>
            <p className='text-sm text-richblack-50'>Posted on {formattedDate(job?.createdAt)}</p>
            <div className='flex items-baseline gap-x-3 flex-wrap pr-4 mt-2'>
              <p className={` px-3 py-[0.1rem] rounded-xl bg-opacity-40 text-sm
                  ${job?.active ? "bg-caribbeangreen-400 text-caribbeangreen-200"
                                :"bg-pink-500 text-pink-300"}
                `}>
                {`${job?.active ? "Active" : "Expired"}`}
              </p>
              {
                location.pathname === '/dashboard/recruiter/my-jobs' && 
                <div className='flex gap-x-3 items-center'>
                  <Link to={`/dashboard/recruiter/edit-job/${job?._id}`}>
                    <button className='text-sm text-richblack-200 hover:text-caribbeangreen-200 duration-100 p-1'>
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={e => {
                      e.preventDefault();
                      deleteJobById(job?._id);
                    }}
                    className='text-sm text-richblack-200 hover:text-pink-300 duration-100 p-1'>
                    Delete
                  </button>
                </div>
              }
            </div>
          </div>
      </div>
      )
  )
}
