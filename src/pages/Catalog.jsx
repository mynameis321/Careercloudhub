import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { categories } from '../services/apis';
import { apiConnector } from '../services/apiconnector';
import { JobSlider } from '../components/core/Catalog/Job_Slider';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/common/Spinner';
import { fetchCategoryPageJobs } from '../services/operations/JobAPI';
import { setLoading } from '../slices/profileSlice';
import Footer  from '../components/common/Footer'

export const Catalog = () => {
    
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.profile);
    const {catalogName} = useParams();
    const [categoryId,setCategoryId] = useState(null);
    const [catalogPageDetails,setCatalogPageDetails] = useState({});
    const [active,setActive] = useState(1);

    //get category id 
    useEffect(()=>{
        const getCategoryDetails = async()=>{
            //fetch all categories
            dispatch(setLoading(true));
            try{
                const result = await apiConnector("GET",categories.CATEGORIES_API);
                // console.log("result",result?.data?.allCategories,catalogName);

                const category_id = result.data.allCategories.filter(
                    (ct)=>ct.name.split(" ").join("-").toLowerCase() === catalogName
                )[0]._id;

                setCategoryId(category_id);
                dispatch(setLoading(false));
            }catch(err){
                toast.error("could not fetch catagories");
                dispatch(setLoading(false));
            }
        }    

        setCatalogPageDetails(null);
        setCategoryId(null);
        getCategoryDetails();
    },[catalogName]);  

    // get category page details
    useEffect(()=>{

        const getCatalogPageDetail = async()=>{
            dispatch(setLoading(true));
            // console.log(categoryId)
            const result = await fetchCategoryPageJobs(categoryId);
            // console.log(result)

            if(result)
                setCatalogPageDetails(result);
            dispatch(setLoading(false));
        }
        
        if(categoryId){
            getCatalogPageDetail();
        }
        
    },[categoryId]);
    
    // console.log(categoryId);
    // console.log(catalogPageDetails);


    if(loading || !catalogPageDetails)
        return (<Spinner/>)
    
    if (!loading && !catalogPageDetails) {
        return <p>Error 404 Not Found</p>
      }

    return (
        <div className='flex-col'>
            {/* Category Description */}
            <section className=' text-richblack-300 bg-richblack-800 py-12 font-inter'>
                <div className='w-11/12 max-w-maxContent mx-auto tracking-wider'>
                    <p className='text-sm tracking-wide'>
                        <span>{"Home / Jobs / "}</span>
                        <span className='text-yellow-25'>
                            {catalogPageDetails?.selectedCategory?.name}
                        </span>
                    </p>
                    <p className='text-3xl my-4 text-richblack-5'>
                        {catalogPageDetails?.selectedCategory?.name}
                    </p>
                    <p className='text-richblack-200'>
                        {catalogPageDetails?.selectedCategory?.description}
                    </p>
                </div>
            </section>

            {/* Jobs */}
            <section className='w-11/12 max-w-maxContent mx-auto py-10 flex flex-col gap-y-16'>
                {/* Selected Category Jobs */}
                <div>
                    <p className='text-3xl font-bold my-2'>
                        Get Started with your Employement Journey
                    </p>

                    {
                        catalogPageDetails?.selectedCategory?.jobs && 
                        !catalogPageDetails?.selectedCategory?.jobs.length
                        ? <p className='w-full px-4 mt-8 text-yellow-200 font-medium text-2xl text-center'>
                            No Jobs Found for the Selected Category 
                        </p>
                        : <>
                            <JobSlider 
                                jobs={catalogPageDetails?.selectedCategory?.jobs}
                                height={"h-[300px]"}
                                slides={2}
                            />                      
                        </>
                    }
                </div>

                {/* Other Job */}
                {
                    catalogPageDetails?.differentCategory && 
                    catalogPageDetails?.differentCategory?.length ?
                    <div>
                        <p className='text-3xl font-bold'>
                            Other Jobs
                        </p>
                        
                        <JobSlider 
                            jobs={catalogPageDetails?.differentCategory}
                            height={"h-[300px]"}
                            slides={2}
                        />
                    </div>
                    :<></>
                }

            </section>
            <Footer/>
        </div>
    )
}
