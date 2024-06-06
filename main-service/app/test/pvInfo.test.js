const request = require('supertest');
const assert = require('assert');

const url = 'http://localhost:3000/api/v2'
require("dotenv").config();

const token = process.env.TOKEN_TEST
const glob_var = {}

test('URL should be defined', () => {
    expect(url).toBeDefined();
});

test('GET /pvinfo should return 200', () => {
    return request(url)
        .get('/pvinfo')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res) {
            assert(!res.body.hasOwnProperty('pv_id'))
            assert(!res.body.hasOwnProperty('location'))
            assert(!res.body.hasOwnProperty('installed_power'))
            assert(!res.body.hasOwnProperty('description'))
            assert(!res.body.hasOwnProperty('url'))
            assert(!res.body.hasOwnProperty('ws_id'))
        })
});

test('GET /pvinfo without token should return 401', () => {
    return request(url)
        .get('/pvinfo')
        .expect(401)
});

test('GET /pvinfo/{pv_id} with a malformed ObjectId should return 400', () => {
    return request(url)
        .get('/pvinfo/123')
        .auth(token, { type: 'bearer' })
        .expect(400)
});

test('POST /pvinfo should return 200', () => {
    return request(url)
        .post('/pvinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            url: 'http://test.test',
            ws_id: '663a2ce39aa10ae31b0581b8',
            installed_power: 123,
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
            glob_var['pvinfo_id'] = res.body.data._id;
        });
});

test('POST /pvinfo without token should return 401', () => {
    return request(url)
        .post('/pvinfo')
        .send({
            description: 'test',
            url: 'http://test.test',
            ws_id: '663a2ce39aa10ae31b0581b8',
            installed_power: 123,
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(401)
});

test('POST /pvinfo without description should return 400', () => {
    return request(url)
        .post('/pvinfo')
        .auth(token, { type: 'bearer' })
        .send({
            url: 'http://test.test',
            ws_id: '663a2ce39aa10ae31b0581b8',
            installed_power: 123,
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('POST /pvinfo without url should return 400', () => {
    return request(url)
        .post('/pvinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            ws_id: '663a2ce39aa10ae31b0581b8',
            installed_power: 123,
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('POST /pvinfo without ws_id should return 400', () => {
    return request(url)
        .post('/pvinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            url: 'http://test.test',
            installed_power: 123,
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('POST /pvinfo without installed_power should return 400', () => {
    return request(url)
        .post('/pvinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            url: 'http://test.test',
            ws_id: '663a2ce39aa10ae31b0581b8',
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('POST /pvinfo without location should return 400', () => {
    return request(url)
        .post('/pvinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            url: 'http://test.test',
            ws_id: '663a2ce39aa10ae31b0581b8',
            installed_power: 123,
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('POST /pvinfo with a malformed url should return 400', () => {
    return request(url)
        .post('/pvinfo')
        .auth(token, { type: 'bearer' })
        .send({
            description: 'test',
            url: 'test/$$test',
            ws_id: '663a2ce39aa10ae31b0581b8',
            installed_power: 123,
            location: { lat: 123, long:123, alt:123 }
        })
        .set('Content-Type', 'application/json')
        .expect(400)
});

test('DELETE /pvindo/{id} should return 200', () => {
    return request(url)
        .del('/pvinfo/' + glob_var['pvinfo_id'])
        .auth(token, { type: 'bearer' })
        .expect(200);
});

test('DELETE /pvindo/{id} with malformed ObjectId should return 400', () => {
    return request(url)
        .del('/pvinfo/123')
        .auth(token, { type: 'bearer' })
        .expect(400);
});

test('DELETE /pvindo/{id} with a wronf Id should return 404', () => {
    return request(url)
        .del('/pvinfo/664cb4298a562656055def66')
        .auth(token, { type: 'bearer' })
        .expect(404);
});