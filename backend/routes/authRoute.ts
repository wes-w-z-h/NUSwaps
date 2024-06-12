import express from 'express';
import * as AuthController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login', AuthController.login);

authRouter.post('/logout', AuthController.logout);

authRouter.post('/refresh', AuthController.refresh);

authRouter.post('/signup', AuthController.signup);

authRouter.get('/verify/:token', AuthController.verifyUser);

export default authRouter;
