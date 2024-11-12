import nothingtodoGif from '../../../assets/images/nothingtodo.gif';

function EmptyChatContainer() {
	return (
		<div className="hidden sm:flex font-para flex-1 h-full  flex-col justify-center items-center bg-background text-foreground p-4">
			<div>
				<img src={nothingtodoGif} alt="loading.." className="w-72" />
			</div>

			<div className="text-2xl font-semibold text-center">
				You are awfully <span className="text-primary">quiet</span> ,
				select a <span className="text-primary">contact</span> to talk
				to <span className="text-primary">....</span>
			</div>
		</div>
	);
}

export default EmptyChatContainer;
