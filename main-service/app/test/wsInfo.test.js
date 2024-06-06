const request = require('supertest');
const assert = require('assert');

const url = 'http://localhost:3000/api/v2'
require("dotenv").config();

const token = process.env.TOKEN_TEST
const glob_var = {}

test('URL should be defined', () => {
    expect(url).toBeDefined();
});

test('GET /wsinfo should return 200', () => {
    return request(url)
        .get('/wsinfo')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res) {
            assert(!res.body.hasOwnProperty('ws_id'))
            assert(!res.body.hasOwnProperty('location'))
            assert(!res.body.hasOwnProperty('description'))
            assert(!res.body.hasOwnProperty('url'))
        })
});

test('GET /wsinfo without token should return 401', () => {
    return request(url)
        .get('/wsinfo')
        .expect(401)
});

test('GET /wsinfo/{ws_id} with a malformed ObjectId should return 400', () => {
    return request(url)
        .get('/wsinfo/123')
        .auth(token, { type: 'bearer' })
        .expect(400)
});

test('POST /wsinfo should return 200', () => {
    return request(url)
        .post('/wsinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            url: 'http://test.test',
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
            glob_var['wsinfo_id'] = res.body.data._id;
        });
});

test('POST /wsinfo without token should return 401', () => {
    return request(url)
        .post('/wsinfo')
        .send({
            description: 'test',
            url: 'http://test.test',
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(401)
});

test('POST /wsinfo without description should return 400', () => {
    return request(url)
        .post('/wsinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: '',
            url: 'http://test.test',
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('POST /wsinfo without url should return 400', () => {
    return request(url)
        .post('/wsinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('POST /wsinfo without location should return 400', () => {
    return request(url)
        .post('/wsinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            url: 'http://test.test',
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('DELETE /wsinfo/{id} should return 200', () => {
    return request(url)
        .del('/wsinfo/' + glob_var['wsinfo_id'])
        .auth(token, { type: 'bearer' })
        .expect(200);
});

test('DELETE /wsinfo/{id} with malformed ObjectId should return 400', () => {
    return request(url)
        .del('/wsinfo/123')
        .auth(token, { type: 'bearer' })
        .expect(400);
});

test('DELETE /wsinfo/{id} with a wrong Id should return 404', () => {
    return request(url)
        .del('/wsinfo/664cb4298a562656055def66')
        .auth(token, { type: 'bearer' })
        .expect(404);
});