const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.PROD_MONGODB = 'mongodb://192.168.1.1:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.PROD_MONGODB = 'mongodb://192.168.1.1:27017/TodoAppTest';
}