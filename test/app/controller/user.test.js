'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const fs = require('fs')

const testData = require('../../data.json')

describe('=====> user controller', () => {

    before(async () => {
        await app.mongoose.connection.db.dropDatabase()
    });

    describe('POST /api/v1/users/register', () => {
        it('注册成功时 => 200 + {user}', async () => {
            const user = testData.register
            const response = await app
                .httpRequest()
                .post('/api/v1/users/register')
                .send({ user })
            assert(response.status === 200)
            assert(response.body.user.email === user.email)
            assert(response.body.user.token)

            testData.token = response.body.user.token
        })
    })

    describe('POST /api/v1/users/login', () => {
        it('登录成功时 => 200 + {user}', async () => {
            const user = testData.login
            const response = await app
                .httpRequest()
                .post('/api/v1/users/login')
                .send({ user })
            assert(response.status === 200)
            assert(response.body.user.email === user.email)
            assert(response.body.user.token)
        })
    })

    describe('GET /api/v1/users', () => {
        it('获取当前用户信息成功时 => 200 + {user}', async () => {
            const user = testData.login
            const response = await app
                .httpRequest()
                .get('/api/v1/users')
                .set('Authorization', 'Bearer ' + testData.token)
            assert(response.status === 200)
            assert(response.body.user.email === user.email)
            assert(response.body.user.token)
        });
    })

    after(() => {
        fs.writeFileSync('./test/data.json', JSON.stringify(testData))
    });
});
