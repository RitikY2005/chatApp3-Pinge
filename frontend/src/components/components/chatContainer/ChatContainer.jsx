import useMessagesStore from '@/slices/messages.slice.js';
import { FaCaretLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChatHeader from './components/ChatHeader.jsx';
import ChatBody from './components/ChatBody.jsx';
import ChatFooter from './components/ChatFooter.jsx';

function ChatContainer() {
	const { selectedChatData, selectedChatType } = useMessagesStore();
	const navigate = useNavigate();

	return (
		<div
			className={`${selectedChatData._id ? 'flex' : 'hidden'}  flex-1 h-full  flex-col`}
		>
			<ChatHeader />
			<ChatBody />
			<ChatFooter />
		</div>
	);
}

export default ChatContainer;
