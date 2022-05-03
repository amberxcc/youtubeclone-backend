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
};
