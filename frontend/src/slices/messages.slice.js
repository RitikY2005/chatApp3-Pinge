import { create } from 'zustand';

const useMessagesStore = create((set, get) => ({
	selectedChatData: {},
	selectedChatType: '',
	selectedChatMessages: [],
	isUploading: 0,
	isDownloading: 0,
	myContacts: [],
	myChannels: [],
	unknownUser: null,
	unknownChannel: null,
	setUnknownUser: (unknownUser) => set({ unknownUser }),
	setMyContacts: (myContacts) => set({ myContacts: [...myContacts] }),
	setMyChannels: (myChannels) => set({ myChannels: [...myChannels] }),
	setIsUploading: (isUploading) => set({ isUploading }),
	setIsDownloading: (isDownloading) => set({ isDownloading }),
	setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
	setSelectedChatMessages: (message) => {
		const {
			selectedChatData,
			selectedChatType,
			selectedChatMessages,
			selectedChatHistory,
			myContacts,
			unknownUser,
			unknownChannel,
			myChannels,
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
			} else {
				// this user is not selected then , means we have to add this user to our contacts , which can be done by refreshing fetchMyContacts on chatpage
				// console.error('unknownUser here');
				// set({ unknownUser: !unknownUser });
			}
		} else if (selectedChatType === 'channel' && selectedChatData._id) {
			// check if sender of the message is from the group selected

			if (message.channelId === selectedChatData._id) {
				set({
					selectedChatMessages: [...selectedChatMessages, message],
				});
			} else {
				// the group that messaged this , is not open and is a new group
			}
		} else {
		}

		// this one for always keeping the lastest chat on top in contacts and if the sender of message in not in contacts , raise unknownUserflag

		// we want to make sure that this contact is at top in myContacts
		const findIndexContact = myContacts.findIndex(
			(contact) =>
				contact.talkedWith._id.toString() === message.sender ||
				contact.talkedWith._id.toString() === message.receiver
		);

		if (findIndexContact > -1) {
			const backup = myContacts[findIndexContact];
			backup.latestMessage = message;
			myContacts.splice(findIndexContact, 1);
			set({ myContacts: [backup, ...myContacts] });
		} else {
			set({ unknownUser: !unknownUser });
		}

		// this one for always keeping the lastest chat on top in channel and if the sender of message in not in channels , raise unknownChannel flag

		const findIndexChannel = myChannels.findIndex(
			(channel) => channel._id.toString() === message?.channelId
		);

		if (findIndexChannel > -1) {
			console.error('entered here---');
			const backup = myChannels[findIndexChannel];
			backup.latestMessage = message;
			myChannels.splice(findIndexChannel, 1);
			set({ myChannels: [backup, ...myChannels] });
		} else {
			set({ unknownChannel: !unknownChannel });
		}
	},

	setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

	closeChat: () =>
		set({
			selectedChatData: {},
			selectedChatMessages: [],
			selectedChatType: '',
			isUploading: 0,
			isDownloading: 0,
		}),
}));

export default useMessagesStore;
