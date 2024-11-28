const Applicant = require('../models/Applicant');
const Company = require('../models/Company');
const Admin = require('../models/Admin');
const { ACCOUNT_TYPE } = require('../utils/constants');
const { deteApplications } = require('./Applications');
const { deleteJobS } = require('./Job');

exports.disApproveAccount = async(req,res)=>{
    try {
        
        const {userId: id,approve,accountType} = req.body;

        if(!id || !accountType){
            return res.status(404).json({
                success: false,
                message: "User details not found"
            });
        }

        const User = accountType === ACCOUNT_TYPE.APPLICANT ? Applicant :
                    (accountType === ACCOUNT_TYPE.RECRUITER ? Company : Admin);

        const userDetails = await User.findById(id).select('-password');
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                approve
            },
            {new: true}
        ).select('-password');
        // console.log(updatedUser);

        res.status(200).json({
            success: true,
            message: `User ${approve ? "Unbanned" : "Banned"} Successfully`,
            user: updatedUser
        });

    } catch (err) {
        console.log("Could not change the account status",err);
        return res.status(500).json({
            success: false,
            message: "Could not ban user. Please try again later"
        });
    }
}

exports.updateApplicantProfile = async(req,res)=>{
    try{
        const {
            firstName,
            lastName,
            dob,
            gender,
            description,
            mobile
        } = req.body;
        const userId = req.user.id;
        
        //validate
        if(!firstName || !description || !mobile){
            return res.status(401).json({
                success: false,
                message: "Required Details not Found"
            });
        }

        const user = await Applicant.findByIdAndUpdate(
            {_id:userId},
            {
                firstName,
                lastName,
                dob,
                gender,
                description,
                mobile
            },
            {new:true}
        ).populate("applications");

        // console.log("Updated User",user);

        //return response
        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            updatedUserDetails:user
        }); 

    }catch(err){
        console.log("Could not Update Profile");
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try later"
        });
    }
}

exports.updateRecruiterProfile = async(req,res)=>{
    try{
        //get id
        const {
            poc,
            pocDesignation,
            address,
            description,
            mobile
        } = req.body;
        const userId = req.user.id;

       //validate
       if(
            !poc ||
            !pocDesignation ||
            !address ||
            !description ||
            !mobile
        ){
        return res.status(401).json({
            success: false,
            message: "Required Details not Found"
        });
        }

        const user = await Company.findByIdAndUpdate(
            {_id:userId},
            {
                poc,
                pocDesignation,
                address,
                description,
                mobile
            },
            {new:true}
        ).populate("applications");

        // console.log("Updated User",user);

        //return response
        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            updatedUserDetails:user
        }); 


    }catch(err){
        console.log("Could not Update Profile");
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try later"
        });
    }
}

//delete account
//explore task or job scheduling a request 
// explore cronjob

exports.deleteAccount = async(req,res) => {
    try{
        //fetch id
        const {id:userId,accountType} = req.user;
        
        const User = accountType === "Applicant" ? Applicant 
        :(accountType === "Company" ? Company : Admin) 

        //get details
        const userDetails = await User.findById(userId)

        if(userDetails.accountType === "Applicant" && userDetails?.applications){
            await deteApplications(userDetails?.applications);
        }else{
            if(userDetails?.jobs)
                await deleteJobS(userDetails?.jobs)
        }
        
        //delete user
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    }catch (error) {
		console.log("Could not delete account");
		console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
         });
	}
}        

exports.fetchAllRecruiters = async(req, res) => {
    try {
        
        const companies = await Company.find({});
        if(!companies){
            return res.status(400).json({
                success: false,
                message: "Companies not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            companies
        });

    } catch (err) {
        console.log("Could not fetch companies",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

exports.fetchAllApplicants = async(req, res) => {
    try {
        
        const applicants = await Applicant.find({});
        if(!applicants){
            return res.status(400).json({
                success: false,
                message: "Applicants not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Applicants fetched successfully",
            applicants
        });

    } catch (err) {
        console.log("Could not fetch applicants",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

exports.getCompleteRecruiterDetails = async (req, res) => {
	try {
		const { recruiterId } = req.body;

        if(!recruiterId){
            return res.status(401).json({
                success: false,
                message: "User Id not Found"
            });
        }

		const userDetails = await Company.findById(recruiterId)
			.populate("jobs")
			.populate("applications")
			.exec();
		console.log("All Users",userDetails);

		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//update profile picture
exports.updateProfilePicture = async(req,res)=>{
    // try{
    //     //fetch data
    //     const image = req.files.imageFile;
    //     const userId  =  req.user.id;

    //     //validate
    //     if(!image){
    //         return res.status(400).json({
    //             success: false,
    //             message: "Image File Not Found"
    //         });
    //     }

    //     //upload image to cloudinary
    //     const imageDetails = await uploadImageToCloudinary(
    //         image,
    //         process.env.FOLDER_NAME,
    //         1000,
    //         1000);
        
    //     console.log(imageDetails);
        
    //     //get user detais
    //     let updatedUserDetails = await User.findByIdAndUpdate(
    //         userId,
    //         {image: imageDetails.secure_url},
    //         {new: true}
    //     ).select('-password');

    //     //return respomse
    //     res.status(200).json({
    //         success: true,
    //         message: "Profile Picture Updated Successfully",
    //         data: updatedUserDetails
    //     });
    // }catch(err){
    //     return res.status(500).json({
    //         success: false,
    //         message: "Failed to update the Profile Picture",
    //     });
    // }
}
