import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { AddCategory } from './AddCategory';
import { setCategory, setEditCategory } from '../../../../slices/CategorySlice';
import { fetchCategoryDetails } from '../../../../services/operations/AdminAPI';

export const EditCategory = () => {

    const dispatch = useDispatch();

    const {categoryId} = useParams();
    const {category} = useSelector(state => state.category);
    const {token} = useSelector(state => state.auth);
    const [loading,setLoading] = useState(false);

    const setCategoryData = async(categoryId)=>{
        setLoading(true);
        const result = await fetchCategoryDetails(categoryId,token);
        if(result){
            dispatch(setEditCategory(true));
            dispatch(setCategory(result));
        }
        setLoading(false);
    }
    // console.log("result: ",category);

    useEffect(()=>{

        setCategoryData(categoryId);

    },[categoryId]);

    if(loading)
        return <Spinner/>

  return (
    <div className='w-11/12 mx-auto text-richblack-5 font-inter'>
        
        {
            !loading && category &&
            <AddCategory/>
        }
    </div>
  )
}
