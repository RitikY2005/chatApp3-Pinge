
const globalErrorHandler= (err,req,res,next)=>{
    const errStatus= err.statusCode || 500;
    const msg = err.message || 'Something went wrong!';
	res.status(errStatus).json({
		success:false,
		message: msg ,
		error: err.stack
	});

	next();
}

export default globalErrorHandler;