import { HttpError } from './../util/HttpError';
import { NextFunction } from 'express';
import { UserEntity } from './../model/user.model';

export namespace UserService {
  export const getUserById = async (
    userId: string,
    next: NextFunction,
    projection?: any
  ) => {
    try {
      const user = await UserEntity.findById(userId, projection);

      if (user) {
        return user;
      } else {
        next(new HttpError('User not found'));
        return;
      }
    } catch (error) {
      next(new HttpError('Error : ' + error));
      return;
    }
  };
}
