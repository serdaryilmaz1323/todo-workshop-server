import { config } from './../config';
import * as jwt from 'jsonwebtoken';

export namespace JwtPayLoad {
  export class TokenParams {
    userId: string = '';
    username: string = '';
  }

  export const createToken = (userId: string, username: string): string => {
    const token = jwt.sign(
      {
        userId: userId,
        username: username
      },
      config.jwtSecretKey,
      {
        expiresIn: config.jwtTokenExpiresIn
      }
    );
    return token;
  };
}
