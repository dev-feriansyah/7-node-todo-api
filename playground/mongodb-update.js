const { MongoClient, ObjectID } = require('mongodb');

const mongoUrl = 'mongodb://192.168.1.1';
const dbName   = 'ToDoApp';

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
  if(err) {
    return console.log('Unable to Connect to MongoDB');
  }
  console.log('Connected to MongoDb');
  const db = client.db(dbName);

  // db.collection('Todos')
  //   .findOneAndUpdate(
  //     { _id: new ObjectID('5c4069d6a56bb71c7c756990') },
  //     { 
  //       $set: { completed: true }
  //     },
  //     { returnOriginal: false }
  //   )
  //   .then(result => {
  //     console.log(result);
  //   });

  db.collection('Users')
    .findOneAndUpdate(
      { _id: new ObjectID('5c41bd7d051ed103c0684dd4') },
      { 
        $set: { name: 'Feri' },
        $inc: { age: 1 }
      },
      { returnOriginal: false }
    )
    .then(result => {
      console.log(result);
    });

  client.close();
});