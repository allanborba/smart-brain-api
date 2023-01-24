const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {

  const { authorization } = req.headers;
  if(!authorization || authorization == 'null') return res.status(401).json('Unauthorized');

  redisClient.get(authorization, (error, reply) => {
    if(error || !reply || reply == 'null') return res.status(401).json('Unauthorized');
  });

  return next();
}

module.exports = { requireAuth }