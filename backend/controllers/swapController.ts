import { RequestHandler } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import { SwapModel } from '../models/swapModel.js';
import getOptimalMatch from '../util/match/matchService.js';
import { SwapStatus } from '../types/api.js';

const verifySwap = async (
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

const verifyMatchedStatus = async (id: string) => {
  await SwapModel.findById(id)
    .exec()
    .then((swap) => {
      if (!swap) {
        throw createHttpError(404, 'Swap not found');
      }
      const matchedStatus: SwapStatus = 'MATCHED';
      if (swap.status !== matchedStatus) {
        throw createHttpError(400, 'Invalid request to confirm swap');
      }
    });
};

export const getSwaps: RequestHandler = async (req, res, next) => {
  await SwapModel.find({})
    .exec()
    .then((data) => {
      res.status(200).json(data.map((swap) => swap.createResponse()));
    })
    .catch((error) => next(createHttpError(400, error.message)));
};

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
    await verifyMatchedStatus(id);

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

    res.status(200).json(confirmedSwap?.createResponse());
  } catch (error) {
    next(error);
  }
};

export const rejectSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    await verifyMatchedStatus(id);

    const rejectedSwap = await SwapModel.findByIdAndUpdate(
      id,
      { status: 'UNMATCHED' },
      {
        runValidators: true,
        new: true,
      }
    ).exec();

    if (!rejectedSwap) {
      throw createHttpError(400, 'Unable to reject swap');
    }

    getOptimalMatch(rejectedSwap);

    res.status(200).json(rejectedSwap?.createResponse());
  } catch (error) {
    next(error);
  }
};

export const updateSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req;
  const { courseId, lessonType, current, request } = req.body;

  try {
    await verifySwap(userId, courseId, lessonType, current, request, id);
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
    await verifySwap(userId, courseId, lessonType, current, request);

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
