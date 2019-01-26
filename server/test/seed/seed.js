const {ObjectID} = require('mongodb');
const jwt        = require('jsonwebtoken');

const {Todo}     = require('./../../models/todo');
const {User}     = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
  {
    _id: userOneID,
    email: 'feriansyah@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123')
    }]
  }, 
  {
    _id: userTwoID,
    email: 'udin@example.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoID, access: 'auth'}, 'abc123')
    }]
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: 'First todo',
    _creator: userOneID
  },
  {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 123312,
    _creator: userTwoID
  }
];

const populateUsers = done => {
  User
    .deleteMany({})
    .then(() => {
      return User.create(users);
    })
    .then(() => done());
};

const populateTodos = done => {
  Todo
    .deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};


module.exports = {
  users,
  todos,
  populateUsers,
  populateTodos
};