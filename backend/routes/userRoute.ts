import express from 'express';
import * as UserController from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', UserController.getUsers);

// userRouter.get("/:id", (_req, res) => {});

userRouter.post('/', UserController.createUser);

// userRouter.delete("/", (req, res) => {});

export default userRouter;
