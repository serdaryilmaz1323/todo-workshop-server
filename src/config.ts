import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT!),
  jwtSecretKey: process.env.JWTSECRET!,
  jwtTokenExpiresIn: process.env.JWTTOKENEXPIRESIN!,
  mongoURL: process.env.MONGO_URL!
};
