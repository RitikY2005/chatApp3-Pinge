import asyncHandler from '../middlewares/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import Users from '../models/users.model.js';
import Messages from '../models/messages.model.js';
import mongoose from 'mongoose';

export const fetchAllContacts = asyncHandler(async (req, res, next) => {
	const { searchTerm } = req.params;
	const { id } = req.user;
	const userId = new mongoose.Types.ObjectId(id);
	if (!searchTerm) {
		return next(new CustomError('Search term is required!', 400));
	}

	const cleanedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
	const searchRegEx = new RegExp(cleanedSearchTerm);

	try {
		const contacts = await Users.find({
			$and: [
				{
					$or: [
						{ email: searchRegEx },
						{ firstName: searchRegEx },
						{ lastName: searchRegEx },
					],
				},
				{
					_id: { $ne: userId },
				},
			],
		}).exec();

		res.status(200).json({
			success: true,
			message: 'fetched all contacts.',
			contacts,
		});
	} catch (e) {
		return next(new CustomError('Could not find contacts!', 404));
	}
});

export const fetchMyContacts = asyncHandler(async (req, res, next) => {
	const { id } = req.user;
	const userId = new mongoose.Types.ObjectId(id);

	try {
		const contacts = await Messages.aggregate([
			{
				$match: {
					$or: [{ sender: userId }, { receiver: userId }],
				},
			},

			{
				$addFields: {
					otherUser: {
						$cond: {
							if: { $eq: ['$sender', userId] },
							then: '$receiver',
							else: '$sender',
						},
					},
				},
			},

			{
				$group: {
					_id: '$otherUser',
					latestMessage: { $last: '$$ROOT' },
				},
			},

			{
				$sort: { 'latestMessage.timestamps': -1 },
			},

			{
				$lookup: {
					from: 'users',
					localField: '_id',
					foreignField: '_id',
					as: 'userInfo',
				},
			},

			{
				$unwind: '$userInfo',
			},

			{
				$project: {
					_id: 0,
					talkedWith: '$userInfo',
					latestMessage: 1,
				},
			},
		]).exec();

		return res.status(200).json({
			success: true,
			message: 'fetched all contacts',
			contacts,
		});
	} catch (e) {
		console.log('mycontacts->>>', e);
		return next(new CustomError('Could not fetch contacts', 500));
	}
});
