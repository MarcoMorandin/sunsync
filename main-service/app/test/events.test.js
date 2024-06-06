const request = require('supertest');
const assert = require('assert');
const url = 'http://localhost:3000/api/v2'
require("dotenv").config();

const token = process.env.TOKEN_TEST

const glob_var = {}

test('URL should be defined', () => {
    expect(url).toBeDefined();
});

test('GET /events should return 200', () => {
    return request(url)
        .get('/events')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res) {
            assert(!res.body.hasOwnProperty('time'))
            assert(!res.body.hasOwnProperty('description'))
            assert(!res.body.hasOwnProperty('pv_info'))
        })
});

test('GET /events without token should return 401', () => {
    return request(url)
        .get('/events')
        .expect(401)
});

test('GET /events with invalid pvinfo_id should return 404', () => {
    return request(url)
        .get('/events')
        .query({
            pvinfo_id: '664cab3d78421495bb3ad186'
        })
        .auth(token, { type: 'bearer' })
        .expect(404)
});

test('GET /events with invalid dates should return 400', () => {
    return request(url)
        .get('/events')
        .query({
            startdate: '123',
            enddate: '123'
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
});

test('GET /events with invalid type should return 400', () => {
    return request(url)
        .get('/events')
        .query({
            type: 'abc'
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
});
