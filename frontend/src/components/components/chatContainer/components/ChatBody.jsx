import { useSocket } from '@/socketContext.jsx';
import { useEffect, useState, useRef } from 'react';
import useMessagesStore from '@/slices/messages.slice.js';
import useAppStore from '@/slices/user.slice.js';
import moment from 'moment';
import { FaFileZipper } from 'react-icons/fa6';
import { IoMdDownload } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import axiosInstance from '@/utils/axiosInstance.js';
import { useToast } from '@/hooks/use-toast.js';
import { Progress } from '@/components/ui/progress';

function ChatBody() {
	const socketIo = useSocket();
	const {
		selectedChatMessages,
		selectedChatType,
		isDownloading,
		setIsDownloading,
	} = useMessagesStore();
	const { userInfo } = useAppStore();
	const scrollToLastRef = useRef();
	const [fullImageURl, setFullImageURl] = useState('');
	const { toast } = useToast();

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

	function isTheFileImage(fileName) {
		const ext = fileName.split('.').pop();
		const regex = new RegExp(
			/^(jpg|jpeg|png|gif|bmp|tiff|webp|avif|svg|heif|heic|ico)$/i
		);

		console.log('file image ->>', regex.test(ext));

		return regex.test(ext);
	}

	async function downloadFile(filePath) {
		try {
			const res = await axiosInstance.get(filePath, {
				withCredentials: false,
				responseType: 'blob',
				onDownloadProgress: (progressEvent) =>
					setIsDownloading(
						Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						)
					),
			});
			const blob = new Blob([res?.data]);
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			const fileName = filePath.split('/').pop();
			link.download = fileName;
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}
	}

	function renderImageFull(imageUrl) {
		return (
			<div className="fixed bottom-0 left-0 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.4)] p-6 z-10 ">
				<div className="w-[70vw] h-[70vh] flex flex-col items-center justify-center gap-4">
					<div className="flex items-center justify-center gap-3 text-white text-3xl">
						<IoMdDownload
							className="cursor-pointer"
							onClick={() => downloadFile(imageUrl)}
							disabled={isDownloading > 0 ? true : false}
						/>
						<FaPlus
							className="cursor-pointer rotate-45"
							onClick={() => {
								setFullImageURl('');
								setIsDownloading(0);
							}}
						/>
					</div>
					<div>
						<Progress value={isDownloading} />
					</div>
					<div>
						<img
							src={imageUrl}
							alt="image"
							className="w-full h-full"
						/>
					</div>
				</div>
			</div>
		);
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

				{message.messageType === 'file' && (
					<div
						className={`${userInfo._id !== message.sender ? 'bg-secondary text-secondary-foreground rounded-bl-none' : 'bg-primary text-primary-foreground rounded-br-none'} border rounded-xl p-2 max-w-[50%] break-words drop-shadow-sm`}
					>
						{isTheFileImage(message.file.secure_url) ? (
							<>
								<img
									src={message.file.secure_url}
									alt="image"
									className="w-32 h-32 rounded-md cursor-pointer"
									onClick={() =>
										setFullImageURl(message.file.secure_url)
									}
								/>
							</>
						) : (
							<div
								onClick={() =>
									downloadFile(message.file.secure_url)
								}
								className="w-full break-words flex items-center justify-center gap-1 hover:underline flex-wrap cursor-pointer"
							>
								<span className="flex">
									<FaFileZipper className="inline" />
									<span>
										{message.file.secure_url
											?.split('/')
											.pop()}
									</span>
								</span>

								<span>
									<IoMdDownload className="text-3xl" />
								</span>
							</div>
						)}
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
			{fullImageURl.length !== 0 && renderImageFull(fullImageURl)}
		</div>
	);
}

export default ChatBody;
