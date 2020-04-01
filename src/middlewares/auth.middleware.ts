import { HttpError } from './../util/HttpError';
import { Request, Response, NextFunction } from 'express';
import { JWT, TokenParams } from './../util/JwtPayLoad';
import { UserEntity } from '../entities/user.entity';

export const checkAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  let tokenParams: TokenParams;

  // Get the token from the head
  const token = <string>req.headers['auth'];

  // Try to validate token and get data
  try {
    tokenParams = JWT.verifyToken(token);
    res.locals.tokenParams = tokenParams;

    // Getting user entity
    const user = await UserEntity.findById(tokenParams.userId);
    if (user) {
      req.body.currentUser = user;
    } else {
      next(new HttpError('user not found'));
      return;
    }
  } catch (error) {
    console.log('Token is not valid,', error);
    next(new HttpError('Token is not valid'));
    return;
  }

  // Send new token on every request
  const newToken = JWT.createToken(tokenParams);
  res.setHeader('auth', newToken);

  next();
};

// export const checkRole = (roles: EnumUserRole[]) => {
//   return async (request: Request, response: Response, next: NextFunction) => {
//     const user = request.body.currentUser as UserModel;

//     if (roles.findIndex(item => item === user.role) !== -1) next();
//     else response.status(401).send({ code: 401, message: 'you are not authorized for this action' });
//   };
// };
