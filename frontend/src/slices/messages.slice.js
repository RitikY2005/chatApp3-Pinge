import { create } from 'zustand';

const useMessagesStore = create((set, get) => ({
	selectedChatData: {},
	selectedChatType: '',
	selectedChatMessages: [],
	setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
	setSelectedChatMessages: (message) => {
		selectedChatMessages.push(message);
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
