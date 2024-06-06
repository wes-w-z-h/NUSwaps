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

const validateEmail = (val: string): boolean => {
  return val.endsWith('@u.nus.edu');
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw createHttpError(400, 'Invalid request: missing field(s)');
    }

    const data = await UserModel.findOne({ email }).exec();
    if (!data) {
      throw createHttpError(404, 'User not found');
    }

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      throw createHttpError(401, 'Unauthorised: check email & password');
    }

    const token = createToken(data.id);
    res.status(200).json(data.createResponse(token));
  } catch (error) {
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    if (!email || !password) {
      throw createHttpError(400, 'Invalid request: missing field(s)');
    }

    const exists = await UserModel.findOne({ email });

    if (exists) {
      throw createHttpError(400, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 11);

    if (!validateEmail(email)) {
      throw createHttpError(
        400,
        'Invalid email address: needs to end with @u.nus.edu'
      );
    }

    await sendVerification(email, createToken({ email, passwordHash }));

    res.status(201).json({ message: 'Verification email sent' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const verifyUser: RequestHandler = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = (jwt.verify(token, env.JWT_KEY) as JwtPayload).id;
    const { email, passwordHash } = decoded;

    const data = await UserModel.create({ email, password: passwordHash });

    if (!data) {
      res
        .status(400)
        .json({ message: 'Invalid token or unable to create user' });
      return;
    }

    const authToken = createToken(data.id);

    res.status(200).json(data.createResponse(authToken));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
