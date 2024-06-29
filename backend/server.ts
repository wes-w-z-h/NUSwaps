import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import env from './util/validEnv.js';

const { PORT, CURR_ENV } = env;
const MONGO_CONNECTION_STRING: string =
  CURR_ENV === 'DEVELOPMENT' ? env.LOCAL_MONGO_URI : env.MONGO_URI;

mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => {
    app.listen(PORT, () => console.log('listening on port:', PORT));
  })
  .catch((error) => console.log(error));
