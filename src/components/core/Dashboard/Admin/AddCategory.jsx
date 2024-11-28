import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory } from '../../../../services/operations/JobAPI';
import toast from 'react-hot-toast';
import IconBtn from '../../../common/IconBtn';
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { resetcategoryState, setCatgeoryLoading } from '../../../../slices/CategorySlice';
import { editCategoryDetails } from '../../../../services/operations/AdminAPI';

export const AddCategory = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {token} = useSelector(state => state.auth);
  const {category, editCategory, categoryLoading} = useSelector(state => state.category)

  const {

    setValue,
    getValues,
    register,
    handleSubmit,
    reset,
    formState : {errors}

  } = useForm();

  useEffect(()=>{
    
    if(editCategory){
      setValue("name",category?.name);
      setValue("description",category?.description);
    }

  },[]);
  // console.log("editing: ",getValues());

  const isFormUpdated = ()=>{
    const currentValues = getValues();
    if(   
      currentValues.name !== category?.name ||
      currentValues.description !== category?.description
    )
      return true;
    else 
      return false;
  }

  const submitHandler = async(data)=>{
    dispatch(setCatgeoryLoading(true));

    if(editCategory){
      if(isFormUpdated()){
        
        const currentValues = getValues();
        let reqBody = {};        
        reqBody = {...reqBody,categoryId:category?._id};

        if( currentValues?.name !== category?.name) 
            reqBody = {...reqBody,name:data?.name};

        if( currentValues?.description !== category?.description) 
            reqBody = {...reqBody,description:data?.description};
        
        // console.log("updated:",reqBody);

        //Save the changes in backend 
        const result = await editCategoryDetails(reqBody,token);
        if(result){
          dispatch(resetcategoryState());
          navigate('/dashboard/admin/categories');
        }

      }
      else{
        toast.error("No Changes made so far");
      }
      dispatch(setCatgeoryLoading(false));
      return;
    }

    //Create Category

    // console.log(data)
    const result = await createCategory(data,token,navigate);

    if(result){
      navigate('/dashboard/admin/categories');
    }

    dispatch(setCatgeoryLoading(false));
  }

  return (
    <div className='w-11/12 h-auto sm:px-6 mx-auto text-richblack-5 font-inter flex flex-col items-center'>
      <h1 className='p-2 text-4xl font-bold mb-8'>{!editCategory ? "Add Category" : "Edit Category"}</h1>
      <form
        className='w-full max-w-[500px] flex flex-col justify-around'
        onSubmit={handleSubmit(submitHandler)}>
      
        <div
          className='flex flex-col gap-6 bg-richblack-800 p-6 max-sm:px-3 rounded border border-richblack-700'>
          
            {/* Category name */}
            <div className='flex flex-col w-full'>
                <label htmlFor='name'>
                <p>Category Name<sup>*</sup> </p>
                </label>
                <input
                className='outline-none mt-2 text-richblack-200 w-full p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
                name='name'
                placeholder='Enter Category Name'
                type='text'
                {...register("name",{
                    required:{
                    value:true,
                    message:"Category name is required"
                    }
                    })}
                />
        
                {
                errors.name &&
                <span className='mt-1 text-pink-200 text-[12px]'>
                    {errors.name.message}
                </span>
                }
            </div>
            
            {/* Category Description */}
            <div className='flex flex-col w-full'>
            <label htmlFor='description'>
            <p>Category Description<sup>*</sup> </p>
            </label>
            <textarea
            className='outline-none mt-2 text-richblack-200 w-full min-h-[150px] p-2 py-2 bg-richblack-700 rounded-lg text-[16px] shadow-[0px_0.8px_0px_0px_#585D69]'
            name='description'
            placeholder='Enter Category Description'
            {...register("description",{
                required:{
                value:true,
                message:"Category Description is required"
                }
                })}
            />
            {
            errors.description &&
            <span className='mt-1 text-pink-200 text-[12px]'>
                {errors.description.message}
            </span>
            }
            </div>

            {/* Submit Button  */}
            <div className='flex flex-wrap-reverse self-end gap-5'>
                <IconBtn
                text={!editCategory ? "Create" : "Save Changes"}
                disabled={categoryLoading}
                >
                <MdOutlineNavigateNext />
                </IconBtn>
            </div>
        </div>
      </form>
    </div>
  )
}
