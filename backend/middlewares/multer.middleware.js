import multer from 'multer';

const upload = multer({
	dest: 'uploads/',
	storage: multer.diskStorage({
		destination: 'uploads/',
		filename: function (req, file, cb) {
			const name = Date.now() + file.originalname;
			cb(null, name);
		},
		limits: { fileSize: 10 * 1024 * 1024 },
	}),
});

export default upload;
