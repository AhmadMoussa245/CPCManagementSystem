export default (err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status = err.status || 'error';

    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }else{
        console.error('ERROR',{
            name:err.name,
            message:err.message,
            expiredAt:err.expiredAt,
            statusCode:err.statusCode,
            status:err.status
        });
        
        // send generic message
        res.status(500).json({
            status:'error',
            message:'Something went wrong'
        });
    };
};