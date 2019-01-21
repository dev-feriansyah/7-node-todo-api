const {mongoose} = require('./../server/db/mongoose'),
      {ObjectID} = require('mongodb'),
      {Todo}     = require('./../server/models/todo'),
      {User}     = require('./../server/models/user');

const prettyOutput = (text) => JSON.stringify(text, undefined, 2);

const id = '5c45c4ccc5454a2718f704b9';

// Check id dengan OBJECT ID dari mongoose
// if(!ObjectID.isValid(id)) {
//   console.log('ID is Not valid');
// }

// Array of object
// Todo.find({_id: id}).then(todos => console.log('Todos', prettyOutput(todos)));
// 1 Object
// Todo.findOne({_id: id}).then(todo => console.log('Todo', prettyOutput(todo)));
// 1 Object By id
Todo
  .findById(id)
  .then(todo => {
    if(!todo) {
      return console.log(`Todo with Id: ${id} NOT FOUND`);
    }
    console.log('Todo by ID', prettyOutput(todo));
  })
  .catch(e => console.log(e));

// Error akan terjadi jika id yang diberikan tidak valid
// jika tidak ada object dengan id yang diberikan masih akan menjalakan success yaitu then

const userID = '5c44533d172ff00bd4e095ca';
User
  .findById(userID)
  .then(user => {
    if(!user) {
      return console.log(`User with ID: ${userID} NOT FOUND`);
    }
    console.log('User : ', user);
  })
  .catch(e => console.log(e));