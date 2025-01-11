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

solutionSchema.statics.calcUserStats = async function (contestStartTime) {
    const results = await this.aggregate([
        {
            $match: {
                status: { $nin: ["In Queue"] }, // Exclude "In Queue" status
            },
        },
        {
            $project: {
                userId: 1,
                problemId: 1,
                penaltyTime: {
                    $cond: {
                        if: { $eq: ["$status", "Accepted"] }, // If status is "Accepted"
                        then: {
                            $divide: [
                                { $subtract: ["$createdAt", contestStartTime] },
                                1000 * 60, // Convert milliseconds to minutes
                            ],
                        },
                        else: {
                            $add: [ // Add actual time spent + 20 minutes penalty
                                {
                                    $divide: [
                                        { $subtract: ["$createdAt", contestStartTime] },
                                        1000 * 60, // Convert milliseconds to minutes
                                    ],
                                },
                                20, // Add 20 minutes penalty
                            ],
                        },
                    },
                },
                isAccepted: { $cond: { if: { $eq: ["$status", "Accepted"] }, then: true, else: false } },
            },
        },
        {
            $group: {
                _id: { userId: "$userId", problemId: "$problemId" }, // Group by userId and problemId
                totalPenalty: { $sum: "$penaltyTime" }, // Sum penalties for each user-problem pair
                isAccepted: { $max: "$isAccepted" }, // Check if this problem was accepted by the user
            },
        },
        {
            $group: {
                _id: "$_id.userId", // Group by userId
                totalPenalty: { $sum: "$totalPenalty" }, // Sum penalties for all problems by the user
                acceptedProblemsCount: { $sum: { $cond: { if: "$isAccepted", then: 1, else: 0 } } }, // Count distinct accepted problems
            },
        },
        {
            $lookup: {
                from: "users", // Name of the users collection
                localField: "_id", // The field in the current collection (userId)
                foreignField: "_id", // The field in the users collection
                as: "userDetails", // Output array field
            },
        },
        {
            $unwind: "$userDetails", // Flatten the userDetails array
        },
        {
            $project: {
                _id: 0, // Exclude the default _id
                userId: "$_id", // Include userId
                username: "$userDetails.username", // Include username
                totalPenalty: 1, // Include total penalty
                acceptedProblemsCount: 1, // Include the count of accepted problems
            },
        },
        {
            $sort: { totalPenalty: 1 }, // Sort by total penalty in ascending order
        },
    ]);

    return results;
};



const Solution=mongoose.model('Solution',solutionSchema);

export default Solution;