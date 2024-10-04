import React, { useEffect, useState } from 'react'
import { fetchApplicationsByRecruiter } from '../../../../services/operations/ApplicationsAPI';
import { useDispatch, useSelector } from 'react-redux';
import Applications from '../Applications';
import { fetchAllJobs } from '../../../../services/operations/JobAPI';
import Spinner from '../../../common/Spinner';
import { APPLICATION_STATUS } from '../../../../utils/constants';

const ReceivedApplications = () => {
    
    const dispatch = useDispatch();
    const {token} = useSelector(state => state.auth);
    const [applications,setApplications] = useState([]);
    const [loading,setLoading] = useState(false);
    const [jobs,setJobs] = useState([]);
    const [jobId,setJobId] = useState(null);
    const [applicationStatus,setApplicationStatus] = useState(APPLICATION_STATUS.ALL);

    const setAllJobsId = async()=>{
        const response = await fetchAllJobs();
            if(response){
                setJobs(response);
            }
    }

    useEffect(()=>{
        setJobs(null);
        setJobId(null);
        setAllJobsId();
    },[]);

    useEffect(()=>{
        if(jobs && jobs?.length)
            // console.log(jobs)
            setJobId(jobs[0]?._id);
    },[jobs])

    useEffect(()=>{
        // setJobId(jobs[0])
        const fetchReceivedApplications = async()=>{
            setLoading(true);
            
            // console.log(jobs);
           
            const result = await fetchApplicationsByRecruiter(token);
            // console.log(result)
            if(result){
                setApplications(result.filter(ap => ap?.job?._id === jobId && (
                    applicationStatus !== APPLICATION_STATUS.ALL ? ap?.status === applicationStatus : true 
                )));
            }
            setLoading(false);
        }
        
        if(jobId && applicationStatus){
            // console.log(jobId)
            fetchReceivedApplications();
        }
    },[jobId,applicationStatus])

    // console.log(jobId)
    if(loading || !jobs || !applications)
        return <Spinner/>

  return (
    <div className='w-11/12 max-w-maxContent mx-auto'>
        <p className='p-2 my-4 text-4xl font-semibold'>Applications Received</p>
        {
            jobs && jobs.length &&
            <div className='flex flex-col md:flex-row gap-x-8 gap-y-4'>
                {/* Job Filter  */}
                <select 
                className='bg-richblack-700 p-3 mb-6'
                    defaultValue={jobId}
                    onChange={(e)=>{setJobId(e.target.value)}}
                >
                    {
                        jobs &&
                        jobs?.map(jb => (
                            <option key={jb?._id} value={jb?._id}>{jb?.role}</option>
                        ))
                    }
                </select>
                
                {/* Application Status filter */}
                <select 
                    className='bg-richblack-700 p-3 mb-6'
                    defaultValue={applicationStatus}
                    onChange={(e)=>{setApplicationStatus(e.target.value)}}
                >
                    {
                        Object.values(APPLICATION_STATUS)?.map((st,index) => (
                            <option key={index} value={st}>{st}</option>
                        ))
                    }
                </select>
            </div>
        }
        <div>
            
        </div>
        <Applications applications={applications} setApplications={setApplications}/>
    </div>
  )
}

export default ReceivedApplications