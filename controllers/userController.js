import catchAsync from "../utils/catchAsync.js";
import Solution from "../models/solutionModel.js";
import Question from "../models/questionModel.js";
import User from "../models/userModel.js";
import {fileURLToPath} from "url";
import path from "path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const sendSolution=catchAsync(async(req,res,next)=>{
    
    if(req.file){
        req.body.code=req.file.filename;
    }else{
        const fileName=req.user.username+'-'+Date.now();
        fs.writeFile(
            path.join(__dirname,
                '../uploads/solutions',
                fileName
            ),
            req.body.code,
            (err)=>{
                return next(new AppError(
                    'failed to upload solution',500
                ))
            }
        )
        req.body.code=fileName;
    }
    const solution=await Solution.create({
        code:req.body.code,
        createdAt:Date.now(),
        userId:req.user.id,
        problemId:req.params.id
    });
    
    res.status(201).json({
        status:'success',
        data:{
            solution
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
    sendSolution,
    sendQuestion,
    getAllUsers,
    updateUser,
    deleteUser
};