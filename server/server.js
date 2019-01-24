require('./config/config'); // Setting up NODE_ENV for test and development
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const express    = require('express');
const _          = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todo');
const {User}     = require('./models/user');

const app  = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const body = _.pick(req.body, ['text']);
  Todo
    .create(body)
    .then(user => {
      res.send(user);
    }, e => {
      res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
  Todo
    .find()
    .then(results => res.send({results}))
    .catch(e => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  // Check id valid atau tidak
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  Todo
    .findById(id)
    .then(result => {
      if(!result) {
        return res.status(404).send();
      }
      res.send({result});
    })
    .catch(e => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo
    .findByIdAndDelete(id)
    .then(result => {
      if(!result) {
        return res.status(404).send();
      }
      res.send({result});
    })
    .catch(e => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed   = false;
    body.completedAt = null;
  }

  Todo
    .findByIdAndUpdate(id, body, {new: true})
    .then(result => {
      if(!result) {
        return res.status(404).send();
      }
      res.send({result});
    })
    .catch(e => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Server run in port ${port}`);
});

module.exports = {app};
