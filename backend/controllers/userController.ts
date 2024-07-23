import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import * as bcrypt from 'bcrypt';
import UserModel from '../models/userModel.js';
import { SwapModel } from '../models/swapModel.js';
import { rejectMatch } from '../util/match/matchService.js';
import { MatchModel } from '../models/matchModel.js';

export const getUsers: RequestHandler = async (_req, res, next) => {
  await UserModel.find({})
    .exec()
    .then((data) => {
      res.status(200).json(data.map((user) => user.createResponse()));
    })
    .catch((error) => next(createHttpError(400, error.message)));
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const id = req.userId;
  try {
    const swaps = await SwapModel.find({ userId: id });

    const promises = swaps.map(async (s) => {
      if (s.status === 'COMPLETED' || s.status === 'CONFIRMED') {
        throw createHttpError(
          400,
          'Unable to delete account: CONFIRMED or COMPLETED swap'
        );
      }

      if (s.status === 'MATCHED' && s.match) {
        await MatchModel.findById(s.match).then(async (match) => {
          if (match?.status === 'PENDING') {
            await rejectMatch(s);
          }
        });
      }

      // eslint-disable-next-line no-underscore-dangle
      await SwapModel.findByIdAndDelete(s._id).exec();
    });

    await Promise.all(promises);

    const data = await UserModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json(data.createResponse());
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const id = req.userId;
  const { oldPassword, newPassword, telegramHandle } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      throw createHttpError(400, 'Missing fields');
    }

    let data = await UserModel.findById(id).exec();
    if (!data) {
      throw createHttpError(404, 'User not found');
    }

    const valid = await bcrypt.compare(oldPassword, data.password);
    if (!valid) {
      throw createHttpError(401, 'Unauthorised: check old password');
    }

    const passwordHash = await bcrypt.hash(newPassword, 11);
    data = await UserModel.findByIdAndUpdate(
      id,
      { $set: { password: passwordHash, telegramHandle } },
      { runValidators: true, new: true }
    ).exec();

    if (!data) {
      throw createHttpError(404, 'User not found');
    }
    res.status(200).json(data.createResponse());
  } catch (error) {
    next(error);
  }
};
