import 'dotenv/config';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/userModel.js';

export const getUsers: RequestHandler = async (_req, res, next) => {
  await UserModel.find({})
    .exec()
    .then((data) => {
      res.status(200).json(data.map((user) => user.createResponse()));
    })
    .catch((error) => next(createHttpError(400, error.message)));
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
