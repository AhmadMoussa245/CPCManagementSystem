import Solution from "../models/solutionModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {fileURLToPath} from "url";
import fs from "node:fs";
import path from "path";

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
        );
        req.body.code=fileName;
    };

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

const getAllSolutions=catchAsync(async(req,res,next)=>{
    const solutions=await Solution.find();
    
    res.status(200).json({
        status:'success',
        result:solutions.length,
        data:{
            solutions
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
    sendSolution,
    getAllSolutions,
    getSolution,
    updateSolution,
    deleteAllSolutions
};