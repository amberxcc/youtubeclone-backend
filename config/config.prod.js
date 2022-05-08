exports.mongoose = {
  client: {
    url: require('./secret').mongodbProdUri,
    options: {
      serverSelectionTimeoutMS: 5000,
      useUnifiedTopology: true
    },
    plugins: [],
  },
};

exports.redis = {
  client: {
    port: 6379,          // Redis port
    host: require('./secret').redisHost,   // Redis host
    password: 'auth',
    db: 2,
  },
}