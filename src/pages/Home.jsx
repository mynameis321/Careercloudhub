import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { HighlightText } from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button'
import Banner from '../assets/Images/banner.mp4'
import { CodeBlocks } from '../components/core/HomePage/CodeBlocks';
import Footer from '../components/common/Footer';
// import TimeLineSection from '../components/core/HomePage/TimeLineSection';
// import { LearningLanguageSection } from '../components/core/HomePage/LearningLanguageSection';

export const Home = () => {
  return (
    <div className='font-inter'>
        {/* Section 1 */}
        <section className='relative mx-auto md:flex flex-col items-center justify-between w-11/12 max-w-maxContent'>
            <Link to={"/signup"}>
                <button className='group mt-10 p-1 mx-auto bg-richblack-800 rounded-full transition-all hover:scale-95 duration-200 w-fit shadow-[0px_0.5px_0px_0.4px_#424854]'>
                   
                    <div className='flex justify-between items-center gap-2 px-9 py-[5px] font-semibold text-richblack-300 rounded-full group-hover:bg-richblack-900 '>
                        Hire Now
                        <FaArrowRight className='h-3'/>
                    </div>

                </button>
            </Link>
            <div className='mt-8 md:mx-6 md:text-center text-4xl font-bold'>
                Fasten Your Employement Journey with <HighlightText text={"CareerCloudHub"}/> 
            </div>
            <div className='mt-4 md:max-4 md:text-center text-lg text-richblack-300 font-bold md:w-[90%]'>
            With our trusted recruiters find the best career opportunities with us. 
            </div>
            <div className='mt-8 flex gap-7 justify-center items-center'>
                <CTAButton 
                toLink={'/signup'}
                active={true}
                >
                    LearnMore    
                </CTAButton>

                <CTAButton 
                toLink={'/login'}
                active={false}>
                    Book a Call
                </CTAButton>
            </div>

            <div className='relative lg:mx-10 my-16 '>
                <div className='absolute -z-10 top-0 bottom-0 left-0 right-0 '></div>
                <video className='shadow-[20px_20px_0px_0px_#F5F5F5]'
                    muted
                    autoPlay 
                    loop>
                    <source src={Banner} type='video/mp4'/>
                </video>
            </div>

            {/* Type animation CodeBlocks - 1 */}
            <div className='w-full my-20'>
                <CodeBlocks
                    position={"flex-row "}
                    heading={<div className='font-bold font-inter text-4xl'>
                        Hire your <HighlightText text={"potential employees"}/> with us.
                    </div>}
                    subheading={<div className='text-richblack-300 font-bold text-lg md:w-[80%]'>
                        Our platform design for you to get amazing potential team.
                    </div>}
                    ctabtn1={{
                        btntext : "Hire Now",
                        toLink:"/signup",
                        active: true
                    }}
                    ctabtn2={{
                        btntext : "Learn More",
                        toLink:"/login",
                        active: false
                    }}
                    code={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                    codeColor={"text-yellow-100"}
                />
            </div>

            {/* Type animation CodeBlocks - 2 */}
            <div className='w-full my-16'>
                <CodeBlocks
                    position={"flex-row-reverse "}
                    heading={<div className='font-bold font-inter text-4xl w-full'>
                        Start your <HighlightText text={"Career with us"}/>
                    </div>}
                    subheading={<div className='text-richblack-300 font-bold text-lg md:w-[80%]'>
                        Go ahead, give it a try. Our platform means you'll be get ample of opportunities.
                    </div>}
                    ctabtn1={{
                        btntext : "Continue Job Search",
                        toLink:"/signup",
                        active: true
                    }}
                    ctabtn2={{
                        btntext : "Learn More",
                        toLink:"/login",
                        active: false
                    }}
                    code={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                    codeColor={"text-yellow-100"}
                />
            </div>

            {/* Card block */}
            {/* <ExploreMore/> */}
        </section>

        {/* Section 2 */}
        <section className='bg-pure-greys-5 text-richblack-400 select-none'>
            <div className='min-h-[333px] bg_homepage text-white'>
                <div className='w-11/12 max-w-maxContent h-full mx-auto flex flex-col items-center'>
                    <div className='h-[150px]' />
                    <div className='flexBox'>
                        <CTAButton 
                            active={true}
                            toLink={'/signup'}>
                            <div className='flexBox gap-2'>
                                Explore All Jobs
                                <FaArrowRight/>
                        </div>
                        </CTAButton>
                        <CTAButton 
                            active={false}
                            toLink={'/signup'}>
                            Learn More
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='w-11/12 max-w-maxContent mx-auto' >
                
                {/* paragraphs */}
                <div className='py-16 text-black flexBox items-start max-[720px]:flex-col gap-8'>
                    <p className='text-4xl font-inter font-bold leading-tight lg:w-[45%]'>
                        Get the Job 
                        <HighlightText text={' that fits you'}/>
                    </p>
                    <div className='flex flex-col justify-between gap-7 lg:w-[45%]'>
                        <p className='font-semibold text-lg'>The modern CareerCloudHub dictates its own terms. Today, we are modernizing the user experience for Employement Journey.</p>
                        <CTAButton
                            active={true}
                            toLink={'/signup'}>
                            Learn More
                        </CTAButton>
                    </div>
                </div>

                {/* Time Line Section */}
                {/* <div>
                    <TimeLineSection/>
                </div> */}
            </div>

            {/* <div className='w-11/12 max-w-maxContent mx-auto'>
                <LearningLanguageSection/>
            </div> */}
        </section>
        
        {/* Footer */}
        <Footer/>

    </div>
  )
}
