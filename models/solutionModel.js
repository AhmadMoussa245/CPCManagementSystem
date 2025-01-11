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
                    'Runtime Error',
                    'Compilation Error',
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

solutionSchema.statics.calcPenalty = async function (contestStartTime) {
    // Aggregation to calculate penalties for accepted and non-accepted solutions (excluding "In Queue")
    const penalties = await this.aggregate([
        {
            $match: {
                status: { $nin: ["In Queue"] },  // Exclude "In Queue" status
            },
        },
        {
            $project: {
                userId: 1,
                penaltyTime: {
                    $cond: {
                        if: { $eq: ["$status", "Accepted"] },  // If status is "Accepted"
                        then: {
                            $divide: [
                                { $subtract: ["$createdAt", contestStartTime] },
                                1000 * 60,  // Convert milliseconds to minutes
                            ],
                        },
                        else: 20,  // If not accepted, add 20 minutes penalty
                    },
                },
                status: 1,  // Include status for later grouping
            },
        },
        {
            $group: {
                _id: { userId: "$userId" },  // Group by userId
                totalPenalty: { $sum: "$penaltyTime" },  // Sum penalties for each user
            },
        },
        {
            // Sort the results by total penalty in ascending order
            $sort: { totalPenalty: 1 },
        }
    ]);

    return penalties;
};


const Solution=mongoose.model('Solution',solutionSchema);

export default Solution;