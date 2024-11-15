import { FaCaretLeft } from 'react-icons/fa';
import useMessagesStore from '@/slices/messages.slice.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function ChatHeader() {
	const { closeChat, selectedChatData, selectedChatType } =
		useMessagesStore();

	return (
		<div className="w-full  border-b border-popover flex items-center gap-5 px-4 ">
			<div className="text-left">
				<FaCaretLeft
					className="text-4xl cursor-pointer text-primary"
					onClick={() => closeChat()}
				/>
			</div>

			{selectedChatType === 'contact' && (
				<div className="flex gap-2 items-center cursor-pointer  p-2 ">
					<Avatar className="w-12 h-12">
						<AvatarImage
							src={selectedChatData?.avatar?.secure_url}
						/>

						<AvatarFallback
							className={`text-lg text-white font-semibold`}
							style={{
								backgroundColor:
									selectedChatData?.colorPreference,
							}}
						>
							{selectedChatData?.email
								.toString()
								.split('')
								.shift()
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col">
						<span className="text-md font-semibold ">
							{selectedChatData.firstName
								? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
								: selectedChatData?.email}
						</span>
						<span className="text-xs text-muted-foreground">
							{selectedChatData?.email}
						</span>
					</div>
				</div>
			)}

			{selectedChatType === 'channel' && (
				<div className="flex gap-2 items-center cursor-pointer  p-2 ">
					<Avatar className="w-12 h-12">
						<AvatarImage
							src={selectedChatData?.avatar?.secure_url}
						/>

						<AvatarFallback
							className={`text-lg text-white font-semibold`}
						>
							#
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col">
						<span className="text-md font-semibold ">
							{selectedChatData.title}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

export default ChatHeader;
