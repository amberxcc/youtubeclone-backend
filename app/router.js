module.exports = app => {
  const { router, controller } = app
  router.prefix('/api/v1')

  router.get('/users/register', controller.user.register)
  router.get('/users/login', controller.user.login)
};
