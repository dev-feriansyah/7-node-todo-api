const {SHA256} = require('crypto-js');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');

const password = '123abc!';

// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync(password, salt);
const hash = bcrypt.hashSync(password, 10); // Auto-gen salt and hash

console.log(bcrypt.compareSync(password, hash));



// const data = { id: 4 };
// const token = jwt.sign(data, 'feri123');
// const decode = jwt.verify(token, 'feri123');
// // console.log(`token: ${token}`);
// // console.log('decode',decode);
// console.log(typeof token);

// const message = 'I am number 4';
// // Hashing -> encrypt string
// const hashMessage = SHA256(message).toString();
// // console.log(hashMessage);

// const data = { id: 4 };
// const token = {
//   data,
//   // somesecret is salting
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // JAVASCRIPT WEB TOKEN
// // prevent change of data by using encrypting

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log("Data changed, Don't trust it");
// }


