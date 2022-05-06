'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const fs = require('fs')

const testData = require('../../data.json')

describe('=====> video controller', () => {

  describe('GET /api/v1/videos', () => {

    it('创建视频成功 => 201 + {video, user} ', async () => {
      const videoInfo = testData.controllerVideoData
      const response = await app
        .httpRequest()
        .post('/api/v1/videos')
        .set('Authorization', 'Bearer ' + testData.token)
        .send(videoInfo)

      assert(response.status === 201)
      assert(response.body.video.title === videoInfo.title)
    });

    it('获取视频列表成功 => 200 + {videos, videosCount} ', async () => {
      const response = await app
        .httpRequest()
        .get('/api/v1/videos')

      assert(response.status === 200)
      assert(response.body.videos instanceof Array)
      assert(typeof response.body.videosCount === 'number')
    });
  })

  after(() => {
    fs.writeFileSync('./test/data.json', JSON.stringify(testData))
  });
});
