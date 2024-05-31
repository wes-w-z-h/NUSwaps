import 'dotenv/config';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import env from '../util/validEnv.js';

const createToken = (dataid: any): string =>
  jwt.sign({ id: dataid }, env.JWT_KEY, { expiresIn: '30m' });

export const getUsers: RequestHandler = async (_req, res, next) => {
  await UserModel.find({})
    .exec()
    .then((data) => {
      res.status(200).json(data.map((user) => user.createResponse()));
    })
    .catch((error) => next(createHttpError(400, error.message)));
};

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
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw createHttpError(400, 'Invalid request: missing field(s)');
    }

    const exists = await UserModel.findOne({ username });
    if (exists) {
      throw createHttpError(400, 'Username already in use');
    }

    const passwordHash = await bcrypt.hash(password, 11);
    const data = await UserModel.create({ username, password: passwordHash });

    if (!data) {
      throw createHttpError(400, 'Cannot create user');
    }

    const token = createToken(data.id);
    res.status(201).json(data.createResponse(token));
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  await UserModel.findByIdAndDelete(id)
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'User not found' })
    )
    .catch((error) => next(createHttpError(400, error.message)));
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  await UserModel.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  })
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'User not found' })
    )
    .catch((error) => next(createHttpError(400, error.message)));
};

// export const changePassword: RequestHandler = async (req, res, next) => {
//   const { id } = req.params;
//   if (!('password' in req.body)) {
//     res.status(400).json({ msg: 'New password not specified' });
//   }

//   const update = { password: req.body.password };
//   await UserModel.findByIdAndUpdate(id, update, {
//     runValidators: true,
//     new: true,
//   })
//     .exec()
//     .then((data) =>
//       data
//         ? res.status(200).json(data.createResponse())
//         : res.status(404).json({ msg: 'User not found' })
//     )
//     .catch((error) => next(createHttpError(400, error.message)));
// };

// export const changeUsername: RequestHandler = async (req, res, next) => {
//   const { id } = req.params;
//   if (!('username' in req.body)) {
//     res.status(400).json({ msg: 'New username not specified' });
//   }

//   const update = { username: req.body.username };
//   await UserModel.findByIdAndUpdate(id, update, {
//     runValidators: true,
//     new: true,
//   })
//     .exec()
//     .then((data) =>
//       data
//         ? res.status(200).json(data.createResponse())
//         : res.status(404).json({ msg: 'User not found' })
//     )
//     .catch((error) => next(createHttpError(400, error.message)));
// };
