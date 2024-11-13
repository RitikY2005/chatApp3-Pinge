import { useState, useRef, useEffect } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '@/socketContext.jsx';
import useAppStore from '@/slices/user.slice.js';
import useMessagesStore from '@/slices/messages.slice.js';

function ChatFooter() {
	const socketIo = useSocket();
	const { userInfo } = useAppStore();
	const { selectedChatData } = useMessagesStore();
	const [messageInput, setMessageInput] = useState('');
	const emojiRef = useRef();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	function handleInputChange(e) {
		const { name, value } = e.target;
		setUserInput({
			...userInput,
			[name]: value,
		});
	}

	function handleMouseDown(e) {
		if (emojiRef && !emojiRef.current.contains(e.target)) {
			setShowEmojiPicker(false);
		}
	}

	function sendDirectMessage() {
		if (!messageInput) return;

		const data = {
			sender: userInfo._id,
			receiver: selectedChatData._id,
			message: messageInput,
			messageType: 'text',
		};

		socketIo.emit('directMessage', data);

		setMessageInput('');
	}

	function handlePressEnter(e) {
		const { key } = e;
		if (key === 'Enter') {
			sendDirectMessage();
		}
	}

	useEffect(() => {
		document.addEventListener('mouseup', handleMouseDown);

		return () => {
			document.removeEventListener('mouseup', handleMouseDown);
		};
	}, []);

	return (
		<div className="w-full flex items-center gap-3 px-4 sm:px-6 bg-transparent py-4 ">
			<div className="flex-1 flex items-center pr-4 gap-3 rounded-md bg-popover text-popover-foreground relative">
				<input
					type="text"
					placeholder="Type your message..."
					value={messageInput}
					onKeyUp={handlePressEnter}
					onChange={(e) => setMessageInput(e.target.value)}
					name="message"
					className="flex-1 py-3 rounded-md px-3  outline-none"
				/>
				<FiPaperclip className="text-2xl cursor-pointer font-bold" />
				<RiEmojiStickerLine
					className="text-2xl cursor-pointer font-bold"
					onClick={() => setShowEmojiPicker((prev) => !prev)}
				/>
				<div
					className="absolute bottom-[50px] right-[20px]  h-auto "
					ref={emojiRef}
				>
					<EmojiPicker
						open={showEmojiPicker}
						autoFocusSearch={false}
						theme="dark"
						width="350px"
						lazyLoadEmojis={true}
						onEmojiClick={(emojiData) =>
							setMessageInput((prev) => prev + emojiData.emoji)
						}
					/>
				</div>
			</div>

			<div
				className="bg-primary text-primary-foreground p-4 text-lg rounded-md cursor-pointer"
				onClick={sendDirectMessage}
			>
				<IoSend />
			</div>
		</div>
	);
}

export default ChatFooter;
