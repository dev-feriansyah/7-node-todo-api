const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://192.168.1.1:27017/ToDoApp';

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
  if(err) {
    return console.log('Unable to connect database');
  }
  console.log('Connected to database');

  db.close();
});