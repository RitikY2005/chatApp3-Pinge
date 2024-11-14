import { create } from 'zustand';

const useMessagesStore = create((set, get) => ({
	selectedChatData: {},
	selectedChatType: '',
	selectedChatMessages: [],
	isUploading: 0,
	isDownloading: 0,
	setIsUploading: (isUploading) => set({ isUploading }),
	setIsDownloading: (isDownloading) => set({ isDownloading }),
	setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
	setSelectedChatMessages: (message) => {
		const {
			selectedChatData,
			selectedChatType,
			selectedChatMessages,
			selectedChatHistory,
		} = get();
		// execute this only once when fetchingn history , message will be array containing messsages
		if (Array.isArray(message)) {
			set({ selectedChatMessages: [...message] });
			return;
		}
		// ececute this when users emit message -> which will be object now
		if (selectedChatType === 'contact' && selectedChatData._id) {
			if (
				selectedChatData._id.toString() === message.sender ||
				selectedChatData._id.toString() === message.receiver
			) {
				set({
					selectedChatMessages: [...selectedChatMessages, message],
				});
			}
		} else if (selectedChatType === 'channel' && selectedChatData._id) {
			// TODO -> hanlde messages for channel
		}
	},

	setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

	closeChat: () =>
		set({
			selectedChatData: {},
			selectedChatMessages: [],
			selectedChatType: '',
		}),
}));

export default useMessagesStore;
