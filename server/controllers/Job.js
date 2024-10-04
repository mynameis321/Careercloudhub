const Job = require('../models/Job');
const Category = require('../models/Category');
const Company = require('../models/Company');
const Preference = require('../models/WorkPreference');
const { deteApplications } = require('./Applications');

exports.createJob = async(req,res) =>{
    try{
        //fetch data and file
        let {
            role,
            summary,
            workStatus,
            employmentType,
            workType,
            shift,
            noOfPositions,
            salary,
            category,//id of category
            responsibilities,
            requirements,
            preferredQualifications,
            skills,
            benifits,
			policies,
            active,
        } = req.body;
        const userId = req.user.id;

        //validate
        if(
            !userId ||
            !role ||
            !summary ||
            !workStatus ||
            !employmentType ||
            !workType ||
            !shift ||
            !noOfPositions ||
            !category ||
            !responsibilities ||
            !requirements ||
            !preferredQualifications ||
            !skills ||
            !active
        ){
            return res.status(401).json({
                success: false,
                message: "All fields are mandatory. Please fill complete fields"
            });     
        }

        //parse json string to json array
        skills = JSON.parse(skills);
        responsibilities = JSON.parse(responsibilities);
        requirements = JSON.parse(requirements);
        preferredQualifications = JSON.parse(preferredQualifications);
        benifits = benifits ? JSON.parse(benifits) : null;
        policies = policies? JSON.parse(policies) : null;

        //if instructor or not
		const companyDetails = await Company.findById(userId).select('-password').exec();

		if (!companyDetails) {
			return res.status(404).json({
				success: false,
				message: "Recruiter Details Not Found",
			});
		}

        //validate catagory
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(401).json({
                success: false,
                message: "Invalid Catagory"
            });
        }

        //Creating Work Preference Object
        const workPreference = await Preference.create({
            workStatus,
            employmentType,
            workType,
            shift,
        });

        //inserting entry in db
        const newJob = await Job.create({
            createdAt: Date.now(),
            company:companyDetails?._id,
            role,
            summary,
            noOfPositions,
            workPreference,
            salary,
            category,
            responsibilities,
            requirements,
            preferredQualifications,
            skills,
            benifits,
			policies,
            active,
        });


        //updating user(instructor) course list
        await Company.findByIdAndUpdate(
            {_id: companyDetails._id},
            {
                $push: {
                    jobs: newJob._id
                }
            },
            {new: true}).select('-password').exec();

        //updating job in job Category list
        const updatedCategory = await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push: {
                    jobs: newJob._id
                }
            },
            {new: true});
        // console.log(updatedCategory);

        // return response
        return res.status(200).json({
            success: true,
            data: newJob,
            message: "Job created Successfully"
        });

    }catch(err){
        console.log("Could not create Job",err);
		res.status(500).json({
			success: false,
			message: "Something Went Wrong.",
		});
    }
}

exports.getJobsByCompany = async(req,res)=>{
    try{
        const companyId = req.user.id;

        //validate category
        const foundCompany = await Company.findById(companyId);
        if(!foundCompany){
            return res.status(404).json({
                success: false,
                message: "Recruiter not found"
            })
        }

        //get all jobs
        const jobsByCompany = await Job.find({company: companyId})
        .sort({createdAt:-1})
        .populate("company","-password")
        .populate("category")
        .populate("workPreference")
        .populate("applicants","-password")
        .populate("applications")
        .exec();
       
        res.status(200).json({
            success: true,
            data: jobsByCompany,
            message: "Jobs fetched SuccessFully"
        });

    }catch(err){
        console.log("could not fetch jobs",err);
		return res.status(404).json({
			success: false,
			message: `Something went wrong`,
		});
    }
}

exports.getCategoryPageJobs = async(req,res)=>{
    try{
        const {category} = req.body;

        //validate category
        const foundCategory = await Category.findById(category);
        if(!foundCategory){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        //get all jobs
        const selectedCategoryJobs = await Job.find({category:foundCategory?._id})
            .sort({createdAt:-1})
            .populate("company","-password")
            .populate("category")
            .populate("workPreference")
            .populate("applicants","-password")
            // .populate("applications")
            .exec();

        //get all jobs
        const otherJobs = await Job.find({
            category:{
                $ne: foundCategory?._id
            }
        })
        .sort({createdAt:-1})
        .populate("company","-password")
        .populate("category")
        .populate("workPreference")
        .populate("applicants","-password")
        // .populate("applications")
        .exec();
       
        res.status(200).json({
            success: true,
            data: {
                selectedCategory:{
                    _id:foundCategory?._id,
                    name:foundCategory?.name,
                    description:foundCategory?.description,
                    jobs:selectedCategoryJobs
                },
                differentCategory:otherJobs
            },
            message: "Jobs fetched SuccessFully"
        });

    }catch(err){
        console.log("could not fetch jobs",err);
		return res.status(404).json({
			success: false,
			message: `Something went wrong`,
		});
    }
}

exports.getJobDetails = async(req,res) =>{
    try{
        //get course id
        const { jobId } =  req.body;

        // console.log("jobId: ",jobId);

        //fetch details
        const jobDetails = await Job.findById({_id:jobId})
            .populate("company","-password")
            .populate("category")
            .populate("workPreference")
            .populate("applicants","-password")
            .populate("applications")
            .exec();
        
        if(!jobDetails){
            return res.status(401).json({
                success: false,
                message: `Job not found with Job ID ${jobId}`
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Job details fetched successfully",
            data:jobDetails
        });

    }catch(err){
        console.log("Could not fetch Job details",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

exports.getAllJobs = async(req,res)=>{
    try{
        const allJobs = await Job.find({})
            .sort({createdAt:-1})
            .populate("company","-password")
            .populate("category")
            .populate("workPreference")
            .populate("applicants","-password")
            // .populate("applications")
            .exec();

        if(!allJobs){
            return res.status(400).json({
                success: false,
                message: "No Job Found"
            });
        }

        res.status(200).json({
            success: true,
            data: allJobs,
            message: "Jobs fetched SuccessFully"
        });

    }catch(err){
        console.log("could not fetch jobs",err);
		return res.status(404).json({
			success: false,
			message: `Something went wrong`,
		});
    }
}

exports.editJob = async(req,res) =>{
    try{
        //fetch data and file
        const updates = req.body;
        const {jobId} = req.body;

        // console.log(req.body);

        //if instructor or not
        const userId = req.user.id;
		const companyDetails = await Company.findById({_id:userId}).select("-password");

		if (!companyDetails) {
			return res.status(404).json({
				success: false,
				message: "Company Details Not Found",
			});
		}

        //validate course
        const jobDetails = await Job.findById({_id:jobId});
        if(!jobDetails){
            return res.status(401).json({
                success: false,
                message: "Invalid Job"
            });
        }
        
        // console.log(updates);
        if("skills" in updates)
            updates["skills"] = JSON.parse(updates["skills"]);

        if("responsibilities" in updates)
            updates["responsibilities"] = JSON.parse(updates["responsibilities"]);

        if("requirements" in updates)
            updates["requirements"] = JSON.parse(updates["requirements"]);

        if("preferredQualifications" in updates)
            updates["preferredQualifications"] = JSON.parse(updates["preferredQualifications"]);

        if("benifits" in updates)
            updates["benifits"] = JSON.parse(updates["benifits"]);

        if("policies" in updates)
            updates["policies"] = JSON.parse(updates["policies"]);

        //inserting entry in db
        const updatedJob = await Job.findByIdAndUpdate(
            {_id: jobDetails?._id},
            updates,
            {new: true}
        )
        .populate("company","-password")
        .populate("category")
        .populate("workPreference")
        .populate("applicants","-password")
        .populate("applications")
        .exec();

        // return response
        return res.status(200).json({
            success: true,
            data: updatedJob,
            message: "Job updated Successfully"
        });

    }catch(err){
        console.log(err);
        console.log("Could not update job");
		res.status(500).json({
			success: false,
			message: "Failed to update job",
		});
    }
}

exports.deleteJob = async(req,res)=>{
    try{

        const {jobId} = req.body;

        //check if job exist 
        const job = await Job.findById({_id:jobId})

        if(!job)
            return res.status(404).json({
                success:false,message:"Job Not Found"
            });
        
        //delete applications from job and comopany model
        if(job?.applications?.length)
            await deteApplications(job?.applications);

        //remove job from company array 
        const company = await Company.findByIdAndUpdate(
            {_id:job?.company},
            {
                $pull: {jobs:jobId}
            },
            {new:true}
        );
        console.log("updated company: ",company);
        
        //remove from category array 
        const category = await Category.findByIdAndUpdate(
            {_id:job?.category},
            {
                $pull: {jobs:jobId}
            },
            {new:true}
        );
        console.log("updated category: ",category);

        //delete work preference
        await Preference.findByIdAndDelete({_id:job?.workPreference});

        //delete job
        await Job.findByIdAndDelete(jobId);

        res?.status(200).json({
            success:true,
            message:"Job Deleted Successfully"
        });

    }catch(err){
        console.log("Could not delete job",err);
        res?.status(500).json({
            success:false,
            message:"Something went wrong"
        });
    }
}

exports.deleteJobS = async(jobs)=>{
    for(let jobId of jobs){
        //check if job exist 
        const job = await Job.findById({_id:jobId})

        if(!job)
            return new Error("Job not found");
        
        //delete applications from job and comopany model
        if(job?.applications?.length)
            await deteApplications(job?.applications);

        //remove job from company array 
        const company = await Company.findByIdAndUpdate(
            {_id:job?.company},
            {
                $pull: {jobs:jobId}
            },
            {new:true}
        );
        console.log("updated company: ",company);
        
        //remove from category array 
        const category = await Category.findByIdAndUpdate(
            {_id:job?.category},
            {
                $pull: {jobs:jobId}
            },
            {new:true}
        );
        console.log("updated category: ",category);

        //delete work preference
        await Preference.findByIdAndDelete({_id:job?.workPreference});

        //delete job
        await Job.findByIdAndDelete(jobId);

    }
}