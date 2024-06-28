import { RequestHandler } from 'express';
import { SwapModel } from '../models/swapModel.js';
import greedyMatch from '../util/matcher.js';

// Finds all matches for the swap request
export const getMatch: RequestHandler = async (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId, courseId, lessonType, current, request, status } = req.body;
  try {
    let matches = await SwapModel.find({});
    matches = matches.filter((swap) => {
      return (
        swap.courseId === courseId &&
        swap.lessonType === lessonType &&
        swap.request === current &&
        swap.current === request &&
        !swap.status
      );
    });
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};

/**
 * Finds the optimal swaps with all unmatched swap requests
 * that matches the most number of swaps.
 * @param res Array containing groups of possible swaps
 */
export const getOptimalMatch: RequestHandler = async (req, res, next) => {
  try {
    const swaps = await SwapModel.find({ status: false });
    const partners = greedyMatch(req.body, swaps);
    res.status(200).json(partners);
  } catch (error) {
    next(error);
  }
};
