import { HttpError } from './../util/HttpError';
import { UserEntity } from './../model/user.model';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './../service/user.service';

export namespace UserController {
  export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log('Create µUser');

    const { firstName, lastName, username, password, role } = req.body;
    let user = new UserEntity();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.password = password;
    user.role = role;

    const validationErrors = await user.validateSync();
    if (validationErrors) {
      var error = new HttpError(`Schema not validated ${validationErrors}`);
      next(error);
      return;
    }

    try {
      const result = await user.save();
      console.log(`user entity save result : ${result}`);
    } catch (err) {
      var error = new HttpError(err.message);
      next(error);
      return;
    }

    //res.status(201).json({ user: user.toObject({ getters: true }) });
    res.status(201).json({ user: user.toJSON({ getters: true }) });
  };

  export const getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //Get the ID from the url
    const id = req.params.id;

    console.log(id);

    //Get user from database
    const user = await UserService.getUserById(id, next);
    if (!user) {
      next(new HttpError('User not found'));
      return;
    }

    console.log(user);
    console.log(user.toJSON());
    console.log(user.toObject());

    res.status(200).send(user.toJSON());
  };
}
