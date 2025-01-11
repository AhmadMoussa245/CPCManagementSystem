import catchAsync from "../utils/catchAsync.js";
import Question from "../models/questionModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import Solution from "../models/solutionModel.js";

const scoreBoard=catchAsync(async(req,res,next)=>{
    const now = new Date();
    const contestStartTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()-5,
        10,0,0,0
    );
    const stats=await Solution.calcUserStats(
        contestStartTime
    );
    res.status(200).json({
        status:'success',
        data:{
            stats
        }
    });
});

const sendQuestion=catchAsync(async(req,res,next)=>{
    const question=await Question.create({
        description:req.body.description,
        userId:req.user.id,
        problemId:req.params.id
    });

    res.status(201).json({
        status:'success',
        data:{
            question
        }
    });
});

const getAllUsers=catchAsync(async(req,res,next)=>{
    const users=await User.find();
    
    res.status(200).json({
        status:'success',
        result:users.length,
        data:{
            users
        }
    });
});

const updateUser=catchAsync(async(req,res,next)=>{
    if(req.body.password){
        req.body.password=await bcrypt.hash(
            req.body.password,10
        );
    }
    const user=await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true,
            runValidators:true
        }
    );
    if(!user){
        return next(new AppError(
            'user not found',404
        ));
    };
    res.status(200).json({
        status:'success',
        data:{
            data:user
        }
    });
});

const deleteUser=catchAsync(async(req,res,next)=>{
    const user=await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new AppError(
            'user not found',404
        ));
    };
    res.status(204).json({
        status:'success',
        data: null
    });
});

export default{
    scoreBoard,
    sendQuestion,
    getAllUsers,
    updateUser,
    deleteUser
};