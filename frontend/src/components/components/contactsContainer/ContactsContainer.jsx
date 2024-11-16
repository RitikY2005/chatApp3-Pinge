import ShowLogo from '../ShowLogo.jsx';
import { FaPlus } from 'react-icons/fa';
import NewDM from './components/NewDM.jsx';
import NewChannel from './components/NewChannel.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useMessagesStore from '@/slices/messages.slice.js';
import useAppStore from '@/slices/user.slice.js';
import { FaPen } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useNavigate } from 'react-router-dom';
import { LOGOUT_ROUTE } from '@/constants/routes.constants.js';
import { useToast } from '@/hooks/use-toast.js';
import axiosInstance from '@/utils/axiosInstance.js';
import { useEffect } from 'react';

function ContactsContainer() {
	const {
		selectedChatData,
		myContacts,
		setSelectedChatData,
		setSelectedChatType,
		setSelectedChatMessages,
		closeChat,
		myChannels,
	} = useMessagesStore();
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = useAppStore();
	const { toast } = useToast();

	async function handleLogout() {
		try {
			const res = await axiosInstance.get(LOGOUT_ROUTE);

			if (res?.data?.success) {
				setUserInfo(undefined);
				closeChat();
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}
	}

	function handleClickNewContact(contact) {
		setSelectedChatData(contact);
		setSelectedChatType('contact');
	}

	function handleClickNewChannel(channel) {
		const refindedChannel = {
			_id: channel._id,
			...channel.channelInfo,
		};

		setSelectedChatData(refindedChannel);
		setSelectedChatType('channel');
	}

	return (
		<div
			className={`w-full ${selectedChatData._id ? 'hidden sm:block' : ''} sm:w-[40%] md:w-[30%] h-full bg-background text-foreground border-r border-popover py-6 px-2 space-y-4 relative`}
		>
			<div className="w-full flex items-center justify-start mb-5">
				<ShowLogo />
			</div>

			<div className="font-mono text-lg tracking-wider flex justify-between items-center px-3 flex-nowrap text-gray-600">
				<p className="break-keep flex-1 whitespace-nowrap">
					DM MESSAGE
				</p>
				<div className="cursor-pointer hover:text-gray-400 transition-all ease-in-out duration-300">
					<NewDM />
				</div>
			</div>

			{myContacts.length > 0 && (
				<ScrollArea className="max-h-[35vh] overflow-y-scroll w-full bg-popover text-popover-foreground rounded-md p-4 scrollbar-hidden">
					{myContacts.map((contact) => {
						return (
							<div
								key={contact.talkedWith._id}
								onClick={() =>
									handleClickNewContact(contact.talkedWith)
								}
								className="scrollbar-hidden flex gap-2 items-center cursor-pointer hover:bg-background p-2 rounded-sm"
							>
								<Avatar className="w-12 h-12">
									<AvatarImage
										src={
											contact.talkedWith?.avatar
												?.secure_url
										}
									/>

									<AvatarFallback
										className={`text-lg text-white font-semibold`}
										style={{
											backgroundColor:
												contact.talkedWith
													?.colorPreference,
										}}
									>
										{contact.talkedWith?.email
											.toString()
											.split('')
											.shift()
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>

								<div className="flex flex-col">
									<span className="text-md font-semibold ">
										{contact.talkedWith.firstName
											? `${contact.talkedWith?.firstName} ${contact?.talkedWith?.lastName}`
											: contact.talkedWith?.email}
									</span>
									<span className="text-xs text-secondary-foreground">
										{contact?.latestMessage?.messageType ===
										'text'
											? contact?.latestMessage?.message
											: contact.talkedWith.email.toString()}
									</span>
								</div>
							</div>
						);
					})}
				</ScrollArea>
			)}

			<div className="font-mono text-lg tracking-wider flex justify-between items-center px-3 flex-nowrap text-gray-600">
				<p className="break-keep flex-1 whitespace-nowrap">CHANNELS</p>
				<div className="cursor-pointer hover:text-gray-400 transition-all ease-in-out duration-300">
					<NewChannel />
				</div>
			</div>

			{myChannels.length > 0 && (
				<ScrollArea className="max-h-[35vh] overflow-y-scroll w-full bg-popover text-popover-foreground rounded-md p-4 scrollbar-hidden">
					{myChannels.map((channel) => {
						return (
							<div
								key={channel._id}
								onClick={() => handleClickNewChannel(channel)}
								className="scrollbar-hidden flex gap-2 items-center cursor-pointer hover:bg-background p-2 rounded-sm"
							>
								<Avatar className="w-12 h-12">
									<AvatarImage src={''} />

									<AvatarFallback
										className={`text-lg text-white font-semibold`}
									>
										#
									</AvatarFallback>
								</Avatar>

								<div className="flex flex-col">
									<span className="text-md font-semibold ">
										{channel.channelInfo.title}
									</span>
									<span className="text-sm text-secondary-foreground">
										{channel?.latestMessage?.message}
									</span>
								</div>
							</div>
						);
					})}
				</ScrollArea>
			)}

			<div className="absolute left-0 bottom-0 w-full bg-popover text-popover-foreground flex justify-between items-center px-4">
				<div className="flex gap-3 items-center cursor-pointer  p-2 ">
					<Avatar className="w-12 h-12">
						<AvatarImage src={userInfo?.avatar?.secure_url} />

						<AvatarFallback
							className={`text-lg text-white font-semibold`}
							style={{
								backgroundColor: userInfo?.colorPreference,
							}}
						>
							{userInfo?.email
								.toString()
								.split('')
								.shift()
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col">
						<span className="text-md font-semibold ">
							{userInfo.firstName
								? `${userInfo?.firstName} ${userInfo?.lastName}`
								: userInfo?.email}
						</span>
						<span className="text-xs text-muted-foreground">
							{userInfo?.email}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-center gap-4">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<FaPen
									onClick={() => navigate('/profile')}
									className="text-2xl cursor-pointer text-yellow-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p>Edit profile</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<IoIosLogOut
									onClick={handleLogout}
									className="text-2xl cursor-pointer  text-red-600 hover:text-red-500 transition-all duration-300 ease-in-out"
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p>logout</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}

export default ContactsContainer;
