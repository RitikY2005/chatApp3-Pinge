import { Router } from 'express';
import {
	uploadMessageFile,
	fetchDMChatHistory,
} from '../controllers/messages.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const router = Router();

router
	.post('/upload-file', upload.single('file'), isLoggedIn, uploadMessageFile)
	.post('/dm-chat-history', isLoggedIn, fetchDMChatHistory);

export default router;
