const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req,res,next) =>{
    try{
        //extract token
        const token = req.cookies.token || req.body.token || 
                        req.header("Authorization").replace("Bearer ","");
        
        //check if token found
        if(!token){
            return res.status(401).json({
                success:true,
                message: "Token not found"
            });
        }

        try{
            
            //Verify token
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            // console.log(decode);
            
            //inserting the token data in req body so we can authorize the user further
            req.user = decode;

        }catch(err){
            console.log("Invalid Token");
            console.log(err);
            return res.status(401).json({
                success: false,
                message: "Session Expired. Login Again"
            });
        }

        //calling authorization middleware
        next();

    }catch(err){
        console.log("Authentication Failed");
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Something went wrong. Authentication Failed"
        });
    }
}

exports.isApproved = async(req,res,next)=>{
    try{
        //if not approved 
        if(!req.user.approved){
            return res.status(403).json({
                success: false,
                message: "Account not Approved Yet"
            });
        }
        
        //if authorized then next
        next();

    }catch(err){
        console.log("Could not Approve account");
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Account cannot be approved. Please try againg later."
        });   
    }
}

exports.isApplicant = async(req,res,next)=>{
    try{
        //if no matching role
        if(req.user.accountType != "Applicant"){
            return res.status(403).json({
                success: false,
                message: "This is protected route for Applicants"
            });
        }
        
        //if authorized then next
        next();

    }catch(err){
        console.log("Authorization Failed");
        console.log(err);
        res.status(500).json({
            success: false,
            message: "User role cannot be verified. Please try again later"
        });   
    }
}

exports.isRecruiter = async(req,res,next)=>{
    try{
        //if no matching role
        if(req.user.accountType != "Company"){
            return res.status(403).json({
                success: false,
                message: "This is protected route for Company"
            });
        }
        
        //if authorized then next
        next();

    }catch(err){
        console.log("Authorization Failed");
        console.log(err);
        res.status(500).json({
            success: false,
            message: "User role cannot be verified. Please try again later"
        });   
    }
}

exports.isAdmin = async(req,res,next)=>{
    try{
        //if no matching role
        if(req.user.accountType != "Admin"){
            return res.status(403).json({
                success: false,
                message: "This is protected route for Admin"
            });
        }
        
        //if authorized then next
        next();

    }catch(err){
        console.log("Authorization Failed");
        console.log(err);
        res.status(500).json({
            success: false,
            message: "User role cannot be verified. Please try again later"
        });   
    }
}