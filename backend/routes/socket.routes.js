import Messages from '../models/messages.model.js';

const connectedUsers = new Map();

const handleDirectMessage = async (io, socket, msg) => {
	const { sender, receiver, message, messageType, file } = msg;
	if (!sender || !receiver || !messageType) {
		return socket.emit(
			'custom_error',
			'sender,receiver,message type are required!'
		);
	}

	try {
		const newMessage = await Messages.create({
			sender,
			receiver,
			message,
			messageType,
			file,
		});

		// see if sender is online and emit the event to him
		const senderSocketId = connectedUsers.get(sender);
		if (senderSocketId) {
			io.to(senderSocketId).emit('directMessageResponse', newMessage);
		}

		const receiverSocketId = connectedUsers.get(receiver);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit('directMessageResponse', newMessage);
		}
	} catch (e) {
		return socket.emit('custom_error', 'could not save the message!');
	}
};

export default function socketRoutes(io, socket) {
	console.log(`client conected with socket id:${socket.id}`);

	const { userId } = socket.handshake.query;

	if (userId && userId !== undefined) {
		connectedUsers.set(userId, socket.id);
		console.log(`this user is online-> id:${userId} :${socket.id}`);
	} else {
		console.log(`user id not found->disconnecting!`);
		socket.disconnect();
	}

	socket.on('directMessage', (message) =>
		handleDirectMessage(io, socket, message)
	);

	socket.on('disconnect', () => {
		console.log(`client disconnected with socket id: ${socket.id}`);

		Array.from(connectedUsers.entries()).map(([uid, sid]) => {
			if (uid === userId) connectedUsers.delete(uid);
		});
		console.log('connectedUsers after delete->>', connectedUsers.entries());
		console.log(`this user is offline-> id:${userId} :${socket.id}`);
	});
}
