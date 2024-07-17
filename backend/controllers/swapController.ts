import { RequestHandler } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import { SwapModel } from '../models/swapModel.js';
import { getOptimalMatch, rejectMatch } from '../util/match/matchService.js';
import { MatchModel } from '../models/matchModel.js';
import {
  validateSwap,
  validateMatchedStatus,
  validateUnmatchedStatus,
} from '../util/swap/validateSwap.js';

export const getSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  await SwapModel.findById(id)
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'Swap not found' })
    )
    .catch((error) => next(createHttpError(400, error.message)));
};

export const getUserSwaps: RequestHandler = async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  await SwapModel.find({ userId: req.userId })
    .exec()
    .then((data) =>
      res.status(200).json(data.map((swap) => swap.createResponse()))
    )
    .catch((error) => next(createHttpError(400, error.message)));
};

export const deleteSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    await validateUnmatchedStatus(id);
  } catch (error) {
    next(error);
    return;
  }

  await SwapModel.findByIdAndDelete(id)
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'Swap not found' })
    )
    .catch((error) => next(createHttpError(400, error.message)));
};

export const confirmSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    await validateMatchedStatus(id);

    const confirmedSwap = await SwapModel.findByIdAndUpdate(
      id,
      { status: 'CONFIRMED' },
      {
        runValidators: true,
        new: true,
      }
    ).exec();

    if (!confirmedSwap) {
      throw createHttpError(400, 'Unable to confirm swap');
    }

    const match = await MatchModel.findById(confirmedSwap.match).exec();
    if (!match) {
      throw createHttpError(404, 'Match not found');
    }
    const newStatus = await match.getNewStatus();

    await MatchModel.findByIdAndUpdate(confirmedSwap.match, {
      status: newStatus,
    }).exec();

    res.status(200).json(confirmedSwap.createResponse());
  } catch (error) {
    next(error);
  }
};

export const rejectSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    await validateMatchedStatus(id);

    let rejectedSwap = await SwapModel.findById(id).exec();
    if (!rejectedSwap) {
      throw createHttpError(404, 'Swap not found');
    }

    await rejectMatch(rejectedSwap);

    rejectedSwap = await SwapModel.findByIdAndUpdate(
      id,
      { status: 'UNMATCHED', match: null },
      {
        runValidators: true,
        new: true,
      }
    ).exec();

    if (!rejectedSwap) {
      throw createHttpError(400, 'Unable to reject swap');
    }

    res.status(200).json(rejectedSwap.createResponse());
  } catch (error) {
    next(error);
  }
};

export const updateSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req;
  const { courseId, lessonType, current, request } = req.body;

  try {
    await validateSwap(userId, courseId, lessonType, current, request, id);
    await validateUnmatchedStatus(id);

    const data = await SwapModel.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    }).exec();

    if (!data) {
      throw createHttpError(404, 'Swap not found');
    }

    getOptimalMatch(data);

    res.status(200).json(data.createResponse());
  } catch (error) {
    next(error);
  }
};

export const createSwap: RequestHandler = async (req, res, next) => {
  const { userId } = req;
  const { current, request, courseId, lessonType } = req.body;

  try {
    await validateSwap(userId, courseId, lessonType, current, request);

    const data = await SwapModel.create({
      userId,
      courseId,
      lessonType,
      current,
      request,
    });

    if (!data) {
      throw createHttpError(400, 'Unable to create swap');
    }

    getOptimalMatch(data);

    res.status(200).json(data.createResponse());
  } catch (error: unknown) {
    // TODO: see if possible to do this better
    if (isHttpError(error)) {
      next(error);
    } else if (error instanceof Error) {
      next(createHttpError(400, error.message));
    }
    next(error);
  }
};
