import asyncHandler from '../middlewares/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

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
