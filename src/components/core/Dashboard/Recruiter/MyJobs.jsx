import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCaJobsByRecruiter } from '../../../../services/operations/JobAPI';
import { Job_card } from '../../Catalog/Job_card';
import Spinner from '../../../common/Spinner';

const MyJobs = () => {
    
    const {token} = useSelector(state => state.auth);
    const [jobs,setJobs] = useState([]);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        const fetchJobs = async()=>{
            setLoading(true);
            const result = await fetchCaJobsByRecruiter(token);
            if(result){
                setJobs(result);
            }
            setLoading(false);
        }
        fetchJobs();
    },[])

    const deleteJob = (jobId)=>{
        setJobs(prev => prev?.filter(jb => jb?._id !== jobId));
    }

    if(loading || !jobs)
        return <Spinner/>
    
    if(!loading && !jobs)
        return <p>500 Internal Server Error</p>

    return (
    <div className='w-11/12 max-w-maxContent mx-auto'>
        <p className='p-2 my-4 text-4xl font-semibold'>My Jobs</p>
        <div className='flex flex-wrap gap-x-8 items-center'>
            {
                jobs && jobs.length ? <>
                    <div className='flex flex-wrap gap-x-8 items-center'>
                        {
                            jobs && jobs.map(jb => (
                                <div key={jb?._id} className='min-w-[15rem] max-w-[25rem]'>
                                    <Job_card deleteJob={deleteJob} job={jb}/>
                                </div>
                            ))
                        }
                    </div>
                </>
                :<p>No Jobs Posted Yet</p>
            }
        </div>
    </div>
  )
}

export default MyJobs