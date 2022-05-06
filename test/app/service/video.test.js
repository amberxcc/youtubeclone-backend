'use strict';

const { app, assert } = require('egg-mock/bootstrap');

const testData = require('../../data.json')

describe('=====> video service', () => {

    describe('createVideo()', async () => {

        it('创建一条新的视频记录', async () => {
            const ctx = app.mockContext()
            const videoInfo = testData.video
            const newVideo = await ctx.service.video.createVideo(videoInfo)
            assert(newVideo.title === videoInfo.title)
        });
    });
});
