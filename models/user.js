var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'name is too short'],
    maxlength: [99, 'name is too long']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true,
    minlength: [3, 'password is too short'],
    maxlength: [99, 'password is too long']
  }
})

UserSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) return next()
  var hash = bcrypt.hashSync(user.password, 10)
  user.password = hash
  next()
})

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret.password
    return ret
  }
}

module.exports = mongoose.model('User', UserSchema)
