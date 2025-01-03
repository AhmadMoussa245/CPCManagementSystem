import express from 'express';
import morgan from 'morgan';

const app=express();

app.use(morgan('dev'));
app.use(express.json());


// app.all('*',(req,res,next)=>{
//     next(new AppError(
//         `Can't find ${req.originalUrl}!`,404
//     ));
// });

// app.use(globalErrorHandler);

export default app;