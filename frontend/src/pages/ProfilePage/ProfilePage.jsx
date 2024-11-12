import { useNavigate } from 'react-router-dom';
import useAppStore from '../../slices/user.slice.js';
import { useEffect, useState, useRef } from 'react';
import { FaCaretLeft } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';
import randomColor from '../../utils/randomColor.js';
import {
	UPLOAD_AVATAR_ROUTE,
	UPDATE_PROFILE_ROUTE,
} from '../../constants/routes.constants.js';
import axiosInstance from '../../utils/axiosInstance.js';

const ProfilePage = () => {
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = useAppStore();
	const { toast } = useToast();
	const [userInput, setUserInput] = useState({
		avatar: '',
		previewAvatar: userInfo?.avatar?.secure_url || '',
		firstName: userInfo?.firstName || '',
		lastName: userInfo?.lastName || '',
		colorPreference: userInfo?.colorPreference || '',
	});
	const colorsRef = useRef([]);
	const [colors, setColors] = useState([
		randomColor(),
		randomColor(),
		randomColor(),
		randomColor(),
	]);

	const [selectedColor, setSelectedColor] = useState('');

	function handleInputChange(e) {
		const { name, value } = e.target;
		setUserInput({
			...userInput,
			[name]: value,
		});
	}

	function handleColorsSelection(idx) {
		if (colorsRef.current[idx] && selectedColor == colorsRef.current[idx]) {
			colorsRef.current[idx].style.outline = '';
			setSelectedColor('');
			setUserInput({
				...userInput,
				colorPreference: '',
			});
		} else {
			// remove colors from other divs
			colorsRef.current.map((e) => (e.style.outline = ''));
			setSelectedColor(colorsRef.current[idx]);
			colorsRef.current[idx].style.outline = '4px solid black';
			setUserInput({
				...userInput,
				colorPreference: colors[idx],
			});
		}
	}

	function handleFileChange(e) {
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.addEventListener('load', () => {
				setUserInput({
					...userInput,
					avatar: file,
					previewAvatar: reader.result,
				});
			});

			// empty the file selected in input after this
			e.target.value = null;
		} else {
			setUserInput({
				...userInput,
				avatar: '',
				previewAvatar: '',
			});
		}
	}

	async function handleSubmit() {
		if (
			!userInput.firstName ||
			!userInput.lastName ||
			!userInput.colorPreference
		) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: 'Please fill in all the details!',
			});

			return;
		}

		if (userInput.firstName.length < 4) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: 'First name should be atleast of 4 characters.',
			});

			return;
		}

		const data = {
			firstName: userInput.firstName,
			lastName: userInput.lastName,
			colorPreference: userInput.colorPreference,
		};

		try {
			const res = await axiosInstance.post(UPDATE_PROFILE_ROUTE, data);
			if (res?.data?.success) {
				toast({
					variant: 'productive',
					title: 'That was nice!',
					description: 'Profile updated successfully!',
				});

				setUserInfo(res?.data?.user);
				setUserInput({
					avatar: '',
					previewAvatar: userInfo?.avatar?.secure_url || '',
					firstName: '',
					lastName: '',
					colorPreference: '',
				});

				// after this navigate to chat page ->
				navigate('/chat');
			} else {
				toast({
					variant: 'destructive',
					title: 'Something went wrong!',
					description: res?.data?.message,
				});
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}
	}

	async function handleAvatarUpload() {
		if (!userInput.avatar) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: 'Please select an image!',
			});

			return;
		}
		const data = new FormData();
		data.append('avatar', userInput.avatar);

		try {
			const res = await axiosInstance.post(UPLOAD_AVATAR_ROUTE, data);

			if (res?.data?.success) {
				toast({
					variant: 'productive',
					title: 'That was nice!',
					description: 'Avatar uploaded successfully!',
				});

				setUserInfo(res?.data?.user);
				setUserInput({
					...userInput,
					avatar: '',
				});
			} else {
				toast({
					variant: 'destructive',
					title: 'Something went wrong!',
					description: res?.data?.message,
				});
			}
		} catch (e) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong!',
				description: e?.response?.data?.message,
			});
		}
	}

	useEffect(() => {
		// if they are not loggedin navigate to auth page

		if (!userInfo || userInfo === undefined) return navigate('/auth');
	}, []);

	useEffect(() => {
		// if they are not loggedin navigate to auth page
		console.log('userInput->>', userInput);
	}, [userInput]);

	return (
		<div className="w-[100vw] h-[100vh] flex justify-center items-center p-4 bg-background text-foreground font-para">
			<div className="bg-popover text-popover-foreground p-6 rounded-md w-[80vw] md:w-[50vw] lg:w-[45vw]">
				<div className="text-left">
					<FaCaretLeft
						className="text-2xl cursor-pointer text-primary"
						onClick={() => navigate(-1)}
					/>
				</div>

				<div className="w-full h-auto flex flex-col md:flex-row justify-center  items-center gap-4 space-y-4">
					<div className="flex flex-col gap-3 items-center">
						<Avatar className="group w-32 h-32 sm:w-48 sm:h-48 m-auto">
							<AvatarImage src={userInput.previewAvatar} />
							{userInput.previewAvatar && (
								<label
									onClick={() =>
										setUserInput({
											...userInput,
											previewAvatar: '',
											avatar: '',
										})
									}
									className="hidden group-hover:flex absolute bg-[rgba(0,0,0,0.3)] w-full h-full rounded-full  justify-center items-center transition-all duration-1000 ease-out"
								>
									<FaPlus className="text-white text-2xl rotate-45" />
								</label>
							)}

							<AvatarFallback
								className={`text-4xl text-white font-semibold`}
								style={{
									backgroundColor: userInput.colorPreference,
								}}
							>
								{userInfo?.email
									.toString()
									.split('')
									.shift()
									.toUpperCase()}

								<label
									htmlFor="avatar"
									className="hidden group-hover:flex absolute bg-[rgba(0,0,0,0.4)] w-full h-full rounded-full justify-center items-center"
								>
									<FaPlus className="text-white text-2xl " />
								</label>
							</AvatarFallback>
						</Avatar>
						<input
							type="file"
							accepted="images/*"
							name="avatar"
							id="avatar"
							className="hidden"
							onChange={handleFileChange}
						/>
						{userInput.avatar && (
							<Button
								className="m-auto"
								onClick={handleAvatarUpload}
							>
								<FaCloudUploadAlt />
								save
							</Button>
						)}
					</div>

					<div className="w-full flex flex-col gap-2 justify-center ">
						<input
							type="email"
							placeholder="your email"
							name="email"
							disabled={true}
							value={userInfo?.email}
							className="w-full border rounded-md py-2 px-3 border-input focus:border-ring  outline-none bg-secondary text-seconday-foreground"
						/>

						<input
							type="text"
							placeholder="Your first Name"
							value={userInput.firstName}
							onChange={handleInputChange}
							name="firstName"
							className="border rounded-md py-2 px-3 border-input focus:border-ring  outline-none w-full "
						/>

						<input
							type="text"
							placeholder="Your lastName"
							value={userInput.lastName}
							onChange={handleInputChange}
							name="lastName"
							className="border rounded-md py-2 px-3 border-input focus:border-ring  outline-none w-full "
						/>

						<div className="mt-3 flex justify-start items-center gap-2">
							{colors?.map((ele, idx) => {
								return (
									<div
										key={idx}
										ref={(ele) =>
											(colorsRef.current[idx] = ele)
										}
										onClick={(e) =>
											handleColorsSelection(idx)
										}
										className={`cursor-pointer w-12 h-12 rounded-full  text-center text-md flex items-center justify-center text-white font-semibold `}
										style={{
											backgroundColor: ele,
										}}
									>
										{userInfo?.email
											.toString()
											.split('')
											.shift()
											.toUpperCase()}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div className="mt-5">
					<button
						onClick={handleSubmit}
						className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg py-2 text-md font-semibold transition-all duration-300 ease-in-out"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
