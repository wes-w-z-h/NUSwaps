import express from 'express';
import * as UserController from '../controllers/userController.js';
import verifyAuth from '../middleware/verifyAuth.js';

const userRouter = express.Router();

// TODO: remove this route when not needed anymore
userRouter.get('/', UserController.getUsers);

userRouter.use(verifyAuth);

userRouter.delete('/delete', UserController.deleteUser);

userRouter.patch('/edit', UserController.updateUser);

export default userRouter;
