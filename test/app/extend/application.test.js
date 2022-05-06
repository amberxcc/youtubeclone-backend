'use strict';

const { app, assert } = require('egg-mock/bootstrap');

const testData = require('../../data.json')

describe('=====> extend/application', () => {

    describe('get vodClient()', async () => {

        it('获取vodClient 单例对象', async () => {
            const vodClient1 = app.vodClient
            const vodClient2 = app.vodClient
            assert(vodClient1 && vodClient1===vodClient2)
        });
    });
});
