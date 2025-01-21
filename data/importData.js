import 'dotenv/config'
import fs from 'node:fs'
import mongoose from 'mongoose'
import User from '../models/userModel.js'
import Problem from '../models/problemModel.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);


mongoose.connect(process.env.DB).then(con=>{
    console.log('DB connection success')
})

//READ JSON FILE
const problems=JSON.parse(
    fs.readFileSync(`${__dirname}/problems.json`,'utf-8')
);
const users=JSON.parse(
    fs.readFileSync(`${__dirname}/users.json`,'utf-8')
);

//IMPORT DATA INTO DB
const importData=async()=>{
    try{
        await Problem.create(problems);
        await User.create(users);
        console.log('data loaded')
    }catch(err){
        console.log(err)
    }
    process.exit();
}

// DELETE ALL DATA FROM DB
const deleteData=async()=>{
    try{
        await Problem.deleteMany();
        await User.deleteMany();
        console.log('data deleted')
    }catch(err){
        console.log(err)
    }
    process.exit();
}
if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]=='--delete'){
    deleteData();
}
// console.log(process.argv)