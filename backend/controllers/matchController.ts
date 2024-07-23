import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { MatchModel } from '../models/matchModel.js';
import { SwapModel } from '../models/swapModel.js';
import UserModel from '../models/userModel.js';

// TODO: Remove this request handler after testing
// eslint-disable-next-line import/prefer-default-export
export const getAllMatches: RequestHandler = (req, res, next) => {
  try {
    const matches = MatchModel.find({});
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};

export const getMatch: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const swap = await SwapModel.findById(id).exec();

    if (!swap) {
      throw createHttpError(400, 'Unable to confirm swap');
    }

    const match = await MatchModel.findById(swap.match).exec();
    if (!match) {
      throw createHttpError(404, 'Match not found');
    }

    res.status(200).json(match.createResponse());
  } catch (error) {
    next(error);
  }
};

export const getMatchPartners: RequestHandler = async (req, res, next) => {
  const { swapIds } = req.body;
  try {
    if (!swapIds) {
      throw createHttpError(400, 'Incomplete request body');
    }

    // Find swaps based on swapIds
    const swaps = await SwapModel.find({ _id: { $in: swapIds } });

    const swapIdToUserIdMap = new Map();
    swaps.forEach((swap) => {
      // eslint-disable-next-line no-underscore-dangle
      swapIdToUserIdMap.set(swap._id.toString(), swap.userId.toString());
    });

    const userIds = Array.from(new Set(swaps.map((swap) => swap.userId)));
    const users = await UserModel.find({ _id: { $in: userIds } }).select(
      'email telegramHandle'
    );

    const userIdToUserDetailsMap = new Map();
    users.forEach((user) => {
      // eslint-disable-next-line no-underscore-dangle
      userIdToUserDetailsMap.set(user._id.toString(), user);
    });

    // Arrange users according to the order of swapIds
    const arrangedUsers = swapIds.map((swapId: { toString: () => any }) => {
      const userId = swapIdToUserIdMap.get(swapId.toString());
      return userIdToUserDetailsMap.get(userId);
    });

    res.status(200).json(arrangedUsers);
  } catch (error) {
    next(error);
  }
};
