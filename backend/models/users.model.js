import {Schema,model} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const usersSchema= new Schema({
   firstName:{
   	type:String,
   	trim:true,
   	minlength:[3,"Full Name must be atleast 3 characters"]
   },
   lastName:{
   	type:String,
   	trim:true,
   },
   email:{
   	type:String,
   	required:true,
   	lowercase:true,
   	unique:true,
   	trim:true
   },
   password:{
   	type:String,
   	required:true,
   	select:false,
      minlength:[6,"password must be atleast 6 characters!"]
   },
   colorPreference:{
   	type:String,
   },
   avatar:{
   	  secure_url:String,
   	  public_url:String
   }
},{
	timestamps:true
});



usersSchema.pre('save',async function (next){
   if(!this.isModified('password')) return next();

   this.password= await bcrypt.hash(this.password,10);
});

usersSchema.methods = {
   generateJWT: async function(){
      return await jwt.sign({id:this._id,email:this.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY});
   },
   comparePassword:async function(targetPassword){
      return await bcrypt.compare(targetPassword,this.password);
   }
}

const Users= model('Users',usersSchema);

export default Users;