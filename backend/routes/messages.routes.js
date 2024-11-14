import { Router } from 'express';
import { uploadMessageFile } from '../controllers/messages.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const router = Router();

router.post(
	'/upload-file',
	upload.single('file'),
	isLoggedIn,
	uploadMessageFile
);

export default router;
