'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const fs = require('fs')

const testData = require('../../data.json')

describe('=====> video service', () => {

    describe('createVideo()', async () => {

        it('创建一条新的视频记录', async () => {
            const ctx = app.mockContext()
            const videoInfo = testData.serviceVideoData
            const user = testData.mainUserId
            const newVideo = await ctx.service.video.createVideo(videoInfo,user)
            assert(newVideo.title === videoInfo.title)
        });
    });

    after(() => {
        fs.writeFileSync('./test/data.json', JSON.stringify(testData))
    });
});
