import React, { useEffect } from 'react'
import { AddJob } from './AddJob'
import { useDispatch, useSelector } from 'react-redux'
import { resetJobState } from '../../../../slices/jobSlice';
import Spinner from '../../../common/Spinner';

const CreateJob = () => {

    const dispatch = useDispatch();
    const {editJob} = useSelector(state => state.job);

    useEffect(()=>{
        dispatch(resetJobState());
    },[])

    if(editJob)
        return <Spinner/>

  return (
    <>
        <AddJob/>
    </>
  )
}

export default CreateJob