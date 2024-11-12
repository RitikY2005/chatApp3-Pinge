import ShowLogo from '../ShowLogo.jsx';
import { FaPlus } from 'react-icons/fa';
import NewDM from './components/NewDM.jsx';
import useMessagesStore from '@/slices/messages.slice.js';

function ContactsContainer() {
	const { selectedChatData } = useMessagesStore();

	return (
		<div
			className={`w-full ${selectedChatData._id ? 'hidden sm:block' : ''} sm:w-[40%] md:w-[30%] h-full bg-background text-foreground border-r border-popover py-6 px-2 space-y-4`}
		>
			<div className="w-full flex items-center justify-start mb-5">
				<ShowLogo />
			</div>

			<div className="font-mono text-lg tracking-wider flex justify-between items-center px-3 flex-nowrap text-gray-600">
				<p className="break-keep flex-1 whitespace-nowrap">
					DM MESSAGE
				</p>
				<div className="cursor-pointer hover:text-gray-400 transition-all ease-in-out duration-300">
					<NewDM />
				</div>
			</div>

			<div className="font-mono text-lg tracking-wider flex justify-between items-center px-3 flex-nowrap text-gray-600">
				<p className="break-keep flex-1 whitespace-nowrap">CHANNELS</p>
				<div className="cursor-pointer hover:text-gray-400 transition-all ease-in-out duration-300">
					<FaPlus />
				</div>
			</div>
		</div>
	);
}

export default ContactsContainer;
