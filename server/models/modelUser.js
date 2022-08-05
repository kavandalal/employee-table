const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
	// username ( Filter ) ,
	// email ( Filter ) ,
	// phone,
	// status(active/inactive),
	// profile image,
	// gender ,

	username: {
		type: String,
		required: [true, 'Please Enter Username'],
		maxLength: [30, 'Username cannot exceed 30 character'],
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		validate: [validator.isEmail, 'Please Enter Valid Email'],
		required: [true, 'Please Enter Your Email'],
	},
	phone: {
		type: Number,
		required: [true, 'Please Enter Phone Number'],
		validate: {
			validator: function (v) {
				return /^[0-9]{10}$/.test(v);
			},
			message: '{VALUE} is not a valid 10 digit number!',
		},
	},
	status: {
		type: Boolean,
		required: [true, 'Please Enter Status'],
	},
	gender: {
		//  M / F
		type: String,
		trim: true,
		required: [true, 'Please Select Gender'],
	},
	avatar: {
		public_id: {
			type: String,
			default: 'employee-table/default_image',
			required: false,
		},
		url: {
			type: String,
			default: 'https://res.cloudinary.com/dkvftcbih/image/upload/v1659535422/employee-table/default_image.jpg',
			required: false,
		},
	},
});

module.exports = mongoose.model('User', userSchema);
