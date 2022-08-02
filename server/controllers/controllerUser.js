const catchAsyncErrors = require('../middlerware/catchAsyncError');

const ErrorHandler = require('../utils/errorhandler');
const User = require('../models/modelUser');
const cloudinary = require('cloudinary');

const userPerPage = 2;

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	// data:base64 photo
	const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
		folder: 'employee-table',
		width: 150,
		height: 150,
		crop: 'scale',
	});

	const { username, phone, email, status, gender } = req.body;
	console.log(username, phone, email, status, gender);
	const user = new User({
		username,
		email,
		phone,
		status,
		gender,
		avatar: {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		},
	});
	user.save(async (err, res) => {
		if (err) {
			await cloudinary.uploader.destroy(myCloud.public_id);
			return next(new ErrorHandler(err.message, 500));
		} else {
			res.status(201).json({
				success: true,
				user,
			});
		}
	});
});
exports.getAllUsers = catchAsyncErrors(async (req, res) => {
	const { pageNo, sortBy } = req.body;
	const sortStr = sortBy.map((i) => i).join(' ');

	const users = await User.find({})
		.sort(sortStr)
		.skip(pageNo * userPerPage)
		.limit(userPerPage);

	console.log;
});

exports.getUser = catchAsyncErrors(async (req, res) => {});
exports.editUser = catchAsyncErrors(async (req, res) => {});
exports.deleteUser = catchAsyncErrors(async (req, res) => {
	const image = await cloudinary.uploader.destroy('employee-table/wnsuevhukkqoukea6pks');

	console.log('image = ', image);
});
