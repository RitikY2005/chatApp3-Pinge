
class CustomError extends Error{

	constructor(msg,code=500){
		super(msg);
		this.statusCode=code 

		Error.captureStackTrace(this,this.constructor);
	}
}

export default CustomError;