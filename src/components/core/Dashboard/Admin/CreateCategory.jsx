import React, { useEffect } from 'react'
import { AddCategory } from './AddCategory';
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../../../common/Spinner';
import { resetcategoryState } from '../../../../slices/CategorySlice';

const CreateCategory = () => {

    const dispatch = useDispatch();
    const {editCategory} = useSelector(state => state.category);

    useEffect(()=>{
        dispatch(resetcategoryState());
    },[])

    if(editCategory)
        return <Spinner/>

  return (
    <>
        <AddCategory/>
    </>
  )
}

export default CreateCategory;