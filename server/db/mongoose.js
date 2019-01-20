const mongoose = require('mongoose');

// mongoose v5 using native promise as default
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.1.1:27017/TodoApp', { useNewUrlParser: true });

module.exports = {mongoose};