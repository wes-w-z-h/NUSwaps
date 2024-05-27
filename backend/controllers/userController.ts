/* eslint-disable no-underscore-dangle */
import { RequestHandler } from 'express';
import UserModel from '../models/userModel.js';

export const getUsers: RequestHandler = async (_req, res, next) => {
  await UserModel.find({})
    .exec()
    .then((data) => {
      res.status(200).json(data.map((user) => user.createResponse()));
    })
    .catch((error) => next(error));
};

export const getUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  await UserModel.findById(id)
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'User not found' })
    )
    .catch((error) => next(error));
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
    .catch((error) => next(error));
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
    .catch((error) => next(error));
};

export const changePassword: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!('password' in req.body)) {
    res.status(400).json({ msg: 'New password not specified' });
  }

  const update = { password: req.body.password };
  await UserModel.findByIdAndUpdate(id, update, {
    runValidators: true,
    new: true,
  })
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'User not found' })
    )
    .catch((error) => next(error));
};

export const changeUsername: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!('username' in req.body)) {
    res.status(400).json({ msg: 'New username not specified' });
  }

  const update = { username: req.body.username };
  await UserModel.findByIdAndUpdate(id, update, {
    runValidators: true,
    new: true,
  })
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'User not found' })
    )
    .catch((error) => next(error));
};

// FIXME: Create defualt user with no swaps
export const createUser: RequestHandler = async (req, res, next) => {
  await UserModel.create(req.body)
    .then((data) =>
      data
        ? res.status(201).json(data.createResponse())
        : res.status(400).json({ msg: 'Cannot create user' })
    )
    .catch((error) => next(error));
};
