require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization')

const db = knex({ client: 'pg', connection: process.env.POSTGRES_URI });
db.raw("SELECT 1").then(() => console.log("PostgreSQL connected")).catch((e) => console.error(e));

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> { res.send('API') });
app.get('/db', (req, res)=> { res.send(db.users) });
app.post('/signin', signin.signinAuthentication(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)});
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)});
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)});
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)});

app.listen(3000, ()=> console.log('app is running on port 3000'));