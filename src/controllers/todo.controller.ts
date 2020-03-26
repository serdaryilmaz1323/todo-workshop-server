import { Request, Response, NextFunction } from 'express';
import { HttpError } from './../util/HttpError';
import { TodoEntity } from '../entities/todo.entity';
import { JWT } from '../util/JwtPayLoad';

export namespace TodoController {
  export const insert = async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    let todo = new TodoEntity();
    todo.title = title;

    //Checking document validation
    const validationError = await todo.validateSync();
    if (validationError) {
      next(new HttpError(validationError.message, 400));
      return;
    }

    try {
      const result = await todo.save();
      console.log(`save result: ${result} `);
    } catch (error) {
      next(new HttpError(error.message, 404));
      return;
    }

    // ReCreating token
    const token = JWT.reCreateToken(res);

    // Sending response with token
    res.status(201).send({
      message: 'todo created',
      todo: todo.toJSON(),
      token,
    });
  };

  export const del = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const todo = await TodoEntity.findById(id);
      if (!todo) {
        next(new HttpError('Record not found [id:' + id + ']', 404));
        return;
      }
      await todo.remove();
    } catch (error) {
      next(new HttpError(error.message, 404));
      return;
    }

    // ReCreating token
    const token = JWT.reCreateToken(res);

    // Sending response with token
    res.status(201).send({
      message: 'todo deleted',
      id: id,
      token,
    });
  };

  export const list = async (_: Request, res: Response, next: NextFunction) => {
    // const userId = res.locals.jwtPayLoad.userId;

    let liste;
    try {
      liste = await TodoEntity.find();
      console.log('Todo list count : ' + list.length);
      console.log('Todo list  : ' + list);
    } catch (error) {
      next(new HttpError(error.message, 404));
      return;
    }

    // ReCreating token
    const token = JWT.reCreateToken(res);

    // Sending response with token
    res.status(201).send({
      message: 'todo listed',
      list: liste.map(item => item.toObject({ getters: true })),
      token,
    });
  };
}
