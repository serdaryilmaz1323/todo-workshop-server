import { NextFunction, Response, Request } from 'express';
import { HttpError } from '../util/HttpError';

export const handleRouteError = (_: Request, __: Response, next: NextFunction) => {
  const error = new HttpError('This route not exist', 404);
  next(error);
};

export const handleError = (error: HttpError, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  console.log(error.status + ':', error.message);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  res.statusMessage = error.message;
  res.status(status).send({
    status,
    message,
  });
};
