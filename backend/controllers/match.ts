import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { SwapModel } from '../models/swapModel.js';
import greedyMatch from '../util/matcher.js';
import UserModel from '../models/userModel.js';
import { sendMatch } from '../util/emailService.js';

// TODO: Remove this file after testing

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
    const existingSwaps = await SwapModel.find({ status: false });
    const partnerSwaps = greedyMatch(req.body, existingSwaps);
    if (partnerSwaps.length === 0) {
      res.status(204).send();
    } else {
      // Usage of for loop to use await
      // eslint-disable-next-line no-restricted-syntax
      for await (const swap of partnerSwaps) {
        const user = await UserModel.findById(swap.userId).exec();
        if (!user) {
          throw createHttpError(400, 'User not found');
        }
        if (user.email !== 'e1122360@u.nus.edu') {
          await sendMatch(user.email, swap);
        }
      }
      res.status(200).json({ msg: 'Sent email to matching parties' });
    }
  } catch (error) {
    next(error);
  }
};
