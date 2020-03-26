//import { EnumUserRole, UserModel } from './../model/user.model';
import { HttpError } from './../util/HttpError';
import { config } from './../config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT, JWTPayLoad } from './../util/JwtPayLoad';
import { UserService } from './../services/user.service';

export const checkAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  let jwtPayLoad: JWTPayLoad;

  // Get the token from the head
  const token = <string>req.headers['auth'];

  // Try to validate the token and get data
  try {
    jwtPayLoad = jwt.verify(token, config.jwtSecretKey) as JWTPayLoad;
    res.locals.jwtPayLoad = jwtPayLoad;

    const user = await UserService.getUserById(jwtPayLoad.userId, next);
    if (user) {
      req.body.currentUser = user;
    } else {
      next(new HttpError('..User not found'));
      return;
    }
  } catch (error) {
    console.log('Token is not valid:' + error);
    next(new HttpError('Token is not valid'));
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  // Creating token
  const newToken = JWT.createToken(jwtPayLoad); // { userId: jwtPayLoad.userId, username: jwtPayLoad.username });

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
