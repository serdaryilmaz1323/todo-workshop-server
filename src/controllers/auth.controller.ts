import { JWT } from './../util/JwtPayLoad';
import { Request, Response, NextFunction } from 'express';
import { UserEntity, UserDocument } from './../entities/user.entity';
import { HttpError } from './../util/HttpError';

export namespace AuthController {
  export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, username, password } = req.body;

    let user = new UserEntity();

    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.password = password;
    user.provider = 'mail';
    user.isVerified = false;

    //Checking document validation
    const validationError = await user.validateSync();
    if (validationError) {
      next(new HttpError(validationError.message, 400));
      return;
    }

    // Checking is user already exist
    try {
      const isUserExist = await UserEntity.findOne({ username });
      if (isUserExist) {
        next(new HttpError('User already exist', 400));
        return;
      }
    } catch (err) {
      next(new HttpError(err.message, 404));
      return;
    }

    try {
      const result = await user.save();
      console.log(`save result: ${result} `);
    } catch (error) {
      next(new HttpError(error.message, 404));
      return;
    }

    // Creating token
    const token = JWT.createToken({
      userId: user.id,
      username: user.username,
    });

    // Sending response with token
    res.status(201).send({
      message: 'register successful',
      user: user.toJSON(),
      token,
    });
  };

  export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // Checking parameters
    if (!(username && password)) {
      next(new HttpError('Wrong authentication credentials !'));
      return;
    }

    // Getting user model
    let user: UserDocument | null;
    try {
      user = await UserEntity.findOne({ username });
    } catch (err) {
      next(new HttpError(err));
      return;
    }

    // Checking user is exist
    if (!user) {
      next(new HttpError('User not exist.'));
      return;
    }

    // Checking password
    if (!user?.isPasswordValid(password)) {
      next(new HttpError('Username or Password is not valid'));
      return;
    }

    // Creating token
    const token = JWT.createToken({ userId: user.id, username: user.username });

    // Sending response with token
    res.status(200).send({ message: 'login succesful', user: user.toJSON(), token });
  };
}
