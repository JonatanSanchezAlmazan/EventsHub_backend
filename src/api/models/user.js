const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, 'Minimo son 5 caracteres'],
      maxlength: [10, 'Maximo son 10 caracteres']
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/, 'El email es invalido']
    },
    image: { type: String },
    rol: {
      type: String,
      default: 'user',
      enum: ['user', 'owner'],
      tirm: true
    },
    ubi: { type: String, reqired: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model('users', userSchema, 'users');
module.exports = User;
