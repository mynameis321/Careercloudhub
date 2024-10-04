const Applicant = require('../models/Applicant');
const Company = require('../models/Company');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const { passwordUpdated } = require('../mail/templates/passwordUpdate')
require('dotenv').config();

//sendOTP
exports.sendOTP = async(req,res)=>{
    try{
        //fetch email from request
        const { email } = req.body;

        //check if already registered or not by checking in db
        const applicant = await Applicant.findOne({email}).select("-password");

        if(applicant){
            return res.status(401).json({
                success:false,
                message:'Email Already Registered as Applicant'
            });
        }
        const company = await Company.findOne({email}).select("-password");

        if(company){
            return res.status(401).json({
                success:false,
                message:'Email Already Registered as Recruiter'
            });
        }

        let otp = 0;
        
        let result = null;
        
        do{
            //if new user then generate otp
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            // console.log("OTP Generated: ",otp);

            //check if otp generated is unique or not
            result = await OTP.findOne({otp: otp});
        }while(result) // if otp present in database then it will regenerate
        
        //if unique otp generated then make entry in database with email sent to the concerned user 

        //data to be mentioned in entry
        const otpPayload = {
            email,otp
        };

        //creating entry -> here otp and email will be taken from payload and date of creation is set default
        const otpBody = await OTP.create(otpPayload);
        // console.log("Entry of otp in db: ",otpBody);

        //return response
        return res.status(200).json({
            success:true,
            message:"OTP Sent Successfully",
        });

    }catch(err){
        console.log(err);
        console.log("OTP not sent. Something went wrong");
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

//SignUp
exports.companySignUp = async(req,res) =>{
    try{
        //data fetch from body
        const {
            companyName,
            gstNo,
            email,
            accountType,
            password,
            otp
        } = req.body;

        // console.log(req.body)

        //validate data 
        if(
            !companyName ||
            !gstNo ||
            !otp || 
            !email || 
            !password ||
            !accountType ){
            return res.status(401).json({
                success:false,
                message:'Insufficient Information.'
            });
        }

        //find most recent otp for a user -> there can be multiple otp's for a single user
        const response = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        // console.log(response);

        //verify otp-> 2 cases
        //1. No document with otp found in the collecetion OTP
        if(response.length === 0){
            return res.status(401).json({
                success:false,
                message:'OTP not found'
            });
        } 
        //otp entered by the user is incorrect
        else if(response[0].otp != otp){
            return res.status(401).json({
                success:false,
                message:'Incorrect OTP. Please enter the correct OTP'
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        
        //create user         
        const newUser = await Company.create({
            companyName,
            gstNo,
            email,
            accountType,
            password:hashedPassword,
        });


        //return response
        return res.status(200).json({
            success:true,
            newUser,
            message:"User registered successfully"
        });

    }catch(err){
        console.log(err);
        console.log("Signup Failed");
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again later."
        });
    }
}

exports.applicantSignUp = async(req,res) =>{
    try{
        //data fetch from body
        const {
            firstName,
            lastName,
            email,
            dob,
            accountType,
            password,
            otp
        } = req.body;

        // console.log(req.body)

        //validate data 
        if(
            !firstName ||
            !lastName ||
            !dob ||
            !otp || 
            !email || 
            !password ||
            !accountType ){
            return res.status(401).json({
                success:false,
                message:'Insufficient Information.'
            });
        }

        //find most recent otp for a user -> there can be multiple otp's for a single user
        const response = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        // console.log(response);

        //verify otp-> 2 cases
        //1. No document with otp found in the collecetion OTP
        if(response.length === 0){
            return res.status(401).json({
                success:false,
                message:'OTP not found'
            });
        } 
        //otp entered by the user is incorrect
        else if(response[0].otp != otp){
            return res.status(401).json({
                success:false,
                message:'Incorrect OTP. Please enter the correct OTP'
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        
        //create user         
        const newUser = await Applicant.create({
            firstName,
            lastName,
            dob,
            email,
            accountType,
            password:hashedPassword,
        });


        //return response
        return res.status(200).json({
            success:true,
            newUser,
            message:"User registered successfully"
        });

    }catch(err){
        console.log(err);
        console.log("Signup Failed");
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again later."
        });
    }
}

//Login
exports.companyLogin = async(req,res)=>{
    try{
        //fetch data from body
        const {email,password} = req.body;

        //validate data 
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Incomplete information. Enter all details."
            });
        }

        //check if user registered or not
        const user = await Company.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not registered. Please Signup."
            });
        }

        //compare passwords
        if(await bcrypt.compare(password,user.password)){
            //create token
            let jwtPayload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
                approve: user.approve
            }

            const token = jwt.sign(jwtPayload,process.env.JWT_SECRET,{
                expiresIn: "4h"
            });
            let tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 3,tokenExpiry.getMinutes() + 55);
            // tokenExpiry.setHours(tokenExpiry.getHours(),tokenExpiry.getMinutes(),tokenExpiry.getSeconds()+30);

            //insert token
            user.token = token;
            user.tokenExpiry = tokenExpiry;
            user.password = undefined;

            //send cookies
            const cookieOptions = {
                expires: new Date(Date.now() + 4*60*60*1000),
                httpOnly: true
            }

            res.cookie("token",token,tokenExpiry,cookieOptions).status(200).json({
                success: true,
                token,
                tokenExpiry,
                user,
                message: "User Logged In Successfully"
            });
        }
        else{
            //if password incorrect
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            });
        }
        
    }catch(err){
        console.log("Login Failed",err);
        return res.status(500).json({
            success: false,
            message: "Failed to Login"
        });
    }
}

//Login
exports.applicantLogin = async(req,res)=>{
    try{
        //fetch data from body
        const {email,password} = req.body;

        //validate data 
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Incomplete information. Enter all details."
            });
        }

        //check if user registered or not
        const user = await Applicant.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not registered. Please Signup."
            });
        }

        //compare passwords
        if(await bcrypt.compare(password,user.password)){
            //create token
            let jwtPayload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            const token = jwt.sign(jwtPayload,process.env.JWT_SECRET,{
                expiresIn: "4h"
            });
            
            let tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 3,tokenExpiry.getMinutes() + 55);

            //insert token
            user.token = token;
            user.tokenExpiry = tokenExpiry;
            user.password = undefined;

            //send cookies
            const cookieOptions = {
                expires: new Date(Date.now() + 4*60*60*1000),
                httpOnly: true
            }

            res.cookie("token",token,tokenExpiry,cookieOptions).status(200).json({
                success: true,
                token,
                tokenExpiry,
                user,
                message: "User Logged In Successfully"
            });
        }
        else{
            //if password incorrect
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            });
        }
        
    }catch(err){
        console.log("Login Failed",err);
        return res.status(500).json({
            success: false,
            message: "Failed to Login"
        });
    }
}

// changePassword
exports.changePassword = async(req,res)=>{
    try{
        //find user details
        const {
            accountType,
            oldPassword,
            newPassword
        } = req.body;

        if(!accountType || !oldPassword || !newPassword)
            return res.status(404).json({
               success: false,
               message: "User details not found" 
            });

        const User = accountType === "Applicant" ? Applicant : (
            accountType === "Company" ? Company : ""
        );

        const userDetails = await User.findById(req.user.id);
        
        //validate
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        
        //if old password does not match with password in db
        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            });
        }

        //hash new password
        const encryptedPassword = await bcrypt.hash(newPassword,10);

        //update in db 
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password: encryptedPassword},
            {new: true}
        ).select("-password");

        //send mail to user
        let name = (updatedUserDetails?.firstName + updatedUserDetails?.lastName) || 
                    updatedUserDetails?.companyName;
       
        let emailResponse = null; 
        do{

            emailResponse = await mailSender(
                updatedUserDetails?.email,
                "Password Change Mail from CareerCloudHub",
                passwordUpdated(
                    updatedUserDetails?.email,
                    name
                )
            );

        }while(!emailResponse);
        // console.log("Email sent Successfully",emailResponse?.response);

		// Return success response
		return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        });

    }catch(err){
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", err);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password"
		});
    }
}
