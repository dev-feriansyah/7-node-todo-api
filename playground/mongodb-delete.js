const { MongoClient, ObjectID } = require('mongodb');

const mongoUrl = 'mongodb://192.168.1.1';
const dbName   = 'ToDoApp';

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
  if(err) {
    return console.log('Unable to Connect to MongoDB');
  }
  console.log('Connected to MongoDb');
  const db = client.db(dbName);

  // Hapus semua data dengan "completed: true"
  // db.collection('Todos')
  //   .deleteMany({ completed: true })
  //   .then(result => {
  //     console.log(JSON.stringify(result, undefined, 2));
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // Hapus satu lalu kembalikan data yang dihapus
  // db.collection('Todos')
  //   .findOneAndDelete({ completed: false })
  //   .then(result => {
  //     console.log(result);
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   });

  // db.collection('Users')
  //   .deleteMany({ name: 'Feri' })
  //   .then(result => {
  //     console.log(result);
  //   })

  db.collection('Users')
    .findOneAndDelete({ _id: new ObjectID('5c41bd8d18e3ea128c2964ed') })
    .then(result => {
      console.log(result);
    });


  client.close();
});