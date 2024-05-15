import { RequestHandler } from 'express';
import UserModel from '../models/userModel';

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    // throw Error("pewpew");
    // remove the password field form the response
    const data = await UserModel.find({}).select('-password').exec();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await UserModel.findById(id).select('-password').exec();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await UserModel.findByIdAndDelete(id)
      .select('-password')
      .exec();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { username, password, swapRequests } = req.body;
  try {
    await UserModel.findByIdAndUpdate(id, {
      username,
      password,
      swapRequests,
    })
      .select('-password')
      .exec();
    res.status(200).json({
      id,
      username,
      swapRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await UserModel.create(req.body);
    res.status(201).json({
      userId: data.id,
      username: data.username,
      swapRequests: data.swapRequests,
    });
  } catch (error) {
    next(error);
  }
};
