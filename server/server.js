require('./config/config'); // Setting up NODE_ENV for test and development
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const express    = require('express');
const _          = require('lodash');

const {mongoose}     = require('./db/mongoose');
const {Todo}         = require('./models/todo');
const {User}         = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app  = express();
const port = process.env.PORT;

app.use(bodyParser.json());

/**
 * TODOS ROUTES
 */
app.post('/todos', authenticate, (req, res) => {
  const body = _.pick(req.body, ['text']);
  Todo
    .create({...body, _creator: req.user._id})
    .then(todo => res.send(todo))
    .catch(e => res.status(400).send(e));
});

app.get('/todos', authenticate, (req, res) => {
  Todo
    .find({_creator: req.user._id})
    .then(results => res.send({results}))
    .catch(e => res.status(400).send(e));
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) return res.status(404).send();
  
  Todo
    .findOne({_id: id, _creator: req.user._id})
    .then(result => {
      if (!result) return res.status(404).send();

      res.send({result});
    })
    .catch(e => res.status(400).send());
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) return res.status(404).send();

  Todo
    .findOneAndDelete({_id: id, _creator: req.user._id})
    .then(result => {
      if (!result) return res.status(404).send();
      res.send({result});
    })
    .catch(e => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) return res.status(404).send();
  
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed   = false;
    body.completedAt = null;
  }

  Todo
    .findOneAndUpdate({_id: id, _creator: req.user._id}, body, {new: true})
    .then(result => {
      if (!result) return res.status(404).send();
      res.send({result});
    })
    .catch(e => res.status(400).send());
});

/**
 * USER ROUTES
 */
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
  
  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send(user))
    .catch(e => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User
    .findByCredentials(body.email, body.password)
    .then(user => user.generateAuthToken().then(token => res.header('x-auth', token).send(user)))
    .catch(e => res.status(400).send());
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => res.send())
    .catch(e => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Server run in port ${port}`);
});

module.exports = {app};
