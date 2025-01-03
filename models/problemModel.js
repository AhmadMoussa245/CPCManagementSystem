import mongoose from "mongoose";

const problemSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'problem must have a name'],
            unique:true
        },
        description:{
            type:String,
            required:[true,'problem must have a description']
        },
        timeLimit:{
            type:Number,
            required:[true,'problem must have a time limit']
        },
        memoryLimit:{
            type:Number,
            required:[true,'problem must have a memory limit']
        },
        testCases:{
            type:String,
            required:[true,'problem must have testCases'],
            select:false
        }
    }
);

const Problem=mongoose.model('Problem',problemSchema);

export default Problem;