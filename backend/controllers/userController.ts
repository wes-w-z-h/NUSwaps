import { RequestHandler } from 'express';
import UserModel from '../models/userModel';

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    // throw Error("pewpew");
    // remove the password field form the response
    const data = await UserModel.find({}).select('-password');
    res.status(200).json(data);
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
