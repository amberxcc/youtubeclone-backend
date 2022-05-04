module.exports = app => {
  const { router, controller } = app
  const auth = app.middleware.auth

  router.prefix('/api/v1')

  router.post('/users/register', controller.user.register)
  router.post('/users/login', controller.user.login)
  router.get('/users', auth(), controller.user.getCurrentUser)
  router.patch('/users', auth(), controller.user.update)
  router.post('/users/:userId/subscribe', auth(), controller.user.subscribe)
  router.delete('/users/:userId/subscribe', auth(), controller.user.unSubscribe)
  router.get('/users/:channelId/profile', auth({required:false}), controller.user.getProfile)
  router.get('/users/:userId/subscriptions', auth(), controller.user.getSubscriptions)

  router.get('/vod/createUploadVideo', auth(), controller.vod.createUploadVideo)
  router.get('/vod/refreshUpload', auth(), controller.vod.refreshUpload)

  router.post('/videos', auth(), controller.video.createVideo)
  router.get('/video/:videoId', auth({required:false}), controller.video.getVideo)
  router.get('/videos', controller.video.getVideos)
  router.get('/videos/channel/:channelId', controller.video.getChannelVideos)
  router.get('/videos/feed', auth(), controller.video.getFeedVideos)
  router.get('/videos/user/liked', auth(), controller.video.getLikedVideos)
  router.patch('/videos/:videoId', auth(), controller.video.updateVideo)
  router.delete('/videos/:videoId', auth(), controller.video.deleteVideo)
  router.post('/videos/:videoId/like', auth(), controller.video.likeVideo)
  router.delete('/videos/:videoId/like', auth(), controller.video.dislikeVideo)

  router.post('/videos/:videoId/comments', auth(), controller.video.addComment)
  router.delete('/videos/comments/:commentId', auth(), controller.video.deleteComment)
  router.get('/videos/:videoId/comments', controller.video.getComments)
};
