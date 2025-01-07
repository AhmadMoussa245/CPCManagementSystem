import catchAsync from "../utils/catchAsync.js";
import Solution from "../models/solutionModel.js";
import {fileURLToPath} from 'url'
import path from 'path';
import fs from 'node:fs';
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

export default{
    sendSolution,
};