import cloudinary from 'cloudinary';

const connectToCloudinary = async () => {
	try {
		// cloudinary configuration
		cloudinary.v2.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	} catch (e) {
		console.log(`error in connecting to cloudinary-> ${e}`);
	}
};

export default connectToCloudinary;
