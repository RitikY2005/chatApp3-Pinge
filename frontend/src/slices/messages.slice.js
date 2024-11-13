import { create } from 'zustand';

const useMessagesStore = create((set, get) => ({
	selectedChatData: {},
	selectedChatType: '',
	selectedChatMessages: [],
	setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
	// TODO:>> fix mutiple people sending message to one user in dm type message
	setSelectedChatMessages: (message) =>
		set({ selectedChatMessages: [...get().selectedChatMessages, message] }),
	setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

	closeChat: () =>
		set({
			selectedChatData: {},
			selectedChatMessages: [],
			selectedChatType: '',
		}),
}));

export default useMessagesStore;
