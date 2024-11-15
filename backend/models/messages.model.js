import { Schema, model } from 'mongoose';

const messagesSchema = new Schema({
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
		required: true,
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
	},
	message: {
		type: String,
		trim: true,
	},
	messageType: {
		type: String,
		enum: ['text', 'file'],
		default: 'text',
	},
	file: {
		secure_url: String,
		public_id: String,
	},
	timestamps: {
		type: Date,
		default: Date.now,
	},
});

const Messages = model('Messages', messagesSchema);

export default Messages;
