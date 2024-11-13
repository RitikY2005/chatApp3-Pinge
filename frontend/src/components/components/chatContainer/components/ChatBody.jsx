import { useSocket } from '@/socketContext.jsx';
import { useEffect, useState, useRef } from 'react';
import useMessagesStore from '@/slices/messages.slice.js';
import useAppStore from '@/slices/user.slice.js';
import moment from 'moment';

function ChatBody() {
	const socketIo = useSocket();
	const { selectedChatMessages, selectedChatType } = useMessagesStore();
	const { userInfo } = useAppStore();
	const scrollToLastRef = useRef();

	function renderMessages() {
		let lastDate = null;
		return selectedChatMessages.map((message) => {
			let currentDate = moment(message.timestamps).format('YYYY-DD-MM');
			let shouldShowDate = currentDate !== lastDate;
			lastDate = currentDate;

			return (
				<div key={message._id}>
					{shouldShowDate && (
						<div className="text-muted-foreground text-center">
							{moment(message.timestamps).format('LL')}
						</div>
					)}

					{selectedChatType === 'contact' &&
						reanderDMMessages(message)}
				</div>
			);
		});
	}

	function reanderDMMessages(message) {
		return (
			<div
				className={`w-full px-3 flex flex-col gap-1 justify-center ${userInfo._id !== message.sender ? 'items-start' : 'items-end'}`}
			>
				{message.messageType === 'text' && (
					<div
						className={`${userInfo._id !== message.sender ? 'bg-secondary text-secondary-foreground rounded-bl-none' : 'bg-primary text-primary-foreground rounded-br-none'} border rounded-xl p-2 max-w-[50%] drop-shadow-sm`}
					>
						{message.message}
					</div>
				)}
				<div className="text-xs text-muted-foreground">
					{moment(message.timestamps).format('LT')}
				</div>
			</div>
		);
	}

	useEffect(() => {
		// scroll to the last of div
		scrollToLastRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [selectedChatMessages]);

	return (
		<div className="flex-1 w-full p-3 overflow-y-auto space-y-3 scrollbar-hidden">
			{renderMessages()}
			<div ref={scrollToLastRef}></div>
		</div>
	);
}

export default ChatBody;
