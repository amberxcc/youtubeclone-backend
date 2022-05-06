'use strict';

const { app, assert } = require('egg-mock/bootstrap');

const testData = require('../../data.json')

describe('=====> vod controller', () => {
    describe('GET /api/v1/vod/createUploadVideo', () => {

        it('获取视频上传地址和凭证成功 => 200 + {VideoId, ...}', async () => {
            const response = await app
                .httpRequest()
                .get('/api/v1/vod/createUploadVideo?Title=test&FileName=test.mp4')
                .set('Authorization', 'Bearer ' + testData.token)
                .expect(200)

            assert(response.body.VideoId)
            testData.newVideoId = response.body.VideoId
        });
    })

    describe('GET /api/v1/vod/createUploadVideo', () => {
        it('刷新视频上传凭证成功 => 200 + {VideoId, ...}', async () => {
            const response = await app
                .httpRequest()
                .get(`/api/v1/vod/refreshUpload?VideoId=${testData.newVideoId}`)
                .set('Authorization', 'Bearer ' + testData.token)
                .expect(200)

            assert(response.body.VideoId)
        });
    })

    after(() => {
        require('fs').writeFileSync('./test/data.json', JSON.stringify(testData))
    });
})

