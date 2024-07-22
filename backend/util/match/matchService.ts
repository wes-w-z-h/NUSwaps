import createHttpError from 'http-errors';
import { SwapModel } from '../../models/swapModel.js';
import greedyMatch from './matchAlgo.js';
import {
  sendMatchAccepted,
  sendMatchFound,
  sendMatchRejected,
} from '../emailService.js';
import UserModel from '../../models/userModel.js';
import { IMatch, ISwap } from '../../types/api.js';
import { MatchModel } from '../../models/matchModel.js';
import io from '../../server.js';

/**
 * Finds the optimal swaps with all unmatched swap requests
 * that matches the most number of swaps.
 * Sends an email notification to matched parties
 */
export const getOptimalMatch = async (newSwap: ISwap) => {
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

    await sendMatchFound(user.email, swap);

    io.to(swap.userId.toString()).emit('match-found', swap);
  }
};

/**
 * Updates the status of the swap and other swaps in the match
 * Sends an email notification to rejected parties
 * @param rejectedSwap Swap that has been rejected
 */
export const rejectMatch = async (rejectedSwap: ISwap) => {
  const swapIds = await MatchModel.findByIdAndUpdate(rejectedSwap.match, {
    status: 'REJECTED',
  })
    .exec()
    .then((match) => {
      if (!match) {
        throw createHttpError('404', 'Match not found');
      }

      return match.swaps;
    });

  if (!swapIds) {
    throw createHttpError(400, 'Unable to reject swap');
  }

  // eslint-disable-next-line no-restricted-syntax
  for await (const swapId of swapIds) {
    // eslint-disable-next-line no-underscore-dangle
    if (swapId.toString() !== rejectedSwap._id.toString()) {
      // Update swap status to 'UNMATCHED'
      const swap = await SwapModel.findByIdAndUpdate(
        swapId,
        { status: 'UNMATCHED', match: null },
        {
          runValidators: true,
          new: true,
        }
      ).exec();

      if (!swap) {
        throw createHttpError(404, 'Swap not found');
      }

      // Notify user of rejected match via email
      const user = await UserModel.findById(swap.userId).exec();
      if (!user) {
        throw createHttpError(400, 'User not found');
      }
      await sendMatchRejected(user.email, swap);

      // Notify user of rejected match via toast
      io.to(swap.userId.toString()).emit('match-rejected', swap);

      // Find new match for the user's swap
      getOptimalMatch(swap);
    }
  }
};

/**
 * Updates the status of the match to be ACCEPTED and other swaps in the match
 * Sends an email notification to users in the match
 * Trigger notification to logged in users on web application
 * @param match Match that has been accepted
 */
export const acceptMatch = async (match: IMatch) => {
  const swapIds = await MatchModel.findByIdAndUpdate(match, {
    status: 'ACCEPTED',
  })
    .exec()
    .then((acceptedMatch) => {
      if (!acceptedMatch) {
        throw createHttpError('404', 'Match not found');
      }

      return acceptedMatch.swaps;
    });

  if (!swapIds) {
    throw createHttpError(400, 'Unable to accept match');
  }

  await Promise.all(
    swapIds.map(async (swapId): Promise<void> => {
      // Update swap status to 'COMPLETED'
      const swap = await SwapModel.findByIdAndUpdate(
        swapId,
        { status: 'COMPLETED' },
        {
          runValidators: true,
          new: true,
        }
      ).exec();

      if (!swap) {
        throw createHttpError(404, 'Swap not found');
      }

      // Notify user of completed match via email
      const user = await UserModel.findById(swap.userId).exec();
      if (!user) {
        throw createHttpError(400, 'User not found');
      }
      await sendMatchAccepted(user.email, swap);

      // Notify user of rejected match via toast
      io.to(swap.userId.toString()).emit('match-accepted', swap);
    })
  );
};
