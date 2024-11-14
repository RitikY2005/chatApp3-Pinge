import { useState, useRef, useEffect } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '@/socketContext.jsx';
import useAppStore from '@/slices/user.slice.js';
import useMessagesStore from '@/slices/messages.slice.js';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { SEND_FILE_ROUTE } from '@/constants/routes.constants.js';
import { useToast } from '@/hooks/use-toast.js';
import axiosInstance from '@/utils/axiosInstance.js';
import { Progress } from '@/components/ui/progress';

function ChatFooter() {
	const socketIo = useSocket();
	const { userInfo } = useAppStore();
	const { selectedChatData, isUploading, setIsUploading } =
		useMessagesStore();
	const [messageInput, setMessageInput] = useState('');
	const [fileInput, setFileInput] = useState('');
	const [filePreview, setFilePreview] = useState('');
	const [fileIsImage, setFileIsImage] = useState(false);
	const [showFileDialog, setShowFileDialog] = useState(false);
	const emojiRef = useRef();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { toast } = useToast();

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

	function sendFileMessage(fileData) {
		if (!fileData || !fileData.secure_url) return;

		const data = {
			sender: userInfo._id,
			receiver: selectedChatData._id,
			message: '',
			messageType: 'file',
			file: {
				public_id: fileData?.public_id,
				secure_url: fileData.secure_url,
			},
		};

		socketIo.emit('directMessage', data);
	}

	function handlePressEnter(e) {
		const { key } = e;
		if (key === 'Enter') {
			sendDirectMessage();
		}
	}

	function handleFileChange(e) {
		const file = e.target.files[0];
		if (file) {
			const fileExt = file.name.split('.').pop();
			const isImage = new RegExp(
				/^(jpg|jpeg|png|gif|bmp|tiff|webp|avif|svg|heif|heic|ico)$/i
			);

			if (isImage.test(fileExt)) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.addEventListener('load', () => {
					setFileInput(file);
					setFilePreview(reader.result);
					setFileIsImage(true);
				});
			} else {
				setFileInput(file);
				setFilePreview(file.name);
				setFileIsImage(false);
			}
			setShowFileDialog(true);
		} else {
			setFileInput('');
			setFilePreview('');
			setFileIsImage(false);
		}
		e.target.value = null;
	}

	function handleCancelSendFile() {
		setShowFileDialog(false);
		setFileInput('');
		setFilePreview('');
		setFileIsImage(false);
	}

	async function handleSendFile() {
		if (!fileInput) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: 'Please select a file',
			});
			return;
		}

		const data = new FormData();
		data.append('file', fileInput);

		try {
			const res = await axiosInstance.post(SEND_FILE_ROUTE, data, {
				onUploadProgress: (progressEvent) =>
					setIsUploading(
						Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						)
					),
			});

			if (res?.data?.success) {
				sendFileMessage(res?.data?.finalData);
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}

		setShowFileDialog(false);
		setIsUploading(0);
		setFileInput('');
		setFilePreview('');
		setFileIsImage(false);
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
				<label htmlFor="file">
					<FiPaperclip className="text-2xl cursor-pointer font-bold" />
					<input
						type="file"
						name="file"
						id="file"
						className="hidden"
						onChange={handleFileChange}
					/>
				</label>
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

			{/*this is not part of static ui -> send file dialog*/}
			<Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
				<DialogTrigger></DialogTrigger>
				<DialogContent className="rounded-sm w-96">
					<DialogHeader>
						<DialogTitle>Do you want to send this ?</DialogTitle>
						<DialogDescription>
							<span className="flex flex-col items-center justify-center p-3 gap-3">
								{fileIsImage ? (
									<img
										src={filePreview}
										alt="file preview"
										className="w-48 drop-shadow-md"
									/>
								) : (
									<span className="bg-primary text-primary-foreground p-1 rounded-md">
										{filePreview}
									</span>
								)}

								{isUploading > 0 && (
									<span className="w-full">
										<Progress value={isUploading} />
									</span>
								)}
								<span className="flex items-center justify-center gap-3">
									<button
										onClick={handleCancelSendFile}
										className="border border-destructive bg-destructive text-primary-foreground  rounded-lg py-2 px-4 text-md font-semibold transition-all duration-300 ease-in-out"
									>
										cancel
									</button>
									<button
										onClick={handleSendFile}
										disabled={
											isUploading > 0 ? true : false
										}
										className="border border-accent bg-accent text-primary-foreground  rounded-lg py-2 px-4 text-md font-semibold transition-all duration-300 ease-in-out"
									>
										send
									</button>
								</span>
							</span>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			{/*till here is not part of ui */}
		</div>
	);
}

export default ChatFooter;
