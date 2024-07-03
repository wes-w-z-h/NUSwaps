import { RequestHandler } from 'express';
import { MatchModel } from '../models/matchModel.js';

// TODO: Remove this file after testing
// eslint-disable-next-line import/prefer-default-export
export const getAllMatches: RequestHandler = (req, res, next) => {
  try {
    const matches = MatchModel.find({});
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};
