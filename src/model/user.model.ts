import mongoose, { Schema, Document } from 'mongoose';
import mongooseUniqueValidator = require('mongoose-unique-validator');
import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';

export type UserRole =
  | 'root'
  | 'admin'
  | 'editor'
  | 'designer'
  | 'production'
  | 'normal';

export enum EnumUserRole {
  Root = 'root',
  Admin = 'admin',
  Editor = 'editor',
  Designer = 'designer',
  Production = 'production',
  Normal = 'normal'
}

// User model
const UserSchema: Schema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(EnumUserRole)
    }
  },
  { timestamps: true, versionKey: false, bufferCommands: false }
);

// We need to create and export an interface for our model
export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: EnumUserRole;
  fullname(): string;
}

export interface UserModel extends IUser, Document {
  isPasswordValid(password: string): string;
}

// for unique fields
mongooseUniqueValidator(UserSchema);

// crypt password before save
UserSchema.pre<UserModel>('save', function(next: NextFunction) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

// check password is valid
UserSchema.methods.isPasswordValid = function(password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

// Virtuals
UserSchema.virtual('fullName').get(function(this: UserModel) {
  return `${this.firstName} ${this.lastName}`;
});

// Delete password before sending user model
UserSchema.set('toJSON', {
  transform: function(_, ret) {
    delete ret.password;
    return ret;
  },
  getters: true
});

// Delete password before sending user model
UserSchema.set('toObject', {
  transform: function(_, ret) {
    delete ret.password;
    return ret;
  },
  getters: true
});

// Export our entity
export const UserEntity = mongoose.model<UserModel>('User', UserSchema);
