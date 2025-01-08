import mongoose from "mongoose";

const solutionSchema=mongoose.Schema(
    {
        code:{
            type:String,
            required:[true,'code required']
        },
        status:{
            type:String,
            default:'In Queue',
            enum:{
                values:[
                    'In Queue',
                    'Accepted',
                    'Wrong Answer',
                    'Time Limit Exceeded',
                    'Memory Limit Exceeded'
                ],
                message:`allowed status are : 'In Queue', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded'`
            }
        },
        createdAt:Date,
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'solution must belong to a user']
        },
        problemId:{
            type:mongoose.Schema.ObjectId,
            ref:'Problem',
            required:[true,'solution must belong to a problem']
        }
    }
);

solutionSchema.pre(/^find/,function(next){
    this.populate({
        path:'userId',
        select:'username'
    });
    this.populate({
        path:'problemId',
        select:'name'
    });
    next();
});

const Solution=mongoose.model('Solution',solutionSchema);

export default Solution;