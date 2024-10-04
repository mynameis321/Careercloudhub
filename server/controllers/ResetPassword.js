const mailSender = require('../utils/mailSender');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Applicant = require('../models/Applicant');
const Company = require('../models/Company');

require('dotenv').config();

// resetPasswordToken-> so that we can identify the user who is reseting the password,
// send Frontend link to enter reset password details
exports.resetPasswordToken = async(req,res)=>{
    try{
        //fetch email
        const email = req?.body?.email;
		
        //authenticate user
        const userApplicant = await Applicant.findOne({ email: email }).select("-password");
        let User = null;
		if (!userApplicant) {
            const userCompany = await Company.findOne({ email: email }).select("-password");
			if(!userCompany){
                return res.json({
                    success: false,
                    message: `${email} not registered`,
                });
            }
            User = Company;
		}
        else User = Applicant;
        
        //create token for authenticating the user during the reset password link
        const token = crypto.randomUUID();

        //now fetching the user for which token is created and then saving the token in the db
        const updatedDetails = await User.findOneAndUpdate(
            {email: email},
            {
                token: token,
                resetPaswordExpiresIn: Date.now() + 5*60*1000 
            },
            {new: true}
        ).select("-password");

        //createing the reset password frontend link 
        let url = `${process.env.BASE_URL}/update-password/${updatedDetails?.accountType}/${token}`;

        //send mail containing link
        await mailSender(
            email,
            "Reset Password Mail by CareerCloudHub",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        //return response
        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    }catch(err){
        console.log("Failed to send reset password mail",err);
		return res.status(500).json({
			success: false,
			message: `Something went wrong`,
		});
    }
}


//resetPassword-> user will click on the link and enter the password and it will be updated in db

exports.resetPassword = async(req,res)=>{
    try{
        //fetch data from body
        const {newPassword,confirmNewPassword,accountType,token} = req.body;
        // console.log(newPassword,confirmNewPassword,accountType,token);
        
        //validate data
        if(!newPassword || !confirmNewPassword || !accountType){
            return res.status(400).json({
                success: false,
                message: "User details not found"
            });
        }
        
        if(newPassword != confirmNewPassword){
            return res.status(401).json({
                success: false,
                message: "Password doesn't match. Please enter correct password"
            });
        }

        const User = accountType === "Applicant" ? Applicant : (
            accountType === "Company" ? Company : ""
        );

        // console.log(User);

        //fetch data through token from db and validate it
        const userDetails = await User.findOne({token: token});
        // console.log(userDetails);
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            });
        }

        //check if token is expired or not
        if(userDetails.resetPaswordExpiresIn < Date.now()){
            return res.status(401).json({
                success: false,
                message: "Token expired. Please try again"
            });
        }

        //hash password
        const encryptedPassword = await bcrypt.hash(newPassword,10);

        //update password
        await User.findOneAndUpdate(
            {token},
            {
                password: encryptedPassword
            },
            {new: true}
        );

        //return response
        res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        });

    }catch(err){
        console.log(err);
        console.log("Failed to reset password");
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });        
    }
}