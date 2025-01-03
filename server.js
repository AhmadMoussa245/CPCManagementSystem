import 'dotenv/config';
import app from './app.js';
import mongoose from 'mongoose';

const PORT=process.env.PORT
const DB=process.env.DB

mongoose.connect(DB)
.then(con=>console.log('DB Connection Success'));

const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});