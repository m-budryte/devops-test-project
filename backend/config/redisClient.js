const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis', // Redis service name defined in docker-compose.yml
  port: 6379
});

module.exports = redis;
