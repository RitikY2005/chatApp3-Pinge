import { Router } from 'express';
import { fetchAllContacts } from '../controllers/contacts.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/all-contacts/:searchTerm', isLoggedIn, fetchAllContacts);

export default router;
