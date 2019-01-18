const { MongoClient, ObjectID } = require('mongodb');

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

  // db.collection('Todos')
  //   .find({ completed: true}) // Find akan mengembalikan "cursor"
  //   .toArray() // method yang ada di "cursor" seperti "toArray" akan mengembalikan promise
  //   .then(docs => {
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   }, err => {
  //     console.log('Error when fetching data');
  //   });

  db.collection('Users')
    .find({ name: 'Feri' })
    .count()
    .then(count => {
      console.log(`Users collections have ${count} Feri`);
    })
    .catch(err => {
      console.log('Unable to fetch data with name Feri', err);
    });

  client.close();
});