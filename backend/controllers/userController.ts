/* eslint-disable no-underscore-dangle */
import { RequestHandler } from 'express';
import UserModel from '../models/userModel.js';

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    // throw Error("pewpew");
    // remove the password field form the response
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
    res.status(200).json(data?.createResponse());
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await UserModel.findByIdAndDelete(id);
    res.status(200).json(data?.createResponse());
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(data?.createResponse());
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await UserModel.create(req.body);
    res.status(201).json(data.createResponse());
  } catch (error) {
    next(error);
  }
};
