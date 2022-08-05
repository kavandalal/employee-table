const catchAsyncErrors = require('../middlerware/catchAsyncError');

const ErrorHandler = require('../utils/errorhandler');
const User = require('../models/modelUser');
const cloudinary = require('cloudinary');

const userPerPage = 10;

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	// data:base64 photo
	let myCloud = {
		public_id: '',
		secure_url: '',
	};
	if (req.body.avatar) {
		myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
			folder: 'employee-table',
			width: 150,
			height: 150,
			crop: 'scale',
		});
	}

	const { username, phone, email, status, gender } = req.body;
	const userSchema = {
		username,
		email,
		phone,
		status,
		gender,
	};
	if (myCloud.public_id) {
		userSchema.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
	}
	const user = new User(userSchema);
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
	const { pageNo, sortBy, perPage } = req.body;
	let sortStr = '';
	let perPageData = Number(userPerPage);
	if (perPage) perPageData = Number(perPage);
	if ('email' in sortBy) {
		sortStr += 'email ';
	}
	if ('username' in sortBy) {
		sortStr += 'username';
	}
	// username || email
	const users = await User.find()
		.sort(sortStr)
		.skip((Number(pageNo) - 1) * perPageData)
		.limit(perPageData);

	let totalCount = await User.count();

	res.status(200).json({
		success: true,
		data: users,
		totalUser: totalCount,
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
	const { id } = req.params;
	const user = await User.findById(id);

	if (!user) {
		return next(new ErrorHandler(`User does not exist with Username: ${req.params.id}`, 400));
	}

	if (user.avatar.public_id && user.avatar.public_id !== 'employee-table/default_image') {
		const imageId = user.avatar.public_id;
		await cloudinary.uploader.destroy(imageId);
	}

	await user.remove();

	res.status(200).json({
		success: true,
		message: 'User Deleted Successfully',
	});
});
