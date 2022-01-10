const connectURL = process.env.MONGO_CONNECTION_STRING
const mongoose = require('mongoose');
console.log(connectURL);
mongoose.connect(connectURL);