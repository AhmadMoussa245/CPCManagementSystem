import Problem from '../models/problemModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import path from 'path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const getAllProblems=catchAsync(async(req,res,next)=>{
    const problems=await Problem.find();
    
    res.status(200).json({
        status:'success',
        result:problems.length,
        data:{
            problems
        }
    });
});

const getProblem=catchAsync(async(req,res,next)=>{
    const problem=await Problem.findById(req.params.id);
    if(!problem){
        return next(new AppError(
            'problem not found',404
        ));
    };
    res.status(200).json({
        status:'success',
        data:{
            problem
        }
    });
});

const createProblem=catchAsync(async(req,res,next)=>{
    const fileName=req.body.name+'-testCases';
    const filePath=path.join(__dirname,
        '../uploads/testCases',
        fileName
    );
    fs.writeFile(
        filePath,
        req.body.testCases,
        (err)=>{
            return next(new AppError(
                'failed to upload testCases',500
            ))
        }
    )
    req.body.testCases=filePath;
    
    const problem=await Problem.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            data:problem
        }
    });
});

const updateProblem=catchAsync(async(req,res,next)=>{
    const problem=await Problem.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true,
            runValidators:true
        }
    );
    if(!problem){
        return next(new AppError(
            'problem not found',404
        ));
    };
    res.status(200).json({
        status:'success',
        data:{
            data:problem
        }
    });
});

const deleteProblem=catchAsync(async(req,res,next)=>{
    const problem=await Problem.findByIdAndDelete(req.params.id);
    if(!problem){
        return next(new AppError(
            'problem not found',404
        ));
    };
    res.status(204).json({
        status:'success',
        data: null
    });
});

const deleteAllProblems=catchAsync(async(req,res,next)=>{
    await Problem.deleteMany();
    res.status(204).json({
        status:'success',
        data: null
    });
});

export default{
    getAllProblems,
    getProblem,
    createProblem,
    updateProblem,
    deleteProblem,
    deleteAllProblems
};