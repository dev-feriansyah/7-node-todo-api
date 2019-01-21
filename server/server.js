const bodyParser = require('body-parser'),
      express    = require('express');

const {mongoose} = require('./db/mongoose'),
      {Todo}     = require('./models/todo'),
      {User}     = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const newTodo = new Todo({
    text: req.body.text
  });
  newTodo
    .save()
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

app.listen(3000, () => {
  console.log('Server run in port 3000');
});

module.exports = {app};
