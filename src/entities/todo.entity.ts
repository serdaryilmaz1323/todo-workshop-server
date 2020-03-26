import { Schema, Document, model } from 'mongoose';
import mongooseUniqueValidator = require('mongoose-unique-validator');
import { ITodo } from './../models/todo.model';

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false, bufferCommands: false },
);

mongooseUniqueValidator(TodoSchema);

export interface TodoDocument extends ITodo, Document {
  isPasswordValid(password: string): string;
}

export const TodoEntity = model<TodoDocument>('Todo', TodoSchema);
