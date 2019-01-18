// const Mongoclient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

const Obj = new ObjectID();
console.log(Obj);

const mongoUrl = 'mongodb://192.168.1.1:27017';
const dbName = 'ToDoApp';

// Connect to MongoDb
MongoClient.connect(mongoUrl, { useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect database');
  }
  console.log('Connected to database');
  // Grab database
  const db = client.db(dbName);

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable add data to Todos', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Feri',
  //   age: 20,
  //   location: 'Samarinda'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable add data to Todos', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  // Using promise
  // db.collection('Users')
  //   .insertOne({ name: 'Ahmad', age: 20, location: 'London' })
  //   .then(result => {
  //     console.log('Saved !');
  //     console.log(result.ops);
  //   })
  //   .catch(err => {
  //     console.log('Unable to add data');
  //   });

  client.close();
});