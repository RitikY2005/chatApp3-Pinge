import ContactsContainer from '../../components/components/contactsContainer/ContactsContainer.jsx';
import ChatContainer from '../../components/components/chatContainer/ChatContainer.jsx';
import EmptyChatContainer from '../../components/components/emptyChatContainer/EmptyChatContainer.jsx';
import useMessagesStore from '@/slices/messages.slice.js';

const ChatPage = () => {
	const { selectedChatData } = useMessagesStore();
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
