'use strict';

const { app, assert } = require('egg-mock/bootstrap')
const fs = require('fs')

const testData = require('../../data.json')

describe('=====> user service', () => {

    describe('findUserByEmail(()', () => {

        it('传入存在的email,获取用户信息成功', async () => {
            const ctx = app.mockContext();
            const email = testData.registerData.email
            const user = await ctx.service.user.findUserByEmail(email);
            assert(user);
            assert(user.email === email)
        });

        it('传入不存在的email, 获取用户信息失败', async () => {
            const ctx = app.mockContext();
            const email = 'null@null.com'
            const user = await ctx.service.user.findUserByEmail(email);
            assert(!user)
        });

    });

    describe('findUserByUsername(()', () => {

        it('传入存在的username, 获取用户信息成功', async () => {
            const ctx = app.mockContext();
            const username = testData.registerData.username
            const user = await ctx.service.user.findUserByUsername(username);

            assert(user.username === username)
        });

        it('传入不存在的username, 获取用户信息失败', async () => {
            const ctx = app.mockContext();
            const username = 'null'
            const user = await ctx.service.user.findUserByUsername(username);
            assert(!user)
        });

    });

    describe('createNewUser()', () => {
        it('创建新用户，成功保存到数据库', async () => {
            const ctx = app.mockContext();
            const data = testData.serviceCreateUserData
            const user = await ctx.service.user.createNewUser(data);

            assert(user.username === testData.serviceCreateUserData.username)
            assert(user.email === testData.serviceCreateUserData.email)
        })
    })

    describe('updateUser()', () => {
        it('更新用户email信息成功', async () => {
            const ctx = app.mockContext();
            const oldUser = await ctx.service.user.findUserByEmail(testData.serviceCreateUserData.email)
            const data = { email: "updated@qq.com" }
            const updatedUser = await ctx.service.user.updateUser(oldUser.id, data);

            assert(updatedUser.email === data.email)
        })
    })


    after(() => {
        fs.writeFileSync('./test/data.json', JSON.stringify(testData))
    });
});
