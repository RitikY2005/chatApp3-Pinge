import { Schema, model } from 'mongoose';

const channelsSchema = new Schema(
	{
		admin: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Users',
				required: true,
			},
		],
		messages: [{ type: Schema.Types.ObjectId, ref: 'Messages' }],
		title: {
			type: String,
			trim: true,
			required: true,
			minlength: [3, 'Name of channel should be atleast 3 characters.'],
		},
		description: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const Channels = model('Channels', channelsSchema);

export default Channels;
