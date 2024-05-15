import mongoose from 'mongoose';
import app from './app';
import 'dotenv/config';
import env from './util/validEnv';

const { PORT } = env;

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log('listening on port:', PORT));
  })
  .catch((error) => console.log(error));
