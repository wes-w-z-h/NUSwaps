import express from 'express';
import * as UserController from '../controllers/userController.js';
import verifyAuth from '../middleware/verifyAuth.js';

const userRouter = express.Router();

userRouter.use(verifyAuth);

userRouter.delete('/delete', UserController.deleteUser);

userRouter.patch('/edit', UserController.updateUser);

export default userRouter;
