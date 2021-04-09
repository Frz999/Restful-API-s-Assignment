const config = require('../config/config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Database connected")
});
mongoose.Promise = global.Promise;

module.exports = {
    users: require('../models/users'),
};