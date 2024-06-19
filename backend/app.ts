import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createHttpError, { isHttpError } from 'http-errors';
import userRouter from './routes/userRoute.js';
import swapRouter from './routes/swapRoute.js';
import matchRouter from './routes/matchRoute.js';
import authRouter from './routes/authRoute.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// accepts json body
app.use(express.json());

app.use(cookieParser()); // accepts cookie in req

app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/swaps', swapRouter);
app.use('/api/matches', matchRouter);

app.use((req, res, next) => {
  next(createHttpError(404, 'Missing endpoint.'));
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // console.log(error);
  let errorMsg: string = 'Unknown error occured!';
  let status: number = 500;
  if (isHttpError(error)) {
    errorMsg = error.message;
    status = error.status;
  }
  res.status(status).json({ error: errorMsg });
});

export default app;
