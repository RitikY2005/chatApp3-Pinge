import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import {
	createChannel,
	fetchMyChannels,
} from '../controllers/channels.controller.js';
const router = Router();

router
	.post('/create-channel', isLoggedIn, createChannel)
	.get('/my-channels', isLoggedIn, fetchMyChannels);

export default router;
