import createHttpError from 'http-errors';
import { SwapModel } from '../../models/swapModel.js';
import greedyMatch from './matchAlgo.js';
import { sendMatch } from '../emailService.js';
import UserModel from '../../models/userModel.js';
import { ISwap } from '../../types/api.js';

/**
 * Finds the optimal swaps with all unmatched swap requests
 * that matches the most number of swaps.
 * Sends an email notification to matched parties
 */
const getOptimalMatch = async (newSwap: ISwap) => {
  const existingSwaps = await SwapModel.find({ status: false }).exec();
  const partnerSwaps = greedyMatch(newSwap, existingSwaps);
  if (!partnerSwaps) {
    return;
  }

  // Usage of for loop to use await
  // eslint-disable-next-line no-restricted-syntax
  for await (const swap of partnerSwaps) {
    // TODO: Update swap status (once we have updated the statuses)
    const user = await UserModel.findById(swap.userId).exec();
    if (!user) {
      throw createHttpError(400, 'User not found');
    }
    // TODO: Remove this, didn't want to spam this fella with emails
    if (user.email !== 'e1122360@u.nus.edu') {
      await sendMatch(user.email, swap);
    }
  }
};

export default getOptimalMatch;
