const jwt = require('jsonwebtoken');

const redis = require('redis');
const redisClient = redis.createClient({ url: process.env.REDIS_URI, legacyMode: true});
const redisConnect = async () => await redisClient.connect().then(()=> console.log('Redis connected'));
redisConnect();

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return Promise.reject('incorrect form submission');

  return db.select('email', 'hash').from('login').where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        return db.select('*').from('users').where('email', '=', email)
          .then(user => user[0] )
          .catch(err => Promise.reject('unable to get user'))
      } else Promise.reject('wrong credentials')
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const {authorization} = req.headers;

  redisClient.get(authorization, (error, reply) => {
    if(error || !reply) return res.status(401).json('Unauthorized');

    return res.json({id: reply});
  });
}

const createSession = (user) => {
  const {email, id} = user;
  const token = signToken(email);

  return setToken(token, id).then(() => ({success: true, id, token})).catch(error => console.log(error))
}

const setToken = (token, id) => Promise.resolve(redisClient.set(token, id))

const signToken = (email) => {
  const jwtPayload = { email };

  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  if(authorization) return getAuthTokenId(req, res);

  handleSignin(db, bcrypt, req, res)
    .then(data => data.id && data.email ? createSession(data) : Promise.reject(data))
    .then(session => res.json(session))
    .catch(error=> res.status(400).json(error));
}

module.exports = { signinAuthentication, redisClient }
