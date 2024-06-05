import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import UserModel from '../models/userModel.js';
import sendVerification from '../util/emailService.js';
import env from '../util/validEnv.js';
import 'dotenv/config';

const createToken = (dataid: any): string =>
  jwt.sign({ id: dataid }, env.JWT_KEY, { expiresIn: '30m' });

export const login: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw createHttpError(400, 'Invalid request: missing field(s)');
    }

    const data = await UserModel.findOne({ username }).exec();
    if (!data) {
      throw createHttpError(404, 'User not found');
    }

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      throw createHttpError(401, 'Unauthorised: check username & password');
    }

    const token = createToken(data.id);
    res.status(200).json(data.createResponse(token));
  } catch (error) {
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw createHttpError(400, 'Invalid request: missing field(s)');
    }

    const exists = await UserModel.findOne({ email });

    if (exists) {
      throw createHttpError(400, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 11);

    await sendVerification(email, createToken({ email, passwordHash }));

    res.status(201).json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

export const verifyUser: RequestHandler = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = (jwt.verify(token, env.JWT_KEY) as JwtPayload).id;
    const { username, passwordHash } = decoded;

    const data = await UserModel.create({ username, password: passwordHash });

    if (!data) {
      res
        .status(400)
        .json({ message: 'Invalid token or unable to create user' });
      return;
    }

    const authToken = createToken(data.id);

    res.status(200).json(data.createResponse(authToken));
  } catch (error) {
    // console.log(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
