import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createHttpError, { isHttpError } from 'http-errors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoute.js';
import swapRouter from './routes/swapRoute.js';
import matchRouter from './routes/matchRoute.js';
import authRouter from './routes/authRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );

// accepts json body
app.use(express.json());

app.use(cookieParser()); // accepts cookie in req

app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/swaps', swapRouter);
app.use('/api/matches', matchRouter);

// use frontend routes
app.use(express.static(path.join(__dirname, '../frontend/dist')));
console.log(__dirname);
console.log(__dirname.substring(0, __dirname.length - 8));
const p = path.resolve(__dirname, '../frontend/dist/', 'index.html');
console.log(p);
app.get('*', (req, res) => {
  res.sendFile(p);
});

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
