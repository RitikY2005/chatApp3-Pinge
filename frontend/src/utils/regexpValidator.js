
const isEmailValid= (email)=>{
	return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}


const isPasswordValid=(password)=>{
	return password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*._-]).{6,}$/);
}

export {
	isEmailValid,
	isPasswordValid
}