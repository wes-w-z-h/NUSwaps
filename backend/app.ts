import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import createHttpError, { isHttpError } from 'http-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import userRouter from './routes/userRoute.js';
import swapRouter from './routes/swapRoute.js';
import matchRouter from './routes/matchRoute.js';
import authRouter from './routes/authRoute.js';

const app = express();

const loadMiddleware = () => {
  app.use(express.json());
  app.use(cookieParser()); // accepts cookie in req

  app.use(morgan('dev'));
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/swaps', swapRouter);
  app.use('/api/matches', matchRouter);
  app.get('/keep-alive', (req, res) => {
    res.status(200).json({ message: 'OK' });
  });
};

loadMiddleware();
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
  const __filename = fileURLToPath(import.meta.url);
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  const p = path.resolve(__dirname, '../../frontend/dist/', 'index.html');
  app.get('*', (req, res) => {
    res.sendFile(p);
  });
}

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
