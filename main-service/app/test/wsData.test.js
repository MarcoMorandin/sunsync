const request = require('supertest');
const assert = require('assert');

const url = 'http://localhost:3000/api/v2'
require("dotenv").config();

const token = process.env.TOKEN_TEST

test('URL should be defined', () => {
    expect(url).toBeDefined();
});

test('GET /wsdata should return 200', () => {
    return request(url)
        .get('/wsdata')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res) {
            assert(!res.body.hasOwnProperty('time'))
            assert(!res.body.hasOwnProperty('humidity'))
            assert(!res.body.hasOwnProperty('rain'))
            assert(!res.body.hasOwnProperty('temperature'))
            assert(!res.body.hasOwnProperty('wind_direction'))
            assert(!res.body.hasOwnProperty('wind_speed'))
            assert(!res.body.hasOwnProperty('pressure'))
            assert(!res.body.hasOwnProperty('solar_power'))
            assert(!res.body.hasOwnProperty('ws_id'))
        })
});

test('GET /wsdata without token should return 401', () => {
    return request(url)
        .get('/wsdata')
        .expect(401)
});

test('GET /wsdata/{ws_id} with a malformed ObjectId should return 400', () => {
    return request(url)
        .get('/wsdata/123')
        .auth(token, { type: 'bearer' })
        .expect(400)
});

test('GET /wsdata/{ws_id} with a wrong ObjectId should return 404', () => {
    return request(url)
        .get('/wsdata/664cab3d78421495bb3ad186')
        .auth(token, { type: 'bearer' })
        .expect(404)
});

test('GET /wsdata with invalid dates should return 404', () => {
    return request(url)
        .get('/wsdata')
        .query({
            startdate: '123',
            enddate: '123'
        })
        .auth(token, { type: 'bearer' })
        .expect(400)
});