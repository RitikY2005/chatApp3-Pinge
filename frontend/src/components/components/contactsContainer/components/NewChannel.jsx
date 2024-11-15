import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

import { FaPlus } from 'react-icons/fa';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import Select from 'react-dropdown-select';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance.js';
import {
	ALL_USERS_CHANNEL_ROUTE,
	CREATE_CHANNEL_ROUTE,
} from '@/constants/routes.constants.js';
import useMessagesStore from '@/slices/messages.slice.js';
import { useToast } from '@/hooks/use-toast.js';

function NewChannel() {
	const { setSelectedChatData, setSelectedChatType } = useMessagesStore();
	const [channelName, setChannelName] = useState('');
	const [selectedUsers, setSelectedUsers] = useState('');
	const [allUsers, setAllUsers] = useState([]);
	const [isCreating, setIsCreating] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);
	const { toast } = useToast();

	async function fetchUsersForChannel() {
		try {
			const res = await axiosInstance.get(ALL_USERS_CHANNEL_ROUTE);
			if (res?.data?.success) {
				setAllUsers(res?.data?.users);
			} else {
				toast({
					variant: 'destructive',
					title: 'Something went wrong!',
					description: res?.data?.message,
				});
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}
	}

	function validateChannelData() {
		if (!channelName) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: 'Please fill in channel name',
			});
			return false;
		}

		if (channelName.length < 3) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: "Channel name can't be less than 3 characters",
			});
			return false;
		}

		if (selectedUsers.length === 0) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: 'Channel must have atleast one participant',
			});
			return false;
		}

		return true;
	}

	async function handleCreateChannel() {
		if (!validateChannelData()) return;
		setIsCreating(true);
		const data = {
			participants: selectedUsers,
			title: channelName,
		};

		try {
			const res = await axiosInstance.post(CREATE_CHANNEL_ROUTE, data);
			if (res?.data?.success) {
				setSelectedChatData(res?.data?.newChannel);
				setSelectedChatType('channel');
				setShowContactModal(false);
			} else {
				toast({
					variant: 'destructive',
					title: 'Something went wrong!',
					description: res?.data?.message,
				});
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}

		setChannelName('');
		setSelectedUsers([]);
		setIsCreating(false);
	}

	useEffect(() => {
		console.warn('all users->>', allUsers);
		console.warn('selected users->>', selectedUsers);
	}, [allUsers, selectedUsers]);

	return (
		<div>
			<Popover open={showContactModal} onOpenChange={setShowContactModal}>
				<TooltipProvider>
					<PopoverTrigger></PopoverTrigger>
					<Tooltip>
						<TooltipTrigger>
							<FaPlus
								onClick={() => {
									setShowContactModal((prev) => !prev);
									fetchUsersForChannel();
								}}
							/>
						</TooltipTrigger>

						<TooltipContent>
							<p>Create New Channel</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<PopoverContent className="sm:w-96 drop-shadow-lg font-para">
					<div className="space-y-3 w-full">
						<h1 className="font-semibold text-xl">
							Create a New Channel
						</h1>

						<input
							type="text"
							name="channelName"
							value={channelName}
							placeholder="Channel name..."
							onChange={(e) => setChannelName(e.target.value)}
							className="w-full border rounded-md py-2 px-3 border-input focus:border-ring  outline-none"
						/>

						<div>
							<Select
								multi
								options={allUsers}
								values={[]}
								placeholder={'select participants..'}
								addPlaceholder="select participants.."
								clearable
								onChange={(values) => setSelectedUsers(values)}
								className="rounded-md focus:ring"
								loading={allUsers.length == 0 ? true : false}
							/>
						</div>

						<div>
							<button
								disabled={isCreating}
								onClick={handleCreateChannel}
								className="bg-primary py-2 px-5 hover:bg-primary-hover text-primary-foreground rounded-lg text-md font-semibold transition-all duration-300 ease-in-out"
							>
								create
							</button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default NewChannel;
