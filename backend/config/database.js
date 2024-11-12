import mongoose from 'mongoose';

const connectToDatabase = async ()=>{
   try{
     const {connection} = await mongoose.connect(process.env.MONGODB_URI);
     console.log(`connected to mongodb at ${connection.host} to db ${connection.name}`)
   } catch(e){
     console.log('error in connecting to db->',{e});
     process.exit(1);
   }
}

export default connectToDatabase;