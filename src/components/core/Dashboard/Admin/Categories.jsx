import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";
import { GoClockFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";
import { fetchCategories } from "../../../../services/operations/JobAPI";

export const Categories = () => {
  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [categories, setCategories] = useState([]);
    const [loaading,setLoading] = useState(false);

    const getCategories = async() => {
        setLoading(true);
        dispatch(fetchCategories(setCategories));
        setLoading(false);
    };

//   const editCourseHandler = async(courseId)=>{
//     // console.log(courseId);
//     navigate(`/dashboard/edit-course/${courseId}`);
//   }

  useEffect(() => {
    getCategories();
  }, []);

  // console.log(instructorCourses);
  if(loaading)
    return <Spinner/>

  return (
    <div className="w-11/12 xl:w-3/4 mx-auto text-richblack-5 font-inter">
      {!categories ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex justify-between flex-wrap gap-y-4 gap-x-1 items-center">
            <p className="text-3xl">Categories</p>
            <button
              className='bg-yellow-50 flex gap-x-1 items-center text-richblack-900 font-bold p-2 px-4 rounded-md'
              type='button'
              onClick={()=>navigate('/dashboard/admin/create-category')}>
              <span>Add Category</span>
              <span>
                <IoAddOutline />
              </span>
            </button>
          </div>

          {!categories.length ? (
            <p className="text-center my-8">No Catgeories Found !!!</p>
            ) 
            : (
              <section className="flex flex-col items-stretch my-10 ">
                {/* List Header */}
                <div className="hidden w-full h-[30px] md:grid grid-cols-[2fr_3fr_1fr] place-content-center  gap-4 p-3 py-6 border border-richblack-800 text-yellow-50">
                  <p className="text-start">Name</p>
                  <p>Description</p>
                  <p>Actions</p>
                </div>

                {/* List Items */}
                {categories.map((cat, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full grid md:grid-cols-[2fr_3fr_1fr]  gap-4 p-3 border border-richblack-800 "
                    >
                      <div className="w-full my-auto text-richblack-50 text-lg font-bold px-2">
                        <p>{cat?.name}</p>
                      </div>
                      <div className="w-full my-auto text-richblack-100 px-2">
                        <p>{cat?.description}</p>
                      </div>

                      <div className="flex gap-x-2 text-xl items-center md:justify-center">
                        <Link to={`/dashboard/admin/edit-category/${cat?._id}`}
                          className="hover:text-caribbeangreen-200 transition-all duration-300"
                        >
                          <span><MdOutlineModeEdit /></span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </section>
          )}
        </div>
      )}
    </div>
  );
};