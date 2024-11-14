import asyncHandler from '../middlewares/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import Users from '../models/users.model.js';
import Messages from '../models/messages.model.js';

export const uploadMessageFile = asyncHandler(async (req, res, next) => {
	const finalData = {};

	if (req.file) {
		try {
			// delete the precious avatar on cloudinary

			const result = await cloudinary.v2.uploader.upload(req.file.path, {
				folder: 'chatApp',
				resource_type: 'auto',
			});

			if (result) {
				finalData.public_id = result.public_id;
				finalData.secure_url = result.secure_url;
			}
		} catch (e) {
			console.log({ e });
			return next(new CustomError('File could not be uploaded!', 500));
		}

		// emoty the uploads folder ->

		for (const f of await fs.readdir('uploads/')) {
			fs.unlink(`uploads/${f}`);
		}
	}

	res.status(200).json({
		success: true,
		message: 'File uploaded successfully!',
		finalData,
	});
});

export const fetchDMChatHistory = asyncHandler(async (req, res, next) => {
	const { user1, user2 } = req.body;

	console.log('messages histroy->', req.body);
	if (!user1 || !user2) {
		return next(new CustomError('Both users are required!', 400));
	}

	const user1Exist = await Users.findById(user1);
	const user2Exist = await Users.findById(user2);

	if (!user1Exist || !user2Exist) {
		return next(new CustomError('One of the users is invalid!', 400));
	}

	const messages = await Messages.find({
		$or: [
			{ $and: [{ sender: user1 }, { receiver: user2 }] },
			{ $and: [{ sender: user2 }, { receiver: user1 }] },
		],
	}).exec();

	res.status(200).json({
		success: true,
		message: 'Chat histroy of two users!',
		messages,
	});
});
