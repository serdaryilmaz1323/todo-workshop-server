import { Request, Response, NextFunction } from 'express';

export const logger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const ip =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  console.log(`${ip}: ${request.method} ${request.originalUrl}`);

  const start = new Date().getTime();

  response.on('finish', () => {
    const duration = new Date().getTime() - start;
    console.log(
      `${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms`
    );
  });

  next();
};
