const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const errorMiddleware = require('./middlerware/error');

app.use(express.json());
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());

// Routes
const posts = require('./routes/posts');

// Controller
app.use('/api/', posts);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
