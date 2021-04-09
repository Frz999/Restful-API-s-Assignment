const expressJwt = require('express-jwt');
const config = require('../config/config.json');
const userService = require('../api/users/user.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that dont require authentication
            '/users/authenticate'
        ]
    });
}

async function isRevoked(req, payload, done) {

    const user = await userService.getByEmail(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};