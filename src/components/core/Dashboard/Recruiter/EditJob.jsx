import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { fetchJobDetails } from '../../../../services/operations/JobAPI';
import { setEditJob,setJob } from '../../../../slices/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { AddJob } from './AddJob';

export const EditJob = () => {

    const dispatch = useDispatch();

    const {jobId} = useParams();
    const {job} = useSelector(state => state.job);
    const [loading,setLoading] = useState(false);

    const setJobData = async(jobId)=>{
        setLoading(true);
        const result = await fetchJobDetails(jobId);
        if(result){
            dispatch(setEditJob(true));
            dispatch(setJob(result));
        }
        setLoading(false);
    }
    // console.log("result: ",course);

    useEffect(()=>{

        setJobData(jobId);

    },[]);

    if(loading)
        return <Spinner/>

  return (
    <div className='w-11/12 mx-auto text-richblack-5 font-inter'>
        
        {
            !loading && job &&
            <AddJob/>
        }
    </div>
  )
}
