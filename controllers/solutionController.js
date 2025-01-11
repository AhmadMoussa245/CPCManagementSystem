import Solution from "../models/solutionModel.js";
import Problem from "../models/problemModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {fileURLToPath} from "url";
import fs from "node:fs";
import path from "path";
import APIFeatures from "../utils/apiFeatures.js";
import compile from "../utils/compile.js";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const sendFileSolution=catchAsync(async(req,res,next)=>{
    req.body.code=req.file.path;

    const solution=await Solution.create({
        code:req.body.code,
        createdAt:Date.now(),
        userId:req.user.id,
        problemId:req.params.id
    });

    const problem = await Problem
    .findById(req.params.id).select('+testCases');
    if (!problem) {
        Solution.findByIdAndDelete(solution.id);
        return next(new AppError(
            'Problem not found', 404
        ));
    }
    const solutionOutputFile = path.join(
        __dirname,
        '../uploads/solutionsOutput',
        req.user.username+'-'+Date.now().toString(),
    );
    const testCaseFile = problem.testCases;
    const testCasesOutputFile = path.join(
        __dirname,
        '../uploads/testCasesOutput',
        `${problem.name}-testCasesOutput`
    );
    const {timeLimit,memoryLimit}=problem;
    const result =await compile(
        req.file.path,
        solutionOutputFile,
        testCaseFile,
        testCasesOutputFile,
        timeLimit,
        memoryLimit
    );
    solution.status=result.verdict;
    await solution.save();

    res.status(201).json({
        status:'success',
        data:{
            solution,
            verdict: result.status,
            details: result.details,
        }
    });
});

const sendTextSolution=catchAsync(async(req,res,next)=>{
    const fileName=req.user.username+'-'+Date.now();
    const filePath=path.join(__dirname,
        '../uploads/solutions',
        fileName
    );

    fs.writeFile(
        filePath,
        req.body.code,
        (err)=>{
            return next(new AppError(
                'failed to upload solution',500
            ))
        }
    );
    req.body.code=filePath;   

    const solution=await Solution.create({
        code:req.body.code,
        createdAt:Date.now(),
        userId:req.user.id,
        problemId:req.params.id
    });

    const problem = await Problem
    .findById(req.params.id).select('+testCases');
    if (!problem) {
        Solution.findByIdAndDelete(solution.id);
        return next(new AppError(
            'Problem not found', 404
        ));
    }
    const testCaseFile = problem.testCases;
    const testCasesOutputFile = path.join(
        __dirname,
        '../uploads/testCasesOutput',
        `${problem.name}-testCasesOutput`
    );
    const {timeLimit,memoryLimit}=problem;
    const result =await compile(
        filePath,
        testCaseFile,
        testCasesOutputFile,
        timeLimit,
        memoryLimit
    );
    solution.status=result.verdict;
    await solution.save();

    res.status(201).json({
        status:'success',
        data:{
            solution,
            verdict: result.status,
            details: result.details,
        }
    });
});

const getAllSolutions=catchAsync(async(req,res,next)=>{
    let solutions=new APIFeatures(
        Solution.find(),req.query
    ).filter().sort().limitFields();
    
    const now = new Date();
    const contestStartTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()-5,
        10,0,0,0
    );
    const penalty= await Solution.calcPenalty(
        contestStartTime
    );
    
    solutions=await solutions.query;
    
    res.status(200).json({
        status:'success',
        result:solutions.length,
        penalty,
        data:{
            solutions,
        }
    });
});

const getSolution=catchAsync(async(req,res,next)=>{
    const solution=await Solution.findById(req.params.id);
    if(!solution){
        return next(new AppError(
            'solution not found',404
        ));
    };
    res.status(200).json({
        status:'success',
        data:{
            solution
        }
    });
});

const updateSolution=catchAsync(async(req,res,next)=>{
    const status=req.body.status
    const solution=await Solution.findByIdAndUpdate(
        req.params.id,
        {status},
        {
            new:true,
            runValidators:true
        }
    );
    if(!solution){
        return next(new AppError(
            'solution not found',404
        ));
    };
    res.status(200).json({
        status:'success',
        data:{
            data:solution
        }
    });
});

const deleteAllSolutions=catchAsync(async(req,res,next)=>{
    await Solution.deleteMany();
    res.status(204).json({
        status:'success',
        data: null
    });
});

export default{
    sendFileSolution,
    sendTextSolution,
    getAllSolutions,
    getSolution,
    updateSolution,
    deleteAllSolutions
};