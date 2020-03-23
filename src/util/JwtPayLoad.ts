import { config } from './../config';
import * as jwt from 'jsonwebtoken';

export interface JWTPayLoad {
  userId: string;
  username: string;
}

const createToken = (payload: JWTPayLoad): string => {
  const token = jwt.sign(
    {
      userId: payload.userId,
      username: payload.username,
    },
    config.jwtSecretKey,
    {
      expiresIn: config.jwtTokenExpiresIn,
    },
  );
  return token;
};

const resolveToken = (token: string): JWTPayLoad => {
  return jwt.verify(token, config.jwtSecretKey) as JWTPayLoad;
};

export const JWT = {
  resolveToken,
  createToken,
};
