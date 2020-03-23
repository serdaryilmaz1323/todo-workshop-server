import { Schema, Document, model } from 'mongoose';
import mongooseUniqueValidator = require('mongoose-unique-validator');
import bcrypt from 'bcryptjs';

import { IUser } from './../models/user.model';

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageURL: String,
    provider: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false, bufferCommands: false },
);

mongooseUniqueValidator(UserSchema);

export interface UserDocument extends IUser, Document {
  isPasswordValid(password: string): string;
}

// check password is valid
UserSchema.methods.isPasswordValid = function(password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

// crypt password before save
UserSchema.pre<UserDocument>('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password);
  }
  next();
});

// Delete password before sending user model
UserSchema.set('toJSON', {
  transform: function(_, ret) {
    delete ret.password;
    return ret;
  },
  getters: true,
});

UserSchema.set('toObject', {
  transform: function(_, ret) {
    delete ret.password;
    return ret;
  },
  getters: true,
});

// Virtuals
UserSchema.virtual('fullName').get(function(this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

export const UserEntity = model<UserDocument>('User', UserSchema);
