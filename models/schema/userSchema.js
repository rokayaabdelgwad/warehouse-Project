const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email '],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
 
 
  passwordChangedAt: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  },
  role: {
    
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password '],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password '],
    validate: {
      // this only works on Create and  Save!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same ',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  //   Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //   Delete passwordConfirm fields
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt=Date.now()-1000;
  next()
})
userSchema.pre(/^find/,function(next){
  // this point to the current query 
  this.find({active:{$ne:false}});
  next()

})



userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimesTamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
   
    return JWTTimestamp < changedTimesTamp; //300<200
  }
  // false means Not changes
  return false;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports = userSchema;
