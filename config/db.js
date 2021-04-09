const config = require('../config/config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Database connected");
});
mongoose.Promise = global.Promise;

// mongoose.connection.on( 'error', () => {
//     throw new Error(`unable to connect to database: `)
//   })

module.exports = {
    users: require('../models/users'),
};