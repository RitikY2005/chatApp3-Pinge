import asyncHandler from '../middlewares/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import Users from '../models/users.model.js';
import Channels from '../models/channels.model.js';
import mongoose from 'mongoose';

export const createChannel = asyncHandler(async (req, res, next) => {
	const { participants, title } = req.body;
	const { id } = req.user;

	if (!title) {
		return next(new CustomError('All fields are required!', 400));
	}

	if (participants.length == 0) {
		return next(
			new CustomError('channel needs atleast one participant', 400)
		);
	}

	const admin = await Users.findById(id);
	if (!admin) {
		return next(new CustomError('Channel needs an admin!', 400));
	}

	const validParticipants = await Users.find({
		_id: { $in: participants },
	}).exec();

	if (validParticipants.length !== participants.length) {
		return next(
			new CustomError('There are some invalid users in participants', 400)
		);
	}

	const newChannel = await Channels.create({
		admin: id,
		participants,
		title,
	});

	if (!newChannel) {
		return next(new CustomError('Channel could not be created!', 500));
	}

	res.status(200).json({
		success: true,
		message: 'Channel created successfully',
		newChannel,
	});
});

export const fetchMyChannels = asyncHandler(async (req, res, next) => {
	const { id } = req.user;
	const userId = new mongoose.Types.ObjectId(id);

	try {
		const channels = await Channels.aggregate([
			{
				$match: {
					$or: [
						{ admin: userId },
						{ participants: { $in: [userId] } },
					],
				},
			},
			{
				$lookup: {
					from: 'messages',
					localField: 'messages',
					foreignField: '_id',
					as: 'messageDetails',
				},
			},
			{
				$addFields: {
					// Add a field for the latest message by sorting messages by timestamp
					latestMessage: {
						$arrayElemAt: [
							{
								$sortArray: {
									input: '$messageDetails',
									sortBy: { timestamps: -1 },
								},
							},
							0,
						],
					},
				},
			},
			{
				$project: {
					channelInfo: {
						$mergeObjects: [
							{ _id: '$_id' },
							{ admin: '$admin' },
							{ participants: '$participants' },
							{ title: '$title' },
						],
					},
					latestMessage: 1,
				},
			},
			{
				$sort: { 'latestMessage.timestamps': -1 },
			},
		]).exec();

		res.status(200).json({
			success: true,
			message: 'Channel created successfully',
			channels,
		});
	} catch (e) {
		console.log('channel fetchin->>', e);
		return next(new CustomError('Could not fetch Channels!', 500));
	}
});

export const fetchChannelHistory = asyncHandler(async (req, res, next) => {
	const { channelId } = req.body;

	if (!channelId) {
		return next(new CustomError('ChanelID is required!', 400));
	}

	try {
		const channelHistory = await Channels.findById(channelId)
			.select('messages, -_id')
			.populate({ path: 'messages', populate: { path: 'sender' } });

		res.status(200).json({
			success: true,
			message: 'Channel created successfully',
			channelHistory: channelHistory?.messages,
		});
	} catch (e) {
		console.log('channel fetchin->>', e);
		return next(new CustomError('Could not fetch Channels!', 500));
	}
});
