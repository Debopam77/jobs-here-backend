const connectURL = process.env.MONGO_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/jobs-here';
const mongoose = require('mongoose');
console.log(connectURL);
mongoose.connect(connectURL);