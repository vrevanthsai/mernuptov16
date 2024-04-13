import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token base
export const requireSignIn =async (req,res,next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user=decode;
        next();
    }catch(error){
        console.log(error);
        
    }
}

// Admin access -middleware for /admin route
export const isAdmin =async (req,res,next) =>{
    try{
        const user =await userModel.findById(req.user._id) //user id from /login
        // admin verification
        if(user.role!==1){
            return res.status(201).send({ //changed 401 to 201 
                success:false,
                message: 'UnAuthorized Access'
            })
        }else{
            next();
        }
    }catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:'Error in admin middelware'
        })
    }
} 

// User access -middleware for /dashboard/user route(IsUser) if admin tries to access user's dashboard