const request = require('supertest');
const url = 'http://localhost:3000/api/v2'
require("dotenv").config();

const token = process.env.TOKEN_TEST

const glob_var = {}

test('URL should be defined', () => {
    expect(url).toBeDefined();
});

test('POST /users with invalid token should return 401', () => {
    return request(url)
        .post('/users')
        .send({
            username: 'test',
            mail: 'test@test.com',
            password: 'test',
            role: 1
        })
        .set('Content-Type', 'application/json')
        .expect(401);
});

test('POST /users with empty username should return 400', () => {
    return request(url)
        .post('/users')
        .auth(token, { type: 'bearer' })
        .send({
            username: '',
            mail: 'test@test.com',
            password: 'test',
            role: 1
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('POST /users with empty email should return 400', () => {
    return request(url)
        .post('/users')
        .auth(token, { type: 'bearer' })
        .send({
            username: 'test',
            mail: '',
            password: 'test',
            role: 1
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('POST /users with empty password should return 400', () => {
    return request(url)
        .post('/users')
        .auth(token, { type: 'bearer' })
        .send({
            username: 'test',
            mail: 'test@test.com',
            password: '',
            role: 1
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('POST /users with empty role should return 400', () => {
    return request(url)
        .post('/users')
        .auth(token, { type: 'bearer' })
        .send({
            username: 'test',
            mail: 'test@test.com',
            password: 'test',
            role: ''
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('POST /users with malformed email should return 400', () => {
    return request(url)
        .post('/users')
        .auth(token, { type: 'bearer' })
        .send({
            username: 'test',
            mail: 'test^test.com',
            password: 'test',
            role: 1
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('POST /users should return 200', () => {
    return request(url)
        .post('/users')
        .auth(token, { type: 'bearer' })
        .send({
            username: 'test',
            mail: 'test@test.com',
            password: 'test',
            role: 1
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
            glob_var['usr_id'] = res.body.data._id;
        });
});

test('POST /users with existing email should return 409', () => {
    return request(url)
        .post('/users')
        .auth(token, { type: 'bearer' })
        .send({
            username: 'test',
            mail: 'test@test.com',
            password: 'test',
            role: 1
        })
        .set('Content-Type', 'application/json')
        .expect(409);
});

test('POST /users/authentication correct credentials should return 200', () => {
    return request(url)
        .post('/users/authentication')
        .send({
            mail: 'test@test.com',
            password: 'test'
        })
        .set('Content-Type', 'application/json')
        .expect(200);
});

test('POST /users/authentication invalid email should return 400', () => {
    return request(url)
        .post('/users/authentication')
        .send({
            mail: 'test^test.com',
            password: 'test'
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('POST /users/authentication invalid password should return 400', () => {
    return request(url)
        .post('/users/authentication')
        .send({
            mail: 'test@test.com',
            password: ''
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('POST /users/refresh should return 200', () => {
    return request(url)
        .post('/users/refresh')
        .set("Cookie", [ 'refresh_jwt=' + process.env.REFRESH_TOKEN_TEST ])
        .expect(200);
});

test('POST /users/refresh without valid token should return 401', () => {
    return request(url)
        .post('/users/refresh')
        .expect(401);
});

test('DELETE /users/{id} should return 200', () => {
    return request(url)
        .del('/users/' + glob_var['usr_id'])
        .auth(token, { type: 'bearer' })
        .expect(200);
});
