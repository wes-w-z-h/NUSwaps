import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import env from '../util/validEnv.js';
import UserModel from '../models/userModel.js';

const verifyAuth: RequestHandler = async (req, res, next) => {
  // verify token
  const { authorization } = req.headers;

  if (!authorization) {
    next(createHttpError(401, 'Unauthorised: auth token required'));
    return;
  }

  // Bearer xxx.xxx.xxx
  const token = authorization.split(' ')[1];
  const { JWT_KEY } = env;

  try {
    const { id } = jwt.verify(token, JWT_KEY) as JwtPayload;
    // can be used to grab a user using the id in the swap routes
    const data = await UserModel.findById(id).select('_id').exec();
    // eslint-disable-next-line no-underscore-dangle
    req.userId = data?._id;
    next();
  } catch (error) {
    next(createHttpError(401, 'Unauthorised: invalid token'));
  }
};

export default verifyAuth;
