import useMessagesStore from '@/slices/messages.slice.js';
import useAppStore from '@/slices/user.slice.js';
import { FaCaretLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChatHeader from './components/ChatHeader.jsx';
import ChatBody from './components/ChatBody.jsx';
import ChatFooter from './components/ChatFooter.jsx';
import { useState, useEffect } from 'react';
import {
	CHAT_HISTORY_ROUTE,
	CHANNEL_HISTORY_ROUTE,
} from '@/constants/routes.constants.js';
import axiosInstance from '@/utils/axiosInstance.js';
import { useToast } from '@/hooks/use-toast.js';

function ChatContainer() {
	const { userInfo } = useAppStore();
	const { selectedChatData, selectedChatType, setSelectedChatMessages } =
		useMessagesStore();
	const navigate = useNavigate();
	const { toast } = useToast();

	async function fetchDMChatHistory() {
		const data = {
			user1: userInfo._id,
			user2: selectedChatData._id,
		};

		try {
			const res = await axiosInstance.post(CHAT_HISTORY_ROUTE, data);

			if (res?.data?.success) {
				setSelectedChatMessages(res?.data?.messages);
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}
	}

	async function fetchChannelChatHistory() {
		const data = {
			channelId: selectedChatData._id,
		};

		try {
			const res = await axiosInstance.post(CHANNEL_HISTORY_ROUTE, data);

			if (res?.data?.success) {
				console.error('channel history->>', res?.data?.channelHistory);
				setSelectedChatMessages(res?.data?.channelHistory);
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
		if (
			selectedChatType === 'contact' &&
			selectedChatData._id != null &&
			selectedChatData._id !== ''
		)
			fetchDMChatHistory();
		if (
			selectedChatType === 'channel' &&
			selectedChatData._id != null &&
			selectedChatData._id !== ''
		)
			fetchChannelChatHistory();
	}, [selectedChatData, selectedChatType]);

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
