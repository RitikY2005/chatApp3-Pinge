import ContactsContainer from '../../components/components/contactsContainer/ContactsContainer.jsx';
import ChatContainer from '../../components/components/chatContainer/ChatContainer.jsx';
import EmptyChatContainer from '../../components/components/emptyChatContainer/EmptyChatContainer.jsx';
import useMessagesStore from '@/slices/messages.slice.js';
import { useSocket } from '@/socketContext.jsx';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast.js';
import axiosInstance from '@/utils/axiosInstance.js';
import { MY_CONTACTS_ROUTE } from '@/constants/routes.constants.js';

const ChatPage = () => {
	const socketIo = useSocket();
	const {
		selectedChatData,
		selectedChatMessages,
		setSelectedChatMessages,
		setMyContacts,
	} = useMessagesStore();
	const { toast } = useToast();

	async function fetchMyContacts() {
		try {
			const res = await axiosInstance.get(MY_CONTACTS_ROUTE);

			if (res?.data?.success) {
				console.warn('mycontacts res->>', res?.data?.contacts);
				setMyContacts(res?.data?.contacts);
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}
	}

	useEffect(() => {
		socketIo.connect();

		socketIo.on('connect', () => {
			console.log(`connected to socket server with id: ${socketIo.id}`);
		});

		socketIo.on('error', (err) => {
			console.error(`some error occured with socket : ${err}`);
		});

		socketIo.on('custom_error', (err) => {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: err,
			});
		});

		socketIo.on('disconnect', () => {
			console.log(
				`disconnected from socket server with id: ${socketIo.id}`
			);
		});

		return () => {
			socketIo.disconnect();
			socketIo.off('connect');
			socketIo.off('disconnect');
			socketIo.off('error');
			socketIo.off('custom_error');
		};
	}, []);

	useEffect(() => {
		function handleDirectMessageResponse(message) {
			setSelectedChatMessages(message);
			fetchMyContacts();
		}

		socketIo.on('directMessageResponse', handleDirectMessageResponse);

		return () => {
			socketIo.off('directMessageResponse', handleDirectMessageResponse);
		};
	}, []);

	useEffect(() => {
		fetchMyContacts();
	}, []);

	return (
		<div className="w-screen h-screen flex">
			<ContactsContainer />

			{selectedChatData && selectedChatData._id ? (
				<ChatContainer />
			) : (
				<EmptyChatContainer />
			)}
		</div>
	);
};

export default ChatPage;
