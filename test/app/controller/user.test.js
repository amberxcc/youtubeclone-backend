'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const fs = require('fs')

const testData = require('../../data.json')

describe('=====> user controller', () => {

    before(async () => {
        await app.mongoose.connection.db.dropDatabase()
        await app.redis.flushdb()
    });

    describe('POST /api/v1/users/register', () => {
        it('注册成功 => 200 + {user}', async () => {
            const user = testData.registerData
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
        it('登录成功 => 200 + {user}', async () => {
            const user = testData.loginData
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
        it('获取当前用户信息成功 => 200 + {user}', async () => {
            const user = testData.loginData
            const response = await app
                .httpRequest()
                .get('/api/v1/users')
                .set('Authorization', 'Bearer ' + testData.token)
            assert(response.status === 200)
            assert(response.body.user.email === user.email)
            assert(response.body.user.token)
        });
    })

    describe('PATCH /api/v1/users', () => {
        it('修改用户信息成功 => 200 + {user}', async () => {
            const response = await app
                .httpRequest()
                .patch('/api/v1/users')
                .set('Authorization', 'Bearer ' + testData.token)
                .send({ user: { email: 'unittest@qq.com' } })
            assert(response.status === 200)
            assert(response.body.user.email === 'unittest@qq.com')
        })
    })

    describe('POST /api/v1/users/:userId/subscribe', () => {
        it('订阅频道成功 => 200 {..., isSubscribed:true}', async () => {
            const testChannelData = testData.channelData1
            const ctx = app.mockContext();
            const user = await ctx.service.user.createNewUser(testChannelData)
            testData.channelId = user.id

            const response = await app
                .httpRequest()
                .post(`/api/v1/users/${user.id}/subscribe`)
                .set('Authorization', 'Bearer ' + testData.token)

            assert(response.status === 200)
            assert(response.body.user.username === testChannelData.username)
            assert(response.body.user.isSubscribed === true)
        })
    })

    describe('DELETE /api/v1/users/:userId/subscribe', () => {
        it('取消订阅频道成功 => 200 {..., isSubscribed:false}', async () => {
            const testChannelData = testData.channelData1

            const response = await app
                .httpRequest()
                .delete(`/api/v1/users/${testData.channelId}/subscribe`)
                .set('Authorization', 'Bearer ' + testData.token)

            assert(response.status === 200)
            assert(response.body.user.username === testChannelData.username)
            assert(response.body.user.isSubscribed === false)
        })

    })

    after(() => {
        fs.writeFileSync('./test/data.json', JSON.stringify(testData))
    });
});
