const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject(); // Change mongoose doc to object we can use

  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id, access}, 'abc123');

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decode;

  try {
    decode = jwt.verify(token, 'abc123');
  } catch(e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decode._id,
    'tokens.access': decode.access,
    'tokens.token': token
  });
}

UserSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, 10);
    next();
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};