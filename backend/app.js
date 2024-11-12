import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware.js';
import usersRoutes from './routes/users.routes.js';
import contactsRoutes from './routes/contacts.routes.js';

config(); // load env variables
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(morgan('dev'));

// all major routes are here ->

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/contacts', contactsRoutes);

app.use('*', (req, res, next) => {
	res.status(404).json({
		success: false,
		message: 'Page not found->',
	});

	next();
});

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'welcome to the backend of infamous app pinge->',
	});
});

app.use(globalErrorHandler);

export default app;
