const catchAsyncErrors = require('../middlerware/catchAsyncError');

const ErrorHandler = require('../utils/errorhandler');
const User = require('../models/modelUser');
const cloudinary = require('cloudinary');

const userPerPage = 10;

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
	user.save(async (err, resp) => {
		if (err) {
			await cloudinary.uploader.destroy(myCloud.public_id);
			return next(new ErrorHandler(err.message, 500));
		} else {
			res.status(201).json({
				success: true,
				resp,
			});
		}
	});
});

exports.getAllUsers = catchAsyncErrors(async (req, res) => {
	const { pageNo, sortBy } = req.body;
	let sortStr = '';
	if ('email' in sortBy) {
		sortStr += 'email ';
	}
	if ('username' in sortBy) {
		sortStr += 'username';
	}
	// username || email
	const users = await User.find()
		.sort(sortStr)
		.skip((Number(pageNo) - 1) * userPerPage)
		.limit(userPerPage);

	res.status(200).json({
		success: true,
		data: users,
	});
});

exports.getUser = catchAsyncErrors(async (req, res) => {
	const { username } = req.params;
	let user = await User.findOne({ username });
	delete user['_id'];
	res.status(200).json({
		success: true,
		data: user,
	});
});

exports.editUser = catchAsyncErrors(async (req, res) => {
	const newUserData = {
		username: req.body.username,
		email: req.body.email,
		phone: req.body.phone,
		status: req.body.status,
		gender: req.body.gender,
	};

	if (req.body.avatar && req.body.avatar != '') {
		const user1 = await User.findById(req.body.id);

		const imageId = user1.avatar.public_id;
		await cloudinary.uploader.destroy(imageId);

		const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
			folder: 'employee-table',
			width: 150,
			height: 150,
			crop: 'scale',
		});

		newUserData.avatar = {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		};
	}
	const user2 = await User.findByIdAndUpdate(req.body.id, newUserData, {
		new: true,
		useFindAndModify: false,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user2,
	});
});

exports.deleteUser = catchAsyncErrors(async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ username });

	if (!user) {
		return next(new ErrorHandler(`User does not exist with Username: ${req.params.id}`, 400));
	}

	if (user.avatar.public_id !== 'employee-table/default_image') {
		const imageId = user.avatar.public_id;
		await cloudinary.uploader.destroy(imageId);
	}

	await user.remove();

	res.status(200).json({
		success: true,
		message: 'User Deleted Successfully',
	});
});
