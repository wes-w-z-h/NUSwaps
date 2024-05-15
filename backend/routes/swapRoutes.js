import express from 'express';
import { Swap } from '../models/swapModel.js';
import { getHandler, postHandler } from '../controllers/requestHandlers.js';

const swapRouter = express.Router();

swapRouter.get('/', getHandler(Swap));

swapRouter.get('/:id', (req, res) => {
  res.json({ message: 'hello world' });
});

swapRouter.post(
  '/',
  postHandler(Swap, (field) => (field.current.lessonType === field.request.lessonType
    ? [true, '']
    : [false, `Invalid slot types: ${field.current.lessonType} & ${field.request.lessonType}`])),
);

swapRouter.delete('/', (req, res) => {});

export { swapRouter };
