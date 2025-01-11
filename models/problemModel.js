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
            default:1000
        },
        memoryLimit:{
            type:Number,
            default:256*1024*1024
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