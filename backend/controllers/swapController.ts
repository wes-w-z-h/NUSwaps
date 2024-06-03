import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { SwapModel } from '../models/swapModel.js';

// FIXME: get swaps belonging to a user not all swaps
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
  if (!req.body.current || !req.body.request) {
    res.status(400).json({ error: 'Incomplete request body' });
  } else if (req.body.current.lessonType !== req.body.request.lessonType) {
    res.status(400).json({ error: 'Incompatible lessons to be swapped' });
  } else {
    await SwapModel.create(req.body)
      .then((data) =>
        data
          ? res.status(201).json(data.createResponse())
          : res.status(400).json({ msg: 'Cannot create swap' })
      )
      .catch((error) => next(createHttpError(400, error.message)));
  }
};
