import { EnumUserRole } from './../model/user.model';
import {
  checkAuthentication,
  checkRole
} from './../middleware/auth.middleware';
import { Router } from 'express';
import { UserController } from '../controller/user.controller';

const userRouter = Router();

userRouter.post(
  '/',
  [checkAuthentication, checkRole([EnumUserRole.Admin, EnumUserRole.Root])],
  UserController.createUser
);

// Get one user
userRouter.get('/:id', UserController.getOneById);

export default userRouter;
