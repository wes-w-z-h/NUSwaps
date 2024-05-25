import { RequestHandler } from 'express';
import { SwapModel } from '../models/swapModel.js';

export const getSwaps: RequestHandler = async (req, res, next) => {
  await SwapModel.find({})
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.map((d) => d.createResponse()))
        : res.status(404).json({ msg: 'No swaps.' })
    )
    .catch((error) => next(error));
};

export const getSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  await SwapModel.findById(id)
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'Swap not found.' })
    )
    .catch((error) => next(error));
};

export const deleteSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  await SwapModel.findByIdAndDelete(id)
    .exec()
    .then((data) =>
      data
        ? res.status(200).json(data.createResponse())
        : res.status(404).json({ msg: 'Swap not found.' })
    )
    .catch((error) => next(error));
};

export const updateSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { userId, courseId, lessonType, current, request, status } = req.body;
  if (current.lessonType === request.lessonType) {
    await SwapModel.findByIdAndUpdate(
      id,
      {
        userId,
        courseId,
        lessonType,
        current,
        request,
        status,
      },
      { new: true }
    )
      .exec()
      .then((data) =>
        data
          ? res.status(200).json(data.createResponse())
          : res.status(404).json({ msg: 'Swap not found.' })
      )
      .catch((error) => next(error));
  } else {
    res.status(400).json({ error: 'Incompatible lessons to be swapped.' });
  }
};

export const createSwap: RequestHandler = async (req, res, next) => {
  const { userId, courseId, lessonType, current, request, status } = req.body;

  if (current.lessonType === request.lessonType) {
    await SwapModel.create({
      userId,
      courseId,
      lessonType,
      current,
      request,
      status,
    })
      .then((resp) =>
        resp
          ? res.status(201).json(resp.createResponse())
          : res.status(404).json({ msg: 'Swap not found.' })
      )
      .catch((error) => next(error));
  } else {
    res.status(400).json({ error: 'Incompatible lessons to be swapped.' });
  }
};
