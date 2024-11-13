import app from './app.js';
import connectToDatabase from './config/database.js';
import connectToCloudinary from './config/cloudinary.js';
import { Server } from 'socket.io';
import socketRoutes from './routes/socket.routes.js';
connectToDatabase();
connectToCloudinary();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
	console.log(`server is up at port:${PORT} , http://localhost:${PORT}`);
});

const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	},
});

io.on('connection', (socket) => socketRoutes(io, socket));

export default server;
