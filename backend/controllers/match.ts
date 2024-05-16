import { RequestHandler } from 'express';
import { SwapModel } from '../models/swapModel';

// Finds all matches for the swap request
export const getMatch: RequestHandler = async (req, res, next) => {
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
    let swaps = await SwapModel.find({});
    swaps = swaps.filter((swap) => !swap.status);
    res.status(200).json(swaps);
  } catch (error) {
    next(error);
  }
};
