import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { banUnbanUserAccount, fetchAllRecruiters } from "../../../../services/operations/AdminAPI";

export const Recruiters = () => {
  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {token} = useSelector(state => state.auth);
    const [recruiters, setRecruiters] = useState([]);
    const [loaading,setLoading] = useState(false);

    const getRecruiters = async() => {
        setLoading(true);
        dispatch(fetchAllRecruiters(setRecruiters,token));
        setLoading(false);
    };
    const setUpdateRecruiters = (user)=>{
      const updatedRecruiters = recruiters.map(rec => (rec?._id === user?._id ? user : rec));
      setRecruiters(updatedRecruiters);
    }
    
    const banUnBanRecruiter = async(userId,accountType,approve)=>{
      dispatch(banUnbanUserAccount(token,{
        accountType,
        userId,
        approve
      },setUpdateRecruiters));
      // navigate(`/dashboard/edit-course/${courseId}`);
    }

    // console.log(recruiters);

  useEffect(() => {
    getRecruiters();
  }, []);

  if(loaading)
    return <Spinner/>

  return (
    <div className="w-11/12 xl:w-3/4 mx-auto text-richblack-5 font-inter">
      {!recruiters ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex justify-between flex-wrap gap-y-4 gap-x-1 items-center">
            <p className="text-3xl">Recruiters</p>
          </div>

          {!recruiters.length ? (
            <p className="text-center my-8">No Recruiters Found !!!</p>
            ) 
            : (
              <section className="flex flex-col items-stretch my-10 ">
                {/* List Header */}
                <div className="hidden w-full h-[30px] xslg:grid grid-cols-[2fr_2fr_1fr_2fr] place-content-center  gap-6 p-3 py-6 border border-richblack-700 text-yellow-50">
                  <p className="text-start px-2">Name</p>
                  <p className="px-2">Email</p>
                  <p className="px-2">Mobile</p>
                  <p className="px-2 place-self-center">Actions</p>
                </div>

                {/* List Items */}
                {recruiters.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full grid xslg:grid-cols-[2fr_2fr_1fr_2fr]  gap-4 p-3 border border-richblack-700 "
                    >
                      <div className="w-full my-auto text-richblack-50 px-2 font-bold">
                        <p>{user?.companyName}</p>
                      </div>
                      <div className="w-full my-auto text-richblack-100 px-2">
                        <p>{user?.email}</p>
                      </div>
                      <div className="w-full my-auto text-richblack-100 px-2">
                        <p>{user?.mobile}</p>
                      </div>

                      <div className="flex gap-x-2 items-center text-xs text-richblack-50 font-bold md:justify-evenly p-2">
                        <button 
                          className="bg-pink-600 hover:bg-pink-700 transition-all duration-100 px-4 py-2 rounded-lg flex-grow"
                          onClick={()=>{banUnBanRecruiter(user?._id,user?.accountType,
                                    user?.approve ? false : true
                                  )}}
                        >
                          <span>{user?.approve ? "Ban":"Unban"}</span>
                        </button>
                        <Link
                            to={`/dashboard/admin/recruiter/${user?._id}`} 
                            className="bg-caribbeangreen-300 hover:bg-caribbeangreen-400 transition-all duration-100 px-4 py-2 rounded-lg flex-grow text-center"
                        >
                          <button>View</button>
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