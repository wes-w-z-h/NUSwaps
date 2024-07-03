import createHttpError from 'http-errors';
import { SwapModel } from '../../models/swapModel.js';
import greedyMatch from './matchAlgo.js';
import { sendMatch } from '../emailService.js';
import UserModel from '../../models/userModel.js';
import { ISwap } from '../../types/api.js';
import { MatchModel } from '../../models/matchModel.js';

/**
 * Finds the optimal swaps with all unmatched swap requests
 * that matches the most number of swaps.
 * Sends an email notification to matched parties
 */
const getOptimalMatch = async (newSwap: ISwap) => {
  const existingSwaps = await SwapModel.find({ status: 'UNMATCHED' }).exec();
  const partnerSwaps = greedyMatch(newSwap, existingSwaps);
  if (partnerSwaps.length === 0) {
    return;
  }
  const swapIds = partnerSwaps.map((swap) => swap.id);
  const match = await MatchModel.create({
    courseId: newSwap.courseId,
    lessonType: newSwap.lessonType,
    swaps: swapIds,
    status: 'PENDING',
  });

  // Usage of for loop to use await
  // eslint-disable-next-line no-restricted-syntax
  for await (const swap of partnerSwaps) {
    const user = await UserModel.findById(swap.userId).exec();
    if (!user) {
      throw createHttpError(400, 'User not found');
    }
    await SwapModel.findByIdAndUpdate(
      swap.id,
      // eslint-disable-next-line no-underscore-dangle
      { status: 'MATCHED', match: match._id },
      {
        runValidators: true,
        new: true,
      }
    ).exec();

    await sendMatch(user.email, swap);

    // TODO: Emit event in socket
  }
};

export default getOptimalMatch;
