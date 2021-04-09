require('rootpath')()
let express = require("express");
let app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
let http = require('http');
const jwt = require('./middleware/jwt')
const errorHandler = require('./middleware/error-handler')
let server = http.createServer(app);

app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 1000000,
}));

app.use(bodyParser.json({ extended: true}));

// cors
app.use(cors());

// JWT auth to secure the api
app.use(jwt())


// api routes
app.use('/users', require('./api/users/users.controller'));

// global error handler
app.use(errorHandler)

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 9000;

server.listen(port, () => {
    console.log(` server started on port: ${port}`);
});

module.exports = {app,server};