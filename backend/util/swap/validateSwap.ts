import createHttpError from 'http-errors';
import { SwapModel } from '../../models/swapModel.js';
import { MatchModel } from '../../models/matchModel.js';
import { SwapStatus } from '../../types/api.js';

// TODO: By right should throw a custom error if use this in the tele bot but laze
export const validateSwap = async (
  userId: string,
  courseId: string,
  lessonType: string,
  current: string,
  request: string,
  swapId?: string
) => {
  const existing = await SwapModel.find({
    userId,
    courseId,
    lessonType,
  }).exec();

  if (
    existing.length === 0 ||
    (existing.length === 1 && existing[0].id === swapId)
  ) {
    return;
  }

  if (existing[0].current !== current) {
    throw createHttpError(
      400,
      `Invalid current slot, differs from existing swap`
    );
  }

  const existing2 = await SwapModel.findOne({
    userId,
    courseId,
    lessonType,
    current,
    request,
  });

  if (existing2) {
    throw createHttpError(400, 'Duplicate swaps not allowed');
  }
};

export const validateMatchedStatus = async (id: string) => {
  // Verify valid swap
  const currSwap = await SwapModel.findById(id)
    .exec()
    .then((swap) => {
      if (!swap) {
        throw createHttpError(404, 'Swap not found');
      }

      const matchedStatus: SwapStatus = 'MATCHED';
      if (swap.status !== matchedStatus || !swap.match) {
        throw createHttpError(400, 'Invalid request to confirm / reject swap');
      }

      return swap;
    });

  // Verify valid match
  await MatchModel.findById(currSwap.match)
    .exec()
    .then((match) => {
      if (match?.status !== 'PENDING') {
        throw createHttpError(400, 'Invalid request to confirm / reject swap');
      }
    });
};
