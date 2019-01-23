const mongoose = require('mongoose');

// mongoose v5 using native promise as default
// mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false); // fix deprecation issue
const mongoUrl = process.env.PROD_MONGODB;
mongoose.connect(mongoUrl, { useNewUrlParser: true });

module.exports = {mongoose};