import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

const verifySwap: RequestHandler = async (req, res, next) => {
  const { courseId, lessonType, current, request } = req.body;

  if (!courseId || !lessonType || !current || !request) {
    next(createHttpError(400, 'Incomplete request body'));
    return;
  }

  next();
};

export default verifySwap;
