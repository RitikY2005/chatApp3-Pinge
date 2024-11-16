import Messages from '../models/messages.model.js';
import Channels from '../models/channels.model.js';

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

const handleChannelMessage = async (io, socket, msg) => {
	const {
		channelId,
		admin,
		sender,
		message,
		messageType,
		file,
		participants,
	} = msg;
	if (!channelId || !admin || !sender || !messageType) {
		return socket.emit(
			'custom_error',
			'sender,receiver,message type are required!'
		);
	}

	try {
		const newMessage = await Messages.create({
			sender,
			message,
			messageType,
			file,
		});

		const channel = await Channels.findByIdAndUpdate(channelId, {
			$push: { messages: newMessage._id },
		});

		if (!channel) {
			return socket.emit('custom_error', 'channel not found!');
		}

		const finalMessage = await Messages.findById(newMessage._id).populate(
			'sender'
		);
		// see if admin is online and emit the event to him , he won't be in participants array
		const finalMessageData = {
			channelId,
			...finalMessage.toObject(),
		};
		const adminSocketId = connectedUsers.get(admin);
		if (adminSocketId) {
			io.to(adminSocketId).emit(
				'channelMessageResponse',
				finalMessageData
			);
		}

		// whoever is online among participants , emit the message to them
		participants.map((participant) => {
			const participantSocket = connectedUsers.get(participant);
			if (participantSocket) {
				io.to(participantSocket).emit(
					'channelMessageResponse',
					finalMessageData
				);
			}
		});
	} catch (e) {
		console.log('channelerror->>', e);
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

	socket.on('channelMessage', (message) =>
		handleChannelMessage(io, socket, message)
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
