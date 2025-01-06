import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import {promisify} from 'util';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const signToken=id=>{
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

    const newUser=await User.create(req.body);
    const token=signToken(newUser._id);
    
    res.status(201).json({
        status:'success',
        token,
        data:{
            newUser
        }
    });
});

const login=catchAsync(async(req,res,next)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return next(new AppError(
            'enter username and password',400
        ));
    };

    const user=await User.findOne({username})
    .select('+password');
    if(!user){
        return next(new AppError(
            'wrong username or password',401
        ));
    };

    const correctPass=await bcrypt.compare(
        password,user.password
    );
    if(!correctPass){
        return next(new AppError(
            'wrong username or password',401
        ));
    };

    const token=signToken(user._id);
    res.status(200).json({
        status:'success',
        token,
        data:{
            user
        }
    })
});

const protect=catchAsync(async(req,res,next)=>{
    let token
    token = req.headers.authorization?.split(' ')[1];;
    if(!token){
        return next(new AppError(
            "you aren't loggend in",401)
        );
    }
    
    let decoded;
    decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    
    const currentUser=await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError(
            "user of this token don't exist",401
        ));
    };
    
    req.user=currentUser;
    next();
});

const restrictTo=(...roles)=>{
    return (req,res,next)=>{
        // roles ['admin','lead-guide']. role='user'
        if(!roles.includes(req.user.role)){
            return next(new AppError(
                'You do not have permession',403
            ));
        };
        next();
    };
};

export default{
    signup,
    login,
    protect,
    restrictTo
};