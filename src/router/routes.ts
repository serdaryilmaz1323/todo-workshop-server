import { Router, Request, Response } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/auth', authRouter);

routes.get('/', (_: Request, res: Response) => {
  res.status(201).send('<h1>Merhaba !</h1>');
});

export default routes;
