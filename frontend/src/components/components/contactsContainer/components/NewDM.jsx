import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { FaPlus } from 'react-icons/fa';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

import nothingtodoGif from '@/assets/images/nothingtodo.gif';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance.js';
import { ALL_CONTACTS_ROUTES } from '@/constants/routes.constants.js';
import useMessagesStore from '@/slices/messages.slice.js';
import { useToast } from '@/hooks/use-toast.js';

function NewDM() {
	const { setSelectedChatData, setSelectedChatType } = useMessagesStore();
	const [searchTerm, setSearchTerm] = useState('');
	const [showContactModal, setShowContactModal] = useState(false);
	const { toast } = useToast();
	const [matchedContacts, setMatchedContacts] = useState([]);

	async function fetchContacts() {
		if (!searchTerm) {
			return;
		}

		try {
			const res = await axiosInstance.get(
				`${ALL_CONTACTS_ROUTES}/${searchTerm}`
			);
			if (res?.data?.success) {
				setMatchedContacts(res?.data?.contacts);
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

	function handlePressEnter(e) {
		const { key } = e;
		if (key === 'Enter') {
			fetchContacts();
		}
	}

	function handleClickNewContact(contact) {
		setSelectedChatData(contact);
		setSelectedChatType('contact');
		setShowContactModal(false);
		setSearchTerm('');
		setMatchedContacts([]);
	}

	return (
		<div>
			<Popover open={showContactModal} onOpenChange={setShowContactModal}>
				<TooltipProvider>
					<PopoverTrigger></PopoverTrigger>
					<Tooltip>
						<TooltipTrigger>
							<FaPlus
								onClick={() =>
									setShowContactModal((prev) => !prev)
								}
							/>
						</TooltipTrigger>

						<TooltipContent>
							<p>Create new contact</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<PopoverContent className="sm:w-96 drop-shadow-lg font-para">
					<div className="space-y-3 w-full">
						<h1 className="font-semibold text-xl">
							Select a new contact.
						</h1>

						<input
							type="text"
							name="searchTerm"
							value={searchTerm}
							placeholder="search for new people..."
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyUp={handlePressEnter}
							className="w-full border rounded-md py-2 px-3 border-input focus:border-ring  outline-none"
						/>

						{matchedContacts.length > 0 ? (
							<ScrollArea className="h-48 scrollbar-hidden">
								{matchedContacts.map((contact) => {
									return (
										<div
											key={contact._id}
											onClick={() =>
												handleClickNewContact(contact)
											}
											className="scrollbar-hidden flex gap-2 items-center cursor-pointer hover:bg-background p-2 rounded-sm"
										>
											<Avatar className="w-12 h-12">
												<AvatarImage
													src={
														contact?.avatar
															?.secure_url
													}
												/>

												<AvatarFallback
													className={`text-lg text-white font-semibold`}
													style={{
														backgroundColor:
															contact?.colorPreference,
													}}
												>
													{contact?.email
														.toString()
														.split('')
														.shift()
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>

											<div className="flex flex-col">
												<span className="text-md font-semibold ">
													{contact.firstName
														? `${contact?.firstName} ${contact?.lastName}`
														: contact?.email}
												</span>
												<span className="text-xs text-muted-foreground">
													{contact?.email}
												</span>
											</div>
										</div>
									);
								})}
							</ScrollArea>
						) : (
							<div className="h-48">
								<div>
									<img
										src={nothingtodoGif}
										alt="loading.."
										className="w-32"
									/>
								</div>

								<div className="text-md sm:text-lg font-semibold text-center">
									Type in the{' '}
									<span className="text-primary">
										searchbox
									</span>{' '}
									, to search{' '}
									<span className="text-primary">
										for new people
									</span>{' '}
									to talk to{' '}
									<span className="text-primary">....</span>
								</div>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default NewDM;
