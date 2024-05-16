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

  try {
    const data = await UserModel.findByIdAndUpdate(id, req.body, { new: true })
      .select('-password')
      .exec();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await UserModel.create(req.body);
    res.status(201).json({
      username: data.username,
      swapRequests: data.swapRequests,
      id: data.id,
    });
  } catch (error) {
    next(error);
  }
};
