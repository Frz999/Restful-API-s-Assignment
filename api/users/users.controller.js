const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/',createUser)
router.get('/', getAll);
router.get('/:email', getByEmail);
router.delete('/:email', deleteUser);

module.exports = router;


//// function to authenticate user ////

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(users => res.json(users))
        .catch(err => {
            next(err)
        });
};


//// function get all users ////

function getAll(req, res, next) {
    userService.getAll(req)
        .then(users => res.json(users))
        .catch(err => next(err));
};

//// function to get user by email id ////

function getByEmail(req, res, next) {
    userService.getByEmail(req.params.email)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
};


//// function to delete user ////

function deleteUser(req, res, next) {
    userService.deleteUser(req.params.email)
        .then(() => res.status(200).json({}))
        .catch(err => next(err));
};

//// function to create user ////

function createUser(req, res, next){
    userService.create(req.body)
        .then(() => res.status(200).json({}))
        .catch(err => next(err));
};



