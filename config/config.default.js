const secret = require('./secret')

module.exports = appInfo => {

  const config = exports = {};

  config.keys = appInfo.name + '_1650426914972_246';

  config.middleware = [
    "errHandler",
  ];

  config.token = {
    TOKEN_EXPIRE: '7d'
  }

  config.mongoose = {
    client: {
      url: require('./secret').mongodbDevUri,
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
      host: require('./secret').redisHost,   // Redis host
      password: 'auth',
      db: 1,
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
    ...secret,
  };
};
