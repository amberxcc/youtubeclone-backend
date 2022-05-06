const { mongodbUri } = require('./secret')

module.exports = appInfo => {

  const config = exports = {};

  config.keys = appInfo.name + '_1650426914972_246';

  config.middleware = [
    "errHandler",
  ];

  config.proxy = true;

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