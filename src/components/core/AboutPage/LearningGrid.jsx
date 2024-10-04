import React from 'react';
import CTAButton from '../HomePage/Button';
import { HighlightText } from '../HomePage/HighlightText';

const LearningGridArray = [
    {
      order: -1,
      heading: "Unleashing Potential with",
      highlightText: " Targeted Job Matches and Resources.",
      description:
        "Our partnerships with leading companies provide you with exclusive job opportunities and industry insights, ensuring a dynamic and effective career search experience.",
      BtnText: "Learn More",
      BtnLink: "/",
    },
    {
      order: 1,
      heading: "Advanced Search Filters to Find the Perfect Job.",
      description:
        "Utilize our comprehensive search filters to refine your job search, making it easy to find opportunities.",
    },
    {
      order: 2,
      heading: "Access detailed employer profiles to make informed job choices.",
      description:
        "You can make informed decisions and choose workplaces that align with your career goals and values.",
    },
    {
      order: 3,
      heading: "Easy Resume Upload and Profile Management.",
      description:
        "Effortlessly upload your resume, and manage your profile, streamline your job application process and keeping you up-to-date.",
    },
    {
      order: 4,
      heading: `Streamlined Application Process for Faster Results"`,
      description:
        "Experience a simplified application process designed to speed job search, apply to multiple positions quickly and efficiently.",
    },
    {
      order: 5,
      heading: "Job Recommendations Tailored to Your Requirements",
      description:
        "Receive job that are customized to your unique preferences, helping you find positions that truly match your expertise",
    },
  ];


export const LearningGrid = () => {
  return (
        <div className='grid xls:grid-cols-4 bg-richblack-900 max-xls:gap-3 place-items-center'>
            {
                LearningGridArray.map((card , index) => {
                    return (
                        <div
                            key={index}
                            className={`
                                ${card.order < 0 && "lg:col-span-2 bg-richblack-900"}
                                
                                ${card.order % 2 == 1
                                    ? "bg-richblack-700" : "bg-richblack-800"}
                                
                                ${card.order === 3 && "xls:col-start-2"}
                                sm:w-[65%] lg:w-full`}>
                            
                            {
                                index == 0 &&   
                                <div className='lg:h-[280px] lg:w-[75%] xls:w-[90%] flex flex-col justify-between gap-4 pb-8 text-richblack-500 text-lg font-semibold'>

                                    <p className='text-4xl text-richblack-5'>
                                        {card.heading}
                                        <HighlightText text={card.highlightText} />
                                    </p>
                                
                                    <p className='mb-6'>
                                        {card.description}
                                    </p>
                                
                                    <CTAButton toLink={card.BtnLink} active={true}>
                                        {card.BtnText}
                                    </CTAButton>
                                </div>
                            }

                            {
                                card.order > 0 && 
                                <div className='h-[250px] sm:h-[280px] p-7 flex flex-col justify-around gap-4 text-richblack-100'>
                                    <p className='text-xl text-richblack-5'>{card.heading}</p>
                                    <p>{card.description}</p>
                                </div>
                            }

                        </div>
                    )
                })
            }
        </div>
  )
}
