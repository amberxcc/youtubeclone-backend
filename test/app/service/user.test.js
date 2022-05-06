'use strict';

const { app, assert } = require('egg-mock/bootstrap')
const fs = require('fs')

const testData = require('../../data.json')

describe('=====> user service', () => {

    describe('findUserByEmail(()', () => {

        it('传入真实email获取用户信息', async () => {
            const ctx = app.mockContext();
            const email = testData.loginData.email
            const user = await ctx.service.user.findUserByEmail(email);
            assert(user);
            assert(user.email === email)
            testData.mainUserId = user.id
        });

        it('传入不存在的email获取用户信息', async () => {
            const ctx = app.mockContext();
            const email = 'null@null.com'
            const user = await ctx.service.user.findUserByEmail(email);
            assert(!user)
        });

    });

    after(() => {
        fs.writeFileSync('./test/data.json', JSON.stringify(testData))
    });
});
