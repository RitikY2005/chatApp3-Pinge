
const asyncHandler = (fn)=>{
	return (req,res,next)=>{
		fn(req,res,next).catch(err=>next(new Error(err.message || 'Something went wrong')));
	}
}

export default asyncHandler;