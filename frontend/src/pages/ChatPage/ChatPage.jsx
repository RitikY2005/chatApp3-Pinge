import ContactsContainer from '../../components/components/contactsContainer/ContactsContainer.jsx';
import ChatContainer from '../../components/components/chatContainer/ChatContainer.jsx';
import EmptyChatContainer from '../../components/components/emptyChatContainer/EmptyChatContainer.jsx';
import useMessagesStore from '@/slices/messages.slice.js';
import { useSocket } from '@/socketContext.jsx';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast.js';

const ChatPage = () => {
	const socketIo = useSocket();
	const { selectedChatData, setSelectedChatMessages } = useMessagesStore();
	const { toast } = useToast();
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
		}

		socketIo.on('directMessageResponse', handleDirectMessageResponse);

		return () => {
			socketIo.off('directMessageResponse', handleDirectMessageResponse);
		};
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
