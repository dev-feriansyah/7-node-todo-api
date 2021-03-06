const mongoose = require('mongoose');

// mongoose v5 using native promise as default
// mongoose.Promise = global.Promise;

// fix deprecation issue
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const mongoUrl = process.env.PROD_MONGODB;
mongoose.connect(mongoUrl);

module.exports = {mongoose};