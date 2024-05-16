import { RequestHandler } from 'express';
import { SwapModel } from '../models/swapModel';

export const getSwaps: RequestHandler = async (req, res, next) => {
  try {
    // throw Error("pewpew");
    const data = await SwapModel.find({});
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await SwapModel.findById(id).exec();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await SwapModel.findByIdAndDelete(id).exec();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateSwap: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { userId, courseId, lessonType, current, request, status } = req.body;
  try {
    if (current.lessonType === request.lessonType) {
      const data = await SwapModel.findByIdAndUpdate(
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
      );
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: 'Incompatible lessons to be swapped.' });
    }
  } catch (error) {
    next(error);
  }
};

export const createSwap: RequestHandler = async (req, res, next) => {
  const { userId, courseId, lessonType, current, request, status } = req.body;
  try {
    if (current.lessonType === request.lessonType) {
      const data = await SwapModel.create({
        userId,
        courseId,
        lessonType,
        current,
        request,
        status,
      });
      res.status(201).json(data);
    } else {
      res.status(400).json({ error: 'Incompatible lessons to be swapped.' });
    }
  } catch (error) {
    next(error);
  }
};
