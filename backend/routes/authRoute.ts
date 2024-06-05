import express from 'express';
import * as AuthController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login', AuthController.login);

authRouter.post('/signup', AuthController.signup);

authRouter.get('/verify/:token', AuthController.verifyUser);

export default authRouter;
