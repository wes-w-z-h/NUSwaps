import express, { NextFunction, Request, Response } from 'express';
import userRouter from './routes/userRoute';
import swapRouter from './routes/swapRoute';

const app = express();

// accepts json body
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/users', userRouter);
app.use('/api/swaps', swapRouter);

// error handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMsg: string = 'Unknown error occured!';
  if (error instanceof Error) errorMsg = error.message;
  res.status(400).json({ error: errorMsg });
});

export default app;
