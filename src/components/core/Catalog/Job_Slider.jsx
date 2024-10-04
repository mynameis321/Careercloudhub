import React from 'react'
import { Job_card } from './Job_card';
// Import Swiper React components
import { Swiper , SwiperSlide } from 'swiper/react';

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// Import required modules
import { FreeMode, Pagination } from "swiper/modules";
import { Link } from 'react-router-dom';

export const JobSlider = ({jobs,height,slides}) => {
  return (
    <div className='my-8 h-[10rem]'>{
      jobs?.length &&
      <Swiper
        slidesPerView={1}
          spaceBetween={20}
          modules={[FreeMode,Pagination]}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            980: {
              slidesPerView: 3,
            },
          }}
          // className="max-h-[30rem]"
      >
        {
          jobs.map((job)=>(
            <SwiperSlide key={job?._id}>
                <Job_card job={job} Height={height} path={`/jobs/${job?._id}`}/>
            </SwiperSlide>
          ))  
        }
      </Swiper> 
    }</div>
  )
}