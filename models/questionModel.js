import mongoose from "mongoose";

const questionSchema=mongoose.Schema(
    {
        description:{
            type:String,
            required:[true,'question must have a desciption']
        },
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'question must belong to a user']
        },
        problemId:{
            type:mongoose.Schema.ObjectId,
            ref:'Problem',
            required:[true,'question must belong to a problem']
        }
    }
);

const Question=mongoose.model('Question',questionSchema);

export default Question;