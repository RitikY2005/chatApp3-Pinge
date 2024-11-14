import { create } from 'zustand';

const useMessagesStore = create((set, get) => ({
	selectedChatData: {},
	selectedChatType: '',
	selectedChatMessages: [],
	setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
	setSelectedChatMessages: (message) => {
		const { selectedChatData, selectedChatType, selectedChatMessages } =
			get();
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
