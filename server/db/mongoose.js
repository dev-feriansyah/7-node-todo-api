const mongoose = require('mongoose');

// mongoose v5 using native promise as default
// mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false); // fix deprecation issue
const mongoUrl = process.env.PROD_MONGODB || 'mongodb://192.168.1.1:27017/TodoApp';
mongoose.connect(mongoUrl, { useNewUrlParser: true });

module.exports = {mongoose};