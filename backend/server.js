import app from './app.js';
import connectToDatabase from './config/database.js';
import connectToCloudinary from './config/cloudinary.js';
connectToDatabase();
connectToCloudinary();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
	console.log(`server is up at port:${PORT} , http://localhost:${PORT}`);
});

export default server;