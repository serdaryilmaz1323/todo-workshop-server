import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { checkAuthentication } from '../middlewares/auth.middleware';
const todoRouter = Router();

todoRouter.post('/', [checkAuthentication], TodoController.insert);
todoRouter.get('/list', [checkAuthentication], TodoController.list);
todoRouter.get('/delete/:id', [checkAuthentication], TodoController.del);

export default todoRouter;
