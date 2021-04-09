const request = require('supertest');
const config = require('../../config/config.json');
const { app, server } = require('../../server');
const mongoose = require('mongoose');
const db = require('../../config/db');
const User = db.users;
const bcrypt = require('bcryptjs');

let dummyUser = { email: 'firoz@gmail.com', password: '123456'};

let token = '';

beforeAll(async () => {
    await mongoose.connect(config.connectionString, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });

    const user = new User({
      email: dummyUser.email
    });
    user.hash = bcrypt.hashSync(dummyUser.password, 10);
    await user.save();
});

describe('POST /users/authenticate', () => {
    it('should authenticate the user and return JWT token', async () => {
        const res = await request(app)
            .post('/users/authenticate')
            .send({
                email: 'firoz@gmail.com',
                password: '123456',
            });
        if (res.statusCode !== 200) {
            console.log("POST /users/authenticate : ", res.body);
        }
        console.log("RESPONSE : ", res.body)
        token = res.body.token;
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});

describe('POST /users/', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/users/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: `${Math.random().toString(36).substr(2, 5)}`,
                password: '123456',
            });
        if (res.statusCode !== 201) {
            console.log("POST /users/ : ", res.body);
        }
        expect(res.statusCode).toEqual(201);
    });
});

describe('GET /', () => {
    it('should get all users with pagination', async () => {
        const res = await request(app)
            .get('/users/')
            .set('Authorization', `Bearer ${token}`)
        if (res.statusCode !== 200) {
            console.log("GET / : ", res.body);
        }
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('posts', 'totalPages', 'currentPage');
    });
});

describe('GET /', () => {
    it('should get single user with id', async () => {
        const res = await request(app)
            .get('/users/firoz@gmail.com')
            .set('Authorization', `Bearer ${token}`)
        if (res.statusCode !== 200) {
            console.log("GET / : ", res.status);
        }
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', 'firoz@gmail.com');
    });
});

describe('DELETE /', () => {
    it('should delete a user with id', async () => {
        const res = await request(app)
            .delete('/users/firoz@gmail.com')
            .set('Authorization', `Bearer ${token}`)
        if (res.statusCode !== 200) {
            console.log("DELETE / : ", res.status);
        }
        expect(res.statusCode).toEqual(200);
    });
});

describe('POST /', () => {
    it('should reject the request without JWT', async () => {
        const res = await request(app)
            .post('/users/')
            .send({
                email: `${Math.random().toString(36).substr(2, 5)}`,
                password: '123456',
            });
        if (res.statusCode !== 401) {
            console.log("POST / JWT: ", res.body);
        }
        expect(res.statusCode).toEqual(401);
    });
});

afterAll(async (done) => {
    try {
        await mongoose.connection.close();
        await server.close();
        done();
    } catch (error) {
        console.log(error);
        done();
    }
})


// async function createDummy(userDets) {

//     const user = new User({
//       email: userDets.email
//     });

//     console.log("FUK U BIUCH")

//     if (userDets.password) {
//       user.hash = bcrypt.hashSync(userDets.password, 10);
//     }
//     await user.save();
// };