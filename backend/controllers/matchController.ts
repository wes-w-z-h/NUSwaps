import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { MatchModel } from '../models/matchModel.js';
import { SwapModel } from '../models/swapModel.js';

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
