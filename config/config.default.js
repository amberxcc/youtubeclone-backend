module.exports = appInfo => {

  const config = exports = {};

  config.keys = appInfo.name + '_1650426914972_246';

  config.middleware = [
    "errHandler",
  ];

  config.mongoose = {
    client: {
      url: 'mongodb://47.96.9.220:27017/youtubeclone',
      options: {
        serverSelectionTimeoutMS: 5000,
        useUnifiedTopology: true
      },
      plugins: [],
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: "*"
  }

  const localConfig = require('./local')

  return {
    ...config,
    ...localConfig,
  };
};
