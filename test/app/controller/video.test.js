'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('=====> video controller', () => {
  describe('GET /api/v1/videos', () => {

    it('获取视频列表成功时 => 200 + {videos, videosCount} ', async () => {
      const response = await app
        .httpRequest()
        .get('/api/v1/videos')

      assert(response.status === 200)
      assert(response.body.videos instanceof Array)
      assert(typeof response.body.videosCount === 'number')
    });

  })
});
