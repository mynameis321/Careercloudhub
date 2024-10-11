const Job = require('../models/Job');
const Applicant = require('../models/Applicant');
const Company = require('../models/Company');
const Application = require('../models/Application');
const mailSender = require('../utils/mailSender');
const { applicantJobApplicationMail } = require('../mail/templates/applicantJobApplicationMail');
const { companyNewJobApplicantMail } = require('../mail/templates/companyApplicantMail');
const { applicationStatusUpdateMail } = require('../mail/templates/applicationStatusUpdateMail');
const { APPLICATION_STATUS } = require('../utils/constants');

exports.createApplication = async(req,res)=>{
    try {
        
        const {
            jobId,
            companyId,
            education,
            workStatus,
            currentOffer,
            currentSalary,
            resume,
            linkedIn,
            portfolio,
            coverLetter,
            skills
        } = req.body;
        const applicantId = req?.user?.id;

        // validate details 
        if(
            !jobId ||
            !companyId ||
            !applicantId ||
            !education ||
            !workStatus ||
            (workStatus === "Experienced" && !currentOffer) ||
            (workStatus === "Experienced" && !currentSalary) ||
            !resume || 
            !linkedIn || 
            !skills
        ){
            return res.status(404).json({
                success: false,
                message: "Insufficient Details"
            });
        }

        //Check existing company
        const foundCompany = await Company.findById({_id:companyId}).select("-password");
        if(!foundCompany){
            return res.status(404).json({
                success: false,
                message: `No Recruiter found with Id ${companyId}`
            });
        }

        //check job exisiting 
        const foundJob = await Job.findById({_id:jobId})
        .select("-applicants").select("-company").select("-applications").exec();
        if(!foundJob){
            return res.status(404).json({
                success: false,
                message: `No Job found with Job Id ${jobId}`
            });
        }

        //check exisiting applicant 
        const foundApplicant = await Applicant.findById({_id:applicantId}).select("-password");
        if(!foundApplicant){
            return res.status(404).json({
                success: false,
                message: `No User found with User Id ${applicantId}`
            });
        }

        //create new application
        const newApplication = await Application.create({
            company: foundCompany?._id,
            applicant: foundApplicant?._id,
            job: foundJob?._id,
            education,
            workStatus,
            currentOffer,
            currentSalary,
            resume,
            linkedIn,
            portfolio,
            coverLetter,
            skills: JSON.parse(skills),
        });

        //push the application in applicant model
        const updatedApplicant = await Applicant.findByIdAndUpdate(
            {_id:foundApplicant?._id},
            {
                $push:{
                    applications: newApplication?._id
                }
            },
            {new: true}
        )

        //push the application in job model
        const updatedJob = await Job.findByIdAndUpdate(
            {_id:foundJob?._id},
            {
                $push:{
                    applications: newApplication?._id
                }
            },
            {new: true}
        )

        //push the application in company model
        const updatedCompany = await Company.findByIdAndUpdate(
            {_id:foundCompany?._id},
            {
                $push:{
                    applications: newApplication?._id
                }
            },
            {new: true}
        )
        
        //Application Successful mail sent to Applicant 
        let applicantMailSendingResponse = null;
        do{

            applicantMailSendingResponse = await mailSender(
                updatedApplicant?.email,
                `Application for ${updatedJob?.role}`,
                applicantJobApplicationMail(
                    `${updatedApplicant?.firstName} ${updatedApplicant?.lastName}`,
                    updatedCompany?.companyName,
                    updatedJob?.role,
                )
            );

        }while(!applicantMailSendingResponse);
        // console.log("Applicant Mail",applicantMailSendingResponse)
        
        //Application Successful mail sent to Applicant 
        
        let companyMailSendingResponse = null;
        do{
            companyMailSendingResponse = await mailSender(
                updatedCompany?.email,
                `Application for ${updatedJob?.role}`,
                companyNewJobApplicantMail(
                    `${updatedApplicant?.firstName} ${updatedApplicant?.lastName}`,
                    updatedCompany?.companyName,
                    updatedJob?.role,
                    newApplication?._id
                )
            );
        }while(!companyMailSendingResponse)
        // console.log("Company Mail",companyMailSendingResponse)
        
        return res.status(200).json({
            success: true,
            message:"Application Submitted Succefully",
            data:{updatedApplicant,updatedCompany,updatedJob},
            application:newApplication
        });

    } catch (err) {
        console.log("Could not Submit application",err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

exports.deteApplications = async(applications)=>{
    try {
        
        for(let applicationId of applications){
            
            // delete application
            const application = await Application.findByIdAndDelete({_id:applicationId});
            
            //remove from company applications
            await Company.findByIdAndUpdate(
                {_id: application?.company},
                {
                    $pull:{
                        applications:applicationId
                    }
                }
            );
            
            // remove from applicant applications
            await Applicant.findByIdAndUpdate(
                {_id: application?.applicant},
                {
                    $pull:{
                        applications:applicationId
                    }
                }
            );
            
            // remove from job applications
            await Job.findByIdAndUpdate(
                {_id: application?.job},
                {
                    $pull:{
                        applications:applicationId
                    }
                }
            );
        }
        
    } catch (error) {
        return error;
    }
}

exports.getApplicationsByCompany = async(req,res)=>{
    try {
        
        const companyId = req.user.id;
        
        //Check existing company
        const foundCompany = await Company.findById({_id:companyId})
                .select("-password");
        
                if(!foundCompany){
            return res.status(404).json({
                success: false,
                message: `No Recruiter found with Id ${companyId}`
            });
        }

        //fetch Applications
        const companyApplications = await Application.find({company:foundCompany?._id})
            .sort({createdAt:-1})
            .populate("applicant","-password")
            .populate("company","-password")
            .populate({
                path:"job",
                populate:{
                    path: "workPreference"
                }
            })
            // .populate('interview')
            .exec();

        if(!companyApplications){
            return res.status(404).json({
                success: false,
                message: "Applications not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Applications fetched successfully",
            data: companyApplications
        })

    } catch (err) {
        console.log("Could not fetch Applications",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

exports.getApplicationsByApplicant = async(req,res)=>{
    try {
        
        const applicantId = req.user.id;
        
        //Check existing company
        const foundApplicant = await Applicant.findById({_id:applicantId})
            .select("-password");
        
            if(!foundApplicant){
            return res.status(404).json({
                success: false,
                message: `User not found with Id ${applicantId}`
            });
        }

        //fetch Applications
        const applicantApplications = await Application.find({applicant: foundApplicant?._id})
            .sort({createdAt:-1})
            .populate("applicant","-password")
            .populate("company","-password")
            .populate({
                path:"job",
                populate:{
                    path: "workPreference"
                }
            })
            // .populate('interview')
            .exec();

        if(!applicantApplications){
            return res.status(404).json({
                success: false,
                message: "Applications not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Applications fetched successfully",
            data: applicantApplications
        })

    } catch (err) {
        console.log("Could not fetch Applications",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

//getCourseDetails
exports.getApplicationDetails = async(req,res) =>{
    try{
        //get course id
        const { applicationId } =  req.body;

        // console.log("jobId: ",jobId);

        //fetch details
        const applicationDetails = await Application.findById({_id:applicationId})
            .populate("applicant","-password")
            .populate("company","-password")
            .populate({
                path:"job",
                populate:{
                    path: "workPreference"
                }
            })
            // .populate('interview')
            .exec();
        
        if(!applicationDetails){
            return res.status(401).json({
                success: false,
                message: `Application not found with ID ${applicationId}`
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Application details fetched successfully",
            data:applicationDetails
        });

    }catch(err){
        console.log("Could not fetch Application details",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

const applicantStatusUpdatedMail = async(application)=>{
    let statusUpdatedMailSendingResponse = null;
    try{
        //send status update mail to applicant
        do{

            statusUpdatedMailSendingResponse = await mailSender(
                application?.applicant?.email,
                `Application Update for ${application?.job?.role}`,
                applicationStatusUpdateMail(
                    `${application?.applicant?.firstName} ${application?.applicant?.lastName}`,
                    application?.company?.companyName,
                    application?.job?.role,
                    application?.status
                )
            );

        }while(!statusUpdatedMailSendingResponse);
        // console.log("Applicant Status update Mail",statusUpdatedMailSendingResponse)

    }catch(err){
        console.log("Could not send status update mail",err);
    }
    return statusUpdatedMailSendingResponse;
}

exports.updateApplicationStatus = async(req,res)=>{
    try {
        
        const {applicationId,status} = req.body;

        //Validate 
        if(!applicationId || !status){
            return res.status(404).json({
                success: false,
                message: "Application details not found"
            });
        }

        //check if application exist
        let foundApplication = await Application.findById({_id:applicationId})
        .populate("applicant","-password")
        .populate("company","-password")
        .populate({
            path:"job",
            populate:{
                path: "workPreference"
            }
        })
        // .populate('interview')
        .exec();

        if(!foundApplication){
            return res.status(404).json({
                success: false,
                message: `Application not found with Id ${applicationId}`
            });
        }

        //update application status
        const updatedApplication = await Application.findByIdAndUpdate(
            {_id:foundApplication?._id},
            {status},
            {new:true}
        )
        .populate("applicant","-password")
        .populate("company","-password")
        .populate({
            path:"job",
            populate:{
                path: "workPreference"
            }
        })
        // .populate('interview')
        .exec();

        //Send status update mail
        if(
            updatedApplication?.status === APPLICATION_STATUS.SHORTLIST ||
            updatedApplication?.status === APPLICATION_STATUS.HIRE ||
            updatedApplication?.status === APPLICATION_STATUS.REJECT
        ){
            const mailResponse = await applicantStatusUpdatedMail(updatedApplication);
            if(!mailResponse){
                return res.status(400).json({
                    success: false,
                    message: "Could not send status update mail"
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: updatedApplication
        });

    } catch (err) {
        console.log("Could not update application status",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}
