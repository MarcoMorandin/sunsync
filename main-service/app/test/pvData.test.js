const request = require('supertest');
const assert = require('assert');

const url = 'http://localhost:3000/api/v1'
require("dotenv").config();

const token = process.env.TOKEN_TEST

test('URL should be defined', () => {
    expect(url).toBeDefined();
});

test('GET /pvdata should return 200', () => {
    return request(url)
        .get('/pvdata')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res) {
            assert(!res.body.hasOwnProperty('time'))
            assert(!res.body.hasOwnProperty('power'))
            assert(!res.body.hasOwnProperty('pv_id'))
        })
});

test('GET /pvdata without token should return 401', () => {
    return request(url)
        .get('/pvdata')
        .expect(401)
});

test('GET /pvdata/{pv_id} with a malformed ObjectId should return 400', () => {
    return request(url)
        .get('/pvdata/123')
        .auth(token, { type: 'bearer' })
        .expect(400)
});

test('GET /pvdata/{pv_id} with a wrong ObjectId should return 404', () => {
    return request(url)
        .get('/pvdata/664cab3d78421495bb3ad186')
        .auth(token, { type: 'bearer' })
        .expect(404)
});

test('GET /pvdata with invalid dates should return 404', () => {
    return request(url)
        .get('/pvdata')
        .query({
            startdate: '123',
            enddate: '123'
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
});