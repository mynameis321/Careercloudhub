const Applicant = require('../models/Applicant');
const Company = require('../models/Company');
const { deteApplications } = require('./Applications');
const { deleteJobS } = require('./Job');

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
        :(accountType === "Company" ? Company : "") 

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

exports.getAllUserDetails = async (req, res) => {
	// try {
	// 	const id = req.user.id;
	// 	const userDetails = await User.findById(id)
	// 		.populate("additionalDetails")
	// 		.exec();
	// 	console.log("All Users",userDetails);

	// 	res.status(200).json({
	// 		success: true,
	// 		message: "User Data fetched successfully",
	// 		data: userDetails,
	// 	});
	// } catch (error) {
	// 	return res.status(500).json({
	// 		success: false,
	// 		message: error.message,
	// 	});
	// }
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
