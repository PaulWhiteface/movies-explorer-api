const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 100,
});

module.exports = limiter;
