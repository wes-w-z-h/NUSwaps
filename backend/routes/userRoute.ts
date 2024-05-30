import express from 'express';
import * as UserController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', UserController.getUsers);

userRouter.get('/login', UserController.login);

userRouter.post('/signup', UserController.signup);

userRouter.delete('/:id', UserController.deleteUser);

userRouter.patch('/:id', UserController.updateUser);

export default userRouter;
