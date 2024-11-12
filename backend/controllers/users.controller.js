import asyncHandler from '../middlewares/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import Users from '../models/users.model.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production' ? true : false,
	sameSite: process.env.NODE_ENV === 'production' ? 'None' : '',
	maxAge: 3 * 24 * 60 * 60 * 1000,
};

export const registerUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new CustomError('Email and Password is required!', 400));
	}

	const userExist = await Users.findOne({ email });
	if (userExist) {
		return next(new CustomError('User already registered,try login!', 400));
	}

	const newUser = await Users.create({ email, password });

	if (!newUser) {
		return next(
			new CustomError('Could not create account,try again!', 500)
		);
	}

	const token = await newUser.generateJWT();

	res.cookie('token', token, cookieOptions);

	newUser.password = undefined;

	res.status(200).json({
		success: true,
		message: 'User registered successfully!',
		newUser,
	});
});

export const loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new CustomError('Email and Password is required!', 400));
	}

	const user = await Users.findOne({ email }).select('+password');

	if (!user) {
		return next(
			new CustomError('User not found,please register first!', 404)
		);
	}

	const passwordMatched = await user.comparePassword(password);

	if (!passwordMatched) {
		return next(new CustomError('Password or email is invalid!', 400));
	}

	const token = await user.generateJWT();

	res.cookie('token', token, cookieOptions);

	user.password = undefined;

	res.status(200).json({
		success: true,
		message: 'User logged in successfully!',
		user,
	});
});

export const logoutUser = asyncHandler(async (req, res, next) => {
	res.cookie('token', '', { maxAge: 1 });

	res.status(200).json({
		success: true,
		message: 'User logged out successfully!',
	});
});

export const uploadUserAvatar = asyncHandler(async (req, res, next) => {
	const { id } = req.user;

	const user = await Users.findById(id);

	if (!user) {
		return next(new CustomError('User not found!', 404));
	}

	if (req.file) {
		try {
			// delete the precious avatar on cloudinary
			await cloudinary.v2.uploader.destroy(
				user?.avatar?.public_id || 'randomAss'
			);

			const result = await cloudinary.v2.uploader.upload(req.file.path, {
				folder: 'chatApp',
				width: 200,
				height: 200,
				gravity: 'face',
				crop: 'thumb',
			});

			if (result) {
				user.avatar.public_id = result.public_id;
				user.avatar.secure_url = result.secure_url;
			}
		} catch (e) {
			console.log({ e });
			return next(new CustomError('Avatar could not be uploaded!', 500));
		}

		// emoty the uploads folder ->

		for (const f of await fs.readdir('uploads/')) {
			fs.unlink(`uploads/${f}`);
		}
	}

	await user.save();

	res.status(200).json({
		success: true,
		message: 'Image uploaded successfully!',
		user,
	});
});

export const updateProfile = asyncHandler(async (req, res, next) => {
	const { firstName, lastName, colorPreference } = req.body;
	const { id } = req.user;

	if (!firstName || !lastName || !colorPreference) {
		return next(new CustomError('All fields are required!', 400));
	}

	const user = await Users.findById(id);

	if (!user) {
		return next(new CustomError('Unauthorized,please login!', 403));
	}

	user.firstName = firstName;
	user.lastName = lastName;
	user.colorPreference = colorPreference;

	await user.save();

	user.password = undefined;

	res.status(200).json({
		success: true,
		message: 'Profile updated successfully!',
		user,
	});
});
