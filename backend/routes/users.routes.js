import { Router } from 'express';
import {
	registerUser,
	loginUser,
	logoutUser,
	uploadUserAvatar,
	updateProfile,
} from '../controllers/users.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router
	.get('/logout', logoutUser)
	.post('/register', registerUser)
	.post('/login', loginUser)
	.post(
		'/upload-avatar',
		isLoggedIn,
		upload.single('avatar'),
		uploadUserAvatar
	)
	.post('/update-profile', isLoggedIn, updateProfile);

export default router;
