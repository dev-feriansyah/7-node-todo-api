const {mongoose} = require('./../server/db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

const prettyOutput = (text) => JSON.stringify(text, undefined, 2);

const ids = [
  '5c46f735fb26a21a643e7db7',
  '5c46f735fb26a21a643e7db8'
];

Todo
  .deleteMany({_id: {$in: ids} })
  .then(result => console.log(result))
  .catch(e => console.log('Error occur'));