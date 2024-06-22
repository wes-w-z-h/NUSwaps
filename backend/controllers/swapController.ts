import { RequestHandler } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import { SwapModel } from '../models/swapModel.js';

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

export const updateSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!req.body.current || !req.body.request) {
    res.status(400).json({ error: 'Incomplete request body' });
  } else if (req.body.current.lessonType !== req.body.request.lessonType) {
    res.status(400).json({ error: 'Incompatible lessons to be swapped' });
  } else {
    await SwapModel.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    })
      .exec()
      .then((data) =>
        data
          ? res.status(200).json(data.createResponse())
          : res.status(404).json({ msg: 'Swap not found' })
      )
      .catch((error) => next(createHttpError(400, error.message)));
  }
};

export const createSwap: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.current || !req.body.request || !req.body.courseId) {
      throw createHttpError(400, 'Incomplete request body');
    }
    const { current, request, courseId, lessonType } = req.body;
    const { userId } = req;
    if (current.lessonType !== request.lessonType) {
      throw createHttpError(400, 'Incompatible lessons to be swapped');
    }

    let existing = await SwapModel.findOne({
      userId,
      courseId,
      lessonType,
    });

    if (existing && !existing.current.endsWith(current.classNo)) {
      throw createHttpError(
        400,
        `Invalid current slot, differs from existing swap`
      );
    }

    existing = await SwapModel.findOne({
      userId,
      courseId,
      lessonType,
      current,
      request,
    });

    if (existing) {
      throw createHttpError(400, 'Duplicate swaps not allowed');
    }

    const data = await SwapModel.create({
      userId,
      courseId,
      lessonType,
      current,
      request,
    });

    if (!data) {
      throw createHttpError(404, 'User not found');
    }

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
