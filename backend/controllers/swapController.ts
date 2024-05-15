import { RequestHandler } from 'express';
import { SwapModel } from '../models/swapModel';

export const getSwaps: RequestHandler = async (_req, res, next) => {
  try {
    // throw Error("pewpew");
    const data = await SwapModel.find({});
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createSwap: RequestHandler = async (req, res, next) => {
  const {
    userId, courseId, lessonType, current, request, status,
  } = req.body;
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
      res.status(400).json({ error: 'Invalid lesson types' });
    }
  } catch (error) {
    next(error);
  }
};
