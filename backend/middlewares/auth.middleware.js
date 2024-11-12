import CustomError from '../utils/CustomError.js';
import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return next(new CustomError('Unauthorized,please login!', 403));
	}

	const decoded = await jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded) {
		return next(new CustomError('Unauthorized,please login!', 403));
	}

	req.user = decoded;

	next();
};
