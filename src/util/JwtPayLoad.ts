import { Response } from 'express';
import { config } from './../config';
import * as jwt from 'jsonwebtoken';

export interface TokenParams {
  userId: string;
  username: string;
}

const createToken = (payload: TokenParams): string => {
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

const reCreateToken = (response: Response): string => {
  return createToken(response.locals.tokenParams);
};

const resolveToken = (token: string): TokenParams => {
  return jwt.verify(token, config.jwtSecretKey) as TokenParams;
};

const verifyToken = (token: string): TokenParams => {
  return jwt.verify(token, config.jwtSecretKey) as TokenParams;
};

export const JWT = {
  resolveToken,
  createToken,
  reCreateToken,
  verifyToken,
};
