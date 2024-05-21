const request = require('supertest');
const url = 'http://localhost:3000/api/v2'
require("dotenv").config();

const token = process.env.TOKEN_TEST

test('URL should be defined', () => {
    expect(url).toBeDefined();
});

test('GET /users should return 200', () => {
    return request(url)
        .get('/users')
        .auth(token, { type: 'bearer' })
        .expect(200);
});
