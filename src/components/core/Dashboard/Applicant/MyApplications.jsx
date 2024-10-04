import React, { useState } from 'react'
import { useEffect } from 'react'
import { fetchApplicationsByApplicant } from '../../../../services/operations/ApplicationsAPI'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '../../../../slices/profileSlice'
import Applications from '../Applications'
import { APPLICATION_STATUS } from '../../../../utils/constants'

const MyApplications = () => {

    const dispatch = useDispatch();
    const {token} = useSelector(state => state.auth);
    const [applications,setApplications] = useState([]);
    const [applicationStatus,setApplicationStatus] = useState(APPLICATION_STATUS.ALL);

    useEffect(()=>{

        const fetchMyApplications = async()=>{
            const result = await fetchApplicationsByApplicant(token);
            // console.log(result)
            if(result){
                setApplications(result.filter(ap => (
                    applicationStatus !== APPLICATION_STATUS.ALL ? ap?.status === applicationStatus : true 
                )));
            }
            dispatch(setLoading(false));
        }

        if(applicationStatus)
            fetchMyApplications();
    
    },[applicationStatus])

  return (
    <div className='w-11/12 max-w-maxContent mx-auto'>
        <p className='p-2 my-4 text-4xl font-semibold'>My Applications</p>
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
        <Applications applications={applications}/>
    </div>
  )
}

export default MyApplications