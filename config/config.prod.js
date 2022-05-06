const { mongodbUri, redisHost } = require('./secret')

module.exports = appInfo => {

  const config = exports = {};

  config.keys = appInfo.name + '_1650426914972_246';

  config.middleware = [
    "errHandler",
  ];

  config.mongoose = {
    client: {
      url: mongodbUri,
      options: {
        serverSelectionTimeoutMS: 5000,
        useUnifiedTopology: true
      },
      plugins: [],
    },
  };

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: redisHost,   // Redis host
      db: 0,
    },
  }

  config.bodyParser = {
    jsonLimit: '1mb',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: "*"
  }

  return {
    ...config,
  };
};
