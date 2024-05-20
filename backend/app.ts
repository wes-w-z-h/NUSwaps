import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoute.js';
import swapRouter from './routes/swapRoute.js';
import matchRouter from './routes/matchRoute.js';

const app = express();

// accepts json body
app.use(express.json());

app.use(morgan('dev'));

app.use('/api/users', userRouter);
app.use('/api/swaps', swapRouter);
app.use('/api/matches', matchRouter);

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // console.log(error);
  let errorMsg: string = 'Unknown error occured!';
  if (error instanceof Error) errorMsg = error.message;
  res.status(400).json({ error: errorMsg });
});

export default app;
