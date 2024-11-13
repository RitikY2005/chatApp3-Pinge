import { io } from 'socket.io-client';
import { NODE_ENV, BACKEND_URL } from './constants/routes.constants.js';
import useAppStore from './slices/user.slice.js';
import { createContext, useContext, useState, useEffect } from 'react';

const URL = NODE_ENV === 'production' ? undefined : BACKEND_URL;

const socketContext = createContext(null);

export function SocketProvider({ children }) {
	const { userInfo } = useAppStore();

	const socketInstance = io(URL, {
		autoConnect: false,
		query: { userId: userInfo?._id.toString() },
	});

	// useEffect(() => {
	// 	const socketInstance = io(URL, {
	// 		autoConnect: false,
	// 		query: { userId: userInfo?._id.toString() },
	// 	});

	// 	setSocket(socketInstance);

	// 	// Cleanup function: Disconnect the socket when userInfo changes or component unmounts
	// 	return () => {
	// 		socketInstance.disconnect();
	// 	};
	// }, [userInfo]);

	return (
		<socketContext.Provider value={socketInstance}>
			{children}
		</socketContext.Provider>
	);
}

export function useSocket() {
	const context = useContext(socketContext);
	if (!context)
		throw new Error('useSocket must be used inside socketProvider');
	return context;
}
