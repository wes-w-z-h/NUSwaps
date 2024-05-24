/* eslint-disable no-underscore-dangle */
import { RequestHandler } from 'express';
import UserModel from '../models/userModel.js';

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const data = await UserModel.find({});
    res.status(200).json(data.map((user) => user.createResponse()));
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await UserModel.findById(id);
    if (data) {
      res.status(200).json(data.createResponse());
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await UserModel.findByIdAndDelete(id);
    if (data) {
      res.status(200).json(data.createResponse());
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await UserModel.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (data) {
      res.status(200).json(data.createResponse());
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const changePassword: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!('password' in req.body)) {
    res.status(400).json({ msg: 'New password not specified' });
  }
  const update = { password: req.body.password };
  try {
    const data = await UserModel.findByIdAndUpdate(id, update, {
      runValidators: true,
      new: true,
    });
    if (data) {
      res.status(200).json(data.createResponse());
    } else {
      res.status(404).json({ msg: 'User not found ' });
    }
  } catch (error) {
    next(error);
  }
};

export const changeUsername: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!('username' in req.body)) {
    res.status(400).json({ msg: 'New username not specified' });
  }
  const update = { username: req.body.username };
  try {
    const data = await UserModel.findByIdAndUpdate(id, update, {
      runValidators: true,
      new: true,
    });
    if (data) {
      res.status(200).json(data.createResponse());
    } else {
      res.status(404).json({ msg: 'User not found ' });
    }
  } catch (error) {
    next(error);
  }
};

// FIXME: Create defualt user with no swaps
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await UserModel.create(req.body);
    res.status(201).json(data.createResponse());
  } catch (error) {
    next(error);
  }
};
