import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config'

const singToken=id=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRE}
    );
};

const signup= catchAsync(async(req,res,next)=>{
    req.body.password=await bcrypt.hash(
        req.body.password,10
    );
    
    const newUser=await User.create(req.body)
    const token=singToken(newUser._id);
    

    res.status(201).json({
        status:'success',
        token,
        data:{
            newUser
        }
    })
})

export default{
    signup
}