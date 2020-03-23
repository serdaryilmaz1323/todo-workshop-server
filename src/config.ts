import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT!),
  jwtSecretKey: process.env.JWTSECRET!,
  mongoURL: process.env.MONGO_URL!,
  jwtTokenExpiresIn: process.env.TOKEN_EXPIRES_IN!,
};
