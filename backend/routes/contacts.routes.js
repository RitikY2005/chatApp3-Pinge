import { Router } from 'express';
import {
	fetchAllContacts,
	fetchMyContacts,
} from '../controllers/contacts.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
const router = Router();

router
	.get('/all-contacts/:searchTerm', isLoggedIn, fetchAllContacts)
	.get('/my-contacts', isLoggedIn, fetchMyContacts);

export default router;
