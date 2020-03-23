import { JwtPayLoad } from './../util/JwtPayLoad';
import { Request, Response, NextFunction } from 'express';
import { UserEntity, UserModel } from './../model/user.model';
import { HttpError } from './../util/HttpError';

export namespace AuthController {
  export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body;

    // Checking parameters
    if (!(username && password)) {
      next(new HttpError('Wrong parameters !'));
      return;
    }

    // Getting user model
    let user: UserModel | null;
    try {
      user = await UserEntity.findOne({ username });
    } catch (err) {
      next(new HttpError('Hata:' + err));
      return;
    }

    // Checking password
    if (!user?.isPasswordValid(password)) {
      next(new HttpError('Hata: Username or Password is not valid'));
      return;
    }

    // Creating token
    const token = JwtPayLoad.createToken(user.id, user.username);

    // Sending response with token
    res.status(200).send({ message: 'login succesful', token });
  };
}
