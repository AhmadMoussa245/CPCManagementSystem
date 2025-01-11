import mongoose from "mongoose";

const userSchema=mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,'must have a username'],
            unique:true,
            lowercase:true
        },
        password:{
            type:String,
            required:[true,'must have a password'],
            select:false
        },
        role:{
            type:String,
            default:'user',
            enum:['user','admin']
        }
    }
)

const User=mongoose.model('User',userSchema);

export default User;