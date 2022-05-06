'use strict';

const { app, assert } = require('egg-mock/bootstrap');

const testData = require('../../data.json')

describe('=====> user service', () => {

    describe('findUserByEmail(()', () => {

        it('获取真实存在的email', async () => {
            const ctx = app.mockContext();
            const email = testData.login.email
            const user = await ctx.service.user.findUserByEmail(email);
            assert(user);
            assert(user.email === email);
        });

        it('获取不存在的email', async () => {
            const ctx = app.mockContext();
            const email = 'null@null.com'
            const user = await ctx.service.user.findUserByEmail(email);
            assert(!user)
        });

    });
});
